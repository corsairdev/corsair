import { path } from "./path.js";
import { curry } from "./curry.js";

export function pathSatisfiesFn(fn, pathInput, obj) {
  if(pathInput.length === 0) throw new Error("R.pathSatisfies received an empty path")
  return Boolean(fn(path(pathInput, obj))) 
}

export const pathSatisfies = curry(pathSatisfiesFn)