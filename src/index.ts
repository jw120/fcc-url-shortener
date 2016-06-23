/** Simple top-level application to starts the server */

import * as debug from "debug";
const d: debug.IDebugger = debug("url-shortener:index");

import { startServer } from "./server";

/** Http port to launch our Express server */
const port: number = process.env.PORT || 8080;

d("Calling startServer for port", port);
startServer(port);
console.log("URL shortener server launched on port " + port);


