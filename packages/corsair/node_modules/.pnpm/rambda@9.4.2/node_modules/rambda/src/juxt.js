export function juxt(listOfFunctions){
  return (...args) => listOfFunctions.map(fn => fn(...args))
}
