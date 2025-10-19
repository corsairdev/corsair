export function aperture(step, list){
  if (arguments.length === 1){
    return _list => aperture(step, _list)
  }
  if (step > list.length) return []
  let idx = 0
  const limit = list.length - (step - 1)
  const acc = new Array(limit)
  while (idx < limit){
    acc[ idx ] = list.slice(idx, idx + step)
    idx += 1
  }

  return acc
}
