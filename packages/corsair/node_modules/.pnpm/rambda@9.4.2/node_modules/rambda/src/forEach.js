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
