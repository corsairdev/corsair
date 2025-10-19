import { _concat } from './_internals/utils.js'
import { curryN } from './curryN.js'

export function addIndex(
  originalFunction,
  initialIndexFn = () => 0,
  loopIndexChange = x => x + 1
){
  return curryN(originalFunction.length, function (){
    const origFn = arguments[ 0 ]
    const list = arguments[ arguments.length - 1 ]
    let idx = initialIndexFn(list.length)
    const args = Array.prototype.slice.call(arguments, 0)
    args[ 0 ] = function (){
      const result = origFn.apply(this, _concat(arguments, [ idx, list ]))
      idx = loopIndexChange(idx)

      return result
    }

    return originalFunction.apply(this, args)
  })
}
