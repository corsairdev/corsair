import { drop } from './drop.js'

export function tail(listOrString){
  return drop(1, listOrString)
}
