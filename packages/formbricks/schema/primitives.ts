import { z } from 'zod';

/**
 * Field-level building blocks shared by every Formbricks schema.
 *
 * They live in one place because they encode one decision, and two copies of a decision can
 * disagree. The decision: **only the primary key is required.** Formbricks nulls or omits
 * fields depending on the survey type, the plan and which features a workspace has enabled,
 * so a stricter schema rejects valid rows - and a rejected row is a *lost* row, because the
 * persistence layer skips anything that fails its schema.
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
 * Every use is commented at its declaration with which of two reasons applies, because an
 * unexplained `unknown` is indistinguishable from one nobody got round to modelling:
 *
 * - **Caller-defined or survey-defined.** A response's `data` is keyed by question id and
 *   holds whatever that question type produces; a survey's `styling` and `questions` are
 *   authored in the Formbricks editor. A closed schema would reject valid records.
 * - **Never observed.** Some records could not be produced on the recon workspace, and
 *   inventing field names is exactly the mistake that put a fabricated nested shape past both
 *   a type checker and its own test on a previous integration.
 *
 * `unknown` rather than `any`, so a consumer has to narrow before use - `PLUGIN_PR_RULES.md`
 * bans `any` on exported surfaces, and this keeps that promise while still accepting a shape
 * the API does not publish.
 */
export const U = z.unknown().optional();

/**
 * A primary key. Required, unlike every other field.
 *
 * Formbricks ids are cuid2 strings. The length is not asserted: `contact-attribute-keys` are
 * addressed by an opaque id but *identified* by a `key` like `email`, and a length constraint
 * would reject one of them.
 */
export const Id = z.string();

/** An array of strings that may be `null` or absent. */
export const StrArray = z.array(z.string()).nullable().optional();

/** An array of unmodelled values that may be `null` or absent. */
export const UnknownArray = z.array(z.unknown()).nullable().optional();

/**
 * A timestamp as Formbricks returns it - an ISO 8601 string.
 *
 * Kept as a string rather than coerced to a `Date`. The mirrored row should hold what the API
 * sent, so a round-trip through the cache cannot change a value, and a caller that wants a
 * `Date` can construct one.
 */
export const Timestamp = S;
