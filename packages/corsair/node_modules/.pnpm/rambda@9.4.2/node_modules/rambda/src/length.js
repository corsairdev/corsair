import { isArray } from './_internals/isArray.js'

export function length(x){
  if (isArray(x)) return x.length
  if (typeof x === 'string') return x.length

  return NaN
}
