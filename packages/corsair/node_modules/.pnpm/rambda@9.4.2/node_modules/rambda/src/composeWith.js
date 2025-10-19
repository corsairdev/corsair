import { _arity } from './_internals/_arity.js'
import { head } from './head.js'
import { identity } from './identity.js'
import { reduce } from './reduce.js'
import { reverse } from './reverse.js'
import { tail } from './tail.js'

export function pipeWith(xf, list){
  if (list.length <= 0){
    return identity
  }

  const headList = head(list)
  const tailList = tail(list)

  return _arity(headList.length, function (){
    return reduce(
      function (result, f){
        return xf.call(
          this, f, result
        )
      },
      headList.apply(this, arguments),
      tailList
    )
  })
}

export function composeWith(xf, list){
  if (arguments.length === 1) return _list => composeWith(xf, _list)

  return pipeWith.apply(this, [ xf, reverse(list) ])
}
