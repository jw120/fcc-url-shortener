/** Provides function to create and start an Express server */

import * as Express from "express";
import * as exphbs from "express-handlebars";
import { Server } from "http";

/** Create and start a timestamp server on the given port (which is returned) */
export function startServer(port: number): Server {

  const app: Express.Application = Express();

  app.engine("handlebars", exphbs({defaultLayout: "main"}));
  app.set("view engine", "handlebars");

  const router: Express.Router = Express.Router();
  router.get("/", function (req: Express.Request, res: Express.Response): void {
    res.render("root");
  });

  app.use("/", router);

  return app.listen(port);

}
