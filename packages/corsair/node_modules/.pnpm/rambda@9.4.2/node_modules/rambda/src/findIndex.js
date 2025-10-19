export function findIndex(predicate, list){
  if (arguments.length === 1) return _list => findIndex(predicate, _list)

  const len = list.length
  let index = -1

  while (++index < len){
    if (predicate(list[ index ])){
      return index
    }
  }

  return -1
}
