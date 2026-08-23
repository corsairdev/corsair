import { z } from 'zod';
import { makeAuthenticatedAttioRequest } from '../client';
import type { AttioEndpoint } from './types';

// --- SCHEMAS ---
const Putv2listslistentriesInputSchema = z.record(z.string(), z.unknown());
export type Putv2listslistentriesInput = z.infer<
	typeof Putv2listslistentriesInputSchema
>;
const Putv2listslistentriesResponseSchema = z.record(z.string(), z.unknown());
export type Putv2listslistentriesResponse = z.infer<
	typeof Putv2listslistentriesResponseSchema
>;

const AssertpersonInputSchema = z.record(z.string(), z.unknown());
export type AssertpersonInput = z.infer<typeof AssertpersonInputSchema>;
const AssertpersonResponseSchema = z.record(z.string(), z.unknown());
export type AssertpersonResponse = z.infer<typeof AssertpersonResponseSchema>;

const Putv2objectsobjectrecordsInputSchema = z.record(z.string(), z.unknown());
export type Putv2objectsobjectrecordsInput = z.infer<
	typeof Putv2objectsobjectrecordsInputSchema
>;
const Putv2objectsobjectrecordsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Putv2objectsobjectrecordsResponse = z.infer<
	typeof Putv2objectsobjectrecordsResponseSchema
>;

const AssertuserrecordInputSchema = z.record(z.string(), z.unknown());
export type AssertuserrecordInput = z.infer<typeof AssertuserrecordInputSchema>;
const AssertuserrecordResponseSchema = z.record(z.string(), z.unknown());
export type AssertuserrecordResponse = z.infer<
	typeof AssertuserrecordResponseSchema
>;

const AssertworkspaceInputSchema = z.record(z.string(), z.unknown());
export type AssertworkspaceInput = z.infer<typeof AssertworkspaceInputSchema>;
const AssertworkspaceResponseSchema = z.record(z.string(), z.unknown());
export type AssertworkspaceResponse = z.infer<
	typeof AssertworkspaceResponseSchema
>;

const CreateattributeInputSchema = z.record(z.string(), z.unknown());
export type CreateattributeInput = z.infer<typeof CreateattributeInputSchema>;
const CreateattributeResponseSchema = z.record(z.string(), z.unknown());
export type CreateattributeResponse = z.infer<
	typeof CreateattributeResponseSchema
>;

const CreatecommentInputSchema = z.record(z.string(), z.unknown());
export type CreatecommentInput = z.infer<typeof CreatecommentInputSchema>;
const CreatecommentResponseSchema = z.record(z.string(), z.unknown());
export type CreatecommentResponse = z.infer<typeof CreatecommentResponseSchema>;

const CreatecompanyInputSchema = z.record(z.string(), z.unknown());
export type CreatecompanyInput = z.infer<typeof CreatecompanyInputSchema>;
const CreatecompanyResponseSchema = z.record(z.string(), z.unknown());
export type CreatecompanyResponse = z.infer<typeof CreatecompanyResponseSchema>;

const CreatedealrecordInputSchema = z.record(z.string(), z.unknown());
export type CreatedealrecordInput = z.infer<typeof CreatedealrecordInputSchema>;
const CreatedealrecordResponseSchema = z.record(z.string(), z.unknown());
export type CreatedealrecordResponse = z.infer<
	typeof CreatedealrecordResponseSchema
>;

const CreateentryInputSchema = z.record(z.string(), z.unknown());
export type CreateentryInput = z.infer<typeof CreateentryInputSchema>;
const CreateentryResponseSchema = z.record(z.string(), z.unknown());
export type CreateentryResponse = z.infer<typeof CreateentryResponseSchema>;

const CreatelistInputSchema = z.record(z.string(), z.unknown());
export type CreatelistInput = z.infer<typeof CreatelistInputSchema>;
const CreatelistResponseSchema = z.record(z.string(), z.unknown());
export type CreatelistResponse = z.infer<typeof CreatelistResponseSchema>;

const Postv2listslistentriesInputSchema = z.record(z.string(), z.unknown());
export type Postv2listslistentriesInput = z.infer<
	typeof Postv2listslistentriesInputSchema
>;
const Postv2listslistentriesResponseSchema = z.record(z.string(), z.unknown());
export type Postv2listslistentriesResponse = z.infer<
	typeof Postv2listslistentriesResponseSchema
>;

const CreatenoteInputSchema = z.record(z.string(), z.unknown());
export type CreatenoteInput = z.infer<typeof CreatenoteInputSchema>;
const CreatenoteResponseSchema = z.record(z.string(), z.unknown());
export type CreatenoteResponse = z.infer<typeof CreatenoteResponseSchema>;

const CreateobjectInputSchema = z.record(z.string(), z.unknown());
export type CreateobjectInput = z.infer<typeof CreateobjectInputSchema>;
const CreateobjectResponseSchema = z.record(z.string(), z.unknown());
export type CreateobjectResponse = z.infer<typeof CreateobjectResponseSchema>;

const CreatepersonInputSchema = z.record(z.string(), z.unknown());
export type CreatepersonInput = z.infer<typeof CreatepersonInputSchema>;
const CreatepersonResponseSchema = z.record(z.string(), z.unknown());
export type CreatepersonResponse = z.infer<typeof CreatepersonResponseSchema>;

const CreaterecordInputSchema = z.record(z.string(), z.unknown());
export type CreaterecordInput = z.infer<typeof CreaterecordInputSchema>;
const CreaterecordResponseSchema = z.record(z.string(), z.unknown());
export type CreaterecordResponse = z.infer<typeof CreaterecordResponseSchema>;

const CreateselectoptionInputSchema = z.record(z.string(), z.unknown());
export type CreateselectoptionInput = z.infer<
	typeof CreateselectoptionInputSchema
>;
const CreateselectoptionResponseSchema = z.record(z.string(), z.unknown());
export type CreateselectoptionResponse = z.infer<
	typeof CreateselectoptionResponseSchema
>;

const CreatestatusInputSchema = z.record(z.string(), z.unknown());
export type CreatestatusInput = z.infer<typeof CreatestatusInputSchema>;
const CreatestatusResponseSchema = z.record(z.string(), z.unknown());
export type CreatestatusResponse = z.infer<typeof CreatestatusResponseSchema>;

const CreatetaskInputSchema = z.record(z.string(), z.unknown());
export type CreatetaskInput = z.infer<typeof CreatetaskInputSchema>;
const CreatetaskResponseSchema = z.record(z.string(), z.unknown());
export type CreatetaskResponse = z.infer<typeof CreatetaskResponseSchema>;

const CreateuserrecordInputSchema = z.record(z.string(), z.unknown());
export type CreateuserrecordInput = z.infer<typeof CreateuserrecordInputSchema>;
const CreateuserrecordResponseSchema = z.record(z.string(), z.unknown());
export type CreateuserrecordResponse = z.infer<
	typeof CreateuserrecordResponseSchema
>;

const CreatewebhookInputSchema = z.record(z.string(), z.unknown());
export type CreatewebhookInput = z.infer<typeof CreatewebhookInputSchema>;
const CreatewebhookResponseSchema = z.record(z.string(), z.unknown());
export type CreatewebhookResponse = z.infer<typeof CreatewebhookResponseSchema>;

const CreateworkspacerecordInputSchema = z.record(z.string(), z.unknown());
export type CreateworkspacerecordInput = z.infer<
	typeof CreateworkspacerecordInputSchema
>;
const CreateworkspacerecordResponseSchema = z.record(z.string(), z.unknown());
export type CreateworkspacerecordResponse = z.infer<
	typeof CreateworkspacerecordResponseSchema
>;

const Postv2objectsobjectrecordsInputSchema = z.record(z.string(), z.unknown());
export type Postv2objectsobjectrecordsInput = z.infer<
	typeof Postv2objectsobjectrecordsInputSchema
>;
const Postv2objectsobjectrecordsResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Postv2objectsobjectrecordsResponse = z.infer<
	typeof Postv2objectsobjectrecordsResponseSchema
>;

const DeletecommentInputSchema = z.record(z.string(), z.unknown());
export type DeletecommentInput = z.infer<typeof DeletecommentInputSchema>;
const DeletecommentResponseSchema = z.record(z.string(), z.unknown());
export type DeletecommentResponse = z.infer<typeof DeletecommentResponseSchema>;

const DeletecompanyInputSchema = z.record(z.string(), z.unknown());
export type DeletecompanyInput = z.infer<typeof DeletecompanyInputSchema>;
const DeletecompanyResponseSchema = z.record(z.string(), z.unknown());
export type DeletecompanyResponse = z.infer<typeof DeletecompanyResponseSchema>;

const DeletedealInputSchema = z.record(z.string(), z.unknown());
export type DeletedealInput = z.infer<typeof DeletedealInputSchema>;
const DeletedealResponseSchema = z.record(z.string(), z.unknown());
export type DeletedealResponse = z.infer<typeof DeletedealResponseSchema>;

const DeleteentryInputSchema = z.record(z.string(), z.unknown());
export type DeleteentryInput = z.infer<typeof DeleteentryInputSchema>;
const DeleteentryResponseSchema = z.record(z.string(), z.unknown());
export type DeleteentryResponse = z.infer<typeof DeleteentryResponseSchema>;

const DeletenoteInputSchema = z.record(z.string(), z.unknown());
export type DeletenoteInput = z.infer<typeof DeletenoteInputSchema>;
const DeletenoteResponseSchema = z.record(z.string(), z.unknown());
export type DeletenoteResponse = z.infer<typeof DeletenoteResponseSchema>;

const DeletepersonInputSchema = z.record(z.string(), z.unknown());
export type DeletepersonInput = z.infer<typeof DeletepersonInputSchema>;
const DeletepersonResponseSchema = z.record(z.string(), z.unknown());
export type DeletepersonResponse = z.infer<typeof DeletepersonResponseSchema>;

const DeleterecordInputSchema = z.record(z.string(), z.unknown());
export type DeleterecordInput = z.infer<typeof DeleterecordInputSchema>;
const DeleterecordResponseSchema = z.record(z.string(), z.unknown());
export type DeleterecordResponse = z.infer<typeof DeleterecordResponseSchema>;

const DeleterecordbyidInputSchema = z.record(z.string(), z.unknown());
export type DeleterecordbyidInput = z.infer<typeof DeleterecordbyidInputSchema>;
const DeleterecordbyidResponseSchema = z.record(z.string(), z.unknown());
export type DeleterecordbyidResponse = z.infer<
	typeof DeleterecordbyidResponseSchema
>;

const DeletetaskInputSchema = z.record(z.string(), z.unknown());
export type DeletetaskInput = z.infer<typeof DeletetaskInputSchema>;
const DeletetaskResponseSchema = z.record(z.string(), z.unknown());
export type DeletetaskResponse = z.infer<typeof DeletetaskResponseSchema>;

const DeleteuserInputSchema = z.record(z.string(), z.unknown());
export type DeleteuserInput = z.infer<typeof DeleteuserInputSchema>;
const DeleteuserResponseSchema = z.record(z.string(), z.unknown());
export type DeleteuserResponse = z.infer<typeof DeleteuserResponseSchema>;

const DeletewebhookInputSchema = z.record(z.string(), z.unknown());
export type DeletewebhookInput = z.infer<typeof DeletewebhookInputSchema>;
const DeletewebhookResponseSchema = z.record(z.string(), z.unknown());
export type DeletewebhookResponse = z.infer<typeof DeletewebhookResponseSchema>;

const DeleteworkspacerecordInputSchema = z.record(z.string(), z.unknown());
export type DeleteworkspacerecordInput = z.infer<
	typeof DeleteworkspacerecordInputSchema
>;
const DeleteworkspacerecordResponseSchema = z.record(z.string(), z.unknown());
export type DeleteworkspacerecordResponse = z.infer<
	typeof DeleteworkspacerecordResponseSchema
>;

const FindrecordInputSchema = z.record(z.string(), z.unknown());
export type FindrecordInput = z.infer<typeof FindrecordInputSchema>;
const FindrecordResponseSchema = z.record(z.string(), z.unknown());
export type FindrecordResponse = z.infer<typeof FindrecordResponseSchema>;

const GetattributeInputSchema = z.record(z.string(), z.unknown());
export type GetattributeInput = z.infer<typeof GetattributeInputSchema>;
const GetattributeResponseSchema = z.record(z.string(), z.unknown());
export type GetattributeResponse = z.infer<typeof GetattributeResponseSchema>;

const GetcommentInputSchema = z.record(z.string(), z.unknown());
export type GetcommentInput = z.infer<typeof GetcommentInputSchema>;
const GetcommentResponseSchema = z.record(z.string(), z.unknown());
export type GetcommentResponse = z.infer<typeof GetcommentResponseSchema>;

const GetcompanyInputSchema = z.record(z.string(), z.unknown());
export type GetcompanyInput = z.infer<typeof GetcompanyInputSchema>;
const GetcompanyResponseSchema = z.record(z.string(), z.unknown());
export type GetcompanyResponse = z.infer<typeof GetcompanyResponseSchema>;

const GetselfInputSchema = z.record(z.string(), z.unknown());
export type GetselfInput = z.infer<typeof GetselfInputSchema>;
const GetselfResponseSchema = z.record(z.string(), z.unknown());
export type GetselfResponse = z.infer<typeof GetselfResponseSchema>;

const GetdealrecordInputSchema = z.record(z.string(), z.unknown());
export type GetdealrecordInput = z.infer<typeof GetdealrecordInputSchema>;
const GetdealrecordResponseSchema = z.record(z.string(), z.unknown());
export type GetdealrecordResponse = z.infer<typeof GetdealrecordResponseSchema>;

const GetlistInputSchema = z.record(z.string(), z.unknown());
export type GetlistInput = z.infer<typeof GetlistInputSchema>;
const GetlistResponseSchema = z.record(z.string(), z.unknown());
export type GetlistResponse = z.infer<typeof GetlistResponseSchema>;

const GetlistentryInputSchema = z.record(z.string(), z.unknown());
export type GetlistentryInput = z.infer<typeof GetlistentryInputSchema>;
const GetlistentryResponseSchema = z.record(z.string(), z.unknown());
export type GetlistentryResponse = z.infer<typeof GetlistentryResponseSchema>;

const GetnoteInputSchema = z.record(z.string(), z.unknown());
export type GetnoteInput = z.infer<typeof GetnoteInputSchema>;
const GetnoteResponseSchema = z.record(z.string(), z.unknown());
export type GetnoteResponse = z.infer<typeof GetnoteResponseSchema>;

const GetobjectInputSchema = z.record(z.string(), z.unknown());
export type GetobjectInput = z.infer<typeof GetobjectInputSchema>;
const GetobjectResponseSchema = z.record(z.string(), z.unknown());
export type GetobjectResponse = z.infer<typeof GetobjectResponseSchema>;

