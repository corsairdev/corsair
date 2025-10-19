import { _arity } from './_internals/_arity.js'

function _curryN(
  n, cache, fn
){
  return function (){
    let ci = 0
    let ai = 0
    const cl = cache.length
    const al = arguments.length
    const args = new Array(cl + al)
    while (ci < cl){
      args[ ci ] = cache[ ci ]
      ci++
    }
    while (ai < al){
      args[ cl + ai ] = arguments[ ai ]
      ai++
    }
    const remaining = n - args.length

    return args.length >= n ?
      fn.apply(this, args) :
      _arity(remaining, _curryN(
        n, args, fn
      ))
  }
}

export function curryN(n, fn){
  if (arguments.length === 1) return _fn => curryN(n, _fn)

  if (n > 10){
    throw new Error('First argument to _arity must be a non-negative integer no greater than ten')
  }

  return _arity(n, _curryN(
    n, [], fn
  ))
}
