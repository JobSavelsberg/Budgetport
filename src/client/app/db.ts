import axios from "axios";
import { Transaction, Dayte } from "./objects/transaction";
import { Category, CategoryGroup } from "./objects/category";
import { Budget, Month } from "./objects/budget";
import assert, { rejects } from "assert";
import { Deposit } from "./objects/deposit";
import e from "express";
import { moveMessagePortToContext } from "worker_threads";
import Money from "./objects/money";

/**
 *  Used to keep track of all database objects, transactions budgets, categories.
 *  Edits to these objects are all done via functions that also update the databse. 
 */


const port = process.env.VUE_APP_SERVER_PORT || 5000;
const url = process.env.VUE_APP_HOST_URL || "http://localhost" + ":" + port + "/api";

let api;

let loaded = false;

const categoryGroups: CategoryGroup[] = [];
const categories: Map<number, Category> = new Map();

const allTransactions: Map<number, Transaction> = new Map();
const deposits: Map<number, Deposit> = new Map();
let allDeposit: Deposit;

const budgets: Map<number, Budget> = new Map();

const payees: Map<string, number> = new Map();

const preferences: Map<string, any> = new Map();

export async function auth(currentUser, idToken) {
    api = axios.create({
        baseURL: url,
        withCredentials: false,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "AuthToken": idToken
        },
    });
}

/**
 * Import categories and deposits in parallel, and then transactions and budgets in parallel
 */
export async function load() {
    api.get("/preferences/").then((preferencesRes: any) => {
        const preferencesData = preferencesRes.data;
        preferencesData.forEach((d: any) => {
            preferences.set(d.key, d.value);
        });
    });
    const getCategories = api.get("/categories/").then((categoriesRes: any) => {
        const categoriesData = categoriesRes.data;
        categoriesData.forEach((c: any) => {
            importCategory(c.id, c.category_group, c.category, c.color);
        });
    });
    const getDeposits = api.get("/deposits/").then((depositsRes: any) => {
        const depositsData = depositsRes.data;
        depositsData.forEach((d: any) => {
            importDeposit(d.id, d.name);
        });
    });
    return Promise.all([getCategories, getDeposits]).then(() => {
        const getTransactions = api.get("/transactions/").then((transactionsRes: any) => {
            const transactionsData = transactionsRes.data;
            transactionsData.forEach((t: any) => {
                importTransaction(t.id, t.deposit_id, t.date, t.payee, t.category_id, t.memo, Money.fromString(t.inflow), Money.fromString(t.outflow));
            });
        });
        const getBudgets = api.get("/budgets/").then((budgetsRes: any) => {
            const budgetsData = budgetsRes.data;
            budgetsData.forEach((b: any) => {
                importBudget(b.id, b.month, b.category_id, Money.fromString(b.budgeted));
            });
        });
        return Promise.all([getTransactions, getBudgets]).then(() => {
            allDeposit = Deposit.createWithTransactions("All", allTransactions);
            checkLoadedPreferences();
            loaded = true;
        });
    });
}

/*
*  Create Category (and its group) retrieved from db and add it to the list of categories
*/
function importCategory(id: number, groupName: string, name: string, color: string): Category {
    let category;
    categoryGroups.forEach((categoryGroup: CategoryGroup): Category | undefined => {
        categoryGroup.categories.forEach((category: Category): Category | undefined => {
            if (name === category.name && groupName === categoryGroup.name) return category;
            return;
        });
        if (groupName === categoryGroup.name) {
            category = new Category(id, name, categoryGroup, color);
            categories.set(id, category);
            categoryGroup.addCategory(category);
            return category;
        }
        return;
    })
    if (!category) {
        const categoryGroup = new CategoryGroup(groupName);
        categoryGroups.push(categoryGroup);
        category = new Category(id, name, categoryGroup, color);
        categories.set(id, category);
        categoryGroup.addCategory(category);
    }
    return category;
}
async function ensureCategory(categoryGroupName: string, categoryName: string): Promise<Category> {
    for (const categoryGroup of categoryGroups) {
        if (categoryGroupName === categoryGroup.name) {
            for (const category of categoryGroup.categories) {
                if (categoryName === category.name) return category;
            }
            return addCategory(categoryGroupName, categoryName, undefined, categoryGroup);
        }
    }
    return addCategory(categoryGroupName, categoryName);
}

