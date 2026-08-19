import {
	DockerHubImage,
	DockerHubInvite,
	DockerHubOrgAccessToken,
	DockerHubOrganization,
	DockerHubOrgMember,
	DockerHubRepository,
	DockerHubTag,
	DockerHubTeam,
	DockerHubTeamMember,
	DockerHubUser,
} from './database';

export const DockerHubSchema = {
	version: '1.0.0',
	entities: {
		repositories: DockerHubRepository,
		tags: DockerHubTag,
		images: DockerHubImage,
		organizations: DockerHubOrganization,
		orgMembers: DockerHubOrgMember,
		teams: DockerHubTeam,
		teamMembers: DockerHubTeamMember,
		orgAccessTokens: DockerHubOrgAccessToken,
		invites: DockerHubInvite,
		users: DockerHubUser,
	},
} as const;

export * from './database';
