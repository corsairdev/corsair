# Rambda

`Rambda` is smaller and faster alternative to the popular functional programming library **Ramda**. - [Documentation](https://selfrefactor.github.io/rambda/#/)

[![codecov](https://codecov.io/gh/selfrefactor/rambda/branch/master/graph/badge.svg)](https://codecov.io/gh/selfrefactor/rambda)
![Commit activity](https://img.shields.io/github/commit-activity/y/selfrefactor/rambda)
![Library size](https://img.shields.io/bundlephobia/minzip/rambda)
[![install size](https://packagephobia.com/badge?p=rambda)](https://packagephobia.com/result?p=rambda)
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://github.com/selfrefactor/rambda/pulls)
[![GitHub contributors](https://img.shields.io/github/contributors/selfrefactor/rambda.svg)](https://github.com/selfrefactor/rambda/graphs/contributors)

## ❯ Example use

```javascript
import { compose, map, filter } from 'rambda'

const result = compose(
  map(x => x * 2),
  filter(x => x > 2)
)([1, 2, 3, 4])
// => [6, 8]
```

You can test this example in <a href="https://rambda.now.sh?const%20result%20%3D%20R.compose(%0A%20%20R.map(x%20%3D%3E%20x%20*%202)%2C%0A%20%20R.filter(x%20%3D%3E%20x%20%3E%202)%0A)(%5B1%2C%202%2C%203%2C%204%5D)%0A%0A%2F%2F%20%3D%3E%20%5B6%2C%208%5D">Rambda's REPL</a>

* [Differences between Rambda and Ramda](#differences-between-rambda-and-ramda)
* [API](#api)
* [Changelog](#-changelog)

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#-example-use)

## ❯ Rambda's advantages

### TypeScript included

TypeScript definitions are included in the library, in comparison to **Ramda**, where you need to additionally install `@types/ramda`.

Still, you need to be aware that functional programming features in `TypeScript` are in development, which means that using **R.compose/R.pipe** can be problematic.

Important - Rambda version `7.1.0`(or higher) requires TypeScript version `4.3.3`(or higher).

### Understandable source code due to little usage of internals

`Ramda` uses a lot of internals, which hides a lot of logic. Reading the full source code of a method can be challenging.

### Better VSCode experience

If the project is written in Javascript, then `go to source definition` action will lead you to actual implementation of the method.

### Immutable TS definitions

You can use immutable version of Rambda definitions, which is linted with ESLint `functional/prefer-readonly-type` plugin.

```
import {add} from 'rambda/immutable'
```

### Deno support

Latest version of **Ramba** available for `Deno` users is 3 years old. This is not the case with **Rambda** as most of recent releases are available for `Deno` users.

Also, `Rambda` provides you with included TS definitions:

```
// Deno extension(https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
// is installed and initialized
import * as R from "https://deno.land/x/rambda/mod.ts";
import * as Ramda from "https://deno.land/x/ramda/mod.ts";

R.add(1)('foo') // => will trigger warning in VSCode as it should
Ramda.add(1)('foo') // => will not trigger warning in VSCode
```

### Dot notation for `R.path`, `R.paths`, `R.assocPath` and `R.lensPath`

Standard usage of `R.path` is `R.path(['a', 'b'], {a: {b: 1} })`.

In **Rambda** you have the choice to use dot notation(which is arguably more readable):

```
R.path('a.b', {a: {b: 1} })
```

Please note that since path input is turned into array, i.e. if you want `R.path(['a','1', 'b'], {a: {'1': {b: 2}}})` to return `2`, you will have to pass array path, not string path. If you pass `a.1.b`, it will turn path input to `['a', 1, 'b']`.
The other side effect is in `R.assocPath` and `R.dissocPath`, where inputs such as `['a', '1', 'b']` will be turned into `['a', 1, 'b']`.

### Comma notation for `R.pick` and `R.omit`

Similar to dot notation, but the separator is comma(`,`) instead of dot(`.`).

```
R.pick('a,b', {a: 1 , b: 2, c: 3} })
// No space allowed between properties
```

### Speed

**Rambda** is generally more performant than `Ramda` as the [benchmarks](#-benchmarks) can prove that.

### Support

One of the main issues with `Ramda` is the slow process of releasing new versions. This is not the case with **Rambda** as releases are made on regular basis.

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#-rambdas-advantages)

## ❯ Missing Ramda methods

<details>
<summary>
  Click to see the full list of 46 Ramda methods not implemented in Rambda and their status.
</summary>

- construct - Using classes is not very functional programming oriented.
- constructN - same as above
- into - no support for transducer as it is overly complex to implement, understand and read.
- invert - overly complicated and limited use case
- invertObj
- invoker
- keysIn - we shouldn't encourage extending object with `.prototype` 
- lift
- liftN
- mapAccum - `Ramda` example doesn't looks convincing
- mapAccumRight
- memoizeWith - hard to imagine its usage in context of `R.pipe`/`R.compose`
- mergeDeepWith - limited use case
- mergeDeepWithKey
- mergeWithKey
- nAry - hard to argument about and hard to create meaningful TypeScript definitions
- nthArg - limited use case
- o - enough TypeScript issues with `R.pipe`/`R.compose` to add more composition methods
- otherwise - naming is confusing
- pair - `left-pad` types of debacles happens partially because of such methods that should not be hidden, bur rather part of your code base even if they need to exist.
- partialRight - I dislike `R.partial`, so I don't want to add more methods that are based on it
- pipeWith
- project - naming is confusing, but also limited use case
- promap
- reduceRight - I find `right/left` methods confusing so I added them only where it makes sense.
- reduceWhile - functions with 4 inputs - I think that even 3 is too much
- reduced
- remove - nice name but it is too generic. Also, `Rambdax` has such method and there it works very differently
- scan - hard to explain
- sequence
- splitWhenever
- symmetricDifferenceWith
- andThen
- toPairsIn
- transduce - currently is out of focus
- traverse - same as above
- unary
- uncurryN
- unfold - similar to `R.scan` and I find that it doesn't help with readability
- unionWith - why it has its usage, I want to limit number of methods that accept more than 2 arguments
- until
- useWith - hard to explain
- valuesIn
- xprod - limited use case
- thunkify
- __ - placeholder method allows user to further customize the method call. While, it seems useful initially, the price is too high in terms of complexity for TypeScript definitions. If it is not easy exressable in TypeScript, it is not worth it as **Rambda** is a TypeScript first library.

The following methods are not going to be added(reason for exclusion is provided as a comment):
</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#-missing-ramda-methods)
  
## ❯ Install

- **yarn add rambda**

- For UMD usage either use `./dist/rambda.umd.js` or the following CDN link:

```
https://unpkg.com/rambda@CURRENT_VERSION/dist/rambda.umd.js
```

- with deno

```
import {add} from "https://deno.land/x/rambda/mod.ts";
```

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#-install)

## Differences between Rambda and Ramda

- Rambda's **type** detects async functions and unresolved `Promises`. The returned values are `'Async'` and `'Promise'`.

- Rambda's **type** handles *NaN* input, in which case it returns `NaN`.

- Rambda's **forEach** can iterate over objects not only arrays.

- Rambda's **map**, **filter**, **partition** when they iterate over objects, they pass property and input object as predicate's argument.

- Rambda's **filter** returns empty array with bad input(`null` or `undefined`), while Ramda throws.

- Ramda's **clamp** work with strings, while Rambda's method work only with numbers.

- Ramda's **indexOf/lastIndexOf** work with strings and lists, while Rambda's method work only with lists as iterable input.

- Error handling, when wrong inputs are provided, may not be the same. This difference will be better documented once all brute force tests are completed.

- TypeScript definitions between `rambda` and `@types/ramda` may vary.

> If you need more **Ramda** methods in **Rambda**, you may either submit a `PR` or check the extended version of **Rambda** - [Rambdax](https://github.com/selfrefactor/rambdax). In case of the former, you may want to consult with [Rambda contribution guidelines.](CONTRIBUTING.md)

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#-differences-between-rambda-and-ramda)

## ❯ Benchmarks

<details>

<summary>
Click to expand all benchmark results

There are methods which are benchmarked only with `Ramda` and `Rambda`(i.e. no `Lodash`).

Note that some of these methods, are called with and without curring. This is done in order to give more detailed performance feedback.

The benchmarks results are produced from latest versions of *Rambda*, *Lodash*(4.17.21) and *Ramda*(0.30.1).

</summary>

method | Rambda | Ramda | Lodash
--- |--- | --- | ---
 *add* | 🚀 Fastest | 21.52% slower | 82.15% slower
 *adjust* | 8.48% slower | 🚀 Fastest | 🔳
 *all* | 🚀 Fastest | 7.18% slower | 🔳
 *allPass* | 🚀 Fastest | 88.25% slower | 🔳
 *allPass* | 🚀 Fastest | 98.56% slower | 🔳
 *and* | 🚀 Fastest | 89.09% slower | 🔳
 *any* | 🚀 Fastest | 92.87% slower | 45.82% slower
 *anyPass* | 🚀 Fastest | 98.25% slower | 🔳
 *append* | 🚀 Fastest | 2.07% slower | 🔳
 *applySpec* | 🚀 Fastest | 80.43% slower | 🔳
 *assoc* | 72.32% slower | 60.08% slower | 🚀 Fastest
 *clone* | 🚀 Fastest | 91.86% slower | 86.48% slower
 *compose* | 6.07% slower | 16.89% slower | 🚀 Fastest
 *converge* | 78.63% slower | 🚀 Fastest | 🔳
 *curry* | 🚀 Fastest | 28.86% slower | 🔳
 *curryN* | 🚀 Fastest | 41.05% slower | 🔳
 *defaultTo* | 🚀 Fastest | 48.91% slower | 🔳
 *drop* | 🚀 Fastest | 82.35% slower | 🔳
 *dropLast* | 🚀 Fastest | 86.74% slower | 🔳
 *equals* | 58.37% slower | 96.73% slower | 🚀 Fastest
 *filter* | 6.7% slower | 72.03% slower | 🚀 Fastest
 *find* | 🚀 Fastest | 85.14% slower | 42.65% slower
 *findIndex* | 🚀 Fastest | 86.48% slower | 72.27% slower
 *flatten* | 🚀 Fastest | 85.68% slower | 3.57% slower
 *ifElse* | 🚀 Fastest | 58.56% slower | 🔳
 *includes* | 🚀 Fastest | 81.64% slower | 🔳
 *indexOf* | 🚀 Fastest | 80.17% slower | 🔳
 *indexOf* | 🚀 Fastest | 82.2% slower | 🔳
 *init* | 🚀 Fastest | 92.24% slower | 13.3% slower
 *is* | 🚀 Fastest | 57.69% slower | 🔳
 *isEmpty* | 🚀 Fastest | 97.14% slower | 54.99% slower
 *last* | 🚀 Fastest | 93.43% slower | 5.28% slower
 *lastIndexOf* | 🚀 Fastest | 85.19% slower | 🔳
 *map* | 🚀 Fastest | 86.6% slower | 11.73% slower
 *match* | 🚀 Fastest | 44.83% slower | 🔳
 *merge* | 🚀 Fastest | 12.21% slower | 55.76% slower
 *none* | 🚀 Fastest | 96.48% slower | 🔳
 *objOf* | 🚀 Fastest | 38.05% slower | 🔳
 *omit* | 🚀 Fastest | 69.95% slower | 97.34% slower
 *over* | 🚀 Fastest | 56.23% slower | 🔳
 *path* | 37.81% slower | 77.81% slower | 🚀 Fastest
 *pick* | 🚀 Fastest | 19.07% slower | 80.2% slower
 *pipe* | 🚀 Fastest | 0.11% slower | 🔳
 *prop* | 🚀 Fastest | 87.95% slower | 🔳
 *propEq* | 🚀 Fastest | 91.92% slower | 🔳
 *range* | 🚀 Fastest | 61.8% slower | 57.44% slower
 *reduce* | 60.48% slower | 77.1% slower | 🚀 Fastest
 *repeat* | 48.57% slower | 68.98% slower | 🚀 Fastest
 *replace* | 33.45% slower | 33.99% slower | 🚀 Fastest
 *set* | 🚀 Fastest | 50.35% slower | 🔳
 *sort* | 🚀 Fastest | 40.23% slower | 🔳
 *sortBy* | 🚀 Fastest | 25.29% slower | 56.88% slower
 *split* | 🚀 Fastest | 55.37% slower | 17.64% slower
 *splitEvery* | 🚀 Fastest | 71.98% slower | 🔳
 *take* | 🚀 Fastest | 91.96% slower | 4.72% slower
 *takeLast* | 🚀 Fastest | 93.39% slower | 19.22% slower
 *test* | 🚀 Fastest | 82.34% slower | 🔳
 *type* | 🚀 Fastest | 48.6% slower | 🔳
 *uniq* | 🚀 Fastest | 84.9% slower | 🔳
 *uniqBy* | 51.93% slower | 🚀 Fastest | 🔳
 *uniqWith* | 8.29% slower | 🚀 Fastest | 🔳
 *uniqWith* | 14.23% slower | 🚀 Fastest | 🔳
 *update* | 🚀 Fastest | 52.35% slower | 🔳
 *view* | 🚀 Fastest | 76.15% slower | 🔳

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#-benchmarks)

## ❯ Used by

- [ESLint plugin Mocha](https://www.npmjs.com/package/eslint-plugin-mocha)

- [WatermelonDB](https://github.com/Nozbe/WatermelonDB)

- [Walmart Canada](https://www.walmart.ca) reported by [w-b-dev](https://github.com/w-b-dev) 

- [VSCode Slack integration](https://github.com/verydanny/vcslack)

- [Webpack PostCSS](https://github.com/sectsect/webpack-postcss)

- [MobX-State-Tree decorators](https://github.com/farwayer/mst-decorators)

- [Rewrite of the Betaflight configurator](https://github.com/freshollie/fresh-configurator)

- [MineFlayer plugin](https://github.com/G07cha/MineflayerArmorManager)

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#-used-by)

## API

### add

It adds `a` and `b`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.add(2%2C%203)%20%2F%2F%20%3D%3E%20%205">Try this <strong>R.add</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#add)

### addIndex

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.addIndex(R.map)((val%2C%20idx)%20%3D%3E%20val%20%2B%20idx%20%2B%201%2C%20%5B1%2C%202%2C%203%5D)%0A%2F%2F%20%3D%3E%20%5B2%2C%204%2C%206%5D">Try this <strong>R.addIndex</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#addIndex)

### addIndexRight

Same as `R.addIndex`, but it will passed indexes are decreasing, instead of increasing.

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#addIndexRight)

### adjust

```typescript

adjust<T>(index: number, replaceFn: (x: T) => T, list: T[]): T[]
```

It replaces `index` in array `list` with the result of `replaceFn(list[i])`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.adjust(%0A%20%200%2C%0A%20%20a%20%3D%3E%20a%20%2B%201%2C%0A%20%20%5B0%2C%20100%5D%0A)%20%2F%2F%20%3D%3E%20%5B1%2C%20100%5D">Try this <strong>R.adjust</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
adjust<T>(index: number, replaceFn: (x: T) => T, list: T[]): T[];
adjust<T>(index: number, replaceFn: (x: T) => T): (list: T[]) => T[];
```

</details>

<details>

<summary><strong>R.adjust</strong> source</summary>

```javascript
import { cloneList } from './_internals/cloneList.js'
import { curry } from './curry.js'

function adjustFn(
  index, replaceFn, list
){
  const actualIndex = index < 0 ? list.length + index : index
  if (index >= list.length || actualIndex < 0) return list

  const clone = cloneList(list)
  clone[ actualIndex ] = replaceFn(clone[ actualIndex ])

  return clone
}

export const adjust = curry(adjustFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { add } from './add.js'
import { adjust } from './adjust.js'
import { pipe } from './pipe.js'

const list = [ 0, 1, 2 ]
const expected = [ 0, 11, 2 ]

test('happy', () => {})

test('happy', () => {
  expect(adjust(
    1, add(10), list
  )).toEqual(expected)
})

test('with curring type 1 1 1', () => {
  expect(adjust(1)(add(10))(list)).toEqual(expected)
})

test('with curring type 1 2', () => {
  expect(adjust(1)(add(10), list)).toEqual(expected)
})

test('with curring type 2 1', () => {
  expect(adjust(1, add(10))(list)).toEqual(expected)
})

test('with negative index', () => {
  expect(adjust(
    -2, add(10), list
  )).toEqual(expected)
})

test('when index is out of bounds', () => {
  const list = [ 0, 1, 2, 3 ]
  expect(adjust(
    4, add(1), list
  )).toEqual(list)
  expect(adjust(
    -5, add(1), list
  )).toEqual(list)
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#adjust)

### all

```typescript

all<T>(predicate: (x: T) => boolean, list: T[]): boolean
```

It returns `true`, if all members of array `list` returns `true`, when applied as argument to `predicate` function.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%200%2C%201%2C%202%2C%203%2C%204%20%5D%0Aconst%20predicate%20%3D%20x%20%3D%3E%20x%20%3E%20-1%0A%0Aconst%20result%20%3D%20R.all(predicate%2C%20list)%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.all</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
all<T>(predicate: (x: T) => boolean, list: T[]): boolean;
all<T>(predicate: (x: T) => boolean): (list: T[]) => boolean;
```

</details>

<details>

<summary><strong>R.all</strong> source</summary>

```javascript
export function all(predicate, list){
  if (arguments.length === 1) return _list => all(predicate, _list)

  for (let i = 0; i < list.length; i++){
    if (!predicate(list[ i ])) return false
  }

  return true
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { all } from './all.js'

const list = [ 0, 1, 2, 3, 4 ]

test('when true', () => {
  const fn = x => x > -1

  expect(all(fn)(list)).toBeTrue()
})

test('when false', () => {
  const fn = x => x > 2

  expect(all(fn, list)).toBeFalse()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {all} from 'rambda'

describe('all', () => {
  it('happy', () => {
    const result = all(
      x => {
        x // $ExpectType number
        return x > 0
      },
      [1, 2, 3]
    )
    result // $ExpectType boolean
  })
  it('curried needs a type', () => {
    const result = all<number>(x => {
      x // $ExpectType number
      return x > 0
    })([1, 2, 3])
    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#all)

### allPass

```typescript

allPass<T>(predicates: ((x: T) => boolean)[]): (input: T) => boolean
```

It returns `true`, if all functions of `predicates` return `true`, when `input` is their argument.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20input%20%3D%20%7B%0A%20%20a%20%3A%201%2C%0A%20%20b%20%3A%202%2C%0A%7D%0Aconst%20predicates%20%3D%20%5B%0A%20%20x%20%3D%3E%20x.a%20%3D%3D%3D%201%2C%0A%20%20x%20%3D%3E%20x.b%20%3D%3D%3D%202%2C%0A%5D%0Aconst%20result%20%3D%20R.allPass(predicates)(input)%20%2F%2F%20%3D%3E%20true">Try this <strong>R.allPass</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
allPass<T>(predicates: ((x: T) => boolean)[]): (input: T) => boolean;
allPass<T>(predicates: ((...inputs: T[]) => boolean)[]): (...inputs: T[]) => boolean;
```

</details>

<details>

<summary><strong>R.allPass</strong> source</summary>

```javascript
export function allPass(predicates){
  return (...input) => {
    let counter = 0
    while (counter < predicates.length){
      if (!predicates[ counter ](...input)){
        return false
      }
      counter++
    }

    return true
  }
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { allPass } from './allPass.js'

test('happy', () => {
  const rules = [ x => typeof x === 'number', x => x > 10, x => x * 7 < 100 ]

  expect(allPass(rules)(11)).toBeTrue()

  expect(allPass(rules)(undefined)).toBeFalse()
})

test('when returns true', () => {
  const conditionArr = [ val => val.a === 1, val => val.b === 2 ]

  expect(allPass(conditionArr)({
    a : 1,
    b : 2,
  })).toBeTrue()
})

test('when returns false', () => {
  const conditionArr = [ val => val.a === 1, val => val.b === 3 ]

  expect(allPass(conditionArr)({
    a : 1,
    b : 2,
  })).toBeFalse()
})

test('works with multiple inputs', () => {
  const fn = function (
    w, x, y, z
  ){
    return w + x === y + z
  }
  expect(allPass([ fn ])(
    3, 3, 3, 3
  )).toBeTrue()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {allPass, filter} from 'rambda'

describe('allPass', () => {
  it('happy', () => {
    const x = allPass<number>([
      y => {
        y // $ExpectType number
        return typeof y === 'number'
      },
      y => {
        return y > 0
      },
    ])(11)

    x // $ExpectType boolean
  })
  it('issue #642', () => {
    const isGreater = (num: number) => num > 5
    const pred = allPass([isGreater])
    const xs = [0, 1, 2, 3]

    const filtered1 = filter(pred)(xs)
    filtered1 // $ExpectType number[]
    const filtered2 = xs.filter(pred)
    filtered2 // $ExpectType number[]
  })
  it('issue #604', () => {
    const plusEq = function(w: number, x: number, y: number, z: number) {
      return w + x === y + z
    }
    const result = allPass([plusEq])(3, 3, 3, 3)

    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#allPass)

### always

It returns function that always returns `x`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20R.always(7)%0A%0Aconst%20result%20%3D%20fn()%0A%2F%2F%20%3D%3E%207">Try this <strong>R.always</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#always)

### and

Logical AND

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?R.and(true%2C%20true)%3B%20%2F%2F%20%3D%3E%20true%0AR.and(false%2C%20true)%3B%20%2F%2F%20%3D%3E%20false%0Aconst%20result%20%3D%20R.and(true%2C%20'foo')%3B%20%2F%2F%20%3D%3E%20'foo'">Try this <strong>R.and</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#and)

### any

```typescript

any<T>(predicate: (x: T) => boolean, list: T[]): boolean
```

It returns `true`, if at least one member of `list` returns true, when passed to a `predicate` function.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%5D%0Aconst%20predicate%20%3D%20x%20%3D%3E%20x%20*%20x%20%3E%208%0Aconst%20result%20%3D%20R.any(fn%2C%20list)%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.any</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
any<T>(predicate: (x: T) => boolean, list: T[]): boolean;
any<T>(predicate: (x: T) => boolean): (list: T[]) => boolean;
```

</details>

<details>

<summary><strong>R.any</strong> source</summary>

```javascript
export function any(predicate, list){
  if (arguments.length === 1) return _list => any(predicate, _list)

  let counter = 0
  while (counter < list.length){
    if (predicate(list[ counter ], counter)){
      return true
    }
    counter++
  }

  return false
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { any } from './any.js'

const list = [ 1, 2, 3 ]

test('happy', () => {
  expect(any(x => x < 0, list)).toBeFalse()
})

test('with curry', () => {
  expect(any(x => x > 2)(list)).toBeTrue()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {any} from 'rambda'

describe('R.any', () => {
  it('happy', () => {
    const result = any(
      x => {
        x // $ExpectType number
        return x > 2
      },
      [1, 2, 3]
    )
    result // $ExpectType boolean
  })

  it('when curried needs a type', () => {
    const result = any<number>(x => {
      x // $ExpectType number
      return x > 2
    })([1, 2, 3])
    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#any)

### anyPass

```typescript

anyPass<T>(predicates: ((x: T) => boolean)[]): (input: T) => boolean
```

It accepts list of `predicates` and returns a function. This function with its `input` will return `true`, if any of `predicates` returns `true` for this `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20isBig%20%3D%20x%20%3D%3E%20x%20%3E%2020%0Aconst%20isOdd%20%3D%20x%20%3D%3E%20x%20%25%202%20%3D%3D%3D%201%0Aconst%20input%20%3D%2011%0A%0Aconst%20fn%20%3D%20R.anyPass(%0A%20%20%5BisBig%2C%20isOdd%5D%0A)%0A%0Aconst%20result%20%3D%20fn(input)%20%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.anyPass</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
anyPass<T>(predicates: ((x: T) => boolean)[]): (input: T) => boolean;
anyPass<T>(predicates: ((...inputs: T[]) => boolean)[]): (...inputs: T[]) => boolean;
```

</details>

<details>

<summary><strong>R.anyPass</strong> source</summary>

```javascript
export function anyPass(predicates){
  return (...input) => {
    let counter = 0
    while (counter < predicates.length){
      if (predicates[ counter ](...input)){
        return true
      }
      counter++
    }

    return false
  }
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { anyPass } from './anyPass.js'

test('happy', () => {
  const rules = [ x => typeof x === 'string', x => x > 10 ]
  const predicate = anyPass(rules)
  expect(predicate('foo')).toBeTrue()
  expect(predicate(6)).toBeFalse()
})

test('happy', () => {
  const rules = [ x => typeof x === 'string', x => x > 10 ]

  expect(anyPass(rules)(11)).toBeTrue()
  expect(anyPass(rules)(undefined)).toBeFalse()
})

const obj = {
  a : 1,
  b : 2,
}

test('when returns true', () => {
  const conditionArr = [ val => val.a === 1, val => val.a === 2 ]

  expect(anyPass(conditionArr)(obj)).toBeTrue()
})

test('when returns false + curry', () => {
  const conditionArr = [ val => val.a === 2, val => val.b === 3 ]

  expect(anyPass(conditionArr)(obj)).toBeFalse()
})

test('with empty predicates list', () => {
  expect(anyPass([])(3)).toBeFalse()
})

test('works with multiple inputs', () => {
  const fn = function (
    w, x, y, z
  ){
    console.log(
      w, x, y, z
    )

    return w + x === y + z
  }
  expect(anyPass([ fn ])(
    3, 3, 3, 3
  )).toBeTrue()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {anyPass, filter} from 'rambda'

describe('anyPass', () => {
  it('happy', () => {
    const x = anyPass<number>([
      y => {
        y // $ExpectType number
        return typeof y === 'number'
      },
      y => {
        return y > 0
      },
    ])(11)

    x // $ExpectType boolean
  })
  it('issue #604', () => {
    const plusEq = function(w: number, x: number, y: number, z: number) {
      return w + x === y + z
    }
    const result = anyPass([plusEq])(3, 3, 3, 3)

    result // $ExpectType boolean
  })
  it('issue #642', () => {
    const isGreater = (num: number) => num > 5
    const pred = anyPass([isGreater])
    const xs = [0, 1, 2, 3]

    const filtered1 = filter(pred)(xs)
    filtered1 // $ExpectType number[]
    const filtered2 = xs.filter(pred)
    filtered2 // $ExpectType number[]
  })
  it('functions as a type guard', () => {
    const isString = (x: unknown): x is string => typeof x === 'string'
    const isNumber = (x: unknown): x is number => typeof x === 'number'
    const isBoolean = (x: unknown): x is boolean => typeof x === 'boolean'

    const isStringNumberOrBoolean = anyPass([isString, isNumber, isBoolean])

    isStringNumberOrBoolean // $ExpectType (input: unknown) => boolean

    const aValue: unknown = 1

    if (isStringNumberOrBoolean(aValue)) {
      aValue // $ExpectType unknown
    }
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#anyPass)

### ap

```typescript

ap<T, U>(fns: Array<(a: T) => U>[], vs: T[]): U[]
```

It takes a list of functions and a list of values. Then it returns a list of values obtained by applying each function to each value.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.ap(%0A%20%20%5B%0A%20%20%20%20x%20%3D%3E%20x%20%2B%201%2C%0A%20%20%20%20x%20%3D%3E%20x%20%2B%202%2C%0A%20%20%5D%2C%0A%20%20%5B1%2C%202%2C%203%5D%0A)%0A%2F%2F%20%3D%3E%20%5B2%2C%203%2C%204%2C%203%2C%204%2C%205%5D">Try this <strong>R.ap</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
ap<T, U>(fns: Array<(a: T) => U>[], vs: T[]): U[];
ap<T, U>(fns: Array<(a: T) => U>): (vs: T[]) => U[];
ap<R, A, B>(fn: (r: R, a: A) => B, fn1: (r: R) => A): (r: R) => B;
```

</details>

<details>

<summary><strong>R.ap</strong> source</summary>

```javascript
export function ap(functions, input){
  if (arguments.length === 1){
    return _inputs => ap(functions, _inputs)
  }

  return functions.reduce((acc, fn) => [ ...acc, ...input.map(fn) ], [])
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { ap } from './ap.js'

function mult2(x){
  return x * 2
}
function plus3(x){
  return x + 3
}

test('happy', () => {
  expect(ap([ mult2, plus3 ], [ 1, 2, 3 ])).toEqual([ 2, 4, 6, 4, 5, 6 ])
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#ap)

### aperture

```typescript

aperture<N extends number, T>(n: N, list: T[]): Array<Tuple<T, N>> | []
```

It returns a new list, composed of consecutive `n`-tuples from a `list`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.aperture(2%2C%20%5B1%2C%202%2C%203%2C%204%5D)%0A%2F%2F%20%3D%3E%20%5B%5B1%2C%202%5D%2C%20%5B2%2C%203%5D%2C%20%5B3%2C%204%5D%5D">Try this <strong>R.aperture</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
aperture<N extends number, T>(n: N, list: T[]): Array<Tuple<T, N>> | [];
aperture<N extends number>(n: N): <T>(list: T[]) => Array<Tuple<T, N>> | [];
```

</details>

<details>

<summary><strong>R.aperture</strong> source</summary>

```javascript
export function aperture(step, list){
  if (arguments.length === 1){
    return _list => aperture(step, _list)
  }
  if (step > list.length) return []
  let idx = 0
  const limit = list.length - (step - 1)
  const acc = new Array(limit)
  while (idx < limit){
    acc[ idx ] = list.slice(idx, idx + step)
    idx += 1
  }

  return acc
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { aperture } from './aperture.js'

const list = [ 1, 2, 3, 4, 5, 6, 7 ]

test('happy', () => {
  expect(aperture(1, list)).toEqual([ [ 1 ], [ 2 ], [ 3 ], [ 4 ], [ 5 ], [ 6 ], [ 7 ] ])
  expect(aperture(2, list)).toEqual([
    [ 1, 2 ],
    [ 2, 3 ],
    [ 3, 4 ],
    [ 4, 5 ],
    [ 5, 6 ],
    [ 6, 7 ],
  ])
  expect(aperture(3, list)).toEqual([
    [ 1, 2, 3 ],
    [ 2, 3, 4 ],
    [ 3, 4, 5 ],
    [ 4, 5, 6 ],
    [ 5, 6, 7 ],
  ])
  expect(aperture(8, list)).toEqual([])
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#aperture)

### append

```typescript

append<T>(xToAppend: T, iterable: T[]): T[]
```

It adds element `x` at the end of `iterable`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20x%20%3D%20'foo'%0A%0Aconst%20result%20%3D%20R.append(x%2C%20%5B'bar'%2C%20'baz'%5D)%0A%2F%2F%20%3D%3E%20%5B'bar'%2C%20'baz'%2C%20'foo'%5D">Try this <strong>R.append</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
append<T>(xToAppend: T, iterable: T[]): T[];
append<T, U>(xToAppend: T, iterable: IsFirstSubtypeOfSecond<T, U>[]) : U[];
append<T>(xToAppend: T): <U>(iterable: IsFirstSubtypeOfSecond<T, U>[]) => U[];
append<T>(xToAppend: T): (iterable: T[]) => T[];
```

</details>

<details>

<summary><strong>R.append</strong> source</summary>

```javascript
import { cloneList } from './_internals/cloneList.js'

export function append(x, input){
  if (arguments.length === 1) return _input => append(x, _input)

  if (typeof input === 'string') return input.split('').concat(x)

  const clone = cloneList(input)
  clone.push(x)

  return clone
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { append } from './append.js'

test('happy', () => {
  expect(append('tests', [ 'write', 'more' ])).toEqual([
    'write',
    'more',
    'tests',
  ])
})

test('append to empty array', () => {
  expect(append('tests')([])).toEqual([ 'tests' ])
})

test('with strings', () => {
  expect(append('o', 'fo')).toEqual([ 'f', 'o', 'o' ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {append, prepend} from 'rambda'

const listOfNumbers = [1, 2, 3]
const listOfNumbersAndStrings = [1, 'b', 3]

describe('R.append/R.prepend', () => {
  describe("with the same primitive type as the array's elements", () => {
    it('uncurried', () => {
      // @ts-expect-error
      append('d', listOfNumbers)
      // @ts-expect-error
      prepend('d', listOfNumbers)
      append(4, listOfNumbers) // $ExpectType number[]
      prepend(4, listOfNumbers) // $ExpectType number[]
    })

    it('curried', () => {
      // @ts-expect-error
      append('d')(listOfNumbers)
      append(4)(listOfNumbers) // $ExpectType number[]
      prepend(4)(listOfNumbers) // $ExpectType number[]
    })
  })

  describe("with a subtype of the array's elements", () => {
    it('uncurried', () => {
      // @ts-expect-error
      append(true, listOfNumbersAndStrings)
      append(4, listOfNumbersAndStrings) // $ExpectType (string | number)[]
      prepend(4, listOfNumbersAndStrings) // $ExpectType (string | number)[]
    })

    it('curried', () => {
      // @ts-expect-error
      append(true)(listOfNumbersAndStrings)
      append(4)(listOfNumbersAndStrings) // $ExpectType (string | number)[]
      prepend(4)(listOfNumbersAndStrings) // $ExpectType (string | number)[]
    })
  })

  describe("expanding the type of the array's elements", () => {
    it('uncurried', () => {
      // @ts-expect-error
      append('d', listOfNumbers)
      append<string | number>('d', listOfNumbers) // $ExpectType (string | number)[]
      prepend<string | number>('d', listOfNumbers) // $ExpectType (string | number)[]
    })

    it('curried', () => {
      // @ts-expect-error
      append('d')(listOfNumbers)
      const appendD = append('d')
      appendD<string | number>(listOfNumbers) // $ExpectType (string | number)[]
      const prependD = prepend('d')
      prependD<string | number>(listOfNumbers) // $ExpectType (string | number)[]
    })
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#append)

### apply

```typescript

apply<T = any>(fn: (...args: any[]) => T, args: any[]): T
```

It applies function `fn` to the list of arguments. 

This is useful for creating a fixed-arity function from a variadic function. `fn` should be a bound function if context is significant.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.apply(Math.max%2C%20%5B42%2C%20-Infinity%2C%201337%5D)%0A%2F%2F%20%3D%3E%201337">Try this <strong>R.apply</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
apply<T = any>(fn: (...args: any[]) => T, args: any[]): T;
apply<T = any>(fn: (...args: any[]) => T): (args: any[]) => T;
```

</details>

<details>

<summary><strong>R.apply</strong> source</summary>

```javascript
export function apply(fn, args){
  if (arguments.length === 1){
    return _args => apply(fn, _args)
  }

  return fn.apply(this, args)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { apply } from './apply.js'
import { bind } from './bind.js'
import { identity } from './identity.js'

test('happy', () => {
  expect(apply(identity, [ 1, 2, 3 ])).toBe(1)
})

test('applies function to argument list', () => {
  expect(apply(Math.max, [ 1, 2, 3, -99, 42, 6, 7 ])).toBe(42)
})

test('provides no way to specify context', () => {
  const obj = {
    method (){
      return this === obj
    },
  }
  expect(apply(obj.method, [])).toBeFalse()
  expect(apply(bind(obj.method, obj), [])).toBeTrue()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {apply, identity} from 'rambda'

describe('R.apply', () => {
  it('happy', () => {
    const result = apply<number>(identity, [1, 2, 3])

    result // $ExpectType number
  })
  it('curried', () => {
    const fn = apply<number>(identity)
    const result = fn([1, 2, 3])

    result // $ExpectType number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#apply)

### applySpec

```typescript

applySpec<Spec extends Record<string, AnyFunction>>(
  spec: Spec
): (
  ...args: Parameters<ValueOfRecord<Spec>>
) => { [Key in keyof Spec]: ReturnType<Spec[Key]> }
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20R.applySpec(%7B%0A%20%20sum%3A%20R.add%2C%0A%20%20nested%3A%20%7B%20mul%3A%20R.multiply%20%7D%0A%7D)%0Aconst%20result%20%3D%20fn(2%2C%204)%20%0A%2F%2F%20%3D%3E%20%7B%20sum%3A%206%2C%20nested%3A%20%7B%20mul%3A%208%20%7D%20%7D">Try this <strong>R.applySpec</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
applySpec<Spec extends Record<string, AnyFunction>>(
  spec: Spec
): (
  ...args: Parameters<ValueOfRecord<Spec>>
) => { [Key in keyof Spec]: ReturnType<Spec[Key]> };
applySpec<T>(spec: any): (...args: unknown[]) => T;
```

</details>

<details>

<summary><strong>R.applySpec</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'

// recursively traverse the given spec object to find the highest arity function
export function __findHighestArity(spec, max = 0){
  for (const key in spec){
    if (spec.hasOwnProperty(key) === false || key === 'constructor') continue

    if (typeof spec[ key ] === 'object'){
      max = Math.max(max, __findHighestArity(spec[ key ]))
    }

    if (typeof spec[ key ] === 'function'){
      max = Math.max(max, spec[ key ].length)
    }
  }

  return max
}

function __filterUndefined(){
  const defined = []
  let i = 0
  const l = arguments.length
  while (i < l){
    if (typeof arguments[ i ] === 'undefined') break
    defined[ i ] = arguments[ i ]
    i++
  }

  return defined
}

function __applySpecWithArity(
  spec, arity, cache
){
  const remaining = arity - cache.length

  if (remaining === 1)
    return x =>
      __applySpecWithArity(
        spec, arity, __filterUndefined(...cache, x)
      )
  if (remaining === 2)
    return (x, y) =>
      __applySpecWithArity(
        spec, arity, __filterUndefined(
          ...cache, x, y
        )
      )
  if (remaining === 3)
    return (
      x, y, z
    ) =>
      __applySpecWithArity(
        spec, arity, __filterUndefined(
          ...cache, x, y, z
        )
      )
  if (remaining === 4)
    return (
      x, y, z, a
    ) =>
      __applySpecWithArity(
        spec,
        arity,
        __filterUndefined(
          ...cache, x, y, z, a
        )
      )
  if (remaining > 4)
    return (...args) =>
      __applySpecWithArity(
        spec, arity, __filterUndefined(...cache, ...args)
      )

  // handle spec as Array
  if (isArray(spec)){
    const ret = []
    let i = 0
    const l = spec.length
    for (; i < l; i++){
      // handle recursive spec inside array
      if (typeof spec[ i ] === 'object' || isArray(spec[ i ])){
        ret[ i ] = __applySpecWithArity(
          spec[ i ], arity, cache
        )
      }
      // apply spec to the key
      if (typeof spec[ i ] === 'function'){
        ret[ i ] = spec[ i ](...cache)
      }
    }

    return ret
  }

  // handle spec as Object
  const ret = {}
  // apply callbacks to each property in the spec object
  for (const key in spec){
    if (spec.hasOwnProperty(key) === false || key === 'constructor') continue

    // apply the spec recursively
    if (typeof spec[ key ] === 'object'){
      ret[ key ] = __applySpecWithArity(
        spec[ key ], arity, cache
      )
      continue
    }

    // apply spec to the key
    if (typeof spec[ key ] === 'function'){
      ret[ key ] = spec[ key ](...cache)
    }
  }

  return ret
}

export function applySpec(spec, ...args){
  // get the highest arity spec function, cache the result and pass to __applySpecWithArity
  const arity = __findHighestArity(spec)

  if (arity === 0){
    return () => ({})
  }
  const toReturn = __applySpecWithArity(
    spec, arity, args
  )

  return toReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { applySpec as applySpecRamda, nAry } from 'ramda'

import {
  add,
  always,
  compose,
  dec,
  inc,
  map,
  path,
  prop,
  T,
} from '../rambda.js'
import { applySpec } from './applySpec.js'

test('different than Ramda when bad spec', () => {
  const result = applySpec({ sum : { a : 1 } })(1, 2)
  const ramdaResult = applySpecRamda({ sum : { a : 1 } })(1, 2)
  expect(result).toEqual({})
  expect(ramdaResult).toEqual({ sum : { a : {} } })
})

test('works with empty spec', () => {
  expect(applySpec({})()).toEqual({})
  expect(applySpec([])(1, 2)).toEqual({})
  expect(applySpec(null)(1, 2)).toEqual({})
})

test('works with unary functions', () => {
  const result = applySpec({
    v : inc,
    u : dec,
  })(1)
  const expected = {
    v : 2,
    u : 0,
  }
  expect(result).toEqual(expected)
})

test('works with binary functions', () => {
  const result = applySpec({ sum : add })(1, 2)
  expect(result).toEqual({ sum : 3 })
})

test('works with nested specs', () => {
  const result = applySpec({
    unnested : always(0),
    nested   : { sum : add },
  })(1, 2)
  const expected = {
    unnested : 0,
    nested   : { sum : 3 },
  }
  expect(result).toEqual(expected)
})

test('works with arrays of nested specs', () => {
  const result = applySpec({
    unnested : always(0),
    nested   : [ { sum : add } ],
  })(1, 2)

  expect(result).toEqual({
    unnested : 0,
    nested   : [ { sum : 3 } ],
  })
})

test('works with arrays of spec objects', () => {
  const result = applySpec([ { sum : add } ])(1, 2)

  expect(result).toEqual([ { sum : 3 } ])
})

test('works with arrays of functions', () => {
  const result = applySpec([ map(prop('a')), map(prop('b')) ])([
    {
      a : 'a1',
      b : 'b1',
    },
    {
      a : 'a2',
      b : 'b2',
    },
  ])
  const expected = [
    [ 'a1', 'a2' ],
    [ 'b1', 'b2' ],
  ]
  expect(result).toEqual(expected)
})

test('works with a spec defining a map key', () => {
  expect(applySpec({ map : prop('a') })({ a : 1 })).toEqual({ map : 1 })
})

test('cannot retains the highest arity', () => {
  const f = applySpec({
    f1 : nAry(2, T),
    f2 : nAry(5, T),
  })
  const fRamda = applySpecRamda({
    f1 : nAry(2, T),
    f2 : nAry(5, T),
  })
  expect(f).toHaveLength(0)
  expect(fRamda).toHaveLength(5)
})

test('returns a curried function', () => {
  expect(applySpec({ sum : add })(1)(2)).toEqual({ sum : 3 })
})

// Additional tests
// ============================================
test('arity', () => {
  const spec = {
    one   : x1 => x1,
    two   : (x1, x2) => x1 + x2,
    three : (
      x1, x2, x3
    ) => x1 + x2 + x3,
  }
  expect(applySpec(
    spec, 1, 2, 3
  )).toEqual({
    one   : 1,
    two   : 3,
    three : 6,
  })
})

test('arity over 5 arguments', () => {
  const spec = {
    one   : x1 => x1,
    two   : (x1, x2) => x1 + x2,
    three : (
      x1, x2, x3
    ) => x1 + x2 + x3,
    four : (
      x1, x2, x3, x4
    ) => x1 + x2 + x3 + x4,
    five : (
      x1, x2, x3, x4, x5
    ) => x1 + x2 + x3 + x4 + x5,
  }
  expect(applySpec(
    spec, 1, 2, 3, 4, 5
  )).toEqual({
    one   : 1,
    two   : 3,
    three : 6,
    four  : 10,
    five  : 15,
  })
})

test('curried', () => {
  const spec = {
    one   : x1 => x1,
    two   : (x1, x2) => x1 + x2,
    three : (
      x1, x2, x3
    ) => x1 + x2 + x3,
  }
  expect(applySpec(spec)(1)(2)(3)).toEqual({
    one   : 1,
    two   : 3,
    three : 6,
  })
})

test('curried over 5 arguments', () => {
  const spec = {
    one   : x1 => x1,
    two   : (x1, x2) => x1 + x2,
    three : (
      x1, x2, x3
    ) => x1 + x2 + x3,
    four : (
      x1, x2, x3, x4
    ) => x1 + x2 + x3 + x4,
    five : (
      x1, x2, x3, x4, x5
    ) => x1 + x2 + x3 + x4 + x5,
  }
  expect(applySpec(spec)(1)(2)(3)(4)(5)).toEqual({
    one   : 1,
    two   : 3,
    three : 6,
    four  : 10,
    five  : 15,
  })
})

test('undefined property', () => {
  const spec = { prop : path([ 'property', 'doesnt', 'exist' ]) }
  expect(applySpec(spec, {})).toEqual({ prop : undefined })
})

test('restructure json object', () => {
  const spec = {
    id          : path('user.id'),
    name        : path('user.firstname'),
    profile     : path('user.profile'),
    doesntExist : path('user.profile.doesntExist'),
    info        : { views : compose(inc, prop('views')) },
    type        : always('playa'),
  }

  const data = {
    user : {
      id        : 1337,
      firstname : 'john',
      lastname  : 'shaft',
      profile   : 'shaft69',
    },
    views : 42,
  }

  expect(applySpec(spec, data)).toEqual({
    id          : 1337,
    name        : 'john',
    profile     : 'shaft69',
    doesntExist : undefined,
    info        : { views : 43 },
    type        : 'playa',
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {multiply, applySpec, inc, dec, add} from 'rambda'

describe('applySpec', () => {
  it('ramda 1', () => {
    const result = applySpec({
      v: inc,
      u: dec,
    })(1)
    result // $ExpectType { v: number; u: number; }
  })
  it('ramda 1', () => {
    interface Output {
      sum: number,
      multiplied: number,
    }
    const result = applySpec<Output>({
      sum: add,
      multiplied: multiply,
    })(1, 2)

    result // $ExpectType Output
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#applySpec)

### applyTo

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.applyTo(%0A%20%201%2C%0A%20%20x%20%3D%3E%20x%20%2B%201%0A)%0A%2F%2F%20%3D%3E%202">Try this <strong>R.applyTo</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#applyTo)

### ascend

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.sort(R.descend(x%20%3D%3E%20x)%2C%20%5B2%2C%201%5D)%0A%2F%2F%20%3D%3E%20%5B1%2C%202%5D">Try this <strong>R.ascend</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#ascend)

### assoc

It makes a shallow clone of `obj` with setting or overriding the property `prop` with `newValue`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.assoc('c'%2C%203%2C%20%7Ba%3A%201%2C%20b%3A%202%7D)%0A%2F%2F%20%3D%3E%20%7Ba%3A%201%2C%20b%3A%202%2C%20c%3A%203%7D">Try this <strong>R.assoc</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#assoc)

### assocPath

```typescript

assocPath<Output>(path: Path, newValue: any, obj: object): Output
```

It makes a shallow clone of `obj` with setting or overriding with `newValue` the property found with `path`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20path%20%3D%20'b.c'%0Aconst%20newValue%20%3D%202%0Aconst%20obj%20%3D%20%7B%20a%3A%201%20%7D%0A%0Aconst%20result%20%3D%20R.assocPath(path%2C%20newValue%2C%20obj)%0A%2F%2F%20%3D%3E%20%7B%20a%20%3A%201%2C%20b%20%3A%20%7B%20c%20%3A%202%20%7D%7D">Try this <strong>R.assocPath</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
assocPath<Output>(path: Path, newValue: any, obj: object): Output;
assocPath<Output>(path: Path, newValue: any): (obj: object) => Output;
assocPath<Output>(path: Path): (newValue: any) => (obj: object) => Output;
```

</details>

<details>

<summary><strong>R.assocPath</strong> source</summary>

```javascript
import { cloneList } from './_internals/cloneList.js'
import { createPath } from './_internals/createPath.js'
import { isArray } from './_internals/isArray.js'
import { isIndexInteger } from './_internals/isInteger.js'
import { assocFn } from './assoc.js'
import { curry } from './curry.js'

export function assocPathFn(
  path, newValue, input
){
  const pathArrValue = createPath(path)
  if (pathArrValue.length === 0) return newValue

  const index = pathArrValue[ 0 ]
  if (pathArrValue.length > 1){
    const condition =
      typeof input !== 'object' ||
      input === null ||
      !input.hasOwnProperty(index)

    const nextInput = condition ?
      isIndexInteger(pathArrValue[ 1 ]) ?
        [] :
        {} :
      input[ index ]

    newValue = assocPathFn(
      Array.prototype.slice.call(pathArrValue, 1),
      newValue,
      nextInput
    )
  }

  if (isIndexInteger(index) && isArray(input)){
    const arr = cloneList(input)
    arr[ index ] = newValue

    return arr
  }

  return assocFn(
    index, newValue, input
  )
}

export const assocPath = curry(assocPathFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { assocPathFn } from './assocPath.js'

test('happy', () => {
  const path = 'a.c.1'
  const input = {
    a : {
      b : 1,
      c : [ 1, 2 ],
    },
  }
  assocPathFn(
    path, 3, input
  )
  expect(input).toEqual({
    a : {
      b : 1,
      c : [ 1, 2 ],
    },
  })
})

test('string can be used as path input', () => {
  const testObj = {
    a : [ { b : 1 }, { b : 2 } ],
    d : 3,
  }
  const result1 = assocPathFn(
    [ 'a', 0, 'b' ], 10, testObj
  )
  const result2 = assocPathFn(
    'a.0.b', 10, testObj
  )

  const expected = {
    a : [ { b : 10 }, { b : 2 } ],
    d : 3,
  }
  expect(result1).toEqual(expected)
  expect(result2).toEqual(expected)
})

test('difference with ramda - doesn\'t overwrite primitive values with keys in the path', () => {
  const obj = { a : 'str' }
  const result = assocPathFn(
    [ 'a', 'b' ], 42, obj
  )

  expect(result).toEqual({
    a : {
      0 : 's',
      1 : 't',
      2 : 'r',
      b : 42,
    },
  })
})

test('adds a key to an empty object', () => {
  expect(assocPathFn(
    [ 'a' ], 1, {}
  )).toEqual({ a : 1 })
})

test('adds a key to a non-empty object', () => {
  expect(assocPathFn(
    'b', 2, { a : 1 }
  )).toEqual({
    a : 1,
    b : 2,
  })
})

test('adds a nested key to a non-empty object', () => {
  expect(assocPathFn(
    'b.c', 2, { a : 1 }
  )).toEqual({
    a : 1,
    b : { c : 2 },
  })
})

test('adds a nested key to a nested non-empty object', () => {
  expect(assocPathFn('b.d',
    3,{
    a : 1,
    b : { c : 2 },
  })).toEqual({
    a : 1,
    b : {
      c : 2,
      d : 3,
    },
  })
})

test('adds a key to a non-empty object', () => {
  expect(assocPathFn('b', 2, { a : 1 })).toEqual({
    a : 1,
    b : 2,
  })
})

test('adds a nested key to a non-empty object', () => {
  expect(assocPathFn('b.c', 2, { a : 1 })).toEqual({
    a : 1,
    b : { c : 2 },
  })
})

test('changes an existing key', () => {
  expect(assocPathFn(
    'a', 2, { a : 1 }
  )).toEqual({ a : 2 })
})

test('undefined is considered an empty object', () => {
  expect(assocPathFn(
    'a', 1, undefined
  )).toEqual({ a : 1 })
})

test('null is considered an empty object', () => {
  expect(assocPathFn(
    'a', 1, null
  )).toEqual({ a : 1 })
})

test('value can be null', () => {
  expect(assocPathFn(
    'a', null, null
  )).toEqual({ a : null })
})

test('value can be undefined', () => {
  expect(assocPathFn(
    'a', undefined, null
  )).toEqual({ a : undefined })
})

test('assignment is shallow', () => {
  expect(assocPathFn(
    'a', { b : 2 }, { a : { c : 3 } }
  )).toEqual({ a : { b : 2 } })
})

test('empty array as path', () => {
  const result = assocPathFn(
    [], 3, {
      a : 1,
      b : 2,
    }
  )
  expect(result).toBe(3)
})

test('happy', () => {
  const expected = { foo : { bar : { baz : 42 } } }
  const result = assocPathFn(
    [ 'foo', 'bar', 'baz' ], 42, { foo : null }
  )
  expect(result).toEqual(expected)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {assocPath} from 'rambda'

interface Output {
  a: number,
  foo: {bar: number},
}

describe('R.assocPath - user must explicitly set type of output', () => {
  it('with array as path input', () => {
    const result = assocPath<Output>(['foo', 'bar'], 2, {a: 1})

    result // $ExpectType Output
  })
  it('with string as path input', () => {
    const result = assocPath<Output>('foo.bar', 2, {a: 1})

    result // $ExpectType Output
  })
})

describe('R.assocPath - curried', () => {
  it('with array as path input', () => {
    const result = assocPath<Output>(['foo', 'bar'], 2)({a: 1})

    result // $ExpectType Output
  })
  it('with string as path input', () => {
    const result = assocPath<Output>('foo.bar', 2)({a: 1})

    result // $ExpectType Output
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#assocPath)

### binary

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.binary(%0A%20%20(a%2C%20b%2C%20c)%20%3D%3E%20a%20%2B%20b%20%2B%20c%2C%0A)(1%2C%202%2C%203%2C%204)%0A%2F%2F%20%3D%3E%203">Try this <strong>R.binary</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#binary)

### bind

```typescript

bind<F extends AnyFunction, T>(fn: F, thisObj: T): (...args: Parameters<F>) => ReturnType<F>
```

Creates a function that is bound to a context.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20log%20%3D%20R.bind(console.log%2C%20console)%0Aconst%20result%20%3D%20R.pipe(%0A%20%20R.assoc('a'%2C%202)%2C%20%0A%20%20R.tap(log)%2C%20%0A%20%20R.assoc('a'%2C%203)%0A)(%7Ba%3A%201%7D)%3B%20%0A%2F%2F%20%3D%3E%20result%20-%20%60%7Ba%3A%203%7D%60%0A%2F%2F%20%3D%3E%20console%20log%20-%20%60%7Ba%3A%202%7D%60">Try this <strong>R.bind</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
bind<F extends AnyFunction, T>(fn: F, thisObj: T): (...args: Parameters<F>) => ReturnType<F>;
bind<F extends AnyFunction, T>(fn: F): (thisObj: T) => (...args: Parameters<F>) => ReturnType<F>;
```

</details>

<details>

<summary><strong>R.bind</strong> source</summary>

```javascript
import { curryN } from './curryN.js'

export function bind(fn, thisObj){
  if (arguments.length === 1){
    return _thisObj => bind(fn, _thisObj)
  }

  return curryN(fn.length, (...args) => fn.apply(thisObj, args))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { bind } from './bind.js'

function Foo(x){
  this.x = x
}
function add(x){
  return this.x + x
}
function Bar(x, y){
  this.x = x
  this.y = y
}
Bar.prototype = new Foo()
Bar.prototype.getX = function (){
  return 'prototype getX'
}

test('returns a function', () => {
  expect(typeof bind(add)(Foo)).toBe('function')
})

test('returns a function bound to the specified context object', () => {
  const f = new Foo(12)
  function isFoo(){
    return this instanceof Foo
  }
  const isFooBound = bind(isFoo, f)
  expect(isFoo()).toBeFalse()
  expect(isFooBound()).toBeTrue()
})

test('works with built-in types', () => {
  const abc = bind(String.prototype.toLowerCase, 'ABCDEFG')
  expect(typeof abc).toBe('function')
  expect(abc()).toBe('abcdefg')
})

test('works with user-defined types', () => {
  const f = new Foo(12)
  function getX(){
    return this.x
  }
  const getXFooBound = bind(getX, f)
  expect(getXFooBound()).toBe(12)
})

test('works with plain objects', () => {
  const pojso = { x : 100 }
  function incThis(){
    return this.x + 1
  }
  const incPojso = bind(incThis, pojso)
  expect(typeof incPojso).toBe('function')
  expect(incPojso()).toBe(101)
})

test('does not interfere with existing object methods', () => {
  const b = new Bar('a', 'b')
  function getX(){
    return this.x
  }
  const getXBarBound = bind(getX, b)
  expect(b.getX()).toBe('prototype getX')
  expect(getXBarBound()).toBe('a')
})

test('preserves arity', () => {
  const f0 = function (){
    return 0
  }
  const f1 = function (a){
    return a
  }
  const f2 = function (a, b){
    return a + b
  }
  const f3 = function (
    a, b, c
  ){
    return a + b + c
  }

  expect(bind(f0, {})).toHaveLength(0)
  expect(bind(f1, {})).toHaveLength(1)
  expect(bind(f2, {})).toHaveLength(2)
  expect(bind(f3, {})).toHaveLength(3)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {bind} from 'rambda'

class Foo {}
function isFoo<T = any>(this: T): boolean {
  return this instanceof Foo
}

describe('R.bind', () => {
  it('happy', () => {
    const foo = new Foo()
    const result = bind(isFoo, foo)()

    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#bind)

### both

```typescript

both(pred1: Pred, pred2: Pred): Pred
```

It returns a function with `input` argument. 

This function will return `true`, if both `firstCondition` and `secondCondition` return `true` when `input` is passed as their argument.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20firstCondition%20%3D%20x%20%3D%3E%20x%20%3E%2010%0Aconst%20secondCondition%20%3D%20x%20%3D%3E%20x%20%3C%2020%0Aconst%20fn%20%3D%20R.both(firstCondition%2C%20secondCondition)%0A%0Aconst%20result%20%3D%20%5Bfn(15)%2C%20fn(30)%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20false%5D">Try this <strong>R.both</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
both(pred1: Pred, pred2: Pred): Pred;
both<T>(pred1: Predicate<T>, pred2: Predicate<T>): Predicate<T>;
both<T>(pred1: Predicate<T>): (pred2: Predicate<T>) => Predicate<T>;
both(pred1: Pred): (pred2: Pred) => Pred;
```

</details>

<details>

<summary><strong>R.both</strong> source</summary>

```javascript
export function both(f, g){
  if (arguments.length === 1) return _g => both(f, _g)

  return (...input) => f(...input) && g(...input)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { both } from './both.js'

const firstFn = val => val > 0
const secondFn = val => val < 10

test('with curry', () => {
  expect(both(firstFn)(secondFn)(17)).toBeFalse()
})

test('without curry', () => {
  expect(both(firstFn, secondFn)(7)).toBeTrue()
})

test('with multiple inputs', () => {
  const between = function (
    a, b, c
  ){
    return a < b && b < c
  }
  const total20 = function (
    a, b, c
  ){
    return a + b + c === 20
  }
  const fn = both(between, total20)
  expect(fn(
    5, 7, 8
  )).toBeTrue()
})

test('skip evaluation of the second expression', () => {
  let effect = 'not evaluated'
  const F = function (){
    return false
  }
  const Z = function (){
    effect = 'Z got evaluated'
  }
  both(F, Z)()

  expect(effect).toBe('not evaluated')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {both} from 'rambda'

describe('R.both', () => {
  it('with passed type', () => {
    const fn = both<number>(
      x => x > 1,
      x => x % 2 === 0
    )
    fn // $ExpectType Predicate<number>
    const result = fn(2) // $ExpectType boolean
    result // $ExpectType boolean
  })
  it('with passed type - curried', () => {
    const fn = both<number>(x => x > 1)(x => x % 2 === 0)
    fn // $ExpectType Predicate<number>
    const result = fn(2)
    result // $ExpectType boolean
  })
  it('no type passed', () => {
    const fn = both(
      x => {
        x // $ExpectType any
        return x > 1
      },
      x => {
        x // $ExpectType any
        return x % 2 === 0
      }
    )
    const result = fn(2)
    result // $ExpectType boolean
  })
  it('no type passed - curried', () => {
    const fn = both((x: number) => {
      x // $ExpectType number
      return x > 1
    })((x: number) => {
      x // $ExpectType number
      return x % 2 === 0
    })
    const result = fn(2)
    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#both)

### call

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.call(%0A%20%20(a%2C%20b)%20%3D%3E%20a%20%2B%20b%2C%0A%20%201%2C%0A%20%202%0A)%0A%2F%2F%20%3D%3E%203">Try this <strong>R.call</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#call)

### chain

```typescript

chain<T, U>(fn: (n: T) => U[], list: T[]): U[]
```

The method is also known as `flatMap`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20duplicate%20%3D%20n%20%3D%3E%20%5B%20n%2C%20n%20%5D%0Aconst%20list%20%3D%20%5B%201%2C%202%2C%203%20%5D%0A%0Aconst%20result%20%3D%20chain(duplicate%2C%20list)%0A%2F%2F%20%3D%3E%20%5B%201%2C%201%2C%202%2C%202%2C%203%2C%203%20%5D">Try this <strong>R.chain</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
chain<T, U>(fn: (n: T) => U[], list: T[]): U[];
chain<T, U>(fn: (n: T) => U[]): (list: T[]) => U[];
```

</details>

<details>

<summary><strong>R.chain</strong> source</summary>

```javascript
export function chain(fn, list){
  if (arguments.length === 1){
    return _list => chain(fn, _list)
  }

  return [].concat(...list.map(fn))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { chain as chainRamda } from 'ramda'

import { chain } from './chain.js'

const duplicate = n => [ n, n ]

test('happy', () => {
  const fn = x => [ x * 2 ]
  const list = [ 1, 2, 3 ]

  const result = chain(fn, list)

  expect(result).toEqual([ 2, 4, 6 ])
})

test('maps then flattens one level', () => {
  expect(chain(duplicate, [ 1, 2, 3 ])).toEqual([ 1, 1, 2, 2, 3, 3 ])
})

test('maps then flattens one level - curry', () => {
  expect(chain(duplicate)([ 1, 2, 3 ])).toEqual([ 1, 1, 2, 2, 3, 3 ])
})

test('flattens only one level', () => {
  const nest = n => [ [ n ] ]
  expect(chain(nest, [ 1, 2, 3 ])).toEqual([ [ 1 ], [ 2 ], [ 3 ] ])
})

test('can compose', () => {
  function dec(x){
    return [ x - 1 ]
  }
  function times2(x){
    return [ x * 2 ]
  }

  const mdouble = chain(times2)
  const mdec = chain(dec)
  expect(mdec(mdouble([ 10, 20, 30 ]))).toEqual([ 19, 39, 59 ])
})

test('@types/ramda broken test', () => {
  const score = {
    maths   : 90,
    physics : 80,
  }

  const calculateTotal = score => {
    const { maths, physics } = score

    return maths + physics
  }

  const assocTotalToScore = (total, score) => ({
    ...score,
    total,
  })

  const calculateAndAssocTotalToScore = chainRamda(assocTotalToScore,
    calculateTotal)
  expect(() =>
    calculateAndAssocTotalToScore(score)).toThrowErrorMatchingInlineSnapshot('"fn(...) is not a function"')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {chain} from 'rambda'

const list = [1, 2, 3]
const fn = (x: number) => [`${x}`, `${x}`]

describe('R.chain', () => {
  it('without passing type', () => {
    const result = chain(fn, list)
    result // $ExpectType string[]

    const curriedResult = chain(fn)(list)
    curriedResult // $ExpectType string[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#chain)

### clamp

Restrict a number `input` to be within `min` and `max` limits.

If `input` is bigger than `max`, then the result is `max`.

If `input` is smaller than `min`, then the result is `min`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.clamp(0%2C%2010%2C%205)%2C%20%0A%20%20R.clamp(0%2C%2010%2C%20-1)%2C%0A%20%20R.clamp(0%2C%2010%2C%2011)%0A%5D%0A%2F%2F%20%3D%3E%20%5B5%2C%200%2C%2010%5D">Try this <strong>R.clamp</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#clamp)

### clone

It creates a deep copy of the `input`, which may contain (nested) Arrays and Objects, Numbers, Strings, Booleans and Dates.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20objects%20%3D%20%5B%7Ba%3A%201%7D%2C%20%7Bb%3A%202%7D%5D%3B%0Aconst%20objectsClone%20%3D%20R.clone(objects)%3B%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.equals(objects%2C%20objectsClone)%2C%0A%20%20R.equals(objects%5B0%5D%2C%20objectsClone%5B0%5D)%2C%0A%5D%20%2F%2F%20%3D%3E%20%5B%20true%2C%20true%20%5D">Try this <strong>R.clone</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#clone)

### collectBy

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.collectBy(%0A%20%20x%20%3D%3E%20x%20%25%202%2C%0A%20%20%5B1%2C%202%2C%203%2C%204%5D%0A)%0A%2F%2F%20%3D%3E%20%5B%5B2%2C%204%5D%2C%20%5B1%2C%203%5D%5D">Try this <strong>R.collectBy</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#collectBy)

### comparator

It returns a comparator function that can be used in `sort` method.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.sort(%0A%20%20R.comparator((a%2C%20b)%20%3D%3E%20a.x%20%3C%20b.x)%2C%0A%20%20%5B%7Bx%3A%202%7D%2C%20%7Bx%3A%201%7D%5D%0A)%0A%2F%2F%20%3D%3E%20%5B%7Bx%3A%201%7D%2C%20%7Bx%3A%202%7D%5D">Try this <strong>R.comparator</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#comparator)

### complement

It returns `inverted` version of `origin` function that accept `input` as argument.

The return value of `inverted` is the negative boolean value of `origin(input)`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20origin%20%3D%20x%20%3D%3E%20x%20%3E%205%0Aconst%20inverted%20%3D%20complement(origin)%0A%0Aconst%20result%20%3D%20%5B%0A%20%20origin(7)%2C%0A%20%20inverted(7)%0A%5D%20%3D%3E%20%5B%20true%2C%20false%20%5D">Try this <strong>R.complement</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#complement)

### compose

It performs right-to-left function composition.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.compose(%0A%20%20R.map(x%20%3D%3E%20x%20*%202)%2C%0A%20%20R.filter(x%20%3D%3E%20x%20%3E%202)%0A)(%5B1%2C%202%2C%203%2C%204%5D)%0A%0A%2F%2F%20%3D%3E%20%5B6%2C%208%5D">Try this <strong>R.compose</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#compose)

### composeWith

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.composeWith(%0A%20%20(fn%2C%20intermediateResult)%20%3D%3E%20fn(intermediateResult)%2C%0A%20%20%5B%0A%20%20%20%20R.map(x%20%3D%3E%20x%20%2B%201)%2C%0A%20%20%20%20R.map(x%20%3D%3E%20x%20*%202)%2C%0A%20%20%5D%0A)(%5B1%2C%202%2C%203%5D)%0A%2F%2F%20%3D%3E%20%5B3%2C%205%2C%207%5D">Try this <strong>R.composeWith</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#composeWith)

### concat

It returns a new string or array, which is the result of merging `x` and `y`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?R.concat(%5B1%2C%202%5D)(%5B3%2C%204%5D)%20%2F%2F%20%3D%3E%20%5B1%2C%202%2C%203%2C%204%5D%0Aconst%20result%20%3D%20R.concat('foo'%2C%20'bar')%20%2F%2F%20%3D%3E%20'foobar'">Try this <strong>R.concat</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#concat)

### cond

It takes list with `conditions` and returns a new function `fn` that expects `input` as argument. 

This function will start evaluating the `conditions` in order to find the first winner(order of conditions matter). 

The winner is this condition, which left side returns `true` when `input` is its argument. Then the evaluation of the right side of the winner will be the final result.

If no winner is found, then `fn` returns `undefined`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20R.cond(%5B%0A%20%20%5B%20x%20%3D%3E%20x%20%3E%2025%2C%20R.always('more%20than%2025')%20%5D%2C%0A%20%20%5B%20x%20%3D%3E%20x%20%3E%2015%2C%20R.always('more%20than%2015')%20%5D%2C%0A%20%20%5B%20R.T%2C%20x%20%3D%3E%20%60%24%7Bx%7D%20is%20nothing%20special%60%20%5D%2C%0A%5D)%0A%0Aconst%20result%20%3D%20%5B%0A%20%20fn(30)%2C%0A%20%20fn(20)%2C%0A%20%20fn(10)%2C%0A%5D%20%0A%2F%2F%20%3D%3E%20%5B'more%20than%2025'%2C%20'more%20than%2015'%2C%20'10%20is%20nothing%20special'%5D">Try this <strong>R.cond</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#cond)

### converge

Accepts a converging function and a list of branching functions and returns a new function. When invoked, this new function is applied to some arguments, each branching function is applied to those same arguments. The results of each branching function are passed as arguments to the converging function to produce the return value.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.converge(R.multiply)(%5B%20R.add(1)%2C%20R.add(3)%20%5D)(2)%0A%2F%2F%20%3D%3E%2015">Try this <strong>R.converge</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#converge)

### count

It counts how many times `predicate` function returns `true`, when supplied with iteration of `list`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%7Ba%3A%201%7D%2C%201%2C%20%7Ba%3A2%7D%5D%0Aconst%20result%20%3D%20R.count(x%20%3D%3E%20x.a%20!%3D%3D%20undefined%2C%20list)%0A%2F%2F%20%3D%3E%202">Try this <strong>R.count</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#count)

### countBy

```typescript

countBy<T extends unknown>(transformFn: (x: T) => any, list: T[]): Record<string, number>
```

It counts elements in a list after each instance of the input list is passed through `transformFn` function.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%20'a'%2C%20'A'%2C%20'b'%2C%20'B'%2C%20'c'%2C%20'C'%20%5D%0A%0Aconst%20result%20%3D%20countBy(R.toLower%2C%20list)%0Aconst%20expected%20%3D%20%7B%20a%3A%202%2C%20b%3A%202%2C%20c%3A%202%20%7D%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.countBy</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
countBy<T extends unknown>(transformFn: (x: T) => any, list: T[]): Record<string, number>;
countBy<T extends unknown>(transformFn: (x: T) => any): (list: T[]) => Record<string, number>;
```

</details>

<details>

<summary><strong>R.countBy</strong> source</summary>

```javascript
export function countBy(fn, list){
  if (arguments.length === 1){
    return _list => countBy(fn, _list)
  }
  const willReturn = {}

  list.forEach(item => {
    const key = fn(item)
    if (!willReturn[ key ]){
      willReturn[ key ] = 1
    } else {
      willReturn[ key ]++
    }
  })

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { countBy } from './countBy.js'

const list = [ 'a', 'A', 'b', 'B', 'c', 'C' ]

test('happy', () => {
  const result = countBy(x => x.toLowerCase(), list)
  expect(result).toEqual({
    a : 2,
    b : 2,
    c : 2,
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {countBy} from 'rambda'

const transformFn = (x: string) => x.toLowerCase()
const list = ['a', 'A', 'b', 'B', 'c', 'C']

describe('R.countBy', () => {
  it('happy', () => {
    const result = countBy(transformFn, list)

    result // $ExpectType Record<string, number>
  })
  it('curried', () => {
    const result = countBy(transformFn)(list)

    result // $ExpectType Record<string, number>
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#countBy)

### curry

It expects a function as input and returns its curried version.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20(a%2C%20b%2C%20c)%20%3D%3E%20a%20%2B%20b%20%2B%20c%0Aconst%20curried%20%3D%20R.curry(fn)%0Aconst%20sum%20%3D%20curried(1%2C2)%0A%0Aconst%20result%20%3D%20sum(3)%20%2F%2F%20%3D%3E%206">Try this <strong>R.curry</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#curry)

### curryN

It returns a curried equivalent of the provided function, with the specified arity.

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#curryN)

### dec

It decrements a number.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.dec(2)%20%2F%2F%20%3D%3E%201">Try this <strong>R.dec</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#dec)

### defaultTo

```typescript

defaultTo<T>(defaultValue: T, input: T | null | undefined): T
```

It returns `defaultValue`, if all of `inputArguments` are `undefined`, `null` or `NaN`.

Else, it returns the first truthy `inputArguments` instance(from left to right).

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?R.defaultTo('foo'%2C%20'bar')%20%2F%2F%20%3D%3E%20'bar'%0AR.defaultTo('foo'%2C%20undefined)%20%2F%2F%20%3D%3E%20'foo'%0A%0A%2F%2F%20Important%20-%20emtpy%20string%20is%20not%20falsy%20value(same%20as%20Ramda)%0Aconst%20result%20%3D%20R.defaultTo('foo'%2C%20'')%20%2F%2F%20%3D%3E%20'foo'">Try this <strong>R.defaultTo</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
defaultTo<T>(defaultValue: T, input: T | null | undefined): T;
defaultTo<T>(defaultValue: T): (input: T | null | undefined) => T;
```

</details>

<details>

<summary><strong>R.defaultTo</strong> source</summary>

```javascript
function isFalsy(input){
  return (
    input === undefined || input === null || Number.isNaN(input) === true
  )
}

export function defaultTo(defaultArgument, input){
  if (arguments.length === 1){
    return _input => defaultTo(defaultArgument, _input)
  }

  return isFalsy(input) ? defaultArgument : input
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { defaultTo } from './defaultTo.js'

test('with undefined', () => {
  expect(defaultTo('foo')(undefined)).toBe('foo')
})

test('with null', () => {
  expect(defaultTo('foo')(null)).toBe('foo')
})

test('with NaN', () => {
  expect(defaultTo('foo')(NaN)).toBe('foo')
})

test('with empty string', () => {
  expect(defaultTo('foo', '')).toBe('')
})

test('with false', () => {
  expect(defaultTo('foo', false)).toBeFalse()
})

test('when inputArgument passes initial check', () => {
  expect(defaultTo('foo', 'bar')).toBe('bar')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {defaultTo} from 'rambda'

describe('R.defaultTo with Ramda spec', () => {
  it('happy', () => {
    const result = defaultTo('foo', '')
    result // $ExpectType "" | "foo"
  })
  it('with explicit type', () => {
    const result = defaultTo<string>('foo', null)
    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#defaultTo)

### descend

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.sort(R.descend(x%20%3D%3E%20x)%2C%20%5B1%2C%202%5D)%0A%2F%2F%20%3D%3E%20%5B2%2C%201%5D">Try this <strong>R.descend</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#descend)

### difference

```typescript

difference<T>(a: T[], b: T[]): T[]
```

It returns the uniq set of all elements in the first list `a` not contained in the second list `b`.

`R.equals` is used to determine equality.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20a%20%3D%20%5B%201%2C%202%2C%203%2C%204%20%5D%0Aconst%20b%20%3D%20%5B%203%2C%204%2C%205%2C%206%20%5D%0A%0Aconst%20result%20%3D%20R.difference(a%2C%20b)%0A%2F%2F%20%3D%3E%20%5B%201%2C%202%20%5D">Try this <strong>R.difference</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
difference<T>(a: T[], b: T[]): T[];
difference<T>(a: T[]): (b: T[]) => T[];
```

</details>

<details>

<summary><strong>R.difference</strong> source</summary>

```javascript
import { includes } from './includes.js'
import { uniq } from './uniq.js'

export function difference(a, b){
  if (arguments.length === 1) return _b => difference(a, _b)

  return uniq(a).filter(aInstance => !includes(aInstance, b))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { difference as differenceRamda } from 'ramda'

import { difference } from './difference.js'

test('difference', () => {
  const a = [ 1, 2, 3, 4 ]
  const b = [ 3, 4, 5, 6 ]
  expect(difference(a)(b)).toEqual([ 1, 2 ])

  expect(difference([], [])).toEqual([])
})

test('difference with objects', () => {
  const a = [ { id : 1 }, { id : 2 }, { id : 3 }, { id : 4 } ]
  const b = [ { id : 3 }, { id : 4 }, { id : 5 }, { id : 6 } ]
  expect(difference(a, b)).toEqual([ { id : 1 }, { id : 2 } ])
})

test('no duplicates in first list', () => {
  const M2 = [ 1, 2, 3, 4, 1, 2, 3, 4 ]
  const N2 = [ 3, 3, 4, 4, 5, 5, 6, 6 ]
  expect(difference(M2, N2)).toEqual([ 1, 2 ])
})

test('should use R.equals', () => {
  expect(difference([ 1 ], [ 1 ])).toHaveLength(0)
  expect(differenceRamda([ NaN ], [ NaN ])).toHaveLength(0)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {difference} from 'rambda'

const list1 = [1, 2, 3]
const list2 = [1, 2, 4]

describe('R.difference', () => {
  it('happy', () => {
    const result = difference(list1, list2)

    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = difference(list1)(list2)

    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#difference)

### differenceWith

```typescript

differenceWith<T1, T2>(
  pred: (a: T1, b: T2) => boolean,
  list1: T1[],
  list2: T2[],
): T1[]
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.differenceWith(%0A%20%20(a%2C%20b)%20%3D%3E%20a.x%20%3D%3D%3D%20b.x%2C%0A%20%20%5B%7Bx%3A%201%7D%2C%20%7Bx%3A%202%7D%5D%2C%0A%20%20%5B%7Bx%3A%201%7D%2C%20%7Bx%3A%203%7D%5D%0A)%0A%2F%2F%20%3D%3E%20%5B%7Bx%3A%202%7D%5D">Try this <strong>R.differenceWith</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
differenceWith<T1, T2>(
  pred: (a: T1, b: T2) => boolean,
  list1: T1[],
  list2: T2[],
): T1[];
differenceWith<T1, T2>(
  pred: (a: T1, b: T2) => boolean,
): (list1: T1[], list2: T2[]) => T1[];
differenceWith<T1, T2>(
  pred: (a: T1, b: T2) => boolean,
  list1: T1[],
): (list2: T2[]) => T1[];
```

</details>

<details>

<summary><strong>R.differenceWith</strong> source</summary>

```javascript
import { curry } from './curry.js'
import { _indexOf } from './equals.js'

export function differenceWithFn(
  fn, a, b
){
  const willReturn = []
  const [ first, second ] = a.length >= b.length ? [ a, b ] : [ b, a ]

  first.forEach(item => {
    const hasItem = second.some(secondItem => fn(item, secondItem))
    if (!hasItem && _indexOf(item, willReturn) === -1){
      willReturn.push(item)
    }
  })

  return willReturn
}

export const differenceWith = curry(differenceWithFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { differenceWith } from './differenceWith.js';

const fn = (a, b) => a.x === b.x;

test('same length of list', () => {
	const result = differenceWith(fn, [{ x: 1 }, { x: 2 }], [{ x: 1 }, { x: 3 }]);
	expect(result).toEqual([{ x: 2 }]);
});

test('different length of list', () => {
	const foo = [{ x: 1 }, { x: 2 }, { x: 3 }];
	const bar = [{ x: 3 }, { x: 4 }];
	const result = differenceWith(fn, foo, bar);
	expect(result).toEqual([{ x: 1 }, { x: 2 }]);
});
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#differenceWith)

### dissoc

It returns a new object that does not contain property `prop`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.dissoc('b'%2C%20%7Ba%3A%201%2C%20b%3A%202%2C%20c%3A%203%7D)%0A%2F%2F%20%3D%3E%20%7Ba%3A%201%2C%20c%3A%203%7D">Try this <strong>R.dissoc</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#dissoc)

### dissocPath

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.dissocPath(%5B'a'%2C%20'b'%5D%2C%20%7Ba%3A%20%7Bb%3A%201%2C%20c%3A%202%7D%7D)%0A%2F%2F%20%3D%3E%20%7Ba%3A%20%7Bc%3A%202%7D%7D">Try this <strong>R.dissocPath</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#dissocPath)

### divide

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.divide(71%2C%20100)%20%2F%2F%20%3D%3E%200.71">Try this <strong>R.divide</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#divide)

### drop

```typescript

drop<T>(howMany: number, input: T[]): T[]
```

It returns `howMany` items dropped from beginning of list or string `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?R.drop(2%2C%20%5B'foo'%2C%20'bar'%2C%20'baz'%5D)%20%2F%2F%20%3D%3E%20%5B'baz'%5D%0Aconst%20result%20%3D%20R.drop(2%2C%20'foobar')%20%20%2F%2F%20%3D%3E%20'obar'">Try this <strong>R.drop</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
drop<T>(howMany: number, input: T[]): T[];
drop(howMany: number, input: string): string;
drop<T>(howMany: number): {
  <T>(input: T[]): T[];
  (input: string): string;
};
```

</details>

<details>

<summary><strong>R.drop</strong> source</summary>

```javascript
export function drop(howManyToDrop, listOrString){
  if (arguments.length === 1) return _list => drop(howManyToDrop, _list)

  return listOrString.slice(howManyToDrop > 0 ? howManyToDrop : 0)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import assert from 'assert'

import { drop } from './drop.js'

test('with array', () => {
  expect(drop(2)([ 'foo', 'bar', 'baz' ])).toEqual([ 'baz' ])
  expect(drop(3, [ 'foo', 'bar', 'baz' ])).toEqual([])
  expect(drop(4, [ 'foo', 'bar', 'baz' ])).toEqual([])
})

test('with string', () => {
  expect(drop(3, 'rambda')).toBe('bda')
})

test('with non-positive count', () => {
  expect(drop(0, [ 1, 2, 3 ])).toEqual([ 1, 2, 3 ])
  expect(drop(-1, [ 1, 2, 3 ])).toEqual([ 1, 2, 3 ])
  expect(drop(-Infinity, [ 1, 2, 3 ])).toEqual([ 1, 2, 3 ])
})

test('should return copy', () => {
  const xs = [ 1, 2, 3 ]

  assert.notStrictEqual(drop(0, xs), xs)
  assert.notStrictEqual(drop(-1, xs), xs)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {drop} from 'rambda'

const list = [1, 2, 3, 4]
const str = 'foobar'
const howMany = 2

describe('R.drop - array', () => {
  it('happy', () => {
    const result = drop(howMany, list)
    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = drop(howMany)(list)
    result // $ExpectType number[]
  })
})

describe('R.drop - string', () => {
  it('happy', () => {
    const result = drop(howMany, str)
    result // $ExpectType string
  })
  it('curried', () => {
    const result = drop(howMany)(str)
    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#drop)

### dropLast

```typescript

dropLast<T>(howMany: number, input: T[]): T[]
```

It returns `howMany` items dropped from the end of list or string `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?R.dropLast(2%2C%20%5B'foo'%2C%20'bar'%2C%20'baz'%5D)%20%2F%2F%20%3D%3E%20%5B'foo'%5D%0Aconst%20result%20%3D%20R.dropLast(2%2C%20'foobar')%20%20%2F%2F%20%3D%3E%20'foob'">Try this <strong>R.dropLast</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
dropLast<T>(howMany: number, input: T[]): T[];
dropLast(howMany: number, input: string): string;
dropLast<T>(howMany: number): {
  <T>(input: T[]): T[];
  (input: string): string;
};
```

</details>

<details>

<summary><strong>R.dropLast</strong> source</summary>

```javascript
export function dropLast(howManyToDrop, listOrString){
  if (arguments.length === 1){
    return _listOrString => dropLast(howManyToDrop, _listOrString)
  }

  return howManyToDrop > 0 ?
    listOrString.slice(0, -howManyToDrop) :
    listOrString.slice()
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import assert from 'assert'

import { dropLast } from './dropLast.js'

test('with array', () => {
  expect(dropLast(2)([ 'foo', 'bar', 'baz' ])).toEqual([ 'foo' ])
  expect(dropLast(3, [ 'foo', 'bar', 'baz' ])).toEqual([])
  expect(dropLast(4, [ 'foo', 'bar', 'baz' ])).toEqual([])
})

test('with string', () => {
  expect(dropLast(3, 'rambda')).toBe('ram')
})

test('with non-positive count', () => {
  expect(dropLast(0, [ 1, 2, 3 ])).toEqual([ 1, 2, 3 ])
  expect(dropLast(-1, [ 1, 2, 3 ])).toEqual([ 1, 2, 3 ])
  expect(dropLast(-Infinity, [ 1, 2, 3 ])).toEqual([ 1, 2, 3 ])
})

test('should return copy', () => {
  const xs = [ 1, 2, 3 ]

  assert.notStrictEqual(dropLast(0, xs), xs)
  assert.notStrictEqual(dropLast(-1, xs), xs)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {dropLast} from 'rambda'

const list = [1, 2, 3, 4]
const str = 'foobar'
const howMany = 2

describe('R.dropLast - array', () => {
  it('happy', () => {
    const result = dropLast(howMany, list)
    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = dropLast(howMany)(list)
    result // $ExpectType number[]
  })
})

describe('R.dropLast - string', () => {
  it('happy', () => {
    const result = dropLast(howMany, str)
    result // $ExpectType string
  })
  it('curried', () => {
    const result = dropLast(howMany)(str)
    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#dropLast)

### dropLastWhile

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%3B%0Aconst%20predicate%20%3D%20x%20%3D%3E%20x%20%3E%3D%203%0A%0Aconst%20result%20%3D%20dropLastWhile(predicate%2C%20list)%3B%0A%2F%2F%20%3D%3E%20%5B1%2C%202%5D">Try this <strong>R.dropLastWhile</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#dropLastWhile)

### dropRepeats

```typescript

dropRepeats<T>(list: T[]): T[]
```

It removes any successive duplicates according to `R.equals`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.dropRepeats(%5B%0A%20%201%2C%20%0A%20%201%2C%20%0A%20%20%7Ba%3A%201%7D%2C%20%0A%20%20%7Ba%3A1%7D%2C%20%0A%20%201%0A%5D)%0A%2F%2F%20%3D%3E%20%5B1%2C%20%7Ba%3A%201%7D%2C%201%5D">Try this <strong>R.dropRepeats</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
dropRepeats<T>(list: T[]): T[];
```

</details>

<details>

<summary><strong>R.dropRepeats</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'
import { equals } from './equals.js'

export function dropRepeats(list){
  if (!isArray(list)){
    throw new Error(`${ list } is not a list`)
  }

  const toReturn = []

  list.reduce((prev, current) => {
    if (!equals(prev, current)){
      toReturn.push(current)
    }

    return current
  }, undefined)

  return toReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { dropRepeats as dropRepeatsRamda } from 'ramda'

import { compareCombinations } from './_internals/testUtils.js'
import { add } from './add.js'
import { dropRepeats } from './dropRepeats.js'

const list = [ 1, 2, 2, 2, 3, 4, 4, 5, 5, 3, 2, 2, { a : 1 }, { a : 1 } ]
const listClean = [ 1, 2, 3, 4, 5, 3, 2, { a : 1 } ]

test('happy', () => {
  const result = dropRepeats(list)
  expect(result).toEqual(listClean)
})

const possibleLists = [
  [ add(1), async () => {}, [ 1 ], [ 1 ], [ 2 ], [ 2 ] ],
  [ add(1), add(1), add(2) ],
  [],
  1,
  /foo/g,
  Promise.resolve(1),
]

describe('brute force', () => {
  compareCombinations({
    firstInput : possibleLists,
    callback   : errorsCounters => {
      expect(errorsCounters).toMatchInlineSnapshot(`
        {
          "ERRORS_MESSAGE_MISMATCH": 0,
          "ERRORS_TYPE_MISMATCH": 0,
          "RESULTS_MISMATCH": 1,
          "SHOULD_NOT_THROW": 3,
          "SHOULD_THROW": 0,
          "TOTAL_TESTS": 6,
        }
      `)
    },
    fn      : dropRepeats,
    fnRamda : dropRepeatsRamda,
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {dropRepeats} from 'rambda'

describe('R.dropRepeats', () => {
  it('happy', () => {
    const result = dropRepeats([1, 2, 2, 3])

    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#dropRepeats)

### dropRepeatsBy

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.dropRepeatsBy(%0A%20%20Math.abs%2C%0A%20%20%5B1%2C%20-1%2C%202%2C%203%2C%20-3%5D%0A)%0A%2F%2F%20%3D%3E%20%5B1%2C%202%2C%203%5D">Try this <strong>R.dropRepeatsBy</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#dropRepeatsBy)

### dropRepeatsWith

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%7Ba%3A1%2Cb%3A2%7D%2C%20%7Ba%3A1%2Cb%3A3%7D%2C%20%7Ba%3A2%2C%20b%3A4%7D%5D%0Aconst%20result%20%3D%20R.dropRepeatsWith(R.prop('a')%2C%20list)%0A%0A%2F%2F%20%3D%3E%20%5B%7Ba%3A1%2Cb%3A2%7D%2C%20%7Ba%3A2%2C%20b%3A4%7D%5D">Try this <strong>R.dropRepeatsWith</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#dropRepeatsWith)

### dropWhile

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%2C%204%5D%0Aconst%20predicate%20%3D%20x%20%3D%3E%20x%20%3C%203%0Aconst%20result%20%3D%20R.dropWhile(predicate%2C%20list)%0A%2F%2F%20%3D%3E%20%5B3%2C%204%5D">Try this <strong>R.dropWhile</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#dropWhile)

### either

```typescript

either(firstPredicate: Pred, secondPredicate: Pred): Pred
```

It returns a new `predicate` function from `firstPredicate` and `secondPredicate` inputs.

This `predicate` function will return `true`, if any of the two input predicates return `true`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20firstPredicate%20%3D%20x%20%3D%3E%20x%20%3E%2010%0Aconst%20secondPredicate%20%3D%20x%20%3D%3E%20x%20%25%202%20%3D%3D%3D%200%0Aconst%20predicate%20%3D%20R.either(firstPredicate%2C%20secondPredicate)%0A%0Aconst%20result%20%3D%20%5B%0A%20%20predicate(15)%2C%0A%20%20predicate(8)%2C%0A%20%20predicate(7)%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20true%2C%20false%5D">Try this <strong>R.either</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
either(firstPredicate: Pred, secondPredicate: Pred): Pred;
either<T>(firstPredicate: Predicate<T>, secondPredicate: Predicate<T>): Predicate<T>;
either<T>(firstPredicate: Predicate<T>): (secondPredicate: Predicate<T>) => Predicate<T>;
either(firstPredicate: Pred): (secondPredicate: Pred) => Pred;
```

</details>

<details>

<summary><strong>R.either</strong> source</summary>

```javascript
export function either(firstPredicate, secondPredicate){
  if (arguments.length === 1){
    return _secondPredicate => either(firstPredicate, _secondPredicate)
  }

  return (...input) =>
    Boolean(firstPredicate(...input) || secondPredicate(...input))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { either } from './either.js'

test('with multiple inputs', () => {
  const between = function (
    a, b, c
  ){
    return a < b && b < c
  }
  const total20 = function (
    a, b, c
  ){
    return a + b + c === 20
  }
  const fn = either(between, total20)
  expect(fn(
    7, 8, 5
  )).toBeTrue()
})

test('skip evaluation of the second expression', () => {
  let effect = 'not evaluated'
  const F = function (){
    return true
  }
  const Z = function (){
    effect = 'Z got evaluated'
  }
  either(F, Z)()

  expect(effect).toBe('not evaluated')
})

test('case 1', () => {
  const firstFn = val => val > 0
  const secondFn = val => val * 5 > 10

  expect(either(firstFn, secondFn)(1)).toBeTrue()
})

test('case 2', () => {
  const firstFn = val => val > 0
  const secondFn = val => val === -10
  const fn = either(firstFn)(secondFn)

  expect(fn(-10)).toBeTrue()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {either} from 'rambda'

describe('R.either', () => {
  it('with passed type', () => {
    const fn = either<number>(
      x => x > 1,
      x => x % 2 === 0
    )
    fn // $ExpectType Predicate<number>
    const result = fn(2) // $ExpectType boolean
    result // $ExpectType boolean
  })
  it('with passed type - curried', () => {
    const fn = either<number>(x => x > 1)(x => x % 2 === 0)
    fn // $ExpectType Predicate<number>
    const result = fn(2)
    result // $ExpectType boolean
  })
  it('no type passed', () => {
    const fn = either(
      x => {
        x // $ExpectType any
        return x > 1
      },
      x => {
        x // $ExpectType any
        return x % 2 === 0
      }
    )
    const result = fn(2)
    result // $ExpectType boolean
  })
  it('no type passed - curried', () => {
    const fn = either((x: number) => {
      x // $ExpectType number
      return x > 1
    })((x: number) => {
      x // $ExpectType number
      return x % 2 === 0
    })
    const result = fn(2)
    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#either)

### empty

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5BR.empty(%5B1%2C2%2C3%5D)%2C%20R.empty('foo')%2C%20R.empty(%7Bx%3A%201%2C%20y%3A%202%7D)%5D%0A%2F%2F%20%3D%3E%20%5B%5B%5D%2C%20''%2C%20%7B%7D%5D">Try this <strong>R.empty</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#empty)

### endsWith

```typescript

endsWith<T extends string>(question: T, str: string): boolean
```

When iterable is a string, then it behaves as `String.prototype.endsWith`.
When iterable is a list, then it uses R.equals to determine if the target list ends in the same way as the given target.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20str%20%3D%20'foo-bar'%0Aconst%20list%20%3D%20%5B%7Ba%3A1%7D%2C%20%7Ba%3A2%7D%2C%20%7Ba%3A3%7D%5D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.endsWith('bar'%2C%20str)%2C%0A%20%20R.endsWith(%5B%7Ba%3A1%7D%2C%20%7Ba%3A2%7D%5D%2C%20list)%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20true%5D">Try this <strong>R.endsWith</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
endsWith<T extends string>(question: T, str: string): boolean;
endsWith<T extends string>(question: T): (str: string) => boolean;
endsWith<T>(question: T[], list: T[]): boolean;
endsWith<T>(question: T[]): (list: T[]) => boolean;
```

</details>

<details>

<summary><strong>R.endsWith</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'
import { equals } from './equals.js'

export function endsWith(target, iterable){
  if (arguments.length === 1) return _iterable => endsWith(target, _iterable)

  if (typeof iterable === 'string'){
    return iterable.endsWith(target)
  }
  if (!isArray(target)) return false

  const diff = iterable.length - target.length
  let correct = true
  const filtered = target.filter((x, index) => {
    if (!correct) return false
    const result = equals(x, iterable[ index + diff ])
    if (!result) correct = false

    return result
  })

  return filtered.length === target.length
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { endsWith as endsWithRamda } from 'ramda'

import { compareCombinations } from './_internals/testUtils.js'
import { endsWith } from './endsWith.js'

test('with string', () => {
  expect(endsWith('bar', 'foo-bar')).toBeTrue()
  expect(endsWith('baz')('foo-bar')).toBeFalse()
})

test('use R.equals with array', () => {
  const list = [ { a : 1 }, { a : 2 }, { a : 3 } ]
  expect(endsWith({ a : 3 }, list)).toBeFalse(),
  expect(endsWith([ { a : 3 } ], list)).toBeTrue()
  expect(endsWith([ { a : 2 }, { a : 3 } ], list)).toBeTrue()
  expect(endsWith(list, list)).toBeTrue()
  expect(endsWith([ { a : 1 } ], list)).toBeFalse()
})

export const possibleTargets = [
  NaN,
  [ NaN ],
  /foo/,
  [ /foo/ ],
  Promise.resolve(1),
  [ Promise.resolve(1) ],
  Error('foo'),
  [ Error('foo') ],
]

export const possibleIterables = [
  [ Promise.resolve(1), Promise.resolve(2) ],
  [ /foo/, /bar/ ],
  [ NaN ],
  [ Error('foo'), Error('bar') ],
]

describe('brute force', () => {
  compareCombinations({
    fn          : endsWith,
    fnRamda     : endsWithRamda,
    firstInput  : possibleTargets,
    secondInput : possibleIterables,
    callback    : errorsCounters => {
      expect(errorsCounters).toMatchInlineSnapshot(`
        {
          "ERRORS_MESSAGE_MISMATCH": 0,
          "ERRORS_TYPE_MISMATCH": 0,
          "RESULTS_MISMATCH": 0,
          "SHOULD_NOT_THROW": 0,
          "SHOULD_THROW": 0,
          "TOTAL_TESTS": 32,
        }
      `)
    },
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {endsWith} from 'rambda'

describe('R.endsWith - array', () => {
  const target = [{a: 2}]
  const input = [{a: 1}, {a: 2}]
  it('happy', () => {
    const result = endsWith(target, input)
    result // $ExpectType boolean
  })
  it('curried', () => {
    const result = endsWith(target)(input)
    result // $ExpectType boolean
  })
})

describe('R.endsWith - string', () => {
  const target = 'bar'
  const input = 'foo bar'
  it('happy', () => {
    const result = endsWith(target, input)
    result // $ExpectType boolean
  })
  it('curried', () => {
    const result = endsWith(target)(input)
    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#endsWith)

### eqBy

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.eqBy(Math.abs%2C%205%2C%20-5)%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.eqBy</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#eqBy)

### eqProps

It returns `true` if property `prop` in `obj1` is equal to property `prop` in `obj2` according to `R.equals`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj1%20%3D%20%7Ba%3A%201%2C%20b%3A2%7D%0Aconst%20obj2%20%3D%20%7Ba%3A%201%2C%20b%3A3%7D%0Aconst%20result%20%3D%20R.eqProps('a'%2C%20obj1%2C%20obj2)%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.eqProps</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#eqProps)

### equals

```typescript

equals<T>(x: T, y: T): boolean
```

It deeply compares `x` and `y` and returns `true` if they are equal.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?R.equals(%0A%20%20%5B1%2C%20%7Ba%3A2%7D%2C%20%5B%7Bb%3A%203%7D%5D%5D%2C%0A%20%20%5B1%2C%20%7Ba%3A2%7D%2C%20%5B%7Bb%3A%203%7D%5D%5D%0Aconst%20result%20%3D%20)%20%2F%2F%20%3D%3E%20true">Try this <strong>R.equals</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
equals<T>(x: T, y: T): boolean;
equals<T>(x: T): (y: T) => boolean;
```

</details>

<details>

<summary><strong>R.equals</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'
import { type } from './type.js'

export function _lastIndexOf(valueToFind, list){
  if (!isArray(list))
    throw new Error(`Cannot read property 'indexOf' of ${ list }`)

  const typeOfValue = type(valueToFind)
  if (![ 'Array', 'NaN', 'Object', 'RegExp' ].includes(typeOfValue))
    return list.lastIndexOf(valueToFind)

  const { length } = list
  let index = length
  let foundIndex = -1

  while (--index > -1 && foundIndex === -1)
    if (equals(list[ index ], valueToFind))
      foundIndex = index

  return foundIndex
}

export function _indexOf(valueToFind, list){
  if (!isArray(list))
    throw new Error(`Cannot read property 'indexOf' of ${ list }`)

  const typeOfValue = type(valueToFind)
  if (![ 'Array', 'NaN', 'Object', 'RegExp' ].includes(typeOfValue))
    return list.indexOf(valueToFind)

  let index = -1
  let foundIndex = -1
  const { length } = list

  while (++index < length && foundIndex === -1)
    if (equals(list[ index ], valueToFind))
      foundIndex = index

  return foundIndex
}

function _arrayFromIterator(iter){
  const list = []
  let next
  while (!(next = iter.next()).done)
    list.push(next.value)

  return list
}

function _compareSets(a, b){
  if (a.size !== b.size)
    return false

  const aList = _arrayFromIterator(a.values())
  const bList = _arrayFromIterator(b.values())

  const filtered = aList.filter(aInstance => _indexOf(aInstance, bList) === -1)

  return filtered.length === 0
}

function compareErrors(a, b){
  if (a.message !== b.message) return false
  if (a.toString !== b.toString) return false

  return a.toString() === b.toString()
}

function parseDate(maybeDate){
  if (!maybeDate.toDateString) return [ false ]

  return [ true, maybeDate.getTime() ]
}

function parseRegex(maybeRegex){
  if (maybeRegex.constructor !== RegExp) return [ false ]

  return [ true, maybeRegex.toString() ]
}

export function equals(a, b){
  if (arguments.length === 1) return _b => equals(a, _b)

  if (Object.is(a, b)) return true

  const aType = type(a)

  if (aType !== type(b)) return false
  if (aType === 'Function')
    return a.name === undefined ? false : a.name === b.name

  if ([ 'NaN', 'Null', 'Undefined' ].includes(aType)) return true

  if ([ 'BigInt', 'Number' ].includes(aType)){
    if (Object.is(-0, a) !== Object.is(-0, b)) return false

    return a.toString() === b.toString()
  }

  if ([ 'Boolean', 'String' ].includes(aType))
    return a.toString() === b.toString()

  if (aType === 'Array'){
    const aClone = Array.from(a)
    const bClone = Array.from(b)

    if (aClone.toString() !== bClone.toString())
      return false

    let loopArrayFlag = true
    aClone.forEach((aCloneInstance, aCloneIndex) => {
      if (loopArrayFlag)
        if (
          aCloneInstance !== bClone[ aCloneIndex ] &&
          !equals(aCloneInstance, bClone[ aCloneIndex ])
        )
          loopArrayFlag = false

    })

    return loopArrayFlag
  }

  const aRegex = parseRegex(a)
  const bRegex = parseRegex(b)

  if (aRegex[ 0 ])
    return bRegex[ 0 ] ? aRegex[ 1 ] === bRegex[ 1 ] : false
  else if (bRegex[ 0 ]) return false

  const aDate = parseDate(a)
  const bDate = parseDate(b)

  if (aDate[ 0 ])
    return bDate[ 0 ] ? aDate[ 1 ] === bDate[ 1 ] : false
  else if (bDate[ 0 ]) return false

  if (a instanceof Error){
    if (!(b instanceof Error)) return false

    return compareErrors(a, b)
  }

  if (aType === 'Set')
    return _compareSets(a, b)

  if (aType === 'Object'){
    const aKeys = Object.keys(a)

    if (aKeys.length !== Object.keys(b).length)
      return false

    let loopObjectFlag = true
    aKeys.forEach(aKeyInstance => {
      if (loopObjectFlag){
        const aValue = a[ aKeyInstance ]
        const bValue = b[ aKeyInstance ]

        if (aValue !== bValue && !equals(aValue, bValue))
          loopObjectFlag = false

      }
    })

    return loopObjectFlag
  }

  return false
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { equals as equalsRamda } from 'ramda'

import { compareCombinations } from './_internals/testUtils.js'
import { variousTypes } from './benchmarks/_utils.js'
import { equals } from './equals.js'

test('compare functions', () => {
  function foo(){}
  function bar(){}
  const baz = () => {}

  const expectTrue = equals(foo, foo)
  const expectFalseFirst = equals(foo, bar)
  const expectFalseSecond = equals(foo, baz)

  expect(expectTrue).toBeTrue()
  expect(expectFalseFirst).toBeFalse()
  expect(expectFalseSecond).toBeFalse()
})

test('with array of objects', () => {
  const list1 = [ { a : 1 }, [ { b : 2 } ] ]
  const list2 = [ { a : 1 }, [ { b : 2 } ] ]
  const list3 = [ { a : 1 }, [ { b : 3 } ] ]

  expect(equals(list1, list2)).toBeTrue()
  expect(equals(list1, list3)).toBeFalse()
})

test('with regex', () => {
  expect(equals(/s/, /s/)).toBeTrue()
  expect(equals(/s/, /d/)).toBeFalse()
  expect(equals(/a/gi, /a/gi)).toBeTrue()
  expect(equals(/a/gim, /a/gim)).toBeTrue()
  expect(equals(/a/gi, /a/i)).toBeFalse()
})

test('not a number', () => {
  expect(equals([ NaN ], [ NaN ])).toBeTrue()
})

test('new number', () => {
  expect(equals(new Number(0), new Number(0))).toBeTrue()
  expect(equals(new Number(0), new Number(1))).toBeFalse()
  expect(equals(new Number(1), new Number(0))).toBeFalse()
})

test('new string', () => {
  expect(equals(new String(''), new String(''))).toBeTrue()
  expect(equals(new String(''), new String('x'))).toBeFalse()
  expect(equals(new String('x'), new String(''))).toBeFalse()
  expect(equals(new String('foo'), new String('foo'))).toBeTrue()
  expect(equals(new String('foo'), new String('bar'))).toBeFalse()
  expect(equals(new String('bar'), new String('foo'))).toBeFalse()
})

test('new Boolean', () => {
  expect(equals(new Boolean(true), new Boolean(true))).toBeTrue()
  expect(equals(new Boolean(false), new Boolean(false))).toBeTrue()
  expect(equals(new Boolean(true), new Boolean(false))).toBeFalse()
  expect(equals(new Boolean(false), new Boolean(true))).toBeFalse()
})

test('new Error', () => {
  expect(equals(new Error('XXX'), {})).toBeFalse()
  expect(equals(new Error('XXX'), new TypeError('XXX'))).toBeFalse()
  expect(equals(new Error('XXX'), new Error('YYY'))).toBeFalse()
  expect(equals(new Error('XXX'), new Error('XXX'))).toBeTrue()
  expect(equals(new Error('XXX'), new TypeError('YYY'))).toBeFalse()
  expect(equals(new Error('XXX'), new Error('XXX'))).toBeTrue()
})

test('with dates', () => {
  expect(equals(new Date(0), new Date(0))).toBeTrue()
  expect(equals(new Date(1), new Date(1))).toBeTrue()
  expect(equals(new Date(0), new Date(1))).toBeFalse()
  expect(equals(new Date(1), new Date(0))).toBeFalse()
  expect(equals(new Date(0), {})).toBeFalse()
  expect(equals({}, new Date(0))).toBeFalse()
})

test('ramda spec', () => {
  expect(equals({}, {})).toBeTrue()

  expect(equals({
    a : 1,
    b : 2,
  },
  {
    a : 1,
    b : 2,
  })).toBeTrue()

  expect(equals({
    a : 2,
    b : 3,
  },
  {
    a : 2,
    b : 3,
  })).toBeTrue()

  expect(equals({
    a : 2,
    b : 3,
  },
  {
    a : 3,
    b : 3,
  })).toBeFalse()

  expect(equals({
    a : 2,
    b : 3,
    c : 1,
  },
  {
    a : 2,
    b : 3,
  })).toBeFalse()
})

test('works with boolean tuple', () => {
  expect(equals([ true, false ], [ true, false ])).toBeTrue()
  expect(equals([ true, false ], [ true, true ])).toBeFalse()
})

test('works with equal objects within array', () => {
  const objFirst = {
    a : {
      b : 1,
      c : 2,
      d : [ 1 ],
    },
  }
  const objSecond = {
    a : {
      b : 1,
      c : 2,
      d : [ 1 ],
    },
  }

  const x = [ 1, 2, objFirst, null, '', [] ]
  const y = [ 1, 2, objSecond, null, '', [] ]
  expect(equals(x, y)).toBeTrue()
})

test('works with different objects within array', () => {
  const objFirst = { a : { b : 1 } }
  const objSecond = { a : { b : 2 } }

  const x = [ 1, 2, objFirst, null, '', [] ]
  const y = [ 1, 2, objSecond, null, '', [] ]
  expect(equals(x, y)).toBeFalse()
})

test('works with undefined as second argument', () => {
  expect(equals(1, undefined)).toBeFalse()

  expect(equals(undefined, undefined)).toBeTrue()
})

test('compare sets', () => {
  const toCompareDifferent = new Set([ { a : 1 }, { a : 2 } ])
  const toCompareSame = new Set([ { a : 1 }, { a : 2 }, { a : 1 } ])
  const testSet = new Set([ { a : 1 }, { a : 2 }, { a : 1 } ])
  expect(equals(toCompareSame, testSet)).toBeTruthy()
  expect(equals(toCompareDifferent, testSet)).toBeFalsy()
  expect(equalsRamda(toCompareSame, testSet)).toBeTruthy()
  expect(equalsRamda(toCompareDifferent, testSet)).toBeFalsy()
})

test('compare simple sets', () => {
  const testSet = new Set([ '2', '3', '3', '2', '1' ])
  expect(equals(new Set([ '3', '2', '1' ]), testSet)).toBeTruthy()
  expect(equals(new Set([ '3', '2', '0' ]), testSet)).toBeFalsy()
})

test('various examples', () => {
  expect(equals([ 1, 2, 3 ])([ 1, 2, 3 ])).toBeTrue()

  expect(equals([ 1, 2, 3 ], [ 1, 2 ])).toBeFalse()

  expect(equals(1, 1)).toBeTrue()

  expect(equals(1, '1')).toBeFalse()

  expect(equals({}, {})).toBeTrue()

  expect(equals({
    a : 1,
    b : 2,
  },
  {
    a : 1,
    b : 2,
  })).toBeTrue()

  expect(equals({
    a : 1,
    b : 2,
  },
  {
    a : 1,
    b : 1,
  })).toBeFalse()

  expect(equals({
    a : 1,
    b : false,
  },
  {
    a : 1,
    b : 1,
  })).toBeFalse()

  expect(equals({
    a : 1,
    b : 2,
  },
  {
    a : 1,
    b : 2,
    c : 3,
  })).toBeFalse()

  expect(equals({
    x : {
      a : 1,
      b : 2,
    },
  },
  {
    x : {
      a : 1,
      b : 2,
      c : 3,
    },
  })).toBeFalse()

  expect(equals({
    a : 1,
    b : 2,
  },
  {
    a : 1,
    b : 3,
  })).toBeFalse()

  expect(equals({ a : { b : { c : 1 } } }, { a : { b : { c : 1 } } })).toBeTrue()

  expect(equals({ a : { b : { c : 1 } } }, { a : { b : { c : 2 } } })).toBeFalse()

  expect(equals({ a : {} }, { a : {} })).toBeTrue()

  expect(equals('', '')).toBeTrue()

  expect(equals('foo', 'foo')).toBeTrue()

  expect(equals('foo', 'bar')).toBeFalse()

  expect(equals(0, false)).toBeFalse()

  expect(equals(/\s/g, null)).toBeFalse()

  expect(equals(null, null)).toBeTrue()

  expect(equals(false)(null)).toBeFalse()
})

test('with custom functions', () => {
  function foo(){
    return 1
  }
  foo.prototype.toString = () => ''
  const result = equals(foo, foo)

  expect(result).toBeTrue()
})

test('with classes', () => {
  class Foo{}
  const foo = new Foo()
  const result = equals(foo, foo)

  expect(result).toBeTrue()
})

test('with negative zero', () => {
  expect(equals(-0, -0)).toBeTrue()
  expect(equals(-0, 0)).toBeFalse()
  expect(equals(0, 0)).toBeTrue()
  expect(equals(-0, 1)).toBeFalse()
})

test('with big int', () => {
  const a = BigInt(9007199254740991)
  const b = BigInt(9007199254740991)
  const c = BigInt(7007199254740991)
  expect(equals(a, b)).toBeTrue()
  expect(equals(a, c)).toBeFalse()
})

describe('brute force', () => {
  compareCombinations({
    callback : errorsCounters => {
      expect(errorsCounters).toMatchInlineSnapshot(`
{
  "ERRORS_MESSAGE_MISMATCH": 0,
  "ERRORS_TYPE_MISMATCH": 0,
  "RESULTS_MISMATCH": 0,
  "SHOULD_NOT_THROW": 0,
  "SHOULD_THROW": 0,
  "TOTAL_TESTS": 289,
}
`)
    },
    firstInput  : variousTypes,
    fn          : equals,
    fnRamda     : equalsRamda,
    secondInput : variousTypes,
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {equals} from 'rambda'

describe('R.equals', () => {
  it('happy', () => {
    const result = equals(4, 1)
    result // $ExpectType boolean
  })
  it('with object', () => {
    const foo = {a: 1}
    const bar = {a: 2}
    const result = equals(foo, bar)
    result // $ExpectType boolean
  })
  it('curried', () => {
    const result = equals(4)(1)

    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#equals)

### evolve

```typescript

evolve<T, U>(rules: ((x: T) => U)[], list: T[]): U[]
```

It takes object or array of functions as set of rules. These `rules` are applied to the `iterable` input to produce the result.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20rules%20%3D%20%7B%0A%20%20foo%20%3A%20add(1)%2C%0A%20%20bar%20%3A%20add(-1)%2C%0A%7D%0Aconst%20input%20%3D%20%7B%0A%20%20a%20%20%20%3A%201%2C%0A%20%20foo%20%3A%202%2C%0A%20%20bar%20%3A%203%2C%0A%7D%0Aconst%20result%20%3D%20evolve(rules%2C%20input)%0Aconst%20expected%20%3D%20%7B%0A%20%20a%20%20%20%3A%201%2C%0A%20%20foo%20%3A%203%2C%0A%20%20bar%20%3A%202%2C%0A%7D)%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.evolve</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
evolve<T, U>(rules: ((x: T) => U)[], list: T[]): U[];
evolve<T, U>(rules: ((x: T) => U)[]) : (list: T[]) => U[];
evolve<E extends Evolver, V extends Evolvable<E>>(rules: E, obj: V): Evolve<V, E>;
evolve<E extends Evolver>(rules: E): <V extends Evolvable<E>>(obj: V) => Evolve<V, E>;
```

</details>

<details>

<summary><strong>R.evolve</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'
import { mapArray, mapObject } from './map.js'
import { type } from './type.js'

export function evolveArray(rules, list){
  return mapArray(
    (x, i) => {
      if (type(rules[ i ]) === 'Function'){
        return rules[ i ](x)
      }

      return x
    },
    list,
    true
  )
}

export function evolveObject(rules, iterable){
  return mapObject((x, prop) => {
    if (type(x) === 'Object'){
      const typeRule = type(rules[ prop ])
      if (typeRule === 'Function'){
        return rules[ prop ](x)
      }
      if (typeRule === 'Object'){
        return evolve(rules[ prop ], x)
      }

      return x
    }
    if (type(rules[ prop ]) === 'Function'){
      return rules[ prop ](x)
    }

    return x
  }, iterable)
}

export function evolve(rules, iterable){
  if (arguments.length === 1){
    return _iterable => evolve(rules, _iterable)
  }
  const rulesType = type(rules)
  const iterableType = type(iterable)

  if (iterableType !== rulesType){
    throw new Error('iterableType !== rulesType')
  }

  if (![ 'Object', 'Array' ].includes(rulesType)){
    throw new Error(`'iterable' and 'rules' are from wrong type ${ rulesType }`)
  }

  if (iterableType === 'Object'){
    return evolveObject(rules, iterable)
  }

  return evolveArray(rules, iterable)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { evolve as evolveRamda } from 'ramda'

import { add } from '../rambda.js'
import { compareCombinations, compareToRamda } from './_internals/testUtils.js'
import { evolve } from './evolve.js'

test('happy', () => {
  const rules = {
    foo    : add(1),
    nested : { bar : x => Object.keys(x).length },
  }
  const input = {
    a      : 1,
    foo    : 2,
    nested : { bar : { z : 3 } },
  }
  const result = evolve(rules, input)
  expect(result).toEqual({
    a      : 1,
    foo    : 3,
    nested : { bar : 1 },
  })
})

test('nested rule is wrong', () => {
  const rules = {
    foo    : add(1),
    nested : { bar : 10 },
  }
  const input = {
    a      : 1,
    foo    : 2,
    nested : { bar : { z : 3 } },
  }
  const result = evolve(rules)(input)
  expect(result).toEqual({
    a      : 1,
    foo    : 3,
    nested : { bar : { z : 3 } },
  })
})

test('is recursive', () => {
  const rules = {
    nested : {
      second : add(-1),
      third  : add(1),
    },
  }
  const object = {
    first  : 1,
    nested : {
      second : 2,
      third  : 3,
    },
  }
  const expected = {
    first  : 1,
    nested : {
      second : 1,
      third  : 4,
    },
  }
  const result = evolve(rules, object)
  expect(result).toEqual(expected)
})

test('ignores primitive values', () => {
  const rules = {
    n : 2,
    m : 'foo',
  }
  const object = {
    n : 0,
    m : 1,
  }
  const expected = {
    n : 0,
    m : 1,
  }
  const result = evolve(rules, object)
  expect(result).toEqual(expected)
})

test('with array', () => {
  const rules = [ add(1), add(-1) ]
  const list = [ 100, 1400 ]
  const expected = [ 101, 1399 ]
  const result = evolve(rules, list)
  expect(result).toEqual(expected)
})

const rulesObject = { a : add(1) }
const rulesList = [ add(1) ]
const possibleIterables = [ null, undefined, '', 42, [], [ 1 ], { a : 1 } ]
const possibleRules = [ ...possibleIterables, rulesList, rulesObject ]

describe('brute force', () => {
  compareCombinations({
    firstInput : possibleRules,
    callback   : errorsCounters => {
      expect(errorsCounters).toMatchInlineSnapshot(`
        {
          "ERRORS_MESSAGE_MISMATCH": 0,
          "ERRORS_TYPE_MISMATCH": 4,
          "RESULTS_MISMATCH": 0,
          "SHOULD_NOT_THROW": 51,
          "SHOULD_THROW": 0,
          "TOTAL_TESTS": 63,
        }
      `)
    },
    secondInput : possibleIterables,
    fn          : evolve,
    fnRamda     : evolveRamda,
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {evolve, add} from 'rambda'

describe('R.evolve', () => {
  it('happy', () => {
    const input = {
      foo: 2,
      nested: {
        a: 1,
        bar: 3,
      },
    }
    const rules = {
      foo: add(1),
      nested: {
        a: add(-1),
        bar: add(1),
      },
    }
    const result = evolve(rules, input)
    const curriedResult = evolve(rules)(input)

    result.nested.a // $ExpectType number
    curriedResult.nested.a // $ExpectType number
    result.nested.bar // $ExpectType number
    result.foo // $ExpectType number
  })
  it('with array', () => {
    const rules = [String, String]
    const input = [100, 1400]
    const result = evolve(rules, input)
    const curriedResult = evolve(rules)(input)
    result // $ExpectType string[]
    curriedResult // $ExpectType string[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#evolve)

### F

```typescript

F(): boolean
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20F()%20%2F%2F%20%3D%3E%20false">Try this <strong>R.F</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
F(): boolean;
```

</details>

<details>

<summary><strong>R.F</strong> source</summary>

```javascript
export function F(){
  return false
}
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#F)

### filter

```typescript

filter<T>(predicate: Predicate<T>): (input: T[]) => T[]
```

It filters list or object `input` using a `predicate` function.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B3%2C%204%2C%203%2C%202%5D%0Aconst%20listPredicate%20%3D%20x%20%3D%3E%20x%20%3E%202%0A%0Aconst%20object%20%3D%20%7Babc%3A%20'fo'%2C%20xyz%3A%20'bar'%2C%20baz%3A%20'foo'%7D%0Aconst%20objectPredicate%20%3D%20(x%2C%20prop)%20%3D%3E%20x.length%20%2B%20prop.length%20%3E%205%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.filter(listPredicate%2C%20list)%2C%0A%20%20R.filter(objectPredicate%2C%20object)%0A%5D%0A%2F%2F%20%3D%3E%20%5B%20%5B3%2C%204%5D%2C%20%7B%20xyz%3A%20'bar'%2C%20baz%3A%20'foo'%7D%20%5D">Try this <strong>R.filter</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
filter<T>(predicate: Predicate<T>): (input: T[]) => T[];
filter<T>(predicate: Predicate<T>, input: T[]): T[];
filter<T, U>(predicate: ObjectPredicate<T>): (x: Dictionary<T>) => Dictionary<T>;
filter<T>(predicate: ObjectPredicate<T>, x: Dictionary<T>): Dictionary<T>;
```

</details>

<details>

<summary><strong>R.filter</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'

export function filterObject(predicate, obj){
  const willReturn = {}

  for (const prop in obj){
    if (predicate(
      obj[ prop ], prop, obj
    )){
      willReturn[ prop ] = obj[ prop ]
    }
  }

  return willReturn
}

export function filterArray(
  predicate, list, indexed = false
){
  let index = 0
  const len = list.length
  const willReturn = []

  while (index < len){
    const predicateResult = indexed ?
      predicate(list[ index ], index) :
      predicate(list[ index ])
    if (predicateResult){
      willReturn.push(list[ index ])
    }

    index++
  }

  return willReturn
}

export function filter(predicate, iterable){
  if (arguments.length === 1)
    return _iterable => filter(predicate, _iterable)
  if (!iterable){
    throw new Error('Incorrect iterable input')
  }

  if (isArray(iterable)) return filterArray(
    predicate, iterable, false
  )

  return filterObject(predicate, iterable)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { filter as filterRamda } from 'ramda'

import { filter } from './filter.js'
import { T } from './T.js'

const sampleObject = {
  a : 1,
  b : 2,
  c : 3,
  d : 4,
}

test('happy', () => {
  const isEven = n => n % 2 === 0

  expect(filter(isEven, [ 1, 2, 3, 4 ])).toEqual([ 2, 4 ])
  expect(filter(isEven, {
    a : 1,
    b : 2,
    d : 3,
  })).toEqual({ b : 2 })
})

test('predicate when input is object', () => {
  const obj = {
    a : 1,
    b : 2,
  }
  const predicate = (
    val, prop, inputObject
  ) => {
    expect(inputObject).toEqual(obj)
    expect(typeof prop).toBe('string')

    return val < 2
  }
  expect(filter(predicate, obj)).toEqual({ a : 1 })
})

test('with object', () => {
  const isEven = n => n % 2 === 0
  const result = filter(isEven, sampleObject)
  const expectedResult = {
    b : 2,
    d : 4,
  }

  expect(result).toEqual(expectedResult)
})

test('bad inputs difference between Ramda and Rambda', () => {
  expect(() => filter(T, null)).toThrowWithMessage(Error,
    'Incorrect iterable input')
  expect(() => filter(T)(undefined)).toThrowWithMessage(Error,
    'Incorrect iterable input')
  expect(() => filterRamda(T, null)).toThrowWithMessage(TypeError,
    'Cannot read properties of null (reading \'fantasy-land/filter\')')
  expect(() => filterRamda(T, undefined)).toThrowWithMessage(TypeError,
    'Cannot read properties of undefined (reading \'fantasy-land/filter\')')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {filter} from 'rambda'

const list = [1, 2, 3]
const obj = {a: 1, b: 2}

describe('R.filter with array', () => {
  it('happy', () => {
    const result = filter<number>(x => {
      x // $ExpectType number
      return x > 1
    }, list)
    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = filter<number>(x => {
      x // $ExpectType number
      return x > 1
    })(list)
    result // $ExpectType number[]
  })
})

describe('R.filter with objects', () => {
  it('happy', () => {
    const result = filter<number>((val, prop, origin) => {
      val // $ExpectType number
      prop // $ExpectType string
      origin // $ExpectType Dictionary<number>

      return val > 1
    }, obj)
    result // $ExpectType Dictionary<number>
  })
  it('curried version requires second dummy type', () => {
    const result = filter<number, any>((val, prop, origin) => {
      val // $ExpectType number
      prop // $ExpectType string
      origin // $ExpectType Dictionary<number>

      return val > 1
    })(obj)
    result // $ExpectType Dictionary<number>
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#filter)

### find

```typescript

find<T>(predicate: (x: T) => boolean, list: T[]): T | undefined
```

It returns the first element of `list` that satisfy the `predicate`.

If there is no such element, it returns `undefined`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20predicate%20%3D%20x%20%3D%3E%20R.type(x.foo)%20%3D%3D%3D%20'Number'%0Aconst%20list%20%3D%20%5B%7Bfoo%3A%20'bar'%7D%2C%20%7Bfoo%3A%201%7D%5D%0A%0Aconst%20result%20%3D%20R.find(predicate%2C%20list)%0A%2F%2F%20%3D%3E%20%7Bfoo%3A%201%7D">Try this <strong>R.find</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
find<T>(predicate: (x: T) => boolean, list: T[]): T | undefined;
find<T>(predicate: (x: T) => boolean): (list: T[]) => T | undefined;
```

</details>

<details>

<summary><strong>R.find</strong> source</summary>

```javascript
export function find(predicate, list){
  if (arguments.length === 1) return _list => find(predicate, _list)

  let index = 0
  const len = list.length

  while (index < len){
    const x = list[ index ]
    if (predicate(x)){
      return x
    }

    index++
  }
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { find } from './find.js'
import { propEq } from './propEq.js'

const list = [ { a : 1 }, { a : 2 }, { a : 3 } ]

test('happy', () => {
  const fn = propEq(2, 'a')
  expect(find(fn, list)).toEqual({ a : 2 })
})

test('with curry', () => {
  const fn = propEq(4, 'a')
  expect(find(fn)(list)).toBeUndefined()
})

test('with empty list', () => {
  expect(find(() => true, [])).toBeUndefined()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {find} from 'rambda'

const list = [1, 2, 3]

describe('R.find', () => {
  it('happy', () => {
    const predicate = (x: number) => x > 2
    const result = find(predicate, list)
    result // $ExpectType number | undefined
  })
  it('curried', () => {
    const predicate = (x: number) => x > 2
    const result = find(predicate)(list)
    result // $ExpectType number | undefined
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#find)

### findIndex

```typescript

findIndex<T>(predicate: (x: T) => boolean, list: T[]): number
```

It returns the index of the first element of `list` satisfying the `predicate` function.

If there is no such element, then `-1` is returned.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20predicate%20%3D%20x%20%3D%3E%20R.type(x.foo)%20%3D%3D%3D%20'Number'%0Aconst%20list%20%3D%20%5B%7Bfoo%3A%20'bar'%7D%2C%20%7Bfoo%3A%201%7D%5D%0A%0Aconst%20result%20%3D%20R.findIndex(predicate%2C%20list)%0A%2F%2F%20%3D%3E%201">Try this <strong>R.findIndex</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
findIndex<T>(predicate: (x: T) => boolean, list: T[]): number;
findIndex<T>(predicate: (x: T) => boolean): (list: T[]) => number;
```

</details>

<details>

<summary><strong>R.findIndex</strong> source</summary>

```javascript
export function findIndex(predicate, list){
  if (arguments.length === 1) return _list => findIndex(predicate, _list)

  const len = list.length
  let index = -1

  while (++index < len){
    if (predicate(list[ index ])){
      return index
    }
  }

  return -1
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { findIndex } from './findIndex.js'
import { propEq } from './propEq.js'

const list = [ { a : 1 }, { a : 2 }, { a : 3 } ]

test('happy', () => {
  expect(findIndex(propEq(2, 'a'), list)).toBe(1)
  expect(findIndex(propEq(1, 'a'))(list)).toBe(0)
  expect(findIndex(propEq(4, 'a'))(list)).toBe(-1)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {findIndex} from 'rambda'

const list = [1, 2, 3]

describe('R.findIndex', () => {
  it('happy', () => {
    const predicate = (x: number) => x > 2
    const result = findIndex(predicate, list)
    result // $ExpectType number
  })
  it('curried', () => {
    const predicate = (x: number) => x > 2
    const result = findIndex(predicate)(list)
    result // $ExpectType number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#findIndex)

### findLast

```typescript

findLast<T>(fn: (x: T) => boolean, list: T[]): T | undefined
```

It returns the last element of `list` satisfying the `predicate` function.

If there is no such element, then `undefined` is returned.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20predicate%20%3D%20x%20%3D%3E%20R.type(x.foo)%20%3D%3D%3D%20'Number'%0Aconst%20list%20%3D%20%5B%7Bfoo%3A%200%7D%2C%20%7Bfoo%3A%201%7D%5D%0A%0Aconst%20result%20%3D%20R.findLast(predicate%2C%20list)%0A%2F%2F%20%3D%3E%20%7Bfoo%3A%201%7D">Try this <strong>R.findLast</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
findLast<T>(fn: (x: T) => boolean, list: T[]): T | undefined;
findLast<T>(fn: (x: T) => boolean): (list: T[]) => T | undefined;
```

</details>

<details>

<summary><strong>R.findLast</strong> source</summary>

```javascript
export function findLast(predicate, list){
  if (arguments.length === 1) return _list => findLast(predicate, _list)

  let index = list.length

  while (--index >= 0){
    if (predicate(list[ index ])){
      return list[ index ]
    }
  }

  return undefined
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { findLast } from './findLast.js'

test('happy', () => {
  const result = findLast(x => x > 1, [ 1, 1, 1, 2, 3, 4, 1 ])
  expect(result).toBe(4)

  expect(findLast(x => x === 0, [ 0, 1, 1, 2, 3, 4, 1 ])).toBe(0)
})

test('with curry', () => {
  expect(findLast(x => x > 1)([ 1, 1, 1, 2, 3, 4, 1 ])).toBe(4)
})

const obj1 = { x : 100 }
const obj2 = { x : 200 }
const a = [ 11, 10, 9, 'cow', obj1, 8, 7, 100, 200, 300, obj2, 4, 3, 2, 1, 0 ]
const even = function (x){
  return x % 2 === 0
}
const gt100 = function (x){
  return x > 100
}
const isStr = function (x){
  return typeof x === 'string'
}
const xGt100 = function (o){
  return o && o.x > 100
}

test('ramda 1', () => {
  expect(findLast(even, a)).toBe(0)
  expect(findLast(gt100, a)).toBe(300)
  expect(findLast(isStr, a)).toBe('cow')
  expect(findLast(xGt100, a)).toEqual(obj2)
})

test('ramda 2', () => {
  expect(findLast(even, [ 'zing' ])).toBeUndefined()
})

test('ramda 3', () => {
  expect(findLast(even, [ 2, 3, 5 ])).toBe(2)
})

test('ramda 4', () => {
  expect(findLast(even, [])).toBeUndefined()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {findLast} from 'rambda'

const list = [1, 2, 3]

describe('R.findLast', () => {
  it('happy', () => {
    const predicate = (x: number) => x > 2
    const result = findLast(predicate, list)
    result // $ExpectType number | undefined
  })
  it('curried', () => {
    const predicate = (x: number) => x > 2
    const result = findLast(predicate)(list)
    result // $ExpectType number | undefined
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#findLast)

### findLastIndex

```typescript

findLastIndex<T>(predicate: (x: T) => boolean, list: T[]): number
```

It returns the index of the last element of `list` satisfying the `predicate` function.

If there is no such element, then `-1` is returned.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20predicate%20%3D%20x%20%3D%3E%20R.type(x.foo)%20%3D%3D%3D%20'Number'%0Aconst%20list%20%3D%20%5B%7Bfoo%3A%200%7D%2C%20%7Bfoo%3A%201%7D%5D%0A%0Aconst%20result%20%3D%20R.findLastIndex(predicate%2C%20list)%0A%2F%2F%20%3D%3E%201">Try this <strong>R.findLastIndex</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
findLastIndex<T>(predicate: (x: T) => boolean, list: T[]): number;
findLastIndex<T>(predicate: (x: T) => boolean): (list: T[]) => number;
```

</details>

<details>

<summary><strong>R.findLastIndex</strong> source</summary>

```javascript
export function findLastIndex(fn, list){
  if (arguments.length === 1) return _list => findLastIndex(fn, _list)

  let index = list.length

  while (--index >= 0){
    if (fn(list[ index ])){
      return index
    }
  }

  return -1
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { findLastIndex } from './findLastIndex.js'

test('happy', () => {
  const result = findLastIndex(x => x > 1, [ 1, 1, 1, 2, 3, 4, 1 ])

  expect(result).toBe(5)

  expect(findLastIndex(x => x === 0, [ 0, 1, 1, 2, 3, 4, 1 ])).toBe(0)
})

test('with curry', () => {
  expect(findLastIndex(x => x > 1)([ 1, 1, 1, 2, 3, 4, 1 ])).toBe(5)
})

const obj1 = { x : 100 }
const obj2 = { x : 200 }
const a = [ 11, 10, 9, 'cow', obj1, 8, 7, 100, 200, 300, obj2, 4, 3, 2, 1, 0 ]
const even = function (x){
  return x % 2 === 0
}
const gt100 = function (x){
  return x > 100
}
const isStr = function (x){
  return typeof x === 'string'
}
const xGt100 = function (o){
  return o && o.x > 100
}

test('ramda 1', () => {
  expect(findLastIndex(even, a)).toBe(15)
  expect(findLastIndex(gt100, a)).toBe(9)
  expect(findLastIndex(isStr, a)).toBe(3)
  expect(findLastIndex(xGt100, a)).toBe(10)
})

test('ramda 2', () => {
  expect(findLastIndex(even, [ 'zing' ])).toBe(-1)
})

test('ramda 3', () => {
  expect(findLastIndex(even, [ 2, 3, 5 ])).toBe(0)
})

test('ramda 4', () => {
  expect(findLastIndex(even, [])).toBe(-1)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {findLastIndex} from 'rambda'

const list = [1, 2, 3]

describe('R.findLastIndex', () => {
  it('happy', () => {
    const predicate = (x: number) => x > 2
    const result = findLastIndex(predicate, list)
    result // $ExpectType number
  })
  it('curried', () => {
    const predicate = (x: number) => x > 2
    const result = findLastIndex(predicate)(list)
    result // $ExpectType number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#findLastIndex)

### flatten

```typescript

flatten<T>(list: any[]): T[]
```

It deeply flattens an array.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.flatten(%5B%0A%20%201%2C%20%0A%20%202%2C%20%0A%20%20%5B3%2C%2030%2C%20%5B300%5D%5D%2C%20%0A%20%20%5B4%5D%0A%5D)%0A%2F%2F%20%3D%3E%20%5B%201%2C%202%2C%203%2C%2030%2C%20300%2C%204%20%5D">Try this <strong>R.flatten</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
flatten<T>(list: any[]): T[];
```

</details>

<details>

<summary><strong>R.flatten</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'

export function flatten(list, input){
  const willReturn = input === undefined ? [] : input

  for (let i = 0; i < list.length; i++){
    if (isArray(list[ i ])){
      flatten(list[ i ], willReturn)
    } else {
      willReturn.push(list[ i ])
    }
  }

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { flatten } from './flatten.js'

test('happy', () => {
  expect(flatten([ 1, 2, 3, [ [ [ [ [ 4 ] ] ] ] ] ])).toEqual([ 1, 2, 3, 4 ])

  expect(flatten([ 1, [ 2, [ [ 3 ] ] ], [ 4 ] ])).toEqual([ 1, 2, 3, 4 ])

  expect(flatten([ 1, [ 2, [ [ [ 3 ] ] ] ], [ 4 ] ])).toEqual([ 1, 2, 3, 4 ])

  expect(flatten([ 1, 2, [ 3, 4 ], 5, [ 6, [ 7, 8, [ 9, [ 10, 11 ], 12 ] ] ] ])).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ])
})

test('readme example', () => {
  const result = flatten([ 1, 2, [ 3, 30, [ 300 ] ], [ 4 ] ])
  expect(result).toEqual([ 1, 2, 3, 30, 300, 4 ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {flatten} from 'rambda'

describe('flatten', () => {
  it('happy', () => {
    const result = flatten<number>([1, 2, [3, [4]]])
    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#flatten)

### flip

It returns function which calls `fn` with exchanged first and second argument.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20subtractFlip%20%3D%20R.flip(R.subtract)%0A%0Aconst%20result%20%3D%20%5B%0A%20%20subtractFlip(1%2C7)%2C%0A%20%20R.subtract(1%2C%206)%0A%5D%20%20%0A%2F%2F%20%3D%3E%20%5B6%2C%20-6%5D">Try this <strong>R.flip</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#flip)

### forEach

```typescript

forEach<T>(fn: Iterator<T, void>, list: T[]): T[]
```

It applies `iterable` function over all members of `list` and returns `list`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20sideEffect%20%3D%20%7B%7D%0Aconst%20result%20%3D%20R.forEach(%0A%20%20x%20%3D%3E%20sideEffect%5B%60foo%24%7Bx%7D%60%5D%20%3D%20x%0A)(%5B1%2C%202%5D)%0A%0AsideEffect%20%2F%2F%20%3D%3E%20%7Bfoo1%3A%201%2C%20foo2%3A%202%7D%0Aresult%20%2F%2F%20%3D%3E%20%5B1%2C%202%5D">Try this <strong>R.forEach</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
forEach<T>(fn: Iterator<T, void>, list: T[]): T[];
forEach<T>(fn: Iterator<T, void>): (list: T[]) => T[];
forEach<T>(fn: ObjectIterator<T, void>, list: Dictionary<T>): Dictionary<T>;
forEach<T, U>(fn: ObjectIterator<T, void>): (list: Dictionary<T>) => Dictionary<T>;
```

</details>

<details>

<summary><strong>R.forEach</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'
import { forEachObjIndexedFn } from './forEachObjIndexed.js'

export function forEach(fn, iterable){
  if (arguments.length === 1) return _list => forEach(fn, _list)
  if (iterable === undefined) return

  if (isArray(iterable)){
    let index = 0
    const len = iterable.length

    while (index < len){
      fn(iterable[ index ])
      index++
    }
  } else return forEachObjIndexedFn(fn, iterable)

  return iterable
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { forEach } from './forEach.js'
import { type } from './type.js'

test('happy', () => {
  const sideEffect = {}
  forEach(x => sideEffect[ `foo${ x }` ] = x + 10)([ 1, 2 ])

  expect(sideEffect).toEqual({
    foo1 : 11,
    foo2 : 12,
  })
})

test('iterate over object', () => {
  const obj = {
    a : 1,
    b : [ 1, 2 ],
    c : { d : 7 },
    f : 'foo',
  }
  const result = {}
  const returned = forEach((
    val, prop, inputObj
  ) => {
    expect(type(inputObj)).toBe('Object')
    result[ prop ] = `${ prop }-${ type(val) }`
  })(obj)

  const expected = {
    a : 'a-Number',
    b : 'b-Array',
    c : 'c-Object',
    f : 'f-String',
  }

  expect(result).toEqual(expected)
  expect(returned).toEqual(obj)
})

test('with empty list', () => {
  const list = []
  const result = forEach(x => x * x)(list)

  expect(result).toEqual(list)
})

test('with wrong input', () => {
  const list = undefined
  const result = forEach(x => x * x)(list)

  expect(result).toBeUndefined()
})

test('returns the input', () => {
  const list = [ 1, 2, 3 ]
  const result = forEach(x => x * x)(list)

  expect(result).toEqual(list)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {forEach} from 'rambda'

const list = [1, 2, 3]
const obj = {a: 1, b: 2}

describe('R.forEach with arrays', () => {
  it('happy', () => {
    const result = forEach(a => {
      a // $ExpectType number
    }, list)
    result // $ExpectType number[]
  })
  it('curried require an explicit typing', () => {
    const result = forEach<number>(a => {
      a // $ExpectType number
    })(list)
    result // $ExpectType number[]
  })
})

describe('R.forEach with objects', () => {
  it('happy', () => {
    const result = forEach((a, b, c) => {
      a // $ExpectType number
      b // $ExpectType string
      c // $ExpectType Dictionary<number>
      return `${a}`
    }, obj)
    result // $ExpectType Dictionary<number>
  })
  it('curried require an input typing and a dummy third typing', () => {
    // Required in order all typings to work
    const result = forEach<number, any>((a, b, c) => {
      a // $ExpectType number
      b // $ExpectType string
      c // $ExpectType Dictionary<number>
    })(obj)
    result // $ExpectType Dictionary<number>
  })
  it('iterator without property', () => {
    const result = forEach(a => {
      a // $ExpectType number
    }, obj)
    result // $ExpectType Dictionary<number>
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#forEach)

### forEachObjIndexed

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#forEachObjIndexed)

### fromPairs

It transforms a `listOfPairs` to an object.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20listOfPairs%20%3D%20%5B%20%5B%20'a'%2C%201%20%5D%2C%20%5B%20'b'%2C%202%20%5D%2C%20%5B%20'c'%2C%20%5B%203%2C%204%20%5D%20%5D%20%5D%0Aconst%20expected%20%3D%20%7B%0A%20%20a%20%3A%201%2C%0A%20%20b%20%3A%202%2C%0A%20%20c%20%3A%20%5B%203%2C%204%20%5D%2C%0A%7D%0A%0Aconst%20result%20%3D%20R.fromPairs(listOfPairs)%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.fromPairs</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#fromPairs)

### groupBy

It splits `list` according to a provided `groupFn` function and returns an object.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%20'a'%2C%20'b'%2C%20'aa'%2C%20'bb'%20%5D%0Aconst%20groupFn%20%3D%20x%20%3D%3E%20x.length%0A%0Aconst%20result%20%3D%20R.groupBy(groupFn%2C%20list)%0A%2F%2F%20%3D%3E%20%7B%20'1'%3A%20%5B'a'%2C%20'b'%5D%2C%20'2'%3A%20%5B'aa'%2C%20'bb'%5D%20%7D">Try this <strong>R.groupBy</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#groupBy)

### groupWith

It returns separated version of list or string `input`, where separation is done with equality `compareFn` function.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20isConsecutive%20%3D%20(x%2C%20y)%20%3D%3E%20x%20%3D%3D%3D%20y%0Aconst%20list%20%3D%20%5B1%2C%202%2C%202%2C%201%2C%201%2C%202%5D%0A%0Aconst%20result%20%3D%20R.groupWith(isConsecutive%2C%20list)%0A%2F%2F%20%3D%3E%20%5B%5B1%5D%2C%20%5B2%2C2%5D%2C%20%5B1%2C1%5D%2C%20%5B2%5D%5D">Try this <strong>R.groupWith</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#groupWith)

### gt

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5BR.gt(2%2C%201)%2C%20R.gt(2%2C%203)%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20false%5D">Try this <strong>R.gt</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#gt)

### gte

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5BR.gte(2%2C%201)%2C%20R.gte(2%2C%202)%2C%20R.gte(2%2C%203)%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20true%2C%20false%5D">Try this <strong>R.gte</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#gte)

### has

```typescript

has<T>(prop: string, obj: T): boolean
```

It returns `true` if `obj` has property `prop`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7Ba%3A%201%7D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.has('a'%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.has('b'%2C%20Record%3Cstring%2C%20unknown%3E)%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20false%5D">Try this <strong>R.has</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
has<T>(prop: string, obj: T): boolean;
has(prop: string): <T>(obj: T) => boolean;
```

</details>

<details>

<summary><strong>R.has</strong> source</summary>

```javascript
export function has(prop, obj){
  if (arguments.length === 1) return _obj => has(prop, _obj)

  if (!obj) return false

  return obj.hasOwnProperty(prop)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { has } from './has.js'

test('happy', () => {
  expect(has('a')({ a : 1 })).toBeTrue()
  expect(has('b', { a : 1 })).toBeFalse()
})

test('with non-object', () => {
  expect(has('a', undefined)).toBeFalse()
  expect(has('a', null)).toBeFalse()
  expect(has('a', true)).toBeFalse()
  expect(has('a', '')).toBeFalse()
  expect(has('a', /a/)).toBeFalse()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {has} from 'rambda'

describe('R.has', () => {
  it('happy', () => {
    const result = has('foo', {a: 1})
    const curriedResult = has('bar')({a: 1})
    result // $ExpectType boolean
    curriedResult // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#has)

### hasIn

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.hasIn('a'%2C%20%7Ba%3A%201%7D)%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.hasIn</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#hasIn)

### hasPath

```typescript

hasPath<T>(
  path: string | string[],
  input: object
): boolean
```

It will return true, if `input` object has truthy `path`(calculated with `R.path`).

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20path%20%3D%20'a.b'%0Aconst%20pathAsArray%20%3D%20%5B'a'%2C%20'b'%5D%0Aconst%20obj%20%3D%20%7Ba%3A%20%7Bb%3A%20%5B%5D%7D%7D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.hasPath(path%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.hasPath(pathAsArray%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.hasPath('a.c'%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20true%2C%20false%5D">Try this <strong>R.hasPath</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
hasPath<T>(
  path: string | string[],
  input: object
): boolean;
hasPath<T>(
  path: string | string[]
): (input: object) => boolean;
```

</details>

<details>

<summary><strong>R.hasPath</strong> source</summary>

```javascript
import { path } from './path.js'

export function hasPath(pathInput, obj){
  if (arguments.length === 1){
    return objHolder => hasPath(pathInput, objHolder)
  }

  return path(pathInput, obj) !== undefined
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { hasPath } from './hasPath.js'

test('when true', () => {
  const path = 'a.b'
  const obj = { a : { b : [] } }

  const result = hasPath(path)(obj)
  const expectedResult = true

  expect(result).toEqual(expectedResult)
})

test('when false', () => {
  const path = 'a.b'
  const obj = {}

  const result = hasPath(path, obj)
  const expectedResult = false

  expect(result).toEqual(expectedResult)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {hasPath} from 'rambda'

describe('R.hasPath', () => {
  it('string path', () => {
    const obj = {a: {b: 1}}
    const result = hasPath('a.b', obj)
    const curriedResult = hasPath('a.c')(obj)
    result // $ExpectType boolean
    curriedResult // $ExpectType boolean
  })
  it('array path', () => {
    const obj = {a: {b: 1}}
    const result = hasPath(['a', 'b'], obj)
    const curriedResult = hasPath(['a', 'c'])(obj)
    result // $ExpectType boolean
    curriedResult // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#hasPath)

### head

```typescript

head(str: string): string
```

It returns the first element of list or string `input`. It returns `undefined` if array has length of 0.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.head(%5B1%2C%202%2C%203%5D)%2C%0A%20%20R.head('foo')%20%0A%5D%0A%2F%2F%20%3D%3E%20%5B1%2C%20'f'%5D">Try this <strong>R.head</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
head(str: string): string;
head(str: ''): undefined;
head(list: readonly[]): undefined;
head<T>(list: never[]): undefined;
head<T extends unknown[]>(array: T): FirstArrayElement<T>
head<T extends readonly unknown[]>(array: T): FirstArrayElement<T>
```

</details>

<details>

<summary><strong>R.head</strong> source</summary>

```javascript
export function head(listOrString){
  if (typeof listOrString === 'string') return listOrString[ 0 ] || ''

  return listOrString[ 0 ]
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { head } from './head.js'

test('head', () => {
  expect(head([ 'fi', 'fo', 'fum' ])).toBe('fi')
  expect(head([])).toBeUndefined()
  expect(head('foo')).toBe('f')
  expect(head('')).toBe('')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {
  emptyList,
  emptyString,
  mixedList,
  mixedListConst,
  numberList,
  numberListConst,
  string,
} from '_internals/typescriptTestUtils'
import {head, last} from 'rambda'

describe('R.head', () => {
  it('string', () => {
    head(string) // $ExpectType string
    last(string) // $ExpectType string
  })
  it('empty string', () => {
    head(emptyString) // $ExpectType undefined
    last(emptyString) // $ExpectType undefined
  })
  it('array', () => {
    head(numberList) // $ExpectType number
    head(numberListConst) // $ExpectType 1

    last(numberList) // $ExpectType number
    last(numberListConst) // $ExpectType 3
  })
  it('empty array', () => {
    const list = [] as const
    head(emptyList) // $ExpectType undefined
    head(list) // $ExpectType undefined
    last(emptyList) // $ExpectType undefined
    last(list) // $ExpectType undefined
  })

  it('mixed', () => {
    head(mixedList) // $ExpectType string | number
    head(mixedListConst) // $ExpectType 1
    last(mixedList) // $ExpectType string | number
    last(mixedListConst) // $ExpectType "bar"
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#head)

### identical

It returns `true` if its arguments `a` and `b` are identical.

Otherwise, it returns `false`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20objA%20%3D%20%7Ba%3A%201%7D%3B%0Aconst%20objB%20%3D%20%7Ba%3A%201%7D%3B%0AR.identical(objA%2C%20objA)%3B%20%2F%2F%20%3D%3E%20true%0AR.identical(objA%2C%20objB)%3B%20%2F%2F%20%3D%3E%20false%0AR.identical(1%2C%201)%3B%20%2F%2F%20%3D%3E%20true%0AR.identical(1%2C%20'1')%3B%20%2F%2F%20%3D%3E%20false%0AR.identical(%5B%5D%2C%20%5B%5D)%3B%20%2F%2F%20%3D%3E%20false%0AR.identical(0%2C%20-0)%3B%20%2F%2F%20%3D%3E%20false%0Aconst%20result%20%3D%20R.identical(NaN%2C%20NaN)%3B%20%2F%2F%20%3D%3E%20true">Try this <strong>R.identical</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#identical)

### identity

```typescript

identity<T>(input: T): T
```

It just passes back the supplied `input` argument.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.identity(7)%20%2F%2F%20%3D%3E%207">Try this <strong>R.identity</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
identity<T>(input: T): T;
```

</details>

<details>

<summary><strong>R.identity</strong> source</summary>

```javascript
export function identity(x){
  return x
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { identity } from './identity.js'

test('happy', () => {
  expect(identity(7)).toBe(7)
  expect(identity(true)).toBeTrue()
  expect(identity({ a : 1 })).toEqual({ a : 1 })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {identity} from 'rambda'

describe('R.identity', () => {
  it('happy', () => {
    const result = identity(4)
    result // $ExpectType 4
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#identity)

### ifElse

```typescript

ifElse<T, TFiltered extends T, TOnTrueResult, TOnFalseResult>(
  pred: (a: T) => a is TFiltered,
  onTrue: (a: TFiltered) => TOnTrueResult,
  onFalse: (a: Exclude<T, TFiltered>) => TOnFalseResult,
): (a: T) => TOnTrueResult | TOnFalseResult
```

It expects `condition`, `onTrue` and `onFalse` functions as inputs and it returns a new function with example name of `fn`. 

When `fn`` is called with `input` argument, it will return either `onTrue(input)` or `onFalse(input)` depending on `condition(input)` evaluation.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20R.ifElse(%0A%20x%20%3D%3E%20x%3E10%2C%0A%20x%20%3D%3E%20x*2%2C%0A%20x%20%3D%3E%20x*10%0A)%0A%0Aconst%20result%20%3D%20%5B%20fn(8)%2C%20fn(18)%20%5D%0A%2F%2F%20%3D%3E%20%5B80%2C%2036%5D">Try this <strong>R.ifElse</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
ifElse<T, TFiltered extends T, TOnTrueResult, TOnFalseResult>(
  pred: (a: T) => a is TFiltered,
  onTrue: (a: TFiltered) => TOnTrueResult,
  onFalse: (a: Exclude<T, TFiltered>) => TOnFalseResult,
): (a: T) => TOnTrueResult | TOnFalseResult;
ifElse<TArgs extends any[], TOnTrueResult, TOnFalseResult>(fn: (...args: TArgs) => boolean, onTrue: (...args: TArgs) => TOnTrueResult, onFalse: (...args: TArgs) => TOnFalseResult): (...args: TArgs) => TOnTrueResult | TOnFalseResult;
```

</details>

<details>

<summary><strong>R.ifElse</strong> source</summary>

```javascript
import { curry } from './curry.js'

function ifElseFn(
  condition, onTrue, onFalse
){
  return (...input) => {
		const conditionResult =
      typeof condition === 'boolean' ? condition : condition(...input)
    if (Boolean(conditionResult) ){
      return onTrue(...input)
    }

    return onFalse(...input)
  }
}

export const ifElse = curry(ifElseFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { always } from './always.js'
import { has } from './has.js'
import { identity } from './identity.js'
import { ifElse } from './ifElse.js'
import { prop } from './prop.js'
import * as R from 'ramda'

const condition = has('foo')
const v = function (a){
  return typeof a === 'number'
}
const t = function (a){
  return a + 1
}
const ifFn = x => prop('foo', x).length
const elseFn = () => false

test('happy', () => {
  const fn = ifElse(condition, ifFn)(elseFn)

  expect(fn({ foo : 'bar' })).toBe(3)
  expect(fn({ fo : 'bar' })).toBeFalse()
})

test('ramda spec', () => {
  const ifIsNumber = ifElse(v)
  expect(ifIsNumber(t, identity)(15)).toBe(16)
  expect(ifIsNumber(t, identity)('hello')).toBe('hello')
})

test('pass all arguments', () => {
  const identity = function (a){
    return a
  }
  const v = function (){
    return true
  }
  const onTrue = function (a, b){
    expect(a).toBe(123)
    expect(b).toBe('abc')
  }
  ifElse(
    v, onTrue, identity
  )(123, 'abc')
})

test('accept constant as condition', () => {
  const fn = ifElse(true)(always(true))(always(false))

  expect(fn()).toBeTrue()
})

test('accept constant as condition - case 2', () => {
  const fn = ifElse(
    false, always(true), always(false)
  )

  expect(fn()).toBeFalse()
})

test('curry 1', () => {
  const fn = ifElse(condition, ifFn)(elseFn)

  expect(fn({ foo : 'bar' })).toBe(3)
  expect(fn({ fo : 'bar' })).toBeFalse()
})

test('curry 2', () => {
  const fn = ifElse(condition)(ifFn)(elseFn)

  expect(fn({ foo : 'bar' })).toBe(3)
  expect(fn({ fo : 'bar' })).toBeFalse()
})

test('simple arity of 1', () => {
  const condition = x => x > 5
  const onTrue = x => x + 1
  const onFalse = x => x + 10
  const result = ifElse(
    condition, onTrue, onFalse
  )(1)
  expect(result).toBe(11)
})

test('simple arity of 2', () => {
  const condition = (x, y) => x + y > 5
  const onTrue = (x, y) => x + y + 1
  const onFalse = (x, y) => x + y + 10
  const result = ifElse(
    condition, onTrue, onFalse
  )(1, 10)
  expect(result).toBe(12)
})

test('bug 750', () => {
	const value = 34;

	let result = ifElse(
	R.identity,
	R.always('true'),
	R.always('false')
	)(value)
	expect(result).toBe('true')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {ifElse} from 'rambda'

describe('R.ifElse', () => {
  it('happy', () => {
    const condition = (x: number) => x > 5
    const onTrue = (x: number) => `foo${x}`
    const onFalse = (x: number) => `bar${x}`
    const fn = ifElse(condition, onTrue, onFalse)
    fn // $ExpectType (x: number) => string
    const result = fn(3)
    result // $ExpectType string
  })
  it('arity of 2', () => {
    const condition = (x: number, y: string) => x + y.length > 5
    const onTrue = (x: number, y: string) => `foo${x}-${y}`
    const onFalse = (x: number, y: string) => `bar${x}-${y}`
    const fn = ifElse(condition, onTrue, onFalse)
    fn // $ExpectType (x: number, y: string) => string
    const result = fn(3, 'hello')
    result // $ExpectType string
  })
  test('DefinitelyTyped#59291', () => {
    const getLengthIfStringElseDouble = ifElse(
      (a: string | number): a is string => true,
      a => a.length,
      a => a * 2
    )

    getLengthIfStringElseDouble('foo') // $ExpectType number
    getLengthIfStringElseDouble(3) // $ExpectType number
    const result = ifElse(
      (a: {
        foo?: string,
        bar: number | string,
      }): a is {foo: string, bar: string} => true,
      (a): [string, string] => [a.foo, a.bar],
      (a): [string | undefined, string | number] => [a.foo, a.bar]
    )
    result // $ExpectType (a: { foo?: string | undefined; bar: string | number; }) => [string, string] | [string | undefined, string | number]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#ifElse)

### inc

It increments a number.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.inc(1)%20%2F%2F%20%3D%3E%202">Try this <strong>R.inc</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#inc)

### includes

```typescript

includes<T extends string>(valueToFind: T, input: string): boolean
```

If `input` is string, then this method work as native `String.includes`.

If `input` is array, then `R.equals` is used to define if `valueToFind` belongs to the list.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.includes('oo'%2C%20'foo')%2C%0A%20%20R.includes(%7Ba%3A%201%7D%2C%20%5B%7Ba%3A%201%7D%5D)%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20true%20%5D">Try this <strong>R.includes</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
includes<T extends string>(valueToFind: T, input: string): boolean;
includes<T extends string>(valueToFind: T): (input: string) => boolean;
includes<T>(valueToFind: T, input: T[]): boolean;
includes<T>(valueToFind: T): (input: T[]) => boolean;
```

</details>

<details>

<summary><strong>R.includes</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'
import { _indexOf } from './equals.js'

export function includes(valueToFind, iterable){
  if (arguments.length === 1)
    return _iterable => includes(valueToFind, _iterable)
  if (typeof iterable === 'string'){
    return iterable.includes(valueToFind)
  }
  if (!iterable){
    throw new TypeError(`Cannot read property \'indexOf\' of ${ iterable }`)
  }
  if (!isArray(iterable)) return false

  return _indexOf(valueToFind, iterable) > -1
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { includes as includesRamda } from 'ramda'

import { includes } from './includes.js'

test('with string as iterable', () => {
  const str = 'foo bar'

  expect(includes('bar')(str)).toBeTrue()
  expect(includesRamda('bar')(str)).toBeTrue()
  expect(includes('never', str)).toBeFalse()
  expect(includesRamda('never', str)).toBeFalse()
})

test('with array as iterable', () => {
  const arr = [ 1, 2, 3 ]

  expect(includes(2)(arr)).toBeTrue()
  expect(includesRamda(2)(arr)).toBeTrue()

  expect(includes(4, arr)).toBeFalse()
  expect(includesRamda(4, arr)).toBeFalse()
})

test('with list of objects as iterable', () => {
  const arr = [ { a : 1 }, { b : 2 }, { c : 3 } ]

  expect(includes({ c : 3 }, arr)).toBeTrue()
  expect(includesRamda({ c : 3 }, arr)).toBeTrue()
})

test('with NaN', () => {
  const result = includes(NaN, [ NaN ])
  const ramdaResult = includesRamda(NaN, [ NaN ])
  expect(result).toBeTrue()
  expect(ramdaResult).toBeTrue()
})

test('with wrong input that does not throw', () => {
  const result = includes(1, /foo/g)
  const ramdaResult = includesRamda(1, /foo/g)
  expect(result).toBeFalse()
  expect(ramdaResult).toBeFalse()
})

test('throws on wrong input - match ramda behaviour', () => {
  expect(() => includes(2, null)).toThrowWithMessage(TypeError,
    'Cannot read property \'indexOf\' of null')
  expect(() => includesRamda(2, null)).toThrowWithMessage(TypeError,
    'Cannot read properties of null (reading \'indexOf\')')
  expect(() => includes(2, undefined)).toThrowWithMessage(TypeError,
    'Cannot read property \'indexOf\' of undefined')
  expect(() => includesRamda(2, undefined)).toThrowWithMessage(TypeError,
    'Cannot read properties of undefined (reading \'indexOf\')')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {includes} from 'rambda'

const list = [{a: {b: '1'}}, {a: {c: '2'}}, {a: {b: '3'}}]

describe('R.includes', () => {
  it('happy', () => {
    const result = includes({a: {b: '1'}}, list)
    result // $ExpectType boolean
    const result2 = includes('oo', ['f', 'oo'])
    result2 // $ExpectType boolean
  })
  it('with string', () => {
    const str = 'foo' as 'foo' | 'bar'
    const result = includes('oo', str)
    const curriedResult = includes('oo')(str)

    result // $ExpectType boolean
    curriedResult // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#includes)

### indexBy

It generates object with properties provided by `condition` and values provided by `list` array.

If `condition` is a function, then all list members are passed through it.

If `condition` is a string, then all list members are passed through `R.path(condition)`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%20%7Bid%3A%2010%7D%2C%20%7Bid%3A%2020%7D%20%5D%0A%0Aconst%20withFunction%20%3D%20R.indexBy(%0A%20%20x%20%3D%3E%20x.id%2C%0A%20%20list%0A)%0Aconst%20withString%20%3D%20R.indexBy(%0A%20%20'id'%2C%0A%20%20list%0A)%0Aconst%20result%20%3D%20%5B%0A%20%20withFunction%2C%20%0A%20%20R.equals(withFunction%2C%20withString)%0A%5D%0A%2F%2F%20%3D%3E%20%5B%20%7B%2010%3A%20%7Bid%3A%2010%7D%2C%2020%3A%20%7Bid%3A%2020%7D%20%7D%2C%20true%20%5D">Try this <strong>R.indexBy</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#indexBy)

### indexOf

It returns the index of the first element of `list` equals to `valueToFind`.

If there is no such element, it returns `-1`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B0%2C%201%2C%202%2C%203%5D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.indexOf(2%2C%20list)%2C%0A%20%20R.indexOf(0%2C%20list)%0A%5D%0A%2F%2F%20%3D%3E%20%5B2%2C%20-1%5D">Try this <strong>R.indexOf</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#indexOf)

### init

```typescript

init<T extends unknown[]>(input: T): T extends readonly [...infer U, any] ? U : [...T]
```

It returns all but the last element of list or string `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.init(%5B1%2C%202%2C%203%5D)%20%2C%20%0A%20%20R.init('foo')%20%20%2F%2F%20%3D%3E%20'fo'%0A%5D%0A%2F%2F%20%3D%3E%20%5B%5B1%2C%202%5D%2C%20'fo'%5D">Try this <strong>R.init</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
init<T extends unknown[]>(input: T): T extends readonly [...infer U, any] ? U : [...T];
init(input: string): string;
```

</details>

<details>

<summary><strong>R.init</strong> source</summary>

```javascript
import baseSlice from './_internals/baseSlice.js'

export function init(listOrString){
  if (typeof listOrString === 'string') return listOrString.slice(0, -1)

  return listOrString.length ?
    baseSlice(
      listOrString, 0, -1
    ) :
    []
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { init } from './init.js'

test('with array', () => {
  expect(init([ 1, 2, 3 ])).toEqual([ 1, 2 ])
  expect(init([ 1, 2 ])).toEqual([ 1 ])
  expect(init([ 1 ])).toEqual([])
  expect(init([])).toEqual([])
  expect(init([])).toEqual([])
  expect(init([ 1 ])).toEqual([])
})

test('with string', () => {
  expect(init('foo')).toBe('fo')
  expect(init('f')).toBe('')
  expect(init('')).toBe('')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {init} from 'rambda'

describe('R.init', () => {
  it('with string', () => {
    const result = init('foo')

    result // $ExpectType string
  })
  it('with list - one type', () => {
    const result = init([1, 2, 3])

    result // $ExpectType number[]
  })
  it('with list - mixed types', () => {
    const result = init([1, 2, 3, 'foo', 'bar'])

    result // $ExpectType (string | number)[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#init)

### innerJoin

It returns a new list by applying a `predicate` function to all elements of `list1` and `list2` and keeping only these elements where `predicate` returns `true`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list1%20%3D%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%0Aconst%20list2%20%3D%20%5B4%2C%205%2C%206%5D%0Aconst%20predicate%20%3D%20(x%2C%20y)%20%3D%3E%20x%20%3E%3D%20y%0Aconst%20result%20%3D%20R.innerJoin(predicate%2C%20list1%2C%20list2)%0A%2F%2F%20%3D%3E%20%5B4%2C%205%5D">Try this <strong>R.innerJoin</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#innerJoin)

### insert

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B'a'%2C%20'b'%2C%20'c'%2C%20'd'%2C%20'e'%5D%3B%0Aconst%20result%20%3D%20R.insert(2%2C%20'x'%2C%20list)%3B%0A%2F%2F%20%3D%3E%20%5B'a'%2C%20'b'%2C%20'x'%2C%20'c'%2C%20'd'%2C%20'e'%5D">Try this <strong>R.insert</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#insert)

### insertAll

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B'a'%2C%20'b'%2C%20'c'%2C%20'd'%2C%20'e'%5D%3B%0Aconst%20result%20%3D%20R.insertAll(2%2C%20%5B'x'%2C%20'y'%2C%20'z'%5D%2C%20list)%3B%0A%2F%2F%20%3D%3E%20%5B'a'%2C%20'b'%2C%20'x'%2C%20'y'%2C%20'z'%2C%20'c'%2C%20'd'%2C%20'e'%5D">Try this <strong>R.insertAll</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#insertAll)

### intersection

It loops through `listA` and `listB` and returns the intersection of the two according to `R.equals`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20listA%20%3D%20%5B%20%7B%20id%20%3A%201%20%7D%2C%20%7B%20id%20%3A%202%20%7D%2C%20%7B%20id%20%3A%203%20%7D%2C%20%7B%20id%20%3A%204%20%7D%20%5D%0Aconst%20listB%20%3D%20%5B%20%7B%20id%20%3A%203%20%7D%2C%20%7B%20id%20%3A%204%20%7D%2C%20%7B%20id%20%3A%205%20%7D%2C%20%7B%20id%20%3A%206%20%7D%20%5D%0A%0Aconst%20result%20%3D%20R.intersection(listA%2C%20listB)%0A%2F%2F%20%3D%3E%20%5B%7B%20id%20%3A%203%20%7D%2C%20%7B%20id%20%3A%204%20%7D%5D">Try this <strong>R.intersection</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#intersection)

### intersperse

It adds a `separator` between members of `list`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%200%2C%201%2C%202%2C%203%20%5D%0Aconst%20separator%20%3D%20'%7C'%0Aconst%20result%20%3D%20intersperse(separator%2C%20list)%0A%2F%2F%20%3D%3E%20%5B0%2C%20'%7C'%2C%201%2C%20'%7C'%2C%202%2C%20'%7C'%2C%203%5D">Try this <strong>R.intersperse</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#intersperse)

### is

It returns `true` if `x` is instance of `targetPrototype`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.is(String%2C%20'foo')%2C%20%20%0A%20%20R.is(Array%2C%201)%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20false%5D">Try this <strong>R.is</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#is)

### isEmpty

```typescript

isEmpty<T>(x: T): boolean
```

It returns `true` if `x` is `empty`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.isEmpty('')%2C%0A%20%20R.isEmpty(%7B%20x%20%3A%200%20%7D)%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20false%5D">Try this <strong>R.isEmpty</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
isEmpty<T>(x: T): boolean;
```

</details>

<details>

<summary><strong>R.isEmpty</strong> source</summary>

```javascript
import { type } from './type.js'

export function isEmpty(input){
  const inputType = type(input)
  if ([ 'Undefined', 'NaN', 'Number', 'Null' ].includes(inputType))
    return false
  if (!input) return true

  if (inputType === 'Object'){
    return Object.keys(input).length === 0
  }

  if (inputType === 'Array'){
    return input.length === 0
  }

  return false
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { isEmpty } from './isEmpty.js'

test('happy', () => {
  expect(isEmpty(undefined)).toBeFalse()
  expect(isEmpty('')).toBeTrue()
  expect(isEmpty(null)).toBeFalse()
  expect(isEmpty(' ')).toBeFalse()
  expect(isEmpty(new RegExp(''))).toBeFalse()
  expect(isEmpty([])).toBeTrue()
  expect(isEmpty([ [] ])).toBeFalse()
  expect(isEmpty({})).toBeTrue()
  expect(isEmpty({ x : 0 })).toBeFalse()
  expect(isEmpty(0)).toBeFalse()
  expect(isEmpty(NaN)).toBeFalse()
  expect(isEmpty([ '' ])).toBeFalse()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {isEmpty} from 'rambda'

describe('R.isEmpty', () => {
  it('happy', () => {
    const result = isEmpty('foo')
    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#isEmpty)

### isNil

```typescript

isNil(x: any): x is null | undefined
```

It returns `true` if `x` is either `null` or `undefined`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.isNil(null)%2C%0A%20%20R.isNil(1)%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20false%5D">Try this <strong>R.isNil</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
isNil(x: any): x is null | undefined;
```

</details>

<details>

<summary><strong>R.isNil</strong> source</summary>

```javascript
export function isNil(x){
  return x === undefined || x === null
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { isNil } from './isNil.js'

test('happy', () => {
  expect(isNil(null)).toBeTrue()

  expect(isNil(undefined)).toBeTrue()

  expect(isNil([])).toBeFalse()
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#isNil)

### isNotEmpty

```typescript

isNotEmpty<T>(value: T[]): value is NonEmptyArray<T>
```

<details>

<summary>All TypeScript definitions</summary>

```typescript
isNotEmpty<T>(value: T[]): value is NonEmptyArray<T>;
isNotEmpty<T>(value: readonly T[]): value is ReadonlyNonEmptyArray<T>;
isNotEmpty(value: any): boolean;
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#isNotEmpty)

### isNotNil

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.isNotNil(null)%2C%0A%20%20R.isNotNil(undefined)%2C%0A%20%20R.isNotNil(%5B%5D)%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5Bfalse%2C%20false%2C%20true%5D">Try this <strong>R.isNotNil</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#isNotNil)

### join

```typescript

join<T>(glue: string, list: T[]): string
```

It returns a string of all `list` instances joined with a `glue`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.join('-'%2C%20%5B1%2C%202%2C%203%5D)%20%20%2F%2F%20%3D%3E%20'1-2-3'">Try this <strong>R.join</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
join<T>(glue: string, list: T[]): string;
join<T>(glue: string): (list: T[]) => string;
```

</details>

<details>

<summary><strong>R.join</strong> source</summary>

```javascript
export function join(glue, list){
  if (arguments.length === 1) return _list => join(glue, _list)

  return list.join(glue)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { join } from './join.js'

test('curry', () => {
  expect(join('|')([ 'foo', 'bar', 'baz' ])).toBe('foo|bar|baz')

  expect(join('|', [ 1, 2, 3 ])).toBe('1|2|3')

  const spacer = join(' ')

  expect(spacer([ 'a', 2, 3.4 ])).toBe('a 2 3.4')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {join} from 'rambda'

describe('R.join', () => {
  it('happy', () => {
    const result = join('|', [1, 2, 3])
    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#join)

### juxt

```typescript

juxt<A extends any[], R1>(fns: [(...a: A) => R1]): (...a: A) => [R1]
```

It applies list of function to a list of inputs.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20getRange%20%3D%20juxt(%5B%20Math.min%2C%20Math.max%2C%20Math.min%20%5D)%0Aconst%20result%20%3D%20getRange(%0A%20%203%2C%204%2C%209%2C%20-3%0A)%0A%2F%2F%20%3D%3E%20%5B-3%2C%209%2C%20-3%5D">Try this <strong>R.juxt</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
juxt<A extends any[], R1>(fns: [(...a: A) => R1]): (...a: A) => [R1];
juxt<A extends any[], R1, R2>(fns: [(...a: A) => R1, (...a: A) => R2]): (...a: A) => [R1, R2];
juxt<A extends any[], R1, R2, R3>(fns: [(...a: A) => R1, (...a: A) => R2, (...a: A) => R3]): (...a: A) => [R1, R2, R3];
juxt<A extends any[], R1, R2, R3, R4>(fns: [(...a: A) => R1, (...a: A) => R2, (...a: A) => R3, (...a: A) => R4]): (...a: A) => [R1, R2, R3, R4];
juxt<A extends any[], R1, R2, R3, R4, R5>(fns: [(...a: A) => R1, (...a: A) => R2, (...a: A) => R3, (...a: A) => R4, (...a: A) => R5]): (...a: A) => [R1, R2, R3, R4, R5];
juxt<A extends any[], U>(fns: Array<(...args: A) => U>): (...args: A) => U[];
```

</details>

<details>

<summary><strong>R.juxt</strong> source</summary>

```javascript
export function juxt(listOfFunctions){
  return (...args) => listOfFunctions.map(fn => fn(...args))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { juxt } from './juxt.js'

test('happy', () => {
  const fn = juxt([ Math.min, Math.max, Math.min ])
  const result = fn(
    3, 4, 9, -3
  )
  expect(result).toEqual([ -3, 9, -3 ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {juxt} from 'rambda'

describe('R.juxt', () => {
  it('happy', () => {
    const fn = juxt([Math.min, Math.max])
    const result = fn(3, 4, 9, -3)
    result // $ExpectType [number, number]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#juxt)

### keys

```typescript

keys<T extends object>(x: T): (keyof T & string)[]
```

It applies `Object.keys` over `x` and returns its keys.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.keys(%7Ba%3A1%2C%20b%3A2%7D)%20%20%2F%2F%20%3D%3E%20%5B'a'%2C%20'b'%5D">Try this <strong>R.keys</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
keys<T extends object>(x: T): (keyof T & string)[];
keys<T>(x: T): string[];
```

</details>

<details>

<summary><strong>R.keys</strong> source</summary>

```javascript
export function keys(x){
  return Object.keys(x)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { keys } from './keys.js'

test('happy', () => {
  expect(keys({ a : 1 })).toEqual([ 'a' ])
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#keys)

### last

```typescript

last(str: ''): undefined
```

It returns the last element of `input`, as the `input` can be either a string or an array. It returns `undefined` if array has length of 0.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.last(%5B1%2C%202%2C%203%5D)%2C%0A%20%20R.last('foo')%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5B3%2C%20'o'%5D">Try this <strong>R.last</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
last(str: ''): undefined;
last(str: string): string;
last(list: readonly[]): undefined;
last(list: never[]): undefined;
last<T extends unknown[]>(array: T): LastArrayElement<T>;
last<T extends readonly unknown[]>(array: T): LastArrayElement<T>;
last(str: string): string | undefined;
```

</details>

<details>

<summary><strong>R.last</strong> source</summary>

```javascript
export function last(listOrString){
  if (typeof listOrString === 'string'){
    return listOrString[ listOrString.length - 1 ] || ''
  }

  return listOrString[ listOrString.length - 1 ]
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { last } from './last.js'

test('with list', () => {
  expect(last([ 1, 2, 3 ])).toBe(3)
  expect(last([])).toBeUndefined()
})

test('with string', () => {
  expect(last('abc')).toBe('c')
  expect(last('')).toBe('')
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#last)

### lastIndexOf

```typescript

lastIndexOf<T>(target: T, list: T[]): number
```

It returns the last index of `target` in `list` array.

`R.equals` is used to determine equality between `target` and members of `list`.

If there is no such index, then `-1` is returned.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%2C%201%2C%202%2C%203%5D%0Aconst%20result%20%3D%20%5B%0A%20%20R.lastIndexOf(2%2C%20list)%2C%0A%20%20R.lastIndexOf(4%2C%20list)%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5B4%2C%20-1%5D">Try this <strong>R.lastIndexOf</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
lastIndexOf<T>(target: T, list: T[]): number;
lastIndexOf<T>(target: T): (list: T[]) => number;
```

</details>

<details>

<summary><strong>R.lastIndexOf</strong> source</summary>

```javascript
import { _lastIndexOf } from './equals.js'

export function lastIndexOf(valueToFind, list){
  if (arguments.length === 1){
    return _list => _lastIndexOf(valueToFind, _list)
  }

  return _lastIndexOf(valueToFind, list)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { lastIndexOf as lastIndexOfRamda } from 'ramda'

import { compareCombinations } from './_internals/testUtils.js'
import { possibleIterables, possibleTargets } from './indexOf.spec.js'
import { lastIndexOf } from './lastIndexOf.js'

test('with NaN', () => {
  expect(lastIndexOf(NaN, [ NaN ])).toBe(0)
})

test('will throw with bad input', () => {
  expect(lastIndexOfRamda([], true)).toBe(-1)
  expect(() => indexOf([], true)).toThrowErrorMatchingInlineSnapshot('"indexOf is not defined"')
})

test('without list of objects - no R.equals', () => {
  expect(lastIndexOf(3, [ 1, 2, 3, 4 ])).toBe(2)
  expect(lastIndexOf(10)([ 1, 2, 3, 4 ])).toBe(-1)
})

test('list of objects uses R.equals', () => {
  const listOfObjects = [ { a : 1 }, { b : 2 }, { c : 3 } ]
  expect(lastIndexOf({ c : 4 }, listOfObjects)).toBe(-1)
  expect(lastIndexOf({ c : 3 }, listOfObjects)).toBe(2)
})

test('list of arrays uses R.equals', () => {
  const listOfLists = [ [ 1 ], [ 2, 3 ], [ 2, 3, 4 ], [ 2, 3 ], [ 1 ], [] ]
  expect(lastIndexOf([], listOfLists)).toBe(5)
  expect(lastIndexOf([ 1 ], listOfLists)).toBe(4)
  expect(lastIndexOf([ 2, 3, 4 ], listOfLists)).toBe(2)
  expect(lastIndexOf([ 2, 3, 5 ], listOfLists)).toBe(-1)
})

test('with string as iterable', () => {
  expect(() => lastIndexOf('a', 'abc')).toThrowErrorMatchingInlineSnapshot('"Cannot read property \'indexOf\' of abc"')
  expect(lastIndexOfRamda('a', 'abc')).toBe(0)
})

describe('brute force', () => {
  compareCombinations({
    fn          : lastIndexOf,
    fnRamda     : lastIndexOfRamda,
    firstInput  : possibleTargets,
    secondInput : possibleIterables,
    callback    : errorsCounters => {
      expect(errorsCounters).toMatchInlineSnapshot(`
        {
          "ERRORS_MESSAGE_MISMATCH": 0,
          "ERRORS_TYPE_MISMATCH": 34,
          "RESULTS_MISMATCH": 0,
          "SHOULD_NOT_THROW": 51,
          "SHOULD_THROW": 0,
          "TOTAL_TESTS": 170,
        }
      `)
    },
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {lastIndexOf} from 'rambda'

const list = [1, 2, 3]

describe('R.lastIndexOf', () => {
  it('happy', () => {
    const result = lastIndexOf(2, list)
    result // $ExpectType number
  })
  it('curried', () => {
    const result = lastIndexOf(2)(list)
    result // $ExpectType number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#lastIndexOf)

### length

```typescript

length<T>(input: T[]): number
```

It returns the `length` property of list or string `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.length(%5B1%2C%202%2C%203%2C%204%5D)%2C%0A%20%20R.length('foo')%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5B4%2C%203%5D">Try this <strong>R.length</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
length<T>(input: T[]): number;
```

</details>

<details>

<summary><strong>R.length</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'

export function length(x){
  if (isArray(x)) return x.length
  if (typeof x === 'string') return x.length

  return NaN
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { length as lengthRamda } from 'ramda'

import { length } from './length.js'

test('happy', () => {
  expect(length('foo')).toBe(3)
  expect(length([ 1, 2, 3 ])).toBe(3)
  expect(length([])).toBe(0)
})

test('with empty string', () => {
  expect(length('')).toBe(0)
})

test('with bad input returns NaN', () => {
  expect(length(0)).toBeNaN()
  expect(length({})).toBeNaN()
  expect(length(null)).toBeNaN()
  expect(length(undefined)).toBeNaN()
})

test('with length as property', () => {
  const input1 = { length : '123' }
  const input2 = { length : null }
  const input3 = { length : '' }

  expect(length(input1)).toBeNaN()
  expect(lengthRamda(input1)).toBeNaN()
  expect(length(input2)).toBeNaN()
  expect(lengthRamda(input2)).toBeNaN()
  expect(length(input3)).toBeNaN()
  expect(lengthRamda(input3)).toBeNaN()
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#length)

### lens

```typescript

lens<S, A>(getter: (s: S) => A, setter: (a: A, s: S) => S): Lens<S, A>
```

It returns a `lens` for the given `getter` and `setter` functions. 

The `getter` **gets** the value of the focus; the `setter` **sets** the value of the focus. 

The setter should not mutate the data structure.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20xLens%20%3D%20R.lens(R.prop('x')%2C%20R.assoc('x'))%3B%0A%0AR.view(xLens%2C%20%7Bx%3A%201%2C%20y%3A%202%7D)%20%2F%2F%20%3D%3E%201%0AR.set(xLens%2C%204%2C%20%7Bx%3A%201%2C%20y%3A%202%7D)%20%2F%2F%20%3D%3E%20%7Bx%3A%204%2C%20y%3A%202%7D%0Aconst%20result%20%3D%20R.over(xLens%2C%20R.negate%2C%20%7Bx%3A%201%2C%20y%3A%202%7D)%20%2F%2F%20%3D%3E%20%7Bx%3A%20-1%2C%20y%3A%202%7D">Try this <strong>R.lens</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
lens<S, A>(getter: (s: S) => A, setter: (a: A, s: S) => S): Lens<S, A>;
```

</details>

<details>

<summary><strong>R.lens</strong> source</summary>

```javascript
export function lens(getter, setter){
  return function (functor){
    return function (target){
      return functor(getter(target)).map(focus => setter(focus, target))
    }
  }
}
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {lens, assoc, lensProp, view, lensIndex, over, lensPath} from 'rambda'

interface Input {
  foo: string,
}
const testObject: Input = {
  foo: 'Jazz',
}

describe('R.lens', () => {
  it('happy', () => {
    const fn = lens<Input, string>((x: Input) => {
      x.foo // $ExpectType string
      return x.foo
    }, assoc('name'))
    fn // $ExpectType Lens<Input, string>
  })
})

describe('R.lensProp', () => {
  it('happy', () => {
    const result = view<Input, string>(lensProp('foo'), testObject)
    result // $ExpectType string
  })
  it('issue 740', () => {
    // @ts-expect-error
    over(lensProp('x'), (n) => String(n), {x: 1})
  })
})

describe('R.lensIndex', () => {
  const testList: Input[] = [{foo: 'bar'}, {foo: 'baz'}]
  it('happy', () => {
    const result = view<Input[], Input>(lensIndex(0), testList)
    result // $ExpectType Input
    result.foo // $ExpectType string
  })
})

describe('R.lensPath', () => {
  const path = lensPath(['bar', 'a'])
  it('happy', () => {
    const result = view<Input, string>(path, testObject)
    result // $ExpectType string
  })
})

describe('R.view', () => {
  const fooLens = lens<Input, string>((x: Input) => {
    return x.foo
  }, assoc('foo'))
  it('happt', () => {
    const result = view<Input, string>(fooLens, testObject)
    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#lens)

### lensIndex

```typescript

lensIndex<A>(n: number): Lens<A[], A>
```

It returns a lens that focuses on specified `index`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B'a'%2C%20'b'%2C%20'c'%5D%0Aconst%20headLens%20%3D%20R.lensIndex(0)%0A%0AR.view(headLens%2C%20list)%20%2F%2F%20%3D%3E%20'a'%0AR.set(headLens%2C%20'x'%2C%20list)%20%2F%2F%20%3D%3E%20%5B'x'%2C%20'b'%2C%20'c'%5D%0Aconst%20result%20%3D%20R.over(headLens%2C%20R.toUpper%2C%20list)%20%2F%2F%20%3D%3E%20%5B'A'%2C%20'b'%2C%20'c'%5D">Try this <strong>R.lensIndex</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
lensIndex<A>(n: number): Lens<A[], A>;
lensIndex<A extends any[], N extends number>(n: N): Lens<A, A[N]>;
```

</details>

<details>

<summary><strong>R.lensIndex</strong> source</summary>

```javascript
import { lens } from './lens.js'
import { nth } from './nth.js'
import { update } from './update.js'

export function lensIndex(index){
  return lens(nth(index), update(index))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { compose } from './compose.js'
import { keys } from './keys.js'
import { lensIndex } from './lensIndex.js'
import { over } from './over.js'
import { set } from './set.js'
import { view } from './view.js'

const testList = [ { a : 1 }, { b : 2 }, { c : 3 } ]

test('focuses list element at the specified index', () => {
  expect(view(lensIndex(0), testList)).toEqual({ a : 1 })
})

test('returns undefined if the specified index does not exist', () => {
  expect(view(lensIndex(10), testList)).toBeUndefined()
})

test('sets the list value at the specified index', () => {
  expect(set(
    lensIndex(0), 0, testList
  )).toEqual([ 0, { b : 2 }, { c : 3 } ])
})

test('applies function to the value at the specified list index', () => {
  expect(over(
    lensIndex(2), keys, testList
  )).toEqual([ { a : 1 }, { b : 2 }, [ 'c' ] ])
})

test('can be composed', () => {
  const nestedList = [ 0, [ 10, 11, 12 ], 1, 2 ]
  const composedLens = compose(lensIndex(1), lensIndex(0))

  expect(view(composedLens, nestedList)).toBe(10)
})

test('set s (get s) === s', () => {
  expect(set(
    lensIndex(0), view(lensIndex(0), testList), testList
  )).toEqual(testList)
})

test('get (set s v) === v', () => {
  expect(view(lensIndex(0), set(
    lensIndex(0), 0, testList
  ))).toBe(0)
})

test('get (set(set s v1) v2) === v2', () => {
  expect(view(lensIndex(0),
    set(
      lensIndex(0), 11, set(
        lensIndex(0), 10, testList
      )
    ))).toBe(11)
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#lensIndex)

### lensPath

It returns a lens that focuses on specified `path`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20lensPath%20%3D%20R.lensPath(%5B'x'%2C%200%2C%20'y'%5D)%0Aconst%20input%20%3D%20%7Bx%3A%20%5B%7By%3A%202%2C%20z%3A%203%7D%2C%20%7By%3A%204%2C%20z%3A%205%7D%5D%7D%0A%0AR.view(lensPath%2C%20input)%20%2F%2F%20%3D%3E%202%0A%0AR.set(lensPath%2C%201%2C%20input)%20%0A%2F%2F%20%3D%3E%20%7Bx%3A%20%5B%7By%3A%201%2C%20z%3A%203%7D%2C%20%7By%3A%204%2C%20z%3A%205%7D%5D%7D%0A%0Aconst%20result%20%3D%20R.over(xHeadYLens%2C%20R.negate%2C%20input)%20%0A%2F%2F%20%3D%3E%20%7Bx%3A%20%5B%7By%3A%20-2%2C%20z%3A%203%7D%2C%20%7By%3A%204%2C%20z%3A%205%7D%5D%7D">Try this <strong>R.lensPath</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#lensPath)

### lensProp

```typescript

lensProp<S, K extends keyof S = keyof S>(prop: K): Lens<S, S[K]>
```

It returns a lens that focuses on specified property `prop`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20xLens%20%3D%20R.lensProp('x')%3B%0Aconst%20input%20%3D%20%7Bx%3A%201%2C%20y%3A%202%7D%0A%0AR.view(xLens%2C%20input)%20%2F%2F%20%3D%3E%201%0A%0AR.set(xLens%2C%204%2C%20input)%20%0A%2F%2F%20%3D%3E%20%7Bx%3A%204%2C%20y%3A%202%7D%0A%0Aconst%20result%20%3D%20R.over(xLens%2C%20R.negate%2C%20input)%20%0A%2F%2F%20%3D%3E%20%7Bx%3A%20-1%2C%20y%3A%202%7D">Try this <strong>R.lensProp</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
lensProp<S, K extends keyof S = keyof S>(prop: K): Lens<S, S[K]>;
```

</details>

<details>

<summary><strong>R.lensProp</strong> source</summary>

```javascript
import { assoc } from './assoc.js'
import { lens } from './lens.js'
import { prop } from './prop.js'

export function lensProp(key){
  return lens(prop(key), assoc(key))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { compose } from './compose.js'
import { identity } from './identity.js'
import { inc } from './inc.js'
import { lensProp } from './lensProp.js'
import { over } from './over.js'
import { set } from './set.js'
import { view } from './view.js'

const testObj = {
  a : 1,
  b : 2,
  c : 3,
}

test('focuses object the specified object property', () => {
  expect(view(lensProp('a'), testObj)).toBe(1)
})

test('returns undefined if the specified property does not exist', () => {
  expect(view(lensProp('X'), testObj)).toBeUndefined()
})

test('sets the value of the object property specified', () => {
  expect(set(
    lensProp('a'), 0, testObj
  )).toEqual({
    a : 0,
    b : 2,
    c : 3,
  })
})

test('adds the property to the object if it doesn\'t exist', () => {
  expect(set(
    lensProp('d'), 4, testObj
  )).toEqual({
    a : 1,
    b : 2,
    c : 3,
    d : 4,
  })
})

test('applies function to the value of the specified object property', () => {
  expect(over(
    lensProp('a'), inc, testObj
  )).toEqual({
    a : 2,
    b : 2,
    c : 3,
  })
})

test('applies function to undefined and adds the property if it doesn\'t exist', () => {
  expect(over(
    lensProp('X'), identity, testObj
  )).toEqual({
    a : 1,
    b : 2,
    c : 3,
    X : undefined,
  })
})

test('can be composed', () => {
  const nestedObj = {
    a : { b : 1 },
    c : 2,
  }
  const composedLens = compose(lensProp('a'), lensProp('b'))

  expect(view(composedLens, nestedObj)).toBe(1)
})

test('set s (get s) === s', () => {
  expect(set(
    lensProp('a'), view(lensProp('a'), testObj), testObj
  )).toEqual(testObj)
})

test('get (set s v) === v', () => {
  expect(view(lensProp('a'), set(
    lensProp('a'), 0, testObj
  ))).toBe(0)
})

test('get (set(set s v1) v2) === v2', () => {
  expect(view(lensProp('a'),
    set(
      lensProp('a'), 11, set(
        lensProp('a'), 10, testObj
      )
    ))).toBe(11)
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#lensProp)

### lt

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5BR.lt(2%2C%201)%2C%20R.lt(2%2C%203)%5D%0A%2F%2F%20%3D%3E%20%5Bfalse%2C%20true%5D">Try this <strong>R.lt</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#lt)

### lte

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5BR.lte(2%2C%201)%2C%20R.lte(2%2C%202)%2C%20R.lte(2%2C%203)%5D%0A%2F%2F%20%3D%3E%20%5Bfalse%2C%20true%2C%20true%5D">Try this <strong>R.lte</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#lte)

### map

```typescript

map<T, U>(fn: ObjectIterator<T, U>, iterable: Dictionary<T>): Dictionary<U>
```

It returns the result of looping through `iterable` with `fn`.

It works with both array and object.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20x%20%3D%3E%20x%20*%202%0Aconst%20fnWhenObject%20%3D%20(val%2C%20prop)%3D%3E%7B%0A%20%20return%20%60%24%7Bprop%7D-%24%7Bval%7D%60%0A%7D%0A%0Aconst%20iterable%20%3D%20%5B1%2C%202%5D%0Aconst%20obj%20%3D%20%7Ba%3A%201%2C%20b%3A%202%7D%0A%0Aconst%20result%20%3D%20%5B%20%0A%20%20R.map(fn%2C%20iterable)%2C%0A%20%20R.map(fnWhenObject%2C%20obj)%0A%5D%0A%2F%2F%20%3D%3E%20%5B%20%5B2%2C%204%5D%2C%20%7Ba%3A%20'a-1'%2C%20b%3A%20'b-2'%7D%5D">Try this <strong>R.map</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
map<T, U>(fn: ObjectIterator<T, U>, iterable: Dictionary<T>): Dictionary<U>;
map<T, U>(fn: Iterator<T, U>, iterable: T[]): U[];
map<T, U>(fn: Iterator<T, U>): (iterable: T[]) => U[];
map<T, U, S>(fn: ObjectIterator<T, U>): (iterable: Dictionary<T>) => Dictionary<U>;
map<T>(fn: Iterator<T, T>): (iterable: T[]) => T[];
map<T>(fn: Iterator<T, T>, iterable: T[]): T[];
```

</details>

<details>

<summary><strong>R.map</strong> source</summary>

```javascript
import { INCORRECT_ITERABLE_INPUT } from './_internals/constants.js'
import { isArray } from './_internals/isArray.js'
import { keys } from './_internals/keys.js'

export function mapArray(
  fn, list, isIndexed = false
){
  let index = 0
  const willReturn = Array(list.length)

  while (index < list.length){
    willReturn[ index ] = isIndexed ? fn(list[ index ], index) : fn(list[ index ])

    index++
  }

  return willReturn
}

export function mapObject(fn, obj){
  if (arguments.length === 1){
    return _obj => mapObject(fn, _obj)
  }
  let index = 0
  const objKeys = keys(obj)
  const len = objKeys.length
  const willReturn = {}

  while (index < len){
    const key = objKeys[ index ]
    willReturn[ key ] = fn(
      obj[ key ], key, obj
    )
    index++
  }

  return willReturn
}

export const mapObjIndexed = mapObject

export function map(fn, iterable){
  if (arguments.length === 1) return _iterable => map(fn, _iterable)
  if (!iterable){
    throw new Error(INCORRECT_ITERABLE_INPUT)
  }

  if (isArray(iterable)) return mapArray(fn, iterable)

  return mapObject(fn, iterable)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { map as mapRamda } from 'ramda'

import { map } from './map.js'

const double = x => x * 2

describe('with array', () => {
  it('happy', () => {
    expect(map(double, [ 1, 2, 3 ])).toEqual([ 2, 4, 6 ])
  })

  it('curried', () => {
    expect(map(double)([ 1, 2, 3 ])).toEqual([ 2, 4, 6 ])
  })
})

describe('with object', () => {
  const obj = {
    a : 1,
    b : 2,
  }

  it('happy', () => {
    expect(map(double, obj)).toEqual({
      a : 2,
      b : 4,
    })
  })

  it('property as second and input object as third argument', () => {
    const obj = {
      a : 1,
      b : 2,
    }
    const iterator = (
      val, prop, inputObject
    ) => {
      expect(prop).toBeString()
      expect(inputObject).toEqual(obj)

      return val * 2
    }

    expect(map(iterator)(obj)).toEqual({
      a : 2,
      b : 4,
    })
  })
})

test('bad inputs difference between Ramda and Rambda', () => {
  expect(() => map(double, null)).toThrowErrorMatchingInlineSnapshot('"Incorrect iterable input"')
  expect(() => map(double)(undefined)).toThrowErrorMatchingInlineSnapshot('"Incorrect iterable input"')
  expect(() => mapRamda(double, null)).toThrowErrorMatchingInlineSnapshot('"Cannot read properties of null (reading \'fantasy-land/map\')"')
  expect(() =>
    mapRamda(double, undefined)).toThrowErrorMatchingInlineSnapshot('"Cannot read properties of undefined (reading \'fantasy-land/map\')"')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {map} from 'rambda'

describe('R.map with arrays', () => {
  it('iterable returns the same type as the input', () => {
    const result = map<number>(
      (x: number) => {
        x // $ExpectType number
        return x + 2
      },
      [1, 2, 3]
    )
    result // $ExpectType number[]
  })
  it('iterable returns the same type as the input - curried', () => {
    const result = map<number>((x: number) => {
      x // $ExpectType number
      return x + 2
    })([1, 2, 3])
    result // $ExpectType number[]
  })
  it('iterable returns different type as the input', () => {
    const result = map<number, string>(
      (x: number) => {
        x // $ExpectType number
        return String(x)
      },
      [1, 2, 3]
    )
    result // $ExpectType string[]
  })
})

describe('R.map with objects', () => {
  it('iterable with all three arguments - curried', () => {
    // It requires dummy third typing argument
    // in order to identify compared to curry typings for arrays
    // ============================================
    const result = map<number, string, any>((a, b, c) => {
      a // $ExpectType number
      b // $ExpectType string
      c // $ExpectType Dictionary<number>
      return `${a}`
    })({a: 1, b: 2})
    result // $ExpectType Dictionary<string>
  })
  it('iterable with all three arguments', () => {
    const result = map<number, string>(
      (a, b, c) => {
        a // $ExpectType number
        b // $ExpectType string
        c // $ExpectType Dictionary<number>
        return `${a}`
      },
      {a: 1, b: 2}
    )
    result // $ExpectType Dictionary<string>
  })
  it('iterable with property argument', () => {
    const result = map<number, string>(
      (a, b) => {
        a // $ExpectType number
        b // $ExpectType string
        return `${a}`
      },
      {a: 1, b: 2}
    )
    result // $ExpectType Dictionary<string>
  })
  it('iterable with no property argument', () => {
    const result = map<number, string>(
      a => {
        a // $ExpectType number
        return `${a}`
      },
      {a: 1, b: 2}
    )
    result // $ExpectType Dictionary<string>
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#map)

### mapObjIndexed

```typescript

mapObjIndexed<T>(fn: ObjectIterator<T, T>, iterable: Dictionary<T>): Dictionary<T>
```

It works the same way as `R.map` does for objects. It is added as Ramda also has this method.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20(val%2C%20prop)%20%3D%3E%20%7B%0A%20%20return%20%60%24%7Bprop%7D-%24%7Bval%7D%60%0A%7D%0A%0Aconst%20obj%20%3D%20%7Ba%3A%201%2C%20b%3A%202%7D%0A%0Aconst%20result%20%3D%20R.mapObjIndexed(fn%2C%20obj)%0A%2F%2F%20%3D%3E%20%7Ba%3A%20'a-1'%2C%20b%3A%20'b-2'%7D">Try this <strong>R.mapObjIndexed</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
mapObjIndexed<T>(fn: ObjectIterator<T, T>, iterable: Dictionary<T>): Dictionary<T>;
mapObjIndexed<T, U>(fn: ObjectIterator<T, U>, iterable: Dictionary<T>): Dictionary<U>;
mapObjIndexed<T>(fn: ObjectIterator<T, T>): (iterable: Dictionary<T>) => Dictionary<T>;
mapObjIndexed<T, U>(fn: ObjectIterator<T, U>): (iterable: Dictionary<T>) => Dictionary<U>;
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {mapObjIndexed} from 'rambda'

const obj = {a: 1, b: 2, c: 3}

describe('R.mapObjIndexed', () => {
  it('without type transform', () => {
    const result = mapObjIndexed((x, prop, obj) => {
      x // $ExpectType number
      prop // $ExpectType string
      obj // $ExpectType Dictionary<number>
      return x + 2
    }, obj)
    result // $ExpectType Dictionary<number>
  })
  it('without type transform - curried', () => {
    const result = mapObjIndexed<number>((x, prop, obj) => {
      x // $ExpectType number
      prop // $ExpectType string
      obj // $ExpectType Dictionary<number>
      return x + 2
    })(obj)
    result // $ExpectType Dictionary<number>
  })
  it('change of type', () => {
    const result = mapObjIndexed((x, prop, obj) => {
      x // $ExpectType number
      prop // $ExpectType string
      obj // $ExpectType Dictionary<number>
      return String(x + 2)
    }, obj)
    result // $ExpectType Dictionary<string>
  })
  it('change of type - curried', () => {
    const result = mapObjIndexed<number, string>((x, prop, obj) => {
      x // $ExpectType number
      prop // $ExpectType string
      obj // $ExpectType Dictionary<number>
      return String(x + 2)
    })(obj)
    result // $ExpectType Dictionary<string>
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#mapObjIndexed)

### match

```typescript

match(regExpression: RegExp, str: string): string[]
```

Curried version of `String.prototype.match` which returns empty array, when there is no match.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.match('a'%2C%20'foo')%2C%0A%20%20R.match(%2F(%5Ba-z%5Da)%2Fg%2C%20'bananas')%0A%5D%0A%2F%2F%20%3D%3E%20%5B%5B%5D%2C%20%5B'ba'%2C%20'na'%2C%20'na'%5D%5D">Try this <strong>R.match</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
match(regExpression: RegExp, str: string): string[];
match(regExpression: RegExp): (str: string) => string[];
```

</details>

<details>

<summary><strong>R.match</strong> source</summary>

```javascript
export function match(pattern, input){
  if (arguments.length === 1) return _input => match(pattern, _input)

  const willReturn = input.match(pattern)

  return willReturn === null ? [] : willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { equals } from './equals.js'
import { match } from './match.js'

test('happy', () => {
  expect(match(/a./g)('foo bar baz')).toEqual([ 'ar', 'az' ])
})

test('fallback', () => {
  expect(match(/a./g)('foo')).toEqual([])
})

test('with string', () => {
  expect(match('a', 'foo')).toEqual([])
  expect(equals(match('o', 'foo'), [ 'o' ])).toBeTrue()
})

test('throwing', () => {
  expect(() => {
    match(/a./g, null)
  }).toThrowErrorMatchingInlineSnapshot('"Cannot read properties of null (reading \'match\')"')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {match} from 'rambda'

const str = 'foo bar'

describe('R.match', () => {
  it('happy', () => {
    const result = match(/foo/, str)
    result // $ExpectType string[]
  })
  it('curried', () => {
    const result = match(/foo/)(str)
    result // $ExpectType string[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#match)

### mathMod

`R.mathMod` behaves like the modulo operator should mathematically, unlike the `%` operator (and by extension, `R.modulo`). So while `-17 % 5` is `-2`, `mathMod(-17, 5)` is `3`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.mathMod(-17%2C%205)%2C%0A%20%20R.mathMod(17%2C%205)%2C%0A%20%20R.mathMod(17%2C%20-5)%2C%20%20%0A%20%20R.mathMod(17%2C%200)%20%20%20%0A%5D%0A%2F%2F%20%3D%3E%20%5B3%2C%202%2C%20NaN%2C%20NaN%5D">Try this <strong>R.mathMod</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#mathMod)

### max

It returns the greater value between `x` and `y`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.max(5%2C%207)%2C%20%20%0A%20%20R.max('bar'%2C%20'foo')%2C%20%20%0A%5D%0A%2F%2F%20%3D%3E%20%5B7%2C%20'foo'%5D">Try this <strong>R.max</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#max)

### maxBy

It returns the greater value between `x` and `y` according to `compareFn` function.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20compareFn%20%3D%20Math.abs%0A%0Aconst%20result%20%3D%20R.maxBy(compareFn%2C%205%2C%20-7)%20%2F%2F%20%3D%3E%20-7">Try this <strong>R.maxBy</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#maxBy)

### mean

```typescript

mean(list: number[]): number
```

It returns the mean value of `list` input.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.mean(%5B%202%2C%207%20%5D)%0A%2F%2F%20%3D%3E%204.5">Try this <strong>R.mean</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
mean(list: number[]): number;
```

</details>

<details>

<summary><strong>R.mean</strong> source</summary>

```javascript
import { sum } from './sum.js'

export function mean(list){
  return sum(list) / list.length
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { mean } from './mean.js'

test('happy', () => {
  expect(mean([ 2, 7 ])).toBe(4.5)
})

test('with NaN', () => {
  expect(mean([])).toBeNaN()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {mean} from 'rambda'

describe('R.mean', () => {
  it('happy', () => {
    const result = mean([1, 2, 3])

    result // $ExpectType number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#mean)

### median

```typescript

median(list: number[]): number
```

It returns the median value of `list` input.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.median(%5B%207%2C%202%2C%2010%2C%209%20%5D)%20%2F%2F%20%3D%3E%208">Try this <strong>R.median</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
median(list: number[]): number;
```

</details>

<details>

<summary><strong>R.median</strong> source</summary>

```javascript
import { mean } from './mean.js'

export function median(list){
  const len = list.length
  if (len === 0) return NaN
  const width = 2 - len % 2
  const idx = (len - width) / 2

  return mean(Array.prototype.slice
    .call(list, 0)
    .sort((a, b) => {
      if (a === b) return 0

      return a < b ? -1 : 1
    })
    .slice(idx, idx + width))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { median } from './median.js'

test('happy', () => {
  expect(median([ 2 ])).toBe(2)
  expect(median([ 7, 2, 10, 2, 9 ])).toBe(7)
})

test('with empty array', () => {
  expect(median([])).toBeNaN()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {median} from 'rambda'

describe('R.median', () => {
  it('happy', () => {
    const result = median([1, 2, 3])

    result // $ExpectType number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#median)

### merge

Same as `R.mergeRight`.

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#merge)

### mergeAll

```typescript

mergeAll<T>(list: object[]): T
```

It merges all objects of `list` array sequentially and returns the result.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%0A%20%20%7Ba%3A%201%7D%2C%0A%20%20%7Bb%3A%202%7D%2C%0A%20%20%7Bc%3A%203%7D%0A%5D%0Aconst%20result%20%3D%20R.mergeAll(list)%0Aconst%20expected%20%3D%20%7B%0A%20%20a%3A%201%2C%0A%20%20b%3A%202%2C%0A%20%20c%3A%203%0A%7D%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.mergeAll</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
mergeAll<T>(list: object[]): T;
mergeAll(list: object[]): object;
```

</details>

<details>

<summary><strong>R.mergeAll</strong> source</summary>

```javascript
import { map } from './map.js'
import { mergeRight } from './mergeRight.js'

export function mergeAll(arr){
  let willReturn = {}
  map(val => {
    willReturn = mergeRight(willReturn, val)
  }, arr)

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { mergeAll } from './mergeAll.js'

test('case 1', () => {
  const arr = [ { a : 1 }, { b : 2 }, { c : 3 } ]
  const expectedResult = {
    a : 1,
    b : 2,
    c : 3,
  }
  expect(mergeAll(arr)).toEqual(expectedResult)
})

test('case 2', () => {
  expect(mergeAll([ { foo : 1 }, { bar : 2 }, { baz : 3 } ])).toEqual({
    foo : 1,
    bar : 2,
    baz : 3,
  })
})

describe('acts as if nil values are simply empty objects', () => {
  it('if the first object is nil', () => {
    expect(mergeAll([ null, { foo : 1 }, { foo : 2 }, { bar : 2 } ])).toEqual({
      foo : 2,
      bar : 2,
    })
  })

  it('if the last object is nil', () => {
    expect(mergeAll([ { foo : 1 }, { foo : 2 }, { bar : 2 }, undefined ])).toEqual({
      foo : 2,
      bar : 2,
    })
  })

  it('if an intermediate object is nil', () => {
    expect(mergeAll([ { foo : 1 }, { foo : 2 }, null, { bar : 2 } ])).toEqual({
      foo : 2,
      bar : 2,
    })
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {mergeAll} from 'rambda'

describe('R.mergeAll', () => {
  it('with passing type', () => {
    interface Output {
      foo: number,
      bar: number,
    }
    const result = mergeAll<Output>([{foo: 1}, {bar: 2}])
    result.foo // $ExpectType number
    result.bar // $ExpectType number
  })

  it('without passing type', () => {
    const result = mergeAll([{foo: 1}, {bar: 2}])
    result // $ExpectType unknown
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#mergeAll)

### mergeDeepLeft

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.mergeDeepLeft(%0A%20%20%7Ba%3A%20%7Bb%3A%201%7D%7D%2C%0A%20%20%7Ba%3A%20%7Bb%3A%202%2C%20c%3A%203%7D%7D%0A)%0A%2F%2F%20%3D%3E%20%7Ba%3A%20%7Bb%3A%201%2C%20c%3A%203%7D%7D">Try this <strong>R.mergeDeepLeft</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#mergeDeepLeft)

### mergeDeepRight

```typescript

mergeDeepRight<Output>(target: object, newProps: object): Output
```

Creates a new object with the own properties of the first object merged with the own properties of the second object. If a key exists in both objects:

  - and both values are objects, the two values will be recursively merged
  - otherwise the value from the second object will be used.

<details>

<summary>All TypeScript definitions</summary>

```typescript
mergeDeepRight<Output>(target: object, newProps: object): Output;
mergeDeepRight<Output>(target: object): (newProps: object) => Output;
```

</details>

<details>

<summary><strong>R.mergeDeepRight</strong> source</summary>

```javascript
import { clone } from './clone.js'
import { type } from './type.js'

export function mergeDeepRight(target, source){
  if (arguments.length === 1){
    return sourceHolder => mergeDeepRight(target, sourceHolder)
  }

  const willReturn = clone(target)

  Object.keys(source).forEach(key => {
    if (type(source[ key ]) === 'Object'){
      if (type(target[ key ]) === 'Object'){
        willReturn[ key ] = mergeDeepRight(target[ key ], source[ key ])
      } else {
        willReturn[ key ] = source[ key ]
      }
    } else {
      willReturn[ key ] = source[ key ]
    }
  })

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { mergeDeepRight } from './mergeDeepRight.js'

const student = {
  name    : 'foo',
  age     : 10,
  contact : {
    a     : 1,
    email : 'foo@example.com',
  },
}
const teacher = {
  age     : 40,
  contact : { email : 'baz@example.com' },
  songs   : { title : 'Remains the same' },
}

test('when merging object with lists inside them', () => {
  const a = {
    a : [ 1, 2, 3 ],
    b : [ 4, 5, 6 ],
  }
  const b = {
    a : [ 7, 8, 9 ],
    b : [ 10, 11, 12 ],
  }
  const result = mergeDeepRight(a, b)
  const expected = {
    a : [ 7, 8, 9 ],
    b : [ 10, 11, 12 ],
  }
  expect(result).toEqual(expected)
})

test('happy', () => {
  const result = mergeDeepRight(student, teacher)
  const curryResult = mergeDeepRight(student)(teacher)
  const expected = {
    age     : 40,
    name    : 'foo',
    contact : {
      a     : 1,
      email : 'baz@example.com',
    },
    songs : { title : 'Remains the same' },
  }

  expect(result).toEqual(expected)
  expect(curryResult).toEqual(expected)
})

test('issue 650', () => {
  expect(Object.keys(mergeDeepRight({ a : () => {} }, { b : () => {} }))).toEqual([
    'a',
    'b',
  ])
})

test('ramda compatible test 1', () => {
  const a = {
    w : 1,
    x : 2,
    y : { z : 3 },
  }
  const b = {
    a : 4,
    b : 5,
    c : { d : 6 },
  }
  const result = mergeDeepRight(a, b)
  const expected = {
    w : 1,
    x : 2,
    y : { z : 3 },
    a : 4,
    b : 5,
    c : { d : 6 },
  }

  expect(result).toEqual(expected)
})

test('ramda compatible test 2', () => {
  const a = {
    a : {
      b : 1,
      c : 2,
    },
    y : 0,
  }
  const b = {
    a : {
      b : 3,
      d : 4,
    },
    z : 0,
  }
  const result = mergeDeepRight(a, b)
  const expected = {
    a : {
      b : 3,
      c : 2,
      d : 4,
    },
    y : 0,
    z : 0,
  }

  expect(result).toEqual(expected)
})

test('ramda compatible test 3', () => {
  const a = {
    w : 1,
    x : { y : 2 },
  }
  const result = mergeDeepRight(a, { x : { y : 3 } })
  const expected = {
    w : 1,
    x : { y : 3 },
  }
  expect(result).toEqual(expected)
})

test('functions are not discarded', () => {
  const obj = { foo : () => {} }
  expect(typeof mergeDeepRight(obj, {}).foo).toBe('function')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {mergeDeepRight} from 'rambda'

interface Output {
  foo: {
    bar: number,
  },
}

describe('R.mergeDeepRight', () => {
  const result = mergeDeepRight<Output>({foo: {bar: 1}}, {foo: {bar: 2}})
  result.foo.bar // $ExpectType number
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#mergeDeepRight)

### mergeLeft

```typescript

mergeLeft<Output>(newProps: object, target: object): Output
```

Same as `R.merge`, but in opposite direction.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.mergeLeft(%0A%20%20%7Ba%3A%2010%7D%2C%0A%20%20%7Ba%3A%201%2C%20b%3A%202%7D%0A)%0A%2F%2F%20%3D%3E%20%7Ba%3A10%2C%20b%3A%202%7D">Try this <strong>R.mergeLeft</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
mergeLeft<Output>(newProps: object, target: object): Output;
mergeLeft<Output>(newProps: object): (target: object) => Output;
```

</details>

<details>

<summary><strong>R.mergeLeft</strong> source</summary>

```javascript
import { mergeRight } from './mergeRight.js'

export function mergeLeft(x, y){
  if (arguments.length === 1) return _y => mergeLeft(x, _y)

  return mergeRight(y, x)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { mergeLeft } from './mergeLeft.js'

const obj = {
  foo : 1,
  bar : 2,
}

test('happy', () => {
  expect(mergeLeft({ bar : 20 }, obj)).toEqual({
    foo : 1,
    bar : 20,
  })
})

test('curry', () => {
  expect(mergeLeft({ baz : 3 })(obj)).toEqual({
    foo : 1,
    bar : 2,
    baz : 3,
  })
})

test('when undefined or null instead of object', () => {
  expect(mergeLeft(null, undefined)).toEqual({})
  expect(mergeLeft(obj, null)).toEqual(obj)
  expect(mergeLeft(obj, undefined)).toEqual(obj)
  expect(mergeLeft(undefined, obj)).toEqual(obj)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {mergeLeft} from 'rambda'

interface Output {
  foo: number,
  bar: number,
}

describe('R.mergeLeft', () => {
  const result = mergeLeft<Output>({foo: 1}, {bar: 2})
  const curriedResult = mergeLeft<Output>({foo: 1})({bar: 2})

  result.foo // $ExpectType number
  result.bar // $ExpectType number
  curriedResult.bar // $ExpectType number
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#mergeLeft)

### mergeRight

It creates a copy of `target` object with overwritten `newProps` properties. Previously known as `R.merge` but renamed after Ramda did the same.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20target%20%3D%20%7B%20'foo'%3A%200%2C%20'bar'%3A%201%20%7D%0Aconst%20newProps%20%3D%20%7B%20'foo'%3A%207%20%7D%0A%0Aconst%20result%20%3D%20R.mergeRight(target%2C%20newProps)%0A%2F%2F%20%3D%3E%20%7B%20'foo'%3A%207%2C%20'bar'%3A%201%20%7D">Try this <strong>R.mergeRight</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#mergeRight)

### mergeWith

```typescript

mergeWith(fn: (x: any, z: any) => any, a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown>
```

It takes two objects and a function, which will be used when there is an overlap between the keys.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.mergeWith(%0A%20%20R.concat%2C%0A%20%20%7Bvalues%20%3A%20%5B%2010%2C%2020%20%5D%7D%2C%0A%20%20%7Bvalues%20%3A%20%5B%2015%2C%2035%20%5D%7D%0A)%0A%2F%2F%20%3D%3E%20%5B%2010%2C%2020%2C%2015%2C%2035%20%5D">Try this <strong>R.mergeWith</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
mergeWith(fn: (x: any, z: any) => any, a: Record<string, unknown>, b: Record<string, unknown>): Record<string, unknown>;
mergeWith<Output>(fn: (x: any, z: any) => any, a: Record<string, unknown>, b: Record<string, unknown>): Output;
mergeWith(fn: (x: any, z: any) => any, a: Record<string, unknown>): (b: Record<string, unknown>) => Record<string, unknown>;
mergeWith<Output>(fn: (x: any, z: any) => any, a: Record<string, unknown>): (b: Record<string, unknown>) => Output;
mergeWith(fn: (x: any, z: any) => any): <U, V>(a: U, b: V) => Record<string, unknown>;
mergeWith<Output>(fn: (x: any, z: any) => any): <U, V>(a: U, b: V) => Output;
```

</details>

<details>

<summary><strong>R.mergeWith</strong> source</summary>

```javascript
import { curry } from './curry.js'

export function mergeWithFn(
  mergeFn, aInput, bInput
){
  const a = aInput ?? {}
  const b = bInput ?? {}
  const willReturn = {}

  Object.keys(a).forEach(key => {
    if (b[ key ] === undefined) willReturn[ key ] = a[ key ]
    else willReturn[ key ] = mergeFn(a[ key ], b[ key ])
  })

  Object.keys(b).forEach(key => {
    if (willReturn[ key ] !== undefined) return

    if (a[ key ] === undefined) willReturn[ key ] = b[ key ]
    else willReturn[ key ] = mergeFn(a[ key ], b[ key ])
  })

  return willReturn
}

export const mergeWith = curry(mergeWithFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { concat } from './concat.js'
import { mergeWithFn } from './mergeWith.js'

test('happy', () => {
  const result = mergeWithFn(
    concat,
    {
      a      : true,
      values : [ 10, 20 ],
    },
    {
      b      : true,
      values : [ 15, 35 ],
    }
  )
  const expected = {
    a      : true,
    b      : true,
    values : [ 10, 20, 15, 35 ],
  }
  expect(result).toEqual(expected)
})

// https://github.com/ramda/ramda/pull/3222/files#diff-d925d9188b478d2f1d4b26012c6dddac374f9e9d7a336604d654b9a113bfc857
describe('acts as if nil values are simply empty objects', () => {
  it('if the first object is nil and the second empty', () => {
    expect(mergeWithFn(
      concat, undefined, {}
    )).toEqual({})
  })

  it('if the first object is empty and the second nil', () => {
    expect(mergeWithFn(
      concat, {}, null
    )).toEqual({})
  })

  it('if both objects are nil', () => {
    expect(mergeWithFn(
      concat, undefined, null
    )).toEqual({})
  })

  it('if the first object is not empty and the second is nil', () => {
    expect(mergeWithFn(
      concat, { a : 'a' }, null
    )).toEqual({ a : 'a' })
  })

  it('if the first object is nil and the second is not empty', () => {
    expect(mergeWithFn(
      concat, undefined, { a : 'a' }
    )).toEqual({ a : 'a' })
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {concat, mergeWith} from 'rambda'

interface Output {
  a: boolean,
  b: boolean,
  values: number[],
}
const A = {
  a: true,
  values: [10, 20],
}
const B = {
  b: true,
  values: [15, 35],
}

describe('R.mergeWith', () => {
  test('no curry | without explicit types', () => {
    const result = mergeWith(concat, A, B)
    result // $ExpectType Record<string, unknown>
  })
  test('no curry | with explicit types', () => {
    const result = mergeWith<Output>(concat, A, B)
    result // $ExpectType Output
  })
  test('curry 1 | without explicit types', () => {
    const result = mergeWith(concat, A)(B)
    result // $ExpectType Record<string, unknown>
  })
  test('curry 1 | with explicit types', () => {
    const result = mergeWith<Output>(concat, A)(B)
    result // $ExpectType Output
  })
  test('curry 2 | without explicit types', () => {
    const result = mergeWith(concat)(A, B)
    result // $ExpectType Record<string, unknown>
  })
  test('curry 2 | with explicit types', () => {
    const result = mergeWith<Output>(concat)(A, B)
    result // $ExpectType Output
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#mergeWith)

### min

It returns the lesser value between `x` and `y`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.min(5%2C%207)%2C%20%20%0A%20%20R.min('bar'%2C%20'foo')%2C%20%20%0A%5D%0A%2F%2F%20%3D%3E%20%5B5%2C%20'bar'%5D">Try this <strong>R.min</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#min)

### minBy

It returns the lesser value between `x` and `y` according to `compareFn` function.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20compareFn%20%3D%20Math.abs%0A%0Aconst%20result%20%3D%20R.minBy(compareFn%2C%20-5%2C%202)%20%2F%2F%20%3D%3E%20-5">Try this <strong>R.minBy</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#minBy)

### modify

```typescript

modify<K extends PropertyKey, T>(prop: K, fn: (value: T) => T): <U extends Record<K, T>>(object: U) => U
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.modify()%0A%2F%2F%20%3D%3E">Try this <strong>R.modify</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
modify<K extends PropertyKey, T>(prop: K, fn: (value: T) => T): <U extends Record<K, T>>(object: U) => U;
modify<U, K extends keyof U>(prop: K, fn: (value: U[K]) => U[K], object: U): U;
modify<K extends PropertyKey>(prop: K): {
  <T>(fn: (value: T) => T): <U extends Record<K, T>>(object: U) => U;
  <T, U extends Record<K, T>>(fn: (value: T) => T, object: U): U;
};
```

</details>

<details>

<summary><strong>R.modify</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'
import { isIterable } from './_internals/isIterable.js'
import { curry } from './curry.js'
import { updateFn } from './update.js'

function modifyFn(
  property, fn, iterable
){
  if (!isIterable(iterable)) return iterable
  if (iterable[ property ] === undefined) return iterable
  if (isArray(iterable)){
    return updateFn(
      property, fn(iterable[ property ]), iterable
    )
  }

  return {
    ...iterable,
    [ property ] : fn(iterable[ property ]),
  }
}

export const modify = curry(modifyFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { modify as modifyRamda } from 'ramda'

import { compareCombinations, FALSY_VALUES } from './_internals/testUtils.js'
import { add } from './add.js'
import { compose } from './compose.js'
import { modify } from './modify.js'

const person = {
  name : 'foo',
  age  : 20,
}

test('happy', () => {
  expect(modify(
    'age', x => x + 1, person
  )).toEqual({
    name : 'foo',
    age  : 21,
  })
})

test('property is missing', () => {
  expect(modify(
    'foo', x => x + 1, person
  )).toEqual(person)
})

test('adjust if `array` at the given key with the `transformation` function', () => {
  expect(modify(
    1, add(1), [ 100, 1400 ]
  )).toEqual([ 100, 1401 ])
})

describe('ignores transformations if the input value is not Array and Object', () => {
  ;[ 42, undefined, null, '' ].forEach(value => {
    it(`${ value }`, () => {
      expect(modify(
        'a', add(1), value
      )).toEqual(value)
    })
  })
})

const possibleProperties = [ ...FALSY_VALUES, 'foo', 0 ]
const possibleTransformers = [
  ...FALSY_VALUES,
  add(1),
  add('foo'),
  compose,
  String,
]
const possibleObjects = [
  ...FALSY_VALUES,
  {},
  [ 1, 2, 3 ],
  {
    a   : 1,
    foo : 2,
  },
  {
    a   : 1,
    foo : [ 1 ],
  },
  {
    a   : 1,
    foo : 'bar',
  },
]

describe('brute force', () => {
  compareCombinations({
    fn          : modify,
    fnRamda     : modifyRamda,
    firstInput  : possibleProperties,
    secondInput : possibleTransformers,
    thirdInput  : possibleObjects,
    callback    : errorsCounters => {
      expect(errorsCounters).toMatchInlineSnapshot(`
        {
          "ERRORS_MESSAGE_MISMATCH": 0,
          "ERRORS_TYPE_MISMATCH": 0,
          "RESULTS_MISMATCH": 0,
          "SHOULD_NOT_THROW": 0,
          "SHOULD_THROW": 0,
          "TOTAL_TESTS": 630,
        }
      `)
    },
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import { add, identity, map, modify, pipe, toUpper } from 'rambda';

type Obj = {
	foo: string;
	bar: number;
};

describe('R.modify', () => {
	it('ramda tests', () => {
		const result1 = modify('foo', toUpper, {} as Obj);
		result1; // $ExpectType Obj

		const result2 = modify('bar', add(1), {} as Obj);
		result2; // $ExpectType Obj

		const result3 = modify('foo', toUpper)({} as Obj);
		result3; // $ExpectType Obj

		const result4 = modify('bar', add(1))({} as Obj);
		result4; // $ExpectType Obj

		const result5 = modify('foo')(toUpper)({} as Obj);
		result5; // $ExpectType Obj

		const result6 = modify('bar')(add(1))({} as Obj);
		result6; // $ExpectType Obj

		const result7 = modify('foo')(toUpper, {} as Obj);
		result7; // $ExpectType Obj

		const result8 = modify('bar')(add(1), {} as Obj);
		result8; // $ExpectType Obj

		const result9 = modify('foo', identity, {} as Obj);
		result9; // $ExpectType Obj

		// @ts-expect-error
		modify('foo', add(1), {} as Obj);
		// @ts-expect-error
		modify('bar', toUpper, {} as Obj);

		const f = pipe(map<Obj, Obj>(modify('foo', toUpper)));

		f([] as Obj[]); // $ExpectType Obj[]
	});
});
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#modify)

### modifyPath

It changes a property of object on the base of provided path and transformer function.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.modifyPath('a.b.c'%2C%20x%3D%3E%20x%2B1%2C%20%7Ba%3A%7Bb%3A%20%7Bc%3A1%7D%7D%7D)%0A%2F%2F%20%3D%3E%20%7Ba%3A%7Bb%3A%20%7Bc%3A2%7D%7D%7D">Try this <strong>R.modifyPath</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#modifyPath)

### modulo

Curried version of `x%y`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.modulo(17%2C%203)%20%2F%2F%20%3D%3E%202">Try this <strong>R.modulo</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#modulo)

### move

It returns a copy of `list` with exchanged `fromIndex` and `toIndex` elements.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%5D%0Aconst%20result%20%3D%20R.move(0%2C%201%2C%20list)%0A%2F%2F%20%3D%3E%20%5B2%2C%201%2C%203%5D">Try this <strong>R.move</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#move)

### multiply

Curried version of `x*y`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.multiply(2%2C%204)%20%2F%2F%20%3D%3E%208">Try this <strong>R.multiply</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#multiply)

### negate

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.negate(420)%2F%2F%20%3D%3E%20-420">Try this <strong>R.negate</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#negate)

### none

```typescript

none<T>(predicate: (x: T) => boolean, list: T[]): boolean
```

It returns `true`, if all members of array `list` returns `false`, when applied as argument to `predicate` function.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%200%2C%201%2C%202%2C%203%2C%204%20%5D%0Aconst%20predicate%20%3D%20x%20%3D%3E%20x%20%3E%206%0A%0Aconst%20result%20%3D%20R.none(predicate%2C%20arr)%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.none</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
none<T>(predicate: (x: T) => boolean, list: T[]): boolean;
none<T>(predicate: (x: T) => boolean): (list: T[]) => boolean;
```

</details>

<details>

<summary><strong>R.none</strong> source</summary>

```javascript
export function none(predicate, list){
  if (arguments.length === 1) return _list => none(predicate, _list)

  for (let i = 0; i < list.length; i++){
    if (predicate(list[ i ])) return false
  }

  return true
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { none } from './none.js'

const isEven = n => n % 2 === 0

test('when true', () => {
  expect(none(isEven, [ 1, 3, 5, 7 ])).toBeTrue()
})

test('when false curried', () => {
  expect(none(input => input > 1, [ 1, 2, 3 ])).toBeFalse()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {none} from 'rambda'

describe('R.none', () => {
  it('happy', () => {
    const result = none(
      x => {
        x // $ExpectType number
        return x > 0
      },
      [1, 2, 3]
    )
    result // $ExpectType boolean
  })
  it('curried needs a type', () => {
    const result = none<number>(x => {
      x // $ExpectType number
      return x > 0
    })([1, 2, 3])
    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#none)

### not

```typescript

not(input: any): boolean
```

It returns a boolean negated version of `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.not(false)%20%2F%2F%20true">Try this <strong>R.not</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
not(input: any): boolean;
```

</details>

<details>

<summary><strong>R.not</strong> source</summary>

```javascript
export function not(input){
  return !input
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { not } from './not.js'

test('not', () => {
  expect(not(false)).toBeTrue()
  expect(not(true)).toBeFalse()
  expect(not(0)).toBeTrue()
  expect(not(1)).toBeFalse()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {not} from 'rambda'

describe('R.not', () => {
  it('happy', () => {
    const result = not(4)

    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#not)

### nth

```typescript

nth(index: number, input: string): string
```

Curried version of `input[index]`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%5D%0Aconst%20str%20%3D%20'foo'%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.nth(2%2C%20list)%2C%0A%20%20R.nth(6%2C%20list)%2C%0A%20%20R.nth(0%2C%20str)%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5B3%2C%20undefined%2C%20'f'%5D">Try this <strong>R.nth</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
nth(index: number, input: string): string;	
nth<T>(index: number, input: T[]): T | undefined;	
nth(n: number): {
  <T>(input: T[]): T | undefined;
  (input: string): string;
};
```

</details>

<details>

<summary><strong>R.nth</strong> source</summary>

```javascript
export function nth(index, input){
  if (arguments.length === 1) return _input => nth(index, _input)

  const idx = index < 0 ? input.length + index : index

  return Object.prototype.toString.call(input) === '[object String]' ?
    input.charAt(idx) :
    input[ idx ]
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { nth } from './nth.js'

test('happy', () => {
  expect(nth(2, [ 1, 2, 3, 4 ])).toBe(3)
})

test('with curry', () => {
  expect(nth(2)([ 1, 2, 3, 4 ])).toBe(3)
})

test('with string and correct index', () => {
  expect(nth(2)('foo')).toBe('o')
})

test('with string and invalid index', () => {
  expect(nth(20)('foo')).toBe('')
})

test('with negative index', () => {
  expect(nth(-3)([ 1, 2, 3, 4 ])).toBe(2)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {nth} from 'rambda'

const list = [1, 2, 3]

describe('R.nth', () => {
  it('happy', () => {
    const result = nth(4, list)

    result // $ExpectType number | undefined
  })
  it('curried', () => {
    const result = nth(1)(list)

    result // $ExpectType number | undefined
  })
})

describe('R.nth - string', () => {
  const str = 'abc'
  it('happy', () => {
    const result = nth(4, str)

    result // $ExpectType string
  })
  it('curried', () => {
    const result = nth(1)(str)

    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#nth)

### objOf

It creates an object with a single key-value pair.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.objOf('foo'%2C%20'bar')%0A%2F%2F%20%3D%3E%20%7Bfoo%3A%20'bar'%7D">Try this <strong>R.objOf</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#objOf)

### of

```typescript

of<T>(x: T): T[]
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?R.of(null)%3B%20%2F%2F%20%3D%3E%20%5Bnull%5D%0Aconst%20result%20%3D%20R.of(%5B42%5D)%3B%20%2F%2F%20%3D%3E%20%5B%5B42%5D%5D">Try this <strong>R.of</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
of<T>(x: T): T[];
```

</details>

<details>

<summary><strong>R.of</strong> source</summary>

```javascript
export function of(value){
  return [ value ]
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { of } from './of.js'

test('happy', () => {
  expect(of(3)).toEqual([ 3 ])

  expect(of(null)).toEqual([ null ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {of} from 'rambda'

const list = [1, 2, 3]

describe('R.of', () => {
  it('happy', () => {
    const result = of(4)

    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = of(list)

    result // $ExpectType number[][]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#of)

### omit

```typescript

omit<T, K extends string>(propsToOmit: K[], obj: T): Omit<T, K>
```

It returns a partial copy of an `obj` without `propsToOmit` properties.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7Ba%3A%201%2C%20b%3A%202%2C%20c%3A%203%7D%0Aconst%20propsToOmit%20%3D%20'a%2Cc%2Cd'%0Aconst%20propsToOmitList%20%3D%20%5B'a'%2C%20'c'%2C%20'd'%5D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.omit(propsToOmit%2C%20Record%3Cstring%2C%20unknown%3E)%2C%20%0A%20%20R.omit(propsToOmitList%2C%20Record%3Cstring%2C%20unknown%3E)%20%0A%5D%0A%2F%2F%20%3D%3E%20%5B%7Bb%3A%202%7D%2C%20%7Bb%3A%202%7D%5D">Try this <strong>R.omit</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
omit<T, K extends string>(propsToOmit: K[], obj: T): Omit<T, K>;
omit<K extends string>(propsToOmit: K[]): <T>(obj: T) => Omit<T, K>;
omit<T, U>(propsToOmit: string, obj: T): U;
omit<T, U>(propsToOmit: string): (obj: T) => U;
omit<T>(propsToOmit: string, obj: object): T;
omit<T>(propsToOmit: string): (obj: object) => T;
```

</details>

<details>

<summary><strong>R.omit</strong> source</summary>

```javascript
import { createPath } from './_internals/createPath.js'
import { includes } from './_internals/includes.js'

export function omit(propsToOmit, obj){
  if (arguments.length === 1) return _obj => omit(propsToOmit, _obj)

  if (obj === null || obj === undefined)
    return undefined

  const propsToOmitValue = createPath(propsToOmit, ',')
  const willReturn = {}

  for (const key in obj)
    if (!includes(key, propsToOmitValue))
      willReturn[ key ] = obj[ key ]

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { omit } from './omit.js'

test('with string as condition', () => {
  const obj = {
    a : 1,
    b : 2,
    c : 3,
  }
  const result = omit('a,c', obj)
  const resultCurry = omit('a,c')(obj)
  const expectedResult = { b : 2 }

  expect(result).toEqual(expectedResult)
  expect(resultCurry).toEqual(expectedResult)
})

test.only('with number as property to omit', () => {
  const obj = {
    1 : 1,
    b : 2,
  }
  const result = omit([ 1 ], obj)
  expect(result).toEqual({ b : 2 })
})

test('with null', () => {
  expect(omit('a,b', null)).toBeUndefined()
})

test('happy', () => {
  expect(omit([ 'a', 'c' ])({
    a : 'foo',
    b : 'bar',
    c : 'baz',
  })).toEqual({ b : 'bar' })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {omit} from 'rambda'

describe('R.omit with array as props input', () => {
  it('allow Typescript to infer object type', () => {
    const input = {a: 'foo', b: 2, c: 3, d: 4}
    const result = omit(['b,c'], input)

    result.a // $ExpectType string
    result.d // $ExpectType number

    const curriedResult = omit(['a,c'], input)

    curriedResult.a // $ExpectType string
    curriedResult.d // $ExpectType number
  })

  it('declare type of input object', () => {
    interface Input {
      a: string,
      b: number,
      c: number,
      d: number,
    }
    const input: Input = {a: 'foo', b: 2, c: 3, d: 4}
    const result = omit(['b,c'], input)
    result // $ExpectType Omit<Input, "b,c">

    result.a // $ExpectType string
    result.d // $ExpectType number

    const curriedResult = omit(['a,c'], input)

    curriedResult.a // $ExpectType string
    curriedResult.d // $ExpectType number
  })
})

describe('R.omit with string as props input', () => {
  interface Output {
    b: number,
    d: number,
  }

  it('explicitly declare output', () => {
    const result = omit<Output>('a,c', {a: 1, b: 2, c: 3, d: 4})
    result // $ExpectType Output
    result.b // $ExpectType number

    const curriedResult = omit<Output>('a,c')({a: 1, b: 2, c: 3, d: 4})

    curriedResult.b // $ExpectType number
  })

  it('explicitly declare input and output', () => {
    interface Input {
      a: number,
      b: number,
      c: number,
      d: number,
    }
    const result = omit<Input, Output>('a,c', {a: 1, b: 2, c: 3, d: 4})
    result // $ExpectType Output
    result.b // $ExpectType number

    const curriedResult = omit<Input, Output>('a,c')({
      a: 1,
      b: 2,
      c: 3,
      d: 4,
    })

    curriedResult.b // $ExpectType number
  })

  it('without passing type', () => {
    const result = omit('a,c', {a: 1, b: 2, c: 3, d: 4})
    result // $ExpectType unknown
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#omit)

### on

It passes the two inputs through `unaryFn` and then the results are passed as inputs the the `binaryFn` to receive the final result(`binaryFn(unaryFn(FIRST_INPUT), unaryFn(SECOND_INPUT))`). 

This method is also known as P combinator.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.on((a%2C%20b)%20%3D%3E%20a%20%2B%20b%2C%20R.prop('a')%2C%20%7Bb%3A0%2C%20a%3A1%7D%2C%20%7Ba%3A2%7D)%0A%2F%2F%20%3D%3E%203">Try this <strong>R.on</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#on)

### once

```typescript

once<T extends AnyFunction, C = unknown>(fn: T, context?: C): T
```

It returns a function, which invokes only once `fn` function.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?let%20result%20%3D%200%0Aconst%20addOnce%20%3D%20R.once((x)%20%3D%3E%20result%20%3D%20result%20%2B%20x)%0A%0AaddOnce(1)%0Aconst%20result%20%3D%20addOnce(1)%0A%2F%2F%20%3D%3E%201">Try this <strong>R.once</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
once<T extends AnyFunction, C = unknown>(fn: T, context?: C): T;
```

</details>

<details>

<summary><strong>R.once</strong> source</summary>

```javascript
import { curry } from './curry.js'

function onceFn(fn, context){
  let result

  return function (){
    if (fn){
      result = fn.apply(context || this, arguments)
      fn = null
    }

    return result
  }
}

export function once(fn, context){
  if (arguments.length === 1){
    const wrap = onceFn(fn, context)

    return curry(wrap)
  }

  return onceFn(fn, context)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { once } from './once.js'

test('with counter', () => {
  let counter = 0
  const runOnce = once(x => {
    counter++

    return x + 2
  })
  expect(runOnce(1)).toBe(3)
  runOnce(1)
  runOnce(1)
  runOnce(1)
  expect(counter).toBe(1)
})

test('happy path', () => {
  const addOneOnce = once((
    a, b, c
  ) => a + b + c, 1)

  expect(addOneOnce(
    10, 20, 30
  )).toBe(60)
  expect(addOneOnce(40)).toBe(60)
})

test('with context', () => {
  const context = { name: 'fris' }
  const getNameOnce = once(function (){
    return this.name
  }, context)

  expect(getNameOnce()).toBe('fris')
  expect(getNameOnce()).toBe('fris')
  expect(getNameOnce()).toBe('fris')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {once} from 'rambda'

describe('R.once', () => {
  it('happy', () => {
    const runOnce = once((x: number) => {
      return x + 2
    })

    const result = runOnce(1)
    result // $ExpectType number
  })
  it('with context', () => {
    const runOnce = once(function (this: any, x: number) {
      return x + 2
    })

    const result = runOnce.call({}, 1)
    result // $ExpectType number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#once)

### or

Logical OR

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?R.or(false%2C%20true)%3B%20%2F%2F%20%3D%3E%20true%0AR.or(false%2C%20false)%3B%20%2F%2F%20%3D%3E%20false%0Aconst%20result%20%3D%20R.or(false%2C%20'foo')%3B%20%2F%2F%20%3D%3E%20'foo'">Try this <strong>R.or</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#or)

### over

```typescript

over<S, A>(lens: Lens<S, A>): {
  (fn: (a: A) => A): (value: S) => S
```

It returns a copied **Object** or **Array** with modified value received by applying function `fn` to `lens` focus.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20headLens%20%3D%20R.lensIndex(0)%0A%20%0Aconst%20result%20%3D%20R.over(headLens%2C%20R.toUpper%2C%20%5B'foo'%2C%20'bar'%2C%20'baz'%5D)%20%2F%2F%20%3D%3E%20%5B'FOO'%2C%20'bar'%2C%20'baz'%5D">Try this <strong>R.over</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
over<S, A>(lens: Lens<S, A>): {
  (fn: (a: A) => A): (value: S) => S;
  (fn: (a: A) => A, value: S): S;
};
over<S, A>(lens: Lens<S, A>, fn: (a: A) => A): (value: S) => S;
over<S, A>(lens: Lens<S, A>, fn: (a: A) => A, value: S): S;
```

</details>

<details>

<summary><strong>R.over</strong> source</summary>

```javascript
import { curry } from './curry.js'

const Identity = x => ({
  x,
  map : fn => Identity(fn(x)),
})

function overFn(
  lens, fn, object
){
  return lens(x => Identity(fn(x)))(object).x
}

export const over = curry(overFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { assoc } from './assoc.js'
import { lens } from './lens.js'
import { lensIndex } from './lensIndex.js'
import { lensPath } from './lensPath.js'
import { over } from './over.js'
import { prop } from './prop.js'
import { toUpper } from './toUpper.js'

const testObject = {
  foo : 'bar',
  baz : {
    a : 'x',
    b : 'y',
  },
}

test('assoc lens', () => {
  const assocLens = lens(prop('foo'), assoc('foo'))
  const result = over(
    assocLens, toUpper, testObject
  )
  const expected = {
    ...testObject,
    foo : 'BAR',
  }
  expect(result).toEqual(expected)
})

test('path lens', () => {
  const pathLens = lensPath('baz.a')
  const result = over(
    pathLens, toUpper, testObject
  )
  const expected = {
    ...testObject,
    baz : {
      a : 'X',
      b : 'y',
    },
  }
  expect(result).toEqual(expected)
})

test('index lens', () => {
  const indexLens = lensIndex(0)
  const result = over(indexLens, toUpper)([ 'foo', 'bar' ])
  expect(result).toEqual([ 'FOO', 'bar' ])
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#over)

### partial

```typescript

partial<V0, V1, T>(fn: (x0: V0, x1: V1) => T, args: [V0]): (x1: V1) => T
```

It is very similar to `R.curry`, but you can pass initial arguments when you create the curried function.

`R.partial` will keep returning a function until all the arguments that the function `fn` expects are passed.
The name comes from the fact that you partially inject the inputs.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20(title%2C%20firstName%2C%20lastName)%20%3D%3E%20%7B%0A%20%20return%20title%20%2B%20'%20'%20%2B%20firstName%20%2B%20'%20'%20%2B%20lastName%20%2B%20'!'%0A%7D%0A%0Aconst%20canPassAnyNumberOfArguments%20%3D%20R.partial(fn%2C%20'Hello')%0Aconst%20ramdaStyle%20%3D%20R.partial(fn%2C%20%5B'Hello'%5D)%0A%0Aconst%20finalFn%20%3D%20canPassAnyNumberOfArguments('Foo')%0A%0Aconst%20result%20%3D%20finalFn('Bar')%20%2F%2F%20%3D%3E%20%20'Hello%2C%20Foo%20Bar!'">Try this <strong>R.partial</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
partial<V0, V1, T>(fn: (x0: V0, x1: V1) => T, args: [V0]): (x1: V1) => T;
partial<V0, V1, V2, T>(fn: (x0: V0, x1: V1, x2: V2) => T, args: [V0, V1]): (x2: V2) => T;
partial<V0, V1, V2, T>(fn: (x0: V0, x1: V1, x2: V2) => T, args: [V0]): (x1: V1, x2: V2) => T;
partial<V0, V1, V2, V3, T>(
  fn: (x0: V0, x1: V1, x2: V2, x3: V3) => T,
  args: [V0, V1, V2],
): (x2: V3) => T;
partial<V0, V1, V2, V3, T>(
  fn: (x0: V0, x1: V1, x2: V2, x3: V3) => T,
  args: [V0, V1],
): (x2: V2, x3: V3) => T;
partial<V0, V1, V2, V3, T>(
  fn: (x0: V0, x1: V1, x2: V2, x3: V3) => T,
  args: [V0],
): (x1: V1, x2: V2, x3: V3) => T;
partial<T>(fn: (...a: any[]) => T, args: any[]): (...a: any[]) => T;
```

</details>

<details>

<summary><strong>R.partial</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'

export function partial(fn, ...args){
  const len = fn.length

  // If a single array argument is given, those are the args (a la Ramda).
  // Otherwise, the variadic arguments are the args.
  const argList = args.length === 1 && isArray(args[0]) ? args[0] : args

  return (...rest) => {
    if (argList.length + rest.length >= len){
      return fn(...argList, ...rest)
    }

    return partial(fn, ...[ ...argList, ...rest ])
  }
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { partial } from './partial.js'
import { type } from './type.js'

const greet = (
  salutation, title, firstName, lastName
) =>
  [salutation, title, firstName, lastName]

test('happy', () => {
  const canPassAnyNumberOfArguments = partial(
    greet, 'Hello', 'Ms.'
  )
  const fn = canPassAnyNumberOfArguments('foo')
  const sayHello = partial(greet, [ 'Hello' ])
  const sayHelloRamda = partial(sayHello, [ 'Ms.' ])

  expect(type(fn)).toBe('Function')

  expect(fn('bar')).toStrictEqual(['Hello', 'Ms.', 'foo', 'bar'])
  expect(sayHelloRamda('foo', 'bar')).toStrictEqual(['Hello', 'Ms.', 'foo', 'bar'])
})

test('extra arguments are ignored', () => {
  const canPassAnyNumberOfArguments = partial(
    greet, 'Hello', 'Ms.'
  )
  const fn = canPassAnyNumberOfArguments('foo')

  expect(type(fn)).toBe('Function')

  expect(fn(
    'bar', 1, 2
  )).toStrictEqual(['Hello', 'Ms.', 'foo', 'bar'])
})

test('when array is input', () => {
  const fooFn = (
    a, b, c, d
  ) => ({
    a,
    b,
    c,
    d,
  })
  const barFn = partial(
    fooFn, [ 1, 2 ], []
  )

  expect(barFn(1, 2)).toEqual({
    a : [ 1, 2 ],
    b : [],
    c : 1,
    d : 2,
  })
})

test('ramda spec', () => {
  const sayHello = partial(greet, 'Hello')
  const sayHelloToMs = partial(sayHello, 'Ms.')

  expect(sayHelloToMs('Jane', 'Jones')).toStrictEqual(['Hello', 'Ms.', 'Jane', 'Jones'])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {partial} from 'rambda'

describe('R.partial', () => {
  it('happy', () => {
    function fn(
      aString: string,
      aNumber: number,
      aBoolean: boolean,
      aNull: null
    ) {
      return {aString, aNumber, aBoolean, aNull}
    }

    // @ts-expect-error
    partial(fn, 1)

    const fn1 = partial(fn, ['a'])
    partial(fn1, ['b'])

    const fn2 = partial(fn1, [2])
    const result = fn2(true, null)
    result // $ExpectType { aString: string; aNumber: number; aBoolean: boolean; aNull: null; }
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#partial)

### partialObject

```typescript

partialObject<Input, PartialInput, Output>(
  fn: (input: Input) => Output, 
  partialInput: PartialInput,
): (input: Pick<Input, Exclude<keyof Input, keyof PartialInput>>) => Output
```

`R.partialObject` is a curry helper designed specifically for functions accepting object as a single argument.

Initially the function knows only a part from the whole input object and then `R.partialObject` helps in preparing the function for the second part, when it receives the rest of the input.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20(%7B%20a%2C%20b%2C%20c%20%7D)%20%3D%3E%20a%20%2B%20b%20%2B%20c%0Aconst%20curried%20%3D%20R.partialObject(fn%2C%20%7B%20a%20%3A%201%20%7D)%0Aconst%20result%20%3D%20curried(%7B%0A%20%20b%20%3A%202%2C%0A%20%20c%20%3A%203%2C%0A%7D)%0A%2F%2F%20%3D%3E%206">Try this <strong>R.partialObject</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
partialObject<Input, PartialInput, Output>(
  fn: (input: Input) => Output, 
  partialInput: PartialInput,
): (input: Pick<Input, Exclude<keyof Input, keyof PartialInput>>) => Output;
```

</details>

<details>

<summary><strong>R.partialObject</strong> source</summary>

```javascript
import { mergeDeepRight } from './mergeDeepRight.js'

export function partialObject(fn, input){
  return nextInput => fn(mergeDeepRight(nextInput, input))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { delay } from './delay.js'
import { partialObject } from './partialObject.js'
import { type } from './type.js'

test('with plain function', () => {
  const fn = ({ a, b, c }) => a + b + c
  const curried = partialObject(fn, { a : 1 })

  expect(type(curried)).toBe('Function')
  expect(curried({
    b : 2,
    c : 3,
  })).toBe(6)
})

test('with function that throws an error', () => {
  const fn = ({ a, b, c }) => {
    throw new Error('foo')
  }
  const curried = partialObject(fn, { a : 1 })

  expect(type(curried)).toBe('Function')
  expect(() =>
    curried({
      b : 2,
      c : 3,
    })).toThrowErrorMatchingInlineSnapshot('"foo"')
})

test('with async', async () => {
  const fn = async ({ a, b, c }) => {
    await delay(100)

    return a + b + c
  }

  const curried = partialObject(fn, { a : 1 })

  const result = await curried({
    b : 2,
    c : 3,
  })

  expect(result).toBe(6)
})

test('async function throwing an error', async () => {
  const fn = async ({ a, b, c }) => {
    await delay(100)
    throw new Error('foo')
  }

  const curried = partialObject(fn, { a : 1 })

  try {
    await curried({
      b : 2,
      c : 3,
    })
    expect(true).toBeFalsy()
  } catch (e){
    expect(e.message).toBe('foo')
  }
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {partialObject, delay} from 'rambda'

describe('R.partialObject', () => {
  it('happy', () => {
    interface Input {
      a: number,
      b: number,
      c: string,
    }
    const fn = ({a, b, c}: Input) => a + b + c
    const curried = partialObject(fn, {a: 1})
    const result = curried({
      b: 2,
      c: 'foo',
    })
    result // $ExpectType string
  })
  it('asynchronous', async() => {
    interface Input {
      a: number,
      b: number,
      c: string,
    }
    const fn = async({a, b, c}: Input) => {
      await delay(100)
      return a + b + c
    }
    const curried = partialObject(fn, {a: 1})
    const result = await curried({
      b: 2,
      c: 'foo',
    })
    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#partialObject)

### partition

```typescript

partition<T>(
  predicate: Predicate<T>,
  input: T[]
): [T[], T[]]
```

It will return array of two objects/arrays according to `predicate` function. The first member holds all instances of `input` that pass the `predicate` function, while the second member - those who doesn't.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%5D%0Aconst%20obj%20%3D%20%7Ba%3A%201%2C%20b%3A%202%2C%20c%3A%203%7D%0Aconst%20predicate%20%3D%20x%20%3D%3E%20x%20%3E%202%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.partition(predicate%2C%20list)%2C%0A%20%20R.partition(predicate%2C%20Record%3Cstring%2C%20unknown%3E)%0A%5D%0Aconst%20expected%20%3D%20%5B%0A%20%20%5B%5B3%5D%2C%20%5B1%2C%202%5D%5D%2C%0A%20%20%5B%7Bc%3A%203%7D%2C%20%20%7Ba%3A%201%2C%20b%3A%202%7D%5D%2C%0A%5D%0A%2F%2F%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.partition</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
partition<T>(
  predicate: Predicate<T>,
  input: T[]
): [T[], T[]];
partition<T>(
  predicate: Predicate<T>
): (input: T[]) => [T[], T[]];
partition<T>(
  predicate: (x: T, prop?: string) => boolean,
  input: { [key: string]: T}
): [{ [key: string]: T}, { [key: string]: T}];
partition<T>(
  predicate: (x: T, prop?: string) => boolean
): (input: { [key: string]: T}) => [{ [key: string]: T}, { [key: string]: T}];
```

</details>

<details>

<summary><strong>R.partition</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'

export function partitionObject(predicate, iterable){
  const yes = {}
  const no = {}
  Object.entries(iterable).forEach(([ prop, value ]) => {
    if (predicate(value, prop)){
      yes[ prop ] = value
    } else {
      no[ prop ] = value
    }
  })

  return [ yes, no ]
}

export function partitionArray(
  predicate, list, indexed = false
){
  const yes = []
  const no = []
  let counter = -1

  while (counter++ < list.length - 1){
    if (
      indexed ? predicate(list[ counter ], counter) : predicate(list[ counter ])
    ){
      yes.push(list[ counter ])
    } else {
      no.push(list[ counter ])
    }
  }

  return [ yes, no ]
}

export function partition(predicate, iterable){
  if (arguments.length === 1){
    return listHolder => partition(predicate, listHolder)
  }
  if (!isArray(iterable)) return partitionObject(predicate, iterable)

  return partitionArray(predicate, iterable)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { partition } from './partition.js'

test('with array', () => {
  const predicate = x => x > 2
  const list = [ 1, 2, 3, 4 ]

  const result = partition(predicate, list)
  const expectedResult = [
    [ 3, 4 ],
    [ 1, 2 ],
  ]

  expect(result).toEqual(expectedResult)
})

test('with object', () => {
  const predicate = (value, prop) => {
    expect(typeof prop).toBe('string')

    return value > 2
  }
  const hash = {
    a : 1,
    b : 2,
    c : 3,
    d : 4,
  }

  const result = partition(predicate)(hash)
  const expectedResult = [
    {
      c : 3,
      d : 4,
    },
    {
      a : 1,
      b : 2,
    },
  ]

  expect(result).toEqual(expectedResult)
})

test('readme example', () => {
  const list = [ 1, 2, 3 ]
  const obj = {
    a : 1,
    b : 2,
    c : 3,
  }
  const predicate = x => x > 2

  const result = [ partition(predicate, list), partition(predicate, obj) ]
  const expected = [
    [ [ 3 ], [ 1, 2 ] ],
    [
      { c : 3 },
      {
        a : 1,
        b : 2,
      },
    ],
  ]
  expect(result).toEqual(expected)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {partition} from 'rambda'

describe('R.partition', () => {
  it('with array', () => {
    const predicate = (x: number) => {
      return x > 2
    }
    const list = [1, 2, 3, 4]

    const result = partition(predicate, list)
    const curriedResult = partition(predicate)(list)
    result // $ExpectType [number[], number[]]
    curriedResult // $ExpectType [number[], number[]]
  })

  /*
    revert to old version of `dtslint` and `R.partition` typing
    as there is diff between VSCode types(correct) and dtslint(incorrect)
    
    it('with object', () => {
      const predicate = (value: number, prop?: string) => {
        return value > 2
      }
      const hash = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      }
  
      const result = partition(predicate, hash)
      const curriedResult = partition(predicate)(hash)
      result[0] // $xExpectType { [key: string]: number; }
      result[1] // $xExpectType { [key: string]: number; }
      curriedResult[0] // $xExpectType { [key: string]: number; }
      curriedResult[1] // $xExpectType { [key: string]: number; }
    })
    */
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#partition)

### path

```typescript

path<S, K0 extends keyof S = keyof S>(path: [K0], obj: S): S[K0]
```

If `pathToSearch` is `'a.b'` then it will return `1` if `obj` is `{a:{b:1}}`.

It will return `undefined`, if such path is not found.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7Ba%3A%20%7Bb%3A%201%7D%7D%0Aconst%20pathToSearch%20%3D%20'a.b'%0Aconst%20pathToSearchList%20%3D%20%5B'a'%2C%20'b'%5D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.path(pathToSearch%2C%20obj)%2C%0A%20%20R.path(pathToSearchList%2C%20obj)%2C%0A%20%20R.path('a.b.c.d'%2C%20obj)%0A%5D%0A%2F%2F%20%3D%3E%20%5B1%2C%201%2C%20undefined%5D">Try this <strong>R.path</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
path<S, K0 extends keyof S = keyof S>(path: [K0], obj: S): S[K0];
path<S, K0 extends keyof S = keyof S, K1 extends keyof S[K0] = keyof S[K0]>(path: [K0, K1], obj: S): S[K0][K1];
path<
    S,
    K0 extends keyof S = keyof S,
    K1 extends keyof S[K0] = keyof S[K0],
    K2 extends keyof S[K0][K1] = keyof S[K0][K1]
>(path: [K0, K1, K2], obj: S): S[K0][K1][K2];
path<
    S,
    K0 extends keyof S = keyof S,
    K1 extends keyof S[K0] = keyof S[K0],
    K2 extends keyof S[K0][K1] = keyof S[K0][K1],
    K3 extends keyof S[K0][K1][K2] = keyof S[K0][K1][K2],
>(path: [K0, K1, K2, K3], obj: S): S[K0][K1][K2][K3];
path<
    S,
    K0 extends keyof S = keyof S,
    K1 extends keyof S[K0] = keyof S[K0],
    K2 extends keyof S[K0][K1] = keyof S[K0][K1],
    K3 extends keyof S[K0][K1][K2] = keyof S[K0][K1][K2],
    K4 extends keyof S[K0][K1][K2][K3] = keyof S[K0][K1][K2][K3],
>(path: [K0, K1, K2, K3, K4], obj: S): S[K0][K1][K2][K3][K4];
path<
    S,
    K0 extends keyof S = keyof S,
    K1 extends keyof S[K0] = keyof S[K0],
    K2 extends keyof S[K0][K1] = keyof S[K0][K1],
    K3 extends keyof S[K0][K1][K2] = keyof S[K0][K1][K2],
    K4 extends keyof S[K0][K1][K2][K3] = keyof S[K0][K1][K2][K3],
    K5 extends keyof S[K0][K1][K2][K3][K4] = keyof S[K0][K1][K2][K3][K4],
>(path: [K0, K1, K2, K3, K4, K5], obj: S): S[K0][K1][K2][K3][K4][K5];
path<T>(pathToSearch: string, obj: any): T | undefined;
path<T>(pathToSearch: string): (obj: any) => T | undefined;
path<T>(pathToSearch: RamdaPath): (obj: any) => T | undefined;
path<T>(pathToSearch: RamdaPath, obj: any): T | undefined;
```

</details>

<details>

<summary><strong>R.path</strong> source</summary>

```javascript
import { createPath } from './_internals/createPath.js'

export function pathFn(pathInput, obj){
  let willReturn = obj
  let counter = 0

  const pathArrValue = createPath(pathInput)

  while (counter < pathArrValue.length){
    if (willReturn === null || willReturn === undefined){
      return undefined
    }
    if (willReturn[ pathArrValue[ counter ] ] === null) return undefined

    willReturn = willReturn[ pathArrValue[ counter ] ]
    counter++
  }

  return willReturn
}

export function path(pathInput, obj){
  if (arguments.length === 1) return _obj => path(pathInput, _obj)

  if (obj === null || obj === undefined){
    return undefined
  }

  return pathFn(pathInput, obj)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { path } from './path.js'

test('with array inside object', () => {
  const obj = { a : { b : [ 1, { c : 1 } ] } }

  expect(path('a.b.1.c', obj)).toBe(1)
})

test('works with undefined', () => {
  const obj = { a : { b : { c : 1 } } }

  expect(path('a.b.c.d.f', obj)).toBeUndefined()
  expect(path('foo.babaz', undefined)).toBeUndefined()
  expect(path('foo.babaz')(undefined)).toBeUndefined()
})

test('works with string instead of array', () => {
  expect(path('foo.bar.baz')({ foo : { bar : { baz : 'yes' } } })).toBe('yes')
})

test('path', () => {
  expect(path([ 'foo', 'bar', 'baz' ])({ foo : { bar : { baz : 'yes' } } })).toBe('yes')
  expect(path([ 'foo', 'bar', 'baz' ])(null)).toBeUndefined()
  expect(path([ 'foo', 'bar', 'baz' ])({ foo : { bar : 'baz' } })).toBeUndefined()
})

test('with number string in between', () => {
	expect(path(['a','1','b'], {a: [{b: 1}, {b: 2}]})).toBe(2)
})

test('null is not a valid path', () => {
  expect(path('audio_tracks', {
    a            : 1,
    audio_tracks : null,
  })).toBeUndefined()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {path} from 'rambda'

const input = {a: {b: {c: true}}}

describe('R.path with string as path', () => {
  it('without specified output type', () => {
    // $ExpectType unknown
    path('a.b.c', input)
    // $ExpectType unknown
    path('a.b.c')(input)
  })
  it('with specified output type', () => {
    // $ExpectType boolean | undefined
    path<boolean>('a.b.c', input)
    // $ExpectType boolean | undefined
    path<boolean>('a.b.c')(input)
  })
})

describe('R.path with list as path', () => {
  it('with array as path', () => {
    // $ExpectType boolean
    path(['a', 'b', 'c'], input)
    // $ExpectType unknown
    path(['a', 'b', 'c'])(input)
  })
  test('shallow property', () => {
    // $ExpectType number
    path(['a'], {a: 1})

    // $ExpectType unknown
    path(['b'], {a: 1})
  })
  test('deep property', () => {
    const testObject = {a: {b: {c: {d: {e: {f: 1}}}}}}
    const result = path(['a', 'b', 'c', 'd', 'e', 'f'], testObject)
    // $ExpectType number
    result
    const curriedResult = path(['a', 'b', 'c', 'd', 'e', 'f'])(testObject)
    // $ExpectType unknown
    curriedResult
  })
  test('issue #668 - path is not correct', () => {
    const object = {
      is: {
        a: 'path',
      },
    }
    const result = path(['is', 'not', 'a'], object)
    // $ExpectType unknown
    result
    const curriedResult = path(['is', 'not', 'a'])(object)
    // $ExpectType unknown
    curriedResult
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#path)

### pathEq

```typescript

pathEq(pathToSearch: Path, target: any, input: any): boolean
```

It returns `true` if `pathToSearch` of `input` object is equal to `target` value.

`pathToSearch` is passed to `R.path`, which means that it can be either a string or an array. Also equality between `target` and the found value is determined by `R.equals`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20path%20%3D%20'a.b'%0Aconst%20target%20%3D%20%7Bc%3A%201%7D%0Aconst%20input%20%3D%20%7Ba%3A%20%7Bb%3A%20%7Bc%3A%201%7D%7D%7D%0A%0Aconst%20result%20%3D%20R.pathEq(%0A%20%20path%2C%0A%20%20target%2C%0A%20%20input%0A)%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.pathEq</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
pathEq(pathToSearch: Path, target: any, input: any): boolean;
pathEq(pathToSearch: Path, target: any): (input: any) => boolean;
pathEq(pathToSearch: Path): (target: any) => (input: any) => boolean;
```

</details>

<details>

<summary><strong>R.pathEq</strong> source</summary>

```javascript
import { curry } from './curry.js'
import { equals } from './equals.js'
import { path } from './path.js'

function pathEqFn(
  pathToSearch, target, input
){
  return equals(path(pathToSearch, input), target)
}

export const pathEq = curry(pathEqFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { pathEq } from './pathEq.js'

test('when true', () => {
  const path = 'a.b'
  const obj = { a : { b : { c : 1 } } }
  const target = { c : 1 }

  expect(pathEq(
    path, target, obj
  )).toBeTrue()
})

test('when false', () => {
  const path = 'a.b'
  const obj = { a : { b : 1 } }
  const target = 2

  expect(pathEq(path, target)(obj)).toBeFalse()
})

test('when wrong path', () => {
  const path = 'foo.bar'
  const obj = { a : { b : 1 } }
  const target = 2

  expect(pathEq(
    path, target, obj
  )).toBeFalse()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {pathEq} from 'rambda'

describe('R.pathEq', () => {
  it('with string path', () => {
    const pathToSearch = 'a.b.c'
    const input = {a: {b: {c: 1}}}
    const target = {c: 1}

    const result = pathEq(pathToSearch, input, target)
    const curriedResult = pathEq(pathToSearch, input, target)
    result // $ExpectType boolean
    curriedResult // $ExpectType boolean
  })

  it('with array path', () => {
    const pathToSearch = ['a', 'b', 'c']
    const input = {a: {b: {c: 1}}}
    const target = {c: 1}

    const result = pathEq(pathToSearch, input, target)
    const curriedResult = pathEq(pathToSearch, input, target)
    result // $ExpectType boolean
    curriedResult // $ExpectType boolean
  })
})

describe('with ramda specs', () => {
  const testPath = ['x', 0, 'y']
  const testObj = {
    x: [
      {y: 2, z: 3},
      {y: 4, z: 5},
    ],
  }

  const result1 = pathEq(testPath, 2, testObj)
  const result2 = pathEq(testPath, 2)(testObj)
  const result3 = pathEq(testPath)(2)(testObj)
  result1 // $ExpectType boolean
  result2 // $ExpectType boolean
  result3 // $ExpectType boolean
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#pathEq)

### pathOr

```typescript

pathOr<T>(defaultValue: T, pathToSearch: Path, obj: any): T
```

It reads `obj` input and returns either `R.path(pathToSearch, Record<string, unknown>)` result or `defaultValue` input.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20defaultValue%20%3D%20'DEFAULT_VALUE'%0Aconst%20pathToSearch%20%3D%20'a.b'%0Aconst%20pathToSearchList%20%3D%20%5B'a'%2C%20'b'%5D%0A%0Aconst%20obj%20%3D%20%7B%0A%20%20a%20%3A%20%7B%0A%20%20%20%20b%20%3A%201%0A%20%20%7D%0A%7D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.pathOr(DEFAULT_VALUE%2C%20pathToSearch%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.pathOr(DEFAULT_VALUE%2C%20pathToSearchList%2C%20Record%3Cstring%2C%20unknown%3E)%2C%20%0A%20%20R.pathOr(DEFAULT_VALUE%2C%20'a.b.c'%2C%20Record%3Cstring%2C%20unknown%3E)%0A%5D%0A%2F%2F%20%3D%3E%20%5B1%2C%201%2C%20'DEFAULT_VALUE'%5D">Try this <strong>R.pathOr</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
pathOr<T>(defaultValue: T, pathToSearch: Path, obj: any): T;
pathOr<T>(defaultValue: T, pathToSearch: Path): (obj: any) => T;
pathOr<T>(defaultValue: T): (pathToSearch: Path) => (obj: any) => T;
```

</details>

<details>

<summary><strong>R.pathOr</strong> source</summary>

```javascript
import { curry } from './curry.js'
import { defaultTo } from './defaultTo.js'
import { path } from './path.js'

function pathOrFn(
  defaultValue, pathInput, obj
){
  return defaultTo(defaultValue, path(pathInput, obj))
}

export const pathOr = curry(pathOrFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { pathOr } from './pathOr.js'

test('with undefined', () => {
  const result = pathOr(
    'foo', 'x.y', { x : { y : 1 } }
  )

  expect(result).toBe(1)
})

test('with null', () => {
  const result = pathOr(
    'foo', 'x.y', null
  )

  expect(result).toBe('foo')
})

test('with NaN', () => {
  const result = pathOr(
    'foo', 'x.y', NaN
  )

  expect(result).toBe('foo')
})

test('curry case (x)(y)(z)', () => {
  const result = pathOr('foo')('x.y.z')({ x : { y : { a : 1 } } })

  expect(result).toBe('foo')
})

test('curry case (x)(y,z)', () => {
  const result = pathOr('foo', 'x.y.z')({ x : { y : { a : 1 } } })

  expect(result).toBe('foo')
})

test('curry case (x,y)(z)', () => {
  const result = pathOr('foo')('x.y.z', { x : { y : { a : 1 } } })

  expect(result).toBe('foo')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {pathOr} from 'rambda'

describe('R.pathOr', () => {
  it('with string path', () => {
    const x = pathOr<string>('foo', 'x.y', {x: {y: 'bar'}})
    x // $ExpectType string
  })
  it('with array path', () => {
    const x = pathOr<string>('foo', ['x', 'y'], {x: {y: 'bar'}})
    x // $ExpectType string
  })
  it('without passing type looks bad', () => {
    const x = pathOr('foo', 'x.y', {x: {y: 'bar'}})
    x // $ExpectType "foo"
  })
  it('curried', () => {
    const x = pathOr<string>('foo', 'x.y')({x: {y: 'bar'}})
    x // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#pathOr)

### paths

```typescript

paths<Input, T>(pathsToSearch: Path[], obj: Input): (T | undefined)[]
```

It loops over members of `pathsToSearch` as `singlePath` and returns the array produced by `R.path(singlePath, Record<string, unknown>)`.

Because it calls `R.path`, then `singlePath` can be either string or a list.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7B%0A%20%20a%20%3A%20%7B%0A%20%20%20%20b%20%3A%20%7B%0A%20%20%20%20%20%20c%20%3A%201%2C%0A%20%20%20%20%20%20d%20%3A%202%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0Aconst%20result%20%3D%20R.paths(%5B%0A%20%20'a.b.c'%2C%0A%20%20'a.b.d'%2C%0A%20%20'a.b.c.d.e'%2C%0A%5D%2C%20Record%3Cstring%2C%20unknown%3E)%0A%2F%2F%20%3D%3E%20%5B1%2C%202%2C%20undefined%5D">Try this <strong>R.paths</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
paths<Input, T>(pathsToSearch: Path[], obj: Input): (T | undefined)[];
paths<Input, T>(pathsToSearch: Path[]): (obj: Input) => (T | undefined)[];
paths<T>(pathsToSearch: Path[], obj: any): (T | undefined)[];
paths<T>(pathsToSearch: Path[]): (obj: any) => (T | undefined)[];
```

</details>

<details>

<summary><strong>R.paths</strong> source</summary>

```javascript
import { path } from './path.js'

export function paths(pathsToSearch, obj){
  if (arguments.length === 1){
    return _obj => paths(pathsToSearch, _obj)
  }

  return pathsToSearch.map(singlePath => path(singlePath, obj))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { paths } from './paths.js'

const obj = {
  a : {
    b : {
      c : 1,
      d : 2,
    },
  },
  p : [ { q : 3 } ],
  x : {
    y : 'FOO',
    z : [ [ {} ] ],
  },
}

test('with string path + curry', () => {
  const pathsInput = [ 'a.b.d', 'p.q' ]
  const expected = [ 2, undefined ]
  const result = paths(pathsInput, obj)
  const curriedResult = paths(pathsInput)(obj)

  expect(result).toEqual(expected)
  expect(curriedResult).toEqual(expected)
})

test('with array path', () => {
  const result = paths([
    [ 'a', 'b', 'c' ],
    [ 'x', 'y' ],
  ],
  obj)

  expect(result).toEqual([ 1, 'FOO' ])
})

test('takes a paths that contains indices into arrays', () => {
  expect(paths([
    [ 'p', 0, 'q' ],
    [ 'x', 'z', 0, 0 ],
  ],
  obj)).toEqual([ 3, {} ])
  expect(paths([
    [ 'p', 0, 'q' ],
    [ 'x', 'z', 2, 1 ],
  ],
  obj)).toEqual([ 3, undefined ])
})

test('gets a deep property\'s value from objects', () => {
  expect(paths([ [ 'a', 'b' ] ], obj)).toEqual([ obj.a.b ])
  expect(paths([ [ 'p', 0 ] ], obj)).toEqual([ obj.p[ 0 ] ])
})

test('returns undefined for items not found', () => {
  expect(paths([ [ 'a', 'x', 'y' ] ], obj)).toEqual([ undefined ])
  expect(paths([ [ 'p', 2 ] ], obj)).toEqual([ undefined ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {paths} from 'rambda'

interface Input {
  a: number,
  b: number,
  c: number,
}

const input: Input = {a: 1, b: 2, c: 3}

describe('R.paths', () => {
  it('with dot notation', () => {
    const result = paths<number>(['a.b.c', 'foo.bar'], input)
    result // $ExpectType (number | undefined)[]
  })

  it('without type', () => {
    const result = paths(['a.b.c', 'foo.bar'], input)
    result // $ExpectType unknown[]
  })

  it('with array as path', () => {
    const result = paths<number>([['a', 'b', 'c'], ['foo.bar']], input)
    result // $ExpectType (number | undefined)[]
  })

  it('curried', () => {
    const result = paths<number>([['a', 'b', 'c'], ['foo.bar']])(input)
    result // $ExpectType (number | undefined)[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#paths)

### pathSatisfies

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.pathSatisfies(%0A%20%20x%20%3D%3E%20x%20%3E%200%2C%0A%20%20%5B'a'%2C%20'b'%2C%20'c'%5D%2C%0A%20%20%7Ba%3A%20%7Bb%3A%20%7Bc%3A%201%7D%7D%7D%0A)%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.pathSatisfies</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#pathSatisfies)

### pick

```typescript

pick<T, K extends string | number | symbol>(propsToPick: K[], input: T): Pick<T, Exclude<keyof T, Exclude<keyof T, K>>>
```

It returns a partial copy of an `input` containing only `propsToPick` properties.

`input` can be either an object or an array.

String annotation of `propsToPick` is one of the differences between `Rambda` and `Ramda`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7B%0A%20%20a%20%3A%201%2C%0A%20%20b%20%3A%20false%2C%0A%20%20foo%3A%20'cherry'%0A%7D%0Aconst%20list%20%3D%20%5B1%2C%202%2C%203%2C%204%5D%0Aconst%20propsToPick%20%3D%20'a%2Cfoo'%0Aconst%20propsToPickList%20%3D%20%5B'a'%2C%20'foo'%5D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.pick(propsToPick%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.pick(propsToPickList%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.pick('a%2Cbar'%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.pick('bar'%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.pick(%5B0%2C%203%2C%205%5D%2C%20list)%2C%0A%20%20R.pick('0%2C3%2C5'%2C%20list)%2C%0A%5D%0A%0Aconst%20expected%20%3D%20%5B%0A%20%20%7Ba%3A1%2C%20foo%3A%20'cherry'%7D%2C%0A%20%20%7Ba%3A1%2C%20foo%3A%20'cherry'%7D%2C%0A%20%20%7Ba%3A1%7D%2C%0A%20%20%7B%7D%2C%0A%20%20%7B0%3A%201%2C%203%3A%204%7D%2C%0A%20%20%7B0%3A%201%2C%203%3A%204%7D%2C%0A%5D%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.pick</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
pick<T, K extends string | number | symbol>(propsToPick: K[], input: T): Pick<T, Exclude<keyof T, Exclude<keyof T, K>>>;
pick<K extends string | number | symbol>(propsToPick: K[]): <T>(input: T) => Pick<T, Exclude<keyof T, Exclude<keyof T, K>>>;
pick<T, U>(propsToPick: string, input: T): U;
pick<T, U>(propsToPick: string): (input: T) => U;
pick<T>(propsToPick: string, input: object): T;
pick<T>(propsToPick: string): (input: object) => T;
```

</details>

<details>

<summary><strong>R.pick</strong> source</summary>

```javascript
import { createPath } from './_internals/createPath.js'

export function pick(propsToPick, input){
  if (arguments.length === 1) return _input => pick(propsToPick, _input)

  if (input === null || input === undefined){
    return undefined
  }
  const keys = createPath(propsToPick, ',')
  const willReturn = {}
  let counter = 0

  while (counter < keys.length){
    if (keys[ counter ] in input){
      willReturn[ keys[ counter ] ] = input[ keys[ counter ] ]
    }
    counter++
  }

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { pick } from './pick.js'

const obj = {
  a : 1,
  b : 2,
  c : 3,
}

test('props to pick is a string', () => {
  const result = pick('a,c', obj)
  const resultCurry = pick('a,c')(obj)
  const expectedResult = {
    a : 1,
    c : 3,
  }

  expect(result).toEqual(expectedResult)
  expect(resultCurry).toEqual(expectedResult)
})

test('when prop is missing', () => {
  const result = pick('a,d,f', obj)
  expect(result).toEqual({ a : 1 })
})

test('with list indexes as props', () => {
  const list = [ 1, 2, 3 ]
  const expected = {
    0 : 1,
    2 : 3,
  }
  expect(pick([ 0, 2, 3 ], list)).toEqual(expected)
  expect(pick('0,2,3', list)).toEqual(expected)
})

test('props to pick is an array', () => {
  expect(pick([ 'a', 'c' ])({
    a : 'foo',
    b : 'bar',
    c : 'baz',
  })).toEqual({
    a : 'foo',
    c : 'baz',
  })

  expect(pick([ 'a', 'd', 'e', 'f' ])({
    a : 'foo',
    b : 'bar',
    c : 'baz',
  })).toEqual({ a : 'foo' })

  expect(pick('a,d,e,f')(null)).toBeUndefined()
})

test('works with list as input and number as props - props to pick is an array', () => {
  const result = pick([ 1, 2 ], [ 'a', 'b', 'c', 'd' ])
  expect(result).toEqual({
    1 : 'b',
    2 : 'c',
  })
})

test('works with list as input and number as props - props to pick is a string', () => {
  const result = pick('1,2', [ 'a', 'b', 'c', 'd' ])
  expect(result).toEqual({
    1 : 'b',
    2 : 'c',
  })
})

test('with symbol', () => {
  const symbolProp = Symbol('s')
  expect(pick([ symbolProp ], { [ symbolProp ] : 'a' })).toMatchInlineSnapshot(`
{
  Symbol(s): "a",
}
`)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {pick} from 'rambda'

const input = {a: 'foo', b: 2, c: 3, d: 4}

describe('R.pick with array as props input', () => {
  it('without passing type', () => {
    const result = pick(['a', 'c'], input)
    result.a // $ExpectType string
    result.c // $ExpectType number
  })
})

describe('R.pick with string as props input', () => {
  interface Input {
    a: string,
    b: number,
    c: number,
    d: number,
  }
  interface Output {
    a: string,
    c: number,
  }
  it('explicitly declare output', () => {
    const result = pick<Output>('a,c', input)
    result // $ExpectType Output
    result.a // $ExpectType string
    result.c // $ExpectType number

    const curriedResult = pick<Output>('a,c')(input)

    curriedResult.a // $ExpectType string
  })

  it('explicitly declare input and output', () => {
    const result = pick<Input, Output>('a,c', input)
    result // $ExpectType Output
    result.a // $ExpectType string

    const curriedResult = pick<Input, Output>('a,c')(input)

    curriedResult.a // $ExpectType string
  })

  it('without passing type', () => {
    const result = pick('a,c', input)
    result // $ExpectType unknown
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#pick)

### pickAll

```typescript

pickAll<T, K extends keyof T>(propsToPicks: K[], input: T): Pick<T, K>
```

Same as `R.pick` but it won't skip the missing props, i.e. it will assign them to `undefined`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7B%0A%20%20a%20%3A%201%2C%0A%20%20b%20%3A%20false%2C%0A%20%20foo%3A%20'cherry'%0A%7D%0Aconst%20propsToPick%20%3D%20'a%2Cfoo%2Cbar'%0Aconst%20propsToPickList%20%3D%20%5B'a'%2C%20'foo'%2C%20'bar'%5D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.pickAll(propsToPick%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.pickAll(propsToPickList%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.pickAll('a%2Cbar'%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.pickAll('bar'%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%5D%0Aconst%20expected%20%3D%20%5B%0A%20%20%7Ba%3A1%2C%20foo%3A%20'cherry'%2C%20bar%3A%20undefined%7D%2C%0A%20%20%7Ba%3A1%2C%20foo%3A%20'cherry'%2C%20bar%3A%20undefined%7D%2C%0A%20%20%7Ba%3A1%2C%20bar%3A%20undefined%7D%2C%0A%20%20%7Bbar%3A%20undefined%7D%0A%5D%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.pickAll</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
pickAll<T, K extends keyof T>(propsToPicks: K[], input: T): Pick<T, K>;
pickAll<T, U>(propsToPicks: string[], input: T): U;
pickAll(propsToPicks: string[]): <T, U>(input: T) => U;
pickAll<T, U>(propsToPick: string, input: T): U;
pickAll<T, U>(propsToPick: string): (input: T) => U;
```

</details>

<details>

<summary><strong>R.pickAll</strong> source</summary>

```javascript
import { createPath } from './_internals/createPath.js'

export function pickAll(propsToPick, obj){
  if (arguments.length === 1) return _obj => pickAll(propsToPick, _obj)

  if (obj === null || obj === undefined){
    return undefined
  }
  const keysValue = createPath(propsToPick, ',')
  const willReturn = {}
  let counter = 0

  while (counter < keysValue.length){
    if (keysValue[ counter ] in obj){
      willReturn[ keysValue[ counter ] ] = obj[ keysValue[ counter ] ]
    } else {
      willReturn[ keysValue[ counter ] ] = undefined
    }
    counter++
  }

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { pickAll } from './pickAll.js'

test('when input is undefined or null', () => {
  expect(pickAll('a', null)).toBeUndefined()
  expect(pickAll('a', undefined)).toBeUndefined()
})

test('with string as condition', () => {
  const obj = {
    a : 1,
    b : 2,
    c : 3,
  }
  const result = pickAll('a,c', obj)
  const resultCurry = pickAll('a,c')(obj)
  const expectedResult = {
    a : 1,
    b : undefined,
    c : 3,
  }

  expect(result).toEqual(expectedResult)
  expect(resultCurry).toEqual(expectedResult)
})

test('with array as condition', () => {
  expect(pickAll([ 'a', 'b', 'c' ], {
    a : 'foo',
    c : 'baz',
  })).toEqual({
    a : 'foo',
    b : undefined,
    c : 'baz',
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {pickAll} from 'rambda'

interface Input {
  a: string,
  b: number,
  c: number,
  d: number,
}
interface Output {
  a?: string,
  c?: number,
}
const input = {a: 'foo', b: 2, c: 3, d: 4}

describe('R.pickAll with array as props input', () => {
  it('without passing type', () => {
    const result = pickAll(['a', 'c'], input)
    result.a // $ExpectType string
    result.c // $ExpectType number
  })
  it('without passing type + curry', () => {
    const result = pickAll(['a', 'c'])(input)
    result // $ExpectType unknown
  })
  it('explicitly passing types', () => {
    const result = pickAll<Input, Output>(['a', 'c'], input)
    result.a // $ExpectType string | undefined
    result.c // $ExpectType number | undefined
  })
})

describe('R.pickAll with string as props input', () => {
  it('without passing type', () => {
    const result = pickAll('a,c', input)
    result // $ExpectType unknown
  })
  it('without passing type + curry', () => {
    const result = pickAll('a,c')(input)
    result // $ExpectType unknown
  })
  it('explicitly passing types', () => {
    const result = pickAll<Input, Output>('a,c', input)
    result.a // $ExpectType string | undefined
    result.c // $ExpectType number | undefined
  })
  it('explicitly passing types + curry', () => {
    const result = pickAll<Input, Output>('a,c')(input)
    result.a // $ExpectType string | undefined
    result.c // $ExpectType number | undefined
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#pickAll)

### pickBy

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.pickBy(%0A%20%20x%20%3D%3E%20x%20%3E%201%2C%0A%20%20%7Ba%3A%201%2C%20b%3A%202%2C%20c%3A%203%7D%0A)%0A%2F%2F%20%3D%3E%20%7Bb%3A%202%2C%20c%3A%203%7D">Try this <strong>R.pickBy</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#pickBy)

### pipe

It performs left-to-right function composition.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.pipe(%0A%20%20R.filter(val%20%3D%3E%20val%20%3E%202)%2C%0A%20%20R.map(a%20%3D%3E%20a%20*%202)%0A)(%5B1%2C%202%2C%203%2C%204%5D)%0A%0A%2F%2F%20%3D%3E%20%5B6%2C%208%5D">Try this <strong>R.pipe</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#pipe)

### pluck

```typescript

pluck<K extends keyof T, T>(property: K, list: T[]): T[K][]
```

It returns list of the values of `property` taken from the all objects inside `list`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%7Ba%3A%201%7D%2C%20%7Ba%3A%202%7D%2C%20%7Bb%3A%203%7D%5D%0Aconst%20property%20%3D%20'a'%0A%0Aconst%20result%20%3D%20R.pluck(property%2C%20list)%20%0A%2F%2F%20%3D%3E%20%5B1%2C%202%5D">Try this <strong>R.pluck</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
pluck<K extends keyof T, T>(property: K, list: T[]): T[K][];
pluck<T>(property: number, list: { [k: number]: T }[]):  T[];
pluck<P extends string>(property: P): <T>(list: Record<P, T>[]) => T[];
pluck(property: number): <T>(list: { [k: number]: T }[]) => T[];
```

</details>

<details>

<summary><strong>R.pluck</strong> source</summary>

```javascript
import { map } from './map.js'

export function pluck(property, list){
  if (arguments.length === 1) return _list => pluck(property, _list)

  const willReturn = []

  map(x => {
    if (x[ property ] !== undefined){
      willReturn.push(x[ property ])
    }
  }, list)

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { pluck } from './pluck.js'

test('happy', () => {
  expect(pluck('a')([ { a : 1 }, { a : 2 }, { b : 1 } ])).toEqual([ 1, 2 ])
})

test('with undefined', () => {
  expect(pluck(undefined)([ { a : 1 }, { a : 2 }, { b : 1 } ])).toEqual([ ])
})

test('with number', () => {
  const input = [
    [ 1, 2 ],
    [ 3, 4 ],
  ]

  expect(pluck(0, input)).toEqual([ 1, 3 ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {pluck} from 'rambda'

describe('R.pluck', () => {
  it('with object', () => {
    interface ListMember {
      a: number,
      b: string,
    }
    const input: ListMember[] = [
      {a: 1, b: 'foo'},
      {a: 2, b: 'bar'},
    ]
    const resultA = pluck('a', input)
    const resultB = pluck('b')(input)
    resultA // $ExpectType number[]
    resultB // $ExpectType string[]
  })

  it('with array', () => {
    const input = [
      [1, 2],
      [3, 4],
      [5, 6],
    ]
    const result = pluck(0, input)
    const resultCurry = pluck(0)(input)
    result // $ExpectType number[]
    resultCurry // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#pluck)

### prepend

```typescript

prepend<T>(xToPrepend: T, iterable: T[]): T[]
```

It adds element `x` at the beginning of `list`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.prepend('foo'%2C%20%5B'bar'%2C%20'baz'%5D)%0A%2F%2F%20%3D%3E%20%5B'foo'%2C%20'bar'%2C%20'baz'%5D">Try this <strong>R.prepend</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
prepend<T>(xToPrepend: T, iterable: T[]): T[];
prepend<T, U>(xToPrepend: T, iterable: IsFirstSubtypeOfSecond<T, U>[]) : U[];
prepend<T>(xToPrepend: T): <U>(iterable: IsFirstSubtypeOfSecond<T, U>[]) => U[];
prepend<T>(xToPrepend: T): (iterable: T[]) => T[];
```

</details>

<details>

<summary><strong>R.prepend</strong> source</summary>

```javascript
export function prepend(x, input){
  if (arguments.length === 1) return _input => prepend(x, _input)

  if (typeof input === 'string') return [ x ].concat(input.split(''))

  return [ x ].concat(input)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { prepend } from './prepend.js'

test('happy', () => {
  expect(prepend('yes', [ 'foo', 'bar', 'baz' ])).toEqual([
    'yes',
    'foo',
    'bar',
    'baz',
  ])
})

test('with empty list', () => {
  expect(prepend('foo')([])).toEqual([ 'foo' ])
})

test('with string instead of array', () => {
  expect(prepend('foo')('bar')).toEqual([ 'foo', 'b', 'a', 'r' ])
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#prepend)

### product

```typescript

product(list: number[]): number
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.product(%5B%202%2C%203%2C%204%20%5D)%0A%2F%2F%20%3D%3E%2024)">Try this <strong>R.product</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
product(list: number[]): number;
```

</details>

<details>

<summary><strong>R.product</strong> source</summary>

```javascript
import { multiply } from './multiply.js'
import { reduce } from './reduce.js'

export const product = reduce(multiply, 1)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { product } from './product.js'

test('happy', () => {
  expect(product([ 2, 3, 4 ])).toBe(24)
})

test('bad input', () => {
  expect(product([ null ])).toBe(0)
  expect(product([])).toBe(1)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {product} from 'rambda'

describe('R.product', () => {
  it('happy', () => {
    const result = product([1, 2, 3])

    result // $ExpectType number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#product)

### prop

```typescript

prop<_, P extends keyof never, T>(p: P, value: T): Prop<T, P>
```

It returns the value of property `propToFind` in `obj`.

If there is no such property, it returns `undefined`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.prop('x'%2C%20%7Bx%3A%20100%7D)%2C%20%0A%20%20R.prop('x'%2C%20%7Ba%3A%201%7D)%20%0A%5D%0A%2F%2F%20%3D%3E%20%5B100%2C%20undefined%5D">Try this <strong>R.prop</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
prop<_, P extends keyof never, T>(p: P, value: T): Prop<T, P>;
prop<V>(p: keyof never, value: unknown): V;
prop<_, P extends keyof never>(p: P): <T>(value: T) => Prop<T, P>;
prop<V>(p: keyof never): (value: unknown) => V;
```

</details>

<details>

<summary><strong>R.prop</strong> source</summary>

```javascript
export function propFn(searchProperty, obj){
  if (!obj) return undefined

  return obj[ searchProperty ]
}

export function prop(searchProperty, obj){
  if (arguments.length === 1) return _obj => prop(searchProperty, _obj)

  return propFn(searchProperty, obj)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { prop } from './prop.js'

test('prop', () => {
  expect(prop('foo')({ foo : 'baz' })).toBe('baz')

  expect(prop('bar')({ foo : 'baz' })).toBeUndefined()

  expect(prop('bar')(null)).toBeUndefined()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {prop} from 'rambda'

describe('R.prop', () => {
  interface Foo {
    a: number,
    b: string,
    c?: number,
  }
  const obj: Foo = {a: 1, b: 'foo'}

  it('issue #553', () => {
    const result = {
      a: prop('a', obj),
      b: prop('b', obj),
      c: prop('c', obj),
    }
    const curriedResult = {
      a: prop('a')(obj),
      b: prop('b')(obj),
      c: prop('c')(obj),
    }

    result // $ExpectType { a: number; b: string; c: number | undefined; }
    curriedResult // $ExpectType { a: number; b: string; c: number | undefined; }
  })
})

describe('with number as prop', () => {
  const list = [1, 2, 3]
  const index = 1
  it('happy', () => {
    const result = prop(index, list)

    result // $ExpectType number
  })
  it('curried require explicit type', () => {
    const result = prop<number>(index)(list)

    result // $ExpectType number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#prop)

### propEq

```typescript

propEq<K extends string | number>(valueToMatch: any, propToFind: K, obj: Record<K, any>): boolean
```

It returns true if `obj` has property `propToFind` and its value is equal to `valueToMatch`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7B%20foo%3A%20'bar'%20%7D%0Aconst%20secondObj%20%3D%20%7B%20foo%3A%201%20%7D%0A%0Aconst%20propToFind%20%3D%20'foo'%0Aconst%20valueToMatch%20%3D%20'bar'%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.propEq(propToFind%2C%20valueToMatch%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.propEq(propToFind%2C%20valueToMatch%2C%20secondRecord%3Cstring%2C%20unknown%3E)%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20false%5D">Try this <strong>R.propEq</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
propEq<K extends string | number>(valueToMatch: any, propToFind: K, obj: Record<K, any>): boolean;
propEq<K extends string | number>(valueToMatch: any, propToFind: K): (obj: Record<K, any>) => boolean;
propEq(valueToMatch: any): {
  <K extends string | number>(propToFind: K, obj: Record<K, any>): boolean;
  <K extends string | number>(propToFind: K): (obj: Record<K, any>) => boolean;
};
```

</details>

<details>

<summary><strong>R.propEq</strong> source</summary>

```javascript
import { curry } from './curry.js'
import { equals } from './equals.js'
import { prop } from './prop.js'

function propEqFn(
  valueToMatch, propToFind, obj
){
  if (!obj) return false

  return equals(valueToMatch, prop(propToFind, obj))
}

export const propEq = curry(propEqFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { BAR, FOO } from './_internals/testUtils.js'
import { propEq } from './propEq.js'

test('happy', () => {
  const obj = { [ FOO ] : BAR }
  expect(propEq(BAR, FOO)(obj)).toBeTrue()
  expect(propEq(1, FOO)(obj)).toBeFalse()
  expect(propEq(1)(FOO)(obj)).toBeFalse()
  expect(propEq(
    1, 1, null
  )).toBeFalse()
})

test('returns false if called with a null or undefined object', () => {
  expect(propEq(
    'name', 'Abby', null
  )).toBeFalse()
  expect(propEq(
    'name', 'Abby', undefined
  )).toBeFalse()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {propEq} from 'rambda'

const property = 'foo'
const numberProperty = 1
const value = 'bar'
const obj = {[property]: value}
const objWithNumberIndex = {[numberProperty]: value}

describe('R.propEq', () => {
  it('happy', () => {
    const result = propEq(value, property, obj)
    result // $ExpectType boolean
  })

  it('number is property', () => {
    const result = propEq(value, 1, objWithNumberIndex)
    result // $ExpectType boolean
  })

  it('with optional property', () => {
    interface MyType {
      optional?: string | number,
    }

    const myObject: MyType = {}
    const valueToFind = '1111'
    // @ts-expect-error
    propEq(valueToFind, 'optional', myObject)
  })

  it('imported from @types/ramda', () => {
    interface A {
      foo: string | null,
    }
    const obj: A = {
      foo: 'bar',
    }
    const value = ''
    const result = propEq(value, 'foo')(obj)
    result // $ExpectType boolean

    // @ts-expect-error
    propEq(value, 'bar')(obj)
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#propEq)

### propIs

```typescript

propIs<C extends AnyFunction, K extends keyof any>(type: C, name: K, obj: any): obj is Record<K, ReturnType<C>>
```

It returns `true` if `property` of `obj` is from `target` type.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7Ba%3A1%2C%20b%3A%20'foo'%7D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.propIs(Number%2C%20'a'%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.propIs(String%2C%20'b'%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.propIs(Number%2C%20'b'%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20true%2C%20false%5D">Try this <strong>R.propIs</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
propIs<C extends AnyFunction, K extends keyof any>(type: C, name: K, obj: any): obj is Record<K, ReturnType<C>>;
propIs<C extends AnyConstructor, K extends keyof any>(type: C, name: K, obj: any): obj is Record<K, InstanceType<C>>;
propIs<C extends AnyFunction, K extends keyof any>(type: C, name: K): (obj: any) => obj is Record<K, ReturnType<C>>;
propIs<C extends AnyConstructor, K extends keyof any>(type: C, name: K): (obj: any) => obj is Record<K, InstanceType<C>>;
propIs<C extends AnyFunction>(type: C): {
    <K extends keyof any>(name: K, obj: any): obj is Record<K, ReturnType<C>>;
    <K extends keyof any>(name: K): (obj: any) => obj is Record<K, ReturnType<C>>;
};
```

</details>

<details>

<summary><strong>R.propIs</strong> source</summary>

```javascript
import { curry } from './curry.js'
import { is } from './is.js'

function propIsFn(
  targetPrototype, property, obj
){
  return is(targetPrototype, obj[ property ])
}

export const propIs = curry(propIsFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { propIs } from './propIs.js'

const obj = {
  a : 1,
  b : 'foo',
}

test('when true', () => {
  expect(propIs(
    Number, 'a', obj
  )).toBeTrue()
  expect(propIs(
    String, 'b', obj
  )).toBeTrue()
})

test('when false', () => {
  expect(propIs(
    String, 'a', obj
  )).toBeFalse()
  expect(propIs(
    Number, 'b', obj
  )).toBeFalse()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {propIs} from 'rambda'

const property = 'a'
const obj = {a: 1}

describe('R.propIs', () => {
  it('happy', () => {
    const result = propIs(Number, property, obj)
    result // $ExpectType boolean
  })

  it('curried', () => {
    const result = propIs(Number, property)(obj)
    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#propIs)

### propOr

```typescript

propOr<T, P extends string>(defaultValue: T, property: P, obj: Partial<Record<P, T>> | undefined): T
```

It returns either `defaultValue` or the value of `property` in `obj`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7Ba%3A%201%7D%0Aconst%20defaultValue%20%3D%20'DEFAULT_VALUE'%0Aconst%20property%20%3D%20'a'%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.propOr(defaultValue%2C%20property%2C%20Record%3Cstring%2C%20unknown%3E)%2C%0A%20%20R.propOr(defaultValue%2C%20'foo'%2C%20Record%3Cstring%2C%20unknown%3E)%0A%5D%0A%2F%2F%20%3D%3E%20%5B1%2C%20'DEFAULT_VALUE'%5D">Try this <strong>R.propOr</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
propOr<T, P extends string>(defaultValue: T, property: P, obj: Partial<Record<P, T>> | undefined): T;
propOr<T, P extends string>(defaultValue: T, property: P): (obj: Partial<Record<P, T>> | undefined) => T;
propOr<T>(defaultValue: T): {
  <P extends string>(property: P, obj: Partial<Record<P, T>> | undefined): T;
  <P extends string>(property: P): (obj: Partial<Record<P, T>> | undefined) => T;
}
```

</details>

<details>

<summary><strong>R.propOr</strong> source</summary>

```javascript
import { curry } from './curry.js'
import { defaultTo } from './defaultTo.js'

function propOrFn(
  defaultValue, property, obj
){
  if (!obj) return defaultValue

  return defaultTo(defaultValue, obj[ property ])
}

export const propOr = curry(propOrFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { propOr } from './propOr.js'

test('propOr (result)', () => {
  const obj = { a : 1 }
  expect(propOr(
    'default', 'a', obj
  )).toBe(1)
  expect(propOr(
    'default', 'notExist', obj
  )).toBe('default')
  expect(propOr(
    'default', 'notExist', null
  )).toBe('default')
})

test('propOr (currying)', () => {
  const obj = { a : 1 }
  expect(propOr('default')('a', obj)).toBe(1)
  expect(propOr('default', 'a')(obj)).toBe(1)
  expect(propOr('default')('notExist', obj)).toBe('default')
  expect(propOr('default', 'notExist')(obj)).toBe('default')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {propOr} from 'rambda'

const obj = {foo: 'bar'}
const property = 'foo'
const fallback = 'fallback'

describe('R.propOr', () => {
  it('happy', () => {
    const result = propOr(fallback, property, obj)
    result // $ExpectType string
  })
  it('curry 1', () => {
    const result = propOr(fallback)(property, obj)
    result // $ExpectType string
  })
  it('curry 2', () => {
    const result = propOr(fallback, property)(obj)
    result // $ExpectType string
  })
  it('curry 3', () => {
    const result = propOr(fallback)(property)(obj)
    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#propOr)

### props

```typescript

props<P extends string, T>(propsToPick: P[], obj: Record<P, T>): T[]
```

It takes list with properties `propsToPick` and returns a list with property values in `obj`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.props(%0A%20%20%5B'a'%2C%20'b'%5D%2C%20%0A%20%20%7Ba%3A1%2C%20c%3A3%7D%0A)%0A%2F%2F%20%3D%3E%20%5B1%2C%20undefined%5D">Try this <strong>R.props</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
props<P extends string, T>(propsToPick: P[], obj: Record<P, T>): T[];
props<P extends string>(propsToPick: P[]): <T>(obj: Record<P, T>) => T[];
props<P extends string, T>(propsToPick: P[]): (obj: Record<P, T>) => T[];
```

</details>

<details>

<summary><strong>R.props</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'
import { mapArray } from './map.js'

export function props(propsToPick, obj){
  if (arguments.length === 1){
    return _obj => props(propsToPick, _obj)
  }
  if (!isArray(propsToPick)){
    throw new Error('propsToPick is not a list')
  }

  return mapArray(prop => obj[ prop ], propsToPick)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { props } from './props.js'

const obj = {
  a : 1,
  b : 2,
}
const propsToPick = [ 'a', 'c' ]

test('happy', () => {
  const result = props(propsToPick, obj)
  expect(result).toEqual([ 1, undefined ])
})

test('curried', () => {
  const result = props(propsToPick)(obj)
  expect(result).toEqual([ 1, undefined ])
})

test('wrong input', () => {
  expect(() => props(null)(obj)).toThrowErrorMatchingInlineSnapshot('"propsToPick is not a list"')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {props} from 'rambda'

const obj = {a: 1, b: 2}

describe('R.props', () => {
  it('happy', () => {
    const result = props(['a', 'b'], obj)

    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = props(['a', 'b'])(obj)

    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#props)

### propSatisfies

```typescript

propSatisfies<T>(predicate: Predicate<T>, property: string, obj: Record<string, T>): boolean
```

It returns `true` if the object property satisfies a given predicate.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7Ba%3A%20%7Bb%3A1%7D%7D%0Aconst%20property%20%3D%20'a'%0Aconst%20predicate%20%3D%20x%20%3D%3E%20x%3F.b%20%3D%3D%3D%201%0A%0Aconst%20result%20%3D%20R.propSatisfies(predicate%2C%20property%2C%20Record%3Cstring%2C%20unknown%3E)%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.propSatisfies</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
propSatisfies<T>(predicate: Predicate<T>, property: string, obj: Record<string, T>): boolean;
propSatisfies<T>(predicate: Predicate<T>, property: string): (obj: Record<string, T>) => boolean;
```

</details>

<details>

<summary><strong>R.propSatisfies</strong> source</summary>

```javascript
import { curry } from './curry.js'
import { prop } from './prop.js'

function propSatisfiesFn(
  predicate, property, obj
){
  return predicate(prop(property, obj))
}

export const propSatisfies = curry(propSatisfiesFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { propSatisfies } from './propSatisfies.js'

const obj = { a : 1 }

test('when true', () => {
  expect(propSatisfies(
    x => x > 0, 'a', obj
  )).toBeTrue()
})

test('when false', () => {
  expect(propSatisfies(x => x < 0, 'a')(obj)).toBeFalse()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {propSatisfies} from 'rambda'

const obj = {a: 1}

describe('R.propSatisfies', () => {
  it('happy', () => {
    const result = propSatisfies(x => x > 0, 'a', obj)

    result // $ExpectType boolean
  })
  it('curried requires explicit type', () => {
    const result = propSatisfies<number>(x => x > 0, 'a')(obj)

    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#propSatisfies)

### range

```typescript

range(startInclusive: number, endExclusive: number): number[]
```

It returns list of numbers between `startInclusive` to `endExclusive` markers.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.range(0%2C%205)%0A%2F%2F%20%3D%3E%20%5B0%2C%201%2C%202%2C%203%2C%204%5D">Try this <strong>R.range</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
range(startInclusive: number, endExclusive: number): number[];
range(startInclusive: number): (endExclusive: number) => number[];
```

</details>

<details>

<summary><strong>R.range</strong> source</summary>

```javascript
export function range(start, end){
  if (arguments.length === 1) return _end => range(start, _end)

  if (Number.isNaN(Number(start)) || Number.isNaN(Number(end))){
    throw new TypeError('Both arguments to range must be numbers')
  }

  if (end < start) return []

  const len = end - start
  const willReturn = Array(len)

  for (let i = 0; i < len; i++){
    willReturn[ i ] = start + i
  }

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { range } from './range.js'

test('happy', () => {
  expect(range(0, 10)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ])
})

test('end range is bigger than start range', () => {
  expect(range(7, 3)).toEqual([])
  expect(range(5, 5)).toEqual([])
})

test('with bad input', () => {
  const throwMessage = 'Both arguments to range must be numbers'
  expect(() => range('a', 6)).toThrowWithMessage(Error, throwMessage)
  expect(() => range(6, 'z')).toThrowWithMessage(Error, throwMessage)
})

test('curry', () => {
  expect(range(0)(10)).toEqual([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {range} from 'rambda'

describe('R.range', () => {
  it('happy', () => {
    const result = range(1, 4)

    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = range(1)(4)

    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#range)

### reduce

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%5D%0Aconst%20initialValue%20%3D%2010%0Aconst%20reducer%20%3D%20(prev%2C%20current)%20%3D%3E%20prev%20*%20current%0A%0Aconst%20result%20%3D%20R.reduce(reducer%2C%20initialValue%2C%20list)%0A%2F%2F%20%3D%3E%2060">Try this <strong>R.reduce</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#reduce)

### reduceBy

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.reduceBy(%0A%20%20(acc%2C%20elem)%20%3D%3E%20acc%20%2B%20elem%2C%0A%20%200%2C%0A%20%20x%20%3D%3E%20x%20%3E%202%20%3F%20'big'%20%3A%20'small'%2C%0A%20%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%0A)%0A%2F%2F%20%3D%3E%20%7B%20big%3A%2012%2C%20small%3A%203%20%7D">Try this <strong>R.reduceBy</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#reduceBy)

### reject

```typescript

reject<T>(predicate: Predicate<T>, list: T[]): T[]
```

It has the opposite effect of `R.filter`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%2C%204%5D%0Aconst%20obj%20%3D%20%7Ba%3A%201%2C%20b%3A%202%7D%0Aconst%20predicate%20%3D%20x%20%3D%3E%20x%20%3E%201%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.reject(predicate%2C%20list)%2C%0A%20%20R.reject(predicate%2C%20Record%3Cstring%2C%20unknown%3E)%0A%5D%0A%2F%2F%20%3D%3E%20%5B%5B1%5D%2C%20%7Ba%3A%201%7D%5D">Try this <strong>R.reject</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
reject<T>(predicate: Predicate<T>, list: T[]): T[];
reject<T>(predicate: Predicate<T>): (list: T[]) => T[];
reject<T>(predicate: Predicate<T>, obj: Dictionary<T>): Dictionary<T>;
reject<T, U>(predicate: Predicate<T>): (obj: Dictionary<T>) => Dictionary<T>;
```

</details>

<details>

<summary><strong>R.reject</strong> source</summary>

```javascript
import { filter } from './filter.js'

export function reject(predicate, list){
  if (arguments.length === 1) return _list => reject(predicate, _list)

  return filter(x => !predicate(x), list)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { reject } from './reject.js'

const isOdd = n => n % 2 === 1

test('with array', () => {
  expect(reject(isOdd)([ 1, 2, 3, 4 ])).toEqual([ 2, 4 ])
})

test('with object', () => {
  const obj = {
    a : 1,
    b : 2,
    c : 3,
    d : 4,
  }
  expect(reject(isOdd, obj)).toEqual({
    b : 2,
    d : 4,
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {reject} from 'rambda'

describe('R.reject with array', () => {
  it('happy', () => {
    const result = reject(
      x => {
        x // $ExpectType number
        return x > 1
      },
      [1, 2, 3]
    )
    result // $ExpectType number[]
  })
  it('curried require explicit type', () => {
    const result = reject<number>(x => {
      x // $ExpectType number
      return x > 1
    })([1, 2, 3])
    result // $ExpectType number[]
  })
})

describe('R.reject with objects', () => {
  it('happy', () => {
    const result = reject(
      x => {
        x // $ExpectType number

        return x > 1
      },
      {a: 1, b: 2}
    )
    result // $ExpectType Dictionary<number>
  })
  it('curried require dummy type', () => {
    const result = reject<number, any>(x => {
      return x > 1
    })({a: 1, b: 2})
    result // $ExpectType Dictionary<number>
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#reject)

### removeIndex

```typescript

removeIndex<T>(index: number, list: T[]): T[]
```

It returns a copy of `list` input with removed `index`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%2C%204%5D%0Aconst%20result%20%3D%20R.removeIndex(1%2C%20list)%0A%2F%2F%20%3D%3E%20%5B1%2C%203%2C%204%5D">Try this <strong>R.removeIndex</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
removeIndex<T>(index: number, list: T[]): T[];
removeIndex(index: number): <T>(list: T[]) => T[];
```

</details>

<details>

<summary><strong>R.removeIndex</strong> source</summary>

```javascript
export function removeIndex(index, list){
  if (arguments.length === 1) return _list => removeIndex(index, _list)
  if (index <= 0) return list.slice(1)
  if (index >= list.length - 1) return list.slice(0, list.length - 1)

  return [ ...list.slice(0, index), ...list.slice(index + 1) ]
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { removeIndex } from './removeIndex.js'

const list = [ 1, 2, 3, 4 ]

test('first or before first index', () => {
  expect(removeIndex(-2, list)).toEqual([ 2, 3, 4 ])
  expect(removeIndex(-2)(list)).toEqual([ 2, 3, 4 ])
})

test('last or after last index', () => {
  expect(removeIndex(4, list)).toEqual([ 1, 2, 3 ])
  expect(removeIndex(10, list)).toEqual([ 1, 2, 3 ])
})

test('middle index', () => {
  expect(removeIndex(1, list)).toEqual([ 1, 3, 4 ])
  expect(removeIndex(2, list)).toEqual([ 1, 2, 4 ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {removeIndex} from 'rambda'

describe('R.removeIndex', () => {
  it('happy', () => {
    const result = removeIndex(1, [1, 2, 3])

    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = removeIndex(1)([1, 2, 3])

    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#removeIndex)

### repeat

```typescript

repeat<T>(x: T): (timesToRepeat: number) => T[]
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.repeat('foo'%2C%203)%0A%2F%2F%20%3D%3E%20%5B'foo'%2C%20'foo'%2C%20'foo'%5D">Try this <strong>R.repeat</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
repeat<T>(x: T): (timesToRepeat: number) => T[];
repeat<T>(x: T, timesToRepeat: number): T[];
```

</details>

<details>

<summary><strong>R.repeat</strong> source</summary>

```javascript
export function repeat(x, timesToRepeat){
  if (arguments.length === 1){
    return _timesToRepeat => repeat(x, _timesToRepeat)
  }

  return Array(timesToRepeat).fill(x)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { repeat } from './repeat.js'

test('repeat', () => {
  expect(repeat('')(3)).toEqual([ '', '', '' ])
  expect(repeat('foo', 3)).toEqual([ 'foo', 'foo', 'foo' ])

  const obj = {}
  const arr = repeat(obj, 3)

  expect(arr).toEqual([ {}, {}, {} ])

  expect(arr[ 0 ] === arr[ 1 ]).toBeTrue()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {repeat} from 'rambda'

describe('R.repeat', () => {
  it('happy', () => {
    const result = repeat(4, 7)

    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = repeat(4)(7)

    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#repeat)

### replace

```typescript

replace(strOrRegex: RegExp | string, replacer: RegExpReplacer, str: string): string
```

It replaces `strOrRegex` found in `str` with `replacer`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20strOrRegex%20%3D%20%2Fo%2Fg%0A%0Aconst%20result%20%3D%20R.replace(strOrRegex%2C%20'%7C0%7C'%2C%20'foo')%0A%2F%2F%20%3D%3E%20'f%7C0%7C%7C0%7C'">Try this <strong>R.replace</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
replace(strOrRegex: RegExp | string, replacer: RegExpReplacer, str: string): string;
replace(strOrRegex: RegExp | string, replacer: RegExpReplacer): (str: string) => string;
replace(strOrRegex: RegExp | string): (replacer: RegExpReplacer) => (str: string) => string;
```

</details>

<details>

<summary><strong>R.replace</strong> source</summary>

```javascript
import { curry } from './curry.js'

function replaceFn(
  pattern, replacer, str
){
  return str.replace(pattern, replacer)
}

export const replace = curry(replaceFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { replace } from './replace.js'

test('happy', () => {
  expect(replace(
    /\s/g, '|', 'foo bar baz'
  )).toBe('foo|bar|baz')
})

test('with function as replacer input', () => {
  expect(replace(
    /\s/g,
    (
      match, offset, str
    ) => {
      expect(match).toBe(' ')
      expect([ 3, 7 ].includes(offset)).toBeTrue()
      expect(str).toBe('foo bar baz')

      return '|'
    },
    'foo bar baz'
  )).toBe('foo|bar|baz')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {replace} from 'rambda'

const str = 'foo bar foo'
const replacer = 'bar'

describe('R.replace', () => {
  it('happy', () => {
    const result = replace(/foo/g, replacer, str)

    result // $ExpectType string
  })
  it('with string as search pattern', () => {
    const result = replace('foo', replacer, str)

    result // $ExpectType string
  })
  it('with function as replacer', () => {
    const result = replace('f(o)o', (m: string, p1: string, offset: number) => {
      m // $ExpectType string
      p1 // $ExpectType string
      offset // $ExpectType number
      return p1
    }, str)

    result // $ExpectType string
  })
})

describe('R.replace - curried', () => {
  it('happy', () => {
    const result = replace(/foo/g, replacer)(str)

    result // $ExpectType string
  })
  it('with string as search pattern', () => {
    const result = replace('foo', replacer)(str)

    result // $ExpectType string
  })
  it('with function as replacer', () => {
    const result = replace('f(o)o')((m: string, p1: string, offset: number) => {
      m // $ExpectType string
      p1 // $ExpectType string
      offset // $ExpectType number
      return p1
    })(str)

    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#replace)

### reverse

```typescript

reverse<T>(input: T[]): T[]
```

It returns a reversed copy of list or string `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.reverse('foo')%2C%0A%20%20R.reverse(%5B1%2C%202%2C%203%5D)%0A%5D%0A%2F%2F%20%3D%3E%20%5B'oof'%2C%20%5B3%2C%202%2C%201%5D">Try this <strong>R.reverse</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
reverse<T>(input: T[]): T[];
reverse(input: string): string;
```

</details>

<details>

<summary><strong>R.reverse</strong> source</summary>

```javascript
export function reverse(listOrString) {
  if (typeof listOrString === 'string') {
    return listOrString.split('').reverse().join('')
  }

  const clone = listOrString.slice()

  return clone.reverse()
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import {reverse} from './reverse.js'

test('happy', () => {
  expect(reverse([1, 2, 3])).toEqual([3, 2, 1])
})

test('with string', () => {
  expect(reverse('baz')).toBe('zab')
})

test("it doesn't mutate", () => {
  const arr = [1, 2, 3]

  expect(reverse(arr)).toEqual([3, 2, 1])

  expect(arr).toEqual([1, 2, 3])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {reverse} from 'rambda'

const list = [1, 2, 3, 4, 5]

describe('R.reverse', () => {
  it('happy', () => {
    const result = reverse(list)
    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#reverse)

### set

```typescript

set<S, A>(lens: Lens<S, A>): {
  (a: A): (obj: S) => S
  (a: A, obj: S): S
}
```

It returns a copied **Object** or **Array** with modified `lens` focus set to `replacer` value.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20input%20%3D%20%7Bx%3A%201%2C%20y%3A%202%7D%0Aconst%20xLens%20%3D%20R.lensProp('x')%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.set(xLens%2C%204%2C%20input)%2C%0A%20%20R.set(xLens%2C%208%2C%20input)%20%0A%5D%0A%2F%2F%20%3D%3E%20%5B%7Bx%3A%204%2C%20y%3A%202%7D%2C%20%7Bx%3A%208%2C%20y%3A%202%7D%5D">Try this <strong>R.set</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
set<S, A>(lens: Lens<S, A>): {
  (a: A): (obj: S) => S
  (a: A, obj: S): S
};
set<S, A>(lens: Lens<S, A>, a: A): (obj: S) => S;
set<S, A>(lens: Lens<S, A>, a: A, obj: S): S;
```

</details>

<details>

<summary><strong>R.set</strong> source</summary>

```javascript
import {always} from './always.js'
import {curry} from './curry.js'
import {over} from './over.js'

function setFn(lens, replacer, x) {
  return over(lens, always(replacer), x)
}

export const set = curry(setFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import {assoc} from './assoc.js'
import {lens} from './lens.js'
import {lensIndex} from './lensIndex.js'
import {lensPath} from './lensPath.js'
import {prop} from './prop.js'
import {set} from './set.js'

const testObject = {
  foo: 'bar',
  baz: {
    a: 'x',
    b: 'y',
  },
}

test('assoc lens', () => {
  const assocLens = lens(prop('foo'), assoc('foo'))
  const result = set(assocLens, 'FOO', testObject)
  const expected = {
    ...testObject,
    foo: 'FOO',
  }
  expect(result).toEqual(expected)
})

test('path lens', () => {
  const pathLens = lensPath('baz.a')
  const result = set(pathLens, 'z', testObject)
  const expected = {
    ...testObject,
    baz: {
      a: 'z',
      b: 'y',
    },
  }
  expect(result).toEqual(expected)
})

test('index lens', () => {
  const indexLens = lensIndex(0)

  const result = set(indexLens, 3, [1, 2])
  expect(result).toEqual([3, 2])
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#set)

### slice

```typescript

slice(from: number, to: number, input: string): string
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B0%2C%201%2C%202%2C%203%2C%204%2C%205%5D%0Aconst%20str%20%3D%20'FOO_BAR'%0Aconst%20from%20%3D%201%0Aconst%20to%20%3D%204%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.slice(from%2C%20to%2C%20str)%2C%0A%20%20R.slice(from%2C%20to%2C%20list)%0A%5D%0A%2F%2F%20%3D%3E%20%5B'OO_'%2C%20%5B1%2C%202%2C%203%5D%5D">Try this <strong>R.slice</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
slice(from: number, to: number, input: string): string;
slice<T>(from: number, to: number, input: T[]): T[];
slice(from: number, to: number): {
  (input: string): string;
  <T>(input: T[]): T[];
};
slice(from: number): {
  (to: number, input: string): string;
  <T>(to: number, input: T[]): T[];
};
```

</details>

<details>

<summary><strong>R.slice</strong> source</summary>

```javascript
import { curry } from './curry.js'

function sliceFn(
  from, to, list
){
  return list.slice(from, to)
}

export const slice = curry(sliceFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { slice } from './slice.js'

test('slice', () => {
  expect(slice(
    1, 3, [ 'a', 'b', 'c', 'd' ]
  )).toEqual([ 'b', 'c' ])
  expect(slice(
    1, Infinity, [ 'a', 'b', 'c', 'd' ]
  )).toEqual([ 'b', 'c', 'd' ])
  expect(slice(
    0, -1, [ 'a', 'b', 'c', 'd' ]
  )).toEqual([ 'a', 'b', 'c' ])
  expect(slice(
    -3, -1, [ 'a', 'b', 'c', 'd' ]
  )).toEqual([ 'b', 'c' ])
  expect(slice(
    0, 3, 'ramda'
  )).toBe('ram')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {slice} from 'rambda'

const list = [1, 2, 3, 4, 5]

describe('R.slice', () => {
  it('happy', () => {
    const result = slice(1, 3, list)
    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = slice(1, 3)(list)
    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#slice)

### sort

```typescript

sort<T>(sortFn: (a: T, b: T) => number, list: T[]): T[]
```

It returns copy of `list` sorted by `sortFn` function, where `sortFn` needs to return only `-1`, `0` or `1`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%0A%20%20%7Ba%3A%202%7D%2C%0A%20%20%7Ba%3A%203%7D%2C%0A%20%20%7Ba%3A%201%7D%0A%5D%0Aconst%20sortFn%20%3D%20(x%2C%20y)%20%3D%3E%20%7B%0A%20%20return%20x.a%20%3E%20y.a%20%3F%201%20%3A%20-1%0A%7D%0A%0Aconst%20result%20%3D%20R.sort(sortFn%2C%20list)%0Aconst%20expected%20%3D%20%5B%0A%20%20%7Ba%3A%201%7D%2C%0A%20%20%7Ba%3A%202%7D%2C%0A%20%20%7Ba%3A%203%7D%0A%5D%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.sort</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
sort<T>(sortFn: (a: T, b: T) => number, list: T[]): T[];
sort<T>(sortFn: (a: T, b: T) => number): (list: T[]) => T[];
```

</details>

<details>

<summary><strong>R.sort</strong> source</summary>

```javascript
import { cloneList } from './_internals/cloneList.js'

export function sort(sortFn, list){
  if (arguments.length === 1) return _list => sort(sortFn, _list)

  return cloneList(list).sort(sortFn)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { sort } from './sort.js'

const fn = (a, b) => a > b ? 1 : -1

test('sort', () => {
  expect(sort((a, b) => a - b)([ 2, 3, 1 ])).toEqual([ 1, 2, 3 ])
})

test('it doesn\'t mutate', () => {
  const list = [ 'foo', 'bar', 'baz' ]

  expect(sort(fn, list)).toEqual([ 'bar', 'baz', 'foo' ])

  expect(list[ 0 ]).toBe('foo')
  expect(list[ 1 ]).toBe('bar')
  expect(list[ 2 ]).toBe('baz')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {sort} from 'rambda'

const list = [3, 0, 5, 2, 1]

function sortFn(a: number, b: number): number {
  return a > b ? 1 : -1
}

describe('R.sort', () => {
  it('happy', () => {
    const result = sort(sortFn, list)
    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = sort(sortFn)(list)
    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#sort)

### sortBy

```typescript

sortBy<T>(sortFn: (a: T) => Ord, list: T[]): T[]
```

It returns copy of `list` sorted by `sortFn` function, where `sortFn` function returns a value to compare, i.e. it doesn't need to return only `-1`, `0` or `1`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%0A%20%20%7Ba%3A%202%7D%2C%0A%20%20%7Ba%3A%203%7D%2C%0A%20%20%7Ba%3A%201%7D%0A%5D%0Aconst%20sortFn%20%3D%20x%20%3D%3E%20x.a%0A%0Aconst%20result%20%3D%20R.sortBy(sortFn%2C%20list)%0Aconst%20expected%20%3D%20%5B%0A%20%20%7Ba%3A%201%7D%2C%0A%20%20%7Ba%3A%202%7D%2C%0A%20%20%7Ba%3A%203%7D%0A%5D%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.sortBy</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
sortBy<T>(sortFn: (a: T) => Ord, list: T[]): T[];
sortBy<T>(sortFn: (a: T) => Ord): (list: T[]) => T[];
sortBy(sortFn: (a: any) => Ord): <T>(list: T[]) => T[];
```

</details>

<details>

<summary><strong>R.sortBy</strong> source</summary>

```javascript
import { cloneList } from './_internals/cloneList.js'

export function sortBy(sortFn, list){
  if (arguments.length === 1) return _list => sortBy(sortFn, _list)

  const clone = cloneList(list)

  return clone.sort((a, b) => {
    const aSortResult = sortFn(a)
    const bSortResult = sortFn(b)

    if (aSortResult === bSortResult) return 0

    return aSortResult < bSortResult ? -1 : 1
  })
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { compose } from './compose.js'
import { prop } from './prop.js'
import { sortBy } from './sortBy.js'
import { toLower } from './toLower.js'

test('happy', () => {
  const input = [ { a : 2 }, { a : 1 }, { a : 1 }, { a : 3 } ]
  const expected = [ { a : 1 }, { a : 1 }, { a : 2 }, { a : 3 } ]

  const result = sortBy(x => x.a)(input)
  expect(result).toEqual(expected)
})

test('with compose', () => {
  const alice = {
    name : 'ALICE',
    age  : 101,
  }
  const bob = {
    name : 'Bob',
    age  : -10,
  }
  const clara = {
    name : 'clara',
    age  : 314.159,
  }
  const people = [ clara, bob, alice ]
  const sortByNameCaseInsensitive = sortBy(compose(toLower, prop('name')))

  expect(sortByNameCaseInsensitive(people)).toEqual([ alice, bob, clara ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {sortBy, pipe} from 'rambda'

interface Input {
  a: number,
}

describe('R.sortBy', () => {
  it('passing type to sort function', () => {
    function fn(x: any): number {
      return x.a
    }
    function fn2(x: Input): number {
      return x.a
    }

    const input = [{a: 2}, {a: 1}, {a: 0}]
    const result = sortBy(fn, input)
    const curriedResult = sortBy(fn2)(input)

    result // $ExpectType { a: number; }[]
    curriedResult // $ExpectType Input[]
    result[0].a // $ExpectType number
    curriedResult[0].a // $ExpectType number
  })
  it('passing type to sort function and list', () => {
    function fn(x: Input): number {
      return x.a
    }

    const input: Input[] = [{a: 2}, {a: 1}, {a: 0}]
    const result = sortBy(fn, input)
    const curriedResult = sortBy(fn)(input)

    result // $ExpectType Input[]
    curriedResult // $ExpectType Input[]
    result[0].a // $ExpectType number
  })
  it('with R.pipe', () => {
    interface Obj {
      value: number,
    }
    const fn = pipe(sortBy<Obj>(x => x.value))

    const result = fn([{value: 1}, {value: 2}])
    result // $ExpectType Obj[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#sortBy)

### sortWith

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.sortWith(%5B%0A%20%20%20%20(a%2C%20b)%20%3D%3E%20a.a%20%3D%3D%3D%20b.a%20%3F%200%20%3A%20a.a%20%3E%20b.a%20%3F%201%20%3A%20-1%2C%0A%20%20%20%20(a%2C%20b)%20%3D%3E%20a.b%20%3D%3D%3D%20b.b%20%3F%200%20%3A%20a.b%20%3E%20b.b%20%3F%201%20%3A%20-1%2C%0A%5D%2C%20%5B%0A%20%20%7Ba%3A%201%2C%20b%3A%202%7D%2C%0A%20%20%7Ba%3A%202%2C%20b%3A%201%7D%2C%0A%20%20%7Ba%3A%202%2C%20b%3A%202%7D%2C%0A%20%20%7Ba%3A%201%2C%20b%3A%201%7D%2C%0A%5D)%0Aconst%20expected%20%3D%20%5B%0A%20%20%7Ba%3A%201%2C%20b%3A%201%7D%2C%0A%20%20%7Ba%3A%201%2C%20b%3A%202%7D%2C%0A%20%20%7Ba%3A%202%2C%20b%3A%201%7D%2C%0A%20%20%7Ba%3A%202%2C%20b%3A%202%7D%2C%0A%5D%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.sortWith</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#sortWith)

### split

```typescript

split(separator: string | RegExp): (str: string) => string[]
```

Curried version of `String.prototype.split`

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20str%20%3D%20'foo%7Cbar%7Cbaz'%0Aconst%20separator%20%3D%20'%7C'%0Aconst%20result%20%3D%20R.split(separator%2C%20str)%0A%2F%2F%20%3D%3E%20%5B%20'foo'%2C%20'bar'%2C%20'baz'%20%5D">Try this <strong>R.split</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
split(separator: string | RegExp): (str: string) => string[];
split(separator: string | RegExp, str: string): string[];
```

</details>

<details>

<summary><strong>R.split</strong> source</summary>

```javascript
export function split(separator, str){
  if (arguments.length === 1) return _str => split(separator, _str)

  return str.split(separator)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { split } from './split.js'

const str = 'foo|bar|baz'
const splitChar = '|'
const expected = [ 'foo', 'bar', 'baz' ]

test('happy', () => {
  expect(split(splitChar, str)).toEqual(expected)
})

test('curried', () => {
  expect(split(splitChar)(str)).toEqual(expected)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {split} from 'rambda'

const str = 'foo|bar|baz'
const splitChar = '|'

describe('R.split', () => {
  it('happy', () => {
    const result = split(splitChar, str)

    result // $ExpectType string[]
  })
  it('curried', () => {
    const result = split(splitChar)(str)

    result // $ExpectType string[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#split)

### splitAt

```typescript

splitAt<T>(index: number, input: T[]): [T[], T[]]
```

It splits string or array at a given index.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%201%2C%202%2C%203%20%5D%0Aconst%20result%20%3D%20R.splitAt(2%2C%20list)%0A%2F%2F%20%3D%3E%20%5B%5B%201%2C%202%20%5D%2C%20%5B%203%20%5D%5D">Try this <strong>R.splitAt</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
splitAt<T>(index: number, input: T[]): [T[], T[]];
splitAt(index: number, input: string): [string, string];
splitAt(index: number): {
    <T>(input: T[]): [T[], T[]];
    (input: string): [string, string];
};
```

</details>

<details>

<summary><strong>R.splitAt</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'
import { drop } from './drop.js'
import { maybe } from './maybe.js'
import { take } from './take.js'

export function splitAt(index, input){
  if (arguments.length === 1){
    return _list => splitAt(index, _list)
  }
  if (!input) throw new TypeError(`Cannot read property 'slice' of ${ input }`)

  if (!isArray(input) && typeof input !== 'string') return [ [], [] ]

  const correctIndex = maybe(
    index < 0,
    input.length + index < 0 ? 0 : input.length + index,
    index
  )

  return [ take(correctIndex, input), drop(correctIndex, input) ]
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { splitAt as splitAtRamda } from 'ramda'

import { splitAt } from './splitAt.js'

const list = [ 1, 2, 3 ]
const str = 'foo bar'

test('with array', () => {
  const result = splitAt(2, list)
  expect(result).toEqual([ [ 1, 2 ], [ 3 ] ])
})

test('with array - index is negative number', () => {
  const result = splitAt(-6, list)
  expect(result).toEqual([ [], list ])
})

test('with array - index is out of scope', () => {
  const result = splitAt(4, list)
  expect(result).toEqual([ [ 1, 2, 3 ], [] ])
})

test('with string', () => {
  const result = splitAt(4, str)
  expect(result).toEqual([ 'foo ', 'bar' ])
})

test('with string - index is negative number', () => {
  const result = splitAt(-2, str)
  expect(result).toEqual([ 'foo b', 'ar' ])
})

test('with string - index is out of scope', () => {
  const result = splitAt(10, str)
  expect(result).toEqual([ str, '' ])
})

test('with array - index is out of scope', () => {
  const result = splitAt(4)(list)
  expect(result).toEqual([ [ 1, 2, 3 ], [] ])
})

const badInputs = [ 1, true, /foo/g, {} ]
const throwingBadInputs = [ null, undefined ]

test('with bad inputs', () => {
  throwingBadInputs.forEach(badInput => {
    expect(() => splitAt(1, badInput)).toThrowWithMessage(TypeError,
      `Cannot read property 'slice' of ${ badInput }`)
    expect(() => splitAtRamda(1, badInput)).toThrowWithMessage(TypeError,
      `Cannot read properties of ${ badInput } (reading 'slice')`)
  })

  badInputs.forEach(badInput => {
    const result = splitAt(1, badInput)
    const ramdaResult = splitAtRamda(1, badInput)
    expect(result).toEqual(ramdaResult)
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {splitAt} from 'rambda'

const index = 1
const str = 'foo'
const list = [1, 2, 3]

describe('R.splitAt with array', () => {
  it('happy', () => {
    const result = splitAt(index, list)

    result // $ExpectType [number[], number[]]
  })
  it('curried', () => {
    const result = splitAt(index)(list)

    result // $ExpectType [number[], number[]]
  })
})

describe('R.splitAt with string', () => {
  it('happy', () => {
    const result = splitAt(index, str)

    result // $ExpectType [string, string]
  })
  it('curried', () => {
    const result = splitAt(index)(str)

    result // $ExpectType [string, string]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#splitAt)

### splitEvery

```typescript

splitEvery<T>(sliceLength: number, input: T[]): (T[])[]
```

It splits `input` into slices of `sliceLength`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.splitEvery(2%2C%20%5B1%2C%202%2C%203%5D)%2C%20%0A%20%20R.splitEvery(3%2C%20'foobar')%20%0A%5D%0A%0Aconst%20expected%20%3D%20%5B%0A%20%20%5B%5B1%2C%202%5D%2C%20%5B3%5D%5D%2C%0A%20%20%5B'foo'%2C%20'bar'%5D%0A%5D%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.splitEvery</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
splitEvery<T>(sliceLength: number, input: T[]): (T[])[];
splitEvery(sliceLength: number, input: string): string[];
splitEvery(sliceLength: number): {
  (input: string): string[];
  <T>(input: T[]): (T[])[];
};
```

</details>

<details>

<summary><strong>R.splitEvery</strong> source</summary>

```javascript
export function splitEvery(sliceLength, listOrString){
  if (arguments.length === 1){
    return _listOrString => splitEvery(sliceLength, _listOrString)
  }

  if (sliceLength < 1){
    throw new Error('First argument to splitEvery must be a positive integer')
  }

  const willReturn = []
  let counter = 0

  while (counter < listOrString.length){
    willReturn.push(listOrString.slice(counter, counter += sliceLength))
  }

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { splitEvery } from './splitEvery.js'

test('happy', () => {
  expect(splitEvery(3, [ 1, 2, 3, 4, 5, 6, 7 ])).toEqual([
    [ 1, 2, 3 ],
    [ 4, 5, 6 ],
    [ 7 ],
  ])

  expect(splitEvery(3)('foobarbaz')).toEqual([ 'foo', 'bar', 'baz' ])
})

test('with bad input', () => {
  expect(() =>
    expect(splitEvery(0)('foo')).toEqual([ 'f', 'o', 'o' ])).toThrowErrorMatchingInlineSnapshot('"First argument to splitEvery must be a positive integer"')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {splitEvery} from 'rambda'

const list = [1, 2, 3, 4, 5, 6, 7]

describe('R.splitEvery', () => {
  it('happy', () => {
    const result = splitEvery(3, list)

    result // $ExpectType number[][]
  })
  it('curried', () => {
    const result = splitEvery(3)(list)

    result // $ExpectType number[][]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#splitEvery)

### splitWhen

```typescript

splitWhen<T, U>(predicate: Predicate<T>, list: U[]): (U[])[]
```

It splits `list` to two arrays according to a `predicate` function. 

The first array contains all members of `list` before `predicate` returns `true`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%201%2C%202%5D%0Aconst%20result%20%3D%20R.splitWhen(R.equals(2)%2C%20list)%0A%2F%2F%20%3D%3E%20%5B%5B1%5D%2C%20%5B2%2C%201%2C%202%5D%5D">Try this <strong>R.splitWhen</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
splitWhen<T, U>(predicate: Predicate<T>, list: U[]): (U[])[];
splitWhen<T>(predicate: Predicate<T>): <U>(list: U[]) => (U[])[];
```

</details>

<details>

<summary><strong>R.splitWhen</strong> source</summary>

```javascript
export function splitWhen(predicate, input){
  if (arguments.length === 1){
    return _input => splitWhen(predicate, _input)
  }
  if (!input)
    throw new TypeError(`Cannot read property 'length' of ${ input }`)

  const preFound = []
  const postFound = []
  let found = false
  let counter = -1

  while (counter++ < input.length - 1){
    if (found){
      postFound.push(input[ counter ])
    } else if (predicate(input[ counter ])){
      postFound.push(input[ counter ])
      found = true
    } else {
      preFound.push(input[ counter ])
    }
  }

  return [ preFound, postFound ]
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { splitWhen as splitWhenRamda } from 'ramda'

import { equals } from './equals.js'
import { splitWhen } from './splitWhen.js'

const list = [ 1, 2, 1, 2 ]

test('happy', () => {
  const result = splitWhen(equals(2), list)
  expect(result).toEqual([ [ 1 ], [ 2, 1, 2 ] ])
})

test('when predicate returns false', () => {
  const result = splitWhen(equals(3))(list)
  expect(result).toEqual([ list, [] ])
})

const badInputs = [ 1, true, /foo/g, {} ]
const throwingBadInputs = [ null, undefined ]

test('with bad inputs', () => {
  throwingBadInputs.forEach(badInput => {
    expect(() => splitWhen(equals(2), badInput)).toThrowWithMessage(TypeError,
      `Cannot read property 'length' of ${ badInput }`)
    expect(() => splitWhenRamda(equals(2), badInput)).toThrowWithMessage(TypeError,
      `Cannot read properties of ${ badInput } (reading 'length')`)
  })

  badInputs.forEach(badInput => {
    const result = splitWhen(equals(2), badInput)
    const ramdaResult = splitWhenRamda(equals(2), badInput)
    expect(result).toEqual(ramdaResult)
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {splitWhen} from 'rambda'

const list = [1, 2, 1, 2]
const predicate = (x: number) => x === 2

describe('R.splitWhen', () => {
  it('happy', () => {
    const result = splitWhen(predicate, list)

    result // $ExpectType number[][]
  })
  it('curried', () => {
    const result = splitWhen(predicate)(list)

    result // $ExpectType number[][]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#splitWhen)

### startsWith

```typescript

startsWith<T extends string>(question: T, input: string): boolean
```

When iterable is a string, then it behaves as `String.prototype.startsWith`.
When iterable is a list, then it uses R.equals to determine if the target list starts in the same way as the given target.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20str%20%3D%20'foo-bar'%0Aconst%20list%20%3D%20%5B%7Ba%3A1%7D%2C%20%7Ba%3A2%7D%2C%20%7Ba%3A3%7D%5D%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.startsWith('foo'%2C%20str)%2C%0A%20%20R.startsWith(%5B%7Ba%3A1%7D%2C%20%7Ba%3A2%7D%5D%2C%20list)%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20true%5D">Try this <strong>R.startsWith</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
startsWith<T extends string>(question: T, input: string): boolean;
startsWith<T extends string>(question: T): (input: string) => boolean;
startsWith<T>(question: T[], input: T[]): boolean;
startsWith<T>(question: T[]): (input: T[]) => boolean;
```

</details>

<details>

<summary><strong>R.startsWith</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'
import { equals } from './equals.js'

export function startsWith(question, iterable){
  if (arguments.length === 1)
    return _iterable => startsWith(question, _iterable)

  if (typeof iterable === 'string'){
    return iterable.startsWith(question)
  }
  if (!isArray(question)) return false

  let correct = true
  const filtered = question.filter((x, index) => {
    if (!correct) return false
    const result = equals(x, iterable[ index ])
    if (!result) correct = false

    return result
  })

  return filtered.length === question.length
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { startsWith as startsWithRamda } from 'ramda'

import { compareCombinations } from './_internals/testUtils.js'
import { possibleIterables, possibleTargets } from './endsWith.spec.js'
import { startsWith } from './startsWith.js'

test('with string', () => {
  expect(startsWith('foo', 'foo-bar')).toBeTrue()
  expect(startsWith('baz')('foo-bar')).toBeFalse()
})

test('use R.equals with array', () => {
  const list = [ { a : 1 }, { a : 2 }, { a : 3 } ]
  expect(startsWith({ a : 1 }, list)).toBeFalse()
  expect(startsWith([ { a : 1 } ], list)).toBeTrue()
  expect(startsWith([ { a : 1 }, { a : 2 } ], list)).toBeTrue()
  expect(startsWith(list, list)).toBeTrue()
  expect(startsWith([ { a : 2 } ], list)).toBeFalse()
})

describe('brute force', () => {
  compareCombinations({
    fn          : startsWith,
    fnRamda     : startsWithRamda,
    firstInput  : possibleTargets,
    secondInput : possibleIterables,
    callback    : errorsCounters => {
      expect(errorsCounters).toMatchInlineSnapshot(`
        {
          "ERRORS_MESSAGE_MISMATCH": 0,
          "ERRORS_TYPE_MISMATCH": 0,
          "RESULTS_MISMATCH": 0,
          "SHOULD_NOT_THROW": 0,
          "SHOULD_THROW": 0,
          "TOTAL_TESTS": 32,
        }
      `)
    },
  })
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {startsWith} from 'rambda'

describe('R.startsWith - array', () => {
  const question = [{a: 1}]
  const iterable = [{a: 1}, {a: 2}]
  it('happy', () => {
    const result = startsWith(question, iterable)
    result // $ExpectType boolean
  })
  it('curried', () => {
    const result = startsWith(question)(iterable)
    result // $ExpectType boolean
  })
})

describe('R.startsWith - string', () => {
  const question = 'foo'
  const iterable = 'foo bar'
  it('happy', () => {
    const result = startsWith(question, iterable)
    result // $ExpectType boolean
  })
  it('curried', () => {
    const result = startsWith(question)(iterable)
    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#startsWith)

### subtract

Curried version of `x - y`

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20x%20%3D%203%0Aconst%20y%20%3D%201%0A%0Aconst%20result%20%3D%20R.subtract(x%2C%20y)%20%0A%2F%2F%20%3D%3E%202">Try this <strong>R.subtract</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#subtract)

### sum

```typescript

sum(list: number[]): number
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.sum(%5B1%2C%202%2C%203%2C%204%2C%205%5D)%20%0A%2F%2F%20%3D%3E%2015">Try this <strong>R.sum</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
sum(list: number[]): number;
```

</details>

<details>

<summary><strong>R.sum</strong> source</summary>

```javascript
export function sum(list){
  return list.reduce((prev, current) => prev + current, 0)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { sum } from './sum.js'

test('happy', () => {
  expect(sum([ 1, 2, 3, 4, 5 ])).toBe(15)
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#sum)

### swap

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.swap(1%2C%202%2C%20%5B1%2C%202%2C%203%5D)%0A%2F%2F%20%3D%3E%20%5B1%2C%203%2C%202%5D">Try this <strong>R.swap</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#swap)

### symmetricDifference

```typescript

symmetricDifference<T>(x: T[], y: T[]): T[]
```

It returns a merged list of `x` and `y` with all equal elements removed.

`R.equals` is used to determine equality.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20x%20%3D%20%5B%201%2C%202%2C%203%2C%204%20%5D%0Aconst%20y%20%3D%20%5B%203%2C%204%2C%205%2C%206%20%5D%0A%0Aconst%20result%20%3D%20R.symmetricDifference(x%2C%20y)%0A%2F%2F%20%3D%3E%20%5B%201%2C%202%2C%205%2C%206%20%5D">Try this <strong>R.symmetricDifference</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
symmetricDifference<T>(x: T[], y: T[]): T[];
symmetricDifference<T>(x: T[]): <T>(y: T[]) => T[];
```

</details>

<details>

<summary><strong>R.symmetricDifference</strong> source</summary>

```javascript
import { concat } from './concat.js'
import { filter } from './filter.js'
import { includes } from './includes.js'

export function symmetricDifference(x, y){
  if (arguments.length === 1){
    return _y => symmetricDifference(x, _y)
  }

  return concat(filter(value => !includes(value, y), x),
    filter(value => !includes(value, x), y))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { symmetricDifference } from './symmetricDifference.js'

test('symmetricDifference', () => {
  const list1 = [ 1, 2, 3, 4 ]
  const list2 = [ 3, 4, 5, 6 ]
  expect(symmetricDifference(list1)(list2)).toEqual([ 1, 2, 5, 6 ])

  expect(symmetricDifference([], [])).toEqual([])
})

test('symmetricDifference with objects', () => {
  const list1 = [ { id : 1 }, { id : 2 }, { id : 3 }, { id : 4 } ]
  const list2 = [ { id : 3 }, { id : 4 }, { id : 5 }, { id : 6 } ]
  expect(symmetricDifference(list1)(list2)).toEqual([
    { id : 1 },
    { id : 2 },
    { id : 5 },
    { id : 6 },
  ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {symmetricDifference} from 'rambda'

describe('R.symmetricDifference', () => {
  it('happy', () => {
    const list1 = [1, 2, 3, 4]
    const list2 = [3, 4, 5, 6]
    const result = symmetricDifference(list1, list2)

    result // $ExpectType number[]
  })

  it('curried', () => {
    const list1 = [{id: 1}, {id: 2}, {id: 3}, {id: 4}]
    const list2 = [{id: 3}, {id: 4}, {id: 5}, {id: 6}]
    const result = symmetricDifference(list1)(list2)

    result // $ExpectType { id: number; }[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#symmetricDifference)

### T

```typescript

T(): boolean
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.T()%20%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.T</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
T(): boolean;
```

</details>

<details>

<summary><strong>R.T</strong> source</summary>

```javascript
export function T(){
  return true
}
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#T)

### tail

```typescript

tail<T extends unknown[]>(input: T): T extends [any, ...infer U] ? U : [...T]
```

It returns all but the first element of `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20R.tail(%5B1%2C%202%2C%203%5D)%2C%20%20%0A%20%20R.tail('foo')%20%0A%5D%0A%2F%2F%20%3D%3E%20%5B%5B2%2C%203%5D%2C%20'oo'%5D">Try this <strong>R.tail</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
tail<T extends unknown[]>(input: T): T extends [any, ...infer U] ? U : [...T];
tail(input: string): string;
```

</details>

<details>

<summary><strong>R.tail</strong> source</summary>

```javascript
import { drop } from './drop.js'

export function tail(listOrString){
  return drop(1, listOrString)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { tail } from './tail.js'

test('tail', () => {
  expect(tail([ 1, 2, 3 ])).toEqual([ 2, 3 ])
  expect(tail([ 1, 2 ])).toEqual([ 2 ])
  expect(tail([ 1 ])).toEqual([])
  expect(tail([])).toEqual([])

  expect(tail('abc')).toBe('bc')
  expect(tail('ab')).toBe('b')
  expect(tail('a')).toBe('')
  expect(tail('')).toBe('')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {tail} from 'rambda'

describe('R.tail', () => {
  it('with string', () => {
    const result = tail('foo')

    result // $ExpectType string
  })
  it('with list - one type', () => {
    const result = tail([1, 2, 3])

    result // $ExpectType number[]
  })
  it('with list - mixed types', () => {
    const result = tail(['foo', 'bar', 1, 2, 3])

    result // $ExpectType (string | number)[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#tail)

### take

```typescript

take<T>(howMany: number, input: T): T extends string ? string : T
```

It returns the first `howMany` elements of `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20howMany%20%3D%202%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.take(howMany%2C%20%5B1%2C%202%2C%203%5D)%2C%0A%20%20R.take(howMany%2C%20'foobar')%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5B%5B1%2C%202%5D%2C%20'fo'%5D">Try this <strong>R.take</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
take<T>(howMany: number, input: T): T extends string ? string : T;
take<T>(howMany: number) : (input: T) => T extends string ? string : T;
```

</details>

<details>

<summary><strong>R.take</strong> source</summary>

```javascript
import baseSlice from './_internals/baseSlice.js'

export function take(howMany, listOrString){
  if (arguments.length === 1)
    return _listOrString => take(howMany, _listOrString)
  if (howMany < 0) return listOrString.slice()
  if (typeof listOrString === 'string') return listOrString.slice(0, howMany)

  return baseSlice(
    listOrString, 0, howMany
  )
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { take } from './take.js'

test('happy', () => {
  const arr = [ 'foo', 'bar', 'baz' ]

  expect(take(1, arr)).toEqual([ 'foo' ])

  expect(arr).toEqual([ 'foo', 'bar', 'baz' ])

  expect(take(2)([ 'foo', 'bar', 'baz' ])).toEqual([ 'foo', 'bar' ])
  expect(take(3, [ 'foo', 'bar', 'baz' ])).toEqual([ 'foo', 'bar', 'baz' ])
  expect(take(4, [ 'foo', 'bar', 'baz' ])).toEqual([ 'foo', 'bar', 'baz' ])
  expect(take(3)('rambda')).toBe('ram')
})

test('with negative index', () => {
  expect(take(-1, [ 1, 2, 3 ])).toEqual([ 1, 2, 3 ])
  expect(take(-Infinity, [ 1, 2, 3 ])).toEqual([ 1, 2, 3 ])
})

test('with zero index', () => {
  expect(take(0, [ 1, 2, 3 ])).toEqual([])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {take} from 'rambda'

const list = [1, 2, 3, 4]
const str = 'foobar'
const howMany = 2

describe('R.take - array', () => {
  it('happy', () => {
    const result = take(howMany, list)

    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = take<number[]>(howMany)(list)

    result // $ExpectType number[]
  })
})

describe('R.take - string', () => {
  it('happy', () => {
    const result = take(howMany, str)

    result // $ExpectType string
  })
  it('curried', () => {
    const result = take<string>(howMany)(str)

    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#take)

### takeLast

```typescript

takeLast<T>(howMany: number, input: T): T extends string ? string : T
```

It returns the last `howMany` elements of `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20howMany%20%3D%202%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.takeLast(howMany%2C%20%5B1%2C%202%2C%203%5D)%2C%0A%20%20R.takeLast(howMany%2C%20'foobar')%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5B%5B2%2C%203%5D%2C%20'ar'%5D">Try this <strong>R.takeLast</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
takeLast<T>(howMany: number, input: T): T extends string ? string : T;
takeLast<T>(howMany: number) : (input: T) => T extends string ? string : T;
```

</details>

<details>

<summary><strong>R.takeLast</strong> source</summary>

```javascript
import baseSlice from './_internals/baseSlice.js'

export function takeLast(howMany, listOrString){
  if (arguments.length === 1)
    return _listOrString => takeLast(howMany, _listOrString)

  const len = listOrString.length
  if (howMany < 0) return listOrString.slice()
  let numValue = howMany > len ? len : howMany

  if (typeof listOrString === 'string')
    return listOrString.slice(len - numValue)

  numValue = len - numValue

  return baseSlice(
    listOrString, numValue, len
  )
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { takeLast } from './takeLast.js'

test('with arrays', () => {
  expect(takeLast(1, [ 'foo', 'bar', 'baz' ])).toEqual([ 'baz' ])

  expect(takeLast(2)([ 'foo', 'bar', 'baz' ])).toEqual([ 'bar', 'baz' ])

  expect(takeLast(3, [ 'foo', 'bar', 'baz' ])).toEqual([ 'foo', 'bar', 'baz' ])

  expect(takeLast(4, [ 'foo', 'bar', 'baz' ])).toEqual([ 'foo', 'bar', 'baz' ])

  expect(takeLast(10, [ 'foo', 'bar', 'baz' ])).toEqual([ 'foo', 'bar', 'baz' ])
})

test('with strings', () => {
  expect(takeLast(3, 'rambda')).toBe('bda')

  expect(takeLast(7, 'rambda')).toBe('rambda')
})

test('with negative index', () => {
  expect(takeLast(-1, [ 1, 2, 3 ])).toEqual([ 1, 2, 3 ])
  expect(takeLast(-Infinity, [ 1, 2, 3 ])).toEqual([ 1, 2, 3 ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {filter, piped, takeLast} from 'rambda'

const list = [1, 2, 3, 4]
const str = 'foobar'
const howMany = 2

describe('R.takeLast - array', () => {
  it('happy', () => {
    const result = takeLast(howMany, list)

    result // $ExpectType number[]
  })
  it('curried', () => {
    const result = takeLast<number[]>(howMany)(list)

    result // $ExpectType number[]
  })
	it('real case', () => {
		const data = ['foo', 'bar', 'baz', 'qux']
		const result = piped(
			data,
			filter(
				x => x.length >= 100
			),
			takeLast(2),
		)
		result // $ExpectType string[]
	})
})

describe('R.takeLast - string', () => {
  it('happy', () => {
    const result = takeLast(howMany, str)

    result // $ExpectType string
  })
  it('curried', () => {
    const result = takeLast<string>(howMany)(str)

    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#takeLast)

### takeLastWhile

```typescript

takeLastWhile(predicate: (x: string) => boolean, input: string): string
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.takeLastWhile(%0A%20%20x%20%3D%3E%20x%20%3E%202%2C%0A%20%20%5B1%2C%202%2C%203%2C%204%5D%0A)%0A%2F%2F%20%3D%3E%20%5B3%2C%204%5D">Try this <strong>R.takeLastWhile</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
takeLastWhile(predicate: (x: string) => boolean, input: string): string;
takeLastWhile(predicate: (x: string) => boolean): (input: string) => string;
takeLastWhile<T>(predicate: (x: T) => boolean, input: T[]): T[];
takeLastWhile<T>(predicate: (x: T) => boolean): <T>(input: T[]) => T[];
```

</details>

<details>

<summary><strong>R.takeLastWhile</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'

export function takeLastWhile(predicate, input){
  if (arguments.length === 1){
    return _input => takeLastWhile(predicate, _input)
  }
  if (input.length === 0) return input

  const toReturn = []
  let counter = input.length

  while (counter){
    const item = input[ --counter ]
    if (!predicate(item)){
      break
    }
    toReturn.push(item)
  }

  return isArray(input) ? toReturn.reverse() : toReturn.reverse().join('')
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { takeLastWhile } from './takeLastWhile.js'
const assert = require('assert')

const list = [ 1, 2, 3, 4 ]

test('happy', () => {
  const predicate = x => x > 2
  const result = takeLastWhile(predicate, list)
  expect(result).toEqual([ 3, 4 ])
})

test('predicate is always true', () => {
  const predicate = () => true
  const result = takeLastWhile(predicate)(list)
  expect(result).toEqual(list)
})

test('predicate is always false', () => {
  const predicate = () => false
  const result = takeLastWhile(predicate, list)
  expect(result).toEqual([])
})

test('with string', () => {
  const result = takeLastWhile(x => x !== 'F', 'FOOBAR')
  expect(result).toBe('OOBAR')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {takeLastWhile} from 'rambda'

const list = [1, 2, 3]
const str = 'FOO'

describe('R.takeLastWhile', () => {
  it('with array', () => {
    const result = takeLastWhile(x => x > 1, list)

    result // $ExpectType number[]
  })
  it('with array - curried', () => {
    const result = takeLastWhile(x => x > 1, list)

    result // $ExpectType number[]
  })
  it('with string', () => {
    const result = takeLastWhile(x => x !== 'F', str)

    result // $ExpectType string
  })
  it('with string - curried', () => {
    const result = takeLastWhile(x => x !== 'F')(str)

    result // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#takeLastWhile)

### takeWhile

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%2C%204%5D%0Aconst%20predicate%20%3D%20x%20%3D%3E%20x%20%3C%203%0A%0Aconst%20result%20%3D%20R.takeWhile(predicate%2C%20list)%0A%2F%2F%20%3D%3E%20%5B1%2C%202%5D">Try this <strong>R.takeWhile</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#takeWhile)

### tap

```typescript

tap<T>(fn: (x: T) => void, input: T): T
```

It applies function `fn` to input `x` and returns `x`. 

One use case is debugging in the middle of `R.compose`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%202%2C%203%5D%0A%0AR.compose(%0A%20%20R.map(x%20%3D%3E%20x%20*%202)%0A%20%20R.tap(console.log)%2C%0A%20%20R.filter(x%20%3D%3E%20x%20%3E%201)%0A)(list)%0A%2F%2F%20%3D%3E%20%602%60%20and%20%603%60%20will%20be%20logged">Try this <strong>R.tap</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
tap<T>(fn: (x: T) => void, input: T): T;
tap<T>(fn: (x: T) => void): (input: T) => T;
```

</details>

<details>

<summary><strong>R.tap</strong> source</summary>

```javascript
export function tap(fn, x){
  if (arguments.length === 1) return _x => tap(fn, _x)

  fn(x)

  return x
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { tap } from './tap.js'

test('tap', () => {
  let a = 1
  const sayX = x => a = x

  expect(tap(sayX, 100)).toBe(100)
  expect(tap(sayX)(100)).toBe(100)
  expect(a).toBe(100)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {tap, pipe} from 'rambda'

describe('R.tap', () => {
  it('happy', () => {
    pipe(
      tap(x => {
        x // $ExpectType number[]
      }),
      (x: number[]) => x.length
    )([1, 2])
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#tap)

### test

```typescript

test(regExpression: RegExp): (str: string) => boolean
```

It determines whether `str` matches `regExpression`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.test(%2F%5Ef%2F%2C%20'foo')%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.test</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
test(regExpression: RegExp): (str: string) => boolean;
test(regExpression: RegExp, str: string): boolean;
```

</details>

<details>

<summary><strong>R.test</strong> source</summary>

```javascript
export function test(pattern, str){
  if (arguments.length === 1) return _str => test(pattern, _str)

  if (typeof pattern === 'string'){
    throw new TypeError(`R.test requires a value of type RegExp as its first argument; received "${ pattern }"`)
  }

  return str.search(pattern) !== -1
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { test as testMethod } from './test.js'

test('happy', () => {
  expect(testMethod(/^x/, 'xyz')).toBeTrue()

  expect(testMethod(/^y/)('xyz')).toBeFalse()
})

test('throws if first argument is not regex', () => {
  expect(() => testMethod('foo', 'bar')).toThrowErrorMatchingInlineSnapshot('"R.test requires a value of type RegExp as its first argument; received "foo""')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {test} from 'rambda'

const input = 'foo   '
const regex = /foo/

describe('R.test', () => {
  it('happy', () => {
    const result = test(regex, input)

    result // $ExpectType boolean
  })
  it('curried', () => {
    const result = test(regex)(input)

    result // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#test)

### times

```typescript

times<T>(fn: (i: number) => T, howMany: number): T[]
```

It returns the result of applying function `fn` over members of range array.

The range array includes numbers between `0` and `howMany`(exclusive).

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20x%20%3D%3E%20x%20*%202%0Aconst%20howMany%20%3D%205%0A%0Aconst%20result%20%3D%20R.times(fn%2C%20howMany)%0A%2F%2F%20%3D%3E%20%5B0%2C%202%2C%204%2C%206%2C%208%5D">Try this <strong>R.times</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
times<T>(fn: (i: number) => T, howMany: number): T[];
times<T>(fn: (i: number) => T): (howMany: number) => T[];
```

</details>

<details>

<summary><strong>R.times</strong> source</summary>

```javascript
import { isInteger } from './_internals/isInteger.js'
import { map } from './map.js'
import { range } from './range.js'

export function times(fn, howMany){
  if (arguments.length === 1) return _howMany => times(fn, _howMany)
  if (!isInteger(howMany) || howMany < 0){
    throw new RangeError('n must be an integer')
  }

  return map(fn, range(0, howMany))
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import assert from 'assert'

import { identity } from './identity.js'
import { times } from './times.js'

test('happy', () => {
  const result = times(identity, 5)

  expect(result).toEqual([ 0, 1, 2, 3, 4 ])
})

test('with bad input', () => {
  assert.throws(() => {
    times(3)('cheers!')
  }, RangeError)
  assert.throws(() => {
    times(identity, -1)
  }, RangeError)
})

test('curry', () => {
  const result = times(identity)(5)

  expect(result).toEqual([ 0, 1, 2, 3, 4 ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {times, identity} from 'rambda'

describe('R.times', () => {
  it('happy', () => {
    const result = times(identity, 5)
    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#times)

### toLower

```typescript

toLower<S extends string>(str: S): Lowercase<S>
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.toLower('FOO')%0A%2F%2F%20%3D%3E%20'foo'">Try this <strong>R.toLower</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
toLower<S extends string>(str: S): Lowercase<S>;
toLower(str: string): string;
```

</details>

<details>

<summary><strong>R.toLower</strong> source</summary>

```javascript
export function toLower(str){
  return str.toLowerCase()
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { toLower } from './toLower.js'

test('toLower', () => {
  expect(toLower('FOO|BAR|BAZ')).toBe('foo|bar|baz')
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#toLower)

### toPairs

```typescript

toPairs<O extends object, K extends Extract<keyof O, string | number>>(obj: O): Array<{ [key in K]: [`${key}`, O[key]] }[K]>
```

It transforms an object to a list.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%7B%0A%20%20a%20%3A%201%2C%0A%20%20b%20%3A%202%2C%0A%20%20c%20%3A%20%5B%203%2C%204%20%5D%2C%0A%7D%0Aconst%20expected%20%3D%20%5B%20%5B%20'a'%2C%201%20%5D%2C%20%5B%20'b'%2C%202%20%5D%2C%20%5B%20'c'%2C%20%5B%203%2C%204%20%5D%20%5D%20%5D%0A%0Aconst%20result%20%3D%20R.toPairs(list)%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.toPairs</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
toPairs<O extends object, K extends Extract<keyof O, string | number>>(obj: O): Array<{ [key in K]: [`${key}`, O[key]] }[K]>;
toPairs<S>(obj: Record<string | number, S>): Array<[string, S]>;
```

</details>

<details>

<summary><strong>R.toPairs</strong> source</summary>

```javascript
export function toPairs(obj){
  return Object.entries(obj)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { toPairs } from './toPairs.js'

const obj = {
  a : 1,
  b : 2,
  c : [ 3, 4 ],
}
const expected = [
  [ 'a', 1 ],
  [ 'b', 2 ],
  [ 'c', [ 3, 4 ] ],
]

test('happy', () => {
  expect(toPairs(obj)).toEqual(expected)
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#toPairs)

### toString

```typescript

toString(x: unknown): string
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.toString(%5B1%2C%202%5D)%20%0A%2F%2F%20%3D%3E%20'1%2C2'">Try this <strong>R.toString</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
toString(x: unknown): string;
```

</details>

<details>

<summary><strong>R.toString</strong> source</summary>

```javascript
export function toString(x){
  return x.toString()
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { toString } from './toString.js'

test('happy', () => {
  expect(toString([ 1, 2, 3 ])).toBe('1,2,3')
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#toString)

### toUpper

```typescript

toUpper<S extends string>(str: S): Uppercase<S>
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.toUpper('foo')%0A%2F%2F%20%3D%3E%20'FOO'">Try this <strong>R.toUpper</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
toUpper<S extends string>(str: S): Uppercase<S>;
toUpper(str: string): string;
```

</details>

<details>

<summary><strong>R.toUpper</strong> source</summary>

```javascript
export function toUpper(str){
  return str.toUpperCase()
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { toUpper } from './toUpper.js'

test('toUpper', () => {
  expect(toUpper('foo|bar|baz')).toBe('FOO|BAR|BAZ')
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#toUpper)

### transpose

```typescript

transpose<T>(list: (T[])[]): (T[])[]
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%5B10%2C%2011%5D%2C%20%5B20%5D%2C%20%5B%5D%2C%20%5B30%2C%2031%2C%2032%5D%5D%0Aconst%20expected%20%3D%20%5B%5B10%2C%2020%2C%2030%5D%2C%20%5B11%2C%2031%5D%2C%20%5B32%5D%5D%0A%0Aconst%20result%20%3D%20R.transpose(list)%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.transpose</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
transpose<T>(list: (T[])[]): (T[])[];
```

</details>

<details>

<summary><strong>R.transpose</strong> source</summary>

```javascript
import { isArray } from './_internals/isArray.js'

export function transpose(array){
  return array.reduce((acc, el) => {
    el.forEach((nestedEl, i) =>
      isArray(acc[ i ]) ? acc[ i ].push(nestedEl) : acc.push([ nestedEl ]))

    return acc
  }, [])
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { transpose } from './transpose.js'

test('happy', () => {
  const input = [
    [ 'a', 1 ],
    [ 'b', 2 ],
    [ 'c', 3 ],
  ]

  expect(transpose(input)).toEqual([
    [ 'a', 'b', 'c' ],
    [ 1, 2, 3 ],
  ])
})

test('when rows are shorter', () => {
  const actual = transpose([ [ 10, 11 ], [ 20 ], [], [ 30, 31, 32 ] ])
  const expected = [ [ 10, 20, 30 ], [ 11, 31 ], [ 32 ] ]
  expect(actual).toEqual(expected)
})

test('with empty array', () => {
  expect(transpose([])).toEqual([])
})

test('array with falsy values', () => {
  const actual = transpose([
    [ true, false, undefined, null ],
    [ null, undefined, false, true ],
  ])
  const expected = [
    [ true, null ],
    [ false, undefined ],
    [ undefined, false ],
    [ null, true ],
  ]
  expect(actual).toEqual(expected)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {transpose} from 'rambda'

const input = [
  ['a', 1],
  ['b', 2],
  ['c', 3],
]

describe('R.transpose', () => {
  it('happy', () => {
    const result = transpose(input)

    result // $ExpectType (string | number)[][]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#transpose)

### trim

```typescript

trim(str: string): string
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.trim('%20%20foo%20%20')%20%0A%2F%2F%20%3D%3E%20'foo'">Try this <strong>R.trim</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
trim(str: string): string;
```

</details>

<details>

<summary><strong>R.trim</strong> source</summary>

```javascript
export function trim(str){
  return str.trim()
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { trim } from './trim.js'

test('trim', () => {
  expect(trim(' foo ')).toBe('foo')
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#trim)

### tryCatch

It returns function that runs `fn` in `try/catch` block. If there was an error, then `fallback` is used to return the result. Note that `fn` can be value or asynchronous/synchronous function(unlike `Ramda` where fallback can only be a synchronous function).

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20x%20%3D%3E%20x.foo%0A%0Aconst%20result%20%3D%20%5B%0A%20%20R.tryCatch(fn%2C%20false)(null)%2C%0A%20%20R.tryCatch(fn%2C%20false)(%7Bfoo%3A%20'bar'%7D)%0A%5D%0A%2F%2F%20%3D%3E%20%5Bfalse%2C%20'bar'%5D">Try this <strong>R.tryCatch</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#tryCatch)

### type

It accepts any input and it returns its type.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.type(()%20%3D%3E%20%7B%7D)%20%2F%2F%20%3D%3E%20'Function'%0AR.type(async%20()%20%3D%3E%20%7B%7D)%20%2F%2F%20%3D%3E%20'Async'%0AR.type(%5B%5D)%20%2F%2F%20%3D%3E%20'Array'%0AR.type(%7B%7D)%20%2F%2F%20%3D%3E%20'Object'%0AR.type('foo')%20%2F%2F%20%3D%3E%20'String'%0AR.type(1)%20%2F%2F%20%3D%3E%20'Number'%0AR.type(true)%20%2F%2F%20%3D%3E%20'Boolean'%0AR.type(null)%20%2F%2F%20%3D%3E%20'Null'%0AR.type(%2F%5BA-z%5D%2F)%20%2F%2F%20%3D%3E%20'RegExp'%0AR.type('foo'*1)%20%2F%2F%20%3D%3E%20'NaN'%0A%0Aconst%20delay%20%3D%20ms%20%3D%3E%20new%20Promise(resolve%20%3D%3E%20%7B%0A%20%20setTimeout(function%20()%20%7B%0A%20%20%20%20resolve()%0A%20%20%7D%2C%20ms)%0A%7D)%0AR.type(delay)%20%2F%2F%20%3D%3E%20'Promise'">Try this <strong>R.type</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#type)

### unapply

```typescript

unapply<T = any>(fn: (args: any[]) => T): (...args: any[]) => T
```

It calls a function `fn` with the list of values of the returned function. 

`R.unapply` is the opposite of `R.apply` method.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.unapply(JSON.stringify)(1%2C%202%2C%203)%0A%2F%2F%3D%3E%20'%5B1%2C2%2C3%5D'">Try this <strong>R.unapply</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
unapply<T = any>(fn: (args: any[]) => T): (...args: any[]) => T;
```

</details>

<details>

<summary><strong>R.unapply</strong> source</summary>

```javascript
export function unapply(fn){
  return function (...args){
    return fn.call(this, args)
  }
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { apply } from './apply.js'
import { converge } from './converge.js'
import { identity } from './identity.js'
import { prop } from './prop.js'
import { sum } from './sum.js'
import { unapply } from './unapply.js'

test('happy', () => {
  const fn = unapply(identity)
  expect(fn(
    1, 2, 3
  )).toEqual([ 1, 2, 3 ])
  expect(fn()).toEqual([])
})

test('returns a function which is always passed one argument', () => {
  const fn = unapply(function (){
    return arguments.length
  })
  expect(fn('x')).toBe(1)
  expect(fn('x', 'y')).toBe(1)
  expect(fn(
    'x', 'y', 'z'
  )).toBe(1)
})

test('forwards arguments to decorated function as an array', () => {
  const fn = unapply(xs => '[' + xs + ']')
  expect(fn(2)).toBe('[2]')
  expect(fn(2, 4)).toBe('[2,4]')
  expect(fn(
    2, 4, 6
  )).toBe('[2,4,6]')
})

test('returns a function with length 0', () => {
  const fn = unapply(identity)
  expect(fn).toHaveLength(0)
})

test('is the inverse of R.apply', () => {
  let a, b, c, d, e, f, g, n
  const rand = function (){
    return Math.floor(200 * Math.random()) - 100
  }

  f = Math.max
  g = unapply(apply(f))
  n = 1
  while (n <= 100){
    a = rand()
    b = rand()
    c = rand()
    d = rand()
    e = rand()
    expect(f(
      a, b, c, d, e
    )).toEqual(g(
      a, b, c, d, e
    ))
    n += 1
  }

  f = function (xs){
    return '[' + xs + ']'
  }
  g = apply(unapply(f))
  n = 1
  while (n <= 100){
    a = rand()
    b = rand()
    c = rand()
    d = rand()
    e = rand()
    expect(f([ a, b, c, d, e ])).toEqual(g([ a, b, c, d, e ]))
    n += 1
  }
})

test('it works with converge', () => {
  const fn = unapply(sum)
  const convergeFn = converge(fn, [ prop('a'), prop('b'), prop('c') ])
  const obj = {
    a : 1337,
    b : 42,
    c : 1,
  }
  const expected = 1337 + 42 + 1
  expect(convergeFn(obj)).toEqual(expected)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {join, unapply, sum} from 'rambda'

describe('R.unapply', () => {
  it('happy', () => {
    const fn = unapply(sum)

    fn(1, 2, 3) // $ExpectType number
  })

  it('joins a string', () => {
    const fn = unapply(join(''))

    fn('s', 't', 'r', 'i', 'n', 'g') // $ExpectType string
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#unapply)

### union

```typescript

union<T>(x: T[], y: T[]): T[]
```

It takes two lists and return a new list containing a merger of both list with removed duplicates. 

`R.equals` is used to compare for duplication.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.union(%5B1%2C2%2C3%5D%2C%20%5B3%2C4%2C5%5D)%3B%0A%2F%2F%20%3D%3E%20%5B1%2C%202%2C%203%2C%204%2C%205%5D">Try this <strong>R.union</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
union<T>(x: T[], y: T[]): T[];
union<T>(x: T[]): (y: T[]) => T[];
```

</details>

<details>

<summary><strong>R.union</strong> source</summary>

```javascript
import { cloneList } from './_internals/cloneList.js'
import { includes } from './includes.js'

export function union(x, y){
  if (arguments.length === 1) return _y => union(x, _y)

  const toReturn = cloneList(x)

  y.forEach(yInstance => {
    if (!includes(yInstance, x)) toReturn.push(yInstance)
  })

  return toReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { union } from './union.js'

test('happy', () => {
  expect(union([ 1, 2 ], [ 2, 3 ])).toEqual([ 1, 2, 3 ])
})

test('with list of objects', () => {
  const list1 = [ { a : 1 }, { a : 2 } ]
  const list2 = [ { a : 2 }, { a : 3 } ]
  const result = union(list1)(list2)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {union} from 'rambda'

describe('R.union', () => {
  it('happy', () => {
    const result = union([1, 2], [2, 3])

    result // $ExpectType number[]
  })
  it('with array of objects - case 1', () => {
    const list1 = [{a: 1}, {a: 2}]
    const list2 = [{a: 2}, {a: 3}]
    const result = union(list1, list2)
    result // $ExpectType { a: number; }[]
  })
  it('with array of objects - case 2', () => {
    const list1 = [{a: 1, b: 1}, {a: 2}]
    const list2 = [{a: 2}, {a: 3, b: 3}]
    const result = union(list1, list2)
    result[0].a // $ExpectType number
    result[0].b // $ExpectType number | undefined
  })
})

describe('R.union - curried', () => {
  it('happy', () => {
    const result = union([1, 2])([2, 3])

    result // $ExpectType number[]
  })
  it('with array of objects - case 1', () => {
    const list1 = [{a: 1}, {a: 2}]
    const list2 = [{a: 2}, {a: 3}]
    const result = union(list1)(list2)
    result // $ExpectType { a: number; }[]
  })
  it('with array of objects - case 2', () => {
    const list1 = [{a: 1, b: 1}, {a: 2}]
    const list2 = [{a: 2}, {a: 3, b: 3}]
    const result = union(list1)(list2)
    result[0].a // $ExpectType number
    result[0].b // $ExpectType number | undefined
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#union)

### uniq

```typescript

uniq<T>(list: T[]): T[]
```

It returns a new array containing only one copy of each element of `list`.

`R.equals` is used to determine equality.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B1%2C%201%2C%20%7Ba%3A%201%7D%2C%20%7Ba%3A%202%7D%2C%20%7Ba%3A1%7D%5D%0A%0Aconst%20result%20%3D%20R.uniq(list)%0A%2F%2F%20%3D%3E%20%5B1%2C%20%7Ba%3A%201%7D%2C%20%7Ba%3A%202%7D%5D">Try this <strong>R.uniq</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
uniq<T>(list: T[]): T[];
```

</details>

<details>

<summary><strong>R.uniq</strong> source</summary>

```javascript
import { _Set } from './_internals/set.js'

export function uniq(list){
  const set = new _Set()
  const willReturn = []
  list.forEach(item => {
    if (set.checkUniqueness(item)){
      willReturn.push(item)
    }
  })

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { uniq } from './uniq.js'

test('happy', () => {
  const list = [ 1, 2, 3, 3, 3, 1, 2, 0 ]
  expect(uniq(list)).toEqual([ 1, 2, 3, 0 ])
})

test('with object', () => {
  const list = [ { a : 1 }, { a : 2 }, { a : 1 }, { a : 2 } ]
  expect(uniq(list)).toEqual([ { a : 1 }, { a : 2 } ])
})

test('with nested array', () => {
  expect(uniq([ [ 42 ], [ 42 ] ])).toEqual([ [ 42 ] ])
})

test('with booleans', () => {
  expect(uniq([ [ false ], [ false ], [ true ] ])).toEqual([ [ false ], [ true ] ])
})

test('with falsy values', () => {
  expect(uniq([ undefined, null ])).toEqual([ undefined, null ])
})

test('can distinct between string and number', () => {
  expect(uniq([ 1, '1' ])).toEqual([ 1, '1' ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {uniq} from 'rambda'

describe('R.uniq', () => {
  it('happy', () => {
    const result = uniq([1, 2, 3, 3, 3, 1, 2, 0])
    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#uniq)

### uniqBy

It applies uniqueness to input list based on function that defines what to be used for comparison between elements.

`R.equals` is used to determine equality.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%7Ba%3A1%7D%2C%20%7Ba%3A2%7D%2C%20%7Ba%3A1%7D%5D%0Aconst%20result%20%3D%20R.uniqBy(x%20%3D%3E%20x%2C%20list)%0A%0A%2F%2F%20%3D%3E%20%5B%7Ba%3A1%7D%2C%20%7Ba%3A2%7D%5D">Try this <strong>R.uniqBy</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#uniqBy)

### uniqWith

```typescript

uniqWith<T, U>(predicate: (x: T, y: T) => boolean, list: T[]): T[]
```

It returns a new array containing only one copy of each element in `list` according to `predicate` function.

This predicate should return true, if two elements are equal.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list%20%3D%20%5B%0A%20%20%7Bid%3A%200%2C%20title%3A'foo'%7D%2C%0A%20%20%7Bid%3A%201%2C%20title%3A'bar'%7D%2C%0A%20%20%7Bid%3A%202%2C%20title%3A'baz'%7D%2C%0A%20%20%7Bid%3A%203%2C%20title%3A'foo'%7D%2C%0A%20%20%7Bid%3A%204%2C%20title%3A'bar'%7D%2C%0A%5D%0A%0Aconst%20expected%20%3D%20%5B%0A%20%20%7Bid%3A%200%2C%20title%3A'foo'%7D%2C%0A%20%20%7Bid%3A%201%2C%20title%3A'bar'%7D%2C%0A%20%20%7Bid%3A%202%2C%20title%3A'baz'%7D%2C%0A%5D%0A%0Aconst%20predicate%20%3D%20(x%2Cy)%20%3D%3E%20x.title%20%3D%3D%3D%20y.title%0A%0Aconst%20result%20%3D%20R.uniqWith(predicate%2C%20list)%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.uniqWith</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
uniqWith<T, U>(predicate: (x: T, y: T) => boolean, list: T[]): T[];
uniqWith<T, U>(predicate: (x: T, y: T) => boolean): (list: T[]) => T[];
```

</details>

<details>

<summary><strong>R.uniqWith</strong> source</summary>

```javascript
function includesWith(
  predicate, target, list
){
  let willReturn = false
  let index = -1

  while (++index < list.length && !willReturn){
    const value = list[ index ]

    if (predicate(target, value)){
      willReturn = true
    }
  }

  return willReturn
}

export function uniqWith(predicate, list){
  if (arguments.length === 1) return _list => uniqWith(predicate, _list)

  let index = -1
  const willReturn = []

  while (++index < list.length){
    const value = list[ index ]

    if (!includesWith(
      predicate, value, willReturn
    )){
      willReturn.push(value)
    }
  }

  return willReturn
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { uniqWith as uniqWithRamda } from 'ramda'

import { uniqWith } from './uniqWith.js'

const list = [ { a : 1 }, { a : 1 } ]

test('happy', () => {
  const fn = (x, y) => x.a === y.a

  const result = uniqWith(fn, list)
  expect(result).toEqual([ { a : 1 } ])
})

test('with list of strings', () => {
  const fn = (x, y) => x.length === y.length
  const list = [ '0', '11', '222', '33', '4', '55' ]
  const result = uniqWith(fn)(list)
  const resultRamda = uniqWithRamda(fn, list)
  expect(result).toEqual([ '0', '11', '222' ])
  expect(resultRamda).toEqual([ '0', '11', '222' ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {uniqWith} from 'rambda'

describe('R.uniqWith', () => {
  it('happy', () => {
    const list = [{a: 1}, {a: 1}]

    const fn = (x: any, y: any) => x.a === y.a

    const result = uniqWith(fn, list)
    result // $ExpectType { a: number; }[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#uniqWith)

### unless

```typescript

unless<T, U>(predicate: (x: T) => boolean, whenFalseFn: (x: T) => U, x: T): T | U
```

The method returns function that will be called with argument `input`.

If `predicate(input)` returns `false`, then the end result will be the outcome of `whenFalse(input)`.

In the other case, the final output will be the `input` itself.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20fn%20%3D%20R.unless(%0A%20%20x%20%3D%3E%20x%20%3E%202%2C%0A%20%20x%20%3D%3E%20x%20%2B%2010%0A)%0A%0Aconst%20result%20%3D%20%5B%0A%20%20fn(1)%2C%0A%20%20fn(5)%0A%5D%0A%2F%2F%20%3D%3E%20%5B11%2C%205%5D">Try this <strong>R.unless</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
unless<T, U>(predicate: (x: T) => boolean, whenFalseFn: (x: T) => U, x: T): T | U;
unless<T, U>(predicate: (x: T) => boolean, whenFalseFn: (x: T) => U): (x: T) => T | U;
unless<T>(predicate: (x: T) => boolean, whenFalseFn: (x: T) => T, x: T): T;
unless<T>(predicate: (x: T) => boolean, whenFalseFn: (x: T) => T): (x: T) => T;
```

</details>

<details>

<summary><strong>R.unless</strong> source</summary>

```javascript
import { curry } from './curry.js'

function unlessFn(
  predicate, whenFalseFn, input
){
  if (predicate(input)) return input

  return whenFalseFn(input)
}

export const unless = curry(unlessFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { inc } from './inc.js'
import { isNil } from './isNil.js'
import { unless } from './unless.js'

test('happy', () => {
  const safeInc = unless(isNil, inc)
  expect(safeInc(null)).toBeNull()
  expect(safeInc(1)).toBe(2)
})

test('curried', () => {
  const safeIncCurried = unless(isNil)(inc)
  expect(safeIncCurried(null)).toBeNull()
})

test('with 3 inputs', () => {
  let result = unless(x => x.startsWith('/'), x=> x.concat('/'), '/api')
  expect(result).toBe('/api')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {unless, inc} from 'rambda'

describe('R.unless', () => {
  it('happy', () => {
    const fn = unless(x => x > 5, inc)
    const result = fn(1)
    result // $ExpectType number
  })
  it('with one explicit type', () => {
    const result = unless(
      x => {
        x // $ExpectType number
        return x > 5
      },
      x => {
        x // $ExpectType number
        return x + 1
      },
      1
    )
    result // $ExpectType number
  })
  it('with two different explicit types', () => {
    const result = unless(
      x => {
        x // $ExpectType number
        return x > 5
      },
      x => {
        x // $ExpectType number
        return `${x}-foo`
      },
      1
    )
    result // $ExpectType string | number
  })
})

describe('R.unless - curried', () => {
  it('happy', () => {
    const fn = unless(x => x > 5, inc)
    const result = fn(1)
    result // $ExpectType number
  })
  it('with one explicit type', () => {
    const fn = unless<number>(
      x => {
        x // $ExpectType number
        return x > 5
      },
      x => {
        x // $ExpectType number
        return x + 1
      }
    )
    const result = fn(1)
    result // $ExpectType number
  })
  it('with two different explicit types', () => {
    const fn = unless<number, string>(
      x => {
        x // $ExpectType number
        return x > 5
      },
      x => {
        x // $ExpectType number
        return `${x}-foo`
      }
    )
    const result = fn(1)
    result // $ExpectType string | number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#unless)

### unnest

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20R.unnest(%5B1%2C%20%5B2%5D%2C%20%5B%5B3%5D%5D%5D)%0A%2F%2F%20%3D%3E%20%5B1%2C%202%2C%20%5B3%5D%5D">Try this <strong>R.unnest</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#unnest)

### unwind

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7B%0A%20%20a%3A%201%2C%0A%20%20b%3A%20%5B2%2C%203%5D%2C%0A%7D%0Aconst%20result%20%3D%20R.unwind('b'%2C%20obj)%0Aconst%20expected%20%3D%20%5B%7Ba%3A1%2C%20b%3A2%7D%2C%20%7Ba%3A1%2C%20b%3A3%7D%5D%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.unwind</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#unwind)

### update

```typescript

update<T>(index: number, newValue: T, list: T[]): T[]
```

It returns a copy of `list` with updated element at `index` with `newValue`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20index%20%3D%202%0Aconst%20newValue%20%3D%2088%0Aconst%20list%20%3D%20%5B1%2C%202%2C%203%2C%204%2C%205%5D%0A%0Aconst%20result%20%3D%20R.update(index%2C%20newValue%2C%20list)%0A%2F%2F%20%3D%3E%20%5B1%2C%202%2C%2088%2C%204%2C%205%5D">Try this <strong>R.update</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
update<T>(index: number, newValue: T, list: T[]): T[];
update<T>(index: number, newValue: T): (list: T[]) => T[];
```

</details>

<details>

<summary><strong>R.update</strong> source</summary>

```javascript
import { cloneList } from './_internals/cloneList.js'
import { curry } from './curry.js'

export function updateFn(
  index, newValue, list
){
  const clone = cloneList(list)
  if (index === -1) return clone.fill(newValue, index)

  return clone.fill(
    newValue, index, index + 1
  )
}

export const update = curry(updateFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { update } from './update.js'

const list = [ 1, 2, 3 ]

test('happy', () => {
  const newValue = 8
  const index = 1
  const result = update(
    index, newValue, list
  )
  const curriedResult = update(index, newValue)(list)
  const tripleCurriedResult = update(index)(newValue)(list)

  const expected = [ 1, 8, 3 ]
  expect(result).toEqual(expected)
  expect(curriedResult).toEqual(expected)
  expect(tripleCurriedResult).toEqual(expected)
})

test('list has no such index', () => {
  const newValue = 8
  const index = 10
  const result = update(
    index, newValue, list
  )

  expect(result).toEqual(list)
})

test('with negative index', () => {
  expect(update(
    -1, 10, [ 1 ]
  )).toEqual([ 10 ])
  expect(update(
    -1, 10, []
  )).toEqual([])
  expect(update(
    -1, 10, list
  )).toEqual([ 1, 2, 10 ])
  expect(update(
    -2, 10, list
  )).toEqual([ 1, 10, 3 ])
  expect(update(
    -3, 10, list
  )).toEqual([ 10, 2, 3 ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {update} from 'rambda'

describe('R.update', () => {
  it('happy', () => {
    const result = update(1, 0, [1, 2, 3])
    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#update)

### values

```typescript

values<T extends object, K extends keyof T>(obj: T): T[K][]
```

With correct input, this is nothing more than `Object.values(Record<string, unknown>)`. If `obj` is not an object, then it returns an empty array.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20obj%20%3D%20%7Ba%3A1%2C%20b%3A2%7D%0A%0Aconst%20result%20%3D%20R.values(Record%3Cstring%2C%20unknown%3E)%0A%2F%2F%20%3D%3E%20%5B1%2C%202%5D">Try this <strong>R.values</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
values<T extends object, K extends keyof T>(obj: T): T[K][];
```

</details>

<details>

<summary><strong>R.values</strong> source</summary>

```javascript
import { type } from './type.js'

export function values(obj){
  if (type(obj) !== 'Object') return []
  return Object.values(obj)
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { values } from './values.js'

test('happy', () => {
  expect(values({
    a : 1,
    b : 2,
    c : 3,
  })).toEqual([ 1, 2, 3 ])
})

test('with bad input', () => {
  expect(values(null)).toEqual([])
  expect(values(undefined)).toEqual([])
  expect(values(55)).toEqual([])
  expect(values('foo')).toEqual([])
  expect(values(true)).toEqual([])
  expect(values(false)).toEqual([])
  expect(values(NaN)).toEqual([])
  expect(values(Infinity)).toEqual([])
  expect(values([])).toEqual([])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {values} from 'rambda'

describe('R.values', () => {
  it('happy', () => {
    const result = values({
      a: 1,
      b: 2,
      c: 3,
    })
    result // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#values)

### view

```typescript

view<S, A>(lens: Lens<S, A>): (obj: S) => A
```

It returns the value of `lens` focus over `target` object.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20lens%20%3D%20R.lensProp('x')%0A%0AR.view(lens%2C%20%7Bx%3A%201%2C%20y%3A%202%7D)%20%2F%2F%20%3D%3E%201%0Aconst%20result%20%3D%20R.view(lens%2C%20%7Bx%3A%204%2C%20y%3A%202%7D)%20%2F%2F%20%3D%3E%204">Try this <strong>R.view</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
view<S, A>(lens: Lens<S, A>): (obj: S) => A;
view<S, A>(lens: Lens<S, A>, obj: S): A;
```

</details>

<details>

<summary><strong>R.view</strong> source</summary>

```javascript
const Const = x => ({
  x,
  map : fn => Const(x),
})

export function view(lens, target){
  if (arguments.length === 1) return _target => view(lens, _target)

  return lens(Const)(target).x
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { assoc } from './assoc.js'
import { lens } from './lens.js'
import { prop } from './prop.js'
import { view } from './view.js'

const testObject = { foo : 'Led Zeppelin' }
const assocLens = lens(prop('foo'), assoc('foo'))

test('happy', () => {
  expect(view(assocLens, testObject)).toBe('Led Zeppelin')
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#view)

### when

```typescript

when<T, U>(predicate: (x: T) => boolean, whenTrueFn: (a: T) => U, input: T): T | U
```

It pass `input` to `predicate` function and if the result is `true`, it will return the result of `whenTrueFn(input)`. 
If the `predicate` returns `false`, then it will simply return `input`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20predicate%20%3D%20x%20%3D%3E%20typeof%20x%20%3D%3D%3D%20'number'%0Aconst%20whenTrueFn%20%3D%20R.add(11)%0A%0Aconst%20fn%20%3D%20when(predicate%2C%20whenTrueResult)%0A%0Aconst%20positiveInput%20%3D%2088%0Aconst%20negativeInput%20%3D%20'foo'%0A%0Aconst%20result%20%3D%20%5B%0A%20%20fn(positiveInput)%2C%0A%20%20fn(positiveInput)%2C%0A%5D%0A%0Aconst%20expected%20%3D%20%5B%0A%20%2099%2C%0A%20%20'foo'%2C%0A%5D%0A%2F%2F%20%3D%3E%20%60result%60%20is%20equal%20to%20%60expected%60">Try this <strong>R.when</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
when<T, U>(predicate: (x: T) => boolean, whenTrueFn: (a: T) => U, input: T): T | U;
when<T, U>(predicate: (x: T) => boolean, whenTrueFn: (a: T) => U): (input: T) => T | U;
when<T, U>(predicate: (x: T) => boolean): ((whenTrueFn: (a: T) => U) => (input: T) => T | U);
```

</details>

<details>

<summary><strong>R.when</strong> source</summary>

```javascript
import { curry } from './curry.js'

function whenFn(
  predicate, whenTrueFn, input
){
  if (!predicate(input)) return input

  return whenTrueFn(input)
}

export const when = curry(whenFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { add } from './add.js'
import { when } from './when.js'

const predicate = x => typeof x === 'number'

test('happy', () => {
  const fn = when(predicate, add(11))
  expect(fn(11)).toBe(22)
  expect(fn('foo')).toBe('foo')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {when} from 'rambda'

const predicate = (x: number) => x > 2
const whenTrueFn = (x: number) => String(x)

describe('R.when', () => {
  it('happy', () => {
    const result = when(predicate, whenTrueFn, 1)
    result // $ExpectType string | 1
  })

  it('curry 1', () => {
    const fn = when(predicate, whenTrueFn)
    const result = fn(1)
    result // $ExpectType string | number
  })

  it('curry 2 require explicit types', () => {
    const fn = when<number, string>(predicate)(whenTrueFn)
    const result = fn(1)
    result // $ExpectType string | number
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#when)

### where

```typescript

where<T, U>(conditions: T, input: U): boolean
```

It returns `true` if all each property in `conditions` returns `true` when applied to corresponding property in `input` object.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20condition%20%3D%20R.where(%7B%0A%20%20a%20%3A%20x%20%3D%3E%20typeof%20x%20%3D%3D%3D%20%22string%22%2C%0A%20%20b%20%3A%20x%20%3D%3E%20x%20%3D%3D%3D%204%0A%7D)%0Aconst%20input%20%3D%20%7B%0A%20%20a%20%3A%20%22foo%22%2C%0A%20%20b%20%3A%204%2C%0A%20%20c%20%3A%2011%2C%0A%7D%0A%0Aconst%20result%20%3D%20condition(input)%20%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.where</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
where<T, U>(conditions: T, input: U): boolean;
where<T>(conditions: T): <U>(input: U) => boolean;
where<ObjFunc2, U>(conditions: ObjFunc2, input: U): boolean;
where<ObjFunc2>(conditions: ObjFunc2): <U>(input: U) => boolean;
```

</details>

<details>

<summary><strong>R.where</strong> source</summary>

```javascript
export function where(conditions, input){
  if (input === undefined){
    return _input => where(conditions, _input)
  }
  let flag = true
  for (const prop in conditions){
    if (!flag) continue
    const result = conditions[ prop ](input[ prop ])
    if (flag && result === false){
      flag = false
    }
  }

  return flag
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { equals } from './equals.js'
import { where } from './where.js'

test('when true', () => {
  const result = where({
    a : equals('foo'),
    b : equals('bar'),
  },
  {
    a : 'foo',
    b : 'bar',
    x : 11,
    y : 19,
  })

  expect(result).toBeTrue()
})

test('when false | early exit', () => {
  let counter = 0
  const equalsFn = expected => input => {
    console.log(expected, 'expected')
    counter++

    return input === expected
  }
  const predicate = where({
    a : equalsFn('foo'),
    b : equalsFn('baz'),
  })
  expect(predicate({
    a : 'notfoo',
    b : 'notbar',
  })).toBeFalse()
  expect(counter).toBe(1)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {where, equals} from 'rambda'

describe('R.where', () => {
  it('happy', () => {
    const input = {
      a: 'foo',
      b: 'bar',
      x: 11,
      y: 19,
    }
    const conditions = {
      a: equals('foo'),
      b: equals('bar'),
    }
    const result = where(conditions, input)
    const curriedResult = where(conditions)(input)
    result // $ExpectType boolean
    curriedResult // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#where)

### whereAny

Same as `R.where`, but it will return `true` if at least one condition check returns `true`.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20conditions%20%3D%20%7B%0A%20%20a%3A%20a%20%3D%3E%20a%20%3E%201%2C%0A%20%20b%3A%20b%20%3D%3E%20b%20%3E%202%2C%0A%7D%0Aconst%20result%20%3D%20%5B%0A%20%20R.whereAny(conditions%2C%20%7Bb%3A3%7D)%2C%0A%20%20R.whereAny(conditions%2C%20%7Bc%3A4%7D)%0A%5D%0A%2F%2F%20%3D%3E%20%5Btrue%2C%20false%5D">Try this <strong>R.whereAny</strong> example in Rambda REPL</a>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#whereAny)

### whereEq

```typescript

whereEq<T, U>(condition: T, input: U): boolean
```

It will return `true` if all of `input` object fully or partially include `rule` object.

`R.equals` is used to determine equality.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20condition%20%3D%20%7B%20a%20%3A%20%7B%20b%20%3A%201%20%7D%20%7D%0Aconst%20input%20%3D%20%7B%0A%20%20a%20%3A%20%7B%20b%20%3A%201%20%7D%2C%0A%20%20c%20%3A%202%0A%7D%0A%0Aconst%20result%20%3D%20whereEq(condition%2C%20input)%0A%2F%2F%20%3D%3E%20true">Try this <strong>R.whereEq</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
whereEq<T, U>(condition: T, input: U): boolean;
whereEq<T>(condition: T): <U>(input: U) => boolean;
```

</details>

<details>

<summary><strong>R.whereEq</strong> source</summary>

```javascript
import { equals } from './equals.js'
import { filter } from './filter.js'

export function whereEq(condition, input){
  if (arguments.length === 1){
    return _input => whereEq(condition, _input)
  }

  const result = filter((conditionValue, conditionProp) =>
    equals(conditionValue, input[ conditionProp ]),
  condition)

  return Object.keys(result).length === Object.keys(condition).length
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { whereEq } from './whereEq.js'

test('when true', () => {
  const condition = { a : 1 }
  const input = {
    a : 1,
    b : 2,
  }

  const result = whereEq(condition, input)
  const expectedResult = true

  expect(result).toEqual(expectedResult)
})

test('when false', () => {
  const condition = { a : 1 }
  const input = { b : 2 }

  const result = whereEq(condition, input)
  const expectedResult = false

  expect(result).toEqual(expectedResult)
})

test('with nested object', () => {
  const condition = { a : { b : 1 } }
  const input = {
    a : { b : 1 },
    c : 2,
  }

  const result = whereEq(condition)(input)
  const expectedResult = true

  expect(result).toEqual(expectedResult)
})

test('with wrong input', () => {
  const condition = { a : { b : 1 } }

  expect(() => whereEq(condition, null)).toThrowErrorMatchingInlineSnapshot('"Cannot read properties of null (reading \'a\')"')
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {whereEq} from 'rambda'

describe('R.whereEq', () => {
  it('happy', () => {
    const result = whereEq({a: {b: 2}}, {b: 2})
    const curriedResult = whereEq({a: {b: 2}})({b: 2})
    result // $ExpectType boolean
    curriedResult // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#whereEq)

### without

```typescript

without<T>(matchAgainst: T[], source: T[]): T[]
```

It will return a new array, based on all members of `source` list that are not part of `matchAgainst` list.

`R.equals` is used to determine equality.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20source%20%3D%20%5B1%2C%202%2C%203%2C%204%5D%0Aconst%20matchAgainst%20%3D%20%5B2%2C%203%5D%0A%0Aconst%20result%20%3D%20R.without(matchAgainst%2C%20source)%0A%2F%2F%20%3D%3E%20%5B1%2C%204%5D">Try this <strong>R.without</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
without<T>(matchAgainst: T[], source: T[]): T[];
without<T>(matchAgainst: T[]): (source: T[]) => T[];
```

</details>

<details>

<summary><strong>R.without</strong> source</summary>

```javascript
import { _indexOf } from './equals.js'
import { reduce } from './reduce.js'

export function without(matchAgainst, source){
  if (source === undefined){
    return _source => without(matchAgainst, _source)
  }

  return reduce(
    (prev, current) =>
      _indexOf(current, matchAgainst) > -1 ? prev : prev.concat(current),
    [],
    source
  )
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { without as withoutRamda } from 'ramda'

import { without } from './without.js'

test('should return a new list without values in the first argument', () => {
  const itemsToOmit = [ 'A', 'B', 'C' ]
  const collection = [ 'A', 'B', 'C', 'D', 'E', 'F' ]

  expect(without(itemsToOmit, collection)).toEqual([ 'D', 'E', 'F' ])
  expect(without(itemsToOmit)(collection)).toEqual([ 'D', 'E', 'F' ])
})

test('with list of objects', () => {
  const itemsToOmit = [ { a : 1 }, { c : 3 } ]
  const collection = [ { a : 1 }, { b : 2 }, { c : 3 }, { d : 4 } ]
  const expected = [ { b : 2 }, { d : 4 } ]

  expect(without(itemsToOmit, collection)).toEqual(expected)
  expect(withoutRamda(itemsToOmit, collection)).toEqual(expected)
})

test('ramda accepts string as target input while rambda throws', () => {
  expect(withoutRamda('0:1', [ '0', '0:1' ])).toEqual([ '0:1' ])
  expect(() =>
    without('0:1', [ '0', '0:1' ])).toThrowErrorMatchingInlineSnapshot('"Cannot read property \'indexOf\' of 0:1"')
  expect(without([ '0:1' ], [ '0', '0:1' ])).toEqual([ '0' ])
})

test('ramda test', () => {
  expect(without([ 1, 2 ])([ 1, 2, 1, 3, 4 ])).toEqual([ 3, 4 ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {without} from 'rambda'

const itemsToOmit = ['A', 'B', 'C']
const collection = ['A', 'B', 'C', 'D', 'E', 'F']

describe('R.without', () => {
  it('happy', () => {
    const result = without(itemsToOmit, collection)

    result // $ExpectType string[]
  })
  it('curried', () => {
    const result = without(itemsToOmit)(collection)

    result // $ExpectType string[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#without)

### xor

```typescript

xor(x: boolean, y: boolean): boolean
```

Logical XOR

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20result%20%3D%20%5B%0A%20%20xor(true%2C%20true)%2C%0A%20%20xor(false%2C%20false)%2C%0A%20%20xor(false%2C%20true)%2C%0A%5D%0A%2F%2F%20%3D%3E%20%5Bfalse%2C%20false%2C%20true%5D">Try this <strong>R.xor</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
xor(x: boolean, y: boolean): boolean;
xor(y: boolean): (y: boolean) => boolean;
```

</details>

<details>

<summary><strong>R.xor</strong> source</summary>

```javascript
export function xor(a, b){
  if (arguments.length === 1) return _b => xor(a, _b)

  return Boolean(a) && !b || Boolean(b) && !a
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { xor } from './xor.js'

test('compares two values with exclusive or', () => {
  expect(xor(true, true)).toBeFalse()
  expect(xor(true, false)).toBeTrue()
  expect(xor(false, true)).toBeTrue()
  expect(xor(false, false)).toBeFalse()
})

test('when both values are truthy, it should return false', () => {
  expect(xor(true, 'foo')).toBeFalse()
  expect(xor(42, true)).toBeFalse()
  expect(xor('foo', 42)).toBeFalse()
  expect(xor({}, true)).toBeFalse()
  expect(xor(true, [])).toBeFalse()
  expect(xor([], {})).toBeFalse()
  expect(xor(new Date(), true)).toBeFalse()
  expect(xor(true, Infinity)).toBeFalse()
  expect(xor(Infinity, new Date())).toBeFalse()
})

test('when both values are falsy, it should return false', () => {
  expect(xor(null, false)).toBeFalse()
  expect(xor(false, undefined)).toBeFalse()
  expect(xor(undefined, null)).toBeFalse()
  expect(xor(0, false)).toBeFalse()
  expect(xor(false, NaN)).toBeFalse()
  expect(xor(NaN, 0)).toBeFalse()
  expect(xor('', false)).toBeFalse()
})

test('when one argument is truthy and the other is falsy, it should return true', () => {
  expect(xor('foo', null)).toBeTrue()
  expect(xor(null, 'foo')).toBeTrue()
  expect(xor(undefined, 42)).toBeTrue()
  expect(xor(42, undefined)).toBeTrue()
  expect(xor(Infinity, NaN)).toBeTrue()
  expect(xor(NaN, Infinity)).toBeTrue()
  expect(xor({}, '')).toBeTrue()
  expect(xor('', {})).toBeTrue()
  expect(xor(new Date(), 0)).toBeTrue()
  expect(xor(0, new Date())).toBeTrue()
  expect(xor([], null)).toBeTrue()
  expect(xor(undefined, [])).toBeTrue()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {xor} from 'rambda'

describe('R.xor', () => {
  it('happy', () => {
    xor(true, false) // $ExpectType boolean
  })
  it('curry', () => {
    xor(true)(false) // $ExpectType boolean
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#xor)

### zip

```typescript

zip<K, V>(x: K[], y: V[]): KeyValuePair<K, V>[]
```

It will return a new array containing tuples of equally positions items from both `x` and `y` lists. 

The returned list will be truncated to match the length of the shortest supplied list.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20x%20%3D%20%5B1%2C%202%5D%0Aconst%20y%20%3D%20%5B'A'%2C%20'B'%5D%0AR.zip(x%2C%20y)%0A%2F%2F%20%3D%3E%20%5B%5B1%2C%20'A'%5D%2C%20%5B2%2C%20'B'%5D%5D%0A%0A%2F%2F%20truncates%20to%20shortest%20list%0Aconst%20result%20%3D%20R.zip(%5B...x%2C%203%5D%2C%20%5B'A'%2C%20'B'%5D)%0A%2F%2F%20%3D%3E%20%5B%5B1%2C%20'A'%5D%2C%20%5B2%2C%20'B'%5D%5D">Try this <strong>R.zip</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
zip<K, V>(x: K[], y: V[]): KeyValuePair<K, V>[];
zip<K>(x: K[]): <V>(y: V[]) => KeyValuePair<K, V>[];
```

</details>

<details>

<summary><strong>R.zip</strong> source</summary>

```javascript
export function zip(left, right){
  if (arguments.length === 1) return _right => zip(left, _right)

  const result = []
  const length = Math.min(left.length, right.length)

  for (let i = 0; i < length; i++){
    result[ i ] = [ left[ i ], right[ i ] ]
  }

  return result
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { zip } from './zip.js'

const array1 = [ 1, 2, 3 ]
const array2 = [ 'A', 'B', 'C' ]

test('should return an array', () => {
  const actual = zip(array1)(array2)
  expect(actual).toBeInstanceOf(Array)
})

test('should return and array or tuples', () => {
  const expected = [
    [ 1, 'A' ],
    [ 2, 'B' ],
    [ 3, 'C' ],
  ]
  const actual = zip(array1, array2)
  expect(actual).toEqual(expected)
})

test('should truncate result to length of shorted input list', () => {
  const expectedA = [
    [ 1, 'A' ],
    [ 2, 'B' ],
  ]
  const actualA = zip([ 1, 2 ], array2)
  expect(actualA).toEqual(expectedA)

  const expectedB = [
    [ 1, 'A' ],
    [ 2, 'B' ],
  ]
  const actualB = zip(array1, [ 'A', 'B' ])
  expect(actualB).toEqual(expectedB)
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {zip} from 'rambda'

describe('R.zip', () => {
  it('happy', () => {
    const array1 = [1, 2, 3]
    const array2 = ['A', 'B', 'C']

    const result = zip(array1)(array2)
    result // $ExpectType KeyValuePair<number, string>[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#zip)

### zipObj

```typescript

zipObj<T, K extends string>(keys: K[], values: T[]): { [P in K]: T }
```

It will return a new object with keys of `keys` array and values of `values` array.

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20keys%20%3D%20%5B'a'%2C%20'b'%2C%20'c'%5D%0A%0AR.zipObj(keys%2C%20%5B1%2C%202%2C%203%5D)%0A%2F%2F%20%3D%3E%20%7Ba%3A%201%2C%20b%3A%202%2C%20c%3A%203%7D%0A%0A%2F%2F%20truncates%20to%20shortest%20list%0Aconst%20result%20%3D%20R.zipObj(keys%2C%20%5B1%2C%202%5D)%0A%2F%2F%20%3D%3E%20%7Ba%3A%201%2C%20b%3A%202%7D">Try this <strong>R.zipObj</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
zipObj<T, K extends string>(keys: K[], values: T[]): { [P in K]: T };
zipObj<K extends string>(keys: K[]): <T>(values: T[]) => { [P in K]: T };
zipObj<T, K extends number>(keys: K[], values: T[]): { [P in K]: T };
zipObj<K extends number>(keys: K[]): <T>(values: T[]) => { [P in K]: T };
```

</details>

<details>

<summary><strong>R.zipObj</strong> source</summary>

```javascript
import { take } from './take.js'

export function zipObj(keys, values){
  if (arguments.length === 1) return yHolder => zipObj(keys, yHolder)

  return take(values.length, keys).reduce((
    prev, xInstance, i
  ) => {
    prev[ xInstance ] = values[ i ]

    return prev
  }, {})
}
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { equals } from './equals.js'
import { zipObj } from './zipObj.js'

test('zipObj', () => {
  expect(zipObj([ 'a', 'b', 'c' ], [ 1, 2, 3 ])).toEqual({
    a : 1,
    b : 2,
    c : 3,
  })
})

test('0', () => {
  expect(zipObj([ 'a', 'b' ])([ 1, 2, 3 ])).toEqual({
    a : 1,
    b : 2,
  })
})

test('1', () => {
  expect(zipObj([ 'a', 'b', 'c' ])([ 1, 2 ])).toEqual({
    a : 1,
    b : 2,
  })
})

test('ignore extra keys', () => {
  const result = zipObj([ 'a', 'b', 'c', 'd', 'e', 'f' ], [ 1, 2, 3 ])
  const expected = {
    a : 1,
    b : 2,
    c : 3,
  }

  expect(equals(result, expected)).toBeTrue()
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {zipObj} from 'rambda'

describe('R.zipObj', () => {
  it('happy', () => {
    // this is wrong since 24.10.2020 `@types/ramda` changes
    const result = zipObj(['a', 'b', 'c', 'd'], [1, 2, 3])
    ;[result.a, result.b, result.c, result.d] // $ExpectType number[]
  })
  it('imported from @types/ramda', () => {
    const result = zipObj(['a', 'b', 'c'], [1, 2, 3])
    const curriedResult = zipObj(['a', 'b', 'c'])([1, 2, 3])
    ;[result.a, result.b, result.c] // $ExpectType number[]
    ;[curriedResult.a, curriedResult.b, curriedResult.c] // $ExpectType number[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#zipObj)

### zipWith

```typescript

zipWith<T, U, TResult>(fn: (x: T, y: U) => TResult, list1: T[], list2: U[]): TResult[]
```

<a title="redirect to Rambda Repl site" href="https://rambda.now.sh?const%20list1%20%3D%20%5B%2010%2C%2020%2C%2030%2C%2040%20%5D%0Aconst%20list2%20%3D%20%5B%20100%2C%20200%20%5D%0A%0Aconst%20result%20%3D%20R.zipWith(%0A%20%20R.add%2C%20list1%2C%20list2%0A)%0A%2F%2F%20%3D%3E%20%5B110%2C%20220%5D">Try this <strong>R.zipWith</strong> example in Rambda REPL</a>

<details>

<summary>All TypeScript definitions</summary>

```typescript
zipWith<T, U, TResult>(fn: (x: T, y: U) => TResult, list1: T[], list2: U[]): TResult[];
zipWith<T, U, TResult>(fn: (x: T, y: U) => TResult, list1: T[]): (list2: U[]) => TResult[];
zipWith<T, U, TResult>(fn: (x: T, y: U) => TResult): (list1: T[], list2: U[]) => TResult[];
```

</details>

<details>

<summary><strong>R.zipWith</strong> source</summary>

```javascript
import { curry } from './curry.js'
import { take } from './take.js'

function zipWithFn(
  fn, x, y
){
  return take(x.length > y.length ? y.length : x.length, x).map((xInstance, i) => fn(xInstance, y[ i ]))
}

export const zipWith = curry(zipWithFn)
```

</details>

<details>

<summary><strong>Tests</strong></summary>

```javascript
import { add } from './add.js'
import { zipWith } from './zipWith.js'

const list1 = [ 1, 2, 3 ]
const list2 = [ 10, 20, 30, 40 ]
const list3 = [ 100, 200 ]

test('when second list is shorter', () => {
  const result = zipWith(
    add, list1, list3
  )
  expect(result).toEqual([ 101, 202 ])
})

test('when second list is longer', () => {
  const result = zipWith(
    add, list1, list2
  )
  expect(result).toEqual([ 11, 22, 33 ])
})
```

</details>

<details>

<summary><strong>TypeScript</strong> test</summary>

```typescript
import {zipWith} from 'rambda'

const list1 = [1, 2]
const list2 = [10, 20, 30]

describe('R.zipWith', () => {
  it('happy', () => {
    const result = zipWith(
      (x, y) => {
        x // $ExpectType number
        y // $ExpectType number
        return `${x}-${y}`
      },
      list1,
      list2
    )

    result // $ExpectType string[]
  })
  it('curried', () => {
    const result = zipWith((x, y) => {
      x // $ExpectType unknown
      y // $ExpectType unknown
      return `${x}-${y}`
    })(list1, list2)

    result // $ExpectType string[]
  })
})
```

</details>

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#zipWith)

## ❯ CHANGELOG

9.4.2 

- Fix TS issue when `R.take` is used as part of `R.pipe`.

Moving away from `Ramda` types which are problematic in this case:

```typescript
const data = ['foo', 'bar', 'baz', 'qux']
const result = piped(
	data,
	filter(
		x => x.length >= 2
	),
	takeLast(2),
)
```

9.4.1

- Fix bug with `R.differenceWith` when two arrays has same length - [Issue #750](https://github.com/selfrefactor/rambda/issues/757)

- Allow path input to not be transformed when string numbers are there - [Issue #750](https://github.com/selfrefactor/rambda/issues/750)

9.4.0

- Fix `deno` release

- Fix too strict `true` condition in `R.ifElse` - [Issue #750](https://github.com/selfrefactor/rambda/issues/750)

- Change `R.groupBy` typings to match `@types/ramda` typings

9.3.0

- Breaking change in relation to TS typings of `R.assoc`, `R.dissoc` and `R.modify` - https://github.com/ramda/types/pull/37

- Add `R.isNotEmpty` as it is new method in `Ramda`

- Fix `R.head`/`R.last` TS definition - It returns `undefined` if array has length of 0. Before 

9.2.1

- Broken `Deno` build - [Issue #731](https://github.com/selfrefactor/rambda/issues/731)

9.2.0

- `R.once` TS type definition miss to context argument and its type - [Issue #728](https://github.com/selfrefactor/rambda/issues/728)

- Fix implementation of `R.unless` function - https://github.com/selfrefactor/rambda/pull/726 

9.1.1

- Faster R.equals with Object.is short circuit - https://github.com/selfrefactor/rambda/pull/725

- Fix R.cond transform is unary - https://github.com/selfrefactor/rambda/issues/720

9.1.0

Add these methods

- insert
- insertAll
- lt
- lte
- isNotNil
- pickBy
- pathSatisfies
- swap
- mergeDeepLeft

9.0.1

- Fix bad TS typings, due to missing declaration - [Issue #716](https://github.com/selfrefactor/rambda/issues/716)

9.0.0

Breaking change in TS definitions of `lenses` as now they are synced to `Ramda` types.

- Add `R.sortWith` - [Issue #707](https://github.com/selfrefactor/rambda/issues/707)

- Add `R.innerJoin`, `R.gt`, `R.gte`, `R.reduceBy`, `R.hasIn`

8.6.0

- Wrong typing for `R.dissocPath` - [Issue #709](https://github.com/selfrefactor/rambda/issues/709)

- Update build dependencies

8.5.0

- Revert changes in `R.anyPass` introduced in `8.4.0` release. The reason is that the change was breaking the library older than `5.2.0` TypeScript.

- Wrong `R.partial` TS definition  - [Issue #705](https://github.com/selfrefactor/rambda/issues/705)

- Add `R.dropRepeatsBy`

- Add `R.empty`

- Add `R.eqBy`

- Add `R.forEachObjIndexed`

8.4.0

- Add `R.dissocPath`

- Fix TS definitions of `R.head/R.last` and add missing handle of empty string

- Add `R.removeIndex` - method was before only in `Rambdax`, but now since `R.dissocPath` is using it, it is added to main library.

- Allow `R.omit` to pass numbers as part of properties to omit, i.e. `R.omit(['a', 1], {a: {1: 1, 2: 2}})`

- R.keys always returns strings - [MR #700](https://github.com/selfrefactor/rambda/pull/700)

- Improve `R.prepend/R.append` type interference - [MR #699](https://github.com/selfrefactor/rambda/pull/699)

- Change `R.reduce` TS definitions so index is always received - [MR #696](https://github.com/selfrefactor/rambda/pull/696)

- Functions as a type guard in `R.anyPass` TS definitions - [MR #695](https://github.com/selfrefactor/rambda/pull/695)

- Fix R.append's curried type - [MR #694](https://github.com/selfrefactor/rambda/pull/694)

- Fix cannot compare errors in `Deno` with `R.equals` - [Issue #704](https://github.com/selfrefactor/rambda/issues/704).

- Fix cannot compare `BigInt` with `R.equals` 

8.3.0

Add the following methods:

- binary
- call
- collectBy
- comparator
- composeWith

8.2.0

Add the following methods:

- addIndex
- addIndexRight
- ap
- aperture
- applyTo
- ascend
- descend

8.1.0

- Fix input order of TS definitions for `R.propEq` method  - [Issue #688](https://github.com/selfrefactor/rambda/issues/688). The issue was due to 8.0.0 was shipped with TS definitions of `7.5.0` release.

- Add `R.differenceWith` method  - [Issue #91](https://github.com/selfrefactor/rambdax/issues/91)

8.0.0

- handle falsy values in merge methods - https://github.com/ramda/ramda/pull/3222

- `R.head`/`R.last` don't return `undefined` for non-empty arrays

- `R.type` supports dates in TS definition - `Rambda` already did support dates in JS.

- Improve typings of `R.endsWith/startsWith` with regard to `string` input. - [PR #622](https://github.com/selfrefactor/rambda/pull/622)

- Handle list as falsy value in `R.reduce` - [Ramda MR](https://github.com/ramda/ramda/pull/2997/files)

- `R.nop` is removed - it will be moved to `Rambdax` as `R.noop`

- `R.includes` is no longer using string literal in TypeScript definitions

> Reason for breaking change - synchronize with Ramda `0.29.0` release:

- change order of `R.propEq` - [Ramda MR](https://github.com/ramda/ramda/pull/2938/files)

7.5.0

- IMPORTANT: Remove `export` property in `package.json` in order to allow `Rambda`  support for projects with `"type": "module"` in `package.json` - [Issue #667](https://github.com/selfrefactor/rambda/issues/657)

- Add `R.unnest` - [Rambdax issue 89](https://github.com/selfrefactor/rambdax/issues/89)

- `R.uniq` is not using `R.equals` as Ramda does - [Issue #88](https://github.com/selfrefactor/rambdax/issues/88)

- Fix `R.path(['non','existing','path'], obj)` TS definition as 7.4.0 release caused TS errors - [Issue #668](https://github.com/selfrefactor/rambda/issues/668)

7.4.0

- Synchronize with `@types/ramda` - `R.prop`, `R.path`, `R.pickAll`

- Remove `esm` Rollup output due to tree-shaking issues.

- Upgrade all dev dependencies.

7.3.0

- Important - changing import declaration in `package.json` in order to fix tree-shaking issue - [Issue #647](https://github.com/selfrefactor/rambda/issues/647)

- Add `R.modify`

- Allow multiple inputs in TypeScript versions of `R.anyPass` and `R.allPass` - [Issue #642](https://github.com/selfrefactor/rambda/issues/604)

- Using wrong clone of object in `R.mergeDeepRight` - [Issue #650](https://github.com/selfrefactor/rambda/issues/650)

- Missing early return in `R.where` - [Issue #648](https://github.com/selfrefactor/rambda/issues/648)

- `R.allPass` doesn't accept more than 1 parameters for function predicates- [Issue #604](https://github.com/selfrefactor/rambda/issues/604)

7.2.1

- Remove bad typings of `R.propIs` which caused the library to cannot be build with TypeScript. 

- Drop support for `Wallaby` as per [https://github.com/wallabyjs/public/issues/3037](https://github.com/wallabyjs/public/issues/3037)

7.2.0

- Wrong `R.update` if index is `-1` - [PR #593](https://github.com/selfrefactor/rambda/pull/593)

- Wrong curried typings in `R.anyPass` - [Issue #642](https://github.com/selfrefactor/rambda/issues/642)

- `R.modifyPath` not exported - [Issue #640](https://github.com/selfrefactor/rambda/issues/640)

- Add new method `R.uniqBy`. Implementation is coming from [Ramda MR#2641](https://github.com/ramda/ramda/pull/2641)

- Apply the following changes from `@types/rambda`:

-- [https://github.com/DefinitelyTyped/DefinitelyTyped/commit/bab47272d52fc7bb81e85da36dbe9c905a04d067](add `AnyFunction` and `AnyConstructor`)

-- Improve `R.ifElse` typings - https://github.com/DefinitelyTyped/DefinitelyTyped/pull/59291

-- Make `R.propEq` safe for `null/undefined` arguments - https://github.com/ramda/ramda/pull/2594/files

7.1.4

- `R.mergeRight` not found on `Deno` import - [Issue #633](https://github.com/selfrefactor/rambda/issues/633)

7.1.0

- Add `R.mergeRight` - introduced by Ramda's latest release. While Ramda renames `R.merge`, Rambda will keep `R.merge`.

- Rambda's `pipe/compose` doesn't return proper length of composed function which leads to issue with `R.applySpec`. It was fixed by using Ramda's `pipe/compose` logic - [Issue #627](https://github.com/selfrefactor/rambda/issues/627)

- Replace `Async` with `Promise` as return type of `R.type`.

- Add new types as TypeScript output for `R.type` - "Map", "WeakMap", "Generator", "GeneratorFunction", "BigInt", "ArrayBuffer"

- Add `R.juxt` method

- Add `R.propSatisfies` method

- Add new methods after `Ramda` version upgrade to `0.28.0`:

-- R.count
-- R.modifyPath
-- R.on
-- R.whereAny
-- R.partialObject

7.0.3

Rambda.none has wrong logic introduced in version `7.0.0` - [Issue #625](https://github.com/selfrefactor/rambda/issues/625)

7.0.2

Rambda doesn't work with `pnpm` due to wrong export configuration - [Issue #619](https://github.com/selfrefactor/rambda/issues/619)

7.0.1

- Wrong ESM export configuration in `package.json` - [Issue #614](https://github.com/selfrefactor/rambda/issues/614)

7.0.0

- Breaking change - sync `R.compose`/`R.pipe` with `@types/ramda`. That is significant change so as safeguard, it will lead a major bump. Important - this lead to raising required TypeScript version to `4.2.2`. In other words, to use `Rambda` you'll need TypeScript version `4.2.2` or newer.

Related commit in `@types/ramda` - https://github.com/DefinitelyTyped/DefinitelyTyped/commit/286eff4f76d41eb8f091e7437eabd8a60d97fc1f#diff-4f74803fa83a81e47cb17a7d8a4e46a7e451f4d9e5ce2f1bd7a70a72d91f4bc1

There are several other changes in `@types/ramda` as stated in [this comment](https://github.com/ramda/ramda/issues/2976#issuecomment-990408945). This leads to change of typings for the following methods in **Rambda**:

-- R.unless

-- R.toString

-- R.ifElse

-- R.always

-- R.complement

-- R.cond

-- R.is

-- R.sortBy

-- R.dissoc

-- R.toPairs

-- R.assoc

-- R.toLower

-- R.toUpper

- One more reason for the breaking change is changing of export declarations in `package.json` based on [this blog post](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/#packagejson-exports-imports-and-self-referencing) and [this merged Ramda's PR](https://github.com/ramda/ramda/pull/2999). This also led to renaming of `babel.config.js` to `babel.config.cjs`. 

- Add `R.apply`, `R.bind` and `R.unapply`

- `R.startsWith/R.endsWith` now support lists as inputs. This way, it matches current Ramda behavior. 

- Remove unused typing for `R.chain`.

- `R.map`/`R.filter` no longer accept bad inputs as iterable. This way, Rambda behaves more like Ramda, which also throws.

- Make `R.lastIndexOf` follow the logic of `R.indexOf`.

- Change `R.type` logic to Ramda logic. This way, `R.type` can return `Error` and `Set` as results.

- Add missing logic in `R.equals` to compare sets - [Issue #599](https://github.com/selfrefactor/rambda/issues/599)

- Improve list cloning - [Issue #595](https://github.com/selfrefactor/rambda/issues/595)

- Handle multiple inputs with `R.allPass` and `R.anyPass` - [Issue #604](https://github.com/selfrefactor/rambda/issues/604)

- Fix `R.length` wrong logic with inputs as `{length: 123}` - [Issue #606](https://github.com/selfrefactor/rambda/issues/606).

- Improve non-curry typings of `R.merge` by using types from [mobily/ts-belt](https://github.com/mobily/ts-belt).

- Improve performance of `R.uniqWith`.

- Wrong `R.update` if index is `-1` - [PR #593](https://github.com/selfrefactor/rambda/pull/593)

- Make `R.eqProps` safe for falsy inputs - based on [this opened Ramda PR](https://github.com/ramda/ramda/pull/2943).

- Incorrect benchmarks for `R.pipe/R.compose` - [Issue #608](https://github.com/selfrefactor/rambda/issues/608)

- Fix `R.last/R.head` typings - [Issue #609](https://github.com/selfrefactor/rambda/issues/609) 

6.9.0

- Fix slow `R.uniq` methods - [Issue #581](https://github.com/selfrefactor/rambda/issues/581)

Fixing `R.uniq` was done by improving `R.indexOf` which has performance implication to all methods importing `R.indexOf`:

- R.includes
- R.intersection
- R.difference
- R.excludes
- R.symmetricDifference
- R.union

- R.without no longer support the following case - `without('0:1', ['0', '0:1']) // => ['0']`. Now it throws as the first argument should be a list, not a string. Ramda, on the other hand, returns an empty list - https://github.com/ramda/ramda/issues/3086. 

6.8.3

- Fix TypeScript build process with `rambda/immutable` - [Issue #572](https://github.com/selfrefactor/rambda/issues/572)

- Add `R.objOf` method

- Add `R.mapObjIndexed` method

- Publish shorter README.md version to NPM

6.8.0

- `R.has` use `Object.prototype.hasOwnProperty`- [Issue #572](https://github.com/selfrefactor/rambda/issues/572)

- Expose `immutable.ts` typings which are Rambda typings with `readonly` statements - [Issue #565](https://github.com/selfrefactor/rambda/issues/565)

- Fix `R.intersection` wrong order compared to Ramda.

- `R.path` wrong return of `null` instead of `undefined` when path value is `null` - [PR #577](https://github.com/selfrefactor/rambda/pull/577)

6.7.0

- Remove `ts-toolbelt` types from TypeScript definitions. Most affected are the following methods, which lose one of its curried definitions:

1. R.maxBy
2. R.minBy
3. R.pathEq
4. R.viewOr
5. R.when
6. R.merge
7. R.mergeDeepRight
8. R.mergeLeft

6.6.0

- Change `R.piped` typings to mimic that of `R.pipe`. Main difference is that `R.pipe` is focused on unary functions.

- Fix wrong logic when `R.without` use `R.includes` while it should use array version of `R.includes`.

- Use uglify plugin for UMD bundle.

- Remove `dist` folder from `.gitignore` in order to fix `Deno` broken package. [Issue #570](https://github.com/selfrefactor/rambda/issues/570)

- Improve `R.fromPairs` typings - [Issue #567](https://github.com/selfrefactor/rambda/issues/567)

6.5.3

- Wrong logic where `R.without` use `R.includes` while it should use the array version of `R.includes`

This is Ramda bug, that Rambda also has before this release - https://github.com/ramda/ramda/issues/3086

6.5.2

- Wrong `R.defaultTo` typings - changes introduced in v6.5.0 are missing their TS equivalent.

- Update dependencies

6.5.1

Fix wrong versions in changelog

6.5.0

- `R.defaultTo` no longer accepts infinite inputs, thus it follows Ramda implementation.

- `R.equals` supports equality of functions.

- `R.pipe` doesn't use `R.compose`.

- Close [Issue #561](https://github.com/selfrefactor/rambda/issues/561) - export several internal TS interfaces and types

- Close [Issue #559](https://github.com/selfrefactor/rambda/issues/559) - improve `R.propOr` typings

- Add `CHANGELOG.md` file in release files list

> This is only part of the changelog. You can read the full text in [CHANGELOG.md](CHANGELOG.md) file.

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#-changelog)

## ❯ Additional info

> Most influential contributors(in alphabetical order)

- ![farwayer avatar](https://avatars.githubusercontent.com/farwayer) [@farwayer](https://github.com/farwayer) - improving performance in R.find, R.filter; give the idea how to make benchmarks more reliable;

- ![thejohnfreeman avatar](https://avatars.githubusercontent.com/thejohnfreeman) [@thejohnfreeman](https://github.com/thejohnfreeman) - add R.assoc, R.chain;

- ![peeja avatar](https://avatars.githubusercontent.com/peeja) [@peeja](https://github.com/peeja) - add several methods and fix mutiple issues; provides great MR documentation

- ![helmuthdu avatar](https://avatars.githubusercontent.com/helmuthdu) [@helmuthdu](https://github.com/helmuthdu) - add R.clone; help improve code style;

- ![jpgorman avatar](https://avatars.githubusercontent.com/jpgorman) [@jpgorman](https://github.com/jpgorman) - add R.zip, R.reject, R.without, R.addIndex;

- ![ku8ar avatar](https://avatars.githubusercontent.com/ku8ar) [@ku8ar](https://github.com/ku8ar) - add R.slice, R.propOr, R.identical, R.propIs and several math related methods; introduce the idea to display missing Ramda methods;

- ![romgrk avatar](https://avatars.githubusercontent.com/romgrk) [@romgrk](https://github.com/romgrk) - add R.groupBy, R.indexBy, R.findLast, R.findLastIndex;

- ![squidfunk avatar](https://avatars.githubusercontent.com/squidfunk) [@squidfunk](https://github.com/squidfunk) - add R.assocPath, R.symmetricDifference, R.difference, R.intersperse;

- ![synthet1c avatar](https://avatars.githubusercontent.com/synthet1c) [@synthet1c](https://github.com/synthet1c) - add all lenses methods; add R.applySpec, R.converge;

- ![vlad-zhukov avatar](https://avatars.githubusercontent.com/vlad-zhukov) [@vlad-zhukov](https://github.com/vlad-zhukov) - help with configuring Rollup, Babel; change export file to use ES module exports;

> Rambda references

- [Interview with Dejan Totef at SurviveJS blog](https://survivejs.com/blog/rambda-interview/)

- [Awesome functional Javascript programming libraries](https://github.com/stoeffel/awesome-fp-js#libraries)

- [Overview of Rambda pros/cons](https://mobily.github.io/ts-belt/docs/#rambda-%EF%B8%8F)

> Links to Rambda

- [awesome-fp-js](https://github.com/stoeffel/awesome-fp-js)

- [Web Tools Weekly #280](https://mailchi.mp/webtoolsweekly/web-tools-280)

- [awesome-docsify](https://github.com/docsifyjs/awesome-docsify)

> Deprecated from `Used by` section

- [SAP's Cloud SDK](https://github.com/SAP/cloud-sdk) - This repo doesn't uses `Rambda` since *October/2020* [commit that removes Rambda](https://github.com/SAP/cloud-sdk/commit/b29b4f915c4e4e9c2441e7b6b67cf83dac1fdac3)

[![---------------](https://raw.githubusercontent.com/selfrefactor/rambda/master/files/separator.png)](#-additional-info)

## My other libraries

<table>
    <tbody>
        <tr valign="top">
            <td width="20%" align="center">
                <h4>Niketa theme</h4>
                <a href="https://marketplace.visualstudio.com/items?itemName=selfrefactor.Niketa-theme">Collection of 9 light VSCode themes</a>
            </td>
            <td width="20%" align="center">
                <h4>Niketa dark theme</h4>
                <a href="https://marketplace.visualstudio.com/items?itemName=selfrefactor.niketa-dark-theme">Collection of 9 dark VSCode themes</a>
            </td>
            <td width="20%" align="center">
                <h4>String-fn</h4>
                <a href="https://github.com/selfrefactor/services/tree/master/packages/string-fn">String utility library</a>
            </td>
            <td width="20%" align="center">
                <h4>Useful Javascript libraries</h4>
                <a href="https://github.com/selfrefactor/useful-javascript-libraries">Large collection of JavaScript,TypeScript and Angular related repos links</a>
            </td>
            <td width="20%" align="center">
                <h4>Run-fn</h4>
                <a href="https://github.com/selfrefactor/services/tree/master/packages/run-fn">CLI commands for lint JS/TS files, commit git changes and upgrade of dependencies</a>
            </td>
        </tr>
    </tbody>
</table>

## Stargazers over time

[![Stargazers over time](https://starchart.cc/selfrefactor/rambda.svg)](https://starchart.cc/selfrefactor/rambda)