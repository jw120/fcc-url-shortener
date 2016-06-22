/** Main server logic - provides function to create and start an Express server */

import * as Express from "express";
import * as exphbs from "express-handlebars";
import { Server } from "http";

import { randomAlphanum } from "./random";
import { createTable, insert, lookupLong, lookupShort } from "./database";

const serverURL: string = process.env.SERVER_URL || "server";


/** Length of each shortened URL */
const shortLength: number = 6;

/** Example to show on root html page (and pre-propulate in the database) */
const exampleURL: string = "https://freecodecamp.com";

/** JSON result returned to client when a new shortening is created */
export interface APIResult {
  original_url: string;
  short_url: string;
}

/** Create and start a timestamp server on the given port (which is returned) */
export function startServer(port: number): Server {

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
    if (long) {
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
    }
  });

  // A valid short form url may get redirected
  router.get(/^\/(\w{6})$/, (req: Express.Request, res: Express.Response): void => {
    let short: string = req.params[0];
    lookupLong(short)
      .then((long: string | null) => {
        if (!long) {
          res.status(404).render("invalid");
        } else {
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
