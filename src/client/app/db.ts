import axios from "axios";
import { Transaction, Dayte } from "./objects/transaction";
import { Category, CategoryGroup } from "./objects/category";
import { Budget, Month } from "./objects/budget";
import assert from "assert";
import { Deposit } from "./objects/deposit";
import e from "express";
import { moveMessagePortToContext } from "worker_threads";

/**
 *  Used to keep track of all database objects, transactions budgets, categories.
 *  Edits to these objects are all done via functions that also update the databse. 
 */


const port = process.env.SERVER_PORT || 5000;
const url = process.env.HOST_URL || "http://localhost" + ":" + port + "/api";

const api = axios.create({
    baseURL: url,
    withCredentials: false,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    params:{
        userId: 1
    }
});

let loaded = false;

const categoryGroups: CategoryGroup[] = [];
const categories: Map<number, Category> = new Map();

const allTransactions: Map<number, Transaction> = new Map();
const deposits: Map<number, Deposit>= new Map();
let allDeposit: Deposit;

const budgets: Map<number, Budget> = new Map();

const payees: Map<string, number> = new Map();

/**
 * Import categories and deposits in parallel, and then transactions and budgets in parallel
 */
export async function load(){
    const getCategories =  api.get("/categories/").then((categoriesRes: any) => {
        const categoriesData = categoriesRes.data;
        categoriesData.forEach((c: any) => {
            importCategory(c.id, c.category_group, c.category, c.color);
        });
    });
    const getDeposits =  api.get("/deposits/").then((depositsRes: any) => {
        const depositsData = depositsRes.data;
        depositsData.forEach((d: any) => {
            importDeposit(d.id, d.name);
        });
    });
    return Promise.all([getCategories, getDeposits]).then(() => {
        const getTransactions = api.get("/transactions/").then((transactionsRes: any)=>{
            const transactionsData = transactionsRes.data;
            transactionsData.forEach((t: any) => {
                importTransaction(t.id, t.deposit_id, t.date, t.payee, t.category_id, t.memo, t.inflow, t.outflow);
            });
        });
        const getBudgets = api.get("/budgets/").then((budgetsRes: any)=>{
            const budgetsData = budgetsRes.data;
            budgetsData.forEach((b: any) => {
                importBudget(b.id, b.month, b.category_id, b.budgeted);
            });
        });
        return Promise.all([getTransactions, getBudgets]).then(()=>{
            allDeposit = Deposit.createWithTransactions("All", allTransactions);
            loaded = true;
        });
    });
}

/*
*  Create Category (and its group) retrieved from db and add it to the list of categories
*/
function importCategory(id: number, groupName: string, name: string, color: string): Category{
    let category;
    categoryGroups.forEach((categoryGroup: CategoryGroup): Category | undefined => {
        categoryGroup.categories.forEach((category: Category): Category | undefined=> {
            if(name === category.name && groupName === categoryGroup.name) return category;
            return;
        });
        if(groupName === categoryGroup.name){
            category = new Category(id, name, categoryGroup, color);
            categories.set(id, category);
            categoryGroup.addCategory(category);
            return category;
        }
        return;
    })
    if(!category){
        const categoryGroup = new CategoryGroup(groupName);
        categoryGroups.push(categoryGroup);
        category = new Category(id, name, categoryGroup, color);
        categories.set(id, category);
        categoryGroup.addCategory(category);
    }
    return category;
};

/*
*  Create Deposit retrieved from db and add it to the list of deposits
*/
function importDeposit(id: number, name: string): Deposit{
    const deposit = new Deposit(id, name);
    deposits.set(id, deposit);
    return deposit;
};

/*
*  Create Transaction retrieved from db and add it to the list of transactions
*/
function importTransaction(id: number, deposit_id: number, date: string, payee: string, category_id: number, memo: string, inflow: number, outflow: number){
    const deposit = deposits.get(deposit_id);
    const category = categories.get(category_id);
    if(deposit && category){
        const transaction = new Transaction(id, deposit, Dayte.fromString(date), payee, category, memo, inflow, outflow);
        allTransactions.set(id, transaction);
        deposit.addTransaction(transaction);
        addPayee(payee);
    }else if(!deposit){
        throw new Error(`Deposit does not exist on transaction with id: ${id}, deposit id: ${deposit_id}`);
    }else if(!category){
        throw new Error(`Category does not exist on transaction with id: ${id}, category id: ${category_id}`);
    }
};
/**
 * Create Transaction and make sure the database is up to date
 */
