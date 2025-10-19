export function nth(index, input){
  if (arguments.length === 1) return _input => nth(index, _input)

  const idx = index < 0 ? input.length + index : index

  return Object.prototype.toString.call(input) === '[object String]' ?
    input.charAt(idx) :
    input[ idx ]
}
