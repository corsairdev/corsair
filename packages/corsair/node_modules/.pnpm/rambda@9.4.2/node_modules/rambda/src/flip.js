function flipFn(fn){
  return (...input) => {
    if (input.length === 1){
      return holder => fn(holder, input[ 0 ])
    } else if (input.length === 2){
      return fn(input[ 1 ], input[ 0 ])
    } else if (input.length === 3){
      return fn(
        input[ 1 ], input[ 0 ], input[ 2 ]
      )
    } else if (input.length === 4){
      return fn(
        input[ 1 ], input[ 0 ], input[ 2 ], input[ 3 ]
      )
    }

    throw new Error('R.flip doesn\'t work with arity > 4')
  }
}

export function flip(fn){
  return flipFn(fn)
}
