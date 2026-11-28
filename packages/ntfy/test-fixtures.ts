/**
 * Bodies the live ntfy.sh API actually sent during the research probes of
 * 2026-11-27 (/tmp/corsair-work/ntfy/probes/), not the docs' examples.
 */

// probes/2-publish-json-root.txt: JSON publish to the server root.
export const publishedMessage = {
	id: 'Xdi9X3yTYpC6',
	time: 1795793553,
	expires: 1795836753,
	event: 'message',
	topic: 'corsair-research-x9k2f',
	title: 'JSON title',
	message: 'JSON probe 2',
	priority: 4,
	tags: ['tada'],
	click: 'https://example.com',
};

// probes/13-sequence-lifecycle.txt: update, then clear, then delete on one
// sequence id.
export const updatedMessage = {
	id: 'sA2uULND1HZm',
	sequence_id: 'corsair-seq-abc123',
	time: 1795793585,
	expires: 1795836785,
	event: 'message',
	topic: 'corsair-research-x9k2f',
	message: 'Seq v2',
};

export const clearedMessage = {
	id: 'p4hK6pyc6DUR',
	sequence_id: 'corsair-seq-abc123',
	time: 1795793586,
	expires: 1795836786,
	event: 'message_clear',
	topic: 'corsair-research-x9k2f',
};

export const deletedMessage = {
	id: 'HGSf8pIbHYJ1',
	sequence_id: 'corsair-seq-abc123',
	time: 1795793587,
	expires: 1795836787,
	event: 'message_delete',
	topic: 'corsair-research-x9k2f',
};

// probes/4-publish-actions.txt: an action-bearing publish, as consumed.
// The server assigned each action an `id`.
export const actionsMessage = {
	id: 'ygrbMUFqrS9K',
	time: 1795793555,
	expires: 1795836755,
	event: 'message',
	topic: 'corsair-research-x9k2f',
	message: 'Actions probe 2',
	actions: [
		{
			id: 'ZS4yDjjxbM',
			action: 'view',
			label: 'Open portal',
			clear: true,
			url: 'https://example.com',
		},
		{
			id: '4T8EJuXOzO',
			action: 'http',
			label: 'Turn down',
			clear: false,
			url: 'https://example.com/api',
			method: 'PUT',
		},
	],
};

// probes/7-poll-json-since-all.txt body: one NDJSON line.
export const pollNdjson = `${JSON.stringify({
	id: 'FxMgeKMHrn69',
	time: 1795793425,
	expires: 1795836625,
	event: 'message',
	topic: 'corsair-research-x9k2f',
	title: 'Probe title',
	message: 'Raw body probe from corsair research',
	priority: 4,
	tags: ['warning', 'skull'],
})}\n`;

// probes/11-12: a scheduled publish answers `time` = the future delivery
// time, and poll&sched=1 lists it.
export const scheduledMessage = {
	id: 'schedProbe1',
	time: 1795794000,
	expires: 1795837200,
	event: 'message',
	topic: 'corsair-research-x9k2f',
	message: 'Scheduled probe',
};

// probes/17-auth-account-noauth.txt: the anonymous view of /v1/account.
export const anonymousAccount = {
	username: '*',
	role: 'anonymous',
	limits: {
		basis: 'ip',
		messages: 250,
		messages_expiry_duration: 43200,
		emails: 5,
		calls: 0,
		reservations: 0,
		attachment_total_size: 20971520,
		attachment_file_size: 2097152,
		attachment_expiry_duration: 10800,
		attachment_bandwidth: 367001600,
	},
	stats: {
		messages: 7,
		messages_remaining: 243,
		emails: 0,
		emails_remaining: 5,
		calls: 0,
		calls_remaining: 0,
		reservations: 0,
		reservations_remaining: 0,
		attachment_total_size: 0,
		attachment_total_size_remaining: 20971520,
		reset_at: 1795825826,
	},
};

// probes/14-v1-health.txt
export const health = { healthy: true, role: 'active' };

// probes/15-v1-stats.txt
export const serverStats = { messages: 1602456100, messages_rate: 127.44 };

// probes/16-topic-stats.txt, 19-21, 24: the one error envelope shape.
export const notFound = {
	code: 40401,
	http: 404,
	error: 'page not found',
};
export const unauthorized = {
	code: 40101,
	http: 401,
	error: 'unauthorized',
	link: 'https://ntfy.sh/docs/publish/#authentication',
};
export const forbidden = { code: 40301, http: 403, error: 'forbidden' };
export const invalidPriority = {
	code: 40007,
	http: 400,
	error: 'invalid priority parameter',
	link: 'https://ntfy.sh/docs/publish/#priority',
};
// Docs-only (research.md): a poll past the daily bandwidth cap.
export const bandwidthExceeded = {
	code: 42905,
	http: 429,
	error: 'daily bandwidth limit exceeded',
};
