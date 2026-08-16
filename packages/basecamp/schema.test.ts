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
});
