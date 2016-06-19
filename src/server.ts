/** Provides function to create and start an Express server */

import * as Express from "express";
import * as exphbs from "express-handlebars";
import { Server } from "http";

/** Length of each shortened URL */
const shortenedLength: number = 6;

interface Shortening {
  original: string;
  shortForm: string;
}

/** Create and start a timestamp server on the given port (which is returned) */
export function startServer(port: number): Server {

  const app: Express.Application = Express();

  let db: Shortening[] = [];
  let dbNext: number = 0;

  app.engine("handlebars", exphbs({defaultLayout: "main"}));
  app.set("view engine", "handlebars");

  const router: Express.Router = Express.Router();

  // Root page returns a static html page explaining the microservice
  router.get("/", (req: Express.Request, res: Express.Response): void => {
    console.log("In root");
    res.render("root", {
      title: "FreeCodeCamp URL Shortener Exercise",
      serverURL: process.env.SERVER_URL || "server",
      exampleURL: "https://freecodecamp.com",
      exampleShort: "XYZ"
    });
  });

  // /new/:url adds the url to our database and returns a JSON description
  router.get(/^\/new\/(.+)/, (req: Express.Request, res: Express.Response): void => {
    console.log("In new");
    let original: string = req.params[0].trim();
    if (original) {
      let shortForm: string = newShortform();
      let record: Shortening = { original, shortForm };
      db[dbNext++] = record;
      res.send(record);
    }
  });

  // A valid short form url may get redirected
  router.get(/^\/(\w{6})/, (req: Express.Request, res: Express.Response): void => {
    console.log("In redirect for ", req.params[0]);
    let short: string = req.params[0];
    let original: string | undefined = lookup(db, short);
    if (original) {
      res.redirect(original);
    } else {
      res.render("invalid");
    }
  });

  // Anything else gets an invalid page response
  router.get(/.*/, (req: Express.Request, res: Express.Response): void => {
    console.log("In catch all");
    res.render("invalid");
  });

  app.use("/", router);

  return app.listen(port);

}

/** Generate a new random shortform url */
function newShortform(): string {
  let acc: string = "";
  for (let i: number = 0; i < shortenedLength; i++) {
    acc += randomAlphaNum();
  }
  return acc;
}

/** Return a random \w character */
function randomAlphaNum(): string {
  const possibles: string =
    "abcdefhjijklmnopqrstuvwxyz" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "01234567890_";
  return possibles.charAt(Math.random() * possibles.length);
}

/** Return the original url if present in the database, undefined if not */
function lookup(d: Shortening[], s: string): string | undefined {
  let match: Shortening | undefined = d.find((record: Shortening): boolean => record.shortForm === s);
  return match && match.original;
}
