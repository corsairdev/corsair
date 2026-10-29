import { z } from 'zod';

/**
 * Field names match official JSON keys.
 * https://help.blazemeter.com/apidocs/performance/basics.htm
 */

export const S = z.string().nullable().optional();
export const N = z.number().nullable().optional();
export const B = z.boolean().nullable().optional();
export const NumId = z.number();
export const StrArray = z.array(z.string()).nullable().optional();
export const Obj = z.record(z.string(), z.unknown()).nullable().optional();
export const UnknownArray = z.array(z.unknown()).nullable().optional();