const PeoplegetpersonInputSchema = z.record(z.string(), z.unknown());
export type PeoplegetpersonInput = z.infer<typeof PeoplegetpersonInputSchema>;
const PeoplegetpersonResponseSchema = z.record(z.string(), z.unknown());
export type PeoplegetpersonResponse = z.infer<
	typeof PeoplegetpersonResponseSchema
>;

const GetrecordInputSchema = z.record(z.string(), z.unknown());
export type GetrecordInput = z.infer<typeof GetrecordInputSchema>;
const GetrecordResponseSchema = z.record(z.string(), z.unknown());
export type GetrecordResponse = z.infer<typeof GetrecordResponseSchema>;

const GetrecordattributevaluesInputSchema = z.record(z.string(), z.unknown());
export type GetrecordattributevaluesInput = z.infer<
	typeof GetrecordattributevaluesInputSchema
>;
const GetrecordattributevaluesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type GetrecordattributevaluesResponse = z.infer<
	typeof GetrecordattributevaluesResponseSchema
>;

const Getv2objectsobjectrecordsrecordidInputSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Getv2objectsobjectrecordsrecordidInput = z.infer<
	typeof Getv2objectsobjectrecordsrecordidInputSchema
>;
const Getv2objectsobjectrecordsrecordidResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Getv2objectsobjectrecordsrecordidResponse = z.infer<
	typeof Getv2objectsobjectrecordsrecordidResponseSchema
>;

const GettaskInputSchema = z.record(z.string(), z.unknown());
export type GettaskInput = z.infer<typeof GettaskInputSchema>;
const GettaskResponseSchema = z.record(z.string(), z.unknown());
export type GettaskResponse = z.infer<typeof GettaskResponseSchema>;

const Getv2workspacemembersInputSchema = z.record(z.string(), z.unknown());
export type Getv2workspacemembersInput = z.infer<
	typeof Getv2workspacemembersInputSchema
>;
const Getv2workspacemembersResponseSchema = z.record(z.string(), z.unknown());
export type Getv2workspacemembersResponse = z.infer<
	typeof Getv2workspacemembersResponseSchema
>;

const GetwebhookInputSchema = z.record(z.string(), z.unknown());
export type GetwebhookInput = z.infer<typeof GetwebhookInputSchema>;
const GetwebhookResponseSchema = z.record(z.string(), z.unknown());
export type GetwebhookResponse = z.infer<typeof GetwebhookResponseSchema>;

const GetworkspacememberInputSchema = z.record(z.string(), z.unknown());
export type GetworkspacememberInput = z.infer<
	typeof GetworkspacememberInputSchema
>;
const GetworkspacememberResponseSchema = z.record(z.string(), z.unknown());
export type GetworkspacememberResponse = z.infer<
	typeof GetworkspacememberResponseSchema
>;

const GetworkspacerecordInputSchema = z.record(z.string(), z.unknown());
export type GetworkspacerecordInput = z.infer<
	typeof GetworkspacerecordInputSchema
>;
const GetworkspacerecordResponseSchema = z.record(z.string(), z.unknown());
export type GetworkspacerecordResponse = z.infer<
	typeof GetworkspacerecordResponseSchema
>;

const ListattributeoptionsInputSchema = z.record(z.string(), z.unknown());
export type ListattributeoptionsInput = z.infer<
	typeof ListattributeoptionsInputSchema
>;
const ListattributeoptionsResponseSchema = z.record(z.string(), z.unknown());
export type ListattributeoptionsResponse = z.infer<
	typeof ListattributeoptionsResponseSchema
>;

const ListattributestatusesInputSchema = z.record(z.string(), z.unknown());
export type ListattributestatusesInput = z.infer<
	typeof ListattributestatusesInputSchema
>;
const ListattributestatusesResponseSchema = z.record(z.string(), z.unknown());
export type ListattributestatusesResponse = z.infer<
	typeof ListattributestatusesResponseSchema
>;

const ListattributesInputSchema = z.record(z.string(), z.unknown());
export type ListattributesInput = z.infer<typeof ListattributesInputSchema>;
const ListattributesResponseSchema = z.record(z.string(), z.unknown());
export type ListattributesResponse = z.infer<
	typeof ListattributesResponseSchema
>;

const ListcallrecordingsInputSchema = z.record(z.string(), z.unknown());
export type ListcallrecordingsInput = z.infer<
	typeof ListcallrecordingsInputSchema
>;
const ListcallrecordingsResponseSchema = z.record(z.string(), z.unknown());
export type ListcallrecordingsResponse = z.infer<
	typeof ListcallrecordingsResponseSchema
>;

const ListcompaniesInputSchema = z.record(z.string(), z.unknown());
export type ListcompaniesInput = z.infer<typeof ListcompaniesInputSchema>;
const ListcompaniesResponseSchema = z.record(z.string(), z.unknown());
export type ListcompaniesResponse = z.infer<typeof ListcompaniesResponseSchema>;

const ListcompanyattributevaluesInputSchema = z.record(z.string(), z.unknown());
export type ListcompanyattributevaluesInput = z.infer<
	typeof ListcompanyattributevaluesInputSchema
>;
const ListcompanyattributevaluesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListcompanyattributevaluesResponse = z.infer<
	typeof ListcompanyattributevaluesResponseSchema
>;

const ListcompanyrecordentriesInputSchema = z.record(z.string(), z.unknown());
export type ListcompanyrecordentriesInput = z.infer<
	typeof ListcompanyrecordentriesInputSchema
>;
const ListcompanyrecordentriesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListcompanyrecordentriesResponse = z.infer<
	typeof ListcompanyrecordentriesResponseSchema
>;

const ListdealentriesInputSchema = z.record(z.string(), z.unknown());
export type ListdealentriesInput = z.infer<typeof ListdealentriesInputSchema>;
const ListdealentriesResponseSchema = z.record(z.string(), z.unknown());
export type ListdealentriesResponse = z.infer<
	typeof ListdealentriesResponseSchema
>;

const ListdealrecordattributevaluesInputSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListdealrecordattributevaluesInput = z.infer<
	typeof ListdealrecordattributevaluesInputSchema
>;
const ListdealrecordattributevaluesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListdealrecordattributevaluesResponse = z.infer<
	typeof ListdealrecordattributevaluesResponseSchema
>;

const ListdealrecordsInputSchema = z.record(z.string(), z.unknown());
export type ListdealrecordsInput = z.infer<typeof ListdealrecordsInputSchema>;
const ListdealrecordsResponseSchema = z.record(z.string(), z.unknown());
export type ListdealrecordsResponse = z.infer<
	typeof ListdealrecordsResponseSchema
>;

const ListentriesInputSchema = z.record(z.string(), z.unknown());
export type ListentriesInput = z.infer<typeof ListentriesInputSchema>;
const ListentriesResponseSchema = z.record(z.string(), z.unknown());
export type ListentriesResponse = z.infer<typeof ListentriesResponseSchema>;

const Postv2listslistentriesqueryInputSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Postv2listslistentriesqueryInput = z.infer<
	typeof Postv2listslistentriesqueryInputSchema
>;
const Postv2listslistentriesqueryResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Postv2listslistentriesqueryResponse = z.infer<
	typeof Postv2listslistentriesqueryResponseSchema
>;

const ListlistentriesInputSchema = z.record(z.string(), z.unknown());
export type ListlistentriesInput = z.infer<typeof ListlistentriesInputSchema>;
const ListlistentriesResponseSchema = z.record(z.string(), z.unknown());
export type ListlistentriesResponse = z.infer<
	typeof ListlistentriesResponseSchema
>;

const ListlistentryattributevaluesInputSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListlistentryattributevaluesInput = z.infer<
	typeof ListlistentryattributevaluesInputSchema
>;
const ListlistentryattributevaluesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListlistentryattributevaluesResponse = z.infer<
	typeof ListlistentryattributevaluesResponseSchema
>;

const ListlistsInputSchema = z.record(z.string(), z.unknown());
export type ListlistsInput = z.infer<typeof ListlistsInputSchema>;
const ListlistsResponseSchema = z.record(z.string(), z.unknown());
export type ListlistsResponse = z.infer<typeof ListlistsResponseSchema>;

const ListmeetingsInputSchema = z.record(z.string(), z.unknown());
export type ListmeetingsInput = z.infer<typeof ListmeetingsInputSchema>;
const ListmeetingsResponseSchema = z.record(z.string(), z.unknown());
export type ListmeetingsResponse = z.infer<typeof ListmeetingsResponseSchema>;

const ListnotesInputSchema = z.record(z.string(), z.unknown());
export type ListnotesInput = z.infer<typeof ListnotesInputSchema>;
const ListnotesResponseSchema = z.record(z.string(), z.unknown());
export type ListnotesResponse = z.infer<typeof ListnotesResponseSchema>;

const ListobjectsInputSchema = z.record(z.string(), z.unknown());
export type ListobjectsInput = z.infer<typeof ListobjectsInputSchema>;
const ListobjectsResponseSchema = z.record(z.string(), z.unknown());
export type ListobjectsResponse = z.infer<typeof ListobjectsResponseSchema>;

const ListpeopleattributevaluesInputSchema = z.record(z.string(), z.unknown());
export type ListpeopleattributevaluesInput = z.infer<
	typeof ListpeopleattributevaluesInputSchema
>;
const ListpeopleattributevaluesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListpeopleattributevaluesResponse = z.infer<
	typeof ListpeopleattributevaluesResponseSchema
>;

const ListpeoplerecordentriesInputSchema = z.record(z.string(), z.unknown());
export type ListpeoplerecordentriesInput = z.infer<
	typeof ListpeoplerecordentriesInputSchema
>;
const ListpeoplerecordentriesResponseSchema = z.record(z.string(), z.unknown());
export type ListpeoplerecordentriesResponse = z.infer<
	typeof ListpeoplerecordentriesResponseSchema
>;

const PeoplelistpersonsInputSchema = z.record(z.string(), z.unknown());
export type PeoplelistpersonsInput = z.infer<
	typeof PeoplelistpersonsInputSchema
>;
const PeoplelistpersonsResponseSchema = z.record(z.string(), z.unknown());
export type PeoplelistpersonsResponse = z.infer<
	typeof PeoplelistpersonsResponseSchema
>;

const ListrecordattributevaluesInputSchema = z.record(z.string(), z.unknown());
export type ListrecordattributevaluesInput = z.infer<
	typeof ListrecordattributevaluesInputSchema
>;
const ListrecordattributevaluesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListrecordattributevaluesResponse = z.infer<
	typeof ListrecordattributevaluesResponseSchema
>;

const GetrecordentriesInputSchema = z.record(z.string(), z.unknown());
export type GetrecordentriesInput = z.infer<typeof GetrecordentriesInputSchema>;
const GetrecordentriesResponseSchema = z.record(z.string(), z.unknown());
export type GetrecordentriesResponse = z.infer<
	typeof GetrecordentriesResponseSchema
>;

const ListrecordentriesInputSchema = z.record(z.string(), z.unknown());
export type ListrecordentriesInput = z.infer<
	typeof ListrecordentriesInputSchema
>;
const ListrecordentriesResponseSchema = z.record(z.string(), z.unknown());
export type ListrecordentriesResponse = z.infer<
	typeof ListrecordentriesResponseSchema
>;

const ListrecordsInputSchema = z.record(z.string(), z.unknown());
export type ListrecordsInput = z.infer<typeof ListrecordsInputSchema>;
const ListrecordsResponseSchema = z.record(z.string(), z.unknown());
export type ListrecordsResponse = z.infer<typeof ListrecordsResponseSchema>;

const Postv2objectsobjectrecordsqueryInputSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Postv2objectsobjectrecordsqueryInput = z.infer<
	typeof Postv2objectsobjectrecordsqueryInputSchema
>;
const Postv2objectsobjectrecordsqueryResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Postv2objectsobjectrecordsqueryResponse = z.infer<
	typeof Postv2objectsobjectrecordsqueryResponseSchema
>;

const Getv2tasksInputSchema = z.record(z.string(), z.unknown());
export type Getv2tasksInput = z.infer<typeof Getv2tasksInputSchema>;
const Getv2tasksResponseSchema = z.record(z.string(), z.unknown());
export type Getv2tasksResponse = z.infer<typeof Getv2tasksResponseSchema>;

const ListthreadsInputSchema = z.record(z.string(), z.unknown());
export type ListthreadsInput = z.infer<typeof ListthreadsInputSchema>;
const ListthreadsResponseSchema = z.record(z.string(), z.unknown());
export type ListthreadsResponse = z.infer<typeof ListthreadsResponseSchema>;

const ListuserrecordentriesInputSchema = z.record(z.string(), z.unknown());
export type ListuserrecordentriesInput = z.infer<
	typeof ListuserrecordentriesInputSchema
>;
const ListuserrecordentriesResponseSchema = z.record(z.string(), z.unknown());
export type ListuserrecordentriesResponse = z.infer<
	typeof ListuserrecordentriesResponseSchema
>;

const ListuserrecordsInputSchema = z.record(z.string(), z.unknown());
export type ListuserrecordsInput = z.infer<typeof ListuserrecordsInputSchema>;
const ListuserrecordsResponseSchema = z.record(z.string(), z.unknown());
export type ListuserrecordsResponse = z.infer<
	typeof ListuserrecordsResponseSchema
>;

const ListwebhooksInputSchema = z.record(z.string(), z.unknown());
export type ListwebhooksInput = z.infer<typeof ListwebhooksInputSchema>;
const ListwebhooksResponseSchema = z.record(z.string(), z.unknown());
export type ListwebhooksResponse = z.infer<typeof ListwebhooksResponseSchema>;

const ListworkspacemembersInputSchema = z.record(z.string(), z.unknown());
export type ListworkspacemembersInput = z.infer<
	typeof ListworkspacemembersInputSchema
>;
const ListworkspacemembersResponseSchema = z.record(z.string(), z.unknown());
export type ListworkspacemembersResponse = z.infer<
	typeof ListworkspacemembersResponseSchema
>;

const ListworkspacerecordattributevaluesInputSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListworkspacerecordattributevaluesInput = z.infer<
	typeof ListworkspacerecordattributevaluesInputSchema
>;
const ListworkspacerecordattributevaluesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListworkspacerecordattributevaluesResponse = z.infer<
	typeof ListworkspacerecordattributevaluesResponseSchema
>;

const ListworkspacerecordentriesInputSchema = z.record(z.string(), z.unknown());
export type ListworkspacerecordentriesInput = z.infer<
	typeof ListworkspacerecordentriesInputSchema
>;
const ListworkspacerecordentriesResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type ListworkspacerecordentriesResponse = z.infer<
	typeof ListworkspacerecordentriesResponseSchema
>;

