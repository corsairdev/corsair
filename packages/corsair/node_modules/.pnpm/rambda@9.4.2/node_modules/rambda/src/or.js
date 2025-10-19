export function or(a, b){
  if (arguments.length === 1) return _b => or(a, _b)

  return a || b
}
