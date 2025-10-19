export function gt(a, b){
  if (arguments.length === 1)
    return _b => gt(a, _b)

  return a > b
}
