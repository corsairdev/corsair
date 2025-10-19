import { _Set } from '../src/_internals/set.js'

export function uniqBy(fn, list){
  if (arguments.length === 1){
    return _list => uniqBy(fn, _list)
  }
  const set = new _Set()

  return list.filter(item => set.checkUniqueness(fn(item)))
}
