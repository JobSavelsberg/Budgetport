import assert from "assert";
import { parse } from "path";
import * as db from "./db";
import { Month } from "./objects/budget";
import { Dayte } from "./objects/transaction";

export function importYNAB(budgetsFile: any, registerFile: any){
    importTransactions(registerFile).then(() => {
        console.log("Imported Transactions!");
    })
    importBudgets(budgetsFile).then(() => {
        console.log("Imported Budgets!");
    })
}

// Import Transactions
export async function importTransactions(registerFile: any){
    console.log("importTransaction");
    const registerReader = new FileReader();
    registerReader.readAsText(registerFile, "UTF-8");
    registerReader.onload =  async evt => {
        assert(evt.target);
        let register = evt.target.result;
        if(typeof register !== 'string'){
            register = String.fromCharCode.apply(evt.target.result);
        }
        if(typeof register === 'string'){
            const registerJson = tsvJSON(register);
            for(const transactionKey in registerJson){
                const YNABTran = registerJson[transactionKey];
                let catGroup = YNABTran['Category Group'];
                let cat = YNABTran.Category;
                if(catGroup === "" && cat === ""){
                    catGroup = "Transfer"
                    cat = "Transfer"
                }
                await db.addTransactionFromStrings(YNABTran.Account, formatDate(YNABTran.Date), YNABTran.Payee, catGroup, cat, YNABTran.Memo, YNABTran.Inflow, YNABTran.Outflow);
            }
        }       
    }
    registerReader.onerror = evt => {
      console.error(evt);
    }
}

// Import Budgets
export async function importBudgets(budgetsFile: any){
    console.log("importTransaction");
    const budgetsReader = new FileReader();
    budgetsReader.readAsText(budgetsFile, "UTF-8");
    budgetsReader.onload =  async evt => {
        assert(evt.target);
        let budgets = evt.target.result;
        if(typeof budgets !== 'string'){
            budgets = String.fromCharCode.apply(evt.target.result);
        }
        if(typeof budgets === 'string'){
            const budgetsJson = tsvJSON(budgets);
            for(const budgetKey in budgetsJson){
                const YNABBudget = budgetsJson[budgetKey];
                await db.addBudgetFromStrings(formatMonth(YNABBudget.Month), YNABBudget["Category Group"], YNABBudget.Category, YNABBudget.Budgeted);
                // YNABBudget.Available can be checked
                // YNABBudget.Activity can be checked
            }
        }       
    }
    budgetsReader.onerror = evt => {
      console.error(evt);
    }
}


function tsvJSON(tsv: string): any {
    const lines = tsv.split('\n');
    assert(lines);
    const shifted = lines.shift();
    assert(shifted);
    const headers = shifted.split('\t');
    headers.forEach((part: any, index: number) => {
        headers[index] = part.slice(1,-1);
      }, headers); // use arr as this
    return lines.map(line => {
        const data = line.split('\t');
        return headers.reduce((obj: any, nextKey, index) => {
            if(data[index].substr(0,1) === "\""){
                obj[nextKey] = data[index].slice(1,-1);
            }else{
                obj[nextKey] = data[index];
            }
            return obj;
        }, {});
    });
}

function formatDate(YNABDate: string): string{
    const splitString = Array.from(YNABDate.split("/", 3), Number);
    return new Dayte(splitString[2], splitString[1], splitString[0]).toString();
}

function formatMonth(YNABMonth: string): string{
    const date = new Date(YNABMonth);
    return new Month(date.getFullYear(), date.getMonth()+1).getString();
}