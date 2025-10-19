export function and(a, b){
  if (arguments.length === 1) return _b => and(a, _b)

  return a && b
}
