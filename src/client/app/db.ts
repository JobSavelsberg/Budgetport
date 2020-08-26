import axios from "axios";
import { Transaction, Dayte } from "./objects/transaction";
import { Category, CategoryGroup } from "./objects/category";
import { Budget, Month } from "./objects/budget";
import assert from "assert";
import { Deposit } from "./objects/deposit";

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
    }else if(!deposit){
        throw new Error(`Deposit does not exist on transaction with id: ${id}, deposit id: ${deposit_id}`);
    }else if(!category){
        throw new Error(`Category does not exist on transaction with id: ${id}, category id: ${category_id}`);
    }
};

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

export function getTransactions(depositId: number): Transaction[]{
    const deposit = deposits.get(Number(depositId));
    assert(deposit);
    return deposit.getTransactions();
}

export function getCategory(categoryId: number): Category{
    const category = categories.get(categoryId);
    assert(category);
    return category;
}