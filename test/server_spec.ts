/** Tests our url-shortner server, using existing server if a server URL is supplied in the
 * SERVER environment variable, or creates a new server if not. Uses the testdb databasde
 * in Postgres which we expect to be empty when we start.
 */

import { Server as httpServer } from "http";
import  * as fetch from "isomorphic-fetch";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
let expect: Chai.ExpectStatic = chai.expect;

import asyncThrow from "../src/asyncthrow";
import { startServer, shortLength, APISuccess, badURLReturn, noSuchParams, unknownParams, rootParams } from "../src/server";

/** URL we will use to reference the server */
let serverURL: string;

/** Port to use for our Express server on localhost (if we start one) */
const defaultPort: number = 8081;

/** Data to be used in our tests */
const invalidShort: string = "kjfkj-23";
let unknown1: string = "abcdef";
const long1: string = "http://first.com/";
const long2: string = "ftp://second.com";
const long3: string = "https://third.co.uk/sub/dir";
const none1: string = "htp://abc.com/";
const none2: string = "https:/bcd.com";
const none3: string = "ftp://";

/** The http server to be closed when finished, or null if we have not started a server */
let serverToClose: httpServer | null;

/** */
const manualRedirectOption: any = {
  redirect: "manual"
};

describe("Server tests",  () => {

  before((): Promise<void> => {

    if (process.env.SERVER) {

      serverURL = process.env.SERVER;
      serverToClose = null;
      return Promise.resolve();

    } else {

      return startServer(defaultPort)
        .then((server: httpServer): void => {
          serverToClose = server;
          serverURL = "http://localhost:" + defaultPort;
        })
        .catch(asyncThrow);

    }

  });

  after(() => {

    if (serverToClose) {
      serverToClose.close();
    }

  });

  describe("root url", () => {

    it("returns status 200 and correct headers", (): Promise<void> =>
      fetch(serverURL + "/")
        .then((res: IResponse): void => {
          expect(res.status).to.equal(200);
          expect(res.headers.get("Content-Type").toLowerCase()).to.equal("text/html; charset=utf-8");
        }));

    it("returns result including expected text", (): Chai.PromisedAssertion =>
      expect(fetch(serverURL + "/").then((res: IResponse): Promise<string> => res.text()))
        .to.eventually.contain(rootParams.title));

  });

  describe("Invalid url shortcut", () => {

    it("returns status 404", (): Chai.PromisedAssertion =>
      expect(fetch(serverURL + "/" + invalidShort))
        .to.eventually.have.property("status", 404));

    it("returns result including expected test", (): Chai.PromisedAssertion =>
      expect(fetch(serverURL + "/" + invalidShort).then((res: IResponse) => res.text()))
        .to.eventually.contain(unknownParams.reason));

});

  describe("Smoke tests", () => {

    it("Following the unknown shortform  " + unknown1 + " gives expected message" , (): Chai.PromisedAssertion =>
      expect(fetch(serverURL + "/" + unknown1).then((res: IResponse) => res.text()))
        .to.eventually.contain(noSuchParams.reason));

    it("Creating a new shortened url for " + long1 + "gives valid short url", (): Promise<void> =>
      fetch(serverURL + "/new/" + long1)
        .then((res: IResponse) => res.json())
        .then((r: APISuccess) => {
          expect(r.original_url).to.equal(long1);
          expect(r).to.have.property("short_url");
          expect(r.short_url).to.match(new RegExp("/\\w{" + shortLength + "}$"));
          expect(r.short_url.substring(0, serverURL.length)).to.equal(serverURL);
          expect(r.short_url.length).to.equal(serverURL.length + 1 + shortLength);
        }));

    it("Creating a new shortened url for " + long2 + "twice gives same short url both times", (): Promise<void> => {
      let short2: string;
      return fetch(serverURL + "/new/" + long2)
        .then((res: IResponse): Promise<any> => res.json())
        .then((r1: any): void => {
          expect(r1.original_url).to.equal(long2);
          expect(r1).to.have.property("short_url");
          short2 = r1.short_url;
        })
        .then((): Promise<IResponse> => fetch(serverURL + "/new/" + long2))
        .then((res: IResponse): Promise<any> => res.json())
        .then((r2: any) => {
          expect(r2.original_url).to.equal(long2);
          expect(r2.short_url).to.equal(short2);
        });
    });

    it("Creating a new shortened for " + long3 + " and following the short url redirects to " + long3 , (): Promise<void> => {
      let short3: string;
      return fetch(serverURL + "/new/" + long3)
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
      fetch(serverURL + "/new/" + none1)
        .then((res: IResponse) => res.json())
        .then((r: any) => {
          expect(r.error).to.equal(badURLReturn.error);
        }));

    it("Rejects new for the invalid url " + none2, (): Promise<void> =>
      fetch(serverURL + "/new/" + none2)
        .then((res: IResponse) => res.json())
        .then((r: any) => {
          expect(r.error).to.equal(badURLReturn.error);
        }));

    it("Rejects new for the invalid url " + none3, (): Promise<void> =>
      fetch(serverURL + "/new/" + none3)
        .then((res: IResponse) => res.json())
        .then((r: any) => {
          expect(r.error).to.equal(badURLReturn.error);
        }));


  });

});


