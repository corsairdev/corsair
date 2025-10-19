export function whereAny(conditions, input){
  if (input === undefined){
    return _input => whereAny(conditions, _input)
  }
  for (const prop in conditions){
    if (conditions[ prop ](input[ prop ])){
      return true
    }
  }

  return false
}
