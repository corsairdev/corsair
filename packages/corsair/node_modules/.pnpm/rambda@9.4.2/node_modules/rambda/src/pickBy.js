export function pickBy(predicate, obj) {
  if (arguments.length === 1){
    return (_obj) => pickBy(predicate, _obj);
  }
  return Object.keys(obj).reduce((accum, key) => {
    if (predicate(obj[ key ], key, obj)){
      accum[ key ] = obj[ key ];
    }
    return accum;
  }, {});
}