import { z } from 'zod';

/**
 * Recall.ai leaves nested metadata and provider configuration open-ended in its
 * docs. Modeling these as JSON preserves provider additions without weakening
 * validation to arbitrary JavaScript values.
 */
export type RecallaiJsonValue =
	| null
	| boolean
	| number
	| string
	| RecallaiJsonObject
	| RecallaiJsonValue[];

export type RecallaiJsonObject = { [key: string]: RecallaiJsonValue };

export const RecallaiJsonValueSchema = z.json();
export const RecallaiJsonObjectSchema = z.record(
	z.string(),
	RecallaiJsonValueSchema,
);
