import { z } from 'zod';

/**
 * Field-level building blocks shared by every BugSnag schema.
 *
 * They live here rather than being redeclared in `database.ts` and `responses.ts` because
 * they encode one decision, and two copies of a decision can disagree. The decision:
 * **BugSnag nulls unset fields rather than omitting them**, and which fields it nulls
 * depends on the account's plan and on which features are enabled - so nearly everything
 * has to accept `null` as well as being absent.
 *
 * A stricter alternative was rejected deliberately. Requiring a field the API sometimes
 * nulls makes the schema reject a valid row, and a rejected row is a *lost* row: the
 * persistence layer skips anything that fails its schema, so an over-strict declaration
 * silently drops data rather than failing loudly.
 */

/** A string that may be `null` or absent. */
export const S = z.string().nullable().optional();

/** A number that may be `null` or absent. */
export const N = z.number().nullable().optional();

/** A boolean that may be `null` or absent. */
export const B = z.boolean().nullable().optional();

/**
 * A value whose shape is not modelled.
 *
 * Used where BugSnag returns a nested structure that this plugin passes through without
 * interpreting - `metaData`, `filters`, `pivot_options`, an integration's `configuration`.
 * Each use is commented at its declaration with why the shape is not pinned down, because
 * an unexplained `unknown` is indistinguishable from one nobody got round to modelling.
 *
 * Two reasons recur:
 *
 * - **The shape is caller-defined.** `metaData` is whatever the application chose to
 *   attach, and `filters` is keyed by whichever event fields a project has defined,
 *   including custom ones. A closed schema would reject valid data.
 * - **The shape was never observed.** Some records could not be produced on the recon
 *   account, and inventing field names is exactly the mistake that put a fabricated
 *   `target_stability` shape through both the type checker and its own test.
 */
export const U = z.unknown().optional();

/**
 * A primary key. Required, unlike every other field.
 *
 * Ids are 24-character hex strings throughout the API, but the length is not asserted:
 * `event_fields` and `pivots` are keyed by a dotted display id instead
 * (`metaData.user.accountId`, `error.status`), so a hex constraint would reject them.
 */
export const Id = z.string();

/** An array of strings that may be `null` or absent. */
export const StrArray = z.array(z.string()).nullable().optional();

/** An array of unmodelled values that may be `null` or absent. */
export const UnknownArray = z.array(z.unknown()).nullable().optional();
