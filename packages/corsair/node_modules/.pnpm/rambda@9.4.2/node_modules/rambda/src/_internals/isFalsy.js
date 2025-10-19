import { type } from '../type.js'
import { isArray } from './isArray.js'

export function isFalsy(x){
  if (isArray(x)){
    return x.length === 0
  }
  if (type(x) === 'Object'){
    return Object.keys(x).length === 0
  }

  return !x
}
