import type { z } from 'zod';
import {
	CodacyOrganizationSchema,
	CodacyPatternSchema,
	CodacyRepositorySchema,
	CodacyToolSchema,
	CodacyUserSchema,
} from '../endpoints/types';

/**
 * Database entities for Codacy resources synchronized by the plugin.
 * Shapes reuse the endpoint response schemas so stored records keep the
 * full API representation (loose parsing preserves extra fields).
 */

export const CodacyAccount = CodacyUserSchema;
export type CodacyAccount = z.infer<typeof CodacyUserSchema>;

export const CodacyOrganization = CodacyOrganizationSchema;
export type CodacyOrganization = z.infer<typeof CodacyOrganizationSchema>;

export const CodacyRepository = CodacyRepositorySchema;
export type CodacyRepository = z.infer<typeof CodacyRepositorySchema>;

export const CodacyTool = CodacyToolSchema;
export type CodacyTool = z.infer<typeof CodacyToolSchema>;

export const CodacyPattern = CodacyPatternSchema;
export type CodacyPattern = z.infer<typeof CodacyPatternSchema>;