const ListworkspacerecordsInputSchema = z.record(z.string(), z.unknown());
export type ListworkspacerecordsInput = z.infer<
	typeof ListworkspacerecordsInputSchema
>;
const ListworkspacerecordsResponseSchema = z.record(z.string(), z.unknown());
export type ListworkspacerecordsResponse = z.infer<
	typeof ListworkspacerecordsResponseSchema
>;

const PatchrecordInputSchema = z.record(z.string(), z.unknown());
export type PatchrecordInput = z.infer<typeof PatchrecordInputSchema>;
const PatchrecordResponseSchema = z.record(z.string(), z.unknown());
export type PatchrecordResponse = z.infer<typeof PatchrecordResponseSchema>;

const Putv2objectsobjectrecordsrecordidInputSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Putv2objectsobjectrecordsrecordidInput = z.infer<
	typeof Putv2objectsobjectrecordsrecordidInputSchema
>;
const Putv2objectsobjectrecordsrecordidResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Putv2objectsobjectrecordsrecordidResponse = z.infer<
	typeof Putv2objectsobjectrecordsrecordidResponseSchema
>;

const QueryrecordsInputSchema = z.record(z.string(), z.unknown());
export type QueryrecordsInput = z.infer<typeof QueryrecordsInputSchema>;
const QueryrecordsResponseSchema = z.record(z.string(), z.unknown());
export type QueryrecordsResponse = z.infer<typeof QueryrecordsResponseSchema>;

const SearchrecordsInputSchema = z.record(z.string(), z.unknown());
export type SearchrecordsInput = z.infer<typeof SearchrecordsInputSchema>;
const SearchrecordsResponseSchema = z.record(z.string(), z.unknown());
export type SearchrecordsResponse = z.infer<typeof SearchrecordsResponseSchema>;

const Postv2objectsrecordssearchInputSchema = z.record(z.string(), z.unknown());
export type Postv2objectsrecordssearchInput = z.infer<
	typeof Postv2objectsrecordssearchInputSchema
>;
const Postv2objectsrecordssearchResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Postv2objectsrecordssearchResponse = z.infer<
	typeof Postv2objectsrecordssearchResponseSchema
>;

const UpdateattributeInputSchema = z.record(z.string(), z.unknown());
export type UpdateattributeInput = z.infer<typeof UpdateattributeInputSchema>;
const UpdateattributeResponseSchema = z.record(z.string(), z.unknown());
export type UpdateattributeResponse = z.infer<
	typeof UpdateattributeResponseSchema
>;

const UpdatecompanyInputSchema = z.record(z.string(), z.unknown());
export type UpdatecompanyInput = z.infer<typeof UpdatecompanyInputSchema>;
const UpdatecompanyResponseSchema = z.record(z.string(), z.unknown());
export type UpdatecompanyResponse = z.infer<typeof UpdatecompanyResponseSchema>;

const UpdatedealrecordInputSchema = z.record(z.string(), z.unknown());
export type UpdatedealrecordInput = z.infer<typeof UpdatedealrecordInputSchema>;
const UpdatedealrecordResponseSchema = z.record(z.string(), z.unknown());
export type UpdatedealrecordResponse = z.infer<
	typeof UpdatedealrecordResponseSchema
>;

const UpdateentryInputSchema = z.record(z.string(), z.unknown());
export type UpdateentryInput = z.infer<typeof UpdateentryInputSchema>;
const UpdateentryResponseSchema = z.record(z.string(), z.unknown());
export type UpdateentryResponse = z.infer<typeof UpdateentryResponseSchema>;

const UpdatelistInputSchema = z.record(z.string(), z.unknown());
export type UpdatelistInput = z.infer<typeof UpdatelistInputSchema>;
const UpdatelistResponseSchema = z.record(z.string(), z.unknown());
export type UpdatelistResponse = z.infer<typeof UpdatelistResponseSchema>;

const Patchv2listslistentriesentryidInputSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Patchv2listslistentriesentryidInput = z.infer<
	typeof Patchv2listslistentriesentryidInputSchema
>;
const Patchv2listslistentriesentryidResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Patchv2listslistentriesentryidResponse = z.infer<
	typeof Patchv2listslistentriesentryidResponseSchema
>;

const Putv2listslistentriesentryidInputSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Putv2listslistentriesentryidInput = z.infer<
	typeof Putv2listslistentriesentryidInputSchema
>;
const Putv2listslistentriesentryidResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type Putv2listslistentriesentryidResponse = z.infer<
	typeof Putv2listslistentriesentryidResponseSchema
>;

const UpdateobjectInputSchema = z.record(z.string(), z.unknown());
export type UpdateobjectInput = z.infer<typeof UpdateobjectInputSchema>;
const UpdateobjectResponseSchema = z.record(z.string(), z.unknown());
export type UpdateobjectResponse = z.infer<typeof UpdateobjectResponseSchema>;

const UpdatepersonInputSchema = z.record(z.string(), z.unknown());
export type UpdatepersonInput = z.infer<typeof UpdatepersonInputSchema>;
const UpdatepersonResponseSchema = z.record(z.string(), z.unknown());
export type UpdatepersonResponse = z.infer<typeof UpdatepersonResponseSchema>;

const UpdaterecordInputSchema = z.record(z.string(), z.unknown());
export type UpdaterecordInput = z.infer<typeof UpdaterecordInputSchema>;
const UpdaterecordResponseSchema = z.record(z.string(), z.unknown());
export type UpdaterecordResponse = z.infer<typeof UpdaterecordResponseSchema>;

const UpdateselectoptionInputSchema = z.record(z.string(), z.unknown());
export type UpdateselectoptionInput = z.infer<
	typeof UpdateselectoptionInputSchema
>;
const UpdateselectoptionResponseSchema = z.record(z.string(), z.unknown());
export type UpdateselectoptionResponse = z.infer<
	typeof UpdateselectoptionResponseSchema
>;

const UpdatestatusInputSchema = z.record(z.string(), z.unknown());
export type UpdatestatusInput = z.infer<typeof UpdatestatusInputSchema>;
const UpdatestatusResponseSchema = z.record(z.string(), z.unknown());
export type UpdatestatusResponse = z.infer<typeof UpdatestatusResponseSchema>;

const UpdatetaskInputSchema = z.record(z.string(), z.unknown());
export type UpdatetaskInput = z.infer<typeof UpdatetaskInputSchema>;
const UpdatetaskResponseSchema = z.record(z.string(), z.unknown());
export type UpdatetaskResponse = z.infer<typeof UpdatetaskResponseSchema>;

const UpdateuserrecordInputSchema = z.record(z.string(), z.unknown());
export type UpdateuserrecordInput = z.infer<typeof UpdateuserrecordInputSchema>;
const UpdateuserrecordResponseSchema = z.record(z.string(), z.unknown());
export type UpdateuserrecordResponse = z.infer<
	typeof UpdateuserrecordResponseSchema
>;

const UpdatewebhookInputSchema = z.record(z.string(), z.unknown());
export type UpdatewebhookInput = z.infer<typeof UpdatewebhookInputSchema>;
const UpdatewebhookResponseSchema = z.record(z.string(), z.unknown());
export type UpdatewebhookResponse = z.infer<typeof UpdatewebhookResponseSchema>;

const UpdateworkspacerecordInputSchema = z.record(z.string(), z.unknown());
export type UpdateworkspacerecordInput = z.infer<
	typeof UpdateworkspacerecordInputSchema
>;
const UpdateworkspacerecordResponseSchema = z.record(z.string(), z.unknown());
export type UpdateworkspacerecordResponse = z.infer<
	typeof UpdateworkspacerecordResponseSchema
>;

export type GeneratedEndpointInputs = {
	putV2ListsListEntries: Putv2listslistentriesInput;
	assertPerson: AssertpersonInput;
	putV2ObjectsObjectRecords: Putv2objectsobjectrecordsInput;
	assertUserRecord: AssertuserrecordInput;
	assertWorkspace: AssertworkspaceInput;
	createAttribute: CreateattributeInput;
	createComment: CreatecommentInput;
	createCompany: CreatecompanyInput;
	createDealRecord: CreatedealrecordInput;
	createEntry: CreateentryInput;
	createList: CreatelistInput;
	postV2ListsListEntries: Postv2listslistentriesInput;
	createNote: CreatenoteInput;
	createObject: CreateobjectInput;
	createPerson: CreatepersonInput;
	createRecord: CreaterecordInput;
	createSelectOption: CreateselectoptionInput;
	createStatus: CreatestatusInput;
	createTask: CreatetaskInput;
	createUserRecord: CreateuserrecordInput;
	createWebhook: CreatewebhookInput;
	createWorkspaceRecord: CreateworkspacerecordInput;
	postV2ObjectsObjectRecords: Postv2objectsobjectrecordsInput;
	deleteComment: DeletecommentInput;
	deleteCompany: DeletecompanyInput;
	deleteDeal: DeletedealInput;
	deleteEntry: DeleteentryInput;
	deleteNote: DeletenoteInput;
	deletePerson: DeletepersonInput;
	deleteRecord: DeleterecordInput;
	deleteRecordById: DeleterecordbyidInput;
	deleteTask: DeletetaskInput;
	deleteUser: DeleteuserInput;
	deleteWebhook: DeletewebhookInput;
	deleteWorkspaceRecord: DeleteworkspacerecordInput;
	findRecord: FindrecordInput;
	getAttribute: GetattributeInput;
	getComment: GetcommentInput;
	getCompany: GetcompanyInput;
	getSelf: GetselfInput;
	getDealRecord: GetdealrecordInput;
	getList: GetlistInput;
	getListEntry: GetlistentryInput;
	getNote: GetnoteInput;
	getObject: GetobjectInput;
	peopleGetPerson: PeoplegetpersonInput;
	getRecord: GetrecordInput;
	getRecordAttributeValues: GetrecordattributevaluesInput;
	getV2ObjectsObjectRecordsRecordId: Getv2objectsobjectrecordsrecordidInput;
	getTask: GettaskInput;
	getV2WorkspaceMembers: Getv2workspacemembersInput;
	getWebhook: GetwebhookInput;
	getWorkspaceMember: GetworkspacememberInput;
	getWorkspaceRecord: GetworkspacerecordInput;
	listAttributeOptions: ListattributeoptionsInput;
	listAttributeStatuses: ListattributestatusesInput;
	listAttributes: ListattributesInput;
	listCallRecordings: ListcallrecordingsInput;
	listCompanies: ListcompaniesInput;
	listCompanyAttributeValues: ListcompanyattributevaluesInput;
	listCompanyRecordEntries: ListcompanyrecordentriesInput;
	listDealEntries: ListdealentriesInput;
	listDealRecordAttributeValues: ListdealrecordattributevaluesInput;
	listDealRecords: ListdealrecordsInput;
	listEntries: ListentriesInput;
	postV2ListsListEntriesQuery: Postv2listslistentriesqueryInput;
	listListEntries: ListlistentriesInput;
	listListEntryAttributeValues: ListlistentryattributevaluesInput;
	listLists: ListlistsInput;
	listMeetings: ListmeetingsInput;
	listNotes: ListnotesInput;
	listObjects: ListobjectsInput;
	listPeopleAttributeValues: ListpeopleattributevaluesInput;
	listPeopleRecordEntries: ListpeoplerecordentriesInput;
	peopleListPersons: PeoplelistpersonsInput;
	listRecordAttributeValues: ListrecordattributevaluesInput;
	getRecordEntries: GetrecordentriesInput;
	listRecordEntries: ListrecordentriesInput;
	listRecords: ListrecordsInput;
	postV2ObjectsObjectRecordsQuery: Postv2objectsobjectrecordsqueryInput;
	getV2Tasks: Getv2tasksInput;
	listThreads: ListthreadsInput;
	listUserRecordEntries: ListuserrecordentriesInput;
	listUserRecords: ListuserrecordsInput;
	listWebhooks: ListwebhooksInput;
	listWorkspaceMembers: ListworkspacemembersInput;
	listWorkspaceRecordAttributeValues: ListworkspacerecordattributevaluesInput;
	listWorkspaceRecordEntries: ListworkspacerecordentriesInput;
	listWorkspaceRecords: ListworkspacerecordsInput;
	patchRecord: PatchrecordInput;
	putV2ObjectsObjectRecordsRecordId: Putv2objectsobjectrecordsrecordidInput;
	queryRecords: QueryrecordsInput;
	searchRecords: SearchrecordsInput;
	postV2ObjectsRecordsSearch: Postv2objectsrecordssearchInput;
	updateAttribute: UpdateattributeInput;
	updateCompany: UpdatecompanyInput;
	updateDealRecord: UpdatedealrecordInput;
	updateEntry: UpdateentryInput;
	updateList: UpdatelistInput;
	patchV2ListsListEntriesEntryId: Patchv2listslistentriesentryidInput;
	putV2ListsListEntriesEntryId: Putv2listslistentriesentryidInput;
	updateObject: UpdateobjectInput;
	updatePerson: UpdatepersonInput;
	updateRecord: UpdaterecordInput;
	updateSelectOption: UpdateselectoptionInput;
	updateStatus: UpdatestatusInput;
	updateTask: UpdatetaskInput;
	updateUserRecord: UpdateuserrecordInput;
	updateWebhook: UpdatewebhookInput;
	updateWorkspaceRecord: UpdateworkspacerecordInput;
};

