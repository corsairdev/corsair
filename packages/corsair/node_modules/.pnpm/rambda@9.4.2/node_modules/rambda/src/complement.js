export function complement(fn){
  return (...input) => !fn(...input)
}
