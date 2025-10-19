import { curry } from './curry.js'

function _includesWith(
  pred, x, list
){
  let idx = 0
  const len = list.length

  while (idx < len){
    if (pred(x, list[ idx ]))
      return true

    idx += 1
  }

  return false
}
function _filter(fn, list){
  let idx = 0
  const len = list.length
  const result = []

  while (idx < len){
    if (fn(list[ idx ]))
      result[ result.length ] = list[ idx ]

    idx += 1
  }

  return result
}

export function innerJoinFn(
  pred, xs, ys
){
  return _filter(x => _includesWith(
    pred, x, ys
  ), xs)
}

export const innerJoin = curry(innerJoinFn)
