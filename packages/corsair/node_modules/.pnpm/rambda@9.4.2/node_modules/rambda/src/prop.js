export function propFn(searchProperty, obj){
  if (!obj) return undefined

  return obj[ searchProperty ]
}

export function prop(searchProperty, obj){
  if (arguments.length === 1) return _obj => prop(searchProperty, _obj)

  return propFn(searchProperty, obj)
}
