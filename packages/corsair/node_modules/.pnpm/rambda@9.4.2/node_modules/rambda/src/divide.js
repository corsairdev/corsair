export function divide(a, b){
  if (arguments.length === 1) return _b => divide(a, _b)

  return a / b
}
