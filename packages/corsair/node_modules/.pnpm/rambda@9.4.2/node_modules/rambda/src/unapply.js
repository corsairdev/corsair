export function unapply(fn){
  return function (...args){
    return fn.call(this, args)
  }
}
