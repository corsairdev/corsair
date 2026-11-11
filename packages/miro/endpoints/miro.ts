import { asRecord } from 'corsair/core';
import type { MiroEndpoints } from '..';
import { boardBody, call, deleted, itemBody, segment } from './call';
import {
	MiroEndpointInputSchemas as Inputs,
	MiroEndpointOutputSchemas as Outputs,
} from './types';

// unknown: the resource Miro returns, validated by the output schema.
function body(raw: unknown): unknown {
	return asRecord(raw) ?? {};
}

/**
 * The rows of a list response, renamed to this plugin's field.
 *
 * Miro names the array `data` on every list route, whatever the resource, so
 * the rename happens here instead of leaving each caller to remember it.
 */
// unknown: `rows` is the provider's array, validated by the output schema.
function listOf(raw: unknown, key: string) {
	const record = asRecord(raw) ?? {};
	return {
		[key]: record.data,
		total: record.total,
		size: record.size,
		limit: record.limit,
		offset: record.offset,
		cursor: record.cursor,
		links: record.links,
	};
}

/**
 * Miro returns the resource itself on every create, get and update, with no
 * envelope, so `{ item }` is added here for a consistent shape across the item
 * kinds. Declared in the output schema rather than a transform.
 */
// unknown: `raw` is the provider's item object.
function itemOf(raw: unknown) {
	return { item: body(raw) };
}

const boardPath = (boardId: string) => `/v2/boards/${segment(boardId)}`;

/**
 * The connector style object, or undefined when nothing was set.
 *
 * Miro rejects an empty `style` on an update, so the object is built only when
 * it has at least one field.
 */
function connectorStyle(parsed: {
	strokeColor?: string;
	strokeWidth?: string;
	strokeStyle?: string;
	startStrokeCap?: string;
	endStrokeCap?: string;
}): Record<string, string> | undefined {
	const style: Record<string, string> = {};
	if (parsed.strokeColor) style.strokeColor = parsed.strokeColor;
	if (parsed.strokeWidth) style.strokeWidth = parsed.strokeWidth;
	if (parsed.strokeStyle) style.strokeStyle = parsed.strokeStyle;
	if (parsed.startStrokeCap) style.startStrokeCap = parsed.startStrokeCap;
	if (parsed.endStrokeCap) style.endStrokeCap = parsed.endStrokeCap;
	return Object.keys(style).length > 0 ? style : undefined;
}

/**
 * Connector labels in the wire format. The input takes plain strings; Miro
 * wants each as `{ content }`, and rejects a bare string.
 */
function captionsBody(
	captions: string[] | undefined,
): { content: string }[] | undefined {
	return captions?.map((content) => ({ content }));
}

// ── boards ──────────────────────────────────────────────────────────────────

export const boardsList: MiroEndpoints['boardsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.list',
			input: Inputs.boardsList,
			output: Outputs.boardsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v2/boards',
			query: {
				team_id: parsed.teamId,
				project_id: parsed.projectId,
				query: parsed.query,
				owner: parsed.owner,
				sort: parsed.sort,
				limit: parsed.limit,
				offset: parsed.offset,
			},
		}),
		{
			shape: (raw) => listOf(raw, 'boards'),
			log: (_, result) => ({
				count: result.boards.length,
				total: result.total ?? undefined,
			}),
		},
	);

export const boardsCreate: MiroEndpoints['boardsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.create',
			input: Inputs.boardsCreate,
			output: Outputs.boardsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v2/boards',
			body: boardBody(parsed),
		}),
		{
			shape: (raw) => body(raw),
			log: (_, result) => ({ boardId: result.id }),
		},
	);

export const boardsGet: MiroEndpoints['boardsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.get',
			input: Inputs.boardsGet,
			output: Outputs.boardsGet,
		},
		input,
		(parsed) => ({ method: 'GET', path: boardPath(parsed.boardId) }),
		{
			shape: (raw) => body(raw),
			log: (_, result) => ({ boardId: result.id }),
		},
	);

export const boardsUpdate: MiroEndpoints['boardsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.update',
			input: Inputs.boardsUpdate,
			output: Outputs.boardsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: boardPath(parsed.boardId),
			body: boardBody(parsed),
		}),
		{
			shape: (raw) => body(raw),
			log: (_, result) => ({ boardId: result.id }),
		},
	);

