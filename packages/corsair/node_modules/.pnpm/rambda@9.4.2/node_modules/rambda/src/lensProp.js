import { assoc } from './assoc.js'
import { lens } from './lens.js'
import { prop } from './prop.js'

export function lensProp(key){
  return lens(prop(key), assoc(key))
}
