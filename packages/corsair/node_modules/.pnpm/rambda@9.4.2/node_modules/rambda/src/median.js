import { mean } from './mean.js'

export function median(list){
  const len = list.length
  if (len === 0) return NaN
  const width = 2 - len % 2
  const idx = (len - width) / 2

  return mean(Array.prototype.slice
    .call(list, 0)
    .sort((a, b) => {
      if (a === b) return 0

      return a < b ? -1 : 1
    })
    .slice(idx, idx + width))
}
