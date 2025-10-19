import { curry } from './curry.js'

export function mergeWithFn(
  mergeFn, aInput, bInput
){
  const a = aInput ?? {}
  const b = bInput ?? {}
  const willReturn = {}

  Object.keys(a).forEach(key => {
    if (b[ key ] === undefined) willReturn[ key ] = a[ key ]
    else willReturn[ key ] = mergeFn(a[ key ], b[ key ])
  })

  Object.keys(b).forEach(key => {
    if (willReturn[ key ] !== undefined) return

    if (a[ key ] === undefined) willReturn[ key ] = b[ key ]
    else willReturn[ key ] = mergeFn(a[ key ], b[ key ])
  })

  return willReturn
}

export const mergeWith = curry(mergeWithFn)
