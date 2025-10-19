import { isInteger } from './isInteger.js'

export function createPath(path, delimiter = '.'){
  return typeof path === 'string' ?
    path.split(delimiter).map(x => isInteger(x) ? Number(x) : x) :
    path
}
