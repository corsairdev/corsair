import { FileInputSchema } from 'corsair/http';
import { z } from 'zod';

/**
 * A file sent to OpenAI. An agent's arguments are JSON, so it passes a link or
 * base64; a Files id on Corsair arrives as a link. From TypeScript a Blob still
 * works, and so does a string holding the file's own text (a JSONL batch).
 */
export const openaiFileInput = (what: string) =>
	z
		.union([FileInputSchema, z.instanceof(Blob)])
		.describe(
			`${what}: a public http(s) or data: URL, {url, filename?, contentType?}, or {base64, filename?, contentType?}; a Blob or File from TypeScript. Any other string is sent as the file's text. On Corsair, pass a Files id (fil_…).`,
		);
