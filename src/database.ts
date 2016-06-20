import { connect, Client, QueryResult } from "pg";


let defaultConnectionString: string = "postgres://localhost:5432/todo";
let connectionString: string = process.env.DATABASE_URL || defaultConnectionString;

let createSQL: string = `
  CREATE TABLE shorts(
      id SERIAL PRIMARY KEY,
      original VARCHAR not null,
      shortForm VARCHAR not null)
  `;


// Make a pooled connection to postgres
connect(connectionString, (connectErr: Error, client: Client, done: ((doneErr?: any) => void)) => {

  if (connectErr) {
    return console.error("postgress connect error", connectErr);
  }

  client.query(createSQL, (createErr: Error, result: QueryResult) => {
    done(); // release client back to pool
    if (createErr) {
      return console.error("postgres create query error ", createErr);
    }
  });

});

// query.on("end", () => client.end());
