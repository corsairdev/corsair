import { z } from 'zod';

/** Official JSON keys. https://developer.atlassian.com/cloud/bitbucket/swagger.v3.json */

export const S = z.string().nullable().optional();
export const N = z.number().nullable().optional();
export const B = z.boolean().nullable().optional();
export const Id = z.string();
export const NumId = z.number();
export const Obj = z.record(z.string(), z.unknown()).nullable().optional();
export const UnknownArray = z.array(z.unknown()).nullable().optional();
