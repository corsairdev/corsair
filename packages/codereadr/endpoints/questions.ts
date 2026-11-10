import type { CodereadrEndpoints } from '..';
import { call, idList } from './call';
import { readCreatedId, shapeQuestions } from './shape';
import {
	CodereadrEndpointInputSchemas as Inputs,
	CodereadrEndpointOutputSchemas as Outputs,
} from './types';

export const list: CodereadrEndpoints['questionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'questions.list',
			input: Inputs.questionsList,
			output: Outputs.questionsList,
		},
		input,
		(parsed) => ({
			section: 'questions',
			action: 'retrieve',
			question_id: idList(parsed.question_id),
		}),
		{
			shape: (root) => shapeQuestions(root),
			log: (_, result) => ({ count: result.questions.length }),
			replaySafe: true,
		},
	);

export const create: CodereadrEndpoints['questionsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'questions.create',
			input: Inputs.questionsCreate,
			output: Outputs.questionsCreate,
		},
		input,
		(parsed) => ({
			section: 'questions',
			action: 'create',
			question_text: parsed.question_text,
			question_type: parsed.question_type,
		}),
		{
			shape: (root) => ({
				success: true,
				question_id: readCreatedId(root),
			}),
			log: (_, result) => ({ questionId: result.question_id }),
		},
	);
