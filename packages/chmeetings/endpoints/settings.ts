import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { makeChMeetingsRequest, unwrapData } from '../client';
import type { ChMeetingsEndpoints } from '../index';
import {
	LookupFieldSchema,
	SettingsGetInputSchema,
	SettingsGetOutputSchema,
} from './types';

const LookupListSchema = z.array(LookupFieldSchema);
const FieldsSchema = z
	.object({
		sections: z.array(z.object({}).passthrough()).nullable().optional(),
	})
	.passthrough();

export const get: ChMeetingsEndpoints['settingsGet'] = async (ctx, input) => {
	SettingsGetInputSchema.parse(input ?? {});
	const [genders, social, grades, roles, fields] = await Promise.all([
		makeChMeetingsRequest('people/genders', ctx.key),
		makeChMeetingsRequest('people/social-statuses', ctx.key),
		makeChMeetingsRequest('people/grade-values', ctx.key),
		makeChMeetingsRequest('families/family-roles', ctx.key),
		makeChMeetingsRequest('people/fields', ctx.key),
	]);
	const output = SettingsGetOutputSchema.parse({
		genders: unwrapData(genders, LookupListSchema, 'Genders'),
		social_statuses: unwrapData(social, LookupListSchema, 'Social statuses'),
		grade_values: unwrapData(grades, LookupListSchema, 'Grade values'),
		family_roles: unwrapData(roles, LookupListSchema, 'Family roles'),
		fields: unwrapData(fields, FieldsSchema, 'Fields'),
	});
	await logEventFromContext(ctx, 'chmeetings.settings.get', {}, 'completed');
	return output;
};
