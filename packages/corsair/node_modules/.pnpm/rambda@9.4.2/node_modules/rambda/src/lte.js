export function lte(a, b){
  if (arguments.length === 1)
    return _b => lte(a, _b)

  return a <= b
}
