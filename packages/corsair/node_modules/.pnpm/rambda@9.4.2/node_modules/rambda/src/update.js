import { cloneList } from './_internals/cloneList.js'
import { curry } from './curry.js'

export function updateFn(
  index, newValue, list
){
  const clone = cloneList(list)
  if (index === -1) return clone.fill(newValue, index)

  return clone.fill(
    newValue, index, index + 1
  )
}

export const update = curry(updateFn)
