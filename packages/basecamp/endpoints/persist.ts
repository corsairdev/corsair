type EntityStore = {
	upsertByEntityId: (
		entityId: string,
		data: Record<string, unknown>,
	) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};
type StoreMap = Record<string, EntityStore | undefined>;

const MIRROR_STORES: Record<string, string | undefined> = {
	ListProjects: 'projects',
	GetProject: 'projects',
	CreateProject: 'projects',
	UpdateProject: 'projects',
	ListTemplates: 'templates',
	GetTemplate: 'templates',
	CreateTemplate: 'templates',
	UpdateTemplate: 'templates',
	ListPeople: 'people',
	ListProjectPeople: 'people',
	ListPingablePeople: 'people',
	GetPerson: 'people',
	GetMyProfile: 'people',
	ListMessageTypes: 'messageTypes',
	GetMessageType: 'messageTypes',
	CreateMessageType: 'messageTypes',
	UpdateMessageType: 'messageTypes',
	ListCampfires: 'campfires',
	GetCampfire: 'campfires',
	ListChatbots: 'chatbots',
	GetChatbot: 'chatbots',
	CreateChatbot: 'chatbots',
	UpdateChatbot: 'chatbots',
};

const EVICTIONS: Record<
	string,
	{ store: string; inputField: string } | undefined
> = {
	TrashProject: { store: 'projects', inputField: 'projectId' },
	DeleteTemplate: { store: 'templates', inputField: 'templateId' },
	DeleteMessageType: { store: 'messageTypes', inputField: 'typeId' },
	DeleteChatbot: { store: 'chatbots', inputField: 'chatbotId' },
};

function records(value: unknown): Record<string, unknown>[] {
	if (Array.isArray(value)) {
		return value.filter(
			(row): row is Record<string, unknown> =>
				row !== null && typeof row === 'object' && !Array.isArray(row),
		);
	}
	if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
		return [value as Record<string, unknown>];
	}
	return [];
}

/**
 * `lines_url` and `command_url` embed the chatbot key. Per the Basecamp docs,
 * "possession of either URL is enough to use it" — anyone holding one can post
 * as that chatbot — which is why Basecamp only returns them to administrators.
 * The audit trail already drops them; the mirror must not keep them either, or
 * a credential Basecamp hands out sparingly ends up sitting in the local cache.
 * The rest of the row still identifies the chatbot, so it stays mirrored.
 */
const SECRET_BEARING_FIELDS: Record<string, readonly string[] | undefined> = {
	chatbots: ['lines_url', 'command_url'],
};

function withoutSecrets(
	storeName: string,
	row: Record<string, unknown>,
): Record<string, unknown> {
	const secrets = SECRET_BEARING_FIELDS[storeName];
	if (!secrets) return row;
	const safe = { ...row };
	for (const field of secrets) delete safe[field];
	return safe;
}

async function safely(operation: () => Promise<unknown>, label: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(
			'[BASECAMP] failed to update local ' + label + ' cache:',
			error,
		);
	}
}

export async function mirrorBasecampResult(
	db: unknown,
	providerOperationId: string,
	response: unknown,
) {
	const storeName = MIRROR_STORES[providerOperationId];
	if (!storeName || db === null || typeof db !== 'object') return;
	const store = (db as StoreMap)[storeName];
	if (!store) return;
	for (const row of records(response)) {
		const id = row.id;
		if (typeof id !== 'string' && typeof id !== 'number') continue;
		await safely(
			() => store.upsertByEntityId(String(id), withoutSecrets(storeName, row)),
			storeName + ' ' + String(id),
		);
	}
}

export async function evictBasecampResult(
	db: unknown,
	providerOperationId: string,
	input: Record<string, unknown>,
) {
	const spec = EVICTIONS[providerOperationId];
	if (!spec || db === null || typeof db !== 'object') return;
	const id = input[spec.inputField];
	if (typeof id !== 'string' && typeof id !== 'number') return;
	const remove = (db as StoreMap)[spec.store]?.deleteByEntityId;
	if (!remove) return;
	await safely(() => remove(String(id)), spec.store + ' ' + String(id));
}
