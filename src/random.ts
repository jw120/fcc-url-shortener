/** Simple function to generate a random string */

/** Generate a random string of given length, each character is in the set a-zA-Z0-9_ */
export function randomAlphanum(n: number): string {
  let acc: string = "";
  for (let i: number = 0; i < n; i++) {
    acc += randomAlphanumChar();
  }
  return acc;
}

/** Return a random \w character */
function randomAlphanumChar(): string {
  const possibles: string =
    "abcdefhjijklmnopqrstuvwxyz" +
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "01234567890_";
  return possibles.charAt(Math.random() * possibles.length);
}