export const boardsRemove: MiroEndpoints['boardsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.remove',
			input: Inputs.boardsRemove,
			output: Outputs.boardsRemove,
		},
		input,
		(parsed) => ({ method: 'DELETE', path: boardPath(parsed.boardId) }),
		{
			// A 204 leaves no body.
			shape: () => deleted,
			log: (parsed) => ({ boardId: parsed.boardId }),
		},
	);

export const boardsCopy: MiroEndpoints['boardsCopy'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'boards.copy',
			input: Inputs.boardsCopy,
			output: Outputs.boardsCopy,
		},
		input,
		(parsed) => ({
			// Copy is a PUT on the collection, and the source board is a required
			// `copy_from` query parameter rather than a body field.
			method: 'PUT',
			path: '/v2/boards',
			query: { copy_from: parsed.boardId },
			body: boardBody(parsed),
		}),
		{
			shape: (raw) => body(raw),
			log: (parsed, result) => ({
				sourceBoardId: parsed.boardId,
				boardId: result.id,
			}),
		},
	);

// ── members ─────────────────────────────────────────────────────────────────

export const membersList: MiroEndpoints['membersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.list',
			input: Inputs.membersList,
			output: Outputs.membersList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${boardPath(parsed.boardId)}/members`,
			query: { limit: parsed.limit, offset: parsed.offset },
		}),
		{
			shape: (raw) => listOf(raw, 'members'),
			log: (_, result) => ({
				count: result.members.length,
				total: result.total ?? undefined,
			}),
		},
	);

export const membersShare: MiroEndpoints['membersShare'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.share',
			input: Inputs.membersShare,
			output: Outputs.membersShare,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `${boardPath(parsed.boardId)}/members`,
			body: {
				emails: parsed.emails,
				role: parsed.role,
				message: parsed.message,
			},
		}),
		{
			shape: (raw) => body(raw),
			log: (parsed, result) => ({
				boardId: parsed.boardId,
				invited: result.successful?.length,
				failed: result.failed?.length,
			}),
		},
	);

export const membersGet: MiroEndpoints['membersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.get',
			input: Inputs.membersGet,
			output: Outputs.membersGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${boardPath(parsed.boardId)}/members/${segment(parsed.memberId)}`,
		}),
		{
			shape: (raw) => body(raw),
			log: (_, result) => ({ memberId: result.id }),
		},
	);

export const membersUpdate: MiroEndpoints['membersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.update',
			input: Inputs.membersUpdate,
			output: Outputs.membersUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `${boardPath(parsed.boardId)}/members/${segment(parsed.memberId)}`,
			body: { role: parsed.role },
		}),
		{
			shape: (raw) => body(raw),
			log: (parsed, result) => ({ memberId: result.id, role: parsed.role }),
		},
	);

export const membersRemove: MiroEndpoints['membersRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'members.remove',
			input: Inputs.membersRemove,
			output: Outputs.membersRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `${boardPath(parsed.boardId)}/members/${segment(parsed.memberId)}`,
		}),
		{ shape: () => deleted, log: (parsed) => ({ memberId: parsed.memberId }) },
	);

// ── items ───────────────────────────────────────────────────────────────────

export const itemsList: MiroEndpoints['itemsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.list',
			input: Inputs.itemsList,
			output: Outputs.itemsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${boardPath(parsed.boardId)}/items`,
			query: {
				type: parsed.type?.[0],
				parent_item_id: parsed.parentItemId,
				limit: parsed.limit,
				cursor: parsed.cursor,
			},
		}),
		{
			shape: (raw) => listOf(raw, 'items'),
			log: (_, result) => ({
				count: result.items.length,
				nextCursor: result.cursor ?? undefined,
			}),
		},
	);

export const itemsGet: MiroEndpoints['itemsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.get',
			input: Inputs.itemsGet,
			output: Outputs.itemsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${boardPath(parsed.boardId)}/items/${segment(parsed.itemId)}`,
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ itemId: parsed.itemId }),
		},
	);

export const itemsRemove: MiroEndpoints['itemsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.remove',
			input: Inputs.itemsRemove,
			output: Outputs.itemsRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `${boardPath(parsed.boardId)}/items/${segment(parsed.itemId)}`,
		}),
		{ shape: () => deleted, log: (parsed) => ({ itemId: parsed.itemId }) },
	);

// ── sticky notes ────────────────────────────────────────────────────────────

export const stickyNotesCreate: MiroEndpoints['stickyNotesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'stickyNotes.create',
			input: Inputs.stickyNotesCreate,
			output: Outputs.stickyNotesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `${boardPath(parsed.boardId)}/sticky_notes`,
			body: itemBody(
				{
					content: parsed.content,
					position: parsed.position,
					geometry: parsed.geometry,
					parentId: parsed.parentId,
					// `shape` sits in data for a sticky, not beside it.
					shape: parsed.shape,
					// The colour is a style field in the wire format; an empty
					// object would be sent as `style: {}` and rejected.
					style: parsed.fillColor ? { fillColor: parsed.fillColor } : undefined,
				},
				{ dataKeys: ['content', 'shape'], includeParent: true },
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (_, result) => ({ itemId: result.item.id }),
		},
	);

export const stickyNotesUpdate: MiroEndpoints['stickyNotesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'stickyNotes.update',
			input: Inputs.stickyNotesUpdate,
			output: Outputs.stickyNotesUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `${boardPath(parsed.boardId)}/sticky_notes/${segment(parsed.itemId)}`,
			body: itemBody(
				{
					content: parsed.content,
					shape: parsed.shape,
					position: parsed.position,
					geometry: parsed.geometry,
					style: parsed.fillColor ? { fillColor: parsed.fillColor } : undefined,
				},
				{ dataKeys: ['content', 'shape'] },
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ itemId: parsed.itemId }),
		},
	);

// ── shapes ──────────────────────────────────────────────────────────────────

export const shapesCreate: MiroEndpoints['shapesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'shapes.create',
			input: Inputs.shapesCreate,
			output: Outputs.shapesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `${boardPath(parsed.boardId)}/shapes`,
			body: itemBody(
				{
					content: parsed.content,
					shape: parsed.shape,
					position: parsed.position,
					geometry: parsed.geometry,
					parentId: parsed.parentId,
					style: parsed.style,
				},
				{ dataKeys: ['content', 'shape'], includeParent: true },
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (_, result) => ({ itemId: result.item.id }),
		},
	);

export const shapesUpdate: MiroEndpoints['shapesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'shapes.update',
			input: Inputs.shapesUpdate,
			output: Outputs.shapesUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `${boardPath(parsed.boardId)}/shapes/${segment(parsed.itemId)}`,
			body: itemBody(
				{
					content: parsed.content,
					position: parsed.position,
					geometry: parsed.geometry,
					style: parsed.style,
				},
				{ dataKeys: ['content'] },
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ itemId: parsed.itemId }),
		},
	);

// ── cards ───────────────────────────────────────────────────────────────────

export const cardsCreate: MiroEndpoints['cardsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cards.create',
			input: Inputs.cardsCreate,
			output: Outputs.cardsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `${boardPath(parsed.boardId)}/cards`,
			body: itemBody(
				{
					title: parsed.title,
					description: parsed.description,
					dueDate: parsed.dueDate,
					assigneeId: parsed.assigneeId,
					position: parsed.position,
					geometry: parsed.geometry,
					parentId: parsed.parentId,
					style: parsed.cardTheme ? { cardTheme: parsed.cardTheme } : undefined,
				},
				{
					dataKeys: ['title', 'description', 'dueDate', 'assigneeId'],
					includeParent: true,
				},
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (_, result) => ({ itemId: result.item.id }),
		},
	);

export const cardsUpdate: MiroEndpoints['cardsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cards.update',
			input: Inputs.cardsUpdate,
			output: Outputs.cardsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `${boardPath(parsed.boardId)}/cards/${segment(parsed.itemId)}`,
			body: itemBody(
				{
					title: parsed.title,
					description: parsed.description,
					dueDate: parsed.dueDate,
					assigneeId: parsed.assigneeId,
					position: parsed.position,
					geometry: parsed.geometry,
					style: parsed.cardTheme ? { cardTheme: parsed.cardTheme } : undefined,
				},
				{ dataKeys: ['title', 'description', 'dueDate', 'assigneeId'] },
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ itemId: parsed.itemId }),
		},
	);

// ── texts ───────────────────────────────────────────────────────────────────

export const textsCreate: MiroEndpoints['textsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'texts.create',
			input: Inputs.textsCreate,
			output: Outputs.textsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `${boardPath(parsed.boardId)}/texts`,
			body: itemBody(
				{
					content: parsed.content,
					position: parsed.position,
					geometry: parsed.geometry,
					parentId: parsed.parentId,
					style: parsed.style,
				},
				{ dataKeys: ['content'], includeParent: true },
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (_, result) => ({ itemId: result.item.id }),
		},
	);

