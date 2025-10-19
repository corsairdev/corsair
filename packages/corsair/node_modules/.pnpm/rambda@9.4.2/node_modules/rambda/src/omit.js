import { createPath } from './_internals/createPath.js'
import { includes } from './_internals/includes.js'

export function omit(propsToOmit, obj){
  if (arguments.length === 1) return _obj => omit(propsToOmit, _obj)

  if (obj === null || obj === undefined)
    return undefined

  const propsToOmitValue = createPath(propsToOmit, ',')
  const willReturn = {}

  for (const key in obj)
    if (!includes(key, propsToOmitValue))
      willReturn[ key ] = obj[ key ]

  return willReturn
}
