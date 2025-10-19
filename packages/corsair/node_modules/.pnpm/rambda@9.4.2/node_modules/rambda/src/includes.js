import { isArray } from './_internals/isArray.js'
import { _indexOf } from './equals.js'

export function includes(valueToFind, iterable){
  if (arguments.length === 1)
    return _iterable => includes(valueToFind, _iterable)
  if (typeof iterable === 'string'){
    return iterable.includes(valueToFind)
  }
  if (!iterable){
    throw new TypeError(`Cannot read property \'indexOf\' of ${ iterable }`)
  }
  if (!isArray(iterable)) return false

  return _indexOf(valueToFind, iterable) > -1
}
