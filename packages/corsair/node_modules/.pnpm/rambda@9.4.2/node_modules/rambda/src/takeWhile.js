import { isArray as isArrayModule } from './_internals/isArray.js'

export function takeWhile(predicate, iterable){
  if (arguments.length === 1){
    return _iterable => takeWhile(predicate, _iterable)
  }
  const isArray = isArrayModule(iterable)
  if (!isArray && typeof iterable !== 'string'){
    throw new Error('`iterable` is neither list nor a string')
  }

  const toReturn = []
  let counter = 0

  while (counter < iterable.length){
    const item = iterable[ counter++ ]
    if (!predicate(item)){
      break
    }
    toReturn.push(item)
  }

  return isArray ? toReturn : toReturn.join('')
}
