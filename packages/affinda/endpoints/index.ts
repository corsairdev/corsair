import { AnnotationsEndpoints } from './annotations';
import { ApiUsersEndpoints } from './apiUsers';
import { CollectionsEndpoints } from './collections';
import { DataPointChoicesEndpoints } from './dataPointChoices';
import { DataPointsEndpoints } from './dataPoints';
import { DataSourcesEndpoints } from './dataSources';
import { DocumentSplittersEndpoints } from './documentSplitters';
import { DocumentTypesEndpoints } from './documentTypes';
import { DocumentsEndpoints } from './documents';
import { ExtractorsEndpoints } from './extractors';
import { IndexesEndpoints } from './indexes';
import { InvitationsEndpoints } from './invitations';
import { JobDescriptionSearchEndpoints } from './jobDescriptionSearch';
import { MappingsEndpoints } from './mappings';
import { OccupationGroupsEndpoints } from './occupationGroups';
import { OrganizationMembershipsEndpoints } from './organizationMemberships';
import { OrganizationsEndpoints } from './organizations';
import { ResthooksEndpoints } from './resthooks';
import { ResumeSearchEndpoints } from './resumeSearch';
import { TagsEndpoints } from './tags';
import { ValidationEndpoints } from './validation';
import { ValidationResultsEndpoints } from './validationResults';
import { WorkspaceMembershipsEndpoints } from './workspaceMemberships';
import { WorkspacesEndpoints } from './workspaces';
import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { affindaRoutes } from './routes';
import { AffindaEndpointInputSchemas, AffindaEndpointOutputSchemas } from './types';

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
	workspaces: WorkspacesEndpoints
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
