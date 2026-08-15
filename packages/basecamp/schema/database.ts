import { z } from 'zod';

const BasecampEntityId = z.union([z.string(), z.number()]);
const BasecampReference = z
	.object({
		id: BasecampEntityId,
		name: z.string().nullable().optional(),
	})
	.loose();

export const BasecampProject = BasecampReference;
export const BasecampTemplate = BasecampReference;
export const BasecampPerson = BasecampReference;
export const BasecampMessageType = BasecampReference;
export const BasecampCampfire = BasecampReference;
export const BasecampChatbot = BasecampReference;

export type BasecampProject = z.infer<typeof BasecampProject>;
export type BasecampTemplate = z.infer<typeof BasecampTemplate>;
export type BasecampPerson = z.infer<typeof BasecampPerson>;
export type BasecampMessageType = z.infer<typeof BasecampMessageType>;
export type BasecampCampfire = z.infer<typeof BasecampCampfire>;
export type BasecampChatbot = z.infer<typeof BasecampChatbot>;
