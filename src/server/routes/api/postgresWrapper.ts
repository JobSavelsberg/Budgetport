import { triggerAsyncId } from "async_hooks";
import pg, { Pool} from "pg";

const port = parseInt(process.env.PGPORT || "5432", 10);

pg.types.setTypeParser(1114, (s: any) => s); // Makes sure date gets parsed properly, and not as timestamp
pg.types.setTypeParser(1184, (s: any) => s); // ''
pg.types.setTypeParser(1082, (s: any) => s); // ''

const productionPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
})

const developmentPool =  new Pool({
    database: process.env.PGDATABASE || "postgres",
    host: process.env.PGHOST || "localhost",
    port,
    user: process.env.PGUSER || "postgres"
});


export const pool = process.env.NODE_ENV === 'production' ? productionPool : developmentPool;
