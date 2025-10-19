export function multiply(x, y){
  if (arguments.length === 1) return _y => multiply(x, _y)

  return x * y
}
