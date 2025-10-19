import { pipe } from './pipe.js'

export function compose(){
  if (arguments.length === 0){
    throw new Error('compose requires at least one argument')
  }

  return pipe.apply(this, Array.prototype.slice.call(arguments, 0).reverse())
}
