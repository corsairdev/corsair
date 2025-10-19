import { isArray as isArrayMethod } from './_internals/isArray.js'

export function dropLastWhile(predicate, iterable){
  if (arguments.length === 1){
    return _iterable => dropLastWhile(predicate, _iterable)
  }
  if (iterable.length === 0) return iterable
  const isArray = isArrayMethod(iterable)

  if (typeof predicate !== 'function'){
    throw new Error(`'predicate' is from wrong type ${ typeof predicate }`)
  }
  if (!isArray && typeof iterable !== 'string'){
    throw new Error(`'iterable' is from wrong type ${ typeof iterable }`)
  }

  const toReturn = []
  let counter = iterable.length

  while (counter){
    const item = iterable[ --counter ]
    if (!predicate(item)){
      toReturn.push(item)
      break
    }
  }

  while (counter){
    toReturn.push(iterable[ --counter ])
  }

  return isArray ? toReturn.reverse() : toReturn.reverse().join('')
}
