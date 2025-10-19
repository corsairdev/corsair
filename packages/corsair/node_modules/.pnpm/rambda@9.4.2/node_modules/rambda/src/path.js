import { createPath } from './_internals/createPath.js'

export function pathFn(pathInput, obj){
  let willReturn = obj
  let counter = 0

  const pathArrValue = createPath(pathInput)

  while (counter < pathArrValue.length){
    if (willReturn === null || willReturn === undefined){
      return undefined
    }
    if (willReturn[ pathArrValue[ counter ] ] === null) return undefined

    willReturn = willReturn[ pathArrValue[ counter ] ]
    counter++
  }

  return willReturn
}

export function path(pathInput, obj){
  if (arguments.length === 1) return _obj => path(pathInput, _obj)

  if (obj === null || obj === undefined){
    return undefined
  }

  return pathFn(pathInput, obj)
}
