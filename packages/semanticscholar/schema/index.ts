import {
	SemanticScholarAuthor,
	SemanticScholarAuthorSummary,
	SemanticScholarAutocompleteMatch,
	SemanticScholarCitation,
	SemanticScholarDataset,
	SemanticScholarDatasetDiff,
	SemanticScholarDatasetRelease,
	SemanticScholarPaper,
	SemanticScholarReference,
	SemanticScholarSnippet,
} from './database';

export const SemanticScholarSchema = {
	version: '1.0.0',
	entities: {
		paper: SemanticScholarPaper,
		author: SemanticScholarAuthor,
		authorSummary: SemanticScholarAuthorSummary,
		citation: SemanticScholarCitation,
		reference: SemanticScholarReference,
		autocompleteMatch: SemanticScholarAutocompleteMatch,
		datasetRelease: SemanticScholarDatasetRelease,
		dataset: SemanticScholarDataset,
		datasetDiff: SemanticScholarDatasetDiff,
		snippet: SemanticScholarSnippet,
	},
} as const;
