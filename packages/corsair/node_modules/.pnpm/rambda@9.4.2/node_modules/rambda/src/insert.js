import { curry } from './curry.js'

export function insertFn(indexToInsert, valueToInsert, array) {
  return [
    ...array.slice(0, indexToInsert),
    valueToInsert,
    ...array.slice(indexToInsert),
  ]
}

export const insert = curry(insertFn)
