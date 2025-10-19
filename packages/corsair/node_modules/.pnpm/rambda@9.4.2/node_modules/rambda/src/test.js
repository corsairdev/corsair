export function test(pattern, str){
  if (arguments.length === 1) return _str => test(pattern, _str)

  if (typeof pattern === 'string'){
    throw new TypeError(`R.test requires a value of type RegExp as its first argument; received "${ pattern }"`)
  }

  return str.search(pattern) !== -1
}
