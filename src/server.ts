/** Provides function to create and start an Express server */

import * as Express from "express";
import * as exphbs from "express-handlebars";
import { Server } from "http";

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
  router.get("/", (req: Express.Request, res: Express.Response): void => {
    res.render("root", {
      title: "FreeCodeCamp URL Shortener Exercise",
      serverURL: process.env.SERVER_URL || "server",
      exampleURL: "https://freecodecamp.com",
      exampleShort: "XYZ"
    });
  });
  router.get(/^\/new\/(.*)/, (req: Express.Request, res: Express.Response): void => {
    console.log("In get /new", req.params, req.params[0]);
    let original: string = req.params[0].trim();
    console.log("Original is", original);
    if (original) {
      let shortForm: string = shorten(original);
      let record: Shortening = { original, shortForm };
      db[dbNext++] = record;
      console.log("Added", original, shortForm, db, dbNext);
      res.send(record);
    }
  });

  app.use("/", router);

  return app.listen(port);

}

function shorten(url: string): string {
  return url[0] + "abc";
}
