import { isArray } from './_internals/isArray.js'
import { equals } from './equals.js'

export function dropRepeats(list){
  if (!isArray(list)){
    throw new Error(`${ list } is not a list`)
  }

  const toReturn = []

  list.reduce((prev, current) => {
    if (!equals(prev, current)){
      toReturn.push(current)
    }

    return current
  }, undefined)

  return toReturn
}
