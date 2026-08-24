import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { AnnotationsEndpoints } from './annotations';
import { ApiUsersEndpoints } from './api-users';
import { CollectionsEndpoints } from './collections';
import { DataPointChoicesEndpoints } from './data-point-choices';
import { DataPointsEndpoints } from './data-points';
import { DataSourcesEndpoints } from './data-sources';
import { DocumentSplittersEndpoints } from './document-splitters';
import { DocumentTypesEndpoints } from './document-types';
import { DocumentsEndpoints } from './documents';
import { ExtractorsEndpoints } from './extractors';
import { IndexesEndpoints } from './indexes';
import { InvitationsEndpoints } from './invitations';
import { JobDescriptionSearchEndpoints } from './job-description-search';
import { MappingsEndpoints } from './mappings';
import { OccupationGroupsEndpoints } from './occupation-groups';
import { OrganizationMembershipsEndpoints } from './organization-memberships';
import { OrganizationsEndpoints } from './organizations';
import { ResthooksEndpoints } from './resthooks';
import { ResumeSearchEndpoints } from './resume-search';
import { affindaRoutes } from './routes';
import { TagsEndpoints } from './tags';
import {
	AffindaEndpointInputSchemas,
	AffindaEndpointOutputSchemas,
} from './types';
import { ValidationEndpoints } from './validation';
import { ValidationResultsEndpoints } from './validation-results';
import { WorkspaceMembershipsEndpoints } from './workspace-memberships';
import { WorkspacesEndpoints } from './workspaces';

export const affindaEndpointsNested = {
	annotations: AnnotationsEndpoints,
	apiUsers: ApiUsersEndpoints,
	collections: CollectionsEndpoints,
	dataPointChoices: DataPointChoicesEndpoints,
	dataPoints: DataPointsEndpoints,
	dataSources: DataSourcesEndpoints,
	documentSplitters: DocumentSplittersEndpoints,
	documentTypes: DocumentTypesEndpoints,
	documents: DocumentsEndpoints,
	extractors: ExtractorsEndpoints,
	indexes: IndexesEndpoints,
	invitations: InvitationsEndpoints,
	jobDescriptionSearch: JobDescriptionSearchEndpoints,
	mappings: MappingsEndpoints,
	occupationGroups: OccupationGroupsEndpoints,
	organizationMemberships: OrganizationMembershipsEndpoints,
	organizations: OrganizationsEndpoints,
	resthooks: ResthooksEndpoints,
	resumeSearch: ResumeSearchEndpoints,
	tags: TagsEndpoints,
	validation: ValidationEndpoints,
	validationResults: ValidationResultsEndpoints,
	workspaceMemberships: WorkspaceMembershipsEndpoints,
	workspaces: WorkspacesEndpoints,
} as const;

export const affindaEndpointMeta = Object.fromEntries(
	affindaRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			irreversible: 'irreversible' in route ? route.irreversible : undefined,
			description: route.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof affindaEndpointsNested>;

export const affindaEndpointSchemas = Object.fromEntries(
	affindaRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: AffindaEndpointInputSchemas[route.key],
			output: AffindaEndpointOutputSchemas[route.key],
		},
	]),
);

export { AffindaEndpointInputSchemas, AffindaEndpointOutputSchemas };
export * from './routes';
export * from './types';
