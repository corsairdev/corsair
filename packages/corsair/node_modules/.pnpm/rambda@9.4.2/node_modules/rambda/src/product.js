import { multiply } from './multiply.js'
import { reduce } from './reduce.js'

export const product = reduce(multiply, 1)
