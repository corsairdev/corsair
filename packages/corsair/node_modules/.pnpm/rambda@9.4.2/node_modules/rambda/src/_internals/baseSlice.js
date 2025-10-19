export default function baseSlice(
  array, start, end
){
  let index = -1
  let { length } = array

  end = end > length ? length : end
  if (end < 0){
    end += length
  }
  length = start > end ? 0 : end - start >>> 0
  start >>>= 0

  const result = Array(length)

  while (++index < length){
    result[ index ] = array[ index + start ]
  }

  return result
}
