export function objOf(key, value){
  if (arguments.length === 1){
    return _value => objOf(key, _value)
  }

  return { [ key ] : value }
}
