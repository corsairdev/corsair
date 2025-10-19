function sortHelper(
  a, b, listOfSortingFns
){
  let result = 0
  let i = 0
  while (result === 0 && i < listOfSortingFns.length){
    result = listOfSortingFns[ i ](a, b)
    i += 1
  }

  return result
}

export function sortWith(listOfSortingFns, list){
  if (arguments.length === 1)
    return _list => sortWith(listOfSortingFns, _list)

  if (Array.isArray(list) === false)
    return []

  const clone = list.slice()
  clone.sort((a, b) => sortHelper(
    a, b, listOfSortingFns
  ))

  return clone
}
