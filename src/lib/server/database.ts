import Surreal from 'surrealdb.js';

const db = new Surreal('http://127.0.0.1:8000/rpc'); // TODO: change to env variable before production

export default db;
