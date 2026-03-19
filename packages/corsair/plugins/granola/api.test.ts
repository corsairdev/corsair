import dotenv from 'dotenv';
import { makeGranolaRequest } from './client';
import type {
	NotesGetResponse,
	NotesListResponse,
	NotesCreateResponse,
	NotesUpdateResponse,
	NotesDeleteResponse,
	PeopleGetResponse,
	PeopleListResponse,
	PeopleCreateResponse,
	PeopleUpdateResponse,
	TranscriptsGetResponse,
} from './endpoints/types';
import { GranolaEndpointOutputSchemas } from './endpoints/types';

dotenv.config();

const TEST_API_KEY = process.env.GRANOLA_API_KEY!;

describe('Granola API Type Tests', () => {
	describe('notes', () => {
		it('notesList returns correct type', async () => {
			const response = await makeGranolaRequest<NotesListResponse>(
				'v1/notes',
				TEST_API_KEY,
				{ query: { limit: 10 } },
			);

			GranolaEndpointOutputSchemas.notesList.parse(response);
		});

		it('notesGet returns correct type', async () => {
			const listResponse = await makeGranolaRequest<NotesListResponse>(
				'v1/notes',
				TEST_API_KEY,
				{ query: { limit: 1 } },
			);

			const noteId = listResponse.notes?.[0]?.id;
			if (!noteId) {
				throw new Error('No notes found — seed at least one note before running tests');
			}

			const response = await makeGranolaRequest<NotesGetResponse>(
				`v1/notes/${noteId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			GranolaEndpointOutputSchemas.notesGet.parse(response);
		});

		it('notesCreate returns correct type', async () => {
			const response = await makeGranolaRequest<NotesCreateResponse>(
				'v1/notes',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						title: `Test Note ${Date.now()}`,
						tags: ['test'],
					},
				},
			);

			GranolaEndpointOutputSchemas.notesCreate.parse(response);
		});

		it('notesUpdate returns correct type', async () => {
			const listResponse = await makeGranolaRequest<NotesListResponse>(
				'v1/notes',
				TEST_API_KEY,
				{ query: { limit: 1, tag: 'test' } },
			);

			const noteId = listResponse.notes?.[0]?.id;
			if (!noteId) {
				throw new Error('No test notes found — run notesCreate test first');
			}

			const response = await makeGranolaRequest<NotesUpdateResponse>(
				`v1/notes/${noteId}`,
				TEST_API_KEY,
				{
					method: 'PATCH',
					body: {
						title: `Updated Note ${Date.now()}`,
					},
				},
			);

			GranolaEndpointOutputSchemas.notesUpdate.parse(response);
		});

		it('notesDelete returns correct type', async () => {
			const createResponse = await makeGranolaRequest<NotesCreateResponse>(
				'v1/notes',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						title: `Note to Delete ${Date.now()}`,
						tags: ['test', 'delete-me'],
					},
				},
			);

			const noteId = createResponse.note?.id;
			if (!noteId) {
				throw new Error('Failed to create note for deletion test');
			}

			const response = await makeGranolaRequest<NotesDeleteResponse>(
				`v1/notes/${noteId}`,
				TEST_API_KEY,
				{ method: 'DELETE' },
			);

			GranolaEndpointOutputSchemas.notesDelete.parse(response);
		});
	});

	describe('transcripts', () => {
		it('transcriptsGet returns correct type', async () => {
			const listResponse = await makeGranolaRequest<NotesListResponse>(
				'v1/notes',
				TEST_API_KEY,
				{ query: { limit: 10, status: 'completed' } },
			);

			const noteWithTranscript = listResponse.notes?.[0];
			if (!noteWithTranscript?.id) {
				throw new Error(
					'No completed notes found — a meeting must be completed before testing transcripts',
				);
			}

			const response = await makeGranolaRequest<TranscriptsGetResponse>(
				`v1/notes/${noteWithTranscript.id}/transcript`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			GranolaEndpointOutputSchemas.transcriptsGet.parse(response);
		});
	});

	describe('people', () => {
		it('peopleList returns correct type', async () => {
			const response = await makeGranolaRequest<PeopleListResponse>(
				'v1/people',
				TEST_API_KEY,
				{ query: { limit: 10 } },
			);

			GranolaEndpointOutputSchemas.peopleList.parse(response);
		});

		it('peopleGet returns correct type', async () => {
			const listResponse = await makeGranolaRequest<PeopleListResponse>(
				'v1/people',
				TEST_API_KEY,
				{ query: { limit: 1 } },
			);

			const personId = listResponse.people?.[0]?.id;
			if (!personId) {
				throw new Error('No people found — run peopleCreate test first');
			}

			const response = await makeGranolaRequest<PeopleGetResponse>(
				`v1/people/${personId}`,
				TEST_API_KEY,
				{ method: 'GET' },
			);

			GranolaEndpointOutputSchemas.peopleGet.parse(response);
		});

		it('peopleCreate returns correct type', async () => {
			const response = await makeGranolaRequest<PeopleCreateResponse>(
				'v1/people',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						name: `Test Person ${Date.now()}`,
						email: `test-${Date.now()}@example.com`,
						company: 'Test Company',
						role: 'Engineer',
					},
				},
			);

			GranolaEndpointOutputSchemas.peopleCreate.parse(response);
		});

		it('peopleUpdate returns correct type', async () => {
			const listResponse = await makeGranolaRequest<PeopleListResponse>(
				'v1/people',
				TEST_API_KEY,
				{ query: { limit: 1 } },
			);

			const personId = listResponse.people?.[0]?.id;
			if (!personId) {
				throw new Error('No people found — run peopleCreate test first');
			}

			const response = await makeGranolaRequest<PeopleUpdateResponse>(
				`v1/people/${personId}`,
				TEST_API_KEY,
				{
					method: 'PATCH',
					body: {
						role: 'Senior Engineer',
					},
				},
			);

			GranolaEndpointOutputSchemas.peopleUpdate.parse(response);
		});
	});
});
