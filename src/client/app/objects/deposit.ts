import { Transaction } from "./transaction";

export class Deposit{

    readonly id?: number;
    readonly name: string;
    private transactions: Map<number, Transaction>;
    private balance: number;

    constructor(id: number, name:string) { 
        this.id = id;
        this.name = name;
        this.balance = 0;
    }  

    public static createWithTransactions(name: string, transactions: Map<number, Transaction>): Deposit{
        const deposit = new Deposit(-1, name);
        deposit.setTransactions(transactions);
        return deposit;        
    }

    public addTransaction(transaction: Transaction){
        this.balance += transaction.inflow;
        this.balance -= transaction.outflow;
        if(this.transactions === undefined){
            this.transactions = new Map();
        }
        this.transactions.set(transaction.getID(), transaction);
    }

    public setTransactions(transactions: Map<number, Transaction>){
        this.transactions = transactions;
        this.calculateBalance();
    }

    private calculateBalance(): void{
        this.balance = 0;
        this.transactions.forEach((transaction: Transaction) => {
            this.balance += transaction.inflow;
            this.balance -= transaction.outflow;
        });
    }

    public addBalance(add: number){
        this.balance += add;
    }

    public getBalance(): number{
        return this.balance;
    }

    public removeTransaction(id: number){
        const transaction = this.transactions.get(id);
        if(transaction){
            this.balance -= transaction.inflow;
            this.balance += transaction.outflow;
            this.transactions.delete(id);
        }else{
            throw new Error(`cannot find transaction with id: ${id}`);
        }
    }

    public getTransactions(): Transaction[]{
        return Array.from(this.transactions.values());
    }
}