import { z } from 'zod';
import { JobSchema } from '../endpoints/types';

// Entity modeled on the Rev AI async job object:
// https://docs.rev.ai/api/asynchronous/reference/#operation/GetJobById
export const RevAIJob = JobSchema.extend({
	created_on: z.coerce.date().nullable().optional(),
	completed_on: z.coerce.date().nullable().optional(),
});

export type RevAIJob = z.infer<typeof RevAIJob>;
