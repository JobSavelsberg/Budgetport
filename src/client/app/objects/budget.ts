import { Category, CategoryGroup } from "./category";
import { Transaction } from "./transaction";

export class Month{
    year: number;
    month: number;

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
    budgeted: number;

    constructor(id: number, month: Month, category: Category, budgeted: number){
        this.id = id;
        this.month = month;
        this.category = category;
        this.budgeted = budgeted;
    }

    public getActivity(allTransactions: Transaction[]): number{
        let activity = 0;
        this.getActivityTransactions(allTransactions).forEach((transaction: Transaction) => {
            activity += transaction.inflow - transaction.outflow;
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

    public getAvailable(budgets: Budget[], allTransactions: Transaction[]): number{
        let available = 0;
        budgets.forEach((budget:Budget) => {
            if(budget.category === this.category && budget.month.year <= this.month.year && budget.month.month <= this.month.month){
                available += Number(budget.budgeted);
            }
        })
        allTransactions.forEach((transaction: Transaction) => { 
            if(transaction.getDate().year <= this.month.year && 
                transaction.getDate().month <= this.month.month && 
                transaction.getCategory() === this.category){
                available += Number(transaction.inflow) - Number(transaction.outflow);
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
            budgeted: Number(this.budgeted),
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
            budgeted: Number(this.budgeted),
            activity: Number(this.getActivity(allTransactions)),
            available: Number(this.getAvailable(budgets, allTransactions))
        }
    }
}
