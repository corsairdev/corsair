export function subtract(a, b){
  if (arguments.length === 1) return _b => subtract(a, _b)

  return a - b
}
