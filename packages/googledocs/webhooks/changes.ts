import { logEventFromContext } from 'corsair/core';
import type { DocumentStructure } from '../client';
import {
	countWords,
	extractPlainText,
	makeGoogleDocsRequest,
	makeGoogleDriveRequest,
	summarizeStructure,
} from '../client';
import type { GoogleDocsContext, GoogleDocsWebhooks } from '../index';
import type { Document, DriveFile } from '../types';
import type {
	DocsChangedEvent,
	GoogleDocsEventName,
	PubSubNotification,
} from './types';
import { createGoogleDocsWebhookMatcher, decodePubSubMessage } from './types';

const PAGE_TOKEN_PATTERN = /[?&]pageToken=([^&]+)/;
const DOCUMENT_MIME_TYPE = 'application/vnd.google-apps.document';
const FOLDER_MIME_TYPE = 'application/vnd.google-apps.folder';
const RECENT_CHANGE_WINDOW_MS = 60_000;
const FILE_FIELDS =
	'id,name,mimeType,parents,trashed,createdTime,modifiedTime,webViewLink';

type DriveChange = {
	fileId?: string;
	removed?: boolean;
	time?: string;
	file?: DriveFile;
};

type DriveChangeList = {
	nextPageToken?: string;
	newStartPageToken?: string;
	changes?: DriveChange[];
};

type CachedDocument = {
	data?: {
		headerCount?: number;
		footerCount?: number;
		footnoteCount?: number;
		tableCount?: number;
		imageCount?: number;
		wordCount?: number;
		hasPlaceholder?: boolean;
		hasKeyword?: boolean;
	};
};

function parsePageTokenFromUri(resourceUri: string): string | undefined {
	return resourceUri.match(PAGE_TOKEN_PATTERN)?.[1];
}

async function fetchFile(
	credentials: string,
	fileId: string,
): Promise<DriveFile | null> {
	try {
		return await makeGoogleDriveRequest<DriveFile>(
			`/files/${fileId}`,
			credentials,
			{ method: 'GET', query: { fields: FILE_FIELDS } },
		);
	} catch (error) {
		console.warn(`Failed to fetch file ${fileId}:`, error);
		return null;
	}
}

async function fetchDocument(
	credentials: string,
	documentId: string,
): Promise<Document | null> {
	try {
		return await makeGoogleDocsRequest<Document>(
			`/documents/${documentId}`,
			credentials,
			{ method: 'GET' },
		);
	} catch (error) {
		console.warn(`Failed to fetch document ${documentId}:`, error);
		return null;
	}
}

async function fetchChanges(
	credentials: string,
	pageToken: string,
): Promise<DriveChangeList> {
	return makeGoogleDriveRequest<DriveChangeList>('/changes', credentials, {
		method: 'GET',
		query: {
			pageToken,
			pageSize: 100,
			includeRemoved: true,
			supportsAllDrives: true,
		},
	});
}

function isEnabled(ctx: GoogleDocsContext, name: GoogleDocsEventName): boolean {
	const configured = ctx.options.webhookEvents;
	if (!configured) return true;
	return configured.includes(name);
}

function isRootFolder(file: DriveFile): boolean {
	return (
		!file.parents || file.parents.length === 0 || file.parents.includes('root')
	);
}

function isRecentlyCreated(file: DriveFile, change: DriveChange): boolean {
	if (!file.createdTime || !change.time) return false;
	const created = new Date(file.createdTime).getTime();
	const changeTime = new Date(change.time).getTime();
	return Math.abs(created - changeTime) <= RECENT_CHANGE_WINDOW_MS;
}

function structureChanged(
	cached: CachedDocument | undefined,
	structure: DocumentStructure,
): boolean {
	const data = cached?.data;
	if (!data) return false;
	// Only compare against a recorded baseline. A record written by the
	// lifecycle sync alone (id/title) has no counts, and defaulting those to
	// zero would misfire for every document that has any structure at all.
	const hasBaseline =
		data.headerCount !== undefined ||
		data.footerCount !== undefined ||
		data.footnoteCount !== undefined ||
		data.tableCount !== undefined ||
		data.imageCount !== undefined;
	if (!hasBaseline) return false;
	return (
		Number(data.headerCount ?? 0) !== structure.headers ||
		Number(data.footerCount ?? 0) !== structure.footers ||
		Number(data.footnoteCount ?? 0) !== structure.footnotes ||
		Number(data.tableCount ?? 0) !== structure.tables ||
		Number(data.imageCount ?? 0) !== structure.images
	);
}

async function emit(
	ctx: GoogleDocsContext,
	event: DocsChangedEvent,
	corsairEntityId: string,
) {
	await logEventFromContext(
		ctx,
		`googledocs.webhook.${event.type}`,
		{ ...event },
		'completed',
	);
	return { success: true, corsairEntityId, data: event };
}

