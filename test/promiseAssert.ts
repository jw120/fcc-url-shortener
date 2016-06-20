/** Helper function to wait for a promise, run the assertion and hand back to Mocha */
export function promiseAssert<T>(p: Promise<T>, done: MochaDone, assertion: ((x: T) => void)): void {
  p.then((val: T) => {
    assertion(val);
    done();
  }).catch((err: any) => {
    done(err);
  });
}
