import { isArray } from './_internals/isArray.js'
import { mapArray } from './map.js'

export function unwind(property, obj){
  if (arguments.length === 1){
    return _obj => unwind(property, _obj)
  }

  if (!isArray(obj[ property ])) return [ obj ]

  return mapArray(x => ({
    ...obj,
    [ property ] : x,
  }),
  obj[ property ])
}
