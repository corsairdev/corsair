import { reduce } from './reduce.js'

export function collectBy(fn, list){
  if (arguments.length === 1){
    return _list => collectBy(fn, _list)
  }

  const group = reduce(
    (o, x) => {
      const tag = fn(x)
      if (o[ tag ] === undefined){
        o[ tag ] = []
      }
      o[ tag ].push(x)

      return o
    },
    {},
    list
  )
  const newList = []
  for (const tag in group){
    newList.push(group[ tag ])
  }

  return newList
}
