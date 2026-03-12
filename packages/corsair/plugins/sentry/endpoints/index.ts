import * as EventEndpoints from './events';
import * as IssueEndpoints from './issues';
import * as OrganizationEndpoints from './organizations';
import * as ProjectEndpoints from './projects';
import * as ReleaseEndpoints from './releases';
import * as TeamEndpoints from './teams';

export const Events = {
	get: EventEndpoints.get,
	list: EventEndpoints.list,
};

export const Issues = {
	get: IssueEndpoints.get,
	list: IssueEndpoints.list,
	update: IssueEndpoints.update,
	delete: IssueEndpoints.deleteIssue,
};

export const Organizations = {
	get: OrganizationEndpoints.get,
	list: OrganizationEndpoints.list,
	create: OrganizationEndpoints.create,
	update: OrganizationEndpoints.update,
};

export const Projects = {
	get: ProjectEndpoints.get,
	list: ProjectEndpoints.list,
	create: ProjectEndpoints.create,
	update: ProjectEndpoints.update,
	delete: ProjectEndpoints.deleteProject,
};

export const Releases = {
	get: ReleaseEndpoints.get,
	list: ReleaseEndpoints.list,
	create: ReleaseEndpoints.create,
	update: ReleaseEndpoints.update,
	delete: ReleaseEndpoints.deleteRelease,
};

export const Teams = {
	get: TeamEndpoints.get,
	list: TeamEndpoints.list,
	create: TeamEndpoints.create,
	update: TeamEndpoints.update,
	delete: TeamEndpoints.deleteTeam,
};

export * from './types';
