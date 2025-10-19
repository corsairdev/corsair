export function modulo(x, y){
  if (arguments.length === 1) return _y => modulo(x, _y)

  return x % y
}
