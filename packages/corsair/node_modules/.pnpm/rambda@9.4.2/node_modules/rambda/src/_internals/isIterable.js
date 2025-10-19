import { type } from '../type.js'

export function isIterable(input){
  return Array.isArray(input) || type(input) === 'Object'
}
