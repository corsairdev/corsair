import { z } from 'zod';

/**
 * Official JSON keys.
 * https://docs.doppler.com/reference/projects-object
 * https://docs.doppler.com/reference/environments-object
 * https://docs.doppler.com/reference/configs-object
 * https://docs.doppler.com/reference/workplace-get
 */

export const S = z.string().nullable().optional();
export const B = z.boolean().nullable().optional();
export const Id = z.string();
export const UnknownArray = z.array(z.unknown()).nullable().optional();
