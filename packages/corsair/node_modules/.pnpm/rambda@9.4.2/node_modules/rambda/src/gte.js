export function gte(a, b){
  if (arguments.length === 1)
    return _b => gte(a, _b)

  return a >= b
}
