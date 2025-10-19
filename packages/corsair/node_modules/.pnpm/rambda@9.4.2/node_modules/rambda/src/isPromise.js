import { type } from './type.js'

export function isPromise(x){
  return type(x) === 'Promise'
}
