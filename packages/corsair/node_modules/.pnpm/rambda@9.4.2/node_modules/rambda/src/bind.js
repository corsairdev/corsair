import { curryN } from './curryN.js'

export function bind(fn, thisObj){
  if (arguments.length === 1){
    return _thisObj => bind(fn, _thisObj)
  }

  return curryN(fn.length, (...args) => fn.apply(thisObj, args))
}
