import { z } from 'zod';

/**
 * Official JSON shapes of the Bubble Data API.
 *
 * Bubble omits optional or null fields rather than returning explicit
 * `null` in most cases, but persistence must never reject a record just
 * because one of the convenience fields below is absent - only `_id` is
 * required on a thing. `N`/`B` are used for the pagination envelope fields
 * of the list response.
 */

export const S = z.string().nullable().optional();
export const N = z.number().nullable().optional();
export const B = z.boolean().nullable().optional();
