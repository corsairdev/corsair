export function mergeRight(target, newProps){
  if (arguments.length === 1)
    return _newProps => mergeRight(target, _newProps)

  return Object.assign(
    {}, target || {}, newProps || {}
  )
}