export type GeneratedEndpointOutputs = {
	putV2ListsListEntries: Putv2listslistentriesResponse;
	assertPerson: AssertpersonResponse;
	putV2ObjectsObjectRecords: Putv2objectsobjectrecordsResponse;
	assertUserRecord: AssertuserrecordResponse;
	assertWorkspace: AssertworkspaceResponse;
	createAttribute: CreateattributeResponse;
	createComment: CreatecommentResponse;
	createCompany: CreatecompanyResponse;
	createDealRecord: CreatedealrecordResponse;
	createEntry: CreateentryResponse;
	createList: CreatelistResponse;
	postV2ListsListEntries: Postv2listslistentriesResponse;
	createNote: CreatenoteResponse;
	createObject: CreateobjectResponse;
	createPerson: CreatepersonResponse;
	createRecord: CreaterecordResponse;
	createSelectOption: CreateselectoptionResponse;
	createStatus: CreatestatusResponse;
	createTask: CreatetaskResponse;
	createUserRecord: CreateuserrecordResponse;
	createWebhook: CreatewebhookResponse;
	createWorkspaceRecord: CreateworkspacerecordResponse;
	postV2ObjectsObjectRecords: Postv2objectsobjectrecordsResponse;
	deleteComment: DeletecommentResponse;
	deleteCompany: DeletecompanyResponse;
	deleteDeal: DeletedealResponse;
	deleteEntry: DeleteentryResponse;
	deleteNote: DeletenoteResponse;
	deletePerson: DeletepersonResponse;
	deleteRecord: DeleterecordResponse;
	deleteRecordById: DeleterecordbyidResponse;
	deleteTask: DeletetaskResponse;
	deleteUser: DeleteuserResponse;
	deleteWebhook: DeletewebhookResponse;
	deleteWorkspaceRecord: DeleteworkspacerecordResponse;
	findRecord: FindrecordResponse;
	getAttribute: GetattributeResponse;
	getComment: GetcommentResponse;
	getCompany: GetcompanyResponse;
	getSelf: GetselfResponse;
	getDealRecord: GetdealrecordResponse;
	getList: GetlistResponse;
	getListEntry: GetlistentryResponse;
	getNote: GetnoteResponse;
	getObject: GetobjectResponse;
	peopleGetPerson: PeoplegetpersonResponse;
	getRecord: GetrecordResponse;
	getRecordAttributeValues: GetrecordattributevaluesResponse;
	getV2ObjectsObjectRecordsRecordId: Getv2objectsobjectrecordsrecordidResponse;
	getTask: GettaskResponse;
	getV2WorkspaceMembers: Getv2workspacemembersResponse;
	getWebhook: GetwebhookResponse;
	getWorkspaceMember: GetworkspacememberResponse;
	getWorkspaceRecord: GetworkspacerecordResponse;
	listAttributeOptions: ListattributeoptionsResponse;
	listAttributeStatuses: ListattributestatusesResponse;
	listAttributes: ListattributesResponse;
	listCallRecordings: ListcallrecordingsResponse;
	listCompanies: ListcompaniesResponse;
	listCompanyAttributeValues: ListcompanyattributevaluesResponse;
	listCompanyRecordEntries: ListcompanyrecordentriesResponse;
	listDealEntries: ListdealentriesResponse;
	listDealRecordAttributeValues: ListdealrecordattributevaluesResponse;
	listDealRecords: ListdealrecordsResponse;
	listEntries: ListentriesResponse;
	postV2ListsListEntriesQuery: Postv2listslistentriesqueryResponse;
	listListEntries: ListlistentriesResponse;
	listListEntryAttributeValues: ListlistentryattributevaluesResponse;
	listLists: ListlistsResponse;
	listMeetings: ListmeetingsResponse;
	listNotes: ListnotesResponse;
	listObjects: ListobjectsResponse;
	listPeopleAttributeValues: ListpeopleattributevaluesResponse;
	listPeopleRecordEntries: ListpeoplerecordentriesResponse;
	peopleListPersons: PeoplelistpersonsResponse;
	listRecordAttributeValues: ListrecordattributevaluesResponse;
	getRecordEntries: GetrecordentriesResponse;
	listRecordEntries: ListrecordentriesResponse;
	listRecords: ListrecordsResponse;
	postV2ObjectsObjectRecordsQuery: Postv2objectsobjectrecordsqueryResponse;
	getV2Tasks: Getv2tasksResponse;
	listThreads: ListthreadsResponse;
	listUserRecordEntries: ListuserrecordentriesResponse;
	listUserRecords: ListuserrecordsResponse;
	listWebhooks: ListwebhooksResponse;
	listWorkspaceMembers: ListworkspacemembersResponse;
	listWorkspaceRecordAttributeValues: ListworkspacerecordattributevaluesResponse;
	listWorkspaceRecordEntries: ListworkspacerecordentriesResponse;
	listWorkspaceRecords: ListworkspacerecordsResponse;
	patchRecord: PatchrecordResponse;
	putV2ObjectsObjectRecordsRecordId: Putv2objectsobjectrecordsrecordidResponse;
	queryRecords: QueryrecordsResponse;
	searchRecords: SearchrecordsResponse;
	postV2ObjectsRecordsSearch: Postv2objectsrecordssearchResponse;
	updateAttribute: UpdateattributeResponse;
	updateCompany: UpdatecompanyResponse;
	updateDealRecord: UpdatedealrecordResponse;
	updateEntry: UpdateentryResponse;
	updateList: UpdatelistResponse;
	patchV2ListsListEntriesEntryId: Patchv2listslistentriesentryidResponse;
	putV2ListsListEntriesEntryId: Putv2listslistentriesentryidResponse;
	updateObject: UpdateobjectResponse;
	updatePerson: UpdatepersonResponse;
	updateRecord: UpdaterecordResponse;
	updateSelectOption: UpdateselectoptionResponse;
	updateStatus: UpdatestatusResponse;
	updateTask: UpdatetaskResponse;
	updateUserRecord: UpdateuserrecordResponse;
	updateWebhook: UpdatewebhookResponse;
	updateWorkspaceRecord: UpdateworkspacerecordResponse;
};

export const GeneratedEndpointInputSchemas = {
	putV2ListsListEntries: Putv2listslistentriesInputSchema,
	assertPerson: AssertpersonInputSchema,
	putV2ObjectsObjectRecords: Putv2objectsobjectrecordsInputSchema,
	assertUserRecord: AssertuserrecordInputSchema,
	assertWorkspace: AssertworkspaceInputSchema,
	createAttribute: CreateattributeInputSchema,
	createComment: CreatecommentInputSchema,
	createCompany: CreatecompanyInputSchema,
	createDealRecord: CreatedealrecordInputSchema,
	createEntry: CreateentryInputSchema,
	createList: CreatelistInputSchema,
	postV2ListsListEntries: Postv2listslistentriesInputSchema,
	createNote: CreatenoteInputSchema,
	createObject: CreateobjectInputSchema,
	createPerson: CreatepersonInputSchema,
	createRecord: CreaterecordInputSchema,
	createSelectOption: CreateselectoptionInputSchema,
	createStatus: CreatestatusInputSchema,
	createTask: CreatetaskInputSchema,
	createUserRecord: CreateuserrecordInputSchema,
	createWebhook: CreatewebhookInputSchema,
	createWorkspaceRecord: CreateworkspacerecordInputSchema,
	postV2ObjectsObjectRecords: Postv2objectsobjectrecordsInputSchema,
	deleteComment: DeletecommentInputSchema,
	deleteCompany: DeletecompanyInputSchema,
	deleteDeal: DeletedealInputSchema,
	deleteEntry: DeleteentryInputSchema,
	deleteNote: DeletenoteInputSchema,
	deletePerson: DeletepersonInputSchema,
	deleteRecord: DeleterecordInputSchema,
	deleteRecordById: DeleterecordbyidInputSchema,
	deleteTask: DeletetaskInputSchema,
	deleteUser: DeleteuserInputSchema,
	deleteWebhook: DeletewebhookInputSchema,
	deleteWorkspaceRecord: DeleteworkspacerecordInputSchema,
	findRecord: FindrecordInputSchema,
	getAttribute: GetattributeInputSchema,
	getComment: GetcommentInputSchema,
	getCompany: GetcompanyInputSchema,
	getSelf: GetselfInputSchema,
	getDealRecord: GetdealrecordInputSchema,
	getList: GetlistInputSchema,
	getListEntry: GetlistentryInputSchema,
	getNote: GetnoteInputSchema,
	getObject: GetobjectInputSchema,
	peopleGetPerson: PeoplegetpersonInputSchema,
	getRecord: GetrecordInputSchema,
	getRecordAttributeValues: GetrecordattributevaluesInputSchema,
	getV2ObjectsObjectRecordsRecordId:
		Getv2objectsobjectrecordsrecordidInputSchema,
	getTask: GettaskInputSchema,
	getV2WorkspaceMembers: Getv2workspacemembersInputSchema,
	getWebhook: GetwebhookInputSchema,
	getWorkspaceMember: GetworkspacememberInputSchema,
	getWorkspaceRecord: GetworkspacerecordInputSchema,
	listAttributeOptions: ListattributeoptionsInputSchema,
	listAttributeStatuses: ListattributestatusesInputSchema,
	listAttributes: ListattributesInputSchema,
	listCallRecordings: ListcallrecordingsInputSchema,
	listCompanies: ListcompaniesInputSchema,
	listCompanyAttributeValues: ListcompanyattributevaluesInputSchema,
	listCompanyRecordEntries: ListcompanyrecordentriesInputSchema,
	listDealEntries: ListdealentriesInputSchema,
	listDealRecordAttributeValues: ListdealrecordattributevaluesInputSchema,
	listDealRecords: ListdealrecordsInputSchema,
	listEntries: ListentriesInputSchema,
	postV2ListsListEntriesQuery: Postv2listslistentriesqueryInputSchema,
	listListEntries: ListlistentriesInputSchema,
	listListEntryAttributeValues: ListlistentryattributevaluesInputSchema,
	listLists: ListlistsInputSchema,
	listMeetings: ListmeetingsInputSchema,
	listNotes: ListnotesInputSchema,
	listObjects: ListobjectsInputSchema,
	listPeopleAttributeValues: ListpeopleattributevaluesInputSchema,
	listPeopleRecordEntries: ListpeoplerecordentriesInputSchema,
	peopleListPersons: PeoplelistpersonsInputSchema,
	listRecordAttributeValues: ListrecordattributevaluesInputSchema,
	getRecordEntries: GetrecordentriesInputSchema,
	listRecordEntries: ListrecordentriesInputSchema,
	listRecords: ListrecordsInputSchema,
	postV2ObjectsObjectRecordsQuery: Postv2objectsobjectrecordsqueryInputSchema,
	getV2Tasks: Getv2tasksInputSchema,
	listThreads: ListthreadsInputSchema,
	listUserRecordEntries: ListuserrecordentriesInputSchema,
	listUserRecords: ListuserrecordsInputSchema,
	listWebhooks: ListwebhooksInputSchema,
	listWorkspaceMembers: ListworkspacemembersInputSchema,
	listWorkspaceRecordAttributeValues:
		ListworkspacerecordattributevaluesInputSchema,
	listWorkspaceRecordEntries: ListworkspacerecordentriesInputSchema,
	listWorkspaceRecords: ListworkspacerecordsInputSchema,
	patchRecord: PatchrecordInputSchema,
	putV2ObjectsObjectRecordsRecordId:
		Putv2objectsobjectrecordsrecordidInputSchema,
	queryRecords: QueryrecordsInputSchema,
	searchRecords: SearchrecordsInputSchema,
	postV2ObjectsRecordsSearch: Postv2objectsrecordssearchInputSchema,
	updateAttribute: UpdateattributeInputSchema,
	updateCompany: UpdatecompanyInputSchema,
	updateDealRecord: UpdatedealrecordInputSchema,
	updateEntry: UpdateentryInputSchema,
	updateList: UpdatelistInputSchema,
	patchV2ListsListEntriesEntryId: Patchv2listslistentriesentryidInputSchema,
	putV2ListsListEntriesEntryId: Putv2listslistentriesentryidInputSchema,
	updateObject: UpdateobjectInputSchema,
	updatePerson: UpdatepersonInputSchema,
	updateRecord: UpdaterecordInputSchema,
	updateSelectOption: UpdateselectoptionInputSchema,
	updateStatus: UpdatestatusInputSchema,
	updateTask: UpdatetaskInputSchema,
	updateUserRecord: UpdateuserrecordInputSchema,
	updateWebhook: UpdatewebhookInputSchema,
	updateWorkspaceRecord: UpdateworkspacerecordInputSchema,
} as const;

export const GeneratedEndpointOutputSchemas = {
	putV2ListsListEntries: Putv2listslistentriesResponseSchema,
	assertPerson: AssertpersonResponseSchema,
	putV2ObjectsObjectRecords: Putv2objectsobjectrecordsResponseSchema,
	assertUserRecord: AssertuserrecordResponseSchema,
	assertWorkspace: AssertworkspaceResponseSchema,
	createAttribute: CreateattributeResponseSchema,
	createComment: CreatecommentResponseSchema,
	createCompany: CreatecompanyResponseSchema,
	createDealRecord: CreatedealrecordResponseSchema,
	createEntry: CreateentryResponseSchema,
	createList: CreatelistResponseSchema,
	postV2ListsListEntries: Postv2listslistentriesResponseSchema,
	createNote: CreatenoteResponseSchema,
	createObject: CreateobjectResponseSchema,
	createPerson: CreatepersonResponseSchema,
	createRecord: CreaterecordResponseSchema,
	createSelectOption: CreateselectoptionResponseSchema,
	createStatus: CreatestatusResponseSchema,
	createTask: CreatetaskResponseSchema,
	createUserRecord: CreateuserrecordResponseSchema,
	createWebhook: CreatewebhookResponseSchema,
	createWorkspaceRecord: CreateworkspacerecordResponseSchema,
	postV2ObjectsObjectRecords: Postv2objectsobjectrecordsResponseSchema,
	deleteComment: DeletecommentResponseSchema,
	deleteCompany: DeletecompanyResponseSchema,
	deleteDeal: DeletedealResponseSchema,
	deleteEntry: DeleteentryResponseSchema,
	deleteNote: DeletenoteResponseSchema,
	deletePerson: DeletepersonResponseSchema,
	deleteRecord: DeleterecordResponseSchema,
	deleteRecordById: DeleterecordbyidResponseSchema,
	deleteTask: DeletetaskResponseSchema,
	deleteUser: DeleteuserResponseSchema,
	deleteWebhook: DeletewebhookResponseSchema,
	deleteWorkspaceRecord: DeleteworkspacerecordResponseSchema,
	findRecord: FindrecordResponseSchema,
	getAttribute: GetattributeResponseSchema,
	getComment: GetcommentResponseSchema,
	getCompany: GetcompanyResponseSchema,
	getSelf: GetselfResponseSchema,
	getDealRecord: GetdealrecordResponseSchema,
	getList: GetlistResponseSchema,
	getListEntry: GetlistentryResponseSchema,
	getNote: GetnoteResponseSchema,
	getObject: GetobjectResponseSchema,
	peopleGetPerson: PeoplegetpersonResponseSchema,
	getRecord: GetrecordResponseSchema,
	getRecordAttributeValues: GetrecordattributevaluesResponseSchema,
	getV2ObjectsObjectRecordsRecordId:
		Getv2objectsobjectrecordsrecordidResponseSchema,
	getTask: GettaskResponseSchema,
	getV2WorkspaceMembers: Getv2workspacemembersResponseSchema,
	getWebhook: GetwebhookResponseSchema,
	getWorkspaceMember: GetworkspacememberResponseSchema,
	getWorkspaceRecord: GetworkspacerecordResponseSchema,
	listAttributeOptions: ListattributeoptionsResponseSchema,
	listAttributeStatuses: ListattributestatusesResponseSchema,
	listAttributes: ListattributesResponseSchema,
	listCallRecordings: ListcallrecordingsResponseSchema,
	listCompanies: ListcompaniesResponseSchema,
	listCompanyAttributeValues: ListcompanyattributevaluesResponseSchema,
	listCompanyRecordEntries: ListcompanyrecordentriesResponseSchema,
	listDealEntries: ListdealentriesResponseSchema,
	listDealRecordAttributeValues: ListdealrecordattributevaluesResponseSchema,
	listDealRecords: ListdealrecordsResponseSchema,
	listEntries: ListentriesResponseSchema,
	postV2ListsListEntriesQuery: Postv2listslistentriesqueryResponseSchema,
	listListEntries: ListlistentriesResponseSchema,
	listListEntryAttributeValues: ListlistentryattributevaluesResponseSchema,
	listLists: ListlistsResponseSchema,
	listMeetings: ListmeetingsResponseSchema,
	listNotes: ListnotesResponseSchema,
	listObjects: ListobjectsResponseSchema,
	listPeopleAttributeValues: ListpeopleattributevaluesResponseSchema,
	listPeopleRecordEntries: ListpeoplerecordentriesResponseSchema,
	peopleListPersons: PeoplelistpersonsResponseSchema,
	listRecordAttributeValues: ListrecordattributevaluesResponseSchema,
	getRecordEntries: GetrecordentriesResponseSchema,
	listRecordEntries: ListrecordentriesResponseSchema,
	listRecords: ListrecordsResponseSchema,
	postV2ObjectsObjectRecordsQuery:
		Postv2objectsobjectrecordsqueryResponseSchema,
	getV2Tasks: Getv2tasksResponseSchema,
	listThreads: ListthreadsResponseSchema,
	listUserRecordEntries: ListuserrecordentriesResponseSchema,
	listUserRecords: ListuserrecordsResponseSchema,
	listWebhooks: ListwebhooksResponseSchema,
	listWorkspaceMembers: ListworkspacemembersResponseSchema,
	listWorkspaceRecordAttributeValues:
		ListworkspacerecordattributevaluesResponseSchema,
	listWorkspaceRecordEntries: ListworkspacerecordentriesResponseSchema,
	listWorkspaceRecords: ListworkspacerecordsResponseSchema,
	patchRecord: PatchrecordResponseSchema,
	putV2ObjectsObjectRecordsRecordId:
		Putv2objectsobjectrecordsrecordidResponseSchema,
	queryRecords: QueryrecordsResponseSchema,
	searchRecords: SearchrecordsResponseSchema,
	postV2ObjectsRecordsSearch: Postv2objectsrecordssearchResponseSchema,
	updateAttribute: UpdateattributeResponseSchema,
	updateCompany: UpdatecompanyResponseSchema,
	updateDealRecord: UpdatedealrecordResponseSchema,
	updateEntry: UpdateentryResponseSchema,
	updateList: UpdatelistResponseSchema,
	patchV2ListsListEntriesEntryId: Patchv2listslistentriesentryidResponseSchema,
	putV2ListsListEntriesEntryId: Putv2listslistentriesentryidResponseSchema,
	updateObject: UpdateobjectResponseSchema,
	updatePerson: UpdatepersonResponseSchema,
	updateRecord: UpdaterecordResponseSchema,
	updateSelectOption: UpdateselectoptionResponseSchema,
	updateStatus: UpdatestatusResponseSchema,
	updateTask: UpdatetaskResponseSchema,
	updateUserRecord: UpdateuserrecordResponseSchema,
	updateWebhook: UpdatewebhookResponseSchema,
	updateWorkspaceRecord: UpdateworkspacerecordResponseSchema,
} as const;

