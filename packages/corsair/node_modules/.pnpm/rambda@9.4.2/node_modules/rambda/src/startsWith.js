import { isArray } from './_internals/isArray.js'
import { equals } from './equals.js'

export function startsWith(question, iterable){
  if (arguments.length === 1)
    return _iterable => startsWith(question, _iterable)

  if (typeof iterable === 'string'){
    return iterable.startsWith(question)
  }
  if (!isArray(question)) return false

  let correct = true
  const filtered = question.filter((x, index) => {
    if (!correct) return false
    const result = equals(x, iterable[ index ])
    if (!result) correct = false

    return result
  })

  return filtered.length === question.length
}
