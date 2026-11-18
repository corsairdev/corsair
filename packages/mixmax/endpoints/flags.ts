import { z } from 'zod';

// Mixmax documents boolean query flags, and HTTP query values are strings —
// but a caller of this plugin writes JavaScript, so a `false` string must
// never enable a flag the way `Boolean('false')` would. Only real booleans
// and the explicit `true`/`false` strings are accepted, and every form is
// normalized to a boolean before the handler sees it. The schema ends in
// `z.boolean()` so tools that read its output side (Studio's form builder,
// JSON Schema) see a boolean rather than an untyped transform.
export const mixmaxBooleanFlag = z
	.union([z.boolean(), z.literal('true'), z.literal('false')])
	.transform((value) => value === true || value === 'true')
	.pipe(z.boolean());

// A send time in Unix milliseconds. These fields decide when Mixmax emails
// real people, and "no time" means "send now", so the value is never
// coerced: `z.coerce.number()` turns `false`, `null` and `''` into 0 and
// `true` into 1, and Mixmax reads those as "now" (the reference says a
// top-level `scheduledAt: false` on a sequence "is treated as now and sends
// right away"). Only a number, or a string of digits, is accepted, and it
// must have the 13 digits the reference asks for, which also catches a
// timestamp given in seconds (that would land in 1970 and send at once).
export const mixmaxSendTimeMs = z
	.union([z.number(), z.string().regex(/^\d+$/).transform(Number)])
	.pipe(
		z.number().int().min(1_000_000_000_000, {
			message:
				'Send times are Unix timestamps in milliseconds (13 digits); leave the field out to send now',
		}),
	);
