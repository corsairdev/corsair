import { createEncodianEndpoint } from './runtime';

export const EncodianEndpointsNested = {
	barcodes: {
		createBarcode: createEncodianEndpoint('barcodes.createBarcode'),
		readBarcodeFromDocument: createEncodianEndpoint(
			'barcodes.readBarcodeFromDocument',
		),
		aiBarcodeRead: createEncodianEndpoint('barcodes.aiBarcodeRead'),
		readBarcodeFromImage: createEncodianEndpoint(
			'barcodes.readBarcodeFromImage',
		),
		createQrCode: createEncodianEndpoint('barcodes.createQrCode'),
		readQrCodeFromDocument: createEncodianEndpoint(
			'barcodes.readQrCodeFromDocument',
		),
		readQrCodeFromImage: createEncodianEndpoint('barcodes.readQrCodeFromImage'),
		createSwissQrCode: createEncodianEndpoint('barcodes.createSwissQrCode'),
		readSwissQrCodesFromDocument: createEncodianEndpoint(
			'barcodes.readSwissQrCodesFromDocument',
		),
		readSwissQrCodeFromImage: createEncodianEndpoint(
			'barcodes.readSwissQrCodeFromImage',
		),
	},
	conversion: {
		convertCad: createEncodianEndpoint('conversion.convertCad'),
		convertMailMessage: createEncodianEndpoint('conversion.convertMailMessage'),
		convertExcel: createEncodianEndpoint('conversion.convertExcel'),
		basicConversion: createEncodianEndpoint('conversion.basicConversion'),
		convertHeicToPdf: createEncodianEndpoint('conversion.convertHeicToPdf'),
		htmlToImage: createEncodianEndpoint('conversion.htmlToImage'),
		htmlToPdf: createEncodianEndpoint('conversion.htmlToPdf'),
		htmlToPDFV2: createEncodianEndpoint('conversion.htmlToPDFV2'),
		htmlToWord: createEncodianEndpoint('conversion.htmlToWord'),
		convertImageToPdf: createEncodianEndpoint('conversion.convertImageToPdf'),
		convertJsonToExcel: createEncodianEndpoint('conversion.convertJsonToExcel'),
		convertPdfToExcel: createEncodianEndpoint('conversion.convertPdfToExcel'),
		convertPdfToImages: createEncodianEndpoint('conversion.convertPdfToImages'),
		convertPdfToJpg: createEncodianEndpoint('conversion.convertPdfToJpg'),
		convertToPdfA: createEncodianEndpoint('conversion.convertToPdfA'),
		convertPdfToPng: createEncodianEndpoint('conversion.convertPdfToPng'),
		convertPdfToTiff: createEncodianEndpoint('conversion.convertPdfToTiff'),
		convertPdfToWord: createEncodianEndpoint('conversion.convertPdfToWord'),
		convertPowerPoint: createEncodianEndpoint('conversion.convertPowerPoint'),
		textToPdf: createEncodianEndpoint('conversion.textToPdf'),
		convertVisio: createEncodianEndpoint('conversion.convertVisio'),
		convertWord: createEncodianEndpoint('conversion.convertWord'),
		wordToPdfForm: createEncodianEndpoint('conversion.wordToPdfForm'),
	},
	excel: {
		parseCsv: createEncodianEndpoint('excel.parseCsv'),
		excelAddImageHeaderOrFooter: createEncodianEndpoint(
			'excel.excelAddImageHeaderOrFooter',
		),
		addRowsToExcel: createEncodianEndpoint('excel.addRowsToExcel'),
		excelAddTextHeadersAndFooters: createEncodianEndpoint(
			'excel.excelAddTextHeadersAndFooters',
		),
		excelWatermarkText: createEncodianEndpoint('excel.excelWatermarkText'),
		deleteRowsFromExcel: createEncodianEndpoint('excel.deleteRowsFromExcel'),
		deleteExcelWorksheets: createEncodianEndpoint(
			'excel.deleteExcelWorksheets',
		),
		getRowsFromExcel: createEncodianEndpoint('excel.getRowsFromExcel'),
		extractExcelWorksheets: createEncodianEndpoint(
			'excel.extractExcelWorksheets',
		),
		mergeArrayOfExcelDocuments: createEncodianEndpoint(
			'excel.mergeArrayOfExcelDocuments',
		),
		mergeExcelRows: createEncodianEndpoint('excel.mergeExcelRows'),
		excelMergeWorksheets: createEncodianEndpoint('excel.excelMergeWorksheets'),
		populateExcel: createEncodianEndpoint('excel.populateExcel'),
		excelRemoveHeadersAndFooters: createEncodianEndpoint(
			'excel.excelRemoveHeadersAndFooters',
		),
		excelWatermarkTextRemove: createEncodianEndpoint(
			'excel.excelWatermarkTextRemove',
		),
		excelRenameWorksheets: createEncodianEndpoint(
			'excel.excelRenameWorksheets',
		),
		excelReplaceText: createEncodianEndpoint('excel.excelReplaceText'),
		secureExcel: createEncodianEndpoint('excel.secureExcel'),
		excelSeparateWorksheets: createEncodianEndpoint(
			'excel.excelSeparateWorksheets',
		),
		unlockExcel: createEncodianEndpoint('excel.unlockExcel'),
		updateRowsInExcel: createEncodianEndpoint('excel.updateRowsInExcel'),
	},
	general: {
		aiProcessBankCheckUs: createEncodianEndpoint(
			'general.aiProcessBankCheckUs',
		),
		aiProcessBankStatementUs: createEncodianEndpoint(
			'general.aiProcessBankStatementUs',
		),
		aiProcessContract: createEncodianEndpoint('general.aiProcessContract'),
		aiProcessCreditCard: createEncodianEndpoint('general.aiProcessCreditCard'),
		aiProcessHealthInsuranceCardUs: createEncodianEndpoint(
			'general.aiProcessHealthInsuranceCardUs',
		),
		aiProcessIDDocument: createEncodianEndpoint('general.aiProcessIDDocument'),
		aiProcessInvoice: createEncodianEndpoint('general.aiProcessInvoice'),
		aiProcessMarriageCertificateUs: createEncodianEndpoint(
			'general.aiProcessMarriageCertificateUs',
		),
		aiProcessMortgageUs: createEncodianEndpoint('general.aiProcessMortgageUs'),
		aiProcessPayStubUs: createEncodianEndpoint('general.aiProcessPayStubUs'),
		aiProcessReceipt: createEncodianEndpoint('general.aiProcessReceipt'),
		aiProcessTaxUs: createEncodianEndpoint('general.aiProcessTaxUs'),
		aiRunPromptText: createEncodianEndpoint('general.aiRunPromptText'),
		aiSpeechToText: createEncodianEndpoint('general.aiSpeechToText'),
		aiTranslateFile: createEncodianEndpoint('general.aiTranslateFile'),
		aiTranslateTextMultiple: createEncodianEndpoint(
			'general.aiTranslateTextMultiple',
		),
		aiTranslateText: createEncodianEndpoint('general.aiTranslateText'),
		addToZip: createEncodianEndpoint('general.addToZip'),
		extractFromArchive: createEncodianEndpoint('general.extractFromArchive'),
		extractFromArchiveV2: createEncodianEndpoint(
			'general.extractFromArchiveV2',
		),
		getEmailAttachments: createEncodianEndpoint('general.getEmailAttachments'),
		getEmailInfo: createEncodianEndpoint('general.getEmailInfo'),
		searchAndReplaceText: createEncodianEndpoint(
			'general.searchAndReplaceText',
		),
		searchAndReplaceTextWithImage: createEncodianEndpoint(
			'general.searchAndReplaceTextWithImage',
		),
		buyAdditionalCredits: createEncodianEndpoint(
			'general.buyAdditionalCredits',
		),
		getSubscriptionStatus: createEncodianEndpoint(
			'general.getSubscriptionStatus',
		),
	},
	trigr: {
		getTrigrSubscriptionStatus: createEncodianEndpoint(
			'trigr.getTrigrSubscriptionStatus',
		),
	},
	image: {
		addImageWatermarkToImage: createEncodianEndpoint(
			'image.addImageWatermarkToImage',
		),
		addTextWatermarkToImage: createEncodianEndpoint(
			'image.addTextWatermarkToImage',
		),
		imageCleanUpDocument: createEncodianEndpoint('image.imageCleanUpDocument'),
		imageCleanUpPhoto: createEncodianEndpoint('image.imageCleanUpPhoto'),
		compressImage: createEncodianEndpoint('image.compressImage'),
		imageConvertFormat: createEncodianEndpoint('image.imageConvertFormat'),
		imageConvertToGrayscale: createEncodianEndpoint(
			'image.imageConvertToGrayscale',
		),
		cropImage: createEncodianEndpoint('image.cropImage'),
		getImageInfo: createEncodianEndpoint('image.getImageInfo'),
		imageExtractText: createEncodianEndpoint('image.imageExtractText'),
		flipImage: createEncodianEndpoint('image.flipImage'),
		imageRemoveExifTags: createEncodianEndpoint('image.imageRemoveExifTags'),
		resizeImage: createEncodianEndpoint('image.resizeImage'),
		rotateImage: createEncodianEndpoint('image.rotateImage'),
		rotateImageByExifData: createEncodianEndpoint(
			'image.rotateImageByExifData',
		),
	},
	pdf: {
		addAttachmentsToPdf: createEncodianEndpoint('pdf.addAttachmentsToPdf'),
		addHtmlHeaderFooter: createEncodianEndpoint('pdf.addHtmlHeaderFooter'),
		addImageWatermark: createEncodianEndpoint('pdf.addImageWatermark'),
		addImageWatermarkAdvanced: createEncodianEndpoint(
			'pdf.addImageWatermarkAdvanced',
		),
		addPageNumbers: createEncodianEndpoint('pdf.addPageNumbers'),
		addTextWatermark: createEncodianEndpoint('pdf.addTextWatermark'),
		addTextWatermarkAdvanced: createEncodianEndpoint(
			'pdf.addTextWatermarkAdvanced',
		),
		aiOcrPdfDocument: createEncodianEndpoint('pdf.aiOcrPdfDocument'),
		ocrPdfDocument: createEncodianEndpoint('pdf.ocrPdfDocument'),
		pdfCheckPassword: createEncodianEndpoint('pdf.pdfCheckPassword'),
		compressPdf: createEncodianEndpoint('pdf.compressPdf'),
		pdfCreateZUGFeRDInvoice: createEncodianEndpoint(
			'pdf.pdfCreateZUGFeRDInvoice',
		),
		pdfDeleteBlankPages: createEncodianEndpoint('pdf.pdfDeleteBlankPages'),
		deletePdfPages: createEncodianEndpoint('pdf.deletePdfPages'),
		extractAttachmentsFromPdf: createEncodianEndpoint(
			'pdf.extractAttachmentsFromPdf',
		),
		getPdfFormData: createEncodianEndpoint('pdf.getPdfFormData'),
		pdfExtractHyperlinks: createEncodianEndpoint('pdf.pdfExtractHyperlinks'),
		extractImagesAll: createEncodianEndpoint('pdf.extractImagesAll'),
		extractImages: createEncodianEndpoint('pdf.extractImages'),
		getPdfDocumentInfo: createEncodianEndpoint('pdf.getPdfDocumentInfo'),
		extractPdfPages: createEncodianEndpoint('pdf.extractPdfPages'),
		extractPdfPagesByText: createEncodianEndpoint('pdf.extractPdfPagesByText'),
		pdfExtractTableData: createEncodianEndpoint('pdf.pdfExtractTableData'),
		getPdfTextLayer: createEncodianEndpoint('pdf.getPdfTextLayer'),
		pdfExtractTextByPage: createEncodianEndpoint('pdf.pdfExtractTextByPage'),
		extractTextRegions: createEncodianEndpoint('pdf.extractTextRegions'),
		fillPdfForm: createEncodianEndpoint('pdf.fillPdfForm'),
		flattenPdf: createEncodianEndpoint('pdf.flattenPdf'),
		pdfFlattenFields: createEncodianEndpoint('pdf.pdfFlattenFields'),
		pdfGenerateBookmarks: createEncodianEndpoint('pdf.pdfGenerateBookmarks'),
		insertHtmlToPdf: createEncodianEndpoint('pdf.insertHtmlToPdf'),
		pdfInsertPages: createEncodianEndpoint('pdf.pdfInsertPages'),
		pdfInsertToc: createEncodianEndpoint('pdf.pdfInsertToc'),
		pdfLinearize: createEncodianEndpoint('pdf.pdfLinearize'),
		mergeArrayOfDocumentsToPdf: createEncodianEndpoint(
			'pdf.mergeArrayOfDocumentsToPdf',
		),
		mergeDocumentsToPdf: createEncodianEndpoint('pdf.mergeDocumentsToPdf'),
		redactPdf: createEncodianEndpoint('pdf.redactPdf'),
		pdfRemoveDigitalSignature: createEncodianEndpoint(
			'pdf.pdfRemoveDigitalSignature',
		),
		removeWatermarksFromPdf: createEncodianEndpoint(
			'pdf.removeWatermarksFromPdf',
		),
		repairPdf: createEncodianEndpoint('pdf.repairPdf'),
		pdfReplaceTextWithImage: createEncodianEndpoint(
			'pdf.pdfReplaceTextWithImage',
		),
		resizePdf: createEncodianEndpoint('pdf.resizePdf'),
		rotatePdfPages: createEncodianEndpoint('pdf.rotatePdfPages'),
		pdfSearchAndReplaceText: createEncodianEndpoint(
			'pdf.pdfSearchAndReplaceText',
		),
		securePdfDocument: createEncodianEndpoint('pdf.securePdfDocument'),
		pdfSetMetadata: createEncodianEndpoint('pdf.pdfSetMetadata'),
		setPdfPrivileges: createEncodianEndpoint('pdf.setPdfPrivileges'),
		signPdf: createEncodianEndpoint('pdf.signPdf'),
		splitDocument: createEncodianEndpoint('pdf.splitDocument'),
		splitPdfByBarcode: createEncodianEndpoint('pdf.splitPdfByBarcode'),
		splitPdfByText: createEncodianEndpoint('pdf.splitPdfByText'),
		unlockPdfDocument: createEncodianEndpoint('pdf.unlockPdfDocument'),
		pdfUpdateHyperlinks: createEncodianEndpoint('pdf.pdfUpdateHyperlinks'),
		validatePdfTextLayer: createEncodianEndpoint('pdf.validatePdfTextLayer'),
	},
	powerPoint: {
		compressPowerPoint: createEncodianEndpoint('powerPoint.compressPowerPoint'),
		powerPointDeleteSlides: createEncodianEndpoint(
			'powerPoint.powerPointDeleteSlides',
		),
		mergePresentations: createEncodianEndpoint('powerPoint.mergePresentations'),
		populatePowerPoint: createEncodianEndpoint('powerPoint.populatePowerPoint'),
		powerPointSearchAndReplaceText: createEncodianEndpoint(
			'powerPoint.powerPointSearchAndReplaceText',
		),
		powerPointSplit: createEncodianEndpoint('powerPoint.powerPointSplit'),
	},
	utilities: {
		aesEncryption: createEncodianEndpoint('utilities.aesEncryption'),
		aesDecryption: createEncodianEndpoint('utilities.aesDecryption'),
		arrayAddItems: createEncodianEndpoint('utilities.arrayAddItems'),
		arrayCombine: createEncodianEndpoint('utilities.arrayCombine'),
		arrayContainsValue: createEncodianEndpoint('utilities.arrayContainsValue'),
		arrayCountItems: createEncodianEndpoint('utilities.arrayCountItems'),
		arrayFilterItems: createEncodianEndpoint('utilities.arrayFilterItems'),
		arrayGetItems: createEncodianEndpoint('utilities.arrayGetItems'),
		arrayFilterItemsViaRegex: createEncodianEndpoint(
			'utilities.arrayFilterItemsViaRegex',
		),
		arrayMerge: createEncodianEndpoint('utilities.arrayMerge'),
		arrayRemoveDuplicates: createEncodianEndpoint(
			'utilities.arrayRemoveDuplicates',
		),
		arrayRemoveItems: createEncodianEndpoint('utilities.arrayRemoveItems'),
		arrayRemoveItemsRegex: createEncodianEndpoint(
			'utilities.arrayRemoveItemsRegex',
		),
		arrayReplaceValues: createEncodianEndpoint('utilities.arrayReplaceValues'),
		arrayReverseItems: createEncodianEndpoint('utilities.arrayReverseItems'),
		arraySortItems: createEncodianEndpoint('utilities.arraySortItems'),
		arraySplitItems: createEncodianEndpoint('utilities.arraySplitItems'),
		arrayConvertToJson: createEncodianEndpoint('utilities.arrayConvertToJson'),
		arrayConvertToXml: createEncodianEndpoint('utilities.arrayConvertToXml'),
		calculateDate: createEncodianEndpoint('utilities.calculateDate'),
		cleanString: createEncodianEndpoint('utilities.cleanString'),
		compareText: createEncodianEndpoint('utilities.compareText'),
		concatenateText: createEncodianEndpoint('utilities.concatenateText'),
		convertJsonToXml: createEncodianEndpoint('utilities.convertJsonToXml'),
		convertTimeZoneEnc: createEncodianEndpoint('utilities.convertTimeZoneEnc'),
		convertXmlToJson: createEncodianEndpoint('utilities.convertXmlToJson'),
		createGuid: createEncodianEndpoint('utilities.createGuid'),
		createHashCodeV2: createEncodianEndpoint('utilities.createHashCodeV2'),
		createHMACV2: createEncodianEndpoint('utilities.createHMACV2'),
		createJwt: createEncodianEndpoint('utilities.createJwt'),
		escapeHtml: createEncodianEndpoint('utilities.escapeHtml'),
		extractEmailAddressesFromText: createEncodianEndpoint(
			'utilities.extractEmailAddressesFromText',
		),
		extractTextBetweenValues: createEncodianEndpoint(
			'utilities.extractTextBetweenValues',
		),
		extractAllTextInstancesBetweenValues: createEncodianEndpoint(
			'utilities.extractAllTextInstancesBetweenValues',
		),
		extractUrlsFromText: createEncodianEndpoint(
			'utilities.extractUrlsFromText',
		),
		formatDate: createEncodianEndpoint('utilities.formatDate'),
		formatTextCase: createEncodianEndpoint('utilities.formatTextCase'),
		generatePassword: createEncodianEndpoint('utilities.generatePassword'),
		generateRandomNumber: createEncodianEndpoint(
			'utilities.generateRandomNumber',
		),
		getDateTimeDifference: createEncodianEndpoint(
			'utilities.getDateTimeDifference',
		),
		getFileExtension: createEncodianEndpoint('utilities.getFileExtension'),
		getFileFormat: createEncodianEndpoint('utilities.getFileFormat'),
		parseHtmlTable: createEncodianEndpoint('utilities.parseHtmlTable'),
		removeDiacritics: createEncodianEndpoint('utilities.removeDiacritics'),
		removeTextBetweenValues: createEncodianEndpoint(
			'utilities.removeTextBetweenValues',
		),
		removeWhitespaceFromText: createEncodianEndpoint(
			'utilities.removeWhitespaceFromText',
		),
		replaceValueWithRegex: createEncodianEndpoint(
			'utilities.replaceValueWithRegex',
		),
		replaceValueWithText: createEncodianEndpoint(
			'utilities.replaceValueWithText',
		),
		rsaEncryption: createEncodianEndpoint('utilities.rsaEncryption'),
		rsaDecryption: createEncodianEndpoint('utilities.rsaDecryption'),
		createRsaKeyPair: createEncodianEndpoint('utilities.createRsaKeyPair'),
		regexSearchTextV2: createEncodianEndpoint('utilities.regexSearchTextV2'),
		splitText: createEncodianEndpoint('utilities.splitText'),
		splitTextViaRegex: createEncodianEndpoint('utilities.splitTextViaRegex'),
		textContainsValue: createEncodianEndpoint('utilities.textContainsValue'),
		trimText: createEncodianEndpoint('utilities.trimText'),
		unescapeHtml: createEncodianEndpoint('utilities.unescapeHtml'),
		validateEmailAddress: createEncodianEndpoint(
			'utilities.validateEmailAddress',
		),
		validateGuid: createEncodianEndpoint('utilities.validateGuid'),
		validateJson: createEncodianEndpoint('utilities.validateJson'),
		validateUrlAvailability: createEncodianEndpoint(
			'utilities.validateUrlAvailability',
		),
		validateUrlSyntax: createEncodianEndpoint('utilities.validateUrlSyntax'),
	},
	word: {
		addHtmlHeaderFooterWord: createEncodianEndpoint(
			'word.addHtmlHeaderFooterWord',
		),
		addImageWatermarkWord: createEncodianEndpoint('word.addImageWatermarkWord'),
		wordAddPageNumbers: createEncodianEndpoint('word.wordAddPageNumbers'),
		addTextWatermarkWord: createEncodianEndpoint('word.addTextWatermarkWord'),
		compareWordDocuments: createEncodianEndpoint('word.compareWordDocuments'),
		deleteWordPages: createEncodianEndpoint('word.deleteWordPages'),
		disableTrackedChanges: createEncodianEndpoint('word.disableTrackedChanges'),
		enableTrackedChanges: createEncodianEndpoint('word.enableTrackedChanges'),
		wordExtractFieldData: createEncodianEndpoint('word.wordExtractFieldData'),
		wordExtractFiles: createEncodianEndpoint('word.wordExtractFiles'),
		wordExtractImages: createEncodianEndpoint('word.wordExtractImages'),
		wordExtractMetadata: createEncodianEndpoint('word.wordExtractMetadata'),
		extractWordPages: createEncodianEndpoint('word.extractWordPages'),
		getTextFromWord: createEncodianEndpoint('word.getTextFromWord'),
		getTrackedChanges: createEncodianEndpoint('word.getTrackedChanges'),
		wordInsertText: createEncodianEndpoint('word.wordInsertText'),
		manageTrackedChanges: createEncodianEndpoint('word.manageTrackedChanges'),
		mergeArrayOfDocumentsToWord: createEncodianEndpoint(
			'word.mergeArrayOfDocumentsToWord',
		),
		optimiseWordDocument: createEncodianEndpoint('word.optimiseWordDocument'),
		populateWordDocument: createEncodianEndpoint('word.populateWordDocument'),
		removeHeaderFooterWord: createEncodianEndpoint(
			'word.removeHeaderFooterWord',
		),
		removeWordTableOfContents: createEncodianEndpoint(
			'word.removeWordTableOfContents',
		),
		removeWatermarksFromWord: createEncodianEndpoint(
			'word.removeWatermarksFromWord',
		),
		wordSearchAndReplaceText: createEncodianEndpoint(
			'word.wordSearchAndReplaceText',
		),
		wordReplaceTextWithImage: createEncodianEndpoint(
			'word.wordReplaceTextWithImage',
		),
		secureWordDocument: createEncodianEndpoint('word.secureWordDocument'),
		wordSetMetadata: createEncodianEndpoint('word.wordSetMetadata'),
		splitWordDocument: createEncodianEndpoint('word.splitWordDocument'),
		wordSplitByText: createEncodianEndpoint('word.wordSplitByText'),
		wordUnlock: createEncodianEndpoint('word.wordUnlock'),
		searchAndReplaceHyperlink: createEncodianEndpoint(
			'word.searchAndReplaceHyperlink',
		),
		updateWordTableOfContents: createEncodianEndpoint(
			'word.updateWordTableOfContents',
		),
	},
	sign: {
		envelopeCreateSingle: createEncodianEndpoint('sign.envelopeCreateSingle'),
		envelopeCreateSingleWithStages: createEncodianEndpoint(
			'sign.envelopeCreateSingleWithStages',
		),
		envelopeCreateMultiple: createEncodianEndpoint(
			'sign.envelopeCreateMultiple',
		),
		envelopeCreateMultipleWithStages: createEncodianEndpoint(
			'sign.envelopeCreateMultipleWithStages',
		),
		envelopeGetStatus: createEncodianEndpoint('sign.envelopeGetStatus'),
		envelopeDownloadSignedDocuments: createEncodianEndpoint(
			'sign.envelopeDownloadSignedDocuments',
		),
		envelopeDownloadAuditTrail: createEncodianEndpoint(
			'sign.envelopeDownloadAuditTrail',
		),
		recipientCreateSingle: createEncodianEndpoint('sign.recipientCreateSingle'),
		recipientCreateMultiple: createEncodianEndpoint(
			'sign.recipientCreateMultiple',
		),
		recipientDeleteSingle: createEncodianEndpoint('sign.recipientDeleteSingle'),
		recipientGetSingle: createEncodianEndpoint('sign.recipientGetSingle'),
		recipientListAll: createEncodianEndpoint('sign.recipientListAll'),
	},
} as const;

export * from './types';
