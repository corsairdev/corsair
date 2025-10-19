import { curryN } from './curryN.js'
import { map } from './map.js'
import { max } from './max.js'
import { reduce } from './reduce.js'

export function converge(fn, transformers){
  if (arguments.length === 1)
    return _transformers => converge(fn, _transformers)

  const highestArity = reduce(
    (a, b) => max(a, b.length), 0, transformers
  )

  return curryN(highestArity, function (){
    return fn.apply(this,
      map(g => g.apply(this, arguments), transformers))
  })
}
