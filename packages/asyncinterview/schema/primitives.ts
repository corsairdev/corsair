import { z } from 'zod';

/** Shared field builders. Official JSON omits or nulls optional fields. */
export const S = z.string().nullable().optional();
export const N = z.number().nullable().optional();
export const Id = z.number().int();
