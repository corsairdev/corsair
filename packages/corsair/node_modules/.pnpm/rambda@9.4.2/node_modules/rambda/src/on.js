export function on(
  binaryFn, unaryFn, a, b
){
  if (arguments.length === 3){
    return _b => on(
      binaryFn, unaryFn, a, _b
    )
  }
  if (arguments.length === 2){
    return (_a, _b) => on(
      binaryFn, unaryFn, _a, _b
    )
  }

  return binaryFn(unaryFn(a), unaryFn(b))
}
