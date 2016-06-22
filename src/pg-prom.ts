/** Thin layer on top of pg to provide simple Promise-based interfave */

import * as pg from "pg";
import * as debug from "debug";
const d: debug.IDebugger = debug("pg-prom");

/** Returna a promise which runs the given query which returns no result */
export function sqlNone(connection: string, query: string): Promise<void> {

  return new Promise<void>((resolve: () => void, reject: (reason: any) => void) => {

    pg.connect(connection, (connectErr: Error, client: pg.Client, done: ((doneErr?: any) => void)) => {

      d("sqlNone running connect callback for", connection, query);

      if (connectErr) {
        return reject(connectErr);
      }

      client.query(query,  (queryErr: Error) => {
        done(); // release client back to pool
        return queryErr ? reject(queryErr) : resolve();
      });

    });

  });

}

/** Returns a promise which runs the given query and returns the first result row or null if no results */
export function sqlOne<T>(connection: string, query: string): Promise<T | null> {

  return new Promise<T | null>((resolve: (val: T | null) => void, reject: (reason: any) => void) => {

    pg.connect(connection, (connectErr: Error, client: pg.Client, done: ((doneErr?: any) => void)) => {

      d("sqlOne running connect callback for", connection, query);

      if (connectErr) {
        return reject(connectErr);
      }

      client.query(query, (queryErr: Error, result: pg.QueryResult) => {
        done(); // release client back to pool
        if  (queryErr) {
          reject(queryErr);
        } else if (result && result.rows) {
          if (result.rows.length >= 1) {
            resolve(result.rows[0] as T);
          } else {
            resolve(null);
          }
        } else {
          reject(Error("Bad result in sqlOne"));
        }
      });

    });

  });
}
