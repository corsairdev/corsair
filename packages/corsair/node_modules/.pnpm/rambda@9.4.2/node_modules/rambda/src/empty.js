import { type } from './type.js'

export function empty(list){
  if (typeof list === 'string') return ''

  if (Array.isArray(list)){
    const { name } = list.constructor
    if (name === 'Uint8Array') return Uint8Array.from('')

    if (name === 'Float32Array') return new Float32Array([])

    return []
  }
  if (type(list) === 'Object') return {}
}
