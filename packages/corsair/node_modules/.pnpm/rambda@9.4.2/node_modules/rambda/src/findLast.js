export function findLast(predicate, list){
  if (arguments.length === 1) return _list => findLast(predicate, _list)

  let index = list.length

  while (--index >= 0){
    if (predicate(list[ index ])){
      return list[ index ]
    }
  }

  return undefined
}
