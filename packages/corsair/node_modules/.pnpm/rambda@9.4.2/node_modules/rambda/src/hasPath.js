import { path } from './path.js'

export function hasPath(pathInput, obj){
  if (arguments.length === 1){
    return objHolder => hasPath(pathInput, objHolder)
  }

  return path(pathInput, obj) !== undefined
}
