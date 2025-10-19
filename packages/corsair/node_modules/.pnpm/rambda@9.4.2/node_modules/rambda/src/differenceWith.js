import { curry } from './curry.js'
import { _indexOf } from './equals.js'

export function differenceWithFn(
  fn, a, b
){
  const willReturn = []
  const [ first, second ] = a.length >= b.length ? [ a, b ] : [ b, a ]

  first.forEach(item => {
    const hasItem = second.some(secondItem => fn(item, secondItem))
    if (!hasItem && _indexOf(item, willReturn) === -1){
      willReturn.push(item)
    }
  })

  return willReturn
}

export const differenceWith = curry(differenceWithFn)
