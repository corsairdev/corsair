import { curry } from './curry.js'
import { prop } from './prop.js'

function propSatisfiesFn(
  predicate, property, obj
){
  return predicate(prop(property, obj))
}

export const propSatisfies = curry(propSatisfiesFn)
