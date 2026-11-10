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
