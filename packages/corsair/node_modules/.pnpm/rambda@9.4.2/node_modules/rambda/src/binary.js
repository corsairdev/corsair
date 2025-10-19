export function binary(fn){
  if (fn.length <= 2) return fn

  return (a, b) => fn(a, b)
}
