import { isArray } from './_internals/isArray.js'

export function takeLastWhile(predicate, input){
  if (arguments.length === 1){
    return _input => takeLastWhile(predicate, _input)
  }
  if (input.length === 0) return input

  const toReturn = []
  let counter = input.length

  while (counter){
    const item = input[ --counter ]
    if (!predicate(item)){
      break
    }
    toReturn.push(item)
  }

  return isArray(input) ? toReturn.reverse() : toReturn.reverse().join('')
}
