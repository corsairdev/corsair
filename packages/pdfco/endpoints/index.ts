import { fileUpload } from './file-upload';
import { pdfToJson } from './pdf-to-json';
import { pdfMerge } from './pdf-merge';
import { pdfSplit } from './pdf-split';
import { documentParser } from './document-parser';

export const PdfcoEndpointsImpl = {
	fileUpload,
	pdfToJson,
	pdfMerge,
	pdfSplit,
	documentParser,
};
