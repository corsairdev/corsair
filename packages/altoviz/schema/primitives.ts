import { z } from 'zod';

/**
 * Shared field builders for persisted Altoviz entities.
 * Official JSON omits or nulls optional fields.
 * https://developer.altoviz.com/openapi.json
 */
export const S = z.string().nullable().optional();
export const N = z.number().nullable().optional();
export const B = z.boolean().nullable().optional();
export const Id = z.number();
export const Obj = z.record(z.string(), z.unknown()).nullable().optional();
