import {
	EncodianEndpointInputSchemas,
	EncodianEndpointOutputSchemas,
} from './generated';
export const EncodianEndpointSchemas = {
	'barcodes.createBarcode': {
		input: EncodianEndpointInputSchemas['barcodes.createBarcode'],
		output: EncodianEndpointOutputSchemas['barcodes.createBarcode'],
	},
	'barcodes.readBarcodeFromDocument': {
		input: EncodianEndpointInputSchemas['barcodes.readBarcodeFromDocument'],
		output: EncodianEndpointOutputSchemas['barcodes.readBarcodeFromDocument'],
	},
	'barcodes.aiBarcodeRead': {
		input: EncodianEndpointInputSchemas['barcodes.aiBarcodeRead'],
		output: EncodianEndpointOutputSchemas['barcodes.aiBarcodeRead'],
	},
	'barcodes.readBarcodeFromImage': {
		input: EncodianEndpointInputSchemas['barcodes.readBarcodeFromImage'],
		output: EncodianEndpointOutputSchemas['barcodes.readBarcodeFromImage'],
	},
	'barcodes.createQrCode': {
		input: EncodianEndpointInputSchemas['barcodes.createQrCode'],
		output: EncodianEndpointOutputSchemas['barcodes.createQrCode'],
	},
	'barcodes.readQrCodeFromDocument': {
		input: EncodianEndpointInputSchemas['barcodes.readQrCodeFromDocument'],
		output: EncodianEndpointOutputSchemas['barcodes.readQrCodeFromDocument'],
	},
	'barcodes.readQrCodeFromImage': {
		input: EncodianEndpointInputSchemas['barcodes.readQrCodeFromImage'],
		output: EncodianEndpointOutputSchemas['barcodes.readQrCodeFromImage'],
	},
	'barcodes.createSwissQrCode': {
		input: EncodianEndpointInputSchemas['barcodes.createSwissQrCode'],
		output: EncodianEndpointOutputSchemas['barcodes.createSwissQrCode'],
	},
	'barcodes.readSwissQrCodesFromDocument': {
		input:
			EncodianEndpointInputSchemas['barcodes.readSwissQrCodesFromDocument'],
		output:
			EncodianEndpointOutputSchemas['barcodes.readSwissQrCodesFromDocument'],
	},
	'barcodes.readSwissQrCodeFromImage': {
		input: EncodianEndpointInputSchemas['barcodes.readSwissQrCodeFromImage'],
		output: EncodianEndpointOutputSchemas['barcodes.readSwissQrCodeFromImage'],
	},
	'conversion.convertCad': {
		input: EncodianEndpointInputSchemas['conversion.convertCad'],
		output: EncodianEndpointOutputSchemas['conversion.convertCad'],
	},
	'conversion.convertMailMessage': {
		input: EncodianEndpointInputSchemas['conversion.convertMailMessage'],
		output: EncodianEndpointOutputSchemas['conversion.convertMailMessage'],
	},
	'conversion.convertExcel': {
		input: EncodianEndpointInputSchemas['conversion.convertExcel'],
		output: EncodianEndpointOutputSchemas['conversion.convertExcel'],
	},
	'conversion.basicConversion': {
		input: EncodianEndpointInputSchemas['conversion.basicConversion'],
		output: EncodianEndpointOutputSchemas['conversion.basicConversion'],
	},
	'conversion.convertHeicToPdf': {
		input: EncodianEndpointInputSchemas['conversion.convertHeicToPdf'],
		output: EncodianEndpointOutputSchemas['conversion.convertHeicToPdf'],
	},
	'conversion.htmlToImage': {
		input: EncodianEndpointInputSchemas['conversion.htmlToImage'],
		output: EncodianEndpointOutputSchemas['conversion.htmlToImage'],
	},
	'conversion.htmlToPdf': {
		input: EncodianEndpointInputSchemas['conversion.htmlToPdf'],
		output: EncodianEndpointOutputSchemas['conversion.htmlToPdf'],
	},
	'conversion.htmlToPDFV2': {
		input: EncodianEndpointInputSchemas['conversion.htmlToPDFV2'],
		output: EncodianEndpointOutputSchemas['conversion.htmlToPDFV2'],
	},
	'conversion.htmlToWord': {
		input: EncodianEndpointInputSchemas['conversion.htmlToWord'],
		output: EncodianEndpointOutputSchemas['conversion.htmlToWord'],
	},
	'conversion.convertImageToPdf': {
		input: EncodianEndpointInputSchemas['conversion.convertImageToPdf'],
		output: EncodianEndpointOutputSchemas['conversion.convertImageToPdf'],
	},
	'conversion.convertJsonToExcel': {
		input: EncodianEndpointInputSchemas['conversion.convertJsonToExcel'],
		output: EncodianEndpointOutputSchemas['conversion.convertJsonToExcel'],
	},
	'conversion.convertPdfToExcel': {
		input: EncodianEndpointInputSchemas['conversion.convertPdfToExcel'],
		output: EncodianEndpointOutputSchemas['conversion.convertPdfToExcel'],
	},
	'conversion.convertPdfToImages': {
		input: EncodianEndpointInputSchemas['conversion.convertPdfToImages'],
		output: EncodianEndpointOutputSchemas['conversion.convertPdfToImages'],
	},
	'conversion.convertPdfToJpg': {
		input: EncodianEndpointInputSchemas['conversion.convertPdfToJpg'],
		output: EncodianEndpointOutputSchemas['conversion.convertPdfToJpg'],
	},
	'conversion.convertToPdfA': {
		input: EncodianEndpointInputSchemas['conversion.convertToPdfA'],
		output: EncodianEndpointOutputSchemas['conversion.convertToPdfA'],
	},
	'conversion.convertPdfToPng': {
		input: EncodianEndpointInputSchemas['conversion.convertPdfToPng'],
		output: EncodianEndpointOutputSchemas['conversion.convertPdfToPng'],
	},
	'conversion.convertPdfToTiff': {
		input: EncodianEndpointInputSchemas['conversion.convertPdfToTiff'],
		output: EncodianEndpointOutputSchemas['conversion.convertPdfToTiff'],
	},
	'conversion.convertPdfToWord': {
		input: EncodianEndpointInputSchemas['conversion.convertPdfToWord'],
		output: EncodianEndpointOutputSchemas['conversion.convertPdfToWord'],
	},
	'conversion.convertPowerPoint': {
		input: EncodianEndpointInputSchemas['conversion.convertPowerPoint'],
		output: EncodianEndpointOutputSchemas['conversion.convertPowerPoint'],
	},
	'conversion.textToPdf': {
		input: EncodianEndpointInputSchemas['conversion.textToPdf'],
		output: EncodianEndpointOutputSchemas['conversion.textToPdf'],
	},
	'conversion.convertVisio': {
		input: EncodianEndpointInputSchemas['conversion.convertVisio'],
		output: EncodianEndpointOutputSchemas['conversion.convertVisio'],
	},
	'conversion.convertWord': {
		input: EncodianEndpointInputSchemas['conversion.convertWord'],
		output: EncodianEndpointOutputSchemas['conversion.convertWord'],
	},
	'conversion.wordToPdfForm': {
		input: EncodianEndpointInputSchemas['conversion.wordToPdfForm'],
		output: EncodianEndpointOutputSchemas['conversion.wordToPdfForm'],
	},
	'excel.parseCsv': {
		input: EncodianEndpointInputSchemas['excel.parseCsv'],
		output: EncodianEndpointOutputSchemas['excel.parseCsv'],
	},
	'excel.excelAddImageHeaderOrFooter': {
		input: EncodianEndpointInputSchemas['excel.excelAddImageHeaderOrFooter'],
		output: EncodianEndpointOutputSchemas['excel.excelAddImageHeaderOrFooter'],
	},
	'excel.addRowsToExcel': {
		input: EncodianEndpointInputSchemas['excel.addRowsToExcel'],
		output: EncodianEndpointOutputSchemas['excel.addRowsToExcel'],
	},
	'excel.excelAddTextHeadersAndFooters': {
		input: EncodianEndpointInputSchemas['excel.excelAddTextHeadersAndFooters'],
		output:
			EncodianEndpointOutputSchemas['excel.excelAddTextHeadersAndFooters'],
	},
	'excel.excelWatermarkText': {
		input: EncodianEndpointInputSchemas['excel.excelWatermarkText'],
		output: EncodianEndpointOutputSchemas['excel.excelWatermarkText'],
	},
	'excel.deleteRowsFromExcel': {
		input: EncodianEndpointInputSchemas['excel.deleteRowsFromExcel'],
		output: EncodianEndpointOutputSchemas['excel.deleteRowsFromExcel'],
	},
	'excel.deleteExcelWorksheets': {
		input: EncodianEndpointInputSchemas['excel.deleteExcelWorksheets'],
		output: EncodianEndpointOutputSchemas['excel.deleteExcelWorksheets'],
	},
	'excel.getRowsFromExcel': {
		input: EncodianEndpointInputSchemas['excel.getRowsFromExcel'],
		output: EncodianEndpointOutputSchemas['excel.getRowsFromExcel'],
	},
	'excel.extractExcelWorksheets': {
		input: EncodianEndpointInputSchemas['excel.extractExcelWorksheets'],
		output: EncodianEndpointOutputSchemas['excel.extractExcelWorksheets'],
	},
	'excel.mergeArrayOfExcelDocuments': {
		input: EncodianEndpointInputSchemas['excel.mergeArrayOfExcelDocuments'],
		output: EncodianEndpointOutputSchemas['excel.mergeArrayOfExcelDocuments'],
	},
	'excel.mergeExcelRows': {
		input: EncodianEndpointInputSchemas['excel.mergeExcelRows'],
		output: EncodianEndpointOutputSchemas['excel.mergeExcelRows'],
	},
	'excel.excelMergeWorksheets': {
		input: EncodianEndpointInputSchemas['excel.excelMergeWorksheets'],
		output: EncodianEndpointOutputSchemas['excel.excelMergeWorksheets'],
	},
	'excel.populateExcel': {
		input: EncodianEndpointInputSchemas['excel.populateExcel'],
		output: EncodianEndpointOutputSchemas['excel.populateExcel'],
	},
	'excel.excelRemoveHeadersAndFooters': {
		input: EncodianEndpointInputSchemas['excel.excelRemoveHeadersAndFooters'],
		output: EncodianEndpointOutputSchemas['excel.excelRemoveHeadersAndFooters'],
	},
	'excel.excelWatermarkTextRemove': {
		input: EncodianEndpointInputSchemas['excel.excelWatermarkTextRemove'],
		output: EncodianEndpointOutputSchemas['excel.excelWatermarkTextRemove'],
	},
	'excel.excelRenameWorksheets': {
		input: EncodianEndpointInputSchemas['excel.excelRenameWorksheets'],
		output: EncodianEndpointOutputSchemas['excel.excelRenameWorksheets'],
	},
	'excel.excelReplaceText': {
		input: EncodianEndpointInputSchemas['excel.excelReplaceText'],
		output: EncodianEndpointOutputSchemas['excel.excelReplaceText'],
	},
	'excel.secureExcel': {
		input: EncodianEndpointInputSchemas['excel.secureExcel'],
		output: EncodianEndpointOutputSchemas['excel.secureExcel'],
	},
	'excel.excelSeparateWorksheets': {
		input: EncodianEndpointInputSchemas['excel.excelSeparateWorksheets'],
		output: EncodianEndpointOutputSchemas['excel.excelSeparateWorksheets'],
	},
	'excel.unlockExcel': {
		input: EncodianEndpointInputSchemas['excel.unlockExcel'],
		output: EncodianEndpointOutputSchemas['excel.unlockExcel'],
	},
	'excel.updateRowsInExcel': {
		input: EncodianEndpointInputSchemas['excel.updateRowsInExcel'],
		output: EncodianEndpointOutputSchemas['excel.updateRowsInExcel'],
	},
	'general.aiProcessBankCheckUs': {
		input: EncodianEndpointInputSchemas['general.aiProcessBankCheckUs'],
		output: EncodianEndpointOutputSchemas['general.aiProcessBankCheckUs'],
	},
	'general.aiProcessBankStatementUs': {
		input: EncodianEndpointInputSchemas['general.aiProcessBankStatementUs'],
		output: EncodianEndpointOutputSchemas['general.aiProcessBankStatementUs'],
	},
	'general.aiProcessContract': {
		input: EncodianEndpointInputSchemas['general.aiProcessContract'],
		output: EncodianEndpointOutputSchemas['general.aiProcessContract'],
	},
	'general.aiProcessCreditCard': {
		input: EncodianEndpointInputSchemas['general.aiProcessCreditCard'],
		output: EncodianEndpointOutputSchemas['general.aiProcessCreditCard'],
	},
	'general.aiProcessHealthInsuranceCardUs': {
		input:
			EncodianEndpointInputSchemas['general.aiProcessHealthInsuranceCardUs'],
		output:
			EncodianEndpointOutputSchemas['general.aiProcessHealthInsuranceCardUs'],
	},
	'general.aiProcessIDDocument': {
		input: EncodianEndpointInputSchemas['general.aiProcessIDDocument'],
		output: EncodianEndpointOutputSchemas['general.aiProcessIDDocument'],
	},
	'general.aiProcessInvoice': {
		input: EncodianEndpointInputSchemas['general.aiProcessInvoice'],
		output: EncodianEndpointOutputSchemas['general.aiProcessInvoice'],
	},
	'general.aiProcessMarriageCertificateUs': {
		input:
			EncodianEndpointInputSchemas['general.aiProcessMarriageCertificateUs'],
		output:
			EncodianEndpointOutputSchemas['general.aiProcessMarriageCertificateUs'],
	},
	'general.aiProcessMortgageUs': {
		input: EncodianEndpointInputSchemas['general.aiProcessMortgageUs'],
		output: EncodianEndpointOutputSchemas['general.aiProcessMortgageUs'],
	},
	'general.aiProcessPayStubUs': {
		input: EncodianEndpointInputSchemas['general.aiProcessPayStubUs'],
		output: EncodianEndpointOutputSchemas['general.aiProcessPayStubUs'],
	},
	'general.aiProcessReceipt': {
		input: EncodianEndpointInputSchemas['general.aiProcessReceipt'],
		output: EncodianEndpointOutputSchemas['general.aiProcessReceipt'],
	},
	'general.aiProcessTaxUs': {
		input: EncodianEndpointInputSchemas['general.aiProcessTaxUs'],
		output: EncodianEndpointOutputSchemas['general.aiProcessTaxUs'],
	},
	'general.aiRunPromptText': {
		input: EncodianEndpointInputSchemas['general.aiRunPromptText'],
		output: EncodianEndpointOutputSchemas['general.aiRunPromptText'],
	},
	'general.aiSpeechToText': {
		input: EncodianEndpointInputSchemas['general.aiSpeechToText'],
		output: EncodianEndpointOutputSchemas['general.aiSpeechToText'],
	},
	'general.aiTranslateFile': {
		input: EncodianEndpointInputSchemas['general.aiTranslateFile'],
		output: EncodianEndpointOutputSchemas['general.aiTranslateFile'],
	},
	'general.aiTranslateTextMultiple': {
		input: EncodianEndpointInputSchemas['general.aiTranslateTextMultiple'],
		output: EncodianEndpointOutputSchemas['general.aiTranslateTextMultiple'],
	},
	'general.aiTranslateText': {
		input: EncodianEndpointInputSchemas['general.aiTranslateText'],
		output: EncodianEndpointOutputSchemas['general.aiTranslateText'],
	},
	'general.addToZip': {
		input: EncodianEndpointInputSchemas['general.addToZip'],
		output: EncodianEndpointOutputSchemas['general.addToZip'],
	},
	'general.extractFromArchive': {
		input: EncodianEndpointInputSchemas['general.extractFromArchive'],
		output: EncodianEndpointOutputSchemas['general.extractFromArchive'],
	},
	'general.extractFromArchiveV2': {
		input: EncodianEndpointInputSchemas['general.extractFromArchiveV2'],
		output: EncodianEndpointOutputSchemas['general.extractFromArchiveV2'],
	},
	'general.getEmailAttachments': {
		input: EncodianEndpointInputSchemas['general.getEmailAttachments'],
		output: EncodianEndpointOutputSchemas['general.getEmailAttachments'],
	},
	'general.getEmailInfo': {
		input: EncodianEndpointInputSchemas['general.getEmailInfo'],
		output: EncodianEndpointOutputSchemas['general.getEmailInfo'],
	},
	'general.searchAndReplaceText': {
		input: EncodianEndpointInputSchemas['general.searchAndReplaceText'],
		output: EncodianEndpointOutputSchemas['general.searchAndReplaceText'],
	},
	'general.searchAndReplaceTextWithImage': {
		input:
			EncodianEndpointInputSchemas['general.searchAndReplaceTextWithImage'],
		output:
			EncodianEndpointOutputSchemas['general.searchAndReplaceTextWithImage'],
	},
	'general.buyAdditionalCredits': {
		input: EncodianEndpointInputSchemas['general.buyAdditionalCredits'],
		output: EncodianEndpointOutputSchemas['general.buyAdditionalCredits'],
	},
	'general.getSubscriptionStatus': {
		input: EncodianEndpointInputSchemas['general.getSubscriptionStatus'],
		output: EncodianEndpointOutputSchemas['general.getSubscriptionStatus'],
	},
	'trigr.getTrigrSubscriptionStatus': {
		input: EncodianEndpointInputSchemas['trigr.getTrigrSubscriptionStatus'],
		output: EncodianEndpointOutputSchemas['trigr.getTrigrSubscriptionStatus'],
	},
	'image.addImageWatermarkToImage': {
		input: EncodianEndpointInputSchemas['image.addImageWatermarkToImage'],
		output: EncodianEndpointOutputSchemas['image.addImageWatermarkToImage'],
	},
	'image.addTextWatermarkToImage': {
		input: EncodianEndpointInputSchemas['image.addTextWatermarkToImage'],
		output: EncodianEndpointOutputSchemas['image.addTextWatermarkToImage'],
	},
	'image.imageCleanUpDocument': {
		input: EncodianEndpointInputSchemas['image.imageCleanUpDocument'],
		output: EncodianEndpointOutputSchemas['image.imageCleanUpDocument'],
	},
	'image.imageCleanUpPhoto': {
		input: EncodianEndpointInputSchemas['image.imageCleanUpPhoto'],
		output: EncodianEndpointOutputSchemas['image.imageCleanUpPhoto'],
	},
	'image.compressImage': {
		input: EncodianEndpointInputSchemas['image.compressImage'],
		output: EncodianEndpointOutputSchemas['image.compressImage'],
	},
	'image.imageConvertFormat': {
		input: EncodianEndpointInputSchemas['image.imageConvertFormat'],
		output: EncodianEndpointOutputSchemas['image.imageConvertFormat'],
	},
	'image.imageConvertToGrayscale': {
		input: EncodianEndpointInputSchemas['image.imageConvertToGrayscale'],
		output: EncodianEndpointOutputSchemas['image.imageConvertToGrayscale'],
	},
	'image.cropImage': {
		input: EncodianEndpointInputSchemas['image.cropImage'],
		output: EncodianEndpointOutputSchemas['image.cropImage'],
	},
	'image.getImageInfo': {
		input: EncodianEndpointInputSchemas['image.getImageInfo'],
		output: EncodianEndpointOutputSchemas['image.getImageInfo'],
	},
	'image.imageExtractText': {
		input: EncodianEndpointInputSchemas['image.imageExtractText'],
		output: EncodianEndpointOutputSchemas['image.imageExtractText'],
	},
	'image.flipImage': {
		input: EncodianEndpointInputSchemas['image.flipImage'],
		output: EncodianEndpointOutputSchemas['image.flipImage'],
	},
	'image.imageRemoveExifTags': {
		input: EncodianEndpointInputSchemas['image.imageRemoveExifTags'],
		output: EncodianEndpointOutputSchemas['image.imageRemoveExifTags'],
	},
	'image.resizeImage': {
		input: EncodianEndpointInputSchemas['image.resizeImage'],
		output: EncodianEndpointOutputSchemas['image.resizeImage'],
	},
	'image.rotateImage': {
		input: EncodianEndpointInputSchemas['image.rotateImage'],
		output: EncodianEndpointOutputSchemas['image.rotateImage'],
	},
	'image.rotateImageByExifData': {
		input: EncodianEndpointInputSchemas['image.rotateImageByExifData'],
		output: EncodianEndpointOutputSchemas['image.rotateImageByExifData'],
	},
	'pdf.addAttachmentsToPdf': {
		input: EncodianEndpointInputSchemas['pdf.addAttachmentsToPdf'],
		output: EncodianEndpointOutputSchemas['pdf.addAttachmentsToPdf'],
	},
	'pdf.addHtmlHeaderFooter': {
		input: EncodianEndpointInputSchemas['pdf.addHtmlHeaderFooter'],
		output: EncodianEndpointOutputSchemas['pdf.addHtmlHeaderFooter'],
	},
	'pdf.addImageWatermark': {
		input: EncodianEndpointInputSchemas['pdf.addImageWatermark'],
		output: EncodianEndpointOutputSchemas['pdf.addImageWatermark'],
	},
	'pdf.addImageWatermarkAdvanced': {
		input: EncodianEndpointInputSchemas['pdf.addImageWatermarkAdvanced'],
		output: EncodianEndpointOutputSchemas['pdf.addImageWatermarkAdvanced'],
	},
	'pdf.addPageNumbers': {
		input: EncodianEndpointInputSchemas['pdf.addPageNumbers'],
		output: EncodianEndpointOutputSchemas['pdf.addPageNumbers'],
	},
	'pdf.addTextWatermark': {
		input: EncodianEndpointInputSchemas['pdf.addTextWatermark'],
		output: EncodianEndpointOutputSchemas['pdf.addTextWatermark'],
	},
	'pdf.addTextWatermarkAdvanced': {
		input: EncodianEndpointInputSchemas['pdf.addTextWatermarkAdvanced'],
		output: EncodianEndpointOutputSchemas['pdf.addTextWatermarkAdvanced'],
	},
	'pdf.aiOcrPdfDocument': {
		input: EncodianEndpointInputSchemas['pdf.aiOcrPdfDocument'],
		output: EncodianEndpointOutputSchemas['pdf.aiOcrPdfDocument'],
	},
	'pdf.ocrPdfDocument': {
		input: EncodianEndpointInputSchemas['pdf.ocrPdfDocument'],
		output: EncodianEndpointOutputSchemas['pdf.ocrPdfDocument'],
	},
	'pdf.pdfCheckPassword': {
		input: EncodianEndpointInputSchemas['pdf.pdfCheckPassword'],
		output: EncodianEndpointOutputSchemas['pdf.pdfCheckPassword'],
	},
	'pdf.compressPdf': {
		input: EncodianEndpointInputSchemas['pdf.compressPdf'],
		output: EncodianEndpointOutputSchemas['pdf.compressPdf'],
	},
	'pdf.pdfCreateZUGFeRDInvoice': {
		input: EncodianEndpointInputSchemas['pdf.pdfCreateZUGFeRDInvoice'],
		output: EncodianEndpointOutputSchemas['pdf.pdfCreateZUGFeRDInvoice'],
	},
	'pdf.pdfDeleteBlankPages': {
		input: EncodianEndpointInputSchemas['pdf.pdfDeleteBlankPages'],
		output: EncodianEndpointOutputSchemas['pdf.pdfDeleteBlankPages'],
	},
	'pdf.deletePdfPages': {
		input: EncodianEndpointInputSchemas['pdf.deletePdfPages'],
		output: EncodianEndpointOutputSchemas['pdf.deletePdfPages'],
	},
	'pdf.extractAttachmentsFromPdf': {
		input: EncodianEndpointInputSchemas['pdf.extractAttachmentsFromPdf'],
		output: EncodianEndpointOutputSchemas['pdf.extractAttachmentsFromPdf'],
	},
	'pdf.getPdfFormData': {
		input: EncodianEndpointInputSchemas['pdf.getPdfFormData'],
		output: EncodianEndpointOutputSchemas['pdf.getPdfFormData'],
	},
	'pdf.pdfExtractHyperlinks': {
		input: EncodianEndpointInputSchemas['pdf.pdfExtractHyperlinks'],
		output: EncodianEndpointOutputSchemas['pdf.pdfExtractHyperlinks'],
	},
	'pdf.extractImagesAll': {
		input: EncodianEndpointInputSchemas['pdf.extractImagesAll'],
		output: EncodianEndpointOutputSchemas['pdf.extractImagesAll'],
	},
	'pdf.extractImages': {
		input: EncodianEndpointInputSchemas['pdf.extractImages'],
		output: EncodianEndpointOutputSchemas['pdf.extractImages'],
	},
	'pdf.getPdfDocumentInfo': {
		input: EncodianEndpointInputSchemas['pdf.getPdfDocumentInfo'],
		output: EncodianEndpointOutputSchemas['pdf.getPdfDocumentInfo'],
	},
	'pdf.extractPdfPages': {
		input: EncodianEndpointInputSchemas['pdf.extractPdfPages'],
		output: EncodianEndpointOutputSchemas['pdf.extractPdfPages'],
	},
	'pdf.extractPdfPagesByText': {
		input: EncodianEndpointInputSchemas['pdf.extractPdfPagesByText'],
		output: EncodianEndpointOutputSchemas['pdf.extractPdfPagesByText'],
	},
	'pdf.pdfExtractTableData': {
		input: EncodianEndpointInputSchemas['pdf.pdfExtractTableData'],
		output: EncodianEndpointOutputSchemas['pdf.pdfExtractTableData'],
	},
	'pdf.getPdfTextLayer': {
		input: EncodianEndpointInputSchemas['pdf.getPdfTextLayer'],
		output: EncodianEndpointOutputSchemas['pdf.getPdfTextLayer'],
	},
	'pdf.pdfExtractTextByPage': {
		input: EncodianEndpointInputSchemas['pdf.pdfExtractTextByPage'],
		output: EncodianEndpointOutputSchemas['pdf.pdfExtractTextByPage'],
	},
	'pdf.extractTextRegions': {
		input: EncodianEndpointInputSchemas['pdf.extractTextRegions'],
		output: EncodianEndpointOutputSchemas['pdf.extractTextRegions'],
	},
	'pdf.fillPdfForm': {
		input: EncodianEndpointInputSchemas['pdf.fillPdfForm'],
		output: EncodianEndpointOutputSchemas['pdf.fillPdfForm'],
	},
	'pdf.flattenPdf': {
		input: EncodianEndpointInputSchemas['pdf.flattenPdf'],
		output: EncodianEndpointOutputSchemas['pdf.flattenPdf'],
	},
	'pdf.pdfFlattenFields': {
		input: EncodianEndpointInputSchemas['pdf.pdfFlattenFields'],
		output: EncodianEndpointOutputSchemas['pdf.pdfFlattenFields'],
	},
	'pdf.pdfGenerateBookmarks': {
		input: EncodianEndpointInputSchemas['pdf.pdfGenerateBookmarks'],
		output: EncodianEndpointOutputSchemas['pdf.pdfGenerateBookmarks'],
	},
	'pdf.insertHtmlToPdf': {
		input: EncodianEndpointInputSchemas['pdf.insertHtmlToPdf'],
		output: EncodianEndpointOutputSchemas['pdf.insertHtmlToPdf'],
	},
	'pdf.pdfInsertPages': {
		input: EncodianEndpointInputSchemas['pdf.pdfInsertPages'],
		output: EncodianEndpointOutputSchemas['pdf.pdfInsertPages'],
	},
	'pdf.pdfInsertToc': {
		input: EncodianEndpointInputSchemas['pdf.pdfInsertToc'],
		output: EncodianEndpointOutputSchemas['pdf.pdfInsertToc'],
	},
	'pdf.pdfLinearize': {
		input: EncodianEndpointInputSchemas['pdf.pdfLinearize'],
		output: EncodianEndpointOutputSchemas['pdf.pdfLinearize'],
	},
	'pdf.mergeArrayOfDocumentsToPdf': {
		input: EncodianEndpointInputSchemas['pdf.mergeArrayOfDocumentsToPdf'],
		output: EncodianEndpointOutputSchemas['pdf.mergeArrayOfDocumentsToPdf'],
	},
	'pdf.mergeDocumentsToPdf': {
		input: EncodianEndpointInputSchemas['pdf.mergeDocumentsToPdf'],
		output: EncodianEndpointOutputSchemas['pdf.mergeDocumentsToPdf'],
	},
	'pdf.redactPdf': {
		input: EncodianEndpointInputSchemas['pdf.redactPdf'],
		output: EncodianEndpointOutputSchemas['pdf.redactPdf'],
	},
	'pdf.pdfRemoveDigitalSignature': {
		input: EncodianEndpointInputSchemas['pdf.pdfRemoveDigitalSignature'],
		output: EncodianEndpointOutputSchemas['pdf.pdfRemoveDigitalSignature'],
	},
	'pdf.removeWatermarksFromPdf': {
		input: EncodianEndpointInputSchemas['pdf.removeWatermarksFromPdf'],
		output: EncodianEndpointOutputSchemas['pdf.removeWatermarksFromPdf'],
	},
	'pdf.repairPdf': {
		input: EncodianEndpointInputSchemas['pdf.repairPdf'],
		output: EncodianEndpointOutputSchemas['pdf.repairPdf'],
	},
	'pdf.pdfReplaceTextWithImage': {
		input: EncodianEndpointInputSchemas['pdf.pdfReplaceTextWithImage'],
		output: EncodianEndpointOutputSchemas['pdf.pdfReplaceTextWithImage'],
	},
	'pdf.resizePdf': {
		input: EncodianEndpointInputSchemas['pdf.resizePdf'],
		output: EncodianEndpointOutputSchemas['pdf.resizePdf'],
	},
	'pdf.rotatePdfPages': {
		input: EncodianEndpointInputSchemas['pdf.rotatePdfPages'],
		output: EncodianEndpointOutputSchemas['pdf.rotatePdfPages'],
	},
	'pdf.pdfSearchAndReplaceText': {
		input: EncodianEndpointInputSchemas['pdf.pdfSearchAndReplaceText'],
		output: EncodianEndpointOutputSchemas['pdf.pdfSearchAndReplaceText'],
	},
	'pdf.securePdfDocument': {
		input: EncodianEndpointInputSchemas['pdf.securePdfDocument'],
		output: EncodianEndpointOutputSchemas['pdf.securePdfDocument'],
	},
	'pdf.pdfSetMetadata': {
		input: EncodianEndpointInputSchemas['pdf.pdfSetMetadata'],
		output: EncodianEndpointOutputSchemas['pdf.pdfSetMetadata'],
	},
	'pdf.setPdfPrivileges': {
		input: EncodianEndpointInputSchemas['pdf.setPdfPrivileges'],
		output: EncodianEndpointOutputSchemas['pdf.setPdfPrivileges'],
	},
	'pdf.signPdf': {
		input: EncodianEndpointInputSchemas['pdf.signPdf'],
		output: EncodianEndpointOutputSchemas['pdf.signPdf'],
	},
	'pdf.splitDocument': {
		input: EncodianEndpointInputSchemas['pdf.splitDocument'],
		output: EncodianEndpointOutputSchemas['pdf.splitDocument'],
	},
	'pdf.splitPdfByBarcode': {
		input: EncodianEndpointInputSchemas['pdf.splitPdfByBarcode'],
		output: EncodianEndpointOutputSchemas['pdf.splitPdfByBarcode'],
	},
	'pdf.splitPdfByText': {
		input: EncodianEndpointInputSchemas['pdf.splitPdfByText'],
		output: EncodianEndpointOutputSchemas['pdf.splitPdfByText'],
	},
	'pdf.unlockPdfDocument': {
		input: EncodianEndpointInputSchemas['pdf.unlockPdfDocument'],
		output: EncodianEndpointOutputSchemas['pdf.unlockPdfDocument'],
	},
	'pdf.pdfUpdateHyperlinks': {
		input: EncodianEndpointInputSchemas['pdf.pdfUpdateHyperlinks'],
		output: EncodianEndpointOutputSchemas['pdf.pdfUpdateHyperlinks'],
	},
	'pdf.validatePdfTextLayer': {
		input: EncodianEndpointInputSchemas['pdf.validatePdfTextLayer'],
		output: EncodianEndpointOutputSchemas['pdf.validatePdfTextLayer'],
	},
	'powerPoint.compressPowerPoint': {
		input: EncodianEndpointInputSchemas['powerPoint.compressPowerPoint'],
		output: EncodianEndpointOutputSchemas['powerPoint.compressPowerPoint'],
	},
	'powerPoint.powerPointDeleteSlides': {
		input: EncodianEndpointInputSchemas['powerPoint.powerPointDeleteSlides'],
		output: EncodianEndpointOutputSchemas['powerPoint.powerPointDeleteSlides'],
	},
	'powerPoint.mergePresentations': {
		input: EncodianEndpointInputSchemas['powerPoint.mergePresentations'],
		output: EncodianEndpointOutputSchemas['powerPoint.mergePresentations'],
	},
	'powerPoint.populatePowerPoint': {
		input: EncodianEndpointInputSchemas['powerPoint.populatePowerPoint'],
		output: EncodianEndpointOutputSchemas['powerPoint.populatePowerPoint'],
	},
	'powerPoint.powerPointSearchAndReplaceText': {
		input:
			EncodianEndpointInputSchemas['powerPoint.powerPointSearchAndReplaceText'],
		output:
			EncodianEndpointOutputSchemas[
				'powerPoint.powerPointSearchAndReplaceText'
			],
	},
	'powerPoint.powerPointSplit': {
		input: EncodianEndpointInputSchemas['powerPoint.powerPointSplit'],
		output: EncodianEndpointOutputSchemas['powerPoint.powerPointSplit'],
	},
	'utilities.aesEncryption': {
		input: EncodianEndpointInputSchemas['utilities.aesEncryption'],
		output: EncodianEndpointOutputSchemas['utilities.aesEncryption'],
	},
	'utilities.aesDecryption': {
		input: EncodianEndpointInputSchemas['utilities.aesDecryption'],
		output: EncodianEndpointOutputSchemas['utilities.aesDecryption'],
	},
	'utilities.arrayAddItems': {
		input: EncodianEndpointInputSchemas['utilities.arrayAddItems'],
		output: EncodianEndpointOutputSchemas['utilities.arrayAddItems'],
	},
	'utilities.arrayCombine': {
		input: EncodianEndpointInputSchemas['utilities.arrayCombine'],
		output: EncodianEndpointOutputSchemas['utilities.arrayCombine'],
	},
	'utilities.arrayContainsValue': {
		input: EncodianEndpointInputSchemas['utilities.arrayContainsValue'],
		output: EncodianEndpointOutputSchemas['utilities.arrayContainsValue'],
	},
	'utilities.arrayCountItems': {
		input: EncodianEndpointInputSchemas['utilities.arrayCountItems'],
		output: EncodianEndpointOutputSchemas['utilities.arrayCountItems'],
	},
	'utilities.arrayFilterItems': {
		input: EncodianEndpointInputSchemas['utilities.arrayFilterItems'],
		output: EncodianEndpointOutputSchemas['utilities.arrayFilterItems'],
	},
	'utilities.arrayGetItems': {
		input: EncodianEndpointInputSchemas['utilities.arrayGetItems'],
		output: EncodianEndpointOutputSchemas['utilities.arrayGetItems'],
	},
	'utilities.arrayFilterItemsViaRegex': {
		input: EncodianEndpointInputSchemas['utilities.arrayFilterItemsViaRegex'],
		output: EncodianEndpointOutputSchemas['utilities.arrayFilterItemsViaRegex'],
	},
	'utilities.arrayMerge': {
		input: EncodianEndpointInputSchemas['utilities.arrayMerge'],
		output: EncodianEndpointOutputSchemas['utilities.arrayMerge'],
	},
	'utilities.arrayRemoveDuplicates': {
		input: EncodianEndpointInputSchemas['utilities.arrayRemoveDuplicates'],
		output: EncodianEndpointOutputSchemas['utilities.arrayRemoveDuplicates'],
	},
	'utilities.arrayRemoveItems': {
		input: EncodianEndpointInputSchemas['utilities.arrayRemoveItems'],
		output: EncodianEndpointOutputSchemas['utilities.arrayRemoveItems'],
	},
	'utilities.arrayRemoveItemsRegex': {
		input: EncodianEndpointInputSchemas['utilities.arrayRemoveItemsRegex'],
		output: EncodianEndpointOutputSchemas['utilities.arrayRemoveItemsRegex'],
	},
	'utilities.arrayReplaceValues': {
		input: EncodianEndpointInputSchemas['utilities.arrayReplaceValues'],
		output: EncodianEndpointOutputSchemas['utilities.arrayReplaceValues'],
	},
	'utilities.arrayReverseItems': {
		input: EncodianEndpointInputSchemas['utilities.arrayReverseItems'],
		output: EncodianEndpointOutputSchemas['utilities.arrayReverseItems'],
	},
	'utilities.arraySortItems': {
		input: EncodianEndpointInputSchemas['utilities.arraySortItems'],
		output: EncodianEndpointOutputSchemas['utilities.arraySortItems'],
	},
	'utilities.arraySplitItems': {
		input: EncodianEndpointInputSchemas['utilities.arraySplitItems'],
		output: EncodianEndpointOutputSchemas['utilities.arraySplitItems'],
	},
	'utilities.arrayConvertToJson': {
		input: EncodianEndpointInputSchemas['utilities.arrayConvertToJson'],
		output: EncodianEndpointOutputSchemas['utilities.arrayConvertToJson'],
	},
	'utilities.arrayConvertToXml': {
		input: EncodianEndpointInputSchemas['utilities.arrayConvertToXml'],
		output: EncodianEndpointOutputSchemas['utilities.arrayConvertToXml'],
	},
	'utilities.calculateDate': {
		input: EncodianEndpointInputSchemas['utilities.calculateDate'],
		output: EncodianEndpointOutputSchemas['utilities.calculateDate'],
	},
	'utilities.cleanString': {
		input: EncodianEndpointInputSchemas['utilities.cleanString'],
		output: EncodianEndpointOutputSchemas['utilities.cleanString'],
	},
	'utilities.compareText': {
		input: EncodianEndpointInputSchemas['utilities.compareText'],
		output: EncodianEndpointOutputSchemas['utilities.compareText'],
	},
	'utilities.concatenateText': {
		input: EncodianEndpointInputSchemas['utilities.concatenateText'],
		output: EncodianEndpointOutputSchemas['utilities.concatenateText'],
	},
	'utilities.convertJsonToXml': {
		input: EncodianEndpointInputSchemas['utilities.convertJsonToXml'],
		output: EncodianEndpointOutputSchemas['utilities.convertJsonToXml'],
	},
	'utilities.convertTimeZoneEnc': {
		input: EncodianEndpointInputSchemas['utilities.convertTimeZoneEnc'],
		output: EncodianEndpointOutputSchemas['utilities.convertTimeZoneEnc'],
	},
	'utilities.convertXmlToJson': {
		input: EncodianEndpointInputSchemas['utilities.convertXmlToJson'],
		output: EncodianEndpointOutputSchemas['utilities.convertXmlToJson'],
	},
	'utilities.createGuid': {
		input: EncodianEndpointInputSchemas['utilities.createGuid'],
		output: EncodianEndpointOutputSchemas['utilities.createGuid'],
	},
	'utilities.createHashCodeV2': {
		input: EncodianEndpointInputSchemas['utilities.createHashCodeV2'],
		output: EncodianEndpointOutputSchemas['utilities.createHashCodeV2'],
	},
	'utilities.createHMACV2': {
		input: EncodianEndpointInputSchemas['utilities.createHMACV2'],
		output: EncodianEndpointOutputSchemas['utilities.createHMACV2'],
	},
	'utilities.createJwt': {
		input: EncodianEndpointInputSchemas['utilities.createJwt'],
		output: EncodianEndpointOutputSchemas['utilities.createJwt'],
	},
	'utilities.escapeHtml': {
		input: EncodianEndpointInputSchemas['utilities.escapeHtml'],
		output: EncodianEndpointOutputSchemas['utilities.escapeHtml'],
	},
	'utilities.extractEmailAddressesFromText': {
		input:
			EncodianEndpointInputSchemas['utilities.extractEmailAddressesFromText'],
		output:
			EncodianEndpointOutputSchemas['utilities.extractEmailAddressesFromText'],
	},
	'utilities.extractTextBetweenValues': {
		input: EncodianEndpointInputSchemas['utilities.extractTextBetweenValues'],
		output: EncodianEndpointOutputSchemas['utilities.extractTextBetweenValues'],
	},
	'utilities.extractAllTextInstancesBetweenValues': {
		input:
			EncodianEndpointInputSchemas[
				'utilities.extractAllTextInstancesBetweenValues'
			],
		output:
			EncodianEndpointOutputSchemas[
				'utilities.extractAllTextInstancesBetweenValues'
			],
	},
	'utilities.extractUrlsFromText': {
		input: EncodianEndpointInputSchemas['utilities.extractUrlsFromText'],
		output: EncodianEndpointOutputSchemas['utilities.extractUrlsFromText'],
	},
	'utilities.formatDate': {
		input: EncodianEndpointInputSchemas['utilities.formatDate'],
		output: EncodianEndpointOutputSchemas['utilities.formatDate'],
	},
	'utilities.formatTextCase': {
		input: EncodianEndpointInputSchemas['utilities.formatTextCase'],
		output: EncodianEndpointOutputSchemas['utilities.formatTextCase'],
	},
	'utilities.generatePassword': {
		input: EncodianEndpointInputSchemas['utilities.generatePassword'],
		output: EncodianEndpointOutputSchemas['utilities.generatePassword'],
	},
	'utilities.generateRandomNumber': {
		input: EncodianEndpointInputSchemas['utilities.generateRandomNumber'],
		output: EncodianEndpointOutputSchemas['utilities.generateRandomNumber'],
	},
	'utilities.getDateTimeDifference': {
		input: EncodianEndpointInputSchemas['utilities.getDateTimeDifference'],
		output: EncodianEndpointOutputSchemas['utilities.getDateTimeDifference'],
	},
	'utilities.getFileExtension': {
		input: EncodianEndpointInputSchemas['utilities.getFileExtension'],
		output: EncodianEndpointOutputSchemas['utilities.getFileExtension'],
	},
	'utilities.getFileFormat': {
		input: EncodianEndpointInputSchemas['utilities.getFileFormat'],
		output: EncodianEndpointOutputSchemas['utilities.getFileFormat'],
	},
	'utilities.parseHtmlTable': {
		input: EncodianEndpointInputSchemas['utilities.parseHtmlTable'],
		output: EncodianEndpointOutputSchemas['utilities.parseHtmlTable'],
	},
	'utilities.removeDiacritics': {
		input: EncodianEndpointInputSchemas['utilities.removeDiacritics'],
		output: EncodianEndpointOutputSchemas['utilities.removeDiacritics'],
	},
	'utilities.removeTextBetweenValues': {
		input: EncodianEndpointInputSchemas['utilities.removeTextBetweenValues'],
		output: EncodianEndpointOutputSchemas['utilities.removeTextBetweenValues'],
	},
	'utilities.removeWhitespaceFromText': {
		input: EncodianEndpointInputSchemas['utilities.removeWhitespaceFromText'],
		output: EncodianEndpointOutputSchemas['utilities.removeWhitespaceFromText'],
	},
	'utilities.replaceValueWithRegex': {
		input: EncodianEndpointInputSchemas['utilities.replaceValueWithRegex'],
		output: EncodianEndpointOutputSchemas['utilities.replaceValueWithRegex'],
	},
	'utilities.replaceValueWithText': {
		input: EncodianEndpointInputSchemas['utilities.replaceValueWithText'],
		output: EncodianEndpointOutputSchemas['utilities.replaceValueWithText'],
	},
	'utilities.rsaEncryption': {
		input: EncodianEndpointInputSchemas['utilities.rsaEncryption'],
		output: EncodianEndpointOutputSchemas['utilities.rsaEncryption'],
	},
	'utilities.rsaDecryption': {
		input: EncodianEndpointInputSchemas['utilities.rsaDecryption'],
		output: EncodianEndpointOutputSchemas['utilities.rsaDecryption'],
	},
	'utilities.createRsaKeyPair': {
		input: EncodianEndpointInputSchemas['utilities.createRsaKeyPair'],
		output: EncodianEndpointOutputSchemas['utilities.createRsaKeyPair'],
	},
	'utilities.regexSearchTextV2': {
		input: EncodianEndpointInputSchemas['utilities.regexSearchTextV2'],
		output: EncodianEndpointOutputSchemas['utilities.regexSearchTextV2'],
	},
	'utilities.splitText': {
		input: EncodianEndpointInputSchemas['utilities.splitText'],
		output: EncodianEndpointOutputSchemas['utilities.splitText'],
	},
	'utilities.splitTextViaRegex': {
		input: EncodianEndpointInputSchemas['utilities.splitTextViaRegex'],
		output: EncodianEndpointOutputSchemas['utilities.splitTextViaRegex'],
	},
	'utilities.textContainsValue': {
		input: EncodianEndpointInputSchemas['utilities.textContainsValue'],
		output: EncodianEndpointOutputSchemas['utilities.textContainsValue'],
	},
	'utilities.trimText': {
		input: EncodianEndpointInputSchemas['utilities.trimText'],
		output: EncodianEndpointOutputSchemas['utilities.trimText'],
	},
	'utilities.unescapeHtml': {
		input: EncodianEndpointInputSchemas['utilities.unescapeHtml'],
		output: EncodianEndpointOutputSchemas['utilities.unescapeHtml'],
	},
	'utilities.validateEmailAddress': {
		input: EncodianEndpointInputSchemas['utilities.validateEmailAddress'],
		output: EncodianEndpointOutputSchemas['utilities.validateEmailAddress'],
	},
	'utilities.validateGuid': {
		input: EncodianEndpointInputSchemas['utilities.validateGuid'],
		output: EncodianEndpointOutputSchemas['utilities.validateGuid'],
	},
	'utilities.validateJson': {
		input: EncodianEndpointInputSchemas['utilities.validateJson'],
		output: EncodianEndpointOutputSchemas['utilities.validateJson'],
	},
	'utilities.validateUrlAvailability': {
		input: EncodianEndpointInputSchemas['utilities.validateUrlAvailability'],
		output: EncodianEndpointOutputSchemas['utilities.validateUrlAvailability'],
	},
	'utilities.validateUrlSyntax': {
		input: EncodianEndpointInputSchemas['utilities.validateUrlSyntax'],
		output: EncodianEndpointOutputSchemas['utilities.validateUrlSyntax'],
	},
	'word.addHtmlHeaderFooterWord': {
		input: EncodianEndpointInputSchemas['word.addHtmlHeaderFooterWord'],
		output: EncodianEndpointOutputSchemas['word.addHtmlHeaderFooterWord'],
	},
	'word.addImageWatermarkWord': {
		input: EncodianEndpointInputSchemas['word.addImageWatermarkWord'],
		output: EncodianEndpointOutputSchemas['word.addImageWatermarkWord'],
	},
	'word.wordAddPageNumbers': {
		input: EncodianEndpointInputSchemas['word.wordAddPageNumbers'],
		output: EncodianEndpointOutputSchemas['word.wordAddPageNumbers'],
	},
	'word.addTextWatermarkWord': {
		input: EncodianEndpointInputSchemas['word.addTextWatermarkWord'],
		output: EncodianEndpointOutputSchemas['word.addTextWatermarkWord'],
	},
	'word.compareWordDocuments': {
		input: EncodianEndpointInputSchemas['word.compareWordDocuments'],
		output: EncodianEndpointOutputSchemas['word.compareWordDocuments'],
	},
	'word.deleteWordPages': {
		input: EncodianEndpointInputSchemas['word.deleteWordPages'],
		output: EncodianEndpointOutputSchemas['word.deleteWordPages'],
	},
	'word.disableTrackedChanges': {
		input: EncodianEndpointInputSchemas['word.disableTrackedChanges'],
		output: EncodianEndpointOutputSchemas['word.disableTrackedChanges'],
	},
	'word.enableTrackedChanges': {
		input: EncodianEndpointInputSchemas['word.enableTrackedChanges'],
		output: EncodianEndpointOutputSchemas['word.enableTrackedChanges'],
	},
	'word.wordExtractFieldData': {
		input: EncodianEndpointInputSchemas['word.wordExtractFieldData'],
		output: EncodianEndpointOutputSchemas['word.wordExtractFieldData'],
	},
	'word.wordExtractFiles': {
		input: EncodianEndpointInputSchemas['word.wordExtractFiles'],
		output: EncodianEndpointOutputSchemas['word.wordExtractFiles'],
	},
	'word.wordExtractImages': {
		input: EncodianEndpointInputSchemas['word.wordExtractImages'],
		output: EncodianEndpointOutputSchemas['word.wordExtractImages'],
	},
	'word.wordExtractMetadata': {
		input: EncodianEndpointInputSchemas['word.wordExtractMetadata'],
		output: EncodianEndpointOutputSchemas['word.wordExtractMetadata'],
	},
	'word.extractWordPages': {
		input: EncodianEndpointInputSchemas['word.extractWordPages'],
		output: EncodianEndpointOutputSchemas['word.extractWordPages'],
	},
	'word.getTextFromWord': {
		input: EncodianEndpointInputSchemas['word.getTextFromWord'],
		output: EncodianEndpointOutputSchemas['word.getTextFromWord'],
	},
	'word.getTrackedChanges': {
		input: EncodianEndpointInputSchemas['word.getTrackedChanges'],
		output: EncodianEndpointOutputSchemas['word.getTrackedChanges'],
	},
	'word.wordInsertText': {
		input: EncodianEndpointInputSchemas['word.wordInsertText'],
		output: EncodianEndpointOutputSchemas['word.wordInsertText'],
	},
	'word.manageTrackedChanges': {
		input: EncodianEndpointInputSchemas['word.manageTrackedChanges'],
		output: EncodianEndpointOutputSchemas['word.manageTrackedChanges'],
	},
	'word.mergeArrayOfDocumentsToWord': {
		input: EncodianEndpointInputSchemas['word.mergeArrayOfDocumentsToWord'],
		output: EncodianEndpointOutputSchemas['word.mergeArrayOfDocumentsToWord'],
	},
	'word.optimiseWordDocument': {
		input: EncodianEndpointInputSchemas['word.optimiseWordDocument'],
		output: EncodianEndpointOutputSchemas['word.optimiseWordDocument'],
	},
	'word.populateWordDocument': {
		input: EncodianEndpointInputSchemas['word.populateWordDocument'],
		output: EncodianEndpointOutputSchemas['word.populateWordDocument'],
	},
	'word.removeHeaderFooterWord': {
		input: EncodianEndpointInputSchemas['word.removeHeaderFooterWord'],
		output: EncodianEndpointOutputSchemas['word.removeHeaderFooterWord'],
	},
	'word.removeWordTableOfContents': {
		input: EncodianEndpointInputSchemas['word.removeWordTableOfContents'],
		output: EncodianEndpointOutputSchemas['word.removeWordTableOfContents'],
	},
	'word.removeWatermarksFromWord': {
		input: EncodianEndpointInputSchemas['word.removeWatermarksFromWord'],
		output: EncodianEndpointOutputSchemas['word.removeWatermarksFromWord'],
	},
	'word.wordSearchAndReplaceText': {
		input: EncodianEndpointInputSchemas['word.wordSearchAndReplaceText'],
		output: EncodianEndpointOutputSchemas['word.wordSearchAndReplaceText'],
	},
	'word.wordReplaceTextWithImage': {
		input: EncodianEndpointInputSchemas['word.wordReplaceTextWithImage'],
		output: EncodianEndpointOutputSchemas['word.wordReplaceTextWithImage'],
	},
	'word.secureWordDocument': {
		input: EncodianEndpointInputSchemas['word.secureWordDocument'],
		output: EncodianEndpointOutputSchemas['word.secureWordDocument'],
	},
	'word.wordSetMetadata': {
		input: EncodianEndpointInputSchemas['word.wordSetMetadata'],
		output: EncodianEndpointOutputSchemas['word.wordSetMetadata'],
	},
	'word.splitWordDocument': {
		input: EncodianEndpointInputSchemas['word.splitWordDocument'],
		output: EncodianEndpointOutputSchemas['word.splitWordDocument'],
	},
	'word.wordSplitByText': {
		input: EncodianEndpointInputSchemas['word.wordSplitByText'],
		output: EncodianEndpointOutputSchemas['word.wordSplitByText'],
	},
	'word.wordUnlock': {
		input: EncodianEndpointInputSchemas['word.wordUnlock'],
		output: EncodianEndpointOutputSchemas['word.wordUnlock'],
	},
	'word.searchAndReplaceHyperlink': {
		input: EncodianEndpointInputSchemas['word.searchAndReplaceHyperlink'],
		output: EncodianEndpointOutputSchemas['word.searchAndReplaceHyperlink'],
	},
	'word.updateWordTableOfContents': {
		input: EncodianEndpointInputSchemas['word.updateWordTableOfContents'],
		output: EncodianEndpointOutputSchemas['word.updateWordTableOfContents'],
	},
	'sign.envelopeCreateSingle': {
		input: EncodianEndpointInputSchemas['sign.envelopeCreateSingle'],
		output: EncodianEndpointOutputSchemas['sign.envelopeCreateSingle'],
	},
	'sign.envelopeCreateSingleWithStages': {
		input: EncodianEndpointInputSchemas['sign.envelopeCreateSingleWithStages'],
		output:
			EncodianEndpointOutputSchemas['sign.envelopeCreateSingleWithStages'],
	},
	'sign.envelopeCreateMultiple': {
		input: EncodianEndpointInputSchemas['sign.envelopeCreateMultiple'],
		output: EncodianEndpointOutputSchemas['sign.envelopeCreateMultiple'],
	},
	'sign.envelopeCreateMultipleWithStages': {
		input:
			EncodianEndpointInputSchemas['sign.envelopeCreateMultipleWithStages'],
		output:
			EncodianEndpointOutputSchemas['sign.envelopeCreateMultipleWithStages'],
	},
	'sign.envelopeGetStatus': {
		input: EncodianEndpointInputSchemas['sign.envelopeGetStatus'],
		output: EncodianEndpointOutputSchemas['sign.envelopeGetStatus'],
	},
	'sign.envelopeDownloadSignedDocuments': {
		input: EncodianEndpointInputSchemas['sign.envelopeDownloadSignedDocuments'],
		output:
			EncodianEndpointOutputSchemas['sign.envelopeDownloadSignedDocuments'],
	},
	'sign.envelopeDownloadAuditTrail': {
		input: EncodianEndpointInputSchemas['sign.envelopeDownloadAuditTrail'],
		output: EncodianEndpointOutputSchemas['sign.envelopeDownloadAuditTrail'],
	},
	'sign.recipientCreateSingle': {
		input: EncodianEndpointInputSchemas['sign.recipientCreateSingle'],
		output: EncodianEndpointOutputSchemas['sign.recipientCreateSingle'],
	},
	'sign.recipientCreateMultiple': {
		input: EncodianEndpointInputSchemas['sign.recipientCreateMultiple'],
		output: EncodianEndpointOutputSchemas['sign.recipientCreateMultiple'],
	},
	'sign.recipientDeleteSingle': {
		input: EncodianEndpointInputSchemas['sign.recipientDeleteSingle'],
		output: EncodianEndpointOutputSchemas['sign.recipientDeleteSingle'],
	},
	'sign.recipientGetSingle': {
		input: EncodianEndpointInputSchemas['sign.recipientGetSingle'],
		output: EncodianEndpointOutputSchemas['sign.recipientGetSingle'],
	},
	'sign.recipientListAll': {
		input: EncodianEndpointInputSchemas['sign.recipientListAll'],
		output: EncodianEndpointOutputSchemas['sign.recipientListAll'],
	},
} as const;
