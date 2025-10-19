import { curry } from './curry.js'
import { equals } from './equals.js'
import { prop } from './prop.js'

function eqPropsFn(
  property, objA, objB
){
  return equals(prop(property, objA), prop(property, objB))
}

export const eqProps = curry(eqPropsFn)
