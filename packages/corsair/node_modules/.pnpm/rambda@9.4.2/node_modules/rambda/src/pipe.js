import { _arity } from './_internals/_arity.js'
import { reduceFn } from './reduce.js'

export function _pipe(f, g){
  return function (){
    return g.call(this, f.apply(this, arguments))
  }
}

export function pipe(){
  if (arguments.length === 0){
    throw new Error('pipe requires at least one argument')
  }

  return _arity(arguments[ 0 ].length,
    reduceFn(
      _pipe,
      arguments[ 0 ],
      Array.prototype.slice.call(
        arguments, 1, Infinity
      )
    ))
}
