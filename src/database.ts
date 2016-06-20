import { Client, Query } from "pg";


let defaultConnectionString: string = "postgres://localhost:5432/todo";
let connectionString: string = process.env.DATABASE_URL || defaultConnectionString;

let createSQL: string = `
  CREATE TABLE shorts(
      id SERIAL PRIMARY KEY,
      original VARCHAR not null,
      shortForm VARCHAR not null)
  `;


let client: Client = new Client(connectionString);
client.connect();

let query: Query = client.query(createSQL);
query.on("end", () => client.end());
