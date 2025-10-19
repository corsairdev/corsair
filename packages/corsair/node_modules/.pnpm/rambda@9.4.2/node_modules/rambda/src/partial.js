import { isArray } from './_internals/isArray.js'

export function partial(fn, ...args){
  const len = fn.length

  // If a single array argument is given, those are the args (a la Ramda).
  // Otherwise, the variadic arguments are the args.
  const argList = args.length === 1 && isArray(args[0]) ? args[0] : args

  return (...rest) => {
    if (argList.length + rest.length >= len){
      return fn(...argList, ...rest)
    }

    return partial(fn, ...[ ...argList, ...rest ])
  }
}
