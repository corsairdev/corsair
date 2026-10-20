import {
	ClassifyOutput,
	EditFormField,
	EditOutput,
	ExtractCitation,
	ExtractOutput,
	ExtractRecord,
	Job,
	ParseBlock,
	ParseChunk,
	ParseOcrItem,
	PipelineOutput,
	SplitSegment,
} from './database';

export const ReductoSchema = {
	version: '1.3.0',
	entities: {
		jobs: Job,
		parseChunks: ParseChunk,
		parseBlocks: ParseBlock,
		parseOcrItems: ParseOcrItem,
		extractOutputs: ExtractOutput,
		extractRecords: ExtractRecord,
		extractCitations: ExtractCitation,
		splitSegments: SplitSegment,
		classifyOutputs: ClassifyOutput,
		editOutputs: EditOutput,
		editFormFields: EditFormField,
		pipelineOutputs: PipelineOutput,
	},
} as const;

export type {
	ClassifyOutput,
	EditFormField,
	EditOutput,
	ExtractCitation,
	ExtractOutput,
	ExtractRecord,
	Job,
	ParseBlock,
	ParseChunk,
	ParseOcrItem,
	PipelineOutput,
	SplitSegment,
} from './database';
