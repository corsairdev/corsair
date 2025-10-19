function includesWith(
  predicate, target, list
){
  let willReturn = false
  let index = -1

  while (++index < list.length && !willReturn){
    const value = list[ index ]

    if (predicate(target, value)){
      willReturn = true
    }
  }

  return willReturn
}

export function uniqWith(predicate, list){
  if (arguments.length === 1) return _list => uniqWith(predicate, _list)

  let index = -1
  const willReturn = []

  while (++index < list.length){
    const value = list[ index ]

    if (!includesWith(
      predicate, value, willReturn
    )){
      willReturn.push(value)
    }
  }

  return willReturn
}
