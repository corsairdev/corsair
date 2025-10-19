import { addIndex } from './addIndex.js'

export function addIndexRight(originalFunction){
  return addIndex(
    originalFunction,
    listLength => listLength - 1,
    x => x - 1
  )
}
