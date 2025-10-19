import { type } from './type.js'

export function maybe(
  ifRule, whenIf, whenElse
){
  const whenIfInput =
    ifRule && type(whenIf) === 'Function' ? whenIf() : whenIf

  const whenElseInput =
    !ifRule && type(whenElse) === 'Function' ? whenElse() : whenElse

  return ifRule ? whenIfInput : whenElseInput
}
