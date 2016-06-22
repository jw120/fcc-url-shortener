/** Main server logic - provides function to create and start an Express server */

import * as Express from "express";
import * as exphbs from "express-handlebars";
import { Server } from "http";
import * as debug from "debug";
const d: debug.IDebugger = debug("url-shortener:server");

import { randomAlphanum } from "./random";
import { createTable, insert, lookupLong, lookupShort } from "./database";

let serverURL: string;

/** Length of each shortened URL */
export const shortLength: number = 6;

/** Example to show on root html page (and pre-propulate in the database) */
const exampleURL: string = "https://freecodecamp.com";

/** JSON result returned to client when a new shortening is created */
export interface APIResult {
  original_url: string;
  short_url: string;
}

/** Create and start a timestamp server on the given port (which is returned) */
export function startServer(port: number): Server {

  serverURL = process.env.SERVER_URL || "http://localhost:" + port;

  // Set up postgres
  createTable();

  // Set up express
  const app: Express.Application = Express();
  app.engine("handlebars", exphbs({defaultLayout: "main"}));
  app.set("view engine", "handlebars");
  const router: Express.Router = Express.Router();
  addRoutes(router);
  app.use("/", router);

  // Return this server to facilitate testing
  return app.listen(port);

}

function addRoutes(router: Express.Router): void {

   // Root page returns a static html page explaining the microservice
  router.get("/", (req: Express.Request, res: Express.Response): void => {
    renderRoot(res);
  });

  // /new/:url adds the url to our database and returns a JSON description
  router.get(/^\/new\/(.+)/, (req: Express.Request, res: Express.Response): void => {
    let long: string = req.params[0].trim();
    if (isURL(long)) {
      lookupShort(long)
        .then((short: string | null) => {
          if (short === null) {
            short = randomAlphanum(shortLength);
            insert(short, long)
              .then(() => {
                res.send({ original_url: long, short_url: serverURL + "/" + short});
              });
          } else {
            res.send({ original_url: long, short_url: serverURL + "/" + short});
          }
        });
    } else {
      d("Not a valid URL");
      res.send({
        error: "Wrong url format, make sure you have a valid protocol and real site."
      });
    }
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
      });
  });

  // Anything else gets an invalid page response
  router.get(/.*/, (req: Express.Request, res: Express.Response): void => {
    res.status(404).render("invalid");
  });

}

function renderRoot(res: Express.Response): void {

  let rootParams: any = {
      title: "FreeCodeCamp URL Shortener Exercise",
      serverURL,
      exampleURL,
      exampleShort: "XYZ"
  };

  lookupShort(exampleURL)
    .then((short: string | null) => {
      if (short) {
        rootParams.exampleShort = short;
        res.render("root", rootParams);
      } else {
        let newShort: string = randomAlphanum(shortLength);
        rootParams.exampleShort = newShort;
        insert(newShort, exampleURL)
          .then(() => {
            res.render("root", rootParams);
          });
      }
    });

}

/**  Helper function to test if the string looks like a valid URL
 *
 * Taken from @stephenhay on https://mathiasbynens.be/demo/url-regex
 */
function isURL(s: string): boolean {
  return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(s);
}
