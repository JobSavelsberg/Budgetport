import Money from "./money";
import { Transaction } from "./transaction";

export class Deposit{

    readonly id?: number;
    readonly name: string;
    private transactions: Map<number, Transaction>;
    private balance: Money;

    constructor(id: number, name:string) { 
        this.id = id;
        this.name = name;
        this.balance = Money.ZERO();
    }  

    public static createWithTransactions(name: string, transactions: Map<number, Transaction>): Deposit{
        const deposit = new Deposit(-1, name);
        deposit.setTransactions(transactions);
        return deposit;        
    }

    public addTransaction(transaction: Transaction){
        this.balance.increase(transaction.inflow);
        this.balance.decrease(transaction.outflow);
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
        this.balance = Money.ZERO();
        this.transactions.forEach((transaction: Transaction) => {
            this.balance.increase(transaction.inflow);
            this.balance.decrease(transaction.outflow);
        });
    }

    public addBalance(add: Money){
        this.balance.increase(add);
    }

    public getBalance(): Money{
        return this.balance;
    }

    public removeTransaction(id: number){
        const transaction = this.transactions.get(id);
        if(transaction){
            this.balance.decrease(transaction.inflow);
            this.balance.increase(transaction.outflow);
            this.transactions.delete(id);
        }else{
            throw new Error(`cannot find transaction with id: ${id}`);
        }
    }

    public getTransactions(): Transaction[]{
        return Array.from(this.transactions.values());
    }
}