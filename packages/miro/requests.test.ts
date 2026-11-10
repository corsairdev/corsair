import { logEventFromContext } from 'corsair/core';
import {
	boardsCopy,
	boardsCreate,
	boardsGet,
	boardsList,
	boardsRemove,
	boardsUpdate,
	cardsCreate,
	cardsUpdate,
	connectorsCreate,
	connectorsGet,
	connectorsList,
	connectorsRemove,
	connectorsUpdate,
	embedsCreate,
	embedsUpdate,
	framesCreate,
	framesUpdate,
	itemsByTag,
	itemsGet,
	itemsList,
	itemsRemove,
	membersGet,
	membersList,
	membersRemove,
	membersShare,
	membersUpdate,
	shapesCreate,
	shapesUpdate,
	stickyNotesCreate,
	stickyNotesUpdate,
	tagsAttach,
	tagsCreate,
	tagsGet,
	tagsList,
	tagsOfItem,
	tagsRemove,
	tagsRemoveFromItem,
	tagsUpdate,
	textsCreate,
	textsUpdate,
} from './endpoints';
import {
	board,
	boardsListResponse,
	card,
	connector,
	connectorsListResponse,
	embed,
	frame,
	invitationResult,
	itemsByTagResponse,
	itemsListResponse,
	itemTagsResponse,
	member,
	membersListResponse,
	shape,
	stickyNote,
	tag,
	tagsListResponse,
	textItem,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'miro-test-token';
const BOARD = 'uXjVK1abcd=';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: each endpoint returns its own type.

// Safe: the fake context carries only ctx.key, which is all any endpoint reads.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// unknown: negative cases pass invalid values.
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated(method: string) {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.miro.com');
	expect(sent.method).toBe(method);
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('boards', () => {
	it('lists boards and renames data to boards', async () => {
		respond(boardsListResponse);

		const result = (await invoke(boardsList, { limit: 20 })) as {
			boards: { id: string; name?: string | null }[];
			total: number;
		};

		expectAuthenticated('GET');
		expect(lastRequest().path).toBe('/v2/boards');
		expect(lastRequest().query).toEqual({ limit: '20' });
		expect(result.boards).toHaveLength(1);
		expect(result.boards[0]?.name).toBe('Product roadmap');
		expect(result.total).toBe(1);
	});

	it('sends the filters under Miro snake_case names', async () => {
		respond(boardsListResponse);

		await invoke(boardsList, {
			teamId: 'team-1',
			projectId: 'proj-1',
			query: 'roadmap',
			owner: 'user-1',
			sort: 'last_modified',
			limit: 10,
			offset: 20,
		});

		expect(lastRequest().query).toEqual({
			team_id: 'team-1',
			project_id: 'proj-1',
			query: 'roadmap',
			owner: 'user-1',
			sort: 'last_modified',
			limit: '10',
			offset: '20',
		});
	});

	it('creates a board and sends only what was set', async () => {
		respond(board, 201);

		const result = (await invoke(boardsCreate, {
			name: 'Product roadmap',
			description: 'Q1 planning',
		})) as {
			id: string;
			currentUserMembership?: { role?: string | null } | null;
		};

		expectAuthenticated('POST');
		expect(lastRequest().path).toBe('/v2/boards');
		expect(lastRequest().body).toEqual({
			name: 'Product roadmap',
			description: 'Q1 planning',
		});
		expect(result.id).toBe(BOARD);
	});

	it('sends a sharing policy with the board', async () => {
		respond(board, 201);

		await invoke(boardsCreate, {
			name: 'Private',
			policy: { sharingPolicy: { access: 'private' } },
		});

		expect(lastRequest().body).toMatchObject({
			policy: { sharingPolicy: { access: 'private' } },
		});
	});

	it.each(['anyone', 'team_members', 'team_editors', 'board_owner'])(
		'accepts the documented copyAccess %s',
		async (copyAccess) => {
			respond(board, 201);

			await invoke(boardsCreate, {
				policy: { permissionsPolicy: { copyAccess } },
			});

			expect(lastRequest().body).toEqual({
				policy: { permissionsPolicy: { copyAccess } },
			});
		},
	);

	it.each(['everyone', 'board_members'])(
		'rejects %s, which is not a copyAccess value Miro lists',
		async (copyAccess) => {
			await expect(
				invoke(boardsCreate, {
					policy: { permissionsPolicy: { copyAccess } },
				}),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('rejects a name longer than 60 characters', async () => {
		await expect(
			invoke(boardsCreate, { name: 'x'.repeat(61) }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a description longer than 300 characters', async () => {
		await expect(
			invoke(boardsCreate, { description: 'x'.repeat(301) }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts the 60 and 300 character boundaries', async () => {
		respond(board, 201);

		await invoke(boardsCreate, {
			name: 'x'.repeat(60),
			description: 'y'.repeat(300),
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('reads a board whose policy holds values the input does not list', async () => {
		respond({
			...board,
			policy: {
				permissionsPolicy: { copyAccess: 'a_later_value' },
				sharingPolicy: {
					access: 'a_later_value',
					inviteToAccountAndBoardLinkAccess: 'guest',
				},
			},
		});

		const result = (await invoke(boardsGet, { boardId: BOARD })) as {
			policy?: { permissionsPolicy?: { copyAccess?: string | null } | null };
		};

		expect(result.policy?.permissionsPolicy?.copyAccess).toBe('a_later_value');
	});

	it('gets one board and encodes the id in the path', async () => {
		respond(board);

		const result = (await invoke(boardsGet, { boardId: BOARD })) as {
			id: string;
		};

		expect(lastRequest().path).toBe(`/v2/boards/${encodeURIComponent(BOARD)}`);
		expect(result.id).toBe(BOARD);
	});

	it('updates with PATCH and the fields given', async () => {
		respond(board);

		await invoke(boardsUpdate, { boardId: BOARD, name: 'Renamed' });

		expectAuthenticated('PATCH');
		expect(lastRequest().body).toEqual({ name: 'Renamed' });
	});

	it('rejects an update that changes nothing', async () => {
		await expect(invoke(boardsUpdate, { boardId: BOARD })).rejects.toThrow(
			/at least one/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes a board and reports success on a 204', async () => {
		respond(undefined, 204);

		const result = (await invoke(boardsRemove, { boardId: BOARD })) as {
			success: boolean;
		};

		expectAuthenticated('DELETE');
		expect(result.success).toBe(true);
	});

	it('copies a board with copy_from as a query parameter', async () => {
		respond(board, 201);

		await invoke(boardsCopy, { boardId: BOARD, name: 'Copy of roadmap' });

		expectAuthenticated('PUT');
		expect(lastRequest().path).toBe('/v2/boards');
		// The spec makes copy_from a required query parameter, not a body field.
		expect(lastRequest().query).toEqual({ copy_from: BOARD });
		expect(lastRequest().body).not.toHaveProperty('copy_from');
		expect(lastRequest().body).toEqual({ name: 'Copy of roadmap' });
	});
});

describe('members', () => {
	it('lists members with offset paging', async () => {
		respond(membersListResponse);

		const result = (await invoke(membersList, {
			boardId: BOARD,
			limit: 20,
			offset: 0,
		})) as { members: { role?: string | null }[]; total: number };

		expect(lastRequest().path).toBe(
			`/v2/boards/${encodeURIComponent(BOARD)}/members`,
		);
		expect(lastRequest().query).toEqual({ limit: '20', offset: '0' });
		expect(result.members[0]?.role).toBe('editor');
	});

	it('shares a board with emails and a role', async () => {
		respond(invitationResult);

		const result = (await invoke(membersShare, {
			boardId: BOARD,
			emails: ['new@acme.com'],
			role: 'viewer',
		})) as {
			successful?: (string | number)[] | null;
			failed?: { email?: string | null; reason?: string | null }[] | null;
		};

		expectAuthenticated('POST');
		expect(lastRequest().body).toEqual({
			emails: ['new@acme.com'],
			role: 'viewer',
		});
		expect(result.successful).toHaveLength(1);
		expect(result.failed?.[0]).toEqual({
			email: 'gone@acme.com',
			reason: 'INVITATION_FAILED',
		});
	});

	it('logs how many invitations were sent and how many failed', async () => {
		respond(invitationResult);

		await invoke(membersShare, {
			boardId: BOARD,
			emails: ['new@acme.com', 'gone@acme.com'],
		});

		// Counts only: the addresses themselves stay out of the log.
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'miro.members.share',
			{ boardId: BOARD, invited: 1, failed: 1 },
			'completed',
		);
	});

	it('rejects more than the 20 addresses Miro takes per call', async () => {
		const emails = Array.from({ length: 21 }, (_, i) => `p${i}@acme.com`);

		await expect(
			invoke(membersShare, { boardId: BOARD, emails }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an invalid email before sending', async () => {
		await expect(
			invoke(membersShare, { boardId: BOARD, emails: ['not-an-email'] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a role outside the documented enum', async () => {
		await expect(
			invoke(membersShare, {
				boardId: BOARD,
				emails: ['a@b.co'],
				role: 'admin',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets a member by its board-member id', async () => {
		respond(member);

		const result = (await invoke(membersGet, {
			boardId: BOARD,
			memberId: '3074457345618258603',
		})) as { id: string };

		expect(lastRequest().path).toContain('/members/3074457345618258603');
		expect(result.id).toBe('3074457345618258603');
	});

	it('updates a member role', async () => {
		respond(member);

		await invoke(membersUpdate, {
			boardId: BOARD,
			memberId: 'm-1',
			role: 'commenter',
		});

		expect(lastRequest().method).toBe('PATCH');
		expect(lastRequest().body).toEqual({ role: 'commenter' });
	});

	it('removes a member', async () => {
		respond(undefined, 204);

		const result = (await invoke(membersRemove, {
			boardId: BOARD,
			memberId: 'm-1',
		})) as { success: boolean };

		expect(lastRequest().method).toBe('DELETE');
		expect(result.success).toBe(true);
	});
});

describe('items', () => {
	it('lists items and returns the cursor for the next page', async () => {
		respond(itemsListResponse);

		const result = (await invoke(itemsList, {
			boardId: BOARD,
			limit: 10,
		})) as {
			items: { id: string; type?: string | null }[];
			cursor?: string | null;
		};

		expect(lastRequest().path).toBe(
			`/v2/boards/${encodeURIComponent(BOARD)}/items`,
		);
		expect(result.items).toHaveLength(3);
		expect(result.cursor).toBe('next-cursor-token');
	});

	it('sends one type and the parent item as Miro names them', async () => {
		respond(itemsListResponse);

		await invoke(itemsList, {
			boardId: BOARD,
			type: ['sticky_note'],
			parentItemId: 'frame-1',
		});

		expect(lastRequest().query).toEqual({
			type: 'sticky_note',
			parent_item_id: 'frame-1',
		});
	});

	it.each(['doc_format', 'data_table_format'])(
		'filters on the documented type %s',
		async (type) => {
			respond(itemsListResponse);

			await invoke(itemsList, { boardId: BOARD, type: [type] });

			expect(lastRequest().query).toEqual({ type });
		},
	);

	it('rejects connector as an item type, which the items route does not list', async () => {
		await expect(
			invoke(itemsList, { boardId: BOARD, type: ['connector'] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects two item types, which the API cannot filter on', async () => {
		await expect(
			invoke(itemsList, {
				boardId: BOARD,
				type: ['sticky_note', 'shape'],
			}),
		).rejects.toThrow(/one item type/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets one item', async () => {
		respond(stickyNote);

		const result = (await invoke(itemsGet, {
			boardId: BOARD,
			itemId: 'i-1',
		})) as { item: { id: string } };

		expect(lastRequest().path).toContain('/items/i-1');
		expect(result.item.id).toBe(stickyNote.id);
	});

	it('deletes any item', async () => {
		respond(undefined, 204);

		await invoke(itemsRemove, { boardId: BOARD, itemId: 'i-1' });

		expect(lastRequest().method).toBe('DELETE');
		expect(lastRequest().path).toContain('/items/i-1');
	});
});

describe('stickyNotes', () => {
	it('nests content and shape under data, and the colour under style', async () => {
		respond(stickyNote, 201);

		const result = (await invoke(stickyNotesCreate, {
			boardId: BOARD,
			content: 'Ship the roadmap',
			shape: 'square',
			fillColor: 'light_yellow',
			position: { x: 100, y: 200 },
			geometry: { width: 180, height: 180 },
		})) as { item: { id: string; data?: { content?: string | null } | null } };

		expect(lastRequest().path).toBe(
			`/v2/boards/${encodeURIComponent(BOARD)}/sticky_notes`,
		);
		// `content` and `shape` live in data, `fillColor` in style.
		expect(lastRequest().body).toEqual({
			data: { content: 'Ship the roadmap', shape: 'square' },
			position: { x: 100, y: 200 },
			geometry: { width: 180, height: 180 },
			style: { fillColor: 'light_yellow' },
		});
		expect(result.item.data?.content).toBe('Ship the roadmap');
	});

	it('reads a sticky colour outside the list it accepts as input', async () => {
		respond({ ...stickyNote, style: { fillColor: 'teal' } }, 201);

		const result = (await invoke(stickyNotesCreate, { boardId: BOARD })) as {
			item: { style?: { fillColor?: string | null } | null };
		};

		expect(result.item.style?.fillColor).toBe('teal');
	});

	it('sends the parent as { id }', async () => {
		respond(stickyNote, 201);

		await invoke(stickyNotesCreate, { boardId: BOARD, parentId: 'frame-1' });

		expect(lastRequest().body).toMatchObject({ parent: { id: 'frame-1' } });
		expect(lastRequest().body).not.toHaveProperty('parentId');
	});

	it('rejects a colour outside the documented palette', async () => {
		await expect(
			invoke(stickyNotesCreate, { boardId: BOARD, fillColor: 'chartreuse' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each(['dark_violet', 'dark_red', 'light_gray'])(
		'rejects the sticky colour %s, which Miro does not list',
		async (fillColor) => {
			await expect(
				invoke(stickyNotesCreate, { boardId: BOARD, fillColor }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('rejects a shape outside square and rectangle', async () => {
		await expect(
			invoke(stickyNotesCreate, { boardId: BOARD, shape: 'circle' }),
		).rejects.toThrow();
	});

	it('updates with PATCH', async () => {
		respond(stickyNote);

		await invoke(stickyNotesUpdate, {
			boardId: BOARD,
			itemId: 'i-1',
			content: 'New text',
		});

		expect(lastRequest().method).toBe('PATCH');
		expect(lastRequest().body).toEqual({ data: { content: 'New text' } });
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			invoke(stickyNotesUpdate, { boardId: BOARD, itemId: 'i-1' }),
		).rejects.toThrow(/at least one/);
	});
});

describe('shapes', () => {
	it('creates a shape with text and style', async () => {
		respond(shape, 201);

		const result = (await invoke(shapesCreate, {
			boardId: BOARD,
			shape: 'rectangle',
			content: 'Design',
			style: { fillColor: '#ffffff', borderWidth: 2 },
		})) as { item: { id: string } };

		// Miro types sizes and opacities as strings, so numbers are sent as text.
		expect(lastRequest().body).toEqual({
			data: { content: 'Design', shape: 'rectangle' },
			style: { fillColor: '#ffffff', borderWidth: '2' },
		});
		expect(result.item.id).toBe(shape.id);
	});

	it('reads a shape style whose sizes and opacities are strings', async () => {
		respond(shape, 201);

		const result = (await invoke(shapesCreate, { boardId: BOARD })) as {
			item: { style?: { borderWidth?: string | number | null } | null };
		};

		expect(result.item.style?.borderWidth).toBe('2.0');
	});

	it('reads a style value Miro adds later instead of failing the call', async () => {
		// The write has already happened, so an unknown value must not throw.
		respond({
			...shape,
			style: { ...shape.style, textAlign: 'unknown', borderStyle: 'wavy' },
		});

		await expect(
			invoke(shapesUpdate, { boardId: BOARD, itemId: 'i-1', content: 'x' }),
		).resolves.toBeDefined();
	});

	it.each([
		'cloud',
		'cross',
		'can',
		'right_arrow',
		'left_arrow',
		'left_right_arrow',
		'left_brace',
		'right_brace',
	])('accepts the documented shape %s', async (name) => {
		respond(shape, 201);

		await invoke(shapesCreate, { boardId: BOARD, shape: name });

		expect(lastRequest().body).toEqual({ data: { shape: name } });
	});

	it('rejects a shape name Miro does not list', async () => {
		await expect(
			invoke(shapesCreate, { boardId: BOARD, shape: 'dodecahedron' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an opacity outside 0 to 1', async () => {
		await expect(
			invoke(shapesCreate, {
				boardId: BOARD,
				style: { fillOpacity: 1.5 },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates a shape', async () => {
		respond(shape);

		await invoke(shapesUpdate, {
			boardId: BOARD,
			itemId: 'i-1',
			content: 'Renamed',
		});

		expect(lastRequest().method).toBe('PATCH');
		expect(lastRequest().body).toEqual({ data: { content: 'Renamed' } });
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			invoke(shapesUpdate, { boardId: BOARD, itemId: 'i-1' }),
		).rejects.toThrow(/at least one/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('never sends an empty style object', async () => {
		// Miro rejects `style: {}`, so it is dropped rather than sent.
		respond(shape);

		await invoke(shapesUpdate, {
			boardId: BOARD,
			itemId: 'i-1',
			content: 'Renamed',
			style: {},
		});

		expect(lastRequest().body).toEqual({ data: { content: 'Renamed' } });
		expect(lastRequest().body).not.toHaveProperty('style');
	});

	it('rejects a style-only update whose style is empty', async () => {
		// An empty style is not a change, so the call would do nothing.
		await expect(
			invoke(shapesUpdate, { boardId: BOARD, itemId: 'i-1', style: {} }),
		).rejects.toThrow(/at least one/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('cards', () => {
	it('creates a card with its due date and assignee', async () => {
		respond(card, 201);

		await invoke(cardsCreate, {
			boardId: BOARD,
			title: 'Review designs',
			description: 'Before Friday',
			dueDate: '2026-12-01T00:00:00Z',
			assigneeId: '3074457345618258602',
		});

		expect(lastRequest().path).toBe(
			`/v2/boards/${encodeURIComponent(BOARD)}/cards`,
		);
		expect(lastRequest().body).toEqual({
			data: {
				title: 'Review designs',
				description: 'Before Friday',
				dueDate: '2026-12-01T00:00:00Z',
				assigneeId: '3074457345618258602',
			},
		});
	});

	it('sends the card theme under style', async () => {
		respond(card, 201);

		await invoke(cardsCreate, { boardId: BOARD, cardTheme: '#2d9bf0' });

		expect(lastRequest().body).toMatchObject({
			style: { cardTheme: '#2d9bf0' },
		});
	});

	it('updates a card', async () => {
		respond(card);

		await invoke(cardsUpdate, { boardId: BOARD, itemId: 'i-1', title: 'Done' });

		expect(lastRequest().method).toBe('PATCH');
		expect(lastRequest().body).toEqual({ data: { title: 'Done' } });
	});

	it('rejects an update that changes nothing', async () => {
		await expect(
			invoke(cardsUpdate, { boardId: BOARD, itemId: 'i-1' }),
		).rejects.toThrow(/at least one/);
	});
});

describe('texts', () => {
	it('requires content, as the spec marks it required', async () => {
		await expect(invoke(textsCreate, { boardId: BOARD })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates a text item', async () => {
		respond(textItem, 201);

		await invoke(textsCreate, { boardId: BOARD, content: 'Sprint 12' });

		expect(lastRequest().body).toEqual({ data: { content: 'Sprint 12' } });
	});

	it('sends the font size as text and reads it back as Miro returns it', async () => {
		respond(textItem, 201);

		const result = (await invoke(textsCreate, {
			boardId: BOARD,
			content: 'Sprint 12',
			style: { fontSize: 24 },
		})) as { item: { style?: { fontSize?: string | number | null } | null } };

		expect(lastRequest().body).toEqual({
			data: { content: 'Sprint 12' },
			style: { fontSize: '24' },
		});
		expect(result.item.style?.fontSize).toBe('24');
	});

	it('updates a text item', async () => {
		respond(textItem);

		await invoke(textsUpdate, {
			boardId: BOARD,
			itemId: 'i-1',
			content: 'Sprint 13',
		});

		expect(lastRequest().body).toEqual({ data: { content: 'Sprint 13' } });
	});
});

describe('frames', () => {
	it('creates a frame with its title and no parent', async () => {
		respond(frame, 201);

		await invoke(framesCreate, {
			boardId: BOARD,
			title: 'Discovery',
			showContent: true,
		});

		expect(lastRequest().path).toBe(
			`/v2/boards/${encodeURIComponent(BOARD)}/frames`,
		);
		// Frames sit at the top level, so the create input has no parentId.
		expect(lastRequest().body).toEqual({
			data: { title: 'Discovery', showContent: true },
		});
	});

	it('sends an empty data object for a frame with no title', async () => {
		// The reference marks `data` required on a frame create.
		respond(frame, 201);

		await invoke(framesCreate, {
			boardId: BOARD,
			geometry: { width: 800, height: 600 },
		});

		expect(lastRequest().body).toEqual({
			data: {},
			geometry: { width: 800, height: 600 },
		});
	});

	it('updates a frame', async () => {
		respond(frame);

		await invoke(framesUpdate, {
			boardId: BOARD,
			itemId: 'i-1',
			title: 'Build',
		});

		expect(lastRequest().body).toEqual({ data: { title: 'Build' } });
	});
});

describe('embeds', () => {
	it('requires a valid URL', async () => {
		await expect(
			invoke(embedsCreate, { boardId: BOARD, url: 'not-a-url' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('creates an embed', async () => {
		respond(embed, 201);

		await invoke(embedsCreate, {
			boardId: BOARD,
			url: 'https://www.youtube.com/watch?v=abc',
			mode: 'inline',
		});

		expect(lastRequest().body).toEqual({
			data: { url: 'https://www.youtube.com/watch?v=abc', mode: 'inline' },
		});
	});

	it('updates an embed', async () => {
		respond(embed);

		await invoke(embedsUpdate, {
			boardId: BOARD,
			itemId: 'i-1',
			mode: 'modal',
		});

		expect(lastRequest().body).toEqual({ data: { mode: 'modal' } });
	});
});

describe('connectors', () => {
	it('lists connectors', async () => {
		respond(connectorsListResponse);

		const result = (await invoke(connectorsList, { boardId: BOARD })) as {
			connectors: { id: string }[];
		};

		expect(lastRequest().path).toBe(
			`/v2/boards/${encodeURIComponent(BOARD)}/connectors`,
		);
		expect(result.connectors[0]?.id).toBe(connector.id);
	});

	it('creates a connector from the two item ids', async () => {
		respond(connector, 201);

		await invoke(connectorsCreate, {
			boardId: BOARD,
			startItemId: '3458764513820541002',
			endItemId: '3458764513820541003',
			shape: 'curved',
			strokeColor: '#4262ff',
			captions: ['depends on'],
		});

		// The wire format nests each endpoint under startItem and endItem.
		expect(lastRequest().body).toEqual({
			startItem: { id: '3458764513820541002' },
			endItem: { id: '3458764513820541003' },
			shape: 'curved',
			style: { strokeColor: '#4262ff' },
			// Miro takes each caption as an object; the flat strings are wrapped.
			captions: [{ content: 'depends on' }],
		});
	});

	it('reads captions as the objects Miro returns', async () => {
		respond(connector);

		const result = (await invoke(connectorsGet, {
			boardId: BOARD,
			connectorId: connector.id,
		})) as { item: { captions?: { content?: string | null }[] | null } };

		expect(result.item.captions?.[0]?.content).toBe('depends on');
	});

	it('rejects a caption over 200 characters and more than 20 captions', async () => {
		const base = { boardId: BOARD, startItemId: 'a', endItemId: 'b' };

		await expect(
			invoke(connectorsCreate, { ...base, captions: ['x'.repeat(201)] }),
		).rejects.toThrow();
		await expect(
			invoke(connectorsCreate, { ...base, captions: Array(21).fill('x') }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires both endpoints', async () => {
		await expect(
			invoke(connectorsCreate, { boardId: BOARD, startItemId: 'a' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a connector shape outside the enum', async () => {
		await expect(
			invoke(connectorsCreate, {
				boardId: BOARD,
				startItemId: 'a',
				endItemId: 'b',
				shape: 'zigzag',
			}),
		).rejects.toThrow();
	});

	it('accepts the elbowed spelling the spec lists', async () => {
		respond(connector, 201);

		await invoke(connectorsCreate, {
			boardId: BOARD,
			startItemId: 'a',
			endItemId: 'b',
			shape: 'elbowed',
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('gets a connector', async () => {
		respond(connector);

		const result = (await invoke(connectorsGet, {
			boardId: BOARD,
			connectorId: 'c-1',
		})) as { item: { id: string } };

		expect(lastRequest().path).toContain('/connectors/c-1');
		expect(result.item.id).toBe(connector.id);
	});

	it('updates a connector with only the style fields given', async () => {
		respond(connector);

		await invoke(connectorsUpdate, {
			boardId: BOARD,
			connectorId: 'c-1',
			strokeWidth: '3.0',
		});

		expect(lastRequest().method).toBe('PATCH');
		expect(lastRequest().body).toEqual({ style: { strokeWidth: '3.0' } });
	});

	it('sends no style object on a connector update that sets none', async () => {
		// Miro rejects an empty style object.
		respond(connector);

		await invoke(connectorsUpdate, {
			boardId: BOARD,
			connectorId: 'c-1',
			captions: ['renamed'],
		});

		expect(lastRequest().body).toEqual({ captions: [{ content: 'renamed' }] });
		expect(lastRequest().body).not.toHaveProperty('style');
	});

	it('removes a connector', async () => {
		respond(undefined, 204);

		await invoke(connectorsRemove, { boardId: BOARD, connectorId: 'c-1' });

		expect(lastRequest().method).toBe('DELETE');
	});
});

describe('tags', () => {
	it('lists tags with offset paging', async () => {
		respond(tagsListResponse);

		const result = (await invoke(tagsList, { boardId: BOARD })) as {
			tags: { title?: string | null }[];
		};

		expect(lastRequest().path).toBe(
			`/v2/boards/${encodeURIComponent(BOARD)}/tags`,
		);
		expect(result.tags[0]?.title).toBe('priority');
	});

	it('creates a tag', async () => {
		respond(tag, 201);

		await invoke(tagsCreate, {
			boardId: BOARD,
			title: 'priority',
			fillColor: 'red',
		});

		expect(lastRequest().body).toEqual({ title: 'priority', fillColor: 'red' });
	});

	it.each([
		'light_blue',
		'light_yellow',
		'light_red',
		'light_magenta',
		'dark_red',
	])(
		'rejects the tag colour %s, which Miro does not list',
		async (fillColor) => {
			await expect(
				invoke(tagsCreate, { boardId: BOARD, title: 'priority', fillColor }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('rejects a title over 120 characters', async () => {
		await expect(
			invoke(tagsCreate, { boardId: BOARD, title: 'x'.repeat(121) }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('gets a tag', async () => {
		respond(tag);

		const result = (await invoke(tagsGet, {
			boardId: BOARD,
			tagId: 't-1',
		})) as { item: { id: string } };

		expect(lastRequest().path).toContain('/tags/t-1');
		expect(result.item.id).toBe(tag.id);
	});

	it('updates a tag', async () => {
		respond(tag);

		await invoke(tagsUpdate, { boardId: BOARD, tagId: 't-1', title: 'urgent' });

		expect(lastRequest().method).toBe('PATCH');
		expect(lastRequest().body).toEqual({ title: 'urgent' });
	});

	it('accepts clearing a connector captions to an empty list', async () => {
		// An empty array is a real edit: it removes the labels. Only an empty
		// object is treated as no change.
		respond(connector);

		await invoke(connectorsUpdate, {
			boardId: BOARD,
			connectorId: 'c-1',
			captions: [],
		});

		expect(lastRequest().body).toEqual({ captions: [] });
	});

	it('rejects a tag update that changes nothing', async () => {
		await expect(
			invoke(tagsUpdate, { boardId: BOARD, tagId: 't-1' }),
		).rejects.toThrow(/at least one/);
	});

	it('removes a tag', async () => {
		respond(undefined, 204);

		await invoke(tagsRemove, { boardId: BOARD, tagId: 't-1' });

		expect(lastRequest().method).toBe('DELETE');
	});

	it('attaches a tag with tag_id in the query on the item path', async () => {
		respond(undefined, 204);

		const result = (await invoke(tagsAttach, {
			boardId: BOARD,
			itemId: 'i-1',
			tagId: 't-1',
		})) as { success: boolean };

		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().path).toBe(
			`/v2/boards/${encodeURIComponent(BOARD)}/items/i-1`,
		);
		expect(lastRequest().query).toEqual({ tag_id: 't-1' });
		expect(result.success).toBe(true);
	});

	it('removes a tag from an item with the same addressing', async () => {
		respond(undefined, 204);

		await invoke(tagsRemoveFromItem, {
			boardId: BOARD,
			itemId: 'i-1',
			tagId: 't-1',
		});

		expect(lastRequest().method).toBe('DELETE');
		expect(lastRequest().query).toEqual({ tag_id: 't-1' });
	});

	it('reads the tags of an item, which key their rows `tags`', async () => {
		respond(itemTagsResponse);

		const result = (await invoke(tagsOfItem, {
			boardId: BOARD,
			itemId: 'i-1',
		})) as { tags: { id: string }[] };

		expect(lastRequest().path).toContain('/items/i-1/tags');
		expect(result.tags).toHaveLength(1);
	});

	it('lists items by tag', async () => {
		respond(itemsByTagResponse);

		const result = (await invoke(itemsByTag, {
			boardId: BOARD,
			tagId: 't-1',
		})) as { items: { id: string }[]; total: number };

		expect(lastRequest().path).toBe(
			`/v2/boards/${encodeURIComponent(BOARD)}/items`,
		);
		expect(lastRequest().query).toEqual({ tag_id: 't-1' });
		expect(result.items).toHaveLength(1);
	});
});

describe('logging', () => {
	it('logs the board id and never the board content', async () => {
		respond(board, 201);

		await invoke(boardsCreate, {
			name: 'Confidential roadmap',
			description: 'secret',
		});

		const [, event, fields] = mockLog.mock.calls.at(-1) ?? [];
		expect(event).toBe('miro.boards.create');
		// A board name can be sensitive, so only the id is logged.
		expect(JSON.stringify(fields)).not.toContain('Confidential');
		expect(fields).toMatchObject({ boardId: BOARD });
	});

	it('logs the cursor so a caller can page', async () => {
		respond(itemsListResponse);

		await invoke(itemsList, { boardId: BOARD });

		const [, event, fields] = mockLog.mock.calls.at(-1) ?? [];
		expect(event).toBe('miro.items.list');
		expect(fields).toMatchObject({ count: 3, nextCursor: 'next-cursor-token' });
	});
});
