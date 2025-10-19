import { mergeDeepRight } from './mergeDeepRight.js'

export function partialObject(fn, input){
  return nextInput => fn(mergeDeepRight(nextInput, input))
}
