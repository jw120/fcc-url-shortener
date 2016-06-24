/** Database access functions for url-shortener on top of pg-prom */

import * as debug from "debug";
const d: debug.IDebugger = debug("url-shortener:database");

import asyncThrow  from "./asyncthrow";
import { sqlNone, sqlOne } from "./pg-prom";

/** Postgres connection string */
const connection: string = process.env.DATABASE_URL || ("postgres://localhost:5432/shortener");

/** POstgres table name */
const table: string = "translation";

/** Create our table in the database if it does not already exist */
export function createTable(): Promise<void> {
  d("Creating table");
  return sqlNone(connection,
                 `CREATE TABLE IF NOT EXISTS ${table}
                    (short VARCHAR PRIMARY KEY, long VARCHAR not null unique)`);
}

/** Insert the new record, overwriting any existing record with the same short name  */
export function insert(short: string, long: string): Promise<void> {
  d("Inserting", short, long);
  return sqlNone(connection,
                 `INSERT INTO ${table} (short, long) VALUES ('${short}', '${long}')
                    ON CONFLICT (short) DO UPDATE SET long = EXCLUDED.long`);
}

/** Return the original url for the given short url, or null if no such short url */
export function lookupLong(short: string): Promise<string | null> {
  return sqlOne(connection, `SELECT long FROM ${table} WHERE short = '${short}'`)
    .then((res: any) => {
      if (res === null) {
        d("lookupLong returns null");
        return null;
      } else if (res && res.long) {
        let long: string = res.long as string;
        d("lookupLong returns", long);
        return long;
      } else {
        d("Error in lookupLong");
        throw Error(`lookupLong for ${short} failed`);
      }
    });
}

/** Return the short name for the given original url, or null if no such short url */
export function lookupShort(long: string): Promise<string | null> {
  return sqlOne(connection, `SELECT short FROM ${table} WHERE long = '${long}'`)
    .then((res: any) => {
      if (res === null) {
        d("lookupShort returns null");
        return null;
      } else if (res && res.short) {
        let short: string = res.short as string;
        d("lookupShort returns", short);
        return short;
      } else {
        d("Error in lookupShort");
        throw Error(`lookupShort for ${long} failed`);
      }
    });
}

