import { add } from './add';
import { subtract } from './subtract';

export { add, subtract };

/**
 * A constant.
 * @type {string}
 */
export const CONST = 'FOO';

/**
 * A variable.
 */
export var VAR = 'BAR';

/**
 * An enum.
 */
export enum ENUM {
  a = 1,
  b = 2
}

/**
 * An exported superclass.
 */
export class A {}

/**
 * An exported interface.
 */
export interface B {
  /**
   * Interface function.
   */
  dummyFctExp: () => void
}

export interface C extends B {}

/**
 * This is a dummy class with no real doc.
 *
 * @return a dummyClass instance
 */
export class dummyClass extends A implements B,C {
  private foo = 1;
  /**
   * The 'bar' variable.
   * @type {number}
   */
  public bar = 2;

  /**
   * Default Constructor.
   */
  constructor();
  /**
   * Constructor with foo.
   * @param foo its a number
   */
  public constructor(foo: number);
  /**
   * Constructor implementation.
   * @param bar
   */
  constructor(bar: any = 1)  {
    super();
    this.bar = bar;
  }

  private dummyFctNotExp() {};

  public dummyFctExp() {};
}
