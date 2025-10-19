import { assocPath } from './assocPath.js'
import { lens } from './lens.js'
import { path } from './path.js'

export function lensPath(key){
  return lens(path(key), assocPath(key))
}
