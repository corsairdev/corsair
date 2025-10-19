import { compare } from './compare.js'

export function includes(a, list){
  let index = -1
  const { length } = list

  while (++index < length)
    if (compare(list[ index ], a))
      return true

  return false
}
