import { z } from 'zod';

/**
 * Official JSON keys. https://bigml.com/api
 *
 * BigML nulls unset fields rather than omitting them, so nearly everything
 * accepts `null` as well as being absent. Only `resource` is required.
 */

export const S = z.string().nullable().optional();
export const N = z.number().nullable().optional();
export const B = z.boolean().nullable().optional();
export const Resource = z.string();
export const StrArray = z.array(z.string()).nullable().optional();
export const UnknownArray = z.array(z.unknown()).nullable().optional();
export const Obj = z.record(z.string(), z.unknown()).nullable().optional();
