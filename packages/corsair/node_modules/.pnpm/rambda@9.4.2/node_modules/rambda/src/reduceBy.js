import { clone } from './clone.js'
import { curry } from './curry.js'
import { has } from './has.js'
import { reduce } from './reduce.js'

function reduceByFunction(
  valueFn, valueAcc, keyFn, acc, elt
){
  const key = keyFn(elt)
  const value = valueFn(has(key, acc) ? acc[ key ] : clone(valueAcc), elt)

  acc[ key ] = value

  return acc
}

export function reduceByFn(
  valueFn, valueAcc, keyFn, list
){
  return reduce(
    (acc, elt) => reduceByFunction(
      valueFn, valueAcc, keyFn, acc, elt
    ),
    {},
    list
  )
}

export const reduceBy = curry(reduceByFn)
