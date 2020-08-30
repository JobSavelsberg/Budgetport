import { getEnabledCategories } from "trace_events";
import colors from 'vuetify/lib/util/colors'

const categoryColors = [colors.red.darken4, colors.pink.darken4, colors.purple.darken4, colors.deepPurple.darken4, colors.indigo.darken4, colors.blue.darken4, 
    colors.lightBlue.darken4, colors.cyan.darken3, colors.teal.darken3, colors.green.darken4, colors.lightGreen.darken3, colors.lime.darken4, colors.yellow.darken3, 
    colors.amber.darken4, colors.orange.darken4, colors.deepOrange.darken4, colors.brown.darken2, colors.grey.darken2 ]

export class CategoryGroup{
    id: number;
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

    public static getRandomColor(): string{
        return categoryColors[Math.floor(Math.random()*categoryColors.length)];
    }
}