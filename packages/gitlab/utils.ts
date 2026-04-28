export const enc = (id: string | number) => encodeURIComponent(String(id));

type PluginDb = Record<string, any>;

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
