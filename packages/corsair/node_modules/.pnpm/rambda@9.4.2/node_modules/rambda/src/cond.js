export function cond(conditions){
  return (...input) => {
    let done = false
    let toReturn
    conditions.forEach(([ predicate, getResult ]) => {
      if (!done && predicate(...input)){
        done = true
        toReturn = getResult(...input)
      }
    })

    return toReturn
  }
}
