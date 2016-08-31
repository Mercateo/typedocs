/**
 * This function adds two summands.
 * @param a The first summand.
 * @param b The second summand.
 * @returns The sum.
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * another function in this sourcefile, that should not be recognized.
 * It's also an anonymous function :O
 */
const dummy = (defaultParam: number = 2, optionalParam?: number) => {}
