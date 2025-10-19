import { type } from './type.js'

export function values(obj){
  if (type(obj) !== 'Object') return []
  return Object.values(obj)
}