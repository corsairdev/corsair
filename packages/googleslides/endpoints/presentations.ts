import type { GoogleSlidesEndpoints } from '..';
import {
	fetchDriveBytes,
	makeDriveRequest,
	makeSlidesRequest,
	markReplaySafe,
} from '../client';
import type { Dimension, Presentation, ProviderJson } from '../types';
import { call, compact, compactQuery } from './shared';
import {
	GoogleSlidesEndpointInputSchemas,
	GoogleSlidesEndpointOutputSchemas,
} from './types';

export const PRESENTATION_MIME_TYPE =
	'application/vnd.google-apps.presentation';

export const EXPORT_MIME_TYPES = {
	pdf: 'application/pdf',
	pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
} as const;

// The Drive fields mask on every read: enough for a list row, and the same
// shape for copy so one output schema covers both.
const LIST_FIELDS =
	'nextPageToken,files(id,name,mimeType,createdTime,modifiedTime,webViewLink,owners(displayName,emailAddress))';

/**
 * The API returns the whole deck on a read, which is far more than a caller
 * needs to tell one presentation from another. Counting here keeps the reply
 * small and the counts identical across create, get and copy.
 *
 * A missing presentationId means the body is not a presentation at all, so
 * throwing beats reporting zero slides for a real deck.
 */
/**
 * Converts a page dimension to EMU. Google returns the unit alongside the
 * magnitude, and a point is 12,700 EMU, so a PT value passed through unchanged
 * would report a page 12,700 times too small.
 */
export function toEmu(dimension: Dimension | undefined): number | undefined {
	if (dimension?.magnitude === undefined) return undefined;
	if (dimension.unit === 'PT') return Math.round(dimension.magnitude * 12_700);
	return dimension.magnitude;
}

export function summarizePresentation(presentation: Presentation) {
	if (!presentation.presentationId) {
		throw new Error(
			`Google Slides reply has no presentationId: ${JSON.stringify(presentation).slice(0, 200)}`,
		);
	}

	return {
		presentationId: presentation.presentationId,
		title: presentation.title,
		locale: presentation.locale,
		revisionId: presentation.revisionId,
		url: `https://docs.google.com/presentation/d/${presentation.presentationId}/edit`,
		slideCount: presentation.slides?.length ?? 0,
		layoutCount: presentation.layouts?.length ?? 0,
		masterCount: presentation.masters?.length ?? 0,
		pageWidthEmu: toEmu(presentation.pageSize?.width),
		pageHeightEmu: toEmu(presentation.pageSize?.height),
		// Present only when the request asked for comments; Google omits it
		// otherwise, so the field is copied rather than defaulted to an empty list.
		...(presentation.comments === undefined
			? {}
			: { comments: presentation.comments }),
	};
}

type SlidesCtx = Parameters<GoogleSlidesEndpoints['presentationsGet']>[0];

/**
 * The fields a caller actually knows at the call site. A list row carries no
 * slide counts, so those are left absent rather than written as zero:
 * `upsertByEntityId` replaces the stored document, so a zero here would erase a
 * count an earlier read had saved.
 */
type PresentationSummaryFields = {
	presentationId: string;
	title?: string | null;
	url: string;
	revisionId?: string | null;
	slideCount?: number;
	layoutCount?: number;
	masterCount?: number;
	/** RFC 3339 from Drive, which a read does not return. */
	createdTime?: string;
	modifiedTime?: string;
};

/**
 * Stores the presentation summary so `db.presentations.search` has something to
 * search. Reads the prior row and merges, because `upsertByEntityId` replaces
 * the whole document: without this, a list call would wipe the counts, revision
 * and timestamps an earlier read had written.
 */
async function persistPresentation(
	ctx: SlidesCtx,
	summary: PresentationSummaryFields,
) {
	if (!ctx.db.presentations?.upsertByEntityId) return;
	try {
		const prior = ctx.db.presentations.findByEntityId
			? await ctx.db.presentations.findByEntityId(summary.presentationId)
			: undefined;
		// The stored row wraps the data; `data` holds what this function wrote.
		// unknown: the stored row's payload, whose fields vary by what wrote it.
		const priorData = (prior as { data?: ProviderJson } | undefined)?.data;

		await ctx.db.presentations.upsertByEntityId(summary.presentationId, {
			...priorData,
			id: summary.presentationId,
			presentationId: summary.presentationId,
			url: summary.url,
			// Every optional field is omitted rather than set to undefined: the
			// spread above restores the prior value, and an explicit undefined here
			// would overwrite it. A list row carries no title or revision, and
			// writing undefined would erase what a read had saved.
			...(summary.title === undefined || summary.title === null
				? {}
				: { title: summary.title }),
			...(summary.revisionId === undefined || summary.revisionId === null
				? {}
				: { revisionId: summary.revisionId }),
			...(summary.slideCount === undefined
				? {}
				: { slideCount: summary.slideCount }),
			...(summary.layoutCount === undefined
				? {}
				: { layoutCount: summary.layoutCount }),
			...(summary.masterCount === undefined
				? {}
				: { masterCount: summary.masterCount }),
			...(summary.createdTime === undefined
				? {}
				: { createdTime: summary.createdTime }),
			...(summary.modifiedTime === undefined
				? {}
				: { modifiedTime: summary.modifiedTime }),
			lastSyncedAt: new Date(),
			createdAt: (priorData?.createdAt as Date | undefined) ?? new Date(),
		});
	} catch (error) {
		// A failed write must not fail a read that already succeeded: the caller
		// asked for the presentation, not for a database row.
		console.warn('Failed to save presentation to database:', error);
	}
}

/**
 * Removes the cached row once Google has confirmed the deck is gone, so a deleted
 * presentation stops appearing in local searches. Kept apart from the delete
 * itself: the remote deletion already succeeded, and a storage failure must not
 * report it as failed.
 */
async function forgetPresentation(ctx: SlidesCtx, presentationId: string) {
	if (!ctx.db.presentations?.deleteByEntityId) return;
	try {
		await ctx.db.presentations.deleteByEntityId(presentationId);
	} catch (error) {
		console.warn('Failed to remove presentation from database:', error);
	}
}

async function getPresentation(
	ctx: SlidesCtx,
	presentationId: string,
): Promise<Presentation> {
	return makeSlidesRequest<Presentation>(
		`/presentations/${encodeURIComponent(presentationId)}`,
		ctx,
	);
}

export const presentationsCreate: GoogleSlidesEndpoints['presentationsCreate'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'presentations.create',
				input: GoogleSlidesEndpointInputSchemas.presentationsCreate,
				output: GoogleSlidesEndpointOutputSchemas.presentationsCreate,
			},
			input,
			async (parsed) => {
				// Create reads only title and presentationId. Every other field in a
				// Presentation body is documented as ignored, so sending them would
				// report a setting the deck does not have.
				const created = await makeSlidesRequest<Presentation>(
					'/presentations',
					ctx,
					{
						method: 'POST',
						body: compact({
							title: parsed.title,
							presentationId: parsed.presentationId,
						}),
					},
				);
				const summary = summarizePresentation(created);
				await persistPresentation(ctx, summary);
				return summary;
			},
			(parsed) => ({ title: parsed.title }),
		);

export const presentationsGet: GoogleSlidesEndpoints['presentationsGet'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'presentations.get',
				input: GoogleSlidesEndpointInputSchemas.presentationsGet,
				output: GoogleSlidesEndpointOutputSchemas.presentationsGet,
			},
			input,
			async (parsed) => {
				// Marked replay-safe: the request only reads, and the local write
				// after it is an upsert of the same values, so a retry is harmless.
				const presentation = await markReplaySafe(
					makeSlidesRequest<Presentation>(
						`/presentations/${encodeURIComponent(parsed.presentationId)}`,
						ctx,
						{
							query: compactQuery({
								commentsViewMode: parsed.commentsViewMode,
							}),
							// A deck with hundreds of slides and images is far slower
							// than the 20s default before the full reply arrives.
							timeout: 60_000,
						},
					),
				);
				const summary = summarizePresentation(presentation);
				await persistPresentation(ctx, summary);
				return summary;
			},
			(parsed) => ({ presentationId: parsed.presentationId }),
		);

export const presentationsList: GoogleSlidesEndpoints['presentationsList'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'presentations.list',
				input: GoogleSlidesEndpointInputSchemas.presentationsList,
				output: GoogleSlidesEndpointOutputSchemas.presentationsList,
			},
			input,
			async (parsed) => {
				// The Drive query is a conjunction, so a caller filter joins with `and`.
				// Parentheses keep an `or` filter from widening the result past
				// presentations, which would put a document in a slide list.
				const constraint = `mimeType = '${PRESENTATION_MIME_TYPE}' and trashed = false`;
				const q = parsed.query
					? `(${parsed.query}) and ${constraint}`
					: constraint;

				// Marked replay-safe: a read, followed only by idempotent upserts.
				const page = await markReplaySafe(
					makeDriveRequest<{
						files?: ProviderJson[];
						nextPageToken?: string;
					}>('/files', ctx, {
						query: compactQuery({
							q,
							pageSize: parsed.pageSize,
							pageToken: parsed.pageToken,
							orderBy: parsed.orderBy,
							fields: LIST_FIELDS,
						}),
					}),
				);

				// Drive always names an id. A row without one would parse as a
				// presentation the caller cannot open, so fail instead of passing it on.
				const files = page.files ?? [];
				const shaped: (ProviderJson & { presentationId: string })[] = files.map(
					(file) => {
						if (typeof file.id !== 'string') {
							throw new Error(
								`Drive returned a presentation without an id: ${JSON.stringify(file)}`,
							);
						}
						return { ...file, presentationId: file.id };
					},
				);

				// List rows feed the entity too. A Drive row carries no slide counts,
				// so those fields are left out and persistPresentation keeps whatever
				// a read saved for them.
				for (const file of shaped) {
					if (!ctx.db.presentations?.upsertByEntityId) break;
					await persistPresentation(ctx, {
						presentationId: file.presentationId,
						title: typeof file.name === 'string' ? file.name : undefined,
						url: `https://docs.google.com/presentation/d/${file.presentationId}/edit`,
						// Drive is the only source of these two, so a row created by a
						// read has none and a list refresh fills them in.
						createdTime:
							typeof file.createdTime === 'string'
								? file.createdTime
								: undefined,
						modifiedTime:
							typeof file.modifiedTime === 'string'
								? file.modifiedTime
								: undefined,
					});
				}

				return { files: shaped, nextPageToken: page.nextPageToken };
			},
			(parsed) => ({
				...(parsed.pageSize === undefined ? {} : { pageSize: parsed.pageSize }),
			}),
		);

export const presentationsCopy: GoogleSlidesEndpoints['presentationsCopy'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'presentations.copy',
				input: GoogleSlidesEndpointInputSchemas.presentationsCopy,
				output: GoogleSlidesEndpointOutputSchemas.presentationsCopy,
			},
			input,
			async (parsed) => {
				// Not marked replay-safe: a 5xx does not prove Drive left the copy
				// unmade, so a whole-endpoint retry could leave two copies.
				const file = await makeDriveRequest<{ id?: string }>(
					`/files/${encodeURIComponent(parsed.presentationId)}/copy`,
					ctx,
					{
						method: 'POST',
						body: compact({ name: parsed.name, parents: parsed.parents }),
						query: { fields: 'id' },
					},
				);
				if (!file.id) {
					throw new Error('Drive copy returned no file id');
				}
				// A copy is a full deck, so the caller gets the same summary as a read.
				// Best effort: the copy exists now, so a failed read-back must not
				// report the copy as failed and invite a retry that copies again.
				// The summary is built inside the guard because a reply that is not a
				// presentation throws there, not in the request.
				const summary = await getPresentation(ctx, file.id)
					.then((presentation) => summarizePresentation(presentation))
					.catch(
						// unknown: the read failed; the copy's id came from Drive.
						(error: unknown) => {
							console.warn(
								`Copied to ${file.id} but could not read it back:`,
								error,
							);
							return undefined;
						},
					);
				if (!summary) {
					// The id is known and the copy succeeded, so report what is known
					// rather than throwing over a read that can be redone.
					return {
						presentationId: file.id,
						title: parsed.name,
						url: `https://docs.google.com/presentation/d/${file.id}/edit`,
						slideCount: 0,
						layoutCount: 0,
						masterCount: 0,
					};
				}
				await persistPresentation(ctx, summary);
				return summary;
			},
			(parsed) => ({ presentationId: parsed.presentationId }),
		);

export const presentationsExport: GoogleSlidesEndpoints['presentationsExport'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'presentations.exportPdf',
				input: GoogleSlidesEndpointInputSchemas.presentationsExport,
				output: GoogleSlidesEndpointOutputSchemas.presentationsExport,
			},
			input,
			async (parsed) => {
				const format = parsed.format ?? 'pdf';
				const mimeType = EXPORT_MIME_TYPES[format];
				// Export returns file bytes, not JSON, so it cannot use the JSON
				// client: that helper would hand back a string that fails the
				// output parse with no clue why.
				const { buffer, contentType } = await fetchDriveBytes(
					ctx,
					`/files/${encodeURIComponent(parsed.presentationId)}/export?mimeType=${encodeURIComponent(mimeType)}`,
					{ accept: mimeType, timeout: 180_000 },
				);
				return {
					presentationId: parsed.presentationId,
					format,
					mimeType: contentType.split(';')[0] ?? mimeType,
					byteLength: buffer.byteLength,
					data: buffer.toString('base64'),
				};
			},
			(parsed) => ({
				presentationId: parsed.presentationId,
				format: parsed.format ?? 'pdf',
			}),
		);

export const presentationsRemove: GoogleSlidesEndpoints['presentationsDelete'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'presentations.delete',
				input: GoogleSlidesEndpointInputSchemas.presentationsDelete,
				output: GoogleSlidesEndpointOutputSchemas.presentationsDelete,
			},
			input,
			async (parsed) => {
				// Drive answers 204 with no body, so a resolved promise is the only
				// success signal; a refusal throws inside makeDriveRequest.
				await makeDriveRequest<void>(
					`/files/${encodeURIComponent(parsed.presentationId)}`,
					ctx,
					{ method: 'DELETE', query: { supportsAllDrives: true } },
				);
				// Google confirmed the deletion, so the cached row is stale now.
				await forgetPresentation(ctx, parsed.presentationId);
				return {
					presentationId: parsed.presentationId,
					deleted: true as const,
				};
			},
			(parsed) => ({ presentationId: parsed.presentationId }),
		);

export const PresentationsEndpoints = {
	create: presentationsCreate,
	get: presentationsGet,
	list: presentationsList,
	copy: presentationsCopy,
	exportPdf: presentationsExport,
	delete: presentationsRemove,
};
