import { objectIs } from './_internals/objectIs.js'

export function identical(a, b){
  if (arguments.length === 1) return _b => identical(a, _b)

  return objectIs(a, b)
}
