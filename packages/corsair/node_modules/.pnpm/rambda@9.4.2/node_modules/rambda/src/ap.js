export function ap(functions, input){
  if (arguments.length === 1){
    return _inputs => ap(functions, _inputs)
  }

  return functions.reduce((acc, fn) => [ ...acc, ...input.map(fn) ], [])
}
