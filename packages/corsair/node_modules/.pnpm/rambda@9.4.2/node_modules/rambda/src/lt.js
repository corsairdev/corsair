export function lt(a, b){
  if (arguments.length === 1)
    return _b => lt(a, _b)

  return a < b
}
