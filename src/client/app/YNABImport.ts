import assert from "assert";
import { parse } from "path";
import * as db from "./db";
import { Dayte } from "./objects/transaction";

export function importYNAB(budgetsFile: any, registerFile: any){
    importTransactions(registerFile).then(() => {
        console.log("Imported Transactions!");
    })
}

// Import Transactions
export async function importTransactions(registerFile: any){
    console.log("importTransaction");
    let registerReader = new FileReader();
    registerReader.readAsText(registerFile, "UTF-8");
    registerReader.onload =  async evt => {
        assert(evt.target);
        let register = evt.target.result;
        if(typeof register !== 'string'){
            register = String.fromCharCode.apply(evt.target.result);
        }
        if(typeof register === 'string'){
            const registerJson = tsvJSON(register);
            console.log(registerJson);
            const biggestSize = {
                account: 0,
                date: 0,
                payee: 0,
                categoryGroup: 0,
                category: 0,
                memo: 0,
                inflow: 0,
                outflow: 0
            }
            for(const transactionKey in registerJson){
                const YNABTran = registerJson[transactionKey];
                biggestSize.account = Math.max(String(YNABTran.Account).length, biggestSize.account);
                biggestSize.date = Math.max(String(formatDate(YNABTran.Date)).length, biggestSize.date);
                biggestSize.payee = Math.max(String(YNABTran.Payee).length, biggestSize.payee);
                biggestSize.categoryGroup = Math.max(String(YNABTran['Category Group']).length, biggestSize.categoryGroup);
                biggestSize.category = Math.max(String(YNABTran.Category).length, biggestSize.category);
                biggestSize.memo = Math.max(String(YNABTran.Memo).length, biggestSize.memo);
                biggestSize.inflow = Math.max(String(YNABTran.Inflow).length, biggestSize.inflow);
                biggestSize.outflow = Math.max(String(YNABTran.Outflow).length, biggestSize.outflow);

                await db.addTransactionFromStrings(YNABTran.Account, formatDate(YNABTran.Date), YNABTran.Payee, YNABTran['Category Group'], YNABTran.Category, YNABTran.Memo, YNABTran.Inflow, YNABTran.Outflow);
            }
        }       
    }
    registerReader.onerror = evt => {
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