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
			expect(
				BasecampEndpointInputSchemas[operation.key].safeParse(
					operation.exampleInput,
				).success,
			).toBe(true);
			expect(
				BasecampEndpointOutputSchemas[operation.key].safeParse(
					operation.exampleOutput,
				).success,
			).toBe(true);
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
