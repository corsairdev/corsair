export function _concat(set1, set2){
  set1 = set1 || []
  set2 = set2 || []
  let idx
  const len1 = set1.length
  const len2 = set2.length
  const result = []

  idx = 0
  while (idx < len1){
    result[ result.length ] = set1[ idx ]
    idx += 1
  }
  idx = 0
  while (idx < len2){
    result[ result.length ] = set2[ idx ]
    idx += 1
  }

  return result
}
