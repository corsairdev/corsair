import { curry } from './curry.js'
import { equals } from './equals.js'
import { path } from './path.js'

function pathEqFn(
  pathToSearch, target, input
){
  return equals(path(pathToSearch, input), target)
}

export const pathEq = curry(pathEqFn)
