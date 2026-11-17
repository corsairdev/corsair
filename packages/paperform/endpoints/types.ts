import { z } from 'zod';
import {
	PaperformFormEntity,
	PaperformSpaceEntity,
	PaperformTranslationEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const IdInputSchema = z.object({
	id: z.string().regex(/^[A-Za-z0-9]+$/),
});
export type IdInput = z.infer<typeof IdInputSchema>;

export const FormListResponseSchema = z.object({
	forms: z.array(PaperformFormEntity),
});
export type FormListResponse = z.infer<typeof FormListResponseSchema>;

export const SpaceListResponseSchema = z.object({
	spaces: z.array(PaperformSpaceEntity),
});
export type SpaceListResponse = z.infer<typeof SpaceListResponseSchema>;

export const SpaceResponseSchema = z.object({
	space: PaperformSpaceEntity,
});
export type SpaceResponse = z.infer<typeof SpaceResponseSchema>;

export const TranslationListResponseSchema = z.object({
	translations: z.array(PaperformTranslationEntity),
});
export type TranslationListResponse = z.infer<
	typeof TranslationListResponseSchema
>;

export const EndpointInputSchemas = {
	'forms.list': EmptyInputSchema,
	'spaces.list': EmptyInputSchema,
	'spaces.get': IdInputSchema,
	'spaces.forms': IdInputSchema,
	'translations.list': EmptyInputSchema,
} as const;

export const EndpointOutputSchemas = {
	'forms.list': FormListResponseSchema,
	'spaces.list': SpaceListResponseSchema,
	'spaces.get': SpaceResponseSchema,
	'spaces.forms': FormListResponseSchema,
	'translations.list': TranslationListResponseSchema,
} as const;
