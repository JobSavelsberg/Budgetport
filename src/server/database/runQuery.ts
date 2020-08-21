import dotenv from "dotenv";
import fs from "fs-extra";
import { Client } from "pg";
import path, { resolve } from "path";

const runQuery = async (name: string): Promise<any[]> => {
    let res: any[] = [];

    // read environment variables
    dotenv.config();
    // create an instance of the PostgreSQL client
    const client = new Client();
    try {
        // connect to the local database server
        await client.connect();
        // read the contents of the initdb.pgsql file
        const sql = await fs.readFile( path.resolve(__dirname, `./${name}.pgsql`), { encoding: "UTF-8" } );
        // split the file into separate statements
        const statements = sql.split( /;\s*$/m );
        for ( const statement of statements ) {
            if ( statement.length > 3 ) {
                // execute each of the statements
                res.push(await client.query( statement ));
            }
        }
    } catch ( err ) {
        console.log( err );
        throw err;
    } finally {
        // close the database client
        await client.end();
        return res;
    }
};

const name = process.argv[2];

runQuery(name).then( (responses: any[]) => {
    responses.forEach((res: any) => {
        console.log(res);
    });
    console.log( "finished" );
} ).catch( () => {
    console.log( "finished with errors" );
} );