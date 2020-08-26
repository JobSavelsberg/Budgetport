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
}

export class Budget{
    readonly id: number;
    readonly month: Month;
    category: Category;
    budgeted: number;
    readonly activity: number;
    readonly available: number;

    constructor(id: number, month: Month, category: Category, budgeted: number){
        this.id = id;
        this.month = month;
        this.category = category;
        this.budgeted = budgeted;
    }
}
