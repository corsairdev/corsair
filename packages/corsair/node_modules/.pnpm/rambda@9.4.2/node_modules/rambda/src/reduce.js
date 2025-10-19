import { isArray } from './_internals/isArray.js'
import { curry } from './curry.js'

class ReduceStopper{
  constructor(value){
    this.value = value
  }
}

export function reduceFn(
  reducer, acc, list
){
  if (list == null){
    return acc
  }
  if (!isArray(list)){
    throw new TypeError('reduce: list must be array or iterable')
  }
  let index = 0
  const len = list.length

  while (index < len){
    acc = reducer(
      acc, list[ index ], index, list
    )
    if (acc instanceof ReduceStopper){
      return acc.value
    }
    index++
  }

  return acc
}

export const reduce = curry(reduceFn)
export const reduceStopper = value => new ReduceStopper(value)
