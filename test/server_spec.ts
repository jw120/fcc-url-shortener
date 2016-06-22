// Tests the server - uses existing server on the environment variable
// TEST_URL if that variable exists, otherwise we start our own

import { Server } from "http";
import  * as fetch from "isomorphic-fetch";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
let expect: Chai.ExpectStatic = chai.expect;

import { startServer, APIResult } from "../src/server";

/** URL we will use to reference the server */
let serverUrl: string;
let rootUrl: string;
let invalidUrl: string;

/** URLs to save during test */
let long1: string = "http://first.com/";

/** The server to be closed if we started one */
let server: Server| null = null;

describe("Server tests",  () => {

  before(() => {

    if (process.env.SERVER) {
      serverUrl = process.env.SERVER;
    } else {
      const localPort: number = 8081;
      server = startServer(localPort);
      serverUrl = "http://localhost:" + localPort;
    }
    rootUrl = serverUrl + "/";
    invalidUrl = serverUrl + "/kjfkj-23";

  });

  after(() => {

    if (server) {
      server.close();
    }

  });

  describe("root url", () => {

    it("returns status 200 and correct headers", (): Promise<void> =>
      fetch(rootUrl)
        .then((res: IResponse): void => {
          expect(res.status).to.equal(200);
          expect(res.headers.get("Content-Type").toLowerCase()).to.equal("text/html; charset=utf-8");
        }));

    it("returns result including expected text", (): Chai.PromisedAssertion =>
      expect(fetch(rootUrl).then((res: IResponse): Promise<string> => res.text()))
        .to.eventually.contain("<h1>FreeCodeCamp Back End Exercise: URL shortener microservice</h1>"));

  });

  describe("Invalid url shortcut", () => {

    it("returns status 404", (): Chai.PromisedAssertion =>
      expect(fetch(invalidUrl))
        .to.eventually.have.property("status", 404));

    it("returns result including expected test", (): Chai.PromisedAssertion =>
      expect(fetch(invalidUrl).then((res: IResponse) => res.text()))
        .to.eventually.contain("Sorry"));

});

  describe("Sequence test", () => {

    it("Creates new shortcut for " + long1 , (): Promise<void> =>
      fetch(serverUrl + "/new/" + long1)
        .then((res: IResponse) => res.json())
        .then((r: APIResult) => {
          chai.expect(r.original_url).to.equal(long1);
          chai.expect(r).to.have.property("short_url");
        }));

    it("Creates new shortcut for " + long1 , (): Promise<void> =>
      fetch(serverUrl + "/new/" + long1)
        .then((res: IResponse) => res.json())
        .then((r: APIResult) => {
          chai.expect(r.original_url).to.equal(long1);
          chai.expect(r).to.have.property("short_url");
        }));

  });

});