export const GeneratedEndpointMeta = {
	putV2ListsListEntries: {
		riskLevel: 'write',
		description:
			'Tool to create or update a list entry for a given parent record in Attio. If an entry with the specified parent record is found, that entry will be updated. If no such entry is found, a new entry will be created instead. For multiselect attributes, all values will be either created or deleted as necessary to match the list of values supplied in the request.',
	},
	assertPerson: {
		riskLevel: 'write',
		description:
			'Tool to create or update person records using a unique attribute to search for existing people. Use when you want to ensure a person exists with specific details without creating duplicates.',
	},
	putV2ObjectsObjectRecords: {
		riskLevel: 'write',
		description:
			'Tool to create or update people, companies and other records in Attio using a matching attribute. Use when you want to avoid duplicate records - if a record with the same value for the matching attribute is found, it will be updated; otherwise a new record is created. If you want to avoid matching and always create new records, use the Create Record endpoint instead.',
	},
	assertUserRecord: {
		riskLevel: 'write',
		description:
			'Creates or updates a user record in Attio using a unique attribute to search for existing users. If a user is found with the same value for the matching attribute, that user will be updated. If no user is found, a new one will be created. Use this to ensure user records exist without duplicates.',
	},
	assertWorkspace: {
		riskLevel: 'write',
		description:
			'Creates or updates a workspace record in Attio using a unique attribute to search for existing workspaces. If a workspace is found with the same value for the matching attribute, that workspace will be updated. If no workspace is found, a new one will be created.',
	},
	createAttribute: {
		riskLevel: 'write',
		description:
			'Tool to create a new attribute on an object or list in Attio. Use when you need to add custom fields to track additional information. For record-reference types, you can establish bidirectional relationships by supplying a relationship object.',
	},
	createComment: {
		riskLevel: 'write',
		description:
			'Tool to create a new comment on a thread, record, or list entry in Attio. Use when you need to add a comment to an existing conversation, a record (like a person, company, or deal), or a list entry.',
	},
	createCompany: {
		riskLevel: 'write',
		description:
			'Creates a new company record in Attio. This endpoint will throw an error on conflicts of unique attributes like domains. If you prefer to update company records on conflicts, use the Assert company record endpoint instead. Note: The logo_url attribute cannot currently be set via the API.',
	},
	createDealRecord: {
		riskLevel: 'write',
		description:
			'Tool to create a new deal record in Attio. Use when you need to track a new sales opportunity or deal. This endpoint will throw an error on conflicts of unique attributes. Minimal requirement is providing at least one attribute value.',
	},
	createEntry: {
		riskLevel: 'write',
		description:
			'DEPRECATED: Use ATTIO_ATTIO_POST_V2_LISTS_LIST_ENTRIES instead. Tool to add a record to a list as a new list entry in Attio. Use when you need to organize records into specific lists. Throws errors on unique attribute conflicts. Multiple list entries are allowed for the same parent record.',
	},
	createList: {
		riskLevel: 'write',
		description:
			"Tool to create a new list in Attio. Use when you need to organize records into custom lists. Once created, add attributes using the Create Attribute API and add records using the Create Entry API. New lists must have either workspace_access set to 'full-access' or one or more workspace_member_access with 'full-access' level.",
	},
	postV2ListsListEntries: {
		riskLevel: 'write',
		description:
			'Tool to add a record to a list as a new list entry in Attio. Use when you need to organize records into specific lists. This endpoint will throw on conflicts of unique attributes. Multiple list entries are allowed for the same parent record.',
	},
	createNote: {
		riskLevel: 'write',
		description:
			'This tool creates a new note on a given record in Attio. The note can be attached to any record type (like person, company, or deal) and includes a title and content. It requires parameters such as parent_object, parent_record_id, title, and content, with an optional created_at timestamp.',
	},
	createObject: {
		riskLevel: 'write',
		description:
			'Tool to create a new custom object in your Attio workspace. Use when you need to add a new object type beyond the standard objects (people, companies, deals, users, workspaces). Requires api_slug (snake_case identifier), singular_noun, and plural_noun.',
	},
	createPerson: {
		riskLevel: 'write',
		description:
			'Creates a new person record in Attio. This endpoint will throw an error on conflicts of unique attributes like email_addresses. If you prefer to update person records on conflicts instead, use the Assert person record endpoint. Note: The avatar_url attribute cannot currently be set via the API.',
	},
	createRecord: {
		riskLevel: 'write',
		description:
			"This tool creates a new record in Attio for a specified object type (people, companies, deals, users, workspaces, etc.). It requires the object type and a values dictionary containing the attributes for the new record. IMPORTANT: Different object types have different attributes. For example: - 'people' object uses: name, email_addresses, phone_numbers, primary_location, job_title, etc. - 'users' object uses: primary_email_address, user_id, person, workspace - 'companies' object uses: name, domains, description, etc. Always verify the correct attribute names for your target object type before creating records. Use the List Attributes API or check your workspace to see available attributes for each object type.",
	},
	createSelectOption: {
		riskLevel: 'write',
		description:
			'Tool to add a new select option to a select or multiselect attribute in Attio. Use when you need to add a new choice to an existing select field.',
	},
	createStatus: {
		riskLevel: 'write',
		description:
			'Tool to add a new status to a status attribute on either an object or a list. Use when you need to create a new status option for status attributes. Company and person objects do not support status attributes at this time.',
	},
	createTask: {
		riskLevel: 'write',
		description:
			'Tool to create a new task in Attio. Use when you need to add a task with content and optional deadline, assignees, or linked records. Note: Tasks can only be created from plaintext without record reference formatting.',
	},
	createUserRecord: {
		riskLevel: 'write',
		description:
			'Creates a new user record in Attio. User records represent workspace members or users in the system. Requires primary_email_address, user_id, and workspace_id. Optionally link to an existing person record. Note: Required attributes may vary based on workspace configuration - check the List Attributes action if you encounter missing_value errors.',
	},
	createWebhook: {
		riskLevel: 'write',
		description:
			'Tool to create a webhook and subscribe to events in Attio. Use when you need to set up a new webhook endpoint to receive real-time event notifications. Returns the webhook configuration including a one-time signing secret for verifying event authenticity.',
	},
	createWorkspaceRecord: {
		riskLevel: 'write',
		description:
			'Creates a new workspace record in Attio. The workspace_id field is required and must be unique. This endpoint will throw an error on conflicts of unique attributes. Use when you need to create a new workspace entry in your Attio workspace.',
	},
	postV2ObjectsObjectRecords: {
		riskLevel: 'write',
		description:
			'Creates a new person, company or other record. This endpoint will throw on conflicts of unique attributes. If you would prefer to update records on conflicts, please use the Assert record endpoint instead.',
	},
	deleteComment: {
		riskLevel: 'write',
		description:
			'Tool to delete a comment by its comment_id. Use when you need to remove a comment from Attio. If the comment is at the head of a thread, all messages in the thread are also deleted. The operation is permanent and cannot be undone.',
	},
	deleteCompany: {
		riskLevel: 'write',
		description:
			'Tool to delete a company record from Attio by its record_id. Use when you need to permanently remove a company record. The deletion is irreversible and cannot be recovered.',
	},
	deleteDeal: {
		riskLevel: 'write',
		description:
			'Tool to delete a deal record from Attio by its record_id. Use when you need to permanently remove a deal record. The deletion is irreversible and cannot be recovered.',
	},
	deleteEntry: {
		riskLevel: 'write',
		description:
			'Tool to delete a single list entry by its entry_id in Attio. Use when you need to remove an entry from a specific list. The operation is permanent and cannot be undone.',
	},
	deleteNote: {
		riskLevel: 'write',
		description:
			'This tool allows users to delete a specific note in Attio by its ID. It is implemented via DELETE https://api.attio.com/v2/notes/{note_id} and handles note deletion by validating the provided note_id. It complements ATTIO_CREATE_NOTE functionality, providing complete note management capabilities within the Attio platform.',
	},
	deletePerson: {
		riskLevel: 'write',
		description:
			'Tool to delete a person record from Attio by its record_id. Use when you need to permanently remove a person record. The deletion is irreversible and cannot be recovered.',
	},
	deleteRecord: {
		riskLevel: 'write',
		description:
			'This tool allows you to delete a record from Attio permanently. The deletion is irreversible, and the data will eventually be removed from the system.',
	},
	deleteRecordById: {
		riskLevel: 'write',
		description:
			'Tool to delete a single record (e.g. a company or person) by ID. Use when you need to permanently remove a record from Attio.',
	},
	deleteTask: {
		riskLevel: 'write',
		description:
			'Tool to delete a task by its task_id. Use when you need to remove a task from Attio. The operation is permanent and cannot be undone.',
	},
	deleteUser: {
		riskLevel: 'write',
		description:
			'Tool to delete a user record from Attio by its record_id. Use when you need to permanently remove a user record. The deletion is irreversible and cannot be recovered.',
	},
	deleteWebhook: {
		riskLevel: 'write',
		description:
			'Tool to delete a webhook by its webhook_id. Use when you need to remove a webhook subscription from Attio. The operation is permanent and cannot be undone.',
	},
	deleteWorkspaceRecord: {
		riskLevel: 'write',
		description:
			'Tool to delete a workspace record from Attio by its record_id. Use when you need to permanently remove a workspace record. The deletion is irreversible and cannot be recovered.',
	},
	findRecord: {
		riskLevel: 'read',
		description:
			'This tool allows users to find a record in Attio by either its unique ID or by searching using unique attributes. It provides two methods: one for directly retrieving a record by its ID with the GET /v2/objects/{object}/records/{record_id} endpoint, and another for searching by attributes using the POST /v2/objects/{object}/records/query endpoint.',
	},
	getAttribute: {
		riskLevel: 'read',
		description:
			"Tool to get information about a single attribute on either an object or a list. Use when you need detailed information about a specific attribute's configuration, type, or metadata.",
	},
	getComment: {
		riskLevel: 'read',
		description:
			'Tool to get a single comment by its comment_id in Attio. Use when you need to retrieve detailed information about a specific comment, including its content, author, thread, and resolution status.',
	},
	getCompany: {
		riskLevel: 'read',
		description:
			'Tool to get a single company record by its record_id in Attio. Use when you need to retrieve detailed information about a specific company. Returns all attribute values for the company with temporal and audit metadata.',
	},
	getSelf: {
		riskLevel: 'read',
		description:
			'Tool to identify the current access token, the workspace it is linked to, and any permissions it has. Use when you need to verify token validity or retrieve workspace information associated with the current authentication.',
	},
	getDealRecord: {
		riskLevel: 'read',
		description:
			'Tool to get a single deal record by its record_id in Attio. Use when you need to retrieve detailed information about a specific deal. Returns all attribute values for the deal with temporal and audit metadata.',
	},
	getList: {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a single list in your Attio workspace. Use when you need to get information about a specific list by its UUID or slug.',
	},
	getListEntry: {
		riskLevel: 'read',
		description:
			'Tool to get a single list entry by its entry_id. Use when you need to retrieve detailed information about a specific entry in an Attio list.',
	},
	getNote: {
		riskLevel: 'read',
		description:
			'Tool to get a single note by its note_id in Attio. Use when you need to retrieve detailed information about a specific note, including its title, content (plaintext and markdown), tags, and creator information.',
	},
	getObject: {
		riskLevel: 'read',
		description:
			'Tool to get a single object by its object_id or slug. Use to retrieve detailed schema information about a specific object type in the Attio workspace. Also use as a prerequisite validation step before calling ATTIO_FIND_RECORD, ATTIO_LIST_RECORDS, or ATTIO_CREATE_RECORD — attribute slugs must exactly match what this tool returns. The returned schema defines required attributes for record creation; omitting them causes invalid_request_error with code missing_value (HTTP 400). Custom attributes (e.g., industry, category) vary by object type — verify their presence and data type here before building filters or record values.',
	},
	peopleGetPerson: {
		riskLevel: 'read',
		description:
			'Tool to get a single person record by its record_id in Attio. Use when you need to retrieve detailed information about a specific person. Returns all attribute values for the person with temporal and audit metadata.',
	},
	getRecord: {
		riskLevel: 'read',
		description:
			'Tool to get a single person, company, or other record by its record_id in Attio. Use when you need to retrieve detailed information about a specific record. Returns all attribute values for the record with temporal and audit metadata.',
	},
	getRecordAttributeValues: {
		riskLevel: 'read',
		description:
			'Tool to get all values for a given attribute on a record in Attio. Use when you need to retrieve current or historic values for a specific attribute. Historic values can be queried using the show_historic param but cannot be queried on COMINT or enriched attributes (returns 400 error).',
	},
	getV2ObjectsObjectRecordsRecordId: {
		riskLevel: 'read',
		description:
			'Tool to get a single person, company or other record by its record_id. Use when you need to retrieve detailed information about a specific record.',
	},
	getTask: {
		riskLevel: 'read',
		description:
			'Tool to get a single task by its task_id in Attio. Use when you need to retrieve detailed information about a specific task, including its content, deadline, assignees, and linked records.',
	},
	getV2WorkspaceMembers: {
		riskLevel: 'read',
		description:
			'DEPRECATED: Use ATTIO_LIST_WORKSPACE_MEMBERS instead. Tool to list all workspace members in the workspace. Use when you need to retrieve information about workspace members, their access levels, or their identities.',
	},
	getWebhook: {
		riskLevel: 'read',
		description:
			"Tool to get a single webhook by its webhook_id in Attio. Use when you need to retrieve detailed information about a specific webhook configuration. Returns the webhook's target URL, event subscriptions, status, and metadata.",
	},
	getWorkspaceMember: {
		riskLevel: 'read',
		description:
			'Tool to get a single workspace member by their workspace_member_id. Use when you need details about a specific workspace member, including their name, email, access level, and avatar.',
	},
	getWorkspaceRecord: {
		riskLevel: 'read',
		description:
			'Tool to get a single workspace record by its record_id. Use when you need to retrieve detailed information about a specific workspace. Returns all attribute values for the workspace record with temporal and audit metadata.',
	},
	listAttributeOptions: {
		riskLevel: 'read',
		description:
			'Tool to list all select options for a particular attribute on either an object or a list. Use when you need to discover available options for select or status type attributes.',
	},
	listAttributeStatuses: {
		riskLevel: 'read',
		description:
			'Tool to list all statuses for a particular status attribute on either an object or a list. Use when you need to discover available statuses for a status attribute, including their IDs, titles, and configuration.',
	},
	listAttributes: {
		riskLevel: 'read',
		description:
			'Tool to list the attribute schema for an Attio object or list (including slugs, types, select/status config) to enable correct filtering and writes. Use when you need to discover what attributes exist on an object or list, their types, and their configuration (e.g., available options for select/status attributes). Returns attributes in UI sort order.',
	},
	listCallRecordings: {
		riskLevel: 'read',
		description:
			'Tool to list all call recordings for a meeting in Attio. Use when you need to retrieve call recordings associated with a specific meeting. This endpoint is in beta.',
	},
	listCompanies: {
		riskLevel: 'read',
		description:
			'Tool to list company records in Attio with optional filtering and sorting. Use when you need to retrieve company records based on criteria like domain, name, or description.',
	},
	listCompanyAttributeValues: {
		riskLevel: 'read',
		description:
			'Tool to get all values for a given attribute on a company record. Historic values can be queried using the show_historic query param. Historic values cannot be queried on COMINT or enriched attributes. Some attributes are subject to billing status and may return an empty array.',
	},
	listCompanyRecordEntries: {
		riskLevel: 'read',
		description:
			'Tool to list all entries across all lists for which a company record is the parent in Attio. Use when you need to see which lists a particular company record belongs to. Returns list information and entry IDs for each list the company appears in.',
	},
	listDealEntries: {
		riskLevel: 'read',
		description:
			'Tool to list all entries across all lists for which a deal record is the parent in Attio. Use when you need to see which lists a particular deal record belongs to. Returns list information and entry IDs for each list the deal appears in.',
	},
	listDealRecordAttributeValues: {
		riskLevel: 'read',
		description:
			'Tool to retrieve all values for a specified attribute on a deal record in Attio. Use when you need to see current or historic values for a specific deal attribute. Historic values can be queried using show_historic param but cannot be queried on COMINT or enriched attributes.',
	},
	listDealRecords: {
		riskLevel: 'read',
		description:
			'Tool to list deal records in Attio with the option to filter and sort results. Use when you need to retrieve deal records based on filter criteria or sorting requirements.',
	},
	listEntries: {
		riskLevel: 'read',
		description:
			'DEPRECATED: Use ATTIO_ATTIO_POST_V2_LISTS_LIST_ENTRIES_QUERY instead. Tool to list entries in a given list with filtering and sorting options. Use when you need to retrieve records added to a specific list in Attio. Entries are returned based on the filters and sorts provided.',
	},
	postV2ListsListEntriesQuery: {
		riskLevel: 'read',
		description:
			'Tool to list entries in a given list, with the option to filter and sort results. Use when you need to retrieve records that belong to a specific list with optional filtering and sorting.',
	},
	listListEntries: {
		riskLevel: 'read',
		description:
			'DEPRECATED: Use ATTIO_ATTIO_POST_V2_LISTS_LIST_ENTRIES_QUERY instead. Tool to retrieve entries (records) that belong to a specific Attio list. Use when you need to enumerate list membership or access list-specific attribute values. This is distinct from listing all records of an object type - it specifically returns records that are members of a particular list.',
	},
	listListEntryAttributeValues: {
		riskLevel: 'read',
		description:
			'Tool to retrieve all values for a specified attribute on a list entry in Attio. Use when you need to see the history of values for a specific attribute on a list entry. Can return only active values or include all historical values sorted chronologically.',
	},
	listLists: {
		riskLevel: 'read',
		description:
			'This tool retrieves all lists available in the Attio workspace, sorted as they appear in the sidebar. Returns list metadata only (names, IDs, configuration) — not the records/entries within those lists. To fetch actual list entries, use ATTIO_FIND_RECORD with appropriate filters. This tool is a prerequisite for many list-related operations. Requires the list_configuration:read permission scope.',
	},
	listMeetings: {
		riskLevel: 'read',
		description:
			'Tool to list all meetings in the workspace using a deterministic sort order. Use when you need to retrieve meetings, optionally filtering by participants, linked records, or time ranges. This endpoint is in beta.',
	},
	listNotes: {
		riskLevel: 'read',
		description:
			'Lists notes in Attio. Can list all notes in the workspace, or filter by parent object type and/or specific record. Notes are returned in reverse chronological order (newest first).',
	},
	listObjects: {
		riskLevel: 'read',
		description:
			'This tool retrieves a list of all available objects (both system-defined and user-defined) in the Attio workspace via GET /v2/objects, returning key metadata including slugs and IDs for each object. Call this tool first before ATTIO_LIST_RECORDS, ATTIO_FIND_RECORD, or ATTIO_CREATE_RECORD to discover valid object slugs — hardcoded slugs may not exist across workspaces. Concepts like tasks may be modeled as deals or custom objects rather than dedicated types, so confirm the correct object type before proceeding. Attribute values in responses can be arrays of time-bounded entries rather than simple scalars; downstream code must handle nested structures.',
	},
	listPeopleAttributeValues: {
		riskLevel: 'read',
		description:
			'Tool to get all values for a given attribute on a person record. Use when you need to retrieve current or historic values for a specific person attribute. Historic values can be queried using the show_historic param but cannot be queried on COMINT or enriched attributes (returns 400 error).',
	},
	listPeopleRecordEntries: {
		riskLevel: 'read',
		description:
			'Tool to list all entries across all lists for which a person record is the parent in Attio. Use when you need to see which lists a particular person record belongs to. Returns list information and entry IDs for each list the person appears in.',
	},
	peopleListPersons: {
		riskLevel: 'read',
		description:
			'Tool to list person records from Attio with optional filtering and sorting. Use when you need to retrieve people based on specific criteria or get a paginated list of all people.',
	},
	listRecordAttributeValues: {
		riskLevel: 'read',
		description:
			'Tool to retrieve all values for a specified attribute on a record in Attio. Use when you need to see the history of values for a specific attribute. Can return only active values or include historical values. Historic values cannot be queried on COMINT or enriched attributes.',
	},
	getRecordEntries: {
		riskLevel: 'read',
		description:
			'Tool to list all entries, across all lists, for which a record is the parent. Use when you need to find which lists a specific record belongs to. Returns list IDs, slugs, entry IDs, and creation timestamps.',
	},
	listRecordEntries: {
		riskLevel: 'read',
		description:
			'Tool to list all entries across all lists for which a record is the parent in Attio. Use when you need to see which lists a particular record belongs to. Returns list information and entry IDs for each list the record appears in.',
	},
	listRecords: {
		riskLevel: 'read',
		description:
			"This tool lists records from a specific object type in Attio. It provides simple pagination support and returns records in creation order (oldest first). For complex filtering, use the FindRecord action instead. Standard object types include: people, companies, deals, users, workspaces. If you get a 404 error, verify the object type exists using the List Objects action first. Response attribute values are returned as arrays of time-bounded objects under a `values` map (e.g., `values['name']`), not simple scalars — handle arrays, nested objects, and empty arrays accordingly. Select attributes are accessed via `option.title`; currency, stage, and select fields may be null or empty arrays. Access records via `data.data` in the response.",
	},
	postV2ObjectsObjectRecordsQuery: {
		riskLevel: 'read',
		description:
			'Tool to list people, company or other records in Attio with the option to filter and sort results. Use when you need to retrieve records based on complex filter criteria or sorting requirements.',
	},
	getV2Tasks: {
		riskLevel: 'read',
		description:
			'Tool to list all tasks in the workspace. Use when you need to retrieve tasks, optionally filtering by assignee, completion status, or linked records. Results are sorted by creation date from oldest to newest by default.',
	},
	listThreads: {
		riskLevel: 'read',
		description:
			'Tool to list threads of comments on a record or list entry in Attio. Use when you need to view all comment threads associated with a specific record or list entry. Threads contain one or more comments sorted chronologically.',
	},
	listUserRecordEntries: {
		riskLevel: 'read',
		description:
			'Tool to list all entries across all lists for which a user record is the parent in Attio. Use when you need to see which lists a particular user record belongs to. Returns list information and entry IDs for each list the user appears in.',
	},
	listUserRecords: {
		riskLevel: 'read',
		description:
			'Tool to list user records in Attio with optional filtering and sorting. Use when you need to retrieve workspace members or user records based on specific criteria.',
	},
	listWebhooks: {
		riskLevel: 'read',
		description:
			'Tool to get all webhooks in your Attio workspace. Use when you need to retrieve a list of configured webhooks, their subscriptions, and statuses. Supports pagination via limit and offset parameters.',
	},
	listWorkspaceMembers: {
		riskLevel: 'read',
		description:
			'Tool to list workspace members (actors) so agents can reliably assign owners and resolve workspace-member IDs even when the optional Users standard object is disabled. Use when writing or assigning actor-reference attributes (e.g., record/list entry owners) that require referenced_actor_type=workspace-member and an actor id.',
	},
	listWorkspaceRecordAttributeValues: {
		riskLevel: 'read',
		description:
			'Tool to retrieve all values for a specified attribute on a workspace record in Attio. Use when you need to see the history of values for a specific attribute on a workspace record. Can return only active values or include all historical values sorted chronologically.',
	},
	listWorkspaceRecordEntries: {
		riskLevel: 'read',
		description:
			'Tool to list all entries across all lists for which a workspace record is the parent in Attio. Use when you need to see which lists a particular workspace record belongs to. Returns list information and entry IDs for each list the workspace appears in.',
	},
	listWorkspaceRecords: {
		riskLevel: 'read',
		description:
			'Tool to list workspace records with filtering and sorting options. Use when you need to retrieve workspace-level records from Attio. Records are returned based on the filters and sorts provided. Requires record_permission:read and object_configuration:read scopes.',
	},
	patchRecord: {
		riskLevel: 'write',
		description:
			'Tool to update people, companies, and other records by record_id using PATCH method. For multiselect attributes, values supplied will be prepended to existing values. Use PUT endpoint to overwrite or remove multiselect values.',
	},
	putV2ObjectsObjectRecordsRecordId: {
		riskLevel: 'write',
		description:
			'Tool to update people, companies, and other records by record_id using PUT method. For multiselect attributes, values supplied will overwrite/remove existing values. Use PATCH endpoint to append without removing.',
	},
	queryRecords: {
		riskLevel: 'read',
		description:
			"Tool to query records for a specific Attio object using server-side filtering operators and sorting. Use when you need to retrieve records based on complex filter criteria (e.g., 'get all agreements where product=X and status in Y') rather than simple listing or ID-based lookup. This avoids downloading large pages and filtering locally, which is slow and costly.",
	},
	searchRecords: {
		riskLevel: 'read',
		description:
			'Tool to fuzzy search for records across multiple objects in Attio. Use when you need to find records by name, domain, email, phone number, or social handle. This endpoint is in beta and returns eventually consistent results. Matching strategy follows the in-product search approach.',
	},
	postV2ObjectsRecordsSearch: {
		riskLevel: 'read',
		description:
			'Tool to fuzzy search for records across one or more objects in Attio. Use when you need to find records by name, domain, email, phone number, or social handle. This endpoint is in beta and returns eventually consistent results. For results guaranteed to be up to date, use the record query endpoint instead.',
	},
	updateAttribute: {
		riskLevel: 'write',
		description:
			'Tool to update an existing attribute by its attribute_id or slug. Use when you need to modify attribute properties such as title, description, validation rules, or configuration settings.',
	},
	updateCompany: {
		riskLevel: 'write',
		description:
			'Tool to update a company record in Attio by its record_id. Use when you need to modify company attributes like name, description, domains, or team. For multiselect attributes, values are prepended to existing values. Note: logo_url cannot be updated via API.',
	},
	updateDealRecord: {
		riskLevel: 'write',
		description:
			'Tool to update an existing deal record in Attio by record ID. Uses PATCH to partially update only the provided fields, leaving other fields unchanged.',
	},
	updateEntry: {
		riskLevel: 'write',
		description:
			'DEPRECATED: Use ATTIO_ATTIO_PATCH_V2_LISTS_LIST_ENTRIES_ENTRY_ID instead. Tool to update list entries by their ID in Attio. Use when you need to modify attribute values on existing list entries. When multiselect attributes are included, the values supplied will be prepended to existing values.',
	},
	updateList: {
		riskLevel: 'write',
		description:
			"Tool to update an existing list in Attio. Use when you need to modify list properties like name, api_slug, or permissions. Lists must have either workspace_access set to 'full-access' or one or more workspace_member_access with 'full-access' level. Changing the parent object of a list is not possible through the API.",
	},
	patchV2ListsListEntriesEntryId: {
		riskLevel: 'write',
		description:
			'Tool to update list entries by entry_id in Attio. Use when you need to modify attribute values on existing list entries. For multiselect attributes, the values supplied will be created and prepended to existing values. Use the PUT endpoint to overwrite or remove multiselect attribute values.',
	},
	putV2ListsListEntriesEntryId: {
		riskLevel: 'write',
		description:
			'Tool to update list entries by entry_id in Attio using PUT method. Use when you need to completely replace attribute values on existing list entries. For multiselect attributes, the values supplied will overwrite/remove the list of values that already exist (if any). Use the PATCH endpoint to add multiselect attribute values without removing those that already exist.',
	},
	updateObject: {
		riskLevel: 'write',
		description:
			"Tool to update a single object's configuration in Attio. Use when you need to modify an object's API slug, singular noun, or plural noun. Standard objects (people, companies, deals, users, workspaces) and custom objects can be updated.",
	},
	updatePerson: {
		riskLevel: 'write',
		description:
			'Tool to update a person record in Attio by its record_id. Use when you need to modify person attributes like name, email, job title, or phone numbers. For multiselect attributes, values are prepended to existing values. Note: avatar_url cannot be updated via API.',
	},
	updateRecord: {
		riskLevel: 'write',
		description:
			'This tool updates an existing record in Attio for a specified object type (people, companies, deals, users, workspaces, etc.). It uses PATCH to partially update only the provided fields, leaving other fields unchanged.',
	},
	updateSelectOption: {
		riskLevel: 'write',
		description:
			'Tool to update an existing select option for a select or multiselect attribute in Attio. Use when you need to rename an option or archive it. Archived options are hidden from selection but preserve historical data for records that used them.',
	},
	updateStatus: {
		riskLevel: 'write',
		description:
			'Tool to update a status on a status attribute on either an object or a list in Attio. Use when you need to modify status properties like title, celebration settings, target time, or archive status. Company and person objects do not support status attributes at this time.',
	},
	updateTask: {
		riskLevel: 'write',
		description:
			"Tool to update an existing task in Attio by its task_id. Use when you need to modify a task's deadline, completion status, linked records, or assignees. Only these four fields can be updated via this endpoint.",
	},
	updateUserRecord: {
		riskLevel: 'write',
		description:
			'Tool to update a user record in Attio by its record_id. Use when you need to modify user attributes like user_id, primary_email_address, person, or workspace references. Attributes not included in the request will remain unchanged.',
	},
	updateWebhook: {
		riskLevel: 'write',
		description:
			"Tool to update a webhook's target URL and/or event subscriptions. Use when you need to modify an existing webhook configuration in Attio.",
	},
	updateWorkspaceRecord: {
		riskLevel: 'write',
		description:
			'Tool to update a workspace record by ID using PATCH method. Only the attributes provided in the request will be updated; other attributes remain unchanged.',
	},
} as const;

