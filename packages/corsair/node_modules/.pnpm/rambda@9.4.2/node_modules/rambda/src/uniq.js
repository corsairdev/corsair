import { _Set } from './_internals/set.js'

export function uniq(list){
  const set = new _Set()
  const willReturn = []
  list.forEach(item => {
    if (set.checkUniqueness(item)){
      willReturn.push(item)
    }
  })

  return willReturn
}
