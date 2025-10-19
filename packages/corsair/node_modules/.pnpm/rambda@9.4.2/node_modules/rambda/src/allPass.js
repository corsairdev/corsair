export function allPass(predicates){
  return (...input) => {
    let counter = 0
    while (counter < predicates.length){
      if (!predicates[ counter ](...input)){
        return false
      }
      counter++
    }

    return true
  }
}
