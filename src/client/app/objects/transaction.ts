import { Deposit } from "./deposit";
import { Category } from "./category";

export class Transaction{
    private id: number;
    private userId: string; // Given in database (cannot have transaction of other user (yet))
    private deposit: Deposit; 
    private date: Dayte;
    private payee: string;
    category: Category;
    memo: string;
    inflow: number;
    outflow: number;

    /*
    *   Only input required fields, other fields can be set via the object
    */
    constructor(id: number, deposit: Deposit, date: Dayte, payee: string, category: Category, memo: string, inflow: number, outflow: number){
        this.id = id;
        this.deposit = deposit;
        this.date = date;
        this.payee = payee;
        this.category = category;
        this.memo = memo;
        this.inflow = inflow;
        this.outflow = outflow;
    }

    public json(): any{
        return {
            id: this.id,
            deposit: this.deposit.name,
            date: this.date.toString(),
            payee: this.payee,
            categoryId: this.category.id,
            memo: this.memo,
            inflow: this.inflow,
            outflow: this.outflow
        }
    }

    public setDeposit(deposit: Deposit){ this.deposit = deposit; }
    public setDate(date: Dayte){ this.date = date; }
    public setPayee(payee: string){ this.payee = payee; }
    public setCategory(category: Category){ this.category = category; }
    public setMemo(memo: string){ this.memo = memo; }
    public setInflow(inflow: number){ 
        this.deposit.addBalance(-this.inflow || 0 + inflow);
        this.inflow = Number(inflow); 
    }
    public setOutflow(outflow: number){ 
        this.deposit.addBalance(this.outflow || 0 - outflow);
        this.outflow = Number(outflow); 
    }

    public getID(): number{ return this.id; }
    public getPayee(): string{ return this.payee; }
    public getDeposit(): Deposit{ return this.deposit; }
    public getDate(): Dayte{ return this.date; }
    public getCategory(): Category{ return this.category; }
    public getMemo(): string{ return this.memo; }

    public getInflow(): number{ return this.inflow; }


    public static sortByDate(a: Transaction, b: Transaction): number{
        return Math.sign((b.getDate().day + b.getDate().month*32 + b.getDate().year*13*32) - (a.getDate().day + a.getDate().month*32 + a.getDate().year*13*32));
    }
}


export class Dayte{
    year: number;
    month: number;
    day: number;

    constructor(year: number, month: number, day: number){
        this.year = year; 
        this.month = month;
        this.day = day;
    }
    static fromString(dateString: string): Dayte{
        const splitString = Array.from(dateString.split("-", 3), Number);
        return new Dayte(splitString[0], splitString[1], splitString[2]);
    }

    static fromDate(date: Date): Dayte{
        return new Dayte(date.getFullYear(), date.getMonth(), date.getUTCDate())
    }

    public toString(): string{
        return this.year.toString() + "-" + this.month.toString() + "-" + this.day.toString();
    }

    public dayOfWeek(): string{
        const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
        return days[new Date(this.toString()).getDay()] || '';
    }
}