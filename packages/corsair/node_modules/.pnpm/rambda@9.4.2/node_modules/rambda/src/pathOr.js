import { curry } from './curry.js'
import { defaultTo } from './defaultTo.js'
import { path } from './path.js'

function pathOrFn(
  defaultValue, pathInput, obj
){
  return defaultTo(defaultValue, path(pathInput, obj))
}

export const pathOr = curry(pathOrFn)
