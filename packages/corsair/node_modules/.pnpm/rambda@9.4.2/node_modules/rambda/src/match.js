export function match(pattern, input){
  if (arguments.length === 1) return _input => match(pattern, _input)

  const willReturn = input.match(pattern)

  return willReturn === null ? [] : willReturn
}
