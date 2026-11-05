import {
	pdfToCsv,
	pdfToHtml,
	pdfToImage,
	pdfToText,
	pdfToXls,
	pdfToXlsx,
	pdfToXml,
} from './convert';
import {
	excelToCsv,
	excelToHtml,
	excelToJson,
	excelToText,
	excelToXml,
} from './convert-excel';
import { documentParser } from './document-parser';
import {
	pdfAdd,
	pdfDeletePages,
	pdfRotate,
	pdfSearchAndDeleteText,
	pdfSearchAndReplaceText,
} from './edit';
import { fileUpload } from './file-upload';
import { pdfFromEmail, pdfFromHtml, pdfFromText } from './from';
import {
	pdfChangeTextSearchable,
	pdfExtractAttachments,
	pdfFind,
	pdfFormsInfoReader,
	pdfInfoReader,
} from './info';
import {
	accountBalance,
	barcodeGenerate,
	fileUploadBase64,
	jobCheck,
} from './manage';
import { pdfMerge } from './pdf-merge';
import { pdfSplit } from './pdf-split';
import { pdfToJson } from './pdf-to-json';

export const PdfcoEndpointsImpl = {
	fileUpload,
	fileUploadBase64,
	pdfToJson,
	pdfToCsv,
	pdfToHtml,
	pdfToImage,
	pdfToText,
	pdfToXls,
	pdfToXlsx,
	pdfToXml,
	excelToCsv,
	excelToHtml,
	excelToJson,
	excelToText,
	excelToXml,
	pdfFromHtml,
	pdfFromEmail,
	pdfFromText,
	pdfAdd,
	pdfMerge,
	pdfSplit,
	pdfDeletePages,
	pdfRotate,
	pdfFind,
	pdfSearchAndReplaceText,
	pdfSearchAndDeleteText,
	pdfInfoReader,
	pdfFormsInfoReader,
	pdfExtractAttachments,
	pdfChangeTextSearchable,
	documentParser,
	jobCheck,
	barcodeGenerate,
	accountBalance,
};