export const textsUpdate: MiroEndpoints['textsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'texts.update',
			input: Inputs.textsUpdate,
			output: Outputs.textsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `${boardPath(parsed.boardId)}/texts/${segment(parsed.itemId)}`,
			body: itemBody(
				{
					content: parsed.content,
					position: parsed.position,
					geometry: parsed.geometry,
					style: parsed.style,
				},
				{ dataKeys: ['content'] },
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ itemId: parsed.itemId }),
		},
	);

// ── frames ──────────────────────────────────────────────────────────────────

export const framesCreate: MiroEndpoints['framesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'frames.create',
			input: Inputs.framesCreate,
			output: Outputs.framesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `${boardPath(parsed.boardId)}/frames`,
			body: {
				// `data` is required on a frame create, even with nothing in it;
				// itemBody leaves it out when no title or showContent was given.
				data: {},
				...itemBody(
					{
						title: parsed.title,
						showContent: parsed.showContent,
						position: parsed.position,
						geometry: parsed.geometry,
					},
					{ dataKeys: ['title', 'showContent'] },
				),
			},
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (_, result) => ({ itemId: result.item.id }),
		},
	);

export const framesUpdate: MiroEndpoints['framesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'frames.update',
			input: Inputs.framesUpdate,
			output: Outputs.framesUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `${boardPath(parsed.boardId)}/frames/${segment(parsed.itemId)}`,
			body: itemBody(
				{
					title: parsed.title,
					showContent: parsed.showContent,
					position: parsed.position,
					geometry: parsed.geometry,
				},
				{ dataKeys: ['title', 'showContent'] },
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ itemId: parsed.itemId }),
		},
	);

// ── embeds ──────────────────────────────────────────────────────────────────

export const embedsCreate: MiroEndpoints['embedsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'embeds.create',
			input: Inputs.embedsCreate,
			output: Outputs.embedsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `${boardPath(parsed.boardId)}/embeds`,
			body: itemBody(
				{
					url: parsed.url,
					mode: parsed.mode,
					position: parsed.position,
					geometry: parsed.geometry,
					parentId: parsed.parentId,
				},
				{ dataKeys: ['url', 'mode'], includeParent: true },
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (_, result) => ({ itemId: result.item.id }),
		},
	);

export const embedsUpdate: MiroEndpoints['embedsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'embeds.update',
			input: Inputs.embedsUpdate,
			output: Outputs.embedsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `${boardPath(parsed.boardId)}/embeds/${segment(parsed.itemId)}`,
			body: itemBody(
				{
					url: parsed.url,
					mode: parsed.mode,
					position: parsed.position,
					geometry: parsed.geometry,
				},
				{ dataKeys: ['url', 'mode'] },
			),
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ itemId: parsed.itemId }),
		},
	);

// ── connectors ──────────────────────────────────────────────────────────────

export const connectorsList: MiroEndpoints['connectorsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'connectors.list',
			input: Inputs.connectorsList,
			output: Outputs.connectorsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${boardPath(parsed.boardId)}/connectors`,
			query: { limit: parsed.limit, cursor: parsed.cursor },
		}),
		{
			shape: (raw) => listOf(raw, 'connectors'),
			log: (_, result) => ({
				count: result.connectors.length,
				nextCursor: result.cursor ?? undefined,
			}),
		},
	);

export const connectorsCreate: MiroEndpoints['connectorsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'connectors.create',
			input: Inputs.connectorsCreate,
			output: Outputs.connectorsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `${boardPath(parsed.boardId)}/connectors`,
			body: {
				startItem: { id: parsed.startItemId },
				endItem: { id: parsed.endItemId },
				shape: parsed.shape,
				style: connectorStyle(parsed),
				captions: captionsBody(parsed.captions),
			},
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (_, result) => ({ connectorId: result.item.id }),
		},
	);

export const connectorsGet: MiroEndpoints['connectorsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'connectors.get',
			input: Inputs.connectorsGet,
			output: Outputs.connectorsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${boardPath(parsed.boardId)}/connectors/${segment(parsed.connectorId)}`,
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ connectorId: parsed.connectorId }),
		},
	);

export const connectorsUpdate: MiroEndpoints['connectorsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'connectors.update',
			input: Inputs.connectorsUpdate,
			output: Outputs.connectorsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `${boardPath(parsed.boardId)}/connectors/${segment(parsed.connectorId)}`,
			body: {
				shape: parsed.shape,
				style: connectorStyle(parsed),
				captions: captionsBody(parsed.captions),
			},
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ connectorId: parsed.connectorId }),
		},
	);

