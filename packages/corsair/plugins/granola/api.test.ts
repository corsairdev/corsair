import dotenv from 'dotenv';
import { makeGranolaRequest } from './client';
import type { NotesGetResponse, NotesListResponse } from './endpoints/types';
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

		it('notesGet with transcript returns correct type', async () => {
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
				{ method: 'GET', query: { include: 'transcript' } },
			);

			GranolaEndpointOutputSchemas.notesGet.parse(response);
		});
	});
});
