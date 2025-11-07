import { createQuery, createMutation } from 'corsair/core'
import { type DatabaseContext } from './types'

export const query = createQuery<DatabaseContext>()
export const mutation = createMutation<DatabaseContext>()
