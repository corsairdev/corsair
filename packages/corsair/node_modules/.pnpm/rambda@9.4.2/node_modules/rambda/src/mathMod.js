import { isInteger } from './_internals/isInteger.js'

export function mathMod(x, y){
  if (arguments.length === 1) return _y => mathMod(x, _y)
  if (!isInteger(x) || !isInteger(y) || y < 1) return NaN

  return (x % y + y) % y
}
