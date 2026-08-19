import { z } from 'zod';
import { AttioRecord, AttioWorkspaceMember } from '../schema/database';

const WorkspaceMembersListInputSchema = z.object({}).optional();
export type WorkspaceMembersListInput = z.infer<
	typeof WorkspaceMembersListInputSchema
>;

const WorkspaceMembersListResponseSchema = z.object({
	data: z.array(AttioWorkspaceMember),
});
export type WorkspaceMembersListResponse = z.infer<
	typeof WorkspaceMembersListResponseSchema
>;

const RecordsListInputSchema = z.object({
	object_slug: z.string(),
});
export type RecordsListInput = z.infer<typeof RecordsListInputSchema>;

const RecordsListResponseSchema = z.object({
	data: z.array(AttioRecord),
});
export type RecordsListResponse = z.infer<typeof RecordsListResponseSchema>;

const RecordsGetInputSchema = z.object({
	object_slug: z.string(),
	record_id: z.string(),
});
export type RecordsGetInput = z.infer<typeof RecordsGetInputSchema>;

const RecordsGetResponseSchema = AttioRecord;
export type RecordsGetResponse = z.infer<typeof RecordsGetResponseSchema>;

const RecordsCreateInputSchema = z.object({
	object_slug: z.string(),
	values: z.record(z.string(), z.any()),
});
export type RecordsCreateInput = z.infer<typeof RecordsCreateInputSchema>;

const RecordsCreateResponseSchema = AttioRecord;
export type RecordsCreateResponse = z.infer<typeof RecordsCreateResponseSchema>;

export type AttioEndpointInputs = {
	workspaceMembersList: WorkspaceMembersListInput;
	recordsList: RecordsListInput;
	recordsGet: RecordsGetInput;
	recordsCreate: RecordsCreateInput;
};

export type AttioEndpointOutputs = {
	workspaceMembersList: WorkspaceMembersListResponse;
	recordsList: RecordsListResponse;
	recordsGet: RecordsGetResponse;
	recordsCreate: RecordsCreateResponse;
};

export const AttioEndpointInputSchemas = {
	workspaceMembersList: WorkspaceMembersListInputSchema,
	recordsList: RecordsListInputSchema,
	recordsGet: RecordsGetInputSchema,
	recordsCreate: RecordsCreateInputSchema,
} as const;

export const AttioEndpointOutputSchemas = {
	workspaceMembersList: WorkspaceMembersListResponseSchema,
	recordsList: RecordsListResponseSchema,
	recordsGet: RecordsGetResponseSchema,
	recordsCreate: RecordsCreateResponseSchema,
} as const;
