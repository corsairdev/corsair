import { isInteger } from './isInteger.js'

export function createPathInput(path){
  return typeof path === 'string' ?
    path.split('.').map(x => isInteger(Number(x)) ? Number(x) : x) :
    path
}
