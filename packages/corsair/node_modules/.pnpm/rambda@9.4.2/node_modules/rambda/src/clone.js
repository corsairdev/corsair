import { isArray } from './_internals/isArray.js'

export function clone(input){
  const out = isArray(input) ? Array(input.length) : {}
  if (input && input.getTime) return new Date(input.getTime())

  for (const key in input){
    const v = input[ key ]
    out[ key ] =
      typeof v === 'object' && v !== null ?
        v.getTime ?
          new Date(v.getTime()) :
          clone(v) :
        v
  }

  return out
}
