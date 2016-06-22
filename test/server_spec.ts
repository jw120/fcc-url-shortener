// Tests the server - uses existing server on the environment variable
// TEST_URL if that variable exists, otherwise we start our own

import { Server } from "http";
import  * as fetch from "isomorphic-fetch";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
let expect: Chai.ExpectStatic = chai.expect;

import { startServer, shortLength, APIResult } from "../src/server";

/** URL we will use to reference the server */
let serverUrl: string;
let rootUrl: string;
let invalidUrl: string;

/** URLs to save during test */
let long1: string = "http://first.com/";
let long2: string = "ftp://second.com";
let long3: string = "https://third.co.uk/sub/dir";
let none1: string = "htp://abc.com/";
let none2: string = "https:/bcd.com";
let none3: string = "ftp://";

/** The server to be closed if we started one */
let server: Server| null = null;

/** */
const manualRedirectOption: any = {
  redirect: "manual"
};

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

  describe("Smoke tests", () => {

    it("Creating a new shortened url for " + long1 + "gives valid short url", (): Promise<void> =>
      fetch(serverUrl + "/new/" + long1)
        .then((res: IResponse) => res.json())
        .then((r: APIResult) => {
          expect(r.original_url).to.equal(long1);
          expect(r).to.have.property("short_url");
          expect(r.short_url).to.match(new RegExp("/\\w{" + shortLength + "}$"));
          expect(r.short_url.substring(0, serverUrl.length)).to.equal(serverUrl);
          expect(r.short_url.length).to.equal(serverUrl.length + 1 + shortLength);
        }));

    it("Creating a new shortened url for " + long2 + "twice gives same short url both times", (): Promise<void> => {
      let short2: string;
      return fetch(serverUrl + "/new/" + long2)
        .then((res: IResponse): Promise<any> => res.json())
        .then((r1: any): void => {
          expect(r1.original_url).to.equal(long2);
          expect(r1).to.have.property("short_url");
          short2 = r1.short_url;
        })
        .then((): Promise<IResponse> => fetch(serverUrl + "/new/" + long2))
        .then((res: IResponse): Promise<any> => res.json())
        .then((r2: any) => {
          expect(r2.original_url).to.equal(long2);
          expect(r2.short_url).to.equal(short2);
        });
    });

    it("Creating a new shortened for " + long3 + " and following the short url redirects to " + long3 , (): Promise<void> => {
      let short3: string;
      return fetch(serverUrl + "/new/" + long3)
        .then((res: IResponse): Promise<any> => res.json())
        .then((r1: any): void => {
          expect(r1.original_url).to.equal(long3);
          expect(r1).to.have.property("short_url");
          short3 = r1.short_url;
        })
        .then((): Promise<IResponse> => fetch(short3, manualRedirectOption))
        .then((res: IResponse): void => {
          expect(res.status).to.equal(302);
          expect(res.headers.get("Location")).to.equal(long3);
        });
    });

    it("Rejects new for the invalid url " + none1, (): Promise<void> =>
      fetch(serverUrl + "/new/" + none1)
        .then((res: IResponse) => res.json())
        .then((r: any) => {
          expect(r.error).to.equal("Wrong url format, make sure you have a valid protocol and real site.");
        }));

    it("Rejects new for the invalid url " + none2, (): Promise<void> =>
      fetch(serverUrl + "/new/" + none2)
        .then((res: IResponse) => res.json())
        .then((r: any) => {
          expect(r.error).to.equal("Wrong url format, make sure you have a valid protocol and real site.");
        }));

    it("Rejects new for the invalid url " + none3, (): Promise<void> =>
      fetch(serverUrl + "/new/" + none3)
        .then((res: IResponse) => res.json())
        .then((r: any) => {
          expect(r.error).to.equal("Wrong url format, make sure you have a valid protocol and real site.");
        }));


  });

});


