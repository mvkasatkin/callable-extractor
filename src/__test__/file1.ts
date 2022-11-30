// @ts-nocheck
/* eslint-disable */

export class SomeClass {
  protected prop: string

  public constructor (param1: string, param2: number) {
    this.prop = `val-${param1}-${param2}`
  }

  public method1 (param1: any): any { return param1 }
}

export function func1 (param1: number): number {
  return param1 + 1
}

export const func2 = (): number => { return 3 }

function f1 (p: number) { return p };const f2 = (p) => p + 1;const f3 = (p: number) => { return p + 2 }
