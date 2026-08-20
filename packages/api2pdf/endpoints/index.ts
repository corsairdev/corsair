import * as Chrome from './chrome';
import * as LibreOffice from './libreoffice';
import * as PdfSharp from './pdfsharp';
import * as Utility from './utility';
import * as Zebra from './zebra';

export const UtilityEndpoints = {
	checkStatus: Utility.checkStatus,
	deletePdf: Utility.deletePdf,
};

export const PdfSharpEndpoints = {
	mergePdfs: PdfSharp.mergePdfs,
	extractPages: PdfSharp.extractPages,
	optimizePdf: PdfSharp.optimizePdf,
	watermarkPdf: PdfSharp.watermarkPdf,
};

export const ChromeEndpoints = {
	addHeaderFooter: Chrome.addHeaderFooter,
};

export const LibreOfficeEndpoints = {
	thumbnail: LibreOffice.thumbnail,
	pdfToHtml: LibreOffice.pdfToHtml,
};

export const ZebraEndpoints = {
	generateBarcode: Zebra.generateBarcode,
};

export * from './types';
