import { curry } from './curry.js'

function unlessFn(
  predicate, whenFalseFn, input
){
  if (predicate(input)) return input

  return whenFalseFn(input)
}

export const unless = curry(unlessFn)