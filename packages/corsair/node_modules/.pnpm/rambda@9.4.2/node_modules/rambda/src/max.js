export function max(x, y){
  if (arguments.length === 1) return _y => max(x, _y)

  return y > x ? y : x
}
