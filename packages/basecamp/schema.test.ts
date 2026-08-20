import { basecampOperationCatalog } from './endpoints/operations';
import {
	BasecampEndpointInputSchemas,
	BasecampEndpointOutputSchemas,
} from './endpoints/types';
import {
	BasecampCampfire,
	BasecampChatbot,
	BasecampMessageType,
	BasecampPerson,
	BasecampProject,
	BasecampTemplate,
} from './schema/database';

describe('Basecamp generated schemas', () => {
	it.each(basecampOperationCatalog)(
		'$code accepts its generated minimal input and documented output shape',
		(operation) => {
			// Assert on the issue list rather than `.success` so a failure reports the
			// offending field and reason; the test name already names the operation.
			const input = BasecampEndpointInputSchemas[operation.key].safeParse(
				operation.exampleInput,
			);
			expect(input.error?.issues ?? []).toEqual([]);
			const output = BasecampEndpointOutputSchemas[operation.key].safeParse(
				operation.exampleOutput,
			);
			expect(output.error?.issues ?? []).toEqual([]);
		},
	);

	it('keeps reference entities loose and key-first', () => {
		for (const schema of [
			BasecampProject,
			BasecampTemplate,
			BasecampPerson,
			BasecampMessageType,
			BasecampCampfire,
			BasecampChatbot,
		]) {
			expect(schema.parse({ id: 42 })).toEqual({ id: 42 });
			expect(schema.parse({ id: '42', future_field: true })).toMatchObject({
				id: '42',
				future_field: true,
			});
		}
	});

	/**
	 * Excerpt of the project payload in the official docs (sections/projects.md).
	 * The dock carries a null `position`, and the generated schema used to type
	 * that field as a bare number — so a genuine Basecamp response failed output
	 * validation and the endpoint threw.
	 */
	const officialProject = {
		id: 2085958496,
		status: 'active',
		name: 'The Leto Locomotive',
		description: 'A new project',
		purpose: 'topic',
		color: null,
		created_at: '2026-05-28T17:23:16.269Z',
		updated_at: '2026-05-28T17:23:16.269Z',
		url: 'https://3.basecampapi.com/195539477/projects/2085958496.json',
		app_url: 'https://3.basecamp.com/195539477/projects/2085958496',
		dock: [
			{
				id: 1069479339,
				title: 'Message Board',
				name: 'message_board',
				enabled: true,
				position: 2,
				url: 'https://3.basecampapi.com/195539477/buckets/2085958496/message_boards/1069479339.json',
				app_url:
					'https://3.basecamp.com/195539477/buckets/2085958496/message_boards/1069479339',
			},
			{
				id: 1069479340,
				title: 'Automatic Check-ins',
				name: 'questionnaire',
				enabled: false,
				position: null,
				url: 'https://3.basecampapi.com/195539477/buckets/2085958496/questionnaires/1069479340.json',
				app_url:
					'https://3.basecamp.com/195539477/buckets/2085958496/questionnaires/1069479340',
			},
		],
	};

	it('accepts the project payload from the official docs', () => {
		const result =
			BasecampEndpointOutputSchemas.getProject.safeParse(officialProject);
		expect(result.error?.issues ?? []).toEqual([]);
	});

	it('still rejects a dock entry with the wrong field types', () => {
		const malformed = {
			...officialProject,
			dock: [{ ...officialProject.dock[0], enabled: 'yes', id: { a: 1 } }],
		};
		expect(
			BasecampEndpointOutputSchemas.getProject.safeParse(malformed).success,
		).toBe(false);
	});
});
