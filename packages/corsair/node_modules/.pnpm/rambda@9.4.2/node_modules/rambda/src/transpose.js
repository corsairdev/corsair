import { isArray } from './_internals/isArray.js'

export function transpose(array){
  return array.reduce((acc, el) => {
    el.forEach((nestedEl, i) =>
      isArray(acc[ i ]) ? acc[ i ].push(nestedEl) : acc.push([ nestedEl ]))

    return acc
  }, [])
}
