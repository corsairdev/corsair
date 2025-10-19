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
