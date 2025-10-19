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
