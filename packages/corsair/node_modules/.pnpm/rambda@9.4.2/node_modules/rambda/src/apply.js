export function apply(fn, args){
  if (arguments.length === 1){
    return _args => apply(fn, _args)
  }

  return fn.apply(this, args)
}
