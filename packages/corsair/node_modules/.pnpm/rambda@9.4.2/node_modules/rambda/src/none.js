export function none(predicate, list){
  if (arguments.length === 1) return _list => none(predicate, _list)

  for (let i = 0; i < list.length; i++){
    if (predicate(list[ i ])) return false
  }

  return true
}