export async function addTransaction(deposit_id: number, date: string, payee: string, category_id: number, memo: string, inflow: number, outflow: number){
    const deposit = deposits.get(deposit_id);
    const category = categories.get(category_id);
    if(deposit && category){
        if(inflow && outflow) throw new Error('Both inflow and outflow are set');
        const transaction = {
            depositId: deposit.id,
            date: date,
            payee: payee,
            categoryId: category.id,
            memo: memo,
            inflow: Number(inflow),
            outflow: Number(outflow)
        }
        await api.post("/transactions/", transaction).then((transactionsRes: any)=>{
            const id = transactionsRes.data[0].id;
            assert(id);
            const transaction = new Transaction(id, deposit, Dayte.fromString(date), payee, category, memo, inflow, outflow);
            allTransactions.set(id, transaction);
            deposit.addTransaction(transaction);
            addPayee(payee);
        });
    }else if(!deposit){
        throw new Error(`Deposit does not exist; deposit id: ${deposit_id}`);
    }else if(!category){
        throw new Error(`Category does not exist; category id: ${category_id}`);
    }
}

export async function deleteTransaction(id: number){
    const transaction = allTransactions.get(id);
    assert(transaction);
    const deposit = transaction.getDeposit();
    deposit.removeTransaction(id);
    allTransactions.delete(id);
    return api.delete(`/transactions/${id}`);
}

function addPayee(payee: string){
    if(payee){
        const payeeEntry = payees.get(payee);
        if(payeeEntry){
            payees.set(payee,payeeEntry+1);
        }else{
            payees.set(payee,1);
        }
    }
}
/*
*  Create Budget retrieved from db and add it to the list of budgets
*/
function importBudget(budgetId: number, month: string, categoryId: number, budgeted: number): Budget{
    let budget;
    const category = categories.get(categoryId);
    assert(category, `budget contains unknown categoryId: ${categoryId}`);
    budget = new Budget(budgetId, Month.fromString(month), category, budgeted);
    budgets.set(budgetId, budget);
    return budget;
};
/**
 * Create Budget and make sure the database is up to date
 */
async function addBudget(month: Month, category: Category){
    const budgetJson = {
        month: month.getString(),
        categoryId: category.id,
        budgeted: 0
    };
    await api.post("/budgets/", budgetJson).then((budgetRes: any)=>{
        const id = budgetRes.data[0].id;
        assert(id);
        const budget = new Budget(id, month, category, 0);
        budgets.set(id, budget);
    });
}




export function getTransactions(depositId: number): Transaction[]{
    const deposit = deposits.get(Number(depositId));
    assert(deposit);
    return deposit.getTransactions();
}
export function getTransactionsSorted(depositId: number): Transaction[]{
    const deposit = deposits.get(depositId);
    assert(deposit, "No deposit found");
    const transactions = deposit.getTransactions();
    return transactions.sort(Transaction.sortByDate);
}

export function getCategories(): Category[]{
    return Array.from(categories.values());
}
export function getCategory(categoryId: number): Category{
    const category = categories.get(categoryId);
    assert(category);
    return category;
}

export function getPayees(): string[] {
    const payeesArraySortedByFrequency: any[] = [];
    payees.forEach((frequency: number, payee:string)=>{
        const entry = {frequency: frequency, payee: payee};
        payeesArraySortedByFrequency.push(entry);
    });
    payeesArraySortedByFrequency.sort((a: any,b: any) => {
        return b.frequency - a.frequency;
    })
    return payeesArraySortedByFrequency.map((entry: any) => { return entry.payee });
}


export async function ensureBudgets(month: Month){
    const monthBudgets: Budget[] = [];
    budgets.forEach((budget: Budget) => {
        if(budget.month.equals(month)){
            monthBudgets.push(budget);
        }
    })
    const addPromises: Promise<void>[] = []
    categories.forEach(async (category: Category) => {
        // If category can find no budget that represents it, create a new budget with that category
        if(monthBudgets.every((monthBudget: Budget)=>{
            return monthBudget.category !== category;
        })){
            addPromises.push(addBudget(month, category));
        }
    })
    return Promise.all(addPromises);
}

/**
 * Get budgets for a specific month, if not all budgets have been created, new budgets will be made and synced with db
 * @param month
 */
export function getBudgets(month: Month): Budget[]{
    const monthBudgets: Budget[] = [];
    budgets.forEach((budget: Budget) => {
        if(budget.month.equals(month)){
            monthBudgets.push(budget);
        }
    })
    return monthBudgets;
}

export function getAllTransactions(): Transaction[]{
    return Array.from(allTransactions.values());
}

export function getAllBudgets(): Budget[]{
    return Array.from(budgets.values());
}