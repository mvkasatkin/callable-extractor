# Callable Extractor

![npm](https://img.shields.io/npm/v/callable-extractor)
![NPM](https://img.shields.io/npm/l/callable-extractor)
[![Coverage Status](https://coveralls.io/repos/github/mvkasatkin/callable-extractor/badge.svg?branch=main)](https://coveralls.io/github/mvkasatkin/callable-extractor?branch=main)

This library is designed to help you test functions and methods that have not been exported from a file, but need to be tested. While testing the internal implementation is **bad practice**, there are still cases where it is necessary.  One of them is to **cover legacy code before refactoring**.

The library is built on top of [babel-parser](https://www.npmjs.com/package/@babel/parser) and uses eval under the hood - so be extremely careful and use this functionality judiciously, in an isolated testing context.

Javascript, Typescript and JSX/TSX are supported.

Install
```shell
npm i callable-extractor
```

Usage

```typescript
import { CallableExtractor } from 'callable-extractor'

test('Fetch function by name', () => {
  const ce = new CallableExtractor.fromFile(FILEPATH)
  const fn = ce.getCallableByName('myNotExportedSumFunc')
  const result = fn.call(1, 2)
  expect(result).toEqual(3)
})

test('Fetch any first callable', () => {
  const ce = new CallableExtractor.fromFile(FILEPATH)
  const fn = ce.getCallable()
  const result = fn.call(1, 2)
  expect(result).toEqual(3)
})

test('Fetch the second callable in the file', () => {
  const ce = new CallableExtractor.fromFile(FILEPATH)
  const fn = ce.getCallable(2)
  const result = fn.call(1, 2)
  expect(result).toEqual(3)
})

test('Fetch callable by line number', () => {
  const ce = new CallableExtractor.fromFile(FILEPATH)
  const fn = ce.getCallableByLineNumber(10)
  const result = fn.call(1, 2)
  expect(result).toEqual(3)
})

test('Fetch callable by line number, second in the line', () => {
  const ce = new CallableExtractor.fromFile(FILEPATH)
  const fn = ce.getCallableByLineNumber(10)
  const result = fn.call(1, 2)
  expect(result).toEqual(3)
})

test('Fetch callable by line content, partial match', () => {
  const ce = new CallableExtractor.fromFile(FILEPATH)
  const fn = ce.getCallableByLineContent('nction mySumFunc(')
  const result = fn.call(1, 2)
  expect(result).toEqual(3)
})

test('Fetch callable by name', () => {
  const ce = new CallableExtractor.fromFile(FILEPATH)
  const fn = ce.getCallableByName('mySumFunc')
  const result = fn.call(1, 2)
  expect(result).toEqual(3)
})

test('Fetch class method', () => {
  const ce = new CallableExtractor.fromFile(FILEPATH)
  const fn = ce.getCallableByName('mySumMethod', 'MyClass')
  const result = fn.call(1, 2)
  expect(result).toEqual(3)
})

test('Fetch class constructor, test with context and scope', () => {
  const ce = new CallableExtractor.fromFile(FILEPATH)
  const fn = ce.getCallableByName('constructor', 'MyClass') // constructor (a, b) { this.c = a + b + myGlobalVar }
  fn.context = { c: 0 }
  fn.scope = { myGlobalVar: 4 }
  fn.call(1, 2)
  expect(fn.context.c).toEqual(7)
})
```
