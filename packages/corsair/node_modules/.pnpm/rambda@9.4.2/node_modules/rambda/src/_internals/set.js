import { _indexOf } from '../equals.js'
import { type as typeMethod } from '../type.js'

export class _Set{
  constructor(){
    this.set = new Set()
    this.items = {}
  }

  checkUniqueness(item){
    const type = typeMethod(item)
    if ([ 'Null', 'Undefined', 'NaN' ].includes(type)){
      if (type in this.items){
        return false
      }
      this.items[ type ] = true

      return true
    }
    if (![ 'Object', 'Array' ].includes(type)){
      const prevSize = this.set.size
      this.set.add(item)

      return this.set.size !== prevSize
    }

    if (!(type in this.items)){
      this.items[ type ] = [ item ]

      return true
    }

    if (_indexOf(item, this.items[ type ]) === -1){
      this.items[ type ].push(item)

      return true
    }

    return false
  }
}
