import { createPath } from './_internals/createPath.js'
import { isArray } from './_internals/isArray.js'
import { assoc } from './assoc.js'
import { curry } from './curry.js'
import { path as pathModule } from './path.js'

export function modifyPathFn(
  pathInput, fn, object
){
  const path = createPath(pathInput)
  if (path.length === 1){
    return {
      ...object,
      [ path[ 0 ] ] : fn(object[ path[ 0 ] ]),
    }
  }
  if (pathModule(path, object) === undefined) return object

  const val = modifyPath(
    Array.prototype.slice.call(path, 1),
    fn,
    object[ path[ 0 ] ]
  )
  if (val === object[ path[ 0 ] ]){
    return object
  }

  return assoc(
    path[ 0 ], val, object
  )
}

export const modifyPath = curry(modifyPathFn)