// --- HANDLERS ---

function pathValue(input: Record<string, unknown>, ...keys: string[]): string {
	for (const key of keys) {
		const value = input[key];
		if (value !== undefined && value !== null && String(value).length > 0) {
			return String(value);
		}
	}
	return '';
}

function withoutKeys(
	input: Record<string, unknown>,
	keys: string[],
): Record<string, unknown> {
	const body = { ...input };
	for (const key of keys) {
		delete body[key];
	}
	return body;
}

function attributeBasePath(input: Record<string, unknown>): string {
	const list = pathValue(input, 'list', 'list_id');
	if (list) return `/v2/lists/${list}/attributes`;
	return `/v2/objects/${pathValue(input, 'object')}/attributes`;
}

function asInput(input: unknown): Record<string, unknown> {
	return (input ?? {}) as Record<string, unknown>;
}

function asQuery(
	input: unknown,
): Record<string, string | number | boolean | undefined> | undefined {
	if (input === undefined) return undefined;
	return input as unknown as Record<
		string,
		string | number | boolean | undefined
	>;
}

export const putV2ListsListEntries: AttioEndpoint<
	'putV2ListsListEntries'
> = async (ctx, input) => {
	const data = asInput(input);
	const list = pathValue(data, 'list', 'list_id');
	return await makeAuthenticatedAttioRequest(`/v2/lists/${list}/entries`, ctx, {
		method: 'PUT',
		body: withoutKeys(data, ['list', 'list_id']),
	});
};

