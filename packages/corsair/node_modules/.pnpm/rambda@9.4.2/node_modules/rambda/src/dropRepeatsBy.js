import { equals } from './equals.js'

export function dropRepeatsBy(fn, list){
  if (arguments.length === 1) return _list => dropRepeatsBy(fn, _list)

  let lastEvaluated = null

  return list.slice().filter(item => {
    if (lastEvaluated === null){
      lastEvaluated = fn(item)

      return true
    }
    const evaluatedResult = fn(item)
    if (equals(lastEvaluated, evaluatedResult)) return false

    lastEvaluated = evaluatedResult

    return true
  })
}
