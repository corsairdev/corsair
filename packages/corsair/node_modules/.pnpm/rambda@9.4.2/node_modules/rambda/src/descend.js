import { createCompareFunction } from './ascend.js'

export function descend(
  getFunction, a, b
){
  if (arguments.length === 1){
    return (_a, _b) => descend(
      getFunction, _a, _b
    )
  }
  const aValue = getFunction(a)
  const bValue = getFunction(b)

  return createCompareFunction(
    aValue, bValue, 1, -1
  )
}
