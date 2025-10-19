import { curry } from './curry.js'
import { is } from './is.js'

function propIsFn(
  targetPrototype, property, obj
){
  return is(targetPrototype, obj[ property ])
}

export const propIs = curry(propIsFn)
