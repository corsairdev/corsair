import type { PluginEntityClient } from 'corsair/orm';
import type {
	GitlabIssue,
	GitlabMergeRequest,
	GitlabProject,
} from './schema/database';

export const enc = (id: string | number) => encodeURIComponent(String(id));

type PluginDb = Record<string, any>;

// The schemas are .loose(), and their index signature makes DataSearchFilter
// reject every known key, so the search filters below are cast to never.
type ProjectStore = PluginEntityClient<typeof GitlabProject>;
type IidStore =
	| PluginEntityClient<typeof GitlabIssue>
	| PluginEntityClient<typeof GitlabMergeRequest>;

const isGitlabId = (value: number) => Number.isSafeInteger(value) && value > 0;

function parseProjectId(projectId: string | number): number | null {
	const id =
		typeof projectId === 'number'
			? projectId
			: /^\d+$/.test(projectId)
				? Number(projectId)
				: Number.NaN;
	return isGitlabId(id) ? id : null;
}

// project_id may be a numeric ID or a path like "group/project". Returns the
// local project row only when exactly one row matches.
export async function findProject(
	projectId: string | number,
	projects: ProjectStore | undefined,
) {
	const id = parseProjectId(projectId);
	if (!projects || (id === null && typeof projectId === 'number')) {
		return null;
	}
	const rows = await projects.search({
		data: id === null ? { path_with_namespace: projectId } : { id },
	} as never);
	return rows.length === 1 ? rows[0]! : null;
}

async function resolveProjectId(
	projectId: string | number,
	projects: ProjectStore | undefined,
): Promise<number | null> {
	const id = parseProjectId(projectId);
	if (id !== null) return id;
	const project = await findProject(projectId, projects);
	return project ? project.data.id : null;
}

// Issues and MRs are stored by global id, but deletes address them by
// project + iid, so the row has to be found before it can be removed. Nothing
// is deleted unless exactly one row matches.
export async function deleteByIid(
	store: IidStore | undefined,
	projects: ProjectStore | undefined,
	projectId: string | number,
	iid: number,
) {
	if (!store || !isGitlabId(iid)) return;
	const resolved = await resolveProjectId(projectId, projects);
	if (resolved === null) return;
	const rows = await store.search({
		data: { iid, project_id: resolved },
	} as never);
	if (rows.length === 1) await store.deleteByEntityId(rows[0]!.entity_id);
}

export async function persistUser(user: Record<string, any>, db: PluginDb) {
	if (db.users) {
		return db.users.upsertByEntityId(String(user.id), user);
	}
}

export async function persistProject(
	project: Record<string, any>,
	db: PluginDb,
) {
	const { owner, ...projectData } = project;

	if (owner?.id && db.users) {
		await db.users.upsertByEntityId(String(owner.id), owner);
	}

	if (db.projects) {
		return db.projects.upsertByEntityId(String(project.id), {
			...projectData,
			...(owner ? { creator_id: owner.id } : {}),
		});
	}
}

export async function persistIssue(issue: Record<string, any>, db: PluginDb) {
	const { author, assignee, ...issueData } = issue;

	if (author?.id && db.users) {
		await db.users.upsertByEntityId(String(author.id), author);
	}
	if (assignee?.id && db.users) {
		await db.users.upsertByEntityId(String(assignee.id), assignee);
	}

	if (db.issues) {
		return db.issues.upsertByEntityId(String(issue.id), {
			...issueData,
			...(author ? { author_id: author.id } : {}),
			...(assignee ? { assignee_id: assignee.id } : {}),
		});
	}
}

export async function persistMergeRequest(
	mr: Record<string, any>,
	db: PluginDb,
) {
	const { author, assignee, ...mrData } = mr;

	if (author?.id && db.users) {
		await db.users.upsertByEntityId(String(author.id), author);
	}
	if (assignee?.id && db.users) {
		await db.users.upsertByEntityId(String(assignee.id), assignee);
	}

	if (db.mergeRequests) {
		return db.mergeRequests.upsertByEntityId(String(mr.id), {
			...mrData,
			...(author ? { author_id: author.id } : {}),
			...(assignee ? { assignee_id: assignee.id } : {}),
		});
	}
}

export async function persistPipeline(
	pipeline: Record<string, any>,
	db: PluginDb,
) {
	if (db.pipelines) {
		return db.pipelines.upsertByEntityId(String(pipeline.id), pipeline);
	}
}

export async function persistGroup(group: Record<string, any>, db: PluginDb) {
	if (db.groups) {
		return db.groups.upsertByEntityId(String(group.id), group);
	}
}
