import { filter } from './filter.js'
import { includes } from './includes.js'

export function intersection(listA, listB){
  if (arguments.length === 1) return _list => intersection(listA, _list)

  return filter(x => includes(x, listA), listB)
}
