import { keys } from './_internals/keys.js'

export function forEachObjIndexedFn(fn, obj){
  let index = 0
  const listKeys = keys(obj)
  const len = listKeys.length

  while (index < len){
    const key = listKeys[ index ]
    fn(
      obj[ key ], key, obj
    )
    index++
  }

  return obj
}

export function forEachObjIndexed(fn, list){
  if (arguments.length === 1) return _list => forEachObjIndexed(fn, _list)
  if (list === undefined) return

  return forEachObjIndexedFn(fn, list)
}
