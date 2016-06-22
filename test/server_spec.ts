// Tests the server - uses existing server on the environment variable
// TEST_URL if that variable exists, otherwise we start our own

import { Server } from "http";
import * as fetch from "isomorphic-fetch";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
let expect: Chai.ExpectStatic = chai.expect;

// import { promiseAssert } from "./promiseAssert";
import { startServer, APIResult } from "../src/server";


// function fetch(s: string): Promise<any> {
//   console.log("Called fetch on ", s);
//   return realFetch(s).then((a: any) => {
//     console.log("Fetch for", s, "returned", a.status, a.url);
//     return a;
//   });
// }

/** URL we will use to reference the server */
let serverUrl: string;

/** The server to be closed if we started one */
let server: Server| null = null;

// Data we use in our tests

describe("Server tests",  () => {

  before(() => {

    if (process.env.SERVER) {
      serverUrl = process.env.SERVER;
    } else {
      const localPort: number = 8081;
      server = startServer(localPort);
      serverUrl = "http://localhost:" + localPort;
    }

  });

  after(() => {

    if (server) {
      server.close();
    }

  });

  // describe("/<unix-time>", () => {

  //   it("returns an ok status", (done: MochaDone) => {
  //     promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
  //       chai.expect(res.ok).to.be.true;
  //     });
  //   });

  //   it("returns an ok status", (done: MochaDone) => {
  //     promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
  //       chai.expect(res.ok).to.be.true;
  //     });
  //   });

  //   it("returns status 200", (done: MochaDone) => {
  //     promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
  //       chai.expect(res.status).to.equal(200);
  //     });
  //   });

  //   it("returns OK statusText", (done: MochaDone) => {
  //     promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
  //       chai.expect(res.statusText).to.equal("OK");
  //     });
  //   });

  //   it("returns a Content-Type header for json and utf8", (done: MochaDone) => {
  //     promiseAssert(fetch(unixTimeUrl), done, (res: IResponse): void => {
  //       chai.expect(res.headers.get("Content-Type").toLowerCase()).to.equal("application/json; charset=utf-8");
  //     });
  //   });

  //   it("returns expected JSON result", (done: MochaDone) => {
  //     let p: Promise<ParsedTimestamp> =
  //       fetch(unixTimeUrl)
  //         .then((res: IResponse) => res.json());
  //     promiseAssert(p, done, (res: ParsedTimestamp): void => {
  //       chai.expect(res).to.deep.equal(exampleTS);
  //     });
  //   });

  // });

  describe("/", () => {

    it("returns status 200", (): Promise<void> =>
      fetch(serverUrl + "/")
        .then((res: IResponse): void => {
          expect(res.status).to.equal(200);
        }));

    it("returns status 200", (): Chai.PromisedAssertion =>
      expect(fetch(serverUrl + "/"))
        .to.eventually.have.property("status", 200));


    it("returns status 201 SHOULD FAIL", (): Promise<void> =>
      fetch(serverUrl + "/")
        .then((res: IResponse): void => {
          expect(res.status).to.equal(201);
        }));

    it("returns status 201 SHOULD FAIL", (): Chai.PromisedAssertion =>
      expect(fetch(serverUrl + "/"))
        .to.eventually.have.property("status", 201)
    );

    it("returns a Content-Type header for html and utf8", (): Chai.PromisedAssertion =>
      expect(fetch(serverUrl + "/").then((res: IResponse): string => res.headers.get("Content-Type").toLowerCase()))
        .to.eventually.equal("text/html; charset=utf-8"));

    it("returns expected html result", (): Promise<Chai.Assertion> =>
      fetch(serverUrl + "/")
        .then((res: IResponse): Promise<string> => res.text())
        .then((t: string): Chai.Assertion =>
            expect(t).to.contain("<h1>FreeCodeCamp Back End Exercise: URL shortener microservice</h1>")));

    it("returns expected html result", (): Chai.PromisedAssertion =>
      expect(fetch(serverUrl + "/").then((res: IResponse): Promise<string> => res.text()))
        .to.eventually.contain("<h1>FreeCodeCamp Back End Exercise: URL shortener microservice</h1>"));

    it("returns expected html result SHOULD FAIL", (): Promise<Chai.Assertion> =>
      fetch(serverUrl + "/")
        .then((res: IResponse): Promise<string> => res.text())
        .then((t: string): Chai.Assertion =>
          expect(t).to.contain("<h1>FFFFreeCodeCamp Back End Exercise: URL shortener microservice</h1>")));

    it("returns expected html result SHOULD FAIL", (): Chai.PromisedAssertion =>
      expect(fetch(serverUrl + "/").then((res: IResponse): Promise<string> => res.text()))
        .to.eventually.contain("<h1>FFFFreeCodeCamp Back End Exercise: URL shortener microservice</h1>"));

    it("returns expected html result SHOULD FAIL", (): Promise<Chai.Assertion> =>
      fetch(serverUrl + "QQQ/")
        .then((res: IResponse): Promise<string> => res.text())
        .then((t: string): Chai.Assertion =>
          expect(t).to.contain("<h1>FreeCodeCamp Back End Exercise: URL shortener microservice</h1>")));

    it("returns expected html result SHOULD FAIL", (): Chai.PromisedAssertion =>
      expect(fetch(serverUrl + "QQQ/").then((res: IResponse): Promise<string> => res.text()))
        .to.eventually.contain("<h1>FreeCodeCamp Back End Exercise: URL shortener microservice</h1>"));



    // it("returns expected html result", () => {
    //   expect(fetch(serverUrl + "/").then((res: IResponse) => res.text()))
    //     .to.eventually.contain("<h1>FreeCodeCamp Back End Exercise: URL shortener microservice</h1>");
    // });


    // it("returns expected html result SHOULD FAIL", () => {
    //   expect(fetch("QQ" + serverUrl + "/QQQQ").then((res: IResponse) => res.text()))
    //     .to.eventually.contain("<h1>FreeCodeCamp Back End Exercise: URL shortener microservice</h1>");
    // });


    // it("returns expected html result SHOULD FAIL", () => {
    //   expect(fetch(serverUrl + "/").then((res: IResponse) => res.text()))
    //     .to.eventually.contain("<h1>FFFFreeCodeCamp Back End Exercise: URL shortener microservice</h1>");
    // });


  });

  // describe("/bad_key (Invalid shortform)", () => {

  //   it("returns status 404", (done: MochaDone) => {
  //     promiseAssert(fetch(serverUrl + "/bad_key"), done, (res: IResponse): void => {
  //       chai.expect(res.status).to.equal(404);
  //     });
  //   });

  //   it("returns a Content-Type header for html and utf8", (done: MochaDone) => {
  //     promiseAssert(fetch(serverUrl + "/bad_key"), done, (res: IResponse): void => {
  //       chai.expect(res.headers.get("Content-Type").toLowerCase()).to.equal("text/html; charset=utf-8");
  //     });
  //   });

  //   it("returns expected html result", (done: MochaDone) => {
  //     let p: Promise<string> =
  //       fetch(serverUrl + "/bad_key")
  //         .then((res: IResponse) => res.text());
  //     promiseAssert(p, done, (t: string): void => {
  //       chai.expect(t).to.contain("Sorry");
  //     });
  //   });

  // });

  // describe("/missin (Valid but missing shortform", () => {

  //   it("returns status 404", (done: MochaDone) => {
  //     promiseAssert(fetch(serverUrl + "/missin"), done, (res: IResponse): void => {
  //       chai.expect(res.status).to.equal(404);
  //     });
  //   });

  //   it("returns a Content-Type header for html and utf8", (done: MochaDone) => {
  //     promiseAssert(fetch(serverUrl + "/missin"), done, (res: IResponse): void => {
  //       chai.expect(res.headers.get("Content-Type").toLowerCase()).to.equal("text/html; charset=utf-8");
  //     });
  //   });

  //   it("returns expected html result", (done: MochaDone) => {
  //     let p: Promise<string> =
  //       fetch(serverUrl + "/missin")
  //         .then((res: IResponse) => res.text());
  //     promiseAssert(p, done, (t: string): void => {
  //       chai.expect(t).to.contain("Sorry");
  //     });
  //   });

  // });

  // describe("Sequence test", () => {

  //   let o1: string = "http://first.com/";

  //   it("Creates new shortcut for " + o1 , (done: MochaDone) => {
  //     let p: Promise<APIResult> =
  //       fetch(serverUrl + "/new/" + o1)
  //         .then((res: IResponse) => res.json());
  //     promiseAssert(p, done, (r: APIResult): void => {
  //       chai.expect(r.original_url).to.equal(o1);
  //       chai.expect(r).to.have.property("short_url");
  //     });
  //   });

  //   it("Re-creates a shortcut for " + o1 , (done: MochaDone) => {
  //     let p: Promise<APIResult> =
  //       fetch(serverUrl + "/new/" + o1)
  //         .then((res: IResponse) => res.json());
  //     promiseAssert(p, done, (r: APIResult): void => {
  //       chai.expect(r.original_url).to.equal(o1);
  //       chai.expect(r).to.have.property("short_url");
  //     });
  //   });

  // });
});


