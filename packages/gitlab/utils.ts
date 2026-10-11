export const enc = (id: string | number) => encodeURIComponent(String(id));

type PluginDb = Record<string, any>;

/**
 * Validate and parse a numeric project identifier into a positive safe integer.
 * Returns null if the value is not a valid positive integer.
 */
export function parseNumericProjectId(
	projectId: string | number,
): number | null {
	if (typeof projectId === 'number') {
		return Number.isSafeInteger(projectId) && projectId > 0 ? projectId : null;
	}
	if (typeof projectId === 'string') {
		const trimmed = projectId.trim();
		if (/^\d+$/.test(trimmed)) {
			const num = Number(trimmed);
			return Number.isSafeInteger(num) && num > 0 ? num : null;
		}
	}
	return null;
}

export type LocalProjectResult =
	| { status: 'found'; entityId: string; id: number }
	| { status: 'not_found' }
	| { status: 'ambiguous'; count: number }
	| { status: 'invalid' };

/**
 * Locate a unique local project record in db.projects given either a numeric
 * GitLab project ID or a path string (e.g. "gitlab-org/gitlab").
 *
 * For numeric IDs:
 *   1. Searches db.projects for a record where `data.id` matches the numeric ID.
 *   2. If not found in search, falls back to db.projects.findByEntityId(String(numericId)).
 *   Returns the record's actual `entity_id` and numeric `id`.
 *
 * For path strings:
 *   Searches db.projects by `path_with_namespace`.
 */
export async function findLocalProject(
	projectId: string | number,
	db: PluginDb,
): Promise<LocalProjectResult> {
	if (!db.projects) {
		return { status: 'not_found' };
	}

	const numericId = parseNumericProjectId(projectId);
	if (numericId !== null) {
		if (db.projects.search) {
			// Note: 'as any' is required because Zod 4's .loose() index signature
			// on schema types conflicts with Corsair ORM's DataSearchFilter.
			const matches = await db.projects.search({
				data: { id: numericId } as any,
			});
			if (matches.length === 1) {
				const entity = matches[0]!;
				const numId =
					typeof entity.data?.id === 'number' ? entity.data.id : numericId;
				return {
					status: 'found',
					entityId: entity.entity_id,
					id: numId,
				};
			}
			if (matches.length > 1) {
				return { status: 'ambiguous', count: matches.length };
			}
		}

		if (db.projects.findByEntityId) {
			const entity = await db.projects.findByEntityId(String(numericId));
			if (entity) {
				const numId =
					typeof entity.data?.id === 'number' ? entity.data.id : numericId;
				return {
					status: 'found',
					entityId: entity.entity_id,
					id: numId,
				};
			}
		}

		return { status: 'not_found' };
	}

	// If numeric validation failed, check if it's a valid string path
	if (typeof projectId !== 'string') {
		return { status: 'invalid' };
	}

	const trimmed = projectId.trim();
	if (!trimmed) {
		return { status: 'invalid' };
	}

	if (!db.projects.search) {
		return { status: 'not_found' };
	}

	const matches = await db.projects.search({
		data: { path_with_namespace: trimmed } as any,
	});

	if (matches.length === 1 && typeof matches[0]?.data?.id === 'number') {
		return {
			status: 'found',
			entityId: matches[0]!.entity_id,
			id: matches[0]!.data.id,
		};
	}
	if (matches.length > 1) {
		return { status: 'ambiguous', count: matches.length };
	}
	return { status: 'not_found' };
}

/**
 * Resolve a project identifier (numeric ID or path like "namespace/project")
 * to a numeric GitLab project ID using the local DB.
 *
 * - If the input is a valid numeric ID (or numeric string), returns it as a positive number.
 * - If the input is a path string, searches local projects by `path_with_namespace`.
 *   Returns the numeric `id` only if exactly one project matches; otherwise returns `null`.
 */
export async function resolveNumericProjectId(
	projectId: string | number,
	db: PluginDb,
): Promise<number | null> {
	const numericId = parseNumericProjectId(projectId);
	if (numericId !== null) {
		return numericId;
	}

	const result = await findLocalProject(projectId, db);
	if (result.status === 'found') {
		return result.id;
	}
	if (result.status === 'ambiguous') {
		console.warn(
			`gitlab: multiple local projects (${result.count}) match path "${projectId}"; cannot resolve unambiguously`,
		);
	}
	return null;
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
