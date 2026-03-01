import pg from 'pg'
import { config } from '../config/index.js';

const { Pool } = pg

const pool = new Pool({
    connectionString: config.postgres.connectionString
})

pool.on('error', (err) => {
    console.error('Unexpected Postgres Client error', err)

})

export default pool;