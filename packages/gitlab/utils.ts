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

// project_id may be a numeric ID or a path like "group/project". Paths are
// resolved through the local projects table; anything but one match is null.
export async function resolveProjectId(
	projectId: string | number,
	projects: ProjectStore | undefined,
): Promise<number | null> {
	if (typeof projectId === 'number') return projectId;
	if (/^\d+$/.test(projectId)) return Number(projectId);
	const matches = await projects?.search({
		data: { path_with_namespace: projectId },
	} as never);
	return matches?.length === 1 ? matches[0]!.data.id : null;
}

// Issues and MRs are stored by global id, but deletes address them by
// project + iid, so the rows have to be looked up before they can be removed.
export async function deleteByIid(
	store: IidStore | undefined,
	projects: ProjectStore | undefined,
	projectId: string | number,
	iid: number,
) {
	if (!store) return;
	const resolved = await resolveProjectId(projectId, projects);
	if (resolved === null) return;
	const rows = await store.search({
		data: { iid, project_id: resolved },
	} as never);
	await Promise.all(rows.map((row) => store.deleteByEntityId(row.entity_id)));
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