export async function addCategory(categoryGroupName: string, categoryName: string, categoryColor?: string, categoryGroup?: CategoryGroup) {
    let color = categoryColor || Category.getRandomColor().substring(1);
    if (color[0] === '#') {
        color = color.substring(1);
    }
    const categoryJson = {
        categoryGroup: categoryGroupName,
        category: categoryName,
        color: color
    };
    return api.post("/categories/", categoryJson).then((categoryRes: any): Category => {
        const id = categoryRes.data[0].id;
        assert(id);
        let category;
        if (categoryGroup) {
            category = new Category(id, categoryName, categoryGroup, color);
        } else {
            categoryGroup = new CategoryGroup(categoryGroupName);
            categoryGroups.push(categoryGroup);
            category = new Category(id, categoryName, categoryGroup, color);
        }
        categoryGroup.addCategory(category);
        categories.set(id, category);
        return category;
    });
}

export function addCategoryGroup(categoryGroupName: string) {
    categoryGroups.push(new CategoryGroup(categoryGroupName));
    console.log(categoryGroups);
}

/*
*  Create Deposit retrieved from db and add it to the list of deposits
*/
function importDeposit(id: number, name: string): Deposit {
    const deposit = new Deposit(id, name);
    deposits.set(id, deposit);
    return deposit;
}
async function ensureDeposit(depositName: string): Promise<Deposit> {
    let ensuredDeposit;
    deposits.forEach((deposit: Deposit) => {
        if (depositName === deposit.name) ensuredDeposit = deposit;
    })
    if (ensuredDeposit) return ensuredDeposit;
    return addDeposit(depositName);
}
async function addDeposit(name: string): Promise<Deposit> {
    const depositJson = {
        name: name,
    };
    return api.post("/deposits/", depositJson).then((depositRes: any): Deposit => {
        const id = depositRes.data[0].id;
        assert(id);
        const deposit = new Deposit(id, name);
        deposits.set(id, deposit);
        return deposit;
    });
}
/*
*  Create Transaction retrieved from db and add it to the list of transactions
*/
function importTransaction(id: number, deposit_id: number, date: string, payee: string, category_id: number, memo: string, inflow: Money, outflow: Money) {
    const deposit = deposits.get(deposit_id);
    const category = categories.get(category_id);
    if (deposit && category) {
        const transaction = new Transaction(id, deposit, Dayte.fromString(date), payee, category, memo, inflow, outflow);
        allTransactions.set(id, transaction);
        deposit.addTransaction(transaction);
        addPayee(payee);
    } else if (!deposit) {
        throw new Error(`Deposit does not exist on transaction with id: ${id}, deposit id: ${deposit_id}`);
    } else if (!category) {
        throw new Error(`Category does not exist on transaction with id: ${id}, category id: ${category_id}`);
    }
}

export async function addTransactionFromStrings(deposit: string, date: string, payee: string, categoryGroup: string, category: string, memo: string, inflow: string, outflow: string): Promise<Transaction> {
    return Promise.all([ensureDeposit(deposit), ensureCategory(categoryGroup, category)]).then(([deposit, category]): Promise<Transaction> => {
        assert(deposit.id);
        assert(category.id);
        const inflowNumber = parseFloat(inflow.replace(',', '.').replace(' ', ''));
        const outflowNumber = parseFloat(outflow.replace(',', '.').replace(' ', ''));
        const inflowMoney = Money.fromNumber(inflowNumber);
        const outflowMoney = Money.fromNumber(outflowNumber);
        console.log("inflow", inflowMoney);
        console.log("outflow", outflowMoney);
        return addTransaction(deposit.id, date, payee, category.id, memo, inflowMoney, outflowMoney);
    });
}

/**
 * Create Transaction and make sure the database is up to date
 */
