import { z } from 'zod';

/** Official JSON keys. https://api.collegefootballdata.com/api-docs.json */

export const S = z.string().nullable().optional();
export const N = z.number().nullable().optional();
export const B = z.boolean().nullable().optional();
export const NumId = z.number();
export const StrArray = z.array(z.string()).nullable().optional();