export const assertPerson: AttioEndpoint<'assertPerson'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/people/records';
	if (input.matching_attribute) {
		resolvedPath +=
			'?matching_attribute=' +
			encodeURIComponent(String(input.matching_attribute));
	}
	const bodyPayload = { ...input };
	bodyPayload.matching_attribute = undefined;
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PUT',
		body: bodyPayload,
	});
};

export const putV2ObjectsObjectRecords: AttioEndpoint<
	'putV2ObjectsObjectRecords'
> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/{object}/records';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	if (input.matching_attribute) {
		resolvedPath +=
			'?matching_attribute=' +
			encodeURIComponent(String(input.matching_attribute));
	}
	const bodyPayload = { ...input };
	bodyPayload.object = undefined;
	bodyPayload.matching_attribute = undefined;
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PUT',
		body: bodyPayload,
	});
};

export const assertUserRecord: AttioEndpoint<'assertUserRecord'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest('/v2/objects/users/records', ctx, {
		method: 'PUT',
		body: input,
	});
};

export const assertWorkspace: AttioEndpoint<'assertWorkspace'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest(
		'/v2/objects/workspaces/records',
		ctx,
		{
			method: 'PUT',
			body: input,
		},
	);
};

export const createAttribute: AttioEndpoint<'createAttribute'> = async (
	ctx,
	input,
) => {
	const data = asInput(input);
	return await makeAuthenticatedAttioRequest(attributeBasePath(data), ctx, {
		method: 'POST',
		body: withoutKeys(data, ['object', 'list', 'list_id']),
	});
};

export const createComment: AttioEndpoint<'createComment'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest('/v2/comments', ctx, {
		method: 'POST',
		body: input,
	});
};

export const createCompany: AttioEndpoint<'createCompany'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest(
		'/v2/objects/companies/records',
		ctx,
		{
			method: 'POST',
			body: input,
		},
	);
};

export const createDealRecord: AttioEndpoint<'createDealRecord'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest('/v2/objects/deals/records', ctx, {
		method: 'POST',
		body: input,
	});
};

export const createEntry: AttioEndpoint<'createEntry'> = async (ctx, input) => {
	const data = asInput(input);
	const list = pathValue(data, 'list', 'list_id');
	return await makeAuthenticatedAttioRequest(`/v2/lists/${list}/entries`, ctx, {
		method: 'POST',
		body: withoutKeys(data, ['list', 'list_id']),
	});
};

export const createList: AttioEndpoint<'createList'> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest('/v2/lists', ctx, {
		method: 'POST',
		body: input,
	});
};

export const postV2ListsListEntries: AttioEndpoint<
	'postV2ListsListEntries'
> = async (ctx, input) => {
	const data = asInput(input);
	const list = pathValue(data, 'list', 'list_id');
	return await makeAuthenticatedAttioRequest(`/v2/lists/${list}/entries`, ctx, {
		method: 'POST',
		body: withoutKeys(data, ['list', 'list_id']),
	});
};

export const createNote: AttioEndpoint<'createNote'> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest('/v2/notes', ctx, {
		method: 'POST',
		body: input,
	});
};

export const createObject: AttioEndpoint<'createObject'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest('/v2/objects', ctx, {
		method: 'POST',
		body: input,
	});
};

export const createPerson: AttioEndpoint<'createPerson'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest(
		'/v2/objects/people/records',
		ctx,
		{
			method: 'POST',
			body: input,
		},
	);
};

export const createRecord: AttioEndpoint<'createRecord'> = async (
	ctx,
	input,
) => {
	const data = asInput(input);
	const object = pathValue(data, 'object');
	return await makeAuthenticatedAttioRequest(
		`/v2/objects/${object}/records`,
		ctx,
		{
			method: 'POST',
			body: withoutKeys(data, ['object']),
		},
	);
};

export const createSelectOption: AttioEndpoint<'createSelectOption'> = async (
	ctx,
	input,
) => {
	const data = asInput(input);
	const attribute = pathValue(data, 'attribute', 'attribute_id');
	return await makeAuthenticatedAttioRequest(
		`${attributeBasePath(data)}/${attribute}/options`,
		ctx,
		{
			method: 'POST',
			body: withoutKeys(data, [
				'object',
				'list',
				'list_id',
				'attribute',
				'attribute_id',
			]),
		},
	);
};

export const createStatus: AttioEndpoint<'createStatus'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/{object}/attributes/{attribute}/statuses';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	resolvedPath = resolvedPath.replace(
		'{attribute}',
		String(input.attribute || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'POST',
		body: input,
	});
};

export const createTask: AttioEndpoint<'createTask'> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest('/v2/tasks', ctx, {
		method: 'POST',
		body: input,
	});
};

export const createUserRecord: AttioEndpoint<'createUserRecord'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest('/v2/objects/users/records', ctx, {
		method: 'POST',
		body: input,
	});
};

export const createWebhook: AttioEndpoint<'createWebhook'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest('/v2/webhooks', ctx, {
		method: 'POST',
		body: input,
	});
};

export const createWorkspaceRecord: AttioEndpoint<
	'createWorkspaceRecord'
> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest(
		'/v2/objects/workspaces/records',
		ctx,
		{
			method: 'POST',
			body: input,
		},
	);
};

export const postV2ObjectsObjectRecords: AttioEndpoint<
	'postV2ObjectsObjectRecords'
> = async (ctx, input) => createRecord(ctx, input);

