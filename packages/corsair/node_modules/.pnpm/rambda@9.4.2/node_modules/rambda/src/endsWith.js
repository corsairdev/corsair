import { isArray } from './_internals/isArray.js'
import { equals } from './equals.js'

export function endsWith(target, iterable){
  if (arguments.length === 1) return _iterable => endsWith(target, _iterable)

  if (typeof iterable === 'string'){
    return iterable.endsWith(target)
  }
  if (!isArray(target)) return false

  const diff = iterable.length - target.length
  let correct = true
  const filtered = target.filter((x, index) => {
    if (!correct) return false
    const result = equals(x, iterable[ index + diff ])
    if (!result) correct = false

    return result
  })

  return filtered.length === target.length
}
