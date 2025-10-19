function _isInteger(n){
  return n << 0 === n
}

export const isInteger = Number.isInteger || _isInteger

/**
 * Check if `index` is integer even if it is a string.
 */
export const isIndexInteger = index => Number.isInteger(Number(index))
