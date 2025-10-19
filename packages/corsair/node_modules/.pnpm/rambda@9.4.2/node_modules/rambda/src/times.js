import { isInteger } from './_internals/isInteger.js'
import { map } from './map.js'
import { range } from './range.js'

export function times(fn, howMany){
  if (arguments.length === 1) return _howMany => times(fn, _howMany)
  if (!isInteger(howMany) || howMany < 0){
    throw new RangeError('n must be an integer')
  }

  return map(fn, range(0, howMany))
}