export const connectorsRemove: MiroEndpoints['connectorsRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'connectors.remove',
			input: Inputs.connectorsRemove,
			output: Outputs.connectorsRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `${boardPath(parsed.boardId)}/connectors/${segment(parsed.connectorId)}`,
		}),
		{
			shape: () => deleted,
			log: (parsed) => ({ connectorId: parsed.connectorId }),
		},
	);

// ── tags ────────────────────────────────────────────────────────────────────

export const tagsList: MiroEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.list',
			input: Inputs.tagsList,
			output: Outputs.tagsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${boardPath(parsed.boardId)}/tags`,
			query: { limit: parsed.limit, offset: parsed.offset },
		}),
		{
			shape: (raw) => listOf(raw, 'tags'),
			log: (_, result) => ({
				count: result.tags.length,
				total: result.total ?? undefined,
			}),
		},
	);

export const tagsCreate: MiroEndpoints['tagsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.create',
			input: Inputs.tagsCreate,
			output: Outputs.tagsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `${boardPath(parsed.boardId)}/tags`,
			body: { title: parsed.title, fillColor: parsed.fillColor },
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (_, result) => ({ tagId: result.item.id }),
		},
	);

export const tagsGet: MiroEndpoints['tagsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.get',
			input: Inputs.tagsGet,
			output: Outputs.tagsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${boardPath(parsed.boardId)}/tags/${segment(parsed.tagId)}`,
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ tagId: parsed.tagId }),
		},
	);

export const tagsUpdate: MiroEndpoints['tagsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.update',
			input: Inputs.tagsUpdate,
			output: Outputs.tagsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `${boardPath(parsed.boardId)}/tags/${segment(parsed.tagId)}`,
			body: { title: parsed.title, fillColor: parsed.fillColor },
		}),
		{
			shape: (raw) => itemOf(raw),
			log: (parsed) => ({ tagId: parsed.tagId }),
		},
	);

export const tagsRemove: MiroEndpoints['tagsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.remove',
			input: Inputs.tagsRemove,
			output: Outputs.tagsRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `${boardPath(parsed.boardId)}/tags/${segment(parsed.tagId)}`,
		}),
		{ shape: () => deleted, log: (parsed) => ({ tagId: parsed.tagId }) },
	);

export const tagsAttach: MiroEndpoints['tagsAttach'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.attach',
			input: Inputs.tagsAttach,
			output: Outputs.tagsAttach,
		},
		input,
		(parsed) => ({
			// The tag id travels in the query on this route, not the path.
			method: 'POST',
			path: `${boardPath(parsed.boardId)}/items/${segment(parsed.itemId)}`,
			query: { tag_id: parsed.tagId },
		}),
		{
			shape: () => deleted,
			log: (parsed) => ({ itemId: parsed.itemId, tagId: parsed.tagId }),
		},
	);

export const tagsRemoveFromItem: MiroEndpoints['tagsRemoveFromItem'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tags.removeFromItem',
			input: Inputs.tagsRemoveFromItem,
			output: Outputs.tagsRemoveFromItem,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `${boardPath(parsed.boardId)}/items/${segment(parsed.itemId)}`,
			query: { tag_id: parsed.tagId },
		}),
		{
			shape: () => deleted,
			log: (parsed) => ({ itemId: parsed.itemId, tagId: parsed.tagId }),
		},
	);

export const tagsOfItem: MiroEndpoints['tagsOfItem'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.ofItem',
			input: Inputs.tagsOfItem,
			output: Outputs.tagsOfItem,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${boardPath(parsed.boardId)}/items/${segment(parsed.itemId)}/tags`,
		}),
		{
			// This route keys its rows `tags` rather than `data`.
			shape: (raw) => {
				const record = asRecord(raw) ?? {};
				return {
					tags: record.tags,
					size: record.size,
					limit: record.limit,
					links: record.links,
				};
			},
			log: (_, result) => ({ count: result.tags.length }),
		},
	);

export const itemsByTag: MiroEndpoints['itemsByTag'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.items',
			input: Inputs.itemsByTag,
			output: Outputs.itemsByTag,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${boardPath(parsed.boardId)}/items`,
			query: {
				tag_id: parsed.tagId,
				limit: parsed.limit,
				offset: parsed.offset,
			},
		}),
		{
			shape: (raw) => listOf(raw, 'items'),
			log: (_, result) => ({
				count: result.items.length,
				total: result.total ?? undefined,
			}),
		},
	);
