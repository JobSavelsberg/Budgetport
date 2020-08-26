import { getEnabledCategories } from "trace_events";
import { Color } from "vuetify/lib/util/colors";

export class CategoryGroup{
    name: string;
    categories: Category[];

    constructor(name: string){
        this.name = name;
        this.categories = [];
    }

    public addCategory(category: Category){
        this.categories.push(category);
    }
}

export class Category{
    id: number;
    name: string;
    group: CategoryGroup;
    color: string;

    constructor(id: number, name: string, group: CategoryGroup, color: string){
        this.id = id;
        this.name = name;
        this.group = group;
        if(color[0] !== '#'){
            color = '#' + color;
        }
        this.color = color;
    }

    public json(): any{
        return {
            id: this.id,
            name: this.name,
            color: this.color,
        }
    }

    public getName(): string{
        return this.name;
    }

    public getColor(): string{
        return this.color;
    }
}