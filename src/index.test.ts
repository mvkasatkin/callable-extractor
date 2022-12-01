import { CallableExtractor } from './index'
import * as path from 'path'
import { ErrorCallableNotFound } from './utils'

const FILEPATH = path.resolve(__dirname, '__test__/file1.ts')

describe('ce', () => {
  test('callables', () => {
    const variants = [
      'class MyClass { private method(p: number) { return p } }',
      'class MyClass { private prop = (p: number) => { return p } }',
      'function named (p: number) { return p }',
      'setTimeout(function () { return 1 }, 1000)',
      'setTimeout(() => 1, 1000)',
      'const named = (p: number) => { return p }',
      'const named = (p: number) => p',
      '(p: number) => p',
    ]
    for (const variant of variants) {
      const ce = new CallableExtractor(variant)
      const result = ce.getCallable().call(1)
      expect(result).toEqual(1)
    }
  })

  test('async callables', async () => {
    const variants = [
      'class MyClass { private async method(p: number) { return p } }',
      'class MyClass { private prop = async (p: number) => { return p } }',
      'setTimeout(async function () { return 1 }, 1000)',
      'async function named (p: number) { return p }',
      'const named = async (p: number) => { return p }',
      'const named = async (p: number) => p',
      'async (p: number) => p',
    ]
    for (const variant of variants) {
      const ce = new CallableExtractor(variant)
      const result = await ce.getCallable().call(1)
      expect(result).toEqual(1)
    }
  })

  test('constructors', () => {
    const variants = [
      'class MyClass { constructor(p: number) { this.p = p } }',
      'class MyClass { public constructor(p: number) { this.p = p } }',
      'class MyClass { private constructor(p: number) { this.p = p } }',
    ]
    for (const variant of variants) {
      const ce = new CallableExtractor(variant)
      const fn = ce.getCallable()
      fn.context = { p: 0 }
      fn.call(1)
      expect(fn.context.p).toEqual(1)
    }
  })

  test('getCallableByLineNumber', () => {
    let fn, result
    const ce = CallableExtractor.fromFile(FILEPATH)

    fn = ce.getCallableByLineNumber(14)
    result = fn.call(1)
    expect(result).toEqual(2)

    fn = ce.getCallableByLineNumber(20)
    result = fn.call(1)
    expect(result).toEqual(1)

    fn = ce.getCallableByLineNumber(20, 2)
    result = fn.call(1)
    expect(result).toEqual(2)

    fn = ce.getCallableByLineNumber(20, 3)
    result = fn.call(1)
    expect(result).toEqual(3)
  })

  test('getCallableByLineContent', () => {
    let fn, result
    const ce = CallableExtractor.fromFile(FILEPATH)

    fn = ce.getCallableByLineContent('public method1')
    result = fn.call(1)
    expect(result).toEqual(1)

    fn = ce.getCallableByLineContent('function func1')
    result = fn.call(1)
    expect(result).toEqual(2)

    fn = ce.getCallableByLineContent('f1 (p: number) {', 2)
    result = fn.call(1)
    expect(result).toEqual(2)

    fn = ce.getCallableByLineContent('f1 (p', 3)
    result = fn.call(1)
    expect(result).toEqual(3)
  })

  test('getCallableByName', () => {
    let fn, result
    const ce = CallableExtractor.fromFile(FILEPATH)

    fn = ce.getCallableByName('constructor', 'SomeClass')
    fn.context = { prop: '' }
    fn.call('aaa', 1)
    expect(fn.context.prop).toEqual('val-aaa-1')

    fn = ce.getCallableByName('method1', 'SomeClass')
    result = fn.call(1)
    expect(result).toEqual(1)

    fn = ce.getCallableByName('func1')
    result = fn.call(1)
    expect(result).toEqual(2)

    fn = ce.getCallableByName('func2')
    result = fn.call()
    expect(result).toEqual(3)

    fn = ce.getCallableByName('f1')
    result = fn.call(1)
    expect(result).toEqual(1)

    fn = ce.getCallableByName('f2')
    result = fn.call(1)
    expect(result).toEqual(2)

    fn = ce.getCallableByName('f3')
    result = fn.call(1)
    expect(result).toEqual(3)
  })

  test('context and scope', () => {
    const ce = new CallableExtractor('class MyClass { constructor(a: number) { this.prop += a + b } }')
    const fn = ce.getCallable()
    fn.context = { prop: 1 }
    fn.scope = { b: 2 }
    fn.call(3)
    expect(fn.context.prop).toEqual(6)
  })

  test('callable not found', () => {
    const ce = new CallableExtractor('')
    expect.assertions(4)
    try { ce.getCallable() } catch (e) { expect(e).toBeInstanceOf(ErrorCallableNotFound) }
    try { ce.getCallableByName('name') } catch (e) { expect(e).toBeInstanceOf(ErrorCallableNotFound) }
    try { ce.getCallableByLineNumber(1) } catch (e) { expect(e).toBeInstanceOf(ErrorCallableNotFound) }
    try { ce.getCallableByLineContent('') } catch (e) { expect(e).toBeInstanceOf(ErrorCallableNotFound) }
  })
})
