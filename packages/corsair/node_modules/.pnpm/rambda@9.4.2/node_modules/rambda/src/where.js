export function where(conditions, input){
  if (input === undefined){
    return _input => where(conditions, _input)
  }
  let flag = true
  for (const prop in conditions){
    if (!flag) continue
    const result = conditions[ prop ](input[ prop ])
    if (flag && result === false){
      flag = false
    }
  }

  return flag
}
