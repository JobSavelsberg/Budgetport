import { Category, CategoryGroup } from "./category";

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

export class Budget{
    id: number;
    month: Month;
    category: Category;
    budgeted: number;
    activity: number;
    available: number;

    constructor(id: number, month: Month, category: Category, budgeted: number){
        this.id = id;
        this.month = month;
        this.category = category;
        this.budgeted = budgeted;
        this.activity = 0;
        this.available= 0;
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
            budgeted: this.budgeted,
            activity: this.activity,
            available: this.available
        }
    }
}
