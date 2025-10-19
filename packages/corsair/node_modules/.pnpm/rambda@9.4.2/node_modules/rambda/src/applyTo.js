export function applyTo(input, fn){
  if (arguments.length === 1){
    return _fn => applyTo(input, _fn)
  }

  return fn(input)
}
