import * as db from "./db"

export async function init(){
    console.log("Initializing app");
    await db.load();
    
}
