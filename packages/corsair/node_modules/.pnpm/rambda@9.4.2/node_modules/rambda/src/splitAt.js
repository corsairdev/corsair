import { isArray } from './_internals/isArray.js'
import { drop } from './drop.js'
import { maybe } from './maybe.js'
import { take } from './take.js'

export function splitAt(index, input){
  if (arguments.length === 1){
    return _list => splitAt(index, _list)
  }
  if (!input) throw new TypeError(`Cannot read property 'slice' of ${ input }`)

  if (!isArray(input) && typeof input !== 'string') return [ [], [] ]

  const correctIndex = maybe(
    index < 0,
    input.length + index < 0 ? 0 : input.length + index,
    index
  )

  return [ take(correctIndex, input), drop(correctIndex, input) ]
}
