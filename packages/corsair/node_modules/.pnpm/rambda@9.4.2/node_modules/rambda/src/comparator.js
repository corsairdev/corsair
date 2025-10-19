export function comparator(fn){
  return function (a, b){
    return fn(a, b) ? -1 : fn(b, a) ? 1 : 0
  }
}