export async function addTransaction(deposit_id: number, date: string, payee: string, category_id: number, memo: string, inflow: Money, outflow: Money): Promise<Transaction> {
    const deposit = deposits.get(deposit_id);
    const category = categories.get(category_id);
    console.log("Inflow should be Money", inflow);
    if (deposit && category) {
        if (inflow.greaterThan(Money.ZERO()) && outflow.greaterThan(Money.ZERO())) throw new Error('Both inflow and outflow are set');
        const transaction = {
            depositId: deposit.id,
            date: date,
            payee: payee,
            categoryId: category.id,
            memo: memo,
            inflow: inflow.toNumber(),
            outflow: outflow.toNumber()
        }
        return api.post("/transactions/", transaction).then((transactionsRes: any): Transaction => {
            const id = transactionsRes.data[0].id;
            assert(id);
            const transaction = new Transaction(id, deposit, Dayte.fromString(date), payee, category, memo, inflow, outflow);
            allTransactions.set(id, transaction);
            deposit.addTransaction(transaction);
            addPayee(payee);
            return transaction;
        });
    } else if (!deposit) {
        throw new Error(`Deposit does not exist; deposit id: ${deposit_id}`);
    } else if (!category) {
        throw new Error(`Category does not exist; category id: ${category_id}`);
    }
    throw new Error("couldn't create transaction");
}

