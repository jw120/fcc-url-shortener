import { connect, Client, Query, QueryResult, ResultBuilder, end } from "pg";
import * as debug from "debug";
const d: debug.IDebugger = debug("url-shortener:database");

// import * as pgPromise from "pg-promise";

// const pgp = pgPromise({
//     // Initialization Options
// });
let database: string = "shortener";
let table: string = "shorts";
let defaultConnectionString: string = "postgres://localhost:5432/" + database;
let connectionString: string = process.env.DATABASE_URL || defaultConnectionString;

// let db: pgPromise.IDatabase<void> = pgp(connectionString);

export function initialize(): Promise<void> {

  return new Promise<void>((resolve: () => void, reject: (reason: any) => void) => {

    connect(connectionString, (connectErr: Error, client: Client, done: ((doneErr?: any) => void)) => {

      if (connectErr) {
        reject(connectErr);
      }

      let queryString: string =  `CREATE TABLE IF NOT EXISTS ${table} (
                                    short VARCHAR PRIMARY KEY,
                                    original VARCHAR not null unique)`;
      d("Query:", queryString);
      let query: Query = client.query(queryString,  (createErr: Error, result: QueryResult) => {

        done(); // release client back to pool

        if  (createErr) {
            reject(createErr);
        }
      });
      query.on("end", () => {
        d("initialize end");
        done();
        return resolve();
      });

    });

  });

}

export function insert(original: string, short: string): Promise<void> {

  return new Promise<void>((resolve: () => void, reject: (reason: any) => void) => {

    connect(connectionString, (connectErr: Error, client: Client, done: ((doneErr?: any) => void)) => {

      if (connectErr) {
        reject(connectErr);
      }

      let queryString: string = `INSERT INTO ${table} (short, original)
                                   VALUES ('${short}', '${original}')
                                   ON CONFLICT (short) DO UPDATE SET original = EXCLUDED.original;`;
      d("Query:", queryString);
      let query: Query = client.query(queryString,  (createErr: Error, result: QueryResult) => {

        done(); // release client back to pool

        if  (createErr) {
            reject(createErr);
        }
      });
      query.on("end", () => {
        d("insert end");
        done();
        return resolve();
      });

    });

  });

}

export function lookupShort(original: string): Promise<string> {

  return new Promise<string>((resolve: (s: string) => void, reject: (reason: any) => void) => {

    connect(connectionString, (connectErr: Error, client: Client, done: ((doneErr?: any) => void)) => {

      if (connectErr) {
        reject(connectErr);
      }

      let queryString: string = `SELECT short FROM ${table} WHERE original = '${original}'`;
      d("Query:", queryString);

      let query: Query = client.query(queryString, (lookupErr: Error) => {
        done(); // release client back to pool
        if  (lookupErr) {
          reject(lookupErr);
        }
      });
      query.on("row", (row: any, result: ResultBuilder) => {
        resolve(row.short);
      });
    });

  });
}


export function lookupOriginal(short: string): Promise<string> {

  return new Promise<string>((resolve: (s: string) => void, reject: (reason: any) => void) => {

    connect(connectionString, (connectErr: Error, client: Client, done: ((doneErr?: any) => void)) => {

      if (connectErr) {
        reject(connectErr);
      }

      let queryString: string = `SELECT original FROM ${table} WHERE short = '${short}'`;
      d("Query:", queryString);

      let query: Query = client.query(queryString, (lookupErr: Error) => {
        done(); // release client back to pool
        if  (lookupErr) {
          reject(lookupErr);
        }
      });
      query.on("row", (row: any, result: ResultBuilder) => {
        resolve(row.original);
      });
    });

  });
}

d("Starting");
initialize()
  .then(() => insert("quickbrownfox", "abc123"))
  .then(() => lookupShort("quickbrownfox"))
  .then((s: string) => console.log("Found short", s))
  .then(() => lookupOriginal("abc123"))
  .then((s: string) => console.log("Found original", s))
  .then(() => end() )
  .catch((e: Error) => console.error(e));
d("At end");

// export function insert(original: string, short: string): Promise<void> {

//   connect(connectionString, (connectErr: Error, client: Client, done: ((doneErr?: any) => void)) => {

//     if (connectErr) {
//       return console.error("insert postgress connect error", connectErr);
//     }

//     let query: string = `INSERT INTO ${table} (original, short) VALUES ('${original}', '${short}')`;
//     console.log("Query:", query);

//     client.query(
//       query,
//       (insertErr: Error, result: QueryResult) => {
//       done(); // release client back to pool
//       if  (insertErr) {
//         return console.error("insert postgres insert query error ", insertErr);
//       }
//     });
//   });
// }

// export function lookupShort(original: string): void {

//   connect(connectionString, (connectErr: Error, client: Client, done: ((doneErr?: any) => void)) => {

//     if (connectErr) {
//       return console.error("lookupShort postgress connect error", connectErr);
//     }

//     let query: string = `SELECT short FROM ${table} WHERE original = '${original}'`;
//     console.log("Query:", query);

//     let q: Query = client.query(
//       query,
//       (lookupErr: Error, result: QueryResult) => {
//       done(); // release client back to pool
//       if  (lookupErr) {
//         return console.error("lookupShort postgres query error ", lookupErr);
//       }
//     });
//     q.on("row", (row: any) => console.log("Got row", row));
//     q.on("end", (row: any) => console.log("End of results"));

//   });
// }

// db.none(`CREATE TABLE IF NOT EXISTS ${table} (
//             id SERIAL PRIMARY KEY,
//             original VARCHAR not null unique,
//             short VARCHAR not null unique)`)
//     .then(() => db.none(
//       "INSERT INTO shorts (original, short) VALUES (${original}, ${short})",
//       { table: table, original: "firstexample", short: "def456" }
//     ))
//     .then(() => {
//       console.log("Done insert");
//     })
//     .catch((e: Error) => {
//       console.error(e);
//     });

// initialize();
// insert("quickbrownfox", "abc123");
// lookupShort("quickbrownfox");
// lookupShort("ZZZ");

// function insertRecord(original: string, short: string): Promise<boolean> {

//   db.none(
//       "INSERT INTO shorts (original, short) VALUES (${original}, ${short})",
//       { original, short }
//   )
//     .then(() => { return true; } )
//     .catch((e: Error) => {
//       console.log("Insert gave caught error", e);
//       return false;
//     });

//     return false;

// }

