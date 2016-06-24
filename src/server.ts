/** Main server logic creates and start an Express server with its callbacks and the Postgres database */

import * as Express from "express";
import * as exphbs from "express-handlebars";
import { Server as httpServer } from "http";
import * as debug from "debug";
const d: debug.IDebugger = debug("url-shortener:server");

import asyncThrow from "./asyncthrow";
import { createTable, insert, lookupLong, lookupShort } from "./database";
import { randomAlphanum } from "./random";

/** URL that our express server is running on */
let serverURL: string;

/** Length of each shortened URL */
export const shortLength: number = 6;

/** Example to show on root html page (and to pre-propulate in the database) */
const exampleURL: string = "https://freecodecamp.com";

/** JSON result returned to client when a new shortening is created */
export interface APIResult {
  original_url: string;
  short_url: string;
}

/** JSON result return on trying to create a short url for a bad original URL */
const badURLReturn: any =  {
  error: "Wrong url format, make sure you have a valid protocol and real site."
};

/** Create and start the Express server (with callbacks and database) on the given port, return our http server or null */
export function startServer(port: number): Promise<httpServer | null> {

  serverURL = process.env.SERVER_URL || "http://localhost:" + port;

  return createTable()
    .then((): httpServer | null => {

      const app: Express.Application = Express();
      app.engine("handlebars", exphbs({defaultLayout: "main"}));
      app.set("view engine", "handlebars");

      const router: Express.Router = Express.Router();
      addRoutes(router);
      app.use("/", router);

      return app.listen(port);
    })
    .catch(asyncThrow);

}

/** Helper function to add route callback to the Express router */
function addRoutes(router: Express.Router): void {

   // Root page returns a static html page explaining the microservice
  router.get("/", (req: Express.Request, res: Express.Response): void => {
    renderRoot(res);
  });

  // /new/:url adds the url to our database and returns a JSON description
  router.get(/^\/new\/(.+)/, (req: Express.Request, res: Express.Response): void => {

    const long: string = req.params[0].trim();

    if (!isURL(long)) {
      d("Not a valid URL");
      res.send(badURLReturn);
      return;
    }

    lookupShort(long)
      .then((possibleShort: string | null): string => {
          if (possibleShort === null) {
            possibleShort = randomAlphanum(shortLength);
            insert(possibleShort, long);
          }
          return possibleShort;
      })
      .then((short: string): void => {
        res.send({ original_url: long, short_url: serverURL + "/" + short});
      })
      .catch(asyncThrow);
  });

  // A valid short form url may get redirected
  router.get(/^\/(\w{6})$/, (req: Express.Request, res: Express.Response): void => {

    let short: string = req.params[0];

    lookupLong(short)
      .then((long: string | null) => {
        if (!long) {
          d("No such shortform");
          res.status(404).render("invalid");
        } else {
          d("Redirecting to", long);
          res.redirect(long);
        }
      })
      .catch(asyncThrow);
  });

  // Anything else gets an invalid page response
  router.get(/.*/, (req: Express.Request, res: Express.Response): void => {
    res.status(404).render("invalid");
  });

}

/** Helper function to render the root page */
function renderRoot(res: Express.Response): void {

  // Parameters to pass to the Handlebars view renderer
  let rootParams: any = {
      title: "FreeCodeCamp URL Shortener Exercise",
      serverURL,
      exampleURL,
      exampleShort: "XYZ"
  };

  lookupShort(exampleURL)
    .then((possibleShort: string | null): string => {
      if (possibleShort) {
        return possibleShort;
      } else {
        let newShort: string = randomAlphanum(shortLength);
        insert(newShort, exampleURL);
        return newShort;
      }
    })
    .then((exampleShort: string): void => {

      rootParams.exampleShort = exampleShort;
      res.render("root", rootParams);
    })
    .catch(asyncThrow);

}

/**  Helper function to test if the string looks like a valid URL
 *
 * Taken from @stephenhay on https://mathiasbynens.be/demo/url-regex
 */
function isURL(s: string): boolean {

  return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(s);

}