export const deleteComment: AttioEndpoint<'deleteComment'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/comments/{comment_id}';
	resolvedPath = resolvedPath.replace(
		'{comment_id}',
		String(input.comment_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deleteCompany: AttioEndpoint<'deleteCompany'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/companies/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deleteDeal: AttioEndpoint<'deleteDeal'> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/deals/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deleteEntry: AttioEndpoint<'deleteEntry'> = async (ctx, input) => {
	let resolvedPath = '/v2/lists/{list}/entries/{entry_id}';
	resolvedPath = resolvedPath.replace(
		'{list}',
		String(input.list || input.list_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{entry_id}',
		String(input.entry_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deleteNote: AttioEndpoint<'deleteNote'> = async (ctx, input) => {
	let resolvedPath = '/v2/notes/{note_id}';
	resolvedPath = resolvedPath.replace('{note_id}', String(input.note_id || ''));
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deletePerson: AttioEndpoint<'deletePerson'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/people/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deleteRecord: AttioEndpoint<'deleteRecord'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/{object}/records/{record_id}';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deleteRecordById: AttioEndpoint<'deleteRecordById'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/{object}/records/{record_id}';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deleteTask: AttioEndpoint<'deleteTask'> = async (ctx, input) => {
	let resolvedPath = '/v2/tasks/{task_id}';
	resolvedPath = resolvedPath.replace('{task_id}', String(input.task_id || ''));
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deleteUser: AttioEndpoint<'deleteUser'> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/users/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deleteWebhook: AttioEndpoint<'deleteWebhook'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/webhooks/{webhook_id}';
	resolvedPath = resolvedPath.replace(
		'{webhook_id}',
		String(input.webhook_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const deleteWorkspaceRecord: AttioEndpoint<
	'deleteWorkspaceRecord'
> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/workspaces/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'DELETE',
	});
};

export const findRecord: AttioEndpoint<'findRecord'> = async (ctx, input) => {
	const object = input.object || '';
	const recordId = input.record_id || input.recordId;
	if (recordId) {
		let resolvedPath = '/v2/objects/{object}/records/{record_id}';
		resolvedPath = resolvedPath.replace('{object}', String(object));
		resolvedPath = resolvedPath.replace('{record_id}', String(recordId));
		return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
			method: 'GET',
		});
	} else {
		let resolvedPath = '/v2/objects/{object}/records/query';
		resolvedPath = resolvedPath.replace('{object}', String(object));
		return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
			method: 'POST',
			body: input,
		});
	}
};

export const getAttribute: AttioEndpoint<'getAttribute'> = async (
	ctx,
	input,
) => {
	const data = asInput(input);
	const attribute = pathValue(data, 'attribute', 'attribute_id');
	return await makeAuthenticatedAttioRequest(
		`${attributeBasePath(data)}/${attribute}`,
		ctx,
		{ method: 'GET' },
	);
};

export const getComment: AttioEndpoint<'getComment'> = async (ctx, input) => {
	let resolvedPath = '/v2/comments/{comment_id}';
	resolvedPath = resolvedPath.replace(
		'{comment_id}',
		String(input.comment_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getCompany: AttioEndpoint<'getCompany'> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/companies/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getSelf: AttioEndpoint<'getSelf'> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest('/v2/self', ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getDealRecord: AttioEndpoint<'getDealRecord'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/deals/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	const queryPayload = { ...input };
	queryPayload.record_id = undefined;
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: Object.keys(queryPayload).length ? asQuery(queryPayload) : undefined,
	});
};

export const getList: AttioEndpoint<'getList'> = async (ctx, input) => {
	let resolvedPath = '/v2/lists/{list_id}';
	resolvedPath = resolvedPath.replace('{list_id}', String(input.list_id || ''));
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getListEntry: AttioEndpoint<'getListEntry'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/lists/{list}/entries/{entry_id}';
	resolvedPath = resolvedPath.replace(
		'{list}',
		String(input.list || input.list_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{entry_id}',
		String(input.entry_id || input.list_entry_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getNote: AttioEndpoint<'getNote'> = async (ctx, input) => {
	let resolvedPath = '/v2/notes/{note_id}';
	resolvedPath = resolvedPath.replace('{note_id}', String(input.note_id || ''));
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getObject: AttioEndpoint<'getObject'> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/{object_id}';
	resolvedPath = resolvedPath.replace(
		'{object_id}',
		String(input.object_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const peopleGetPerson: AttioEndpoint<'peopleGetPerson'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/people/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getRecord: AttioEndpoint<'getRecord'> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/{object}/records/{record_id}';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getRecordAttributeValues: AttioEndpoint<
	'getRecordAttributeValues'
> = async (ctx, input) => {
	const data = asInput(input);
	const object = pathValue(data, 'object');
	const recordId = pathValue(data, 'record_id');
	const attribute = pathValue(data, 'attribute', 'attribute_id');
	return await makeAuthenticatedAttioRequest(
		`/v2/objects/${object}/records/${recordId}/attributes/${attribute}/values`,
		ctx,
		{
			method: 'GET',
			query: asQuery(
				withoutKeys(data, [
					'object',
					'record_id',
					'attribute',
					'attribute_id',
					'record_attribute_values_id',
				]),
			),
		},
	);
};

export const getV2ObjectsObjectRecordsRecordId: AttioEndpoint<
	'getV2ObjectsObjectRecordsRecordId'
> = async (ctx, input) => getRecord(ctx, input);

export const getTask: AttioEndpoint<'getTask'> = async (ctx, input) => {
	let resolvedPath = '/v2/tasks/{task_id}';
	resolvedPath = resolvedPath.replace('{task_id}', String(input.task_id || ''));
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getV2WorkspaceMembers: AttioEndpoint<
	'getV2WorkspaceMembers'
> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest('/v2/workspace_members', ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getWebhook: AttioEndpoint<'getWebhook'> = async (ctx, input) => {
	let resolvedPath = '/v2/webhooks/{webhook_id}';
	resolvedPath = resolvedPath.replace(
		'{webhook_id}',
		String(input.webhook_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const getWorkspaceMember: AttioEndpoint<'getWorkspaceMember'> = async (
	ctx,
	input,
) => {
	const data = asInput(input);
	const memberId = pathValue(data, 'workspace_member_id', 'record_id');
	return await makeAuthenticatedAttioRequest(
		`/v2/workspace_members/${memberId}`,
		ctx,
		{ method: 'GET' },
	);
};

export const getWorkspaceRecord: AttioEndpoint<'getWorkspaceRecord'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/workspaces/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listAttributeOptions: AttioEndpoint<
	'listAttributeOptions'
> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/{object}/attributes/{attribute}/options';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	resolvedPath = resolvedPath.replace(
		'{attribute}',
		String(input.attribute || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listAttributeStatuses: AttioEndpoint<
	'listAttributeStatuses'
> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/{object}/attributes/{attribute}/statuses';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	resolvedPath = resolvedPath.replace(
		'{attribute}',
		String(input.attribute || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listAttributes: AttioEndpoint<'listAttributes'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/{object}/attributes';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listCallRecordings: AttioEndpoint<'listCallRecordings'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/meetings/{meeting_id}/call_recordings';
	resolvedPath = resolvedPath.replace(
		'{meeting_id}',
		String(input.meeting_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listCompanies: AttioEndpoint<'listCompanies'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest(
		'/v2/objects/companies/records/query',
		ctx,
		{
			method: 'POST',
			body: input,
		},
	);
};

export const listCompanyAttributeValues: AttioEndpoint<
	'listCompanyAttributeValues'
> = async (ctx, input) => {
	let resolvedPath =
		'/v2/objects/companies/records/{record_id}/attributes/{attribute}/values';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{attribute}',
		String(input.attribute || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listCompanyRecordEntries: AttioEndpoint<
	'listCompanyRecordEntries'
> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/companies/records/{record_id}/entries';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listDealEntries: AttioEndpoint<'listDealEntries'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/deals/records/{record_id}/entries';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listDealRecordAttributeValues: AttioEndpoint<
	'listDealRecordAttributeValues'
> = async (ctx, input) => {
	let resolvedPath =
		'/v2/objects/deals/records/{record_id}/attributes/{attribute}/values';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{attribute}',
		String(input.attribute || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listDealRecords: AttioEndpoint<'listDealRecords'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest(
		'/v2/objects/deals/records/query',
		ctx,
		{ method: 'POST', body: asInput(input) },
	);
};

export const listEntries: AttioEndpoint<'listEntries'> = async (ctx, input) => {
	let resolvedPath = '/v2/lists/{list}/entries/query';
	resolvedPath = resolvedPath.replace(
		'{list}',
		String(input.list || input.list_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'POST',
		body: input,
	});
};

export const postV2ListsListEntriesQuery: AttioEndpoint<
	'postV2ListsListEntriesQuery'
> = async (ctx, input) => {
	const data = asInput(input);
	const list = pathValue(data, 'list', 'list_id');
	return await makeAuthenticatedAttioRequest(
		`/v2/lists/${list}/entries/query`,
		ctx,
		{
			method: 'POST',
			body: withoutKeys(data, ['list', 'list_id']),
		},
	);
};

export const listListEntries: AttioEndpoint<'listListEntries'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/lists/{list}/entries/query';
	resolvedPath = resolvedPath.replace(
		'{list}',
		String(input.list || input.list_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'POST',
		body: input,
	});
};

export const listListEntryAttributeValues: AttioEndpoint<
	'listListEntryAttributeValues'
> = async (ctx, input) => {
	let resolvedPath =
		'/v2/lists/{list}/entries/{entry_id}/attributes/{attribute}/values';
	resolvedPath = resolvedPath.replace(
		'{list}',
		String(input.list || input.list_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{entry_id}',
		String(input.entry_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{attribute}',
		String(input.attribute || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listLists: AttioEndpoint<'listLists'> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest('/v2/lists', ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listMeetings: AttioEndpoint<'listMeetings'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest('/v2/meetings', ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listNotes: AttioEndpoint<'listNotes'> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest('/v2/notes', ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listObjects: AttioEndpoint<'listObjects'> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest('/v2/objects', ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listPeopleAttributeValues: AttioEndpoint<
	'listPeopleAttributeValues'
> = async (ctx, input) => {
	let resolvedPath =
		'/v2/objects/people/records/{record_id}/attributes/{attribute}/values';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{attribute}',
		String(input.attribute || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listPeopleRecordEntries: AttioEndpoint<
	'listPeopleRecordEntries'
> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/people/records/{record_id}/entries';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const peopleListPersons: AttioEndpoint<'peopleListPersons'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest(
		'/v2/objects/people/records/query',
		ctx,
		{ method: 'POST', body: asInput(input) },
	);
};

export const listRecordAttributeValues: AttioEndpoint<
	'listRecordAttributeValues'
> = async (ctx, input) => getRecordAttributeValues(ctx, input);

export const getRecordEntries: AttioEndpoint<'getRecordEntries'> = async (
	ctx,
	input,
) => {
	let resolvedPath =
		'/v2/objects/{object}/records/{record_id}/entries/{entry_id}';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{entry_id}',
		String(input.entry_id || input.record_entries_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listRecordEntries: AttioEndpoint<'listRecordEntries'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/{object}/records/{record_id}/entries';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listRecords: AttioEndpoint<'listRecords'> = async (ctx, input) => {
	const data = asInput(input);
	const object = pathValue(data, 'object');
	return await makeAuthenticatedAttioRequest(
		`/v2/objects/${object}/records/query`,
		ctx,
		{ method: 'POST', body: withoutKeys(data, ['object']) },
	);
};

export const postV2ObjectsObjectRecordsQuery: AttioEndpoint<
	'postV2ObjectsObjectRecordsQuery'
> = async (ctx, input) => queryRecords(ctx, input);

export const getV2Tasks: AttioEndpoint<'getV2Tasks'> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest('/v2/tasks', ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listThreads: AttioEndpoint<'listThreads'> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest('/v2/threads', ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listUserRecordEntries: AttioEndpoint<
	'listUserRecordEntries'
> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/users/records/{record_id}/entries';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listUserRecords: AttioEndpoint<'listUserRecords'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest(
		'/v2/objects/users/records/query',
		ctx,
		{ method: 'POST', body: asInput(input) },
	);
};

export const listWebhooks: AttioEndpoint<'listWebhooks'> = async (
	ctx,
	input,
) => {
	return await makeAuthenticatedAttioRequest('/v2/webhooks', ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listWorkspaceMembers: AttioEndpoint<
	'listWorkspaceMembers'
> = async (ctx, input) => getV2WorkspaceMembers(ctx, input);

export const listWorkspaceRecordAttributeValues: AttioEndpoint<
	'listWorkspaceRecordAttributeValues'
> = async (ctx, input) => {
	let resolvedPath =
		'/v2/objects/workspaces/records/{record_id}/attributes/{attribute}/values';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{attribute}',
		String(input.attribute || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listWorkspaceRecordEntries: AttioEndpoint<
	'listWorkspaceRecordEntries'
> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/workspaces/records/{record_id}/entries';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'GET',
		query: asQuery(input),
	});
};

export const listWorkspaceRecords: AttioEndpoint<
	'listWorkspaceRecords'
> = async (ctx, input) => {
	return await makeAuthenticatedAttioRequest(
		'/v2/objects/workspaces/records/query',
		ctx,
		{ method: 'POST', body: asInput(input) },
	);
};

export const patchRecord: AttioEndpoint<'patchRecord'> = async (ctx, input) => {
	const data = asInput(input);
	const object = pathValue(data, 'object');
	const recordId = pathValue(data, 'record_id');
	return await makeAuthenticatedAttioRequest(
		`/v2/objects/${object}/records/${recordId}`,
		ctx,
		{
			method: 'PATCH',
			body: withoutKeys(data, ['object', 'record_id']),
		},
	);
};

export const putV2ObjectsObjectRecordsRecordId: AttioEndpoint<
	'putV2ObjectsObjectRecordsRecordId'
> = async (ctx, input) => {
	const data = asInput(input);
	const object = pathValue(data, 'object');
	const recordId = pathValue(data, 'record_id');
	return await makeAuthenticatedAttioRequest(
		`/v2/objects/${object}/records/${recordId}`,
		ctx,
		{
			method: 'PUT',
			body: withoutKeys(data, ['object', 'record_id']),
		},
	);
};

export const queryRecords: AttioEndpoint<'queryRecords'> = async (
	ctx,
	input,
) => {
	const data = asInput(input);
	const object = pathValue(data, 'object');
	return await makeAuthenticatedAttioRequest(
		`/v2/objects/${object}/records/query`,
		ctx,
		{
			method: 'POST',
			body: withoutKeys(data, ['object']),
		},
	);
};

export const searchRecords: AttioEndpoint<'searchRecords'> = async (
	ctx,
	input,
) => {
	const data = asInput(input);
	return await makeAuthenticatedAttioRequest(
		'/v2/objects/records/search',
		ctx,
		{
			method: 'POST',
			body: withoutKeys(data, ['object', 'record_id']),
		},
	);
};

export const postV2ObjectsRecordsSearch: AttioEndpoint<
	'postV2ObjectsRecordsSearch'
> = async (ctx, input) => searchRecords(ctx, input);

export const updateAttribute: AttioEndpoint<'updateAttribute'> = async (
	ctx,
	input,
) => {
	const data = asInput(input);
	const attribute = pathValue(data, 'attribute', 'attribute_id');
	return await makeAuthenticatedAttioRequest(
		`${attributeBasePath(data)}/${attribute}`,
		ctx,
		{
			method: 'PATCH',
			body: withoutKeys(data, [
				'object',
				'list',
				'list_id',
				'attribute',
				'attribute_id',
			]),
		},
	);
};

export const updateCompany: AttioEndpoint<'updateCompany'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/companies/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const updateDealRecord: AttioEndpoint<'updateDealRecord'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/deals/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const updateEntry: AttioEndpoint<'updateEntry'> = async (ctx, input) => {
	let resolvedPath = '/v2/lists/{list}/entries/{entry_id}';
	resolvedPath = resolvedPath.replace(
		'{list}',
		String(input.list || input.list_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{entry_id}',
		String(input.entry_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const updateList: AttioEndpoint<'updateList'> = async (ctx, input) => {
	let resolvedPath = '/v2/lists/{list_id}';
	resolvedPath = resolvedPath.replace('{list_id}', String(input.list_id || ''));
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const patchV2ListsListEntriesEntryId: AttioEndpoint<
	'patchV2ListsListEntriesEntryId'
> = async (ctx, input) => {
	let resolvedPath = '/v2/lists/{list}/entries/{entry_id}';
	resolvedPath = resolvedPath.replace(
		'{list}',
		String(input.list || input.list_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{entry_id}',
		String(input.entry_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const putV2ListsListEntriesEntryId: AttioEndpoint<
	'putV2ListsListEntriesEntryId'
> = async (ctx, input) => {
	let resolvedPath = '/v2/lists/{list}/entries/{entry_id}';
	resolvedPath = resolvedPath.replace(
		'{list}',
		String(input.list || input.list_id || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{entry_id}',
		String(input.entry_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PUT',
		body: input,
	});
};

export const updateObject: AttioEndpoint<'updateObject'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/{object_id}';
	resolvedPath = resolvedPath.replace(
		'{object_id}',
		String(input.object_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const updatePerson: AttioEndpoint<'updatePerson'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/people/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const updateRecord: AttioEndpoint<'updateRecord'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/{object}/records/{record_id}';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const updateSelectOption: AttioEndpoint<'updateSelectOption'> = async (
	ctx,
	input,
) => {
	const data = asInput(input);
	const attribute = pathValue(data, 'attribute', 'attribute_id');
	const option = pathValue(data, 'option', 'select_option_id');
	return await makeAuthenticatedAttioRequest(
		`${attributeBasePath(data)}/${attribute}/options/${option}`,
		ctx,
		{
			method: 'PATCH',
			body: withoutKeys(data, [
				'object',
				'list',
				'list_id',
				'attribute',
				'attribute_id',
				'option',
				'select_option_id',
			]),
		},
	);
};

export const updateStatus: AttioEndpoint<'updateStatus'> = async (
	ctx,
	input,
) => {
	let resolvedPath =
		'/v2/objects/{object}/attributes/{attribute}/statuses/{status_id}';
	resolvedPath = resolvedPath.replace('{object}', String(input.object || ''));
	resolvedPath = resolvedPath.replace(
		'{attribute}',
		String(input.attribute || ''),
	);
	resolvedPath = resolvedPath.replace(
		'{status_id}',
		String(input.status_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const updateTask: AttioEndpoint<'updateTask'> = async (ctx, input) => {
	let resolvedPath = '/v2/tasks/{task_id}';
	resolvedPath = resolvedPath.replace('{task_id}', String(input.task_id || ''));
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const updateUserRecord: AttioEndpoint<'updateUserRecord'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/objects/users/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const updateWebhook: AttioEndpoint<'updateWebhook'> = async (
	ctx,
	input,
) => {
	let resolvedPath = '/v2/webhooks/{webhook_id}';
	resolvedPath = resolvedPath.replace(
		'{webhook_id}',
		String(input.webhook_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};

export const updateWorkspaceRecord: AttioEndpoint<
	'updateWorkspaceRecord'
> = async (ctx, input) => {
	let resolvedPath = '/v2/objects/workspaces/records/{record_id}';
	resolvedPath = resolvedPath.replace(
		'{record_id}',
		String(input.record_id || ''),
	);
	return await makeAuthenticatedAttioRequest(resolvedPath, ctx, {
		method: 'PATCH',
		body: input,
	});
};
