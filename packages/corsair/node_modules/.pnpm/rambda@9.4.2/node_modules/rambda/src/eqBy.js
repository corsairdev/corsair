import { curry } from './curry.js'
import { equals } from './equals.js'

export function eqByFn(
  fn, a, b
){
  return equals(fn(a), fn(b))
}

export const eqBy = curry(eqByFn)
