import {
	ShortcutEndpointInputSchemas,
	ShortcutEndpointOutputSchemas,
} from './endpoints/types';
import { ShortcutTestInputs, ShortcutTestOutputs } from './test-fixtures';

describe('Shortcut OpenAPI schemas', () => {
	it('listCategories validates documented input and response', () => {
		const input = ShortcutTestInputs['listCategories'];
		expect(ShortcutEndpointInputSchemas['listCategories'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listCategories'];
		expect(
			ShortcutEndpointOutputSchemas['listCategories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listCategories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listCategories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createCategory validates documented input and response', () => {
		const input = ShortcutTestInputs['createCategory'];
		expect(ShortcutEndpointInputSchemas['createCategory'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['createCategory'];
		expect(
			ShortcutEndpointOutputSchemas['createCategory'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createCategory'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createCategory'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getCategory validates documented input and response', () => {
		const input = ShortcutTestInputs['getCategory'];
		expect(ShortcutEndpointInputSchemas['getCategory'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getCategory'];
		expect(ShortcutEndpointOutputSchemas['getCategory'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getCategory'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getCategory'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateCategory validates documented input and response', () => {
		const input = ShortcutTestInputs['updateCategory'];
		expect(ShortcutEndpointInputSchemas['updateCategory'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['updateCategory'];
		expect(
			ShortcutEndpointOutputSchemas['updateCategory'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateCategory'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateCategory'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteCategory validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteCategory'];
		expect(ShortcutEndpointInputSchemas['deleteCategory'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['deleteCategory'];
		expect(
			ShortcutEndpointOutputSchemas['deleteCategory'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteCategory'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteCategory'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listCategoryMilestones validates documented input and response', () => {
		const input = ShortcutTestInputs['listCategoryMilestones'];
		expect(
			ShortcutEndpointInputSchemas['listCategoryMilestones'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listCategoryMilestones'];
		expect(
			ShortcutEndpointOutputSchemas['listCategoryMilestones'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listCategoryMilestones'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listCategoryMilestones'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listCategoryObjectives validates documented input and response', () => {
		const input = ShortcutTestInputs['listCategoryObjectives'];
		expect(
			ShortcutEndpointInputSchemas['listCategoryObjectives'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listCategoryObjectives'];
		expect(
			ShortcutEndpointOutputSchemas['listCategoryObjectives'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listCategoryObjectives'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listCategoryObjectives'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listCustomFields validates documented input and response', () => {
		const input = ShortcutTestInputs['listCustomFields'];
		expect(
			ShortcutEndpointInputSchemas['listCustomFields'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listCustomFields'];
		expect(
			ShortcutEndpointOutputSchemas['listCustomFields'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listCustomFields'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listCustomFields'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getCustomField validates documented input and response', () => {
		const input = ShortcutTestInputs['getCustomField'];
		expect(ShortcutEndpointInputSchemas['getCustomField'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getCustomField'];
		expect(
			ShortcutEndpointOutputSchemas['getCustomField'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getCustomField'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getCustomField'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateCustomField validates documented input and response', () => {
		const input = ShortcutTestInputs['updateCustomField'];
		expect(
			ShortcutEndpointInputSchemas['updateCustomField'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateCustomField'];
		expect(
			ShortcutEndpointOutputSchemas['updateCustomField'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateCustomField'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateCustomField'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteCustomField validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteCustomField'];
		expect(
			ShortcutEndpointInputSchemas['deleteCustomField'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteCustomField'];
		expect(
			ShortcutEndpointOutputSchemas['deleteCustomField'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteCustomField'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteCustomField'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listDocs validates documented input and response', () => {
		const input = ShortcutTestInputs['listDocs'];
		expect(ShortcutEndpointInputSchemas['listDocs'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listDocs'];
		expect(ShortcutEndpointOutputSchemas['listDocs'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['listDocs'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listDocs'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createDoc validates documented input and response', () => {
		const input = ShortcutTestInputs['createDoc'];
		expect(ShortcutEndpointInputSchemas['createDoc'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['createDoc'];
		expect(ShortcutEndpointOutputSchemas['createDoc'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['createDoc'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createDoc'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getDoc validates documented input and response', () => {
		const input = ShortcutTestInputs['getDoc'];
		expect(ShortcutEndpointInputSchemas['getDoc'].parse(input)).toEqual(input);
		const output = ShortcutTestOutputs['getDoc'];
		expect(ShortcutEndpointOutputSchemas['getDoc'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getDoc'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getDoc'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateDoc validates documented input and response', () => {
		const input = ShortcutTestInputs['updateDoc'];
		expect(ShortcutEndpointInputSchemas['updateDoc'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['updateDoc'];
		expect(ShortcutEndpointOutputSchemas['updateDoc'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['updateDoc'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateDoc'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteDoc validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteDoc'];
		expect(ShortcutEndpointInputSchemas['deleteDoc'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['deleteDoc'];
		expect(ShortcutEndpointOutputSchemas['deleteDoc'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['deleteDoc'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteDoc'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listDocumentEpics validates documented input and response', () => {
		const input = ShortcutTestInputs['listDocumentEpics'];
		expect(
			ShortcutEndpointInputSchemas['listDocumentEpics'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listDocumentEpics'];
		expect(
			ShortcutEndpointOutputSchemas['listDocumentEpics'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listDocumentEpics'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listDocumentEpics'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('linkDocumentToEpic validates documented input and response', () => {
		const input = ShortcutTestInputs['linkDocumentToEpic'];
		expect(
			ShortcutEndpointInputSchemas['linkDocumentToEpic'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['linkDocumentToEpic'];
		expect(
			ShortcutEndpointOutputSchemas['linkDocumentToEpic'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['linkDocumentToEpic'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['linkDocumentToEpic'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('unlinkDocumentFromEpic validates documented input and response', () => {
		const input = ShortcutTestInputs['unlinkDocumentFromEpic'];
		expect(
			ShortcutEndpointInputSchemas['unlinkDocumentFromEpic'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['unlinkDocumentFromEpic'];
		expect(
			ShortcutEndpointOutputSchemas['unlinkDocumentFromEpic'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['unlinkDocumentFromEpic'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['unlinkDocumentFromEpic'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listEntityTemplates validates documented input and response', () => {
		const input = ShortcutTestInputs['listEntityTemplates'];
		expect(
			ShortcutEndpointInputSchemas['listEntityTemplates'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listEntityTemplates'];
		expect(
			ShortcutEndpointOutputSchemas['listEntityTemplates'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listEntityTemplates'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listEntityTemplates'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createEntityTemplate validates documented input and response', () => {
		const input = ShortcutTestInputs['createEntityTemplate'];
		expect(
			ShortcutEndpointInputSchemas['createEntityTemplate'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createEntityTemplate'];
		expect(
			ShortcutEndpointOutputSchemas['createEntityTemplate'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createEntityTemplate'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createEntityTemplate'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('disableStoryTemplates validates documented input and response', () => {
		const input = ShortcutTestInputs['disableStoryTemplates'];
		expect(
			ShortcutEndpointInputSchemas['disableStoryTemplates'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['disableStoryTemplates'];
		expect(
			ShortcutEndpointOutputSchemas['disableStoryTemplates'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['disableStoryTemplates'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['disableStoryTemplates'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('enableStoryTemplates validates documented input and response', () => {
		const input = ShortcutTestInputs['enableStoryTemplates'];
		expect(
			ShortcutEndpointInputSchemas['enableStoryTemplates'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['enableStoryTemplates'];
		expect(
			ShortcutEndpointOutputSchemas['enableStoryTemplates'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['enableStoryTemplates'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['enableStoryTemplates'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getEntityTemplate validates documented input and response', () => {
		const input = ShortcutTestInputs['getEntityTemplate'];
		expect(
			ShortcutEndpointInputSchemas['getEntityTemplate'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['getEntityTemplate'];
		expect(
			ShortcutEndpointOutputSchemas['getEntityTemplate'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getEntityTemplate'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getEntityTemplate'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateEntityTemplate validates documented input and response', () => {
		const input = ShortcutTestInputs['updateEntityTemplate'];
		expect(
			ShortcutEndpointInputSchemas['updateEntityTemplate'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateEntityTemplate'];
		expect(
			ShortcutEndpointOutputSchemas['updateEntityTemplate'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateEntityTemplate'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateEntityTemplate'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteEntityTemplate validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteEntityTemplate'];
		expect(
			ShortcutEndpointInputSchemas['deleteEntityTemplate'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteEntityTemplate'];
		expect(
			ShortcutEndpointOutputSchemas['deleteEntityTemplate'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteEntityTemplate'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteEntityTemplate'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getEpicWorkflow validates documented input and response', () => {
		const input = ShortcutTestInputs['getEpicWorkflow'];
		expect(
			ShortcutEndpointInputSchemas['getEpicWorkflow'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['getEpicWorkflow'];
		expect(
			ShortcutEndpointOutputSchemas['getEpicWorkflow'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getEpicWorkflow'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getEpicWorkflow'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listEpics validates documented input and response', () => {
		const input = ShortcutTestInputs['listEpics'];
		expect(ShortcutEndpointInputSchemas['listEpics'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listEpics'];
		expect(ShortcutEndpointOutputSchemas['listEpics'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['listEpics'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listEpics'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createEpic validates documented input and response', () => {
		const input = ShortcutTestInputs['createEpic'];
		expect(ShortcutEndpointInputSchemas['createEpic'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['createEpic'];
		expect(ShortcutEndpointOutputSchemas['createEpic'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['createEpic'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createEpic'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listEpicsPaginated validates documented input and response', () => {
		const input = ShortcutTestInputs['listEpicsPaginated'];
		expect(
			ShortcutEndpointInputSchemas['listEpicsPaginated'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listEpicsPaginated'];
		expect(
			ShortcutEndpointOutputSchemas['listEpicsPaginated'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listEpicsPaginated'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listEpicsPaginated'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getEpic validates documented input and response', () => {
		const input = ShortcutTestInputs['getEpic'];
		expect(ShortcutEndpointInputSchemas['getEpic'].parse(input)).toEqual(input);
		const output = ShortcutTestOutputs['getEpic'];
		expect(ShortcutEndpointOutputSchemas['getEpic'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getEpic'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getEpic'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateEpic validates documented input and response', () => {
		const input = ShortcutTestInputs['updateEpic'];
		expect(ShortcutEndpointInputSchemas['updateEpic'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['updateEpic'];
		expect(ShortcutEndpointOutputSchemas['updateEpic'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['updateEpic'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateEpic'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteEpic validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteEpic'];
		expect(ShortcutEndpointInputSchemas['deleteEpic'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['deleteEpic'];
		expect(ShortcutEndpointOutputSchemas['deleteEpic'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['deleteEpic'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteEpic'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listEpicComments validates documented input and response', () => {
		const input = ShortcutTestInputs['listEpicComments'];
		expect(
			ShortcutEndpointInputSchemas['listEpicComments'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listEpicComments'];
		expect(
			ShortcutEndpointOutputSchemas['listEpicComments'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listEpicComments'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listEpicComments'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createEpicComment validates documented input and response', () => {
		const input = ShortcutTestInputs['createEpicComment'];
		expect(
			ShortcutEndpointInputSchemas['createEpicComment'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createEpicComment'];
		expect(
			ShortcutEndpointOutputSchemas['createEpicComment'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createEpicComment'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createEpicComment'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createEpicCommentComment validates documented input and response', () => {
		const input = ShortcutTestInputs['createEpicCommentComment'];
		expect(
			ShortcutEndpointInputSchemas['createEpicCommentComment'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createEpicCommentComment'];
		expect(
			ShortcutEndpointOutputSchemas['createEpicCommentComment'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createEpicCommentComment'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createEpicCommentComment'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getEpicComment validates documented input and response', () => {
		const input = ShortcutTestInputs['getEpicComment'];
		expect(ShortcutEndpointInputSchemas['getEpicComment'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getEpicComment'];
		expect(
			ShortcutEndpointOutputSchemas['getEpicComment'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getEpicComment'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getEpicComment'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateEpicComment validates documented input and response', () => {
		const input = ShortcutTestInputs['updateEpicComment'];
		expect(
			ShortcutEndpointInputSchemas['updateEpicComment'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateEpicComment'];
		expect(
			ShortcutEndpointOutputSchemas['updateEpicComment'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateEpicComment'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateEpicComment'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteEpicComment validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteEpicComment'];
		expect(
			ShortcutEndpointInputSchemas['deleteEpicComment'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteEpicComment'];
		expect(
			ShortcutEndpointOutputSchemas['deleteEpicComment'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteEpicComment'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteEpicComment'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listEpicDocuments validates documented input and response', () => {
		const input = ShortcutTestInputs['listEpicDocuments'];
		expect(
			ShortcutEndpointInputSchemas['listEpicDocuments'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listEpicDocuments'];
		expect(
			ShortcutEndpointOutputSchemas['listEpicDocuments'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listEpicDocuments'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listEpicDocuments'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getEpicHealth validates documented input and response', () => {
		const input = ShortcutTestInputs['getEpicHealth'];
		expect(ShortcutEndpointInputSchemas['getEpicHealth'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getEpicHealth'];
		expect(
			ShortcutEndpointOutputSchemas['getEpicHealth'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getEpicHealth'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getEpicHealth'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createEpicHealth validates documented input and response', () => {
		const input = ShortcutTestInputs['createEpicHealth'];
		expect(
			ShortcutEndpointInputSchemas['createEpicHealth'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createEpicHealth'];
		expect(
			ShortcutEndpointOutputSchemas['createEpicHealth'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createEpicHealth'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createEpicHealth'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listEpicHealths validates documented input and response', () => {
		const input = ShortcutTestInputs['listEpicHealths'];
		expect(
			ShortcutEndpointInputSchemas['listEpicHealths'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listEpicHealths'];
		expect(
			ShortcutEndpointOutputSchemas['listEpicHealths'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listEpicHealths'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listEpicHealths'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listEpicStories validates documented input and response', () => {
		const input = ShortcutTestInputs['listEpicStories'];
		expect(
			ShortcutEndpointInputSchemas['listEpicStories'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listEpicStories'];
		expect(
			ShortcutEndpointOutputSchemas['listEpicStories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listEpicStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listEpicStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getExternalLinkStories validates documented input and response', () => {
		const input = ShortcutTestInputs['getExternalLinkStories'];
		expect(
			ShortcutEndpointInputSchemas['getExternalLinkStories'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['getExternalLinkStories'];
		expect(
			ShortcutEndpointOutputSchemas['getExternalLinkStories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getExternalLinkStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getExternalLinkStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listFiles validates documented input and response', () => {
		const input = ShortcutTestInputs['listFiles'];
		expect(ShortcutEndpointInputSchemas['listFiles'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listFiles'];
		expect(ShortcutEndpointOutputSchemas['listFiles'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['listFiles'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listFiles'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('uploadFiles validates documented input and response', () => {
		const input = {
			...ShortcutTestInputs['uploadFiles'],
			body: {
				...ShortcutTestInputs['uploadFiles'].body,
				file0: new Blob(['sample']),
			},
		};
		expect(ShortcutEndpointInputSchemas['uploadFiles'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['uploadFiles'];
		expect(ShortcutEndpointOutputSchemas['uploadFiles'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['uploadFiles'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['uploadFiles'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getFile validates documented input and response', () => {
		const input = ShortcutTestInputs['getFile'];
		expect(ShortcutEndpointInputSchemas['getFile'].parse(input)).toEqual(input);
		const output = ShortcutTestOutputs['getFile'];
		expect(ShortcutEndpointOutputSchemas['getFile'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getFile'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getFile'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateFile validates documented input and response', () => {
		const input = ShortcutTestInputs['updateFile'];
		expect(ShortcutEndpointInputSchemas['updateFile'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['updateFile'];
		expect(ShortcutEndpointOutputSchemas['updateFile'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['updateFile'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateFile'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteFile validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteFile'];
		expect(ShortcutEndpointInputSchemas['deleteFile'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['deleteFile'];
		expect(ShortcutEndpointOutputSchemas['deleteFile'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['deleteFile'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteFile'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listGroups validates documented input and response', () => {
		const input = ShortcutTestInputs['listGroups'];
		expect(ShortcutEndpointInputSchemas['listGroups'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listGroups'];
		expect(ShortcutEndpointOutputSchemas['listGroups'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['listGroups'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listGroups'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createGroup validates documented input and response', () => {
		const input = ShortcutTestInputs['createGroup'];
		expect(ShortcutEndpointInputSchemas['createGroup'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['createGroup'];
		expect(ShortcutEndpointOutputSchemas['createGroup'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['createGroup'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createGroup'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getGroup validates documented input and response', () => {
		const input = ShortcutTestInputs['getGroup'];
		expect(ShortcutEndpointInputSchemas['getGroup'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getGroup'];
		expect(ShortcutEndpointOutputSchemas['getGroup'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getGroup'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getGroup'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateGroup validates documented input and response', () => {
		const input = ShortcutTestInputs['updateGroup'];
		expect(ShortcutEndpointInputSchemas['updateGroup'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['updateGroup'];
		expect(ShortcutEndpointOutputSchemas['updateGroup'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['updateGroup'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateGroup'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listGroupStories validates documented input and response', () => {
		const input = ShortcutTestInputs['listGroupStories'];
		expect(
			ShortcutEndpointInputSchemas['listGroupStories'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listGroupStories'];
		expect(
			ShortcutEndpointOutputSchemas['listGroupStories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listGroupStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listGroupStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateHealth validates documented input and response', () => {
		const input = ShortcutTestInputs['updateHealth'];
		expect(ShortcutEndpointInputSchemas['updateHealth'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['updateHealth'];
		expect(ShortcutEndpointOutputSchemas['updateHealth'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['updateHealth'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateHealth'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listIterations validates documented input and response', () => {
		const input = ShortcutTestInputs['listIterations'];
		expect(ShortcutEndpointInputSchemas['listIterations'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listIterations'];
		expect(
			ShortcutEndpointOutputSchemas['listIterations'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listIterations'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listIterations'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createIteration validates documented input and response', () => {
		const input = ShortcutTestInputs['createIteration'];
		expect(
			ShortcutEndpointInputSchemas['createIteration'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createIteration'];
		expect(
			ShortcutEndpointOutputSchemas['createIteration'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createIteration'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createIteration'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('disableIterations validates documented input and response', () => {
		const input = ShortcutTestInputs['disableIterations'];
		expect(
			ShortcutEndpointInputSchemas['disableIterations'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['disableIterations'];
		expect(
			ShortcutEndpointOutputSchemas['disableIterations'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['disableIterations'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['disableIterations'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('enableIterations validates documented input and response', () => {
		const input = ShortcutTestInputs['enableIterations'];
		expect(
			ShortcutEndpointInputSchemas['enableIterations'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['enableIterations'];
		expect(
			ShortcutEndpointOutputSchemas['enableIterations'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['enableIterations'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['enableIterations'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getIteration validates documented input and response', () => {
		const input = ShortcutTestInputs['getIteration'];
		expect(ShortcutEndpointInputSchemas['getIteration'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getIteration'];
		expect(ShortcutEndpointOutputSchemas['getIteration'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getIteration'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getIteration'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateIteration validates documented input and response', () => {
		const input = ShortcutTestInputs['updateIteration'];
		expect(
			ShortcutEndpointInputSchemas['updateIteration'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateIteration'];
		expect(
			ShortcutEndpointOutputSchemas['updateIteration'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateIteration'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateIteration'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteIteration validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteIteration'];
		expect(
			ShortcutEndpointInputSchemas['deleteIteration'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteIteration'];
		expect(
			ShortcutEndpointOutputSchemas['deleteIteration'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteIteration'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteIteration'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listIterationStories validates documented input and response', () => {
		const input = ShortcutTestInputs['listIterationStories'];
		expect(
			ShortcutEndpointInputSchemas['listIterationStories'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listIterationStories'];
		expect(
			ShortcutEndpointOutputSchemas['listIterationStories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listIterationStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listIterationStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getKeyResult validates documented input and response', () => {
		const input = ShortcutTestInputs['getKeyResult'];
		expect(ShortcutEndpointInputSchemas['getKeyResult'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getKeyResult'];
		expect(ShortcutEndpointOutputSchemas['getKeyResult'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getKeyResult'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getKeyResult'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateKeyResult validates documented input and response', () => {
		const input = ShortcutTestInputs['updateKeyResult'];
		expect(
			ShortcutEndpointInputSchemas['updateKeyResult'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateKeyResult'];
		expect(
			ShortcutEndpointOutputSchemas['updateKeyResult'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateKeyResult'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateKeyResult'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listLabels validates documented input and response', () => {
		const input = ShortcutTestInputs['listLabels'];
		expect(ShortcutEndpointInputSchemas['listLabels'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listLabels'];
		expect(ShortcutEndpointOutputSchemas['listLabels'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['listLabels'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listLabels'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createLabel validates documented input and response', () => {
		const input = ShortcutTestInputs['createLabel'];
		expect(ShortcutEndpointInputSchemas['createLabel'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['createLabel'];
		expect(ShortcutEndpointOutputSchemas['createLabel'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['createLabel'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createLabel'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getLabel validates documented input and response', () => {
		const input = ShortcutTestInputs['getLabel'];
		expect(ShortcutEndpointInputSchemas['getLabel'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getLabel'];
		expect(ShortcutEndpointOutputSchemas['getLabel'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getLabel'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getLabel'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateLabel validates documented input and response', () => {
		const input = ShortcutTestInputs['updateLabel'];
		expect(ShortcutEndpointInputSchemas['updateLabel'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['updateLabel'];
		expect(ShortcutEndpointOutputSchemas['updateLabel'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['updateLabel'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateLabel'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteLabel validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteLabel'];
		expect(ShortcutEndpointInputSchemas['deleteLabel'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['deleteLabel'];
		expect(ShortcutEndpointOutputSchemas['deleteLabel'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['deleteLabel'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteLabel'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listLabelEpics validates documented input and response', () => {
		const input = ShortcutTestInputs['listLabelEpics'];
		expect(ShortcutEndpointInputSchemas['listLabelEpics'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listLabelEpics'];
		expect(
			ShortcutEndpointOutputSchemas['listLabelEpics'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listLabelEpics'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listLabelEpics'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listLabelStories validates documented input and response', () => {
		const input = ShortcutTestInputs['listLabelStories'];
		expect(
			ShortcutEndpointInputSchemas['listLabelStories'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listLabelStories'];
		expect(
			ShortcutEndpointOutputSchemas['listLabelStories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listLabelStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listLabelStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listLinkedFiles validates documented input and response', () => {
		const input = ShortcutTestInputs['listLinkedFiles'];
		expect(
			ShortcutEndpointInputSchemas['listLinkedFiles'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listLinkedFiles'];
		expect(
			ShortcutEndpointOutputSchemas['listLinkedFiles'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listLinkedFiles'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listLinkedFiles'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createLinkedFile validates documented input and response', () => {
		const input = ShortcutTestInputs['createLinkedFile'];
		expect(
			ShortcutEndpointInputSchemas['createLinkedFile'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createLinkedFile'];
		expect(
			ShortcutEndpointOutputSchemas['createLinkedFile'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createLinkedFile'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createLinkedFile'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getLinkedFile validates documented input and response', () => {
		const input = ShortcutTestInputs['getLinkedFile'];
		expect(ShortcutEndpointInputSchemas['getLinkedFile'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getLinkedFile'];
		expect(
			ShortcutEndpointOutputSchemas['getLinkedFile'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getLinkedFile'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getLinkedFile'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateLinkedFile validates documented input and response', () => {
		const input = ShortcutTestInputs['updateLinkedFile'];
		expect(
			ShortcutEndpointInputSchemas['updateLinkedFile'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateLinkedFile'];
		expect(
			ShortcutEndpointOutputSchemas['updateLinkedFile'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateLinkedFile'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateLinkedFile'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteLinkedFile validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteLinkedFile'];
		expect(
			ShortcutEndpointInputSchemas['deleteLinkedFile'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteLinkedFile'];
		expect(
			ShortcutEndpointOutputSchemas['deleteLinkedFile'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteLinkedFile'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteLinkedFile'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getCurrentMemberInfo validates documented input and response', () => {
		const input = ShortcutTestInputs['getCurrentMemberInfo'];
		expect(
			ShortcutEndpointInputSchemas['getCurrentMemberInfo'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['getCurrentMemberInfo'];
		expect(
			ShortcutEndpointOutputSchemas['getCurrentMemberInfo'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getCurrentMemberInfo'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getCurrentMemberInfo'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listMembers validates documented input and response', () => {
		const input = ShortcutTestInputs['listMembers'];
		expect(ShortcutEndpointInputSchemas['listMembers'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listMembers'];
		expect(ShortcutEndpointOutputSchemas['listMembers'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['listMembers'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listMembers'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getMember validates documented input and response', () => {
		const input = ShortcutTestInputs['getMember'];
		expect(ShortcutEndpointInputSchemas['getMember'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getMember'];
		expect(ShortcutEndpointOutputSchemas['getMember'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getMember'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getMember'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listMilestones validates documented input and response', () => {
		const input = ShortcutTestInputs['listMilestones'];
		expect(ShortcutEndpointInputSchemas['listMilestones'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listMilestones'];
		expect(
			ShortcutEndpointOutputSchemas['listMilestones'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listMilestones'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listMilestones'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createMilestone validates documented input and response', () => {
		const input = ShortcutTestInputs['createMilestone'];
		expect(
			ShortcutEndpointInputSchemas['createMilestone'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createMilestone'];
		expect(
			ShortcutEndpointOutputSchemas['createMilestone'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createMilestone'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createMilestone'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getMilestone validates documented input and response', () => {
		const input = ShortcutTestInputs['getMilestone'];
		expect(ShortcutEndpointInputSchemas['getMilestone'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getMilestone'];
		expect(ShortcutEndpointOutputSchemas['getMilestone'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getMilestone'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getMilestone'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateMilestone validates documented input and response', () => {
		const input = ShortcutTestInputs['updateMilestone'];
		expect(
			ShortcutEndpointInputSchemas['updateMilestone'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateMilestone'];
		expect(
			ShortcutEndpointOutputSchemas['updateMilestone'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateMilestone'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateMilestone'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteMilestone validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteMilestone'];
		expect(
			ShortcutEndpointInputSchemas['deleteMilestone'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteMilestone'];
		expect(
			ShortcutEndpointOutputSchemas['deleteMilestone'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteMilestone'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteMilestone'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listMilestoneEpics validates documented input and response', () => {
		const input = ShortcutTestInputs['listMilestoneEpics'];
		expect(
			ShortcutEndpointInputSchemas['listMilestoneEpics'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listMilestoneEpics'];
		expect(
			ShortcutEndpointOutputSchemas['listMilestoneEpics'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listMilestoneEpics'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listMilestoneEpics'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listObjectives validates documented input and response', () => {
		const input = ShortcutTestInputs['listObjectives'];
		expect(ShortcutEndpointInputSchemas['listObjectives'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listObjectives'];
		expect(
			ShortcutEndpointOutputSchemas['listObjectives'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listObjectives'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listObjectives'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createObjective validates documented input and response', () => {
		const input = ShortcutTestInputs['createObjective'];
		expect(
			ShortcutEndpointInputSchemas['createObjective'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createObjective'];
		expect(
			ShortcutEndpointOutputSchemas['createObjective'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createObjective'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createObjective'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getObjective validates documented input and response', () => {
		const input = ShortcutTestInputs['getObjective'];
		expect(ShortcutEndpointInputSchemas['getObjective'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getObjective'];
		expect(ShortcutEndpointOutputSchemas['getObjective'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getObjective'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getObjective'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateObjective validates documented input and response', () => {
		const input = ShortcutTestInputs['updateObjective'];
		expect(
			ShortcutEndpointInputSchemas['updateObjective'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateObjective'];
		expect(
			ShortcutEndpointOutputSchemas['updateObjective'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateObjective'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateObjective'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteObjective validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteObjective'];
		expect(
			ShortcutEndpointInputSchemas['deleteObjective'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteObjective'];
		expect(
			ShortcutEndpointOutputSchemas['deleteObjective'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteObjective'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteObjective'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listObjectiveEpics validates documented input and response', () => {
		const input = ShortcutTestInputs['listObjectiveEpics'];
		expect(
			ShortcutEndpointInputSchemas['listObjectiveEpics'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listObjectiveEpics'];
		expect(
			ShortcutEndpointOutputSchemas['listObjectiveEpics'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listObjectiveEpics'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listObjectiveEpics'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getObjectiveHealth validates documented input and response', () => {
		const input = ShortcutTestInputs['getObjectiveHealth'];
		expect(
			ShortcutEndpointInputSchemas['getObjectiveHealth'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['getObjectiveHealth'];
		expect(
			ShortcutEndpointOutputSchemas['getObjectiveHealth'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getObjectiveHealth'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getObjectiveHealth'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createObjectiveHealth validates documented input and response', () => {
		const input = ShortcutTestInputs['createObjectiveHealth'];
		expect(
			ShortcutEndpointInputSchemas['createObjectiveHealth'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createObjectiveHealth'];
		expect(
			ShortcutEndpointOutputSchemas['createObjectiveHealth'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createObjectiveHealth'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createObjectiveHealth'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listObjectiveHealths validates documented input and response', () => {
		const input = ShortcutTestInputs['listObjectiveHealths'];
		expect(
			ShortcutEndpointInputSchemas['listObjectiveHealths'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listObjectiveHealths'];
		expect(
			ShortcutEndpointOutputSchemas['listObjectiveHealths'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listObjectiveHealths'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listObjectiveHealths'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listProjects validates documented input and response', () => {
		const input = ShortcutTestInputs['listProjects'];
		expect(ShortcutEndpointInputSchemas['listProjects'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listProjects'];
		expect(ShortcutEndpointOutputSchemas['listProjects'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['listProjects'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listProjects'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createProject validates documented input and response', () => {
		const input = ShortcutTestInputs['createProject'];
		expect(ShortcutEndpointInputSchemas['createProject'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['createProject'];
		expect(
			ShortcutEndpointOutputSchemas['createProject'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createProject'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createProject'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getProject validates documented input and response', () => {
		const input = ShortcutTestInputs['getProject'];
		expect(ShortcutEndpointInputSchemas['getProject'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getProject'];
		expect(ShortcutEndpointOutputSchemas['getProject'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getProject'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getProject'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateProject validates documented input and response', () => {
		const input = ShortcutTestInputs['updateProject'];
		expect(ShortcutEndpointInputSchemas['updateProject'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['updateProject'];
		expect(
			ShortcutEndpointOutputSchemas['updateProject'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateProject'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateProject'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteProject validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteProject'];
		expect(ShortcutEndpointInputSchemas['deleteProject'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['deleteProject'];
		expect(
			ShortcutEndpointOutputSchemas['deleteProject'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteProject'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteProject'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listStories validates documented input and response', () => {
		const input = ShortcutTestInputs['listStories'];
		expect(ShortcutEndpointInputSchemas['listStories'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listStories'];
		expect(ShortcutEndpointOutputSchemas['listStories'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['listStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listRepositories validates documented input and response', () => {
		const input = ShortcutTestInputs['listRepositories'];
		expect(
			ShortcutEndpointInputSchemas['listRepositories'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listRepositories'];
		expect(
			ShortcutEndpointOutputSchemas['listRepositories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listRepositories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listRepositories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getRepository validates documented input and response', () => {
		const input = ShortcutTestInputs['getRepository'];
		expect(ShortcutEndpointInputSchemas['getRepository'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getRepository'];
		expect(
			ShortcutEndpointOutputSchemas['getRepository'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getRepository'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getRepository'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('search validates documented input and response', () => {
		const input = ShortcutTestInputs['search'];
		expect(ShortcutEndpointInputSchemas['search'].parse(input)).toEqual(input);
		const output = ShortcutTestOutputs['search'];
		expect(ShortcutEndpointOutputSchemas['search'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['search'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['search'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('searchDocuments validates documented input and response', () => {
		const input = ShortcutTestInputs['searchDocuments'];
		expect(
			ShortcutEndpointInputSchemas['searchDocuments'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['searchDocuments'];
		expect(
			ShortcutEndpointOutputSchemas['searchDocuments'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['searchDocuments'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['searchDocuments'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('searchEpics validates documented input and response', () => {
		const input = ShortcutTestInputs['searchEpics'];
		expect(ShortcutEndpointInputSchemas['searchEpics'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['searchEpics'];
		expect(ShortcutEndpointOutputSchemas['searchEpics'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['searchEpics'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['searchEpics'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('searchIterations validates documented input and response', () => {
		const input = ShortcutTestInputs['searchIterations'];
		expect(
			ShortcutEndpointInputSchemas['searchIterations'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['searchIterations'];
		expect(
			ShortcutEndpointOutputSchemas['searchIterations'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['searchIterations'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['searchIterations'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('searchMilestones validates documented input and response', () => {
		const input = ShortcutTestInputs['searchMilestones'];
		expect(
			ShortcutEndpointInputSchemas['searchMilestones'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['searchMilestones'];
		expect(
			ShortcutEndpointOutputSchemas['searchMilestones'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['searchMilestones'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['searchMilestones'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('searchObjectives validates documented input and response', () => {
		const input = ShortcutTestInputs['searchObjectives'];
		expect(
			ShortcutEndpointInputSchemas['searchObjectives'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['searchObjectives'];
		expect(
			ShortcutEndpointOutputSchemas['searchObjectives'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['searchObjectives'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['searchObjectives'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('searchStories validates documented input and response', () => {
		const input = ShortcutTestInputs['searchStories'];
		expect(ShortcutEndpointInputSchemas['searchStories'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['searchStories'];
		expect(
			ShortcutEndpointOutputSchemas['searchStories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['searchStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['searchStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createStory validates documented input and response', () => {
		const input = ShortcutTestInputs['createStory'];
		expect(ShortcutEndpointInputSchemas['createStory'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['createStory'];
		expect(ShortcutEndpointOutputSchemas['createStory'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['createStory'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createStory'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createMultipleStories validates documented input and response', () => {
		const input = ShortcutTestInputs['createMultipleStories'];
		expect(
			ShortcutEndpointInputSchemas['createMultipleStories'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createMultipleStories'];
		expect(
			ShortcutEndpointOutputSchemas['createMultipleStories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createMultipleStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createMultipleStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateMultipleStories validates documented input and response', () => {
		const input = ShortcutTestInputs['updateMultipleStories'];
		expect(
			ShortcutEndpointInputSchemas['updateMultipleStories'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateMultipleStories'];
		expect(
			ShortcutEndpointOutputSchemas['updateMultipleStories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateMultipleStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateMultipleStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteMultipleStories validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteMultipleStories'];
		expect(
			ShortcutEndpointInputSchemas['deleteMultipleStories'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteMultipleStories'];
		expect(
			ShortcutEndpointOutputSchemas['deleteMultipleStories'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteMultipleStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteMultipleStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createStoryFromTemplate validates documented input and response', () => {
		const input = ShortcutTestInputs['createStoryFromTemplate'];
		expect(
			ShortcutEndpointInputSchemas['createStoryFromTemplate'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createStoryFromTemplate'];
		expect(
			ShortcutEndpointOutputSchemas['createStoryFromTemplate'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createStoryFromTemplate'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createStoryFromTemplate'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('queryStories validates documented input and response', () => {
		const input = ShortcutTestInputs['queryStories'];
		expect(ShortcutEndpointInputSchemas['queryStories'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['queryStories'];
		expect(ShortcutEndpointOutputSchemas['queryStories'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['queryStories'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['queryStories'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getStory validates documented input and response', () => {
		const input = ShortcutTestInputs['getStory'];
		expect(ShortcutEndpointInputSchemas['getStory'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getStory'];
		expect(ShortcutEndpointOutputSchemas['getStory'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getStory'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getStory'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateStory validates documented input and response', () => {
		const input = ShortcutTestInputs['updateStory'];
		expect(ShortcutEndpointInputSchemas['updateStory'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['updateStory'];
		expect(ShortcutEndpointOutputSchemas['updateStory'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['updateStory'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateStory'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteStory validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteStory'];
		expect(ShortcutEndpointInputSchemas['deleteStory'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['deleteStory'];
		expect(ShortcutEndpointOutputSchemas['deleteStory'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['deleteStory'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteStory'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listStoryComment validates documented input and response', () => {
		const input = ShortcutTestInputs['listStoryComment'];
		expect(
			ShortcutEndpointInputSchemas['listStoryComment'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listStoryComment'];
		expect(
			ShortcutEndpointOutputSchemas['listStoryComment'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listStoryComment'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listStoryComment'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createStoryComment validates documented input and response', () => {
		const input = ShortcutTestInputs['createStoryComment'];
		expect(
			ShortcutEndpointInputSchemas['createStoryComment'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createStoryComment'];
		expect(
			ShortcutEndpointOutputSchemas['createStoryComment'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createStoryComment'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createStoryComment'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getStoryComment validates documented input and response', () => {
		const input = ShortcutTestInputs['getStoryComment'];
		expect(
			ShortcutEndpointInputSchemas['getStoryComment'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['getStoryComment'];
		expect(
			ShortcutEndpointOutputSchemas['getStoryComment'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['getStoryComment'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getStoryComment'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateStoryComment validates documented input and response', () => {
		const input = ShortcutTestInputs['updateStoryComment'];
		expect(
			ShortcutEndpointInputSchemas['updateStoryComment'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateStoryComment'];
		expect(
			ShortcutEndpointOutputSchemas['updateStoryComment'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateStoryComment'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateStoryComment'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteStoryComment validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteStoryComment'];
		expect(
			ShortcutEndpointInputSchemas['deleteStoryComment'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteStoryComment'];
		expect(
			ShortcutEndpointOutputSchemas['deleteStoryComment'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteStoryComment'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteStoryComment'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createStoryReaction validates documented input and response', () => {
		const input = ShortcutTestInputs['createStoryReaction'];
		expect(
			ShortcutEndpointInputSchemas['createStoryReaction'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createStoryReaction'];
		expect(
			ShortcutEndpointOutputSchemas['createStoryReaction'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createStoryReaction'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createStoryReaction'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteStoryReaction validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteStoryReaction'];
		expect(
			ShortcutEndpointInputSchemas['deleteStoryReaction'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteStoryReaction'];
		expect(
			ShortcutEndpointOutputSchemas['deleteStoryReaction'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteStoryReaction'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteStoryReaction'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('unlinkCommentThreadFromSlack validates documented input and response', () => {
		const input = ShortcutTestInputs['unlinkCommentThreadFromSlack'];
		expect(
			ShortcutEndpointInputSchemas['unlinkCommentThreadFromSlack'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['unlinkCommentThreadFromSlack'];
		expect(
			ShortcutEndpointOutputSchemas['unlinkCommentThreadFromSlack'].parse(
				output,
			),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['unlinkCommentThreadFromSlack'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['unlinkCommentThreadFromSlack'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('storyHistory validates documented input and response', () => {
		const input = ShortcutTestInputs['storyHistory'];
		expect(ShortcutEndpointInputSchemas['storyHistory'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['storyHistory'];
		expect(ShortcutEndpointOutputSchemas['storyHistory'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['storyHistory'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['storyHistory'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listStorySubTasks validates documented input and response', () => {
		const input = ShortcutTestInputs['listStorySubTasks'];
		expect(
			ShortcutEndpointInputSchemas['listStorySubTasks'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['listStorySubTasks'];
		expect(
			ShortcutEndpointOutputSchemas['listStorySubTasks'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listStorySubTasks'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listStorySubTasks'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createTask validates documented input and response', () => {
		const input = ShortcutTestInputs['createTask'];
		expect(ShortcutEndpointInputSchemas['createTask'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['createTask'];
		expect(ShortcutEndpointOutputSchemas['createTask'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['createTask'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createTask'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getTask validates documented input and response', () => {
		const input = ShortcutTestInputs['getTask'];
		expect(ShortcutEndpointInputSchemas['getTask'].parse(input)).toEqual(input);
		const output = ShortcutTestOutputs['getTask'];
		expect(ShortcutEndpointOutputSchemas['getTask'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getTask'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getTask'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateTask validates documented input and response', () => {
		const input = ShortcutTestInputs['updateTask'];
		expect(ShortcutEndpointInputSchemas['updateTask'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['updateTask'];
		expect(ShortcutEndpointOutputSchemas['updateTask'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['updateTask'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateTask'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteTask validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteTask'];
		expect(ShortcutEndpointInputSchemas['deleteTask'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['deleteTask'];
		expect(ShortcutEndpointOutputSchemas['deleteTask'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['deleteTask'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteTask'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('createStoryLink validates documented input and response', () => {
		const input = ShortcutTestInputs['createStoryLink'];
		expect(
			ShortcutEndpointInputSchemas['createStoryLink'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['createStoryLink'];
		expect(
			ShortcutEndpointOutputSchemas['createStoryLink'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['createStoryLink'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['createStoryLink'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getStoryLink validates documented input and response', () => {
		const input = ShortcutTestInputs['getStoryLink'];
		expect(ShortcutEndpointInputSchemas['getStoryLink'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getStoryLink'];
		expect(ShortcutEndpointOutputSchemas['getStoryLink'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getStoryLink'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getStoryLink'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('updateStoryLink validates documented input and response', () => {
		const input = ShortcutTestInputs['updateStoryLink'];
		expect(
			ShortcutEndpointInputSchemas['updateStoryLink'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['updateStoryLink'];
		expect(
			ShortcutEndpointOutputSchemas['updateStoryLink'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['updateStoryLink'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['updateStoryLink'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('deleteStoryLink validates documented input and response', () => {
		const input = ShortcutTestInputs['deleteStoryLink'];
		expect(
			ShortcutEndpointInputSchemas['deleteStoryLink'].parse(input),
		).toEqual(input);
		const output = ShortcutTestOutputs['deleteStoryLink'];
		expect(
			ShortcutEndpointOutputSchemas['deleteStoryLink'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['deleteStoryLink'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['deleteStoryLink'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('listWorkflows validates documented input and response', () => {
		const input = ShortcutTestInputs['listWorkflows'];
		expect(ShortcutEndpointInputSchemas['listWorkflows'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['listWorkflows'];
		expect(
			ShortcutEndpointOutputSchemas['listWorkflows'].parse(output),
		).toEqual(output);
		expect(
			ShortcutEndpointInputSchemas['listWorkflows'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['listWorkflows'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
	it('getWorkflow validates documented input and response', () => {
		const input = ShortcutTestInputs['getWorkflow'];
		expect(ShortcutEndpointInputSchemas['getWorkflow'].parse(input)).toEqual(
			input,
		);
		const output = ShortcutTestOutputs['getWorkflow'];
		expect(ShortcutEndpointOutputSchemas['getWorkflow'].parse(output)).toEqual(
			output,
		);
		expect(
			ShortcutEndpointInputSchemas['getWorkflow'].safeParse({
				...input,
				undocumented: true,
			}).success,
		).toBe(false);
		expect(
			ShortcutEndpointOutputSchemas['getWorkflow'].safeParse(
				Symbol('invalid response'),
			).success,
		).toBe(false);
	});
});
