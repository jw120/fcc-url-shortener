import * as debug from "debug";
const d: debug.IDebugger = debug("asyncthrow");

/** Throw given error asynchronously on next cycle */
export default function asyncThrow(e: Error): void {
    d(e.message || e);
    setTimeout((): void => {
      throw e;
    });
}

/**
 * Provides asyncThrow() to be used as .catch() in Promise chains to ensure any exceptions
 * are not silently ignored and instead are thrown asynchronosly so the browser will treat them
 * as exceptions (alternative is to use console.error)
 *
 * From https://stackoverflow.com/questions/33376308/es6-promises-swallow-type-errors
 *
 * "Unlike exceptions in synchronous code, which become uncaught as soon as code returns to idle, a browser
 * generally doesn't know the logical end of a promise-chain, which is where an asynchronous error could
 * be considered uncaught. Chains are dynamically assembled after all, and therefore better be terminated
 * with a final .catch at the logical end of the chain i.e. the asynchronous equivalent of idle.
 * ...
 * This will throw e, containing the original stack trace and line number, on the very next cycle,
 * and outside of the promise chain, where nothing will catch it and it will be reported as uncaught.
 *
 */



