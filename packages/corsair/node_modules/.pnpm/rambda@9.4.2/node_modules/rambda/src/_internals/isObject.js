import { type } from '../type.js'

export function isObject(input){
  return type(input) === 'Object'
}
