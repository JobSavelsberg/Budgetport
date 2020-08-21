import pg, { Pool } from "pg";

const port = parseInt(process.env.PGPORT || "5432", 10);

pg.types.setTypeParser(1114, (s: any) => s); // Makes sure date gets parsed properly, and not as timestamp
pg.types.setTypeParser(1184, (s: any) => s); // ''
pg.types.setTypeParser(1082, (s: any) => s); // ''

export const pool = new Pool({
    database: process.env.PGDATABASE || "postgres",
    host: process.env.PGHOST || "localhost",
    port,
    user: process.env.PGUSER || "postgres"
});