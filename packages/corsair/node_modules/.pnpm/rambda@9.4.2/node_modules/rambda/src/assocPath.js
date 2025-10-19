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
