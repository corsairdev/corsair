export function has(prop, obj){
  if (arguments.length === 1) return _obj => has(prop, _obj)

  if (!obj) return false

  return obj.hasOwnProperty(prop)
}
