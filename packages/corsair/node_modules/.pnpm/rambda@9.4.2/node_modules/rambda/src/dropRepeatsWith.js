import { isArray } from './_internals/isArray.js'

export function dropRepeatsWith(predicate, list){
  if (arguments.length === 1){
    return _iterable => dropRepeatsWith(predicate, _iterable)
  }

  if (!isArray(list)){
    throw new Error(`${ list } is not a list`)
  }

  const toReturn = []

  list.reduce((prev, current) => {
    if (prev === undefined){
      toReturn.push(current)

      return current
    }
    if (!predicate(prev, current)){
      toReturn.push(current)
    }

    return current
  }, undefined)

  return toReturn
}
