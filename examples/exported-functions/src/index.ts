import { add } from './add';
import { subtract } from './subtract';

export { add };

/**
 * A constant.
 * @type {string}
 */
export const CONST = 'FOO';

/**
 * A variable.
 */
export var VAR = 'BAR';

var VAR2 = "NOT EXPORTED";

/**
 * An enum.
 */
export enum ENUM {
  /**
   * This one is called a, the other has no doc.
   */
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
   * Generic interface function.
   */
  dummyFctExp: <T>(a: T) => void
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