export const docChanged: GoogleDocsWebhooks['docChanged'] = {
	match: createGoogleDocsWebhookMatcher('docChanged'),
	handler: async (ctx, request) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return { success: false, error: 'No message data in notification' };
		}

		const push = decodePubSubMessage(body.message.data);
		if (!push.resourceId || !push.resourceUri) {
			return { success: false, error: 'Invalid push notification format' };
		}

		const credentials = ctx.key;
		const pageToken = parsePageTokenFromUri(push.resourceUri);
		if (!pageToken) {
			return {
				success: false,
				error: 'Could not parse pageToken from resource URI',
			};
		}

		try {
			const changesResponse = await fetchChanges(credentials, pageToken);
			const changes = changesResponse.changes ?? [];
			let corsairEntityId = '';

			for (const change of changes) {
				if (!change.fileId) continue;
				const file = await fetchFile(credentials, change.fileId);
				if (!file) continue;

				// Folders are not Docs; only the folderCreated trigger applies.
				if (file.mimeType === FOLDER_MIME_TYPE) {
					if (
						!change.removed &&
						isRootFolder(file) &&
						isEnabled(ctx, 'folderCreated')
					) {
						return emit(
							ctx,
							{
								type: 'folderCreated',
								documentId: file.id,
								title: file.name,
								changeType: 'created',
							},
							file.id ?? '',
						);
					}
					continue;
				}

				if (file.mimeType !== DOCUMENT_MIME_TYPE) continue;
				if (!file.id) continue;

				const removed = change.removed ?? false;
				const trashed = file.trashed ?? false;
				const created = !removed && !trashed && isRecentlyCreated(file, change);

				if (ctx.db.documents?.upsertByEntityId && file.id) {
					try {
						if (removed || trashed) {
							// Capture the cache record's corsair entity id before it is
							// deleted; without this documentDeleted always emits with an
							// empty entity id (only the upsert branch set the variable).
							const existing = (await ctx.db.documents.findByEntityId?.(
								file.id,
							)) as { id?: string } | undefined;
							if (!corsairEntityId && existing?.id) {
								corsairEntityId = existing.id;
							}
							await ctx.db.documents.deleteByEntityId(file.id);
						} else {
							// Merge with the prior record: replacing it here would wipe
							// the structure counts and placeholder flag the content
							// triggers below use as their comparison baseline.
							const prior = (await ctx.db.documents.findByEntityId?.(
								file.id,
							)) as CachedDocument | undefined;
							const entity = await ctx.db.documents.upsertByEntityId(file.id, {
								createdAt: new Date(),
								...(prior?.data ?? {}),
								id: file.id,
								title: file.name,
							});
							if (!corsairEntityId && entity?.id) corsairEntityId = entity.id;
						}
					} catch (error) {
						console.warn(`Failed to sync document ${file.id}:`, error);
					}
				}

				// Lifecycle triggers (no document fetch needed).
				if (removed || trashed) {
					if (isEnabled(ctx, 'documentDeleted')) {
						return emit(
							ctx,
							{
								type: 'documentDeleted',
								documentId: file.id,
								title: file.name,
								changeType: trashed ? 'trashed' : 'deleted',
							},
							corsairEntityId,
						);
					}
					continue;
				}
				if (created) {
					if (isEnabled(ctx, 'documentCreated')) {
						return emit(
							ctx,
							{
								type: 'documentCreated',
								documentId: file.id,
								title: file.name,
								changeType: 'created',
							},
							corsairEntityId,
						);
					}
					if (isEnabled(ctx, 'documentAdded')) {
						return emit(
							ctx,
							{
								type: 'documentAdded',
								documentId: file.id,
								title: file.name,
								changeType: 'created',
							},
							corsairEntityId,
						);
					}
				} else if (isEnabled(ctx, 'documentUpdated')) {
					return emit(
						ctx,
						{
							type: 'documentUpdated',
							documentId: file.id,
							title: file.name,
							changeType: 'updated',
						},
						corsairEntityId,
					);
				}

				// Content triggers need the full document; skip the fetch if none are on.
				const contentTriggersOn = (
					[
						'documentStructureChanged',
						'keywordDetected',
						'documentWordCountThreshold',
						'documentPlaceholderFilled',
						'documentSearchUpdate',
					] as GoogleDocsEventName[]
				).some((t) => isEnabled(ctx, t));
				if (!contentTriggersOn) continue;

				const document = await fetchDocument(credentials, file.id);
				if (!document) continue;
				const text = extractPlainText(document);
				const structure = summarizeStructure(document);
				const opts = ctx.options.triggers ?? {};

				// Read the prior snapshot once; the placeholder and structure
				// triggers both compare the new state against it.
				const cached = (await ctx.db.documents?.findByEntityId?.(file.id)) as
					| CachedDocument
					| undefined;

				const placeholderPresent =
					!!opts.placeholder && text.includes(opts.placeholder);

				const keywordPresent =
					!!opts.keyword &&
					text.toLowerCase().includes(opts.keyword.toLowerCase());

				// Measured with the configured countBy so the persisted baseline and
				// the threshold comparison below always use the same metric.
				const measuredCount =
					opts.countBy === 'characters' ? text.length : countWords(text);

				// Persist the new content snapshot (structure counts + placeholder
				// state) before any trigger can return, so edge-based triggers fire
				// once per actual change instead of on every delivery.
				if (ctx.db.documents?.upsertByEntityId) {
					try {
						await ctx.db.documents.upsertByEntityId(file.id, {
							...(cached?.data ?? {}),
							id: file.id,
							title: file.name,
							headerCount: structure.headers,
							footerCount: structure.footers,
							footnoteCount: structure.footnotes,
							tableCount: structure.tables,
							imageCount: structure.images,
							wordCount: measuredCount,
							...(opts.placeholder
								? { hasPlaceholder: placeholderPresent }
								: {}),
							...(opts.keyword ? { hasKeyword: keywordPresent } : {}),
						});
					} catch (error) {
						console.warn(
							`Failed to persist content snapshot for ${file.id}:`,
							error,
						);
					}
				}

				if (isEnabled(ctx, 'documentStructureChanged')) {
					if (structureChanged(cached, structure)) {
						return emit(
							ctx,
							{
								type: 'documentStructureChanged',
								documentId: file.id,
								title: file.name,
								changeType: 'updated',
								structure,
							},
							corsairEntityId,
						);
					}
				}

				// Fire only on the absent -> present edge: the cached snapshot must
				// say the keyword was not there before. A document that already
				// contained the keyword must not re-trigger on every Drive push.
				if (
					isEnabled(ctx, 'keywordDetected') &&
					opts.keyword &&
					keywordPresent &&
					cached?.data?.hasKeyword === false
				) {
					return emit(
						ctx,
						{
							type: 'keywordDetected',
							documentId: file.id,
							title: file.name,
							matchedValue: opts.keyword,
						},
						corsairEntityId,
					);
				}

				if (
					isEnabled(ctx, 'documentWordCountThreshold') &&
					opts.wordCountThreshold !== undefined
				) {
					// Fire only on the below -> at/above crossing edge. Without the
					// cached baseline this would re-fire on every delivery for any
					// document already past the threshold.
					const priorCount = cached?.data?.wordCount;
					const crossedThreshold =
						priorCount !== undefined &&
						priorCount < opts.wordCountThreshold &&
						measuredCount >= opts.wordCountThreshold;
					if (crossedThreshold) {
						return emit(
							ctx,
							{
								type: 'documentWordCountThreshold',
								documentId: file.id,
								title: file.name,
								wordCount: measuredCount,
								matchedValue: String(opts.wordCountThreshold),
							},
							corsairEntityId,
						);
					}
				}

				// Fire only on the present -> absent edge: the placeholder was seen
				// in the cached snapshot and is gone now. A document that never
				// contained the placeholder must not trigger on every change.
				if (
					isEnabled(ctx, 'documentPlaceholderFilled') &&
					opts.placeholder &&
					cached?.data?.hasPlaceholder === true &&
					!placeholderPresent
				) {
					return emit(
						ctx,
						{
							type: 'documentPlaceholderFilled',
							documentId: file.id,
							title: file.name,
							matchedValue: opts.placeholder,
						},
						corsairEntityId,
					);
				}

				// Match against the title or the document body: the fetched text is
				// already in scope, and a search trigger that ignores content would
				// silently miss every body-only match.
				const searchQueryLower = opts.searchQuery?.toLowerCase();
				if (
					isEnabled(ctx, 'documentSearchUpdate') &&
					searchQueryLower &&
					((file.name ?? '').toLowerCase().includes(searchQueryLower) ||
						text.toLowerCase().includes(searchQueryLower))
				) {
					return emit(
						ctx,
						{
							type: 'documentSearchUpdate',
							documentId: file.id,
							title: file.name,
							matchedValue: opts.searchQuery,
							changeType: created ? 'created' : 'updated',
						},
						corsairEntityId,
					);
				}
			}

			return { success: true, corsairEntityId, data: undefined };
		} catch (error) {
			console.error('Failed to process Google Docs webhook:', error);
			return {
				success: false,
				error: `Failed to process change: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};
