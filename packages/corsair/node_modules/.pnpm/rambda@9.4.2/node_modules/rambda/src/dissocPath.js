import { createPath } from '../src/_internals/createPath.js'
import { isArray } from './_internals/isArray.js'
import { isIndexInteger } from './_internals/isInteger.js'
import { omit } from './omit.js'
import { path } from './path.js'
import { removeIndex } from './removeIndex.js'
import { update } from './update.js'

export function dissocPath(pathInput, input){
  if (arguments.length === 1) return _obj => dissocPath(pathInput, _obj)

  const pathArrValue = createPath(pathInput)
  // this {...input} spread could be done to satisfy ramda specs, but this is done on so many places
  // TODO: add warning that Rambda simply returns input if path is empty
  if (pathArrValue.length === 0) return input

  const pathResult = path(pathArrValue, input)
  if (pathResult === undefined) return input

  const index = pathArrValue[ 0 ]
  const condition =
    typeof input !== 'object' ||
    input === null ||
    !input.hasOwnProperty(index)
  if (pathArrValue.length > 1){
    const nextInput = condition ?
      isIndexInteger(pathArrValue[ 1 ]) ?
        [] :
        {} :
      input[ index ]
    const nextPathInput = Array.prototype.slice.call(pathArrValue, 1)
    const intermediateResult = dissocPath(
      nextPathInput, nextInput, input
    )
    if (isArray(input)) return update(
      index, intermediateResult, input
    )

    return {
      ...input,
      [ index ] : intermediateResult,
    }
  }
  if (isArray(input)) return removeIndex(index, input)

  return omit([ index ], input)
}
