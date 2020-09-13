import assert from "assert";
import { Category, CategoryGroup } from "./category";
import Money from "./money";
import { Transaction } from "./transaction";

export class Month{
    year: number;
    month: number; // Stored as Jan = 1

    constructor(year: number, month: number){
        this.year = year;
        this.month = month;
    }

    public static fromString(monthString: string): Month{
        const splitString = Array.from(monthString.split("-", 2), Number);
        return new Month(splitString[0], splitString[1]);
    }

    public getString(): string{
        return this.year+"-"+this.month;
    }

    public static now(): Month{
        const today = new Date();
        return new Month(today.getFullYear(),  today.getMonth()+1);
    }

    public equals(month: Month): boolean{
        return this.year === month.year && this.month === month.month;
    }

}

export function currentMonth(): Month{
    return Month.now();
}

export class Budget{
    id: number;
    month: Month;
    category: Category;
    budgeted: Money;

    constructor(id: number, month: Month, category: Category, budgeted: Money){
        this.id = id;
        this.month = month;
        this.category = category;
        this.budgeted = budgeted;
    }

    public getActivity(allTransactions: Transaction[]): Money{
        const activity = Money.ZERO();
        this.getActivityTransactions(allTransactions).forEach((transaction: Transaction) => {
            activity.increase(transaction.inflow.minus(transaction.outflow));
        });
        return activity;
    }

    public getActivityTransactions(allTransactions: Transaction[]): Transaction[]{
        return allTransactions.filter((transaction: Transaction) => { 
            return transaction.getDate().year === this.month.year && 
                transaction.getDate().month === this.month.month && 
                transaction.getCategory() === this.category;
        })
    }

    public getAvailable(budgets: Budget[], allTransactions: Transaction[]): Money{
        const available = Money.ZERO();
        budgets.forEach((budget:Budget) => {
            if(budget.category === this.category && budget.month.year <= this.month.year && budget.month.month <= this.month.month){
                available.increase(budget.budgeted);
            }
        })
        allTransactions.forEach((transaction: Transaction) => { 
            if(transaction.getDate().year <= this.month.year && 
                transaction.getDate().month <= this.month.month && 
                transaction.getCategory() === this.category){
                available.increase(transaction.inflow.minus(transaction.outflow));
            }
        })
        return available;
    }

    public json(): any{
        return {
            id: this.id,
            year: this.month.year,
            month: this.month.month,
            categoryId: this.category.id,
            categoryName: this.category.name,
            categoryGroupName: this.category.group.name,
            categoryColor: this.category.color,
            goal: 0,
            budgeted: this.budgeted.toNumber(),
            activity: 0,
            available: 0,
        }
    }
    public jsonFull(allTransactions: Transaction[], budgets: Budget[]): any{
        return {
            id: this.id,
            year: this.month.year,
            month: this.month.month,
            categoryId: this.category.id,
            categoryName: this.category.name,
            categoryGroupName: this.category.group.name,
            categoryColor: this.category.color,
            goal: 0,
            budgeted: this.budgeted.toNumber(),
            activity: this.getActivity(allTransactions).toNumber(),
            available: this.getAvailable(budgets, allTransactions).toNumber()
        }
    }

    private YNABActivity = Money.ZERO();
    private YNABAvailable = Money.ZERO();
    public setYNABCalculatedValues(activity: string, available: string){
        const parsedActivity = parseFloat(activity.replace('"', '').replace(',','.').replace(' ',''));
        const parsedAvailable = parseFloat(available.replace('"', '').replace(',','.').replace(' ',''));
        this.YNABActivity = Money.fromNumber(parsedActivity);
        this.YNABAvailable = Money.fromNumber(parsedAvailable);
    }

    public checkWithYNABCalculatedValues(budgets: Budget[], allTransactions: Transaction[]){
        const calculatedAvailable = this.getAvailable(budgets, allTransactions);
        const calculatedActivity = this.getActivity(allTransactions);
        console.log("YNAB Available", this.YNABAvailable, "Calc Available", calculatedAvailable);
        console.log("YNAB Activity", this.YNABActivity, "Calc Activity", calculatedActivity);
        if(!calculatedAvailable.equals(this.YNABAvailable)){
            console.log(`calculated Available: ${calculatedAvailable} does not correspond to YNAB Available: ${this.YNABAvailable}!!!!`);
        }
        //assert(calculatedAvailable.equals(this.YNABAvailable), `calculated Available: ${calculatedAvailable} does not correspond to YNAB Available: ${this.YNABAvailable}`);
        assert(calculatedActivity.equals(this.YNABActivity), `calculated activity: ${calculatedActivity} does not correspond to YNAB activity: ${this.YNABActivity}`)
    }
}