export async function createDepositWithStartingBalance(name: string, amount: string) {
    return ensureDeposit(name).then(() => {
        const amountNumber = parseFloat(amount.replace(',', '.').replace(' ', ''));
        if (amountNumber !== 0) {
            const date = new Date()
            return addTransactionFromStrings(name, `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, 'Starting Balance', "To be Budgeted", "To be Budgeted", `${name}: Starting Balance`, amount, "0");
        }
        return null;
    })
}

export async function deleteTransaction(id: number) {
    const transaction = allTransactions.get(id);
    assert(transaction);
    const deposit = transaction.getDeposit();
    deposit.removeTransaction(id);
    allTransactions.delete(id);
    return api.delete(`/transactions/${id}`);
}

function addPayee(payee: string) {
    if (payee) {
        const payeeEntry = payees.get(payee);
        if (payeeEntry) {
            payees.set(payee, payeeEntry + 1);
        } else {
            payees.set(payee, 1);
        }
    }
}
/*
*  Create Budget retrieved from db and add it to the list of budgets
*/
function importBudget(budgetId: number, month: string, categoryId: number, budgeted: Money): Budget {
    const category = categories.get(categoryId);
    assert(category, `budget contains unknown categoryId: ${categoryId}`);
    const budget = new Budget(budgetId, Month.fromString(month), category, budgeted);
    budgets.set(budgetId, budget);
    return budget;
}
/**
 * Create Budget and make sure the database is up to date
 */
async function addBudget(month: Month, category: Category, budgeted?: Money): Promise<Budget> {
    console.log(month, category, budgeted);
    const budgetJson = {
        month: month.getString(),
        categoryId: category.id,
        budgeted: budgeted ? budgeted.toNumber() : 0
    }
    console.log(budgetJson);

    return api.post("/budgets/", budgetJson).then((budgetRes: any): Budget => {
        const id = budgetRes.data[0].id;
        assert(id);
        const budget = new Budget(id, month, category, budgeted || Money.ZERO());
        budgets.set(id, budget);
        return budget;
    });
}
export async function addBudgetFromStrings(monthString: string, categoryGroup: string, category: string, budgeted: string): Promise<Budget> {
    return ensureCategory(categoryGroup, category).then((category): Promise<Budget> => {
        assert(category.id);
        const parsedBudgeted = parseFloat(budgeted.replace(',', '.').replace(' ', ''));
        return addBudget(Month.fromString(monthString), category, Money.fromNumber(parsedBudgeted));
    });
}
export async function updateBudget(id: number, monthString: string, category_id: number, budgeted: number) {
    const budgetJson = {
        month: monthString,
        categoryId: category_id,
        budgeted: budgeted
    }
    return api.put(`/budgets/${id}`, budgetJson).then((res) => {
        console.log(res);
    });
}


export function getTransactions(depositId: number): Transaction[] {
    if (depositId < 0) {
        return Array.from(allTransactions.values());
    }
    const deposit = deposits.get(Number(depositId));
    assert(deposit);
    return deposit.getTransactions();
}
export function getTransactionsSorted(depositId: number): Transaction[] {
    let transactions;
    if (depositId < 0) {
        transactions = Array.from(allTransactions.values());
    } else {
        const deposit = deposits.get(depositId);
        assert(deposit, "No deposit found");
        transactions = deposit.getTransactions();
    }
    return transactions.sort(Transaction.sortByDate);
}

export function getCategoryGroups(): CategoryGroup[] {
    return categoryGroups;
}
export function getCategories(): Category[] {
    return Array.from(categories.values());
}
export function getCategory(categoryId: number): Category {
    const category = categories.get(categoryId);
    assert(category);
    return category;
}

export function getPayees(): string[] {
    const payeesArraySortedByFrequency: any[] = [];
    payees.forEach((frequency: number, payee: string) => {
        const entry = { frequency: frequency, payee: payee };
        payeesArraySortedByFrequency.push(entry);
    });
    payeesArraySortedByFrequency.sort((a: any, b: any) => {
        return b.frequency - a.frequency;
    })
    return payeesArraySortedByFrequency.map((entry: any) => { return entry.payee });
}


export async function ensureBudgets(month: Month) {
    const monthBudgets: Budget[] = [];
    budgets.forEach((budget: Budget) => {
        if (budget.month.equals(month)) {
            monthBudgets.push(budget);
        }
    })
    const addPromises: Promise<Budget>[] = []
    categories.forEach(async (category: Category) => {
        // If category can find no budget that represents it, create a new budget with that category
        if (monthBudgets.every((monthBudget: Budget) => {
            return monthBudget.category !== category;
        })) {
            addPromises.push(addBudget(month, category));
        }
    })
    return Promise.all(addPromises);
}

/**
 * Get budgets for a specific month, if not all budgets have been created, new budgets will be made and synced with db
 * @param month
 */
export function getBudgets(month: Month): Budget[] {
    const monthBudgets: Budget[] = [];
    budgets.forEach((budget: Budget) => {
        if (budget.month.equals(month)) {
            monthBudgets.push(budget);
        }
    })
    return monthBudgets;
}
export function getBudgetById(id: number): Budget {
    const budget = budgets.get(id);
    if (budget) {
        return budget;
    } else {
        throw new Error(`no budget with id ${id} found`);
    }
}

export function getAllTransactions(): Transaction[] {
    return Array.from(allTransactions.values());
}

export function getAllBudgets(): Budget[] {
    return Array.from(budgets.values());
}

export function getDeposits(): Deposit[] {
    return Array.from(deposits.values());
}

export function getTotalBalance(): Money {
    const sum = Money.ZERO();
    deposits.forEach((deposit: Deposit) => {
        sum.increase(deposit.getBalance());
    })
    return sum;
}

export function getPreference(key): any {
    console.log("Getting key value: ", key, preferences.get(key))
    return preferences.get(key);
}
export function setPreference(key, value) {
    if (preferences.get(key)) {
        api.put(`/preferences/${key}`, value).then((res) => {
            console.log(res);
        });
    } else {
        api.post(`/preferences/`, { key, value }).then((res) => {
            console.log(res);
        });
    }
    preferences.set(key, value)
}

function checkLoadedPreferences() {
    if (!preferences.get('categoryOrder')) {
        const categoryOrder: number[] = [];
        categoryGroups.forEach((categoryGroup: CategoryGroup) => {
            categoryGroup.categories.forEach((category: Category) => {
                categoryOrder.push(category.id);
            })
        })
        setPreference('categoryOrder', categoryOrder)
    }
}

export function toBeBudgeted(month: Month) {
    const toBeBudgetedTransactions = Array.from(allTransactions.values()).filter(transaction => transaction.category.isToBeBudgeted())
    const inflow = toBeBudgetedTransactions.reduce((sum, transaction) => { return sum.plus(transaction.getInflow()) }, Money.ZERO())
    const totalBudgeted = Array.from(budgets.values()).reduce((sum, budget) => {
        return sum.plus(budget.budgeted);
    }, Money.ZERO());
    console.log(inflow);
    console.log(totalBudgeted);
    // all to be budgeted inflow - all budgeted money
    return inflow.minus(totalBudgeted);
}