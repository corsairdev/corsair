import { curry } from './curry.js'
import { take } from './take.js'

function zipWithFn(
  fn, x, y
){
  return take(x.length > y.length ? y.length : x.length, x).map((xInstance, i) => fn(xInstance, y[ i ]))
}

export const zipWith = curry(zipWithFn)
