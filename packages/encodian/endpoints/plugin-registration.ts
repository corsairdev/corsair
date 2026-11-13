export const EncodianEndpointMeta = {
	'barcodes.createBarcode': {
		riskLevel: 'write',
		description: 'Barcode - Create',
	},
	'barcodes.readBarcodeFromDocument': {
		riskLevel: 'write',
		description: 'Barcode - Read from Document',
	},
	'barcodes.aiBarcodeRead': {
		riskLevel: 'write',
		description: 'Barcode - Read (AI)',
	},
	'barcodes.readBarcodeFromImage': {
		riskLevel: 'write',
		description: 'Barcode - Read from Image',
	},
	'barcodes.createQrCode': {
		riskLevel: 'write',
		description: 'QR Code - Create',
	},
	'barcodes.readQrCodeFromDocument': {
		riskLevel: 'write',
		description: 'QR Code - Read from Document',
	},
	'barcodes.readQrCodeFromImage': {
		riskLevel: 'write',
		description: 'QR Code - Read from Image',
	},
	'barcodes.createSwissQrCode': {
		riskLevel: 'write',
		description: 'Swiss QR Code - Create',
	},
	'barcodes.readSwissQrCodesFromDocument': {
		riskLevel: 'write',
		description: 'Swiss QR Code - Read from Document',
	},
	'barcodes.readSwissQrCodeFromImage': {
		riskLevel: 'write',
		description: 'Swiss QR Code - Read from Image',
	},
	'conversion.convertCad': { riskLevel: 'write', description: 'Convert - CAD' },
	'conversion.convertMailMessage': {
		riskLevel: 'write',
		description: 'Convert - Email',
	},
	'conversion.convertExcel': {
		riskLevel: 'write',
		description: 'Convert - Excel',
	},
	'conversion.basicConversion': {
		riskLevel: 'write',
		description: 'Convert - File to PDF',
	},
	'conversion.convertHeicToPdf': {
		riskLevel: 'write',
		description: 'Convert - HEIC to PDF',
	},
	'conversion.htmlToImage': {
		riskLevel: 'write',
		description: 'Convert - HTML to Image',
	},
	'conversion.htmlToPdf': {
		riskLevel: 'write',
		description: 'Convert - HTML to PDF',
	},
	'conversion.htmlToPDFV2': {
		riskLevel: 'write',
		description: 'Convert - HTML to PDF (V2)',
	},
	'conversion.htmlToWord': {
		riskLevel: 'write',
		description: 'Convert - HTML to Word',
	},
	'conversion.convertImageToPdf': {
		riskLevel: 'write',
		description: 'Convert - Image to PDF',
	},
	'conversion.convertJsonToExcel': {
		riskLevel: 'write',
		description: 'Convert - JSON to Excel',
	},
	'conversion.convertPdfToExcel': {
		riskLevel: 'write',
		description: 'Convert - PDF to Excel',
	},
	'conversion.convertPdfToImages': {
		riskLevel: 'write',
		description: 'Convert - PDF to Images',
	},
	'conversion.convertPdfToJpg': {
		riskLevel: 'write',
		description: 'Convert - PDF to JPG',
	},
	'conversion.convertToPdfA': {
		riskLevel: 'write',
		description: 'Convert - PDF to PDFA',
	},
	'conversion.convertPdfToPng': {
		riskLevel: 'write',
		description: 'Convert - PDF to PNG',
	},
	'conversion.convertPdfToTiff': {
		riskLevel: 'write',
		description: 'Convert - PDF to TIFF',
	},
	'conversion.convertPdfToWord': {
		riskLevel: 'write',
		description: 'Convert - PDF to Word',
	},
	'conversion.convertPowerPoint': {
		riskLevel: 'write',
		description: 'Convert - PowerPoint',
	},
	'conversion.textToPdf': {
		riskLevel: 'write',
		description: 'Convert - Text to PDF',
	},
	'conversion.convertVisio': {
		riskLevel: 'write',
		description: 'Convert - Visio',
	},
	'conversion.convertWord': {
		riskLevel: 'write',
		description: 'Convert - Word',
	},
	'conversion.wordToPdfForm': {
		riskLevel: 'write',
		description: 'Convert - Word to PDF Form',
	},
	'excel.parseCsv': { riskLevel: 'write', description: 'CSV - Parse' },
	'excel.excelAddImageHeaderOrFooter': {
		riskLevel: 'write',
		description: 'Excel - Add Image Header or Footer',
	},
	'excel.addRowsToExcel': {
		riskLevel: 'write',
		description: 'Excel - Add Rows',
	},
	'excel.excelAddTextHeadersAndFooters': {
		riskLevel: 'write',
		description: 'Excel - Add Text Header or Footer',
	},
	'excel.excelWatermarkText': {
		riskLevel: 'write',
		description: 'Excel - Add Text Watermark',
	},
	'excel.deleteRowsFromExcel': {
		riskLevel: 'write',
		description: 'Excel - Delete Rows',
	},
	'excel.deleteExcelWorksheets': {
		riskLevel: 'write',
		description: 'Excel - Delete Worksheets',
	},
	'excel.getRowsFromExcel': {
		riskLevel: 'write',
		description: 'Excel - Extract Rows',
	},
	'excel.extractExcelWorksheets': {
		riskLevel: 'write',
		description: 'Excel - Extract Worksheets',
	},
	'excel.mergeArrayOfExcelDocuments': {
		riskLevel: 'write',
		description: 'Excel - Merge Files',
	},
	'excel.mergeExcelRows': {
		riskLevel: 'write',
		description: 'Excel - Merge Rows',
	},
	'excel.excelMergeWorksheets': {
		riskLevel: 'write',
		description: 'Excel - Merge Worksheets',
	},
	'excel.populateExcel': {
		riskLevel: 'write',
		description: 'Excel - Populate',
	},
	'excel.excelRemoveHeadersAndFooters': {
		riskLevel: 'write',
		description: 'Excel - Remove Headers and Footers',
	},
	'excel.excelWatermarkTextRemove': {
		riskLevel: 'write',
		description: 'Excel - Remove Text Watermark',
	},
	'excel.excelRenameWorksheets': {
		riskLevel: 'write',
		description: 'Excel - Rename Worksheets',
	},
	'excel.excelReplaceText': {
		riskLevel: 'write',
		description: 'Excel - Replace Text',
	},
	'excel.secureExcel': { riskLevel: 'write', description: 'Excel - Secure' },
	'excel.excelSeparateWorksheets': {
		riskLevel: 'write',
		description: 'Excel - Separate Worksheets',
	},
	'excel.unlockExcel': { riskLevel: 'write', description: 'Excel - Unlock' },
	'excel.updateRowsInExcel': {
		riskLevel: 'write',
		description: 'Excel - Update Rows',
	},
	'general.aiProcessBankCheckUs': {
		riskLevel: 'write',
		description: 'AI - Process Bank Check (US)',
	},
	'general.aiProcessBankStatementUs': {
		riskLevel: 'write',
		description: 'AI - Process Bank Statement (US)',
	},
	'general.aiProcessContract': {
		riskLevel: 'write',
		description: 'AI - Process Contract',
	},
	'general.aiProcessCreditCard': {
		riskLevel: 'write',
		description: 'AI - Process Credit Card',
	},
	'general.aiProcessHealthInsuranceCardUs': {
		riskLevel: 'write',
		description: 'AI - Process Health Insurance Card (US)',
	},
	'general.aiProcessIDDocument': {
		riskLevel: 'write',
		description: 'AI - Process ID Document',
	},
	'general.aiProcessInvoice': {
		riskLevel: 'write',
		description: 'AI - Process Invoice',
	},
	'general.aiProcessMarriageCertificateUs': {
		riskLevel: 'write',
		description: 'AI - Process Marriage Certificate (US)',
	},
	'general.aiProcessMortgageUs': {
		riskLevel: 'write',
		description: 'AI - Process Mortgage Document (US)',
	},
	'general.aiProcessPayStubUs': {
		riskLevel: 'write',
		description: 'AI - Process Pay Stub (US)',
	},
	'general.aiProcessReceipt': {
		riskLevel: 'write',
		description: 'AI - Process Receipt',
	},
	'general.aiProcessTaxUs': {
		riskLevel: 'write',
		description: 'AI - Process Tax Document (US)',
	},
	'general.aiRunPromptText': {
		riskLevel: 'write',
		description: 'AI – Run Prompt (Text)',
	},
	'general.aiSpeechToText': {
		riskLevel: 'write',
		description: 'AI - Speech to Text',
	},
	'general.aiTranslateFile': {
		riskLevel: 'write',
		description: 'AI - Translate File',
	},
	'general.aiTranslateTextMultiple': {
		riskLevel: 'write',
		description: 'AI - Translate Text (Multiple)',
	},
	'general.aiTranslateText': {
		riskLevel: 'write',
		description: 'AI - Translate Text (Single)',
	},
	'general.addToZip': {
		riskLevel: 'write',
		description: 'Archive (ZIP) - Create',
	},
	'general.extractFromArchive': {
		riskLevel: 'write',
		description: 'Archive (ZIP) - Extract',
	},
	'general.extractFromArchiveV2': {
		riskLevel: 'write',
		description: 'Archive (ZIP) - Extract (V2)',
	},
	'general.getEmailAttachments': {
		riskLevel: 'write',
		description: 'Email - Extract Attachments',
	},
	'general.getEmailInfo': {
		riskLevel: 'write',
		description: 'Email - Extract Metadata',
	},
	'general.searchAndReplaceText': {
		riskLevel: 'write',
		description: 'File - Search and Replace Text',
	},
	'general.searchAndReplaceTextWithImage': {
		riskLevel: 'write',
		description: 'File - Replace Text with Image',
	},
	'general.buyAdditionalCredits': {
		riskLevel: 'write',
		description:
			'Subscription - Buy Additional Credits (charges the subscription for extra Flowr credits)',
	},
	'general.getSubscriptionStatus': {
		riskLevel: 'read',
		description: 'Subscription – Flowr and Vertr Status',
	},
	'trigr.getTrigrSubscriptionStatus': {
		riskLevel: 'read',
		description: 'Subscription - Trigr Status',
	},
	'image.addImageWatermarkToImage': {
		riskLevel: 'write',
		description: 'Image - Add Image Watermark',
	},
	'image.addTextWatermarkToImage': {
		riskLevel: 'write',
		description: 'Image - Add Text Watermark',
	},
	'image.imageCleanUpDocument': {
		riskLevel: 'write',
		description: 'Image - Clean Up (Document)',
	},
	'image.imageCleanUpPhoto': {
		riskLevel: 'write',
		description: 'Image - Clean Up (Photo)',
	},
	'image.compressImage': {
		riskLevel: 'write',
		description: 'Image - Compress',
	},
	'image.imageConvertFormat': {
		riskLevel: 'write',
		description: 'Image - Convert Format',
	},
	'image.imageConvertToGrayscale': {
		riskLevel: 'write',
		description: 'Image - Convert to Grayscale',
	},
	'image.cropImage': { riskLevel: 'write', description: 'Image - Crop' },
	'image.getImageInfo': {
		riskLevel: 'write',
		description: 'Image - Extract Metadata',
	},
	'image.imageExtractText': {
		riskLevel: 'write',
		description: 'Image - Extract Text (AI OCR)',
	},
	'image.flipImage': { riskLevel: 'write', description: 'Image - Flip' },
	'image.imageRemoveExifTags': {
		riskLevel: 'write',
		description: 'Image - Remove EXIF Tags',
	},
	'image.resizeImage': { riskLevel: 'write', description: 'Image - Resize' },
	'image.rotateImage': { riskLevel: 'write', description: 'Image - Rotate' },
	'image.rotateImageByExifData': {
		riskLevel: 'write',
		description: 'Image - Rotate by EXIF Data',
	},
	'pdf.addAttachmentsToPdf': {
		riskLevel: 'write',
		description: 'PDF - Add Attachments',
	},
	'pdf.addHtmlHeaderFooter': {
		riskLevel: 'write',
		description: 'PDF - Add HTML Header or Footer',
	},
	'pdf.addImageWatermark': {
		riskLevel: 'write',
		description: 'PDF - Add Image Watermark',
	},
	'pdf.addImageWatermarkAdvanced': {
		riskLevel: 'write',
		description: 'PDF - Add Image Watermark (Advanced)',
	},
	'pdf.addPageNumbers': {
		riskLevel: 'write',
		description: 'PDF - Add Page Numbers',
	},
	'pdf.addTextWatermark': {
		riskLevel: 'write',
		description: 'PDF - Add Text Watermark',
	},
	'pdf.addTextWatermarkAdvanced': {
		riskLevel: 'write',
		description: 'PDF - Add Text Watermark (Advanced)',
	},
	'pdf.aiOcrPdfDocument': {
		riskLevel: 'write',
		description: 'PDF - Apply OCR (AI)',
	},
	'pdf.ocrPdfDocument': {
		riskLevel: 'write',
		description: 'PDF - Apply OCR (Standard)',
	},
	'pdf.pdfCheckPassword': {
		riskLevel: 'write',
		description: 'PDF - Check Password Protection',
	},
	'pdf.compressPdf': { riskLevel: 'write', description: 'PDF - Compress' },
	'pdf.pdfCreateZUGFeRDInvoice': {
		riskLevel: 'write',
		description: 'PDF - Create ZUGFeRD Invoice',
	},
	'pdf.pdfDeleteBlankPages': {
		riskLevel: 'write',
		description: 'PDF - Delete Blank Pages',
	},
	'pdf.deletePdfPages': {
		riskLevel: 'write',
		description: 'PDF - Delete Pages',
	},
	'pdf.extractAttachmentsFromPdf': {
		riskLevel: 'write',
		description: 'PDF - Extract Attachments',
	},
	'pdf.getPdfFormData': {
		riskLevel: 'write',
		description: 'PDF - Extract Form Data',
	},
	'pdf.pdfExtractHyperlinks': {
		riskLevel: 'write',
		description: 'PDF - Extract Hyperlinks',
	},
	'pdf.extractImagesAll': {
		riskLevel: 'write',
		description: 'PDF - Extract Images',
	},
	'pdf.extractImages': {
		riskLevel: 'write',
		description: 'PDF - Extract Images from Regions',
	},
	'pdf.getPdfDocumentInfo': {
		riskLevel: 'write',
		description: 'PDF - Extract Metadata',
	},
	'pdf.extractPdfPages': {
		riskLevel: 'write',
		description: 'PDF - Extract Pages',
	},
	'pdf.extractPdfPagesByText': {
		riskLevel: 'write',
		description: 'PDF - Extract Pages by Text',
	},
	'pdf.pdfExtractTableData': {
		riskLevel: 'write',
		description: 'PDF - Extract Table Data',
	},
	'pdf.getPdfTextLayer': {
		riskLevel: 'write',
		description: 'PDF - Extract Text',
	},
	'pdf.pdfExtractTextByPage': {
		riskLevel: 'write',
		description: 'PDF - Extract Text by Page',
	},
	'pdf.extractTextRegions': {
		riskLevel: 'write',
		description: 'PDF - Extract Text from Regions',
	},
	'pdf.fillPdfForm': { riskLevel: 'write', description: 'PDF - Fill Form' },
	'pdf.flattenPdf': { riskLevel: 'write', description: 'PDF - Flatten' },
	'pdf.pdfFlattenFields': {
		riskLevel: 'write',
		description: 'PDF - Flatten Fields',
	},
	'pdf.pdfGenerateBookmarks': {
		riskLevel: 'write',
		description: 'PDF - Generate Bookmarks',
	},
	'pdf.insertHtmlToPdf': {
		riskLevel: 'write',
		description: 'PDF - Insert HTML',
	},
	'pdf.pdfInsertPages': {
		riskLevel: 'write',
		description: 'PDF - Insert Pages',
	},
	'pdf.pdfInsertToc': {
		riskLevel: 'write',
		description: 'PDF - Insert Table of Contents',
	},
	'pdf.pdfLinearize': { riskLevel: 'write', description: 'PDF - Linearize' },
	'pdf.mergeArrayOfDocumentsToPdf': {
		riskLevel: 'write',
		description: 'PDF - Merge Files',
	},
	'pdf.mergeDocumentsToPdf': {
		riskLevel: 'write',
		description: 'PDF - Merge Specific Files',
	},
	'pdf.redactPdf': { riskLevel: 'write', description: 'PDF - Redact' },
	'pdf.pdfRemoveDigitalSignature': {
		riskLevel: 'write',
		description: 'PDF - Remove Digital Signature',
	},
	'pdf.removeWatermarksFromPdf': {
		riskLevel: 'write',
		description: 'PDF - Remove Watermarks',
	},
	'pdf.repairPdf': { riskLevel: 'write', description: 'PDF - Repair' },
	'pdf.pdfReplaceTextWithImage': {
		riskLevel: 'write',
		description: 'PDF - Replace Text with Image',
	},
	'pdf.resizePdf': { riskLevel: 'write', description: 'PDF - Resize' },
	'pdf.rotatePdfPages': {
		riskLevel: 'write',
		description: 'PDF - Rotate Pages',
	},
	'pdf.pdfSearchAndReplaceText': {
		riskLevel: 'write',
		description: 'PDF - Replace Text',
	},
	'pdf.securePdfDocument': { riskLevel: 'write', description: 'PDF - Secure' },
	'pdf.pdfSetMetadata': {
		riskLevel: 'write',
		description: 'PDF - Set Metadata',
	},
	'pdf.setPdfPrivileges': {
		riskLevel: 'write',
		description: 'PDF - Set Privileges',
	},
	'pdf.signPdf': { riskLevel: 'write', description: 'PDF - Sign' },
	'pdf.splitDocument': { riskLevel: 'write', description: 'PDF - Split' },
	'pdf.splitPdfByBarcode': {
		riskLevel: 'write',
		description: 'PDF - Split by Barcode',
	},
	'pdf.splitPdfByText': {
		riskLevel: 'write',
		description: 'PDF - Split by Text',
	},
	'pdf.unlockPdfDocument': { riskLevel: 'write', description: 'PDF - Unlock' },
	'pdf.pdfUpdateHyperlinks': {
		riskLevel: 'write',
		description: 'PDF - Update Hyperlinks',
	},
	'pdf.validatePdfTextLayer': {
		riskLevel: 'write',
		description: 'PDF - Validate Text Layer',
	},
	'powerPoint.compressPowerPoint': {
		riskLevel: 'write',
		description: 'PowerPoint - Compress',
	},
	'powerPoint.powerPointDeleteSlides': {
		riskLevel: 'write',
		description: 'PowerPoint - Delete Slides',
	},
	'powerPoint.mergePresentations': {
		riskLevel: 'write',
		description: 'PowerPoint - Merge Files',
	},
	'powerPoint.populatePowerPoint': {
		riskLevel: 'write',
		description: 'PowerPoint - Populate',
	},
	'powerPoint.powerPointSearchAndReplaceText': {
		riskLevel: 'write',
		description: 'PowerPoint - Replace Text',
	},
	'powerPoint.powerPointSplit': {
		riskLevel: 'write',
		description: 'PowerPoint - Split',
	},
	'utilities.aesEncryption': {
		riskLevel: 'write',
		description: 'Utility - AES Encryption',
	},
	'utilities.aesDecryption': {
		riskLevel: 'write',
		description: 'Utility - AES Decryption',
	},
	'utilities.arrayAddItems': {
		riskLevel: 'write',
		description: 'Utility - Array Add Items',
	},
	'utilities.arrayCombine': {
		riskLevel: 'write',
		description: 'Utility - Array Combine',
	},
	'utilities.arrayContainsValue': {
		riskLevel: 'write',
		description: 'Utility - Array Contains Value',
	},
	'utilities.arrayCountItems': {
		riskLevel: 'write',
		description: 'Utility - Array Count Items',
	},
	'utilities.arrayFilterItems': {
		riskLevel: 'write',
		description: 'Utility - Array Filter Items',
	},
	'utilities.arrayGetItems': {
		riskLevel: 'write',
		description: 'Utility - Array Get Item(s)',
	},
	'utilities.arrayFilterItemsViaRegex': {
		riskLevel: 'write',
		description: 'Utility - Array Filter Items via Regex',
	},
	'utilities.arrayMerge': {
		riskLevel: 'write',
		description: 'Utility - Array Merge',
	},
	'utilities.arrayRemoveDuplicates': {
		riskLevel: 'write',
		description: 'Utility - Array Remove Duplicates',
	},
	'utilities.arrayRemoveItems': {
		riskLevel: 'write',
		description: 'Utility - Array Remove Items',
	},
	'utilities.arrayRemoveItemsRegex': {
		riskLevel: 'write',
		description: 'Utility - Array Remove Items via Regex',
	},
	'utilities.arrayReplaceValues': {
		riskLevel: 'write',
		description: 'Utility - Array Replace Values',
	},
	'utilities.arrayReverseItems': {
		riskLevel: 'write',
		description: 'Utility - Array Reverse Items',
	},
	'utilities.arraySortItems': {
		riskLevel: 'write',
		description: 'Utility - Array Sort Items',
	},
	'utilities.arraySplitItems': {
		riskLevel: 'write',
		description: 'Utility - Array Split Items',
	},
	'utilities.arrayConvertToJson': {
		riskLevel: 'write',
		description: 'Utility - Array to JSON',
	},
	'utilities.arrayConvertToXml': {
		riskLevel: 'write',
		description: 'Utility - Array to XML',
	},
	'utilities.calculateDate': {
		riskLevel: 'write',
		description: 'Utility - Calculate Date',
	},
	'utilities.cleanString': {
		riskLevel: 'write',
		description: 'Utility - Clean Text',
	},
	'utilities.compareText': {
		riskLevel: 'write',
		description: 'Utility - Compare Text',
	},
	'utilities.concatenateText': {
		riskLevel: 'write',
		description: 'Utility - Concatenate Text',
	},
	'utilities.convertJsonToXml': {
		riskLevel: 'write',
		description: 'Utility - Convert JSON To XML',
	},
	'utilities.convertTimeZoneEnc': {
		riskLevel: 'write',
		description: 'Utility - Convert Time Zone',
	},
	'utilities.convertXmlToJson': {
		riskLevel: 'write',
		description: 'Utility - Convert XML to JSON',
	},
	'utilities.createGuid': {
		riskLevel: 'write',
		description: 'Utility - Create GUID',
	},
	'utilities.createHashCodeV2': {
		riskLevel: 'write',
		description: 'Utility - Create Hash Code',
	},
	'utilities.createHMACV2': {
		riskLevel: 'write',
		description: 'Utility - Create HMAC',
	},
	'utilities.createJwt': {
		riskLevel: 'write',
		description: 'Utility - Create JWT',
	},
	'utilities.escapeHtml': {
		riskLevel: 'write',
		description: 'Utility - Escape HTML',
	},
	'utilities.extractEmailAddressesFromText': {
		riskLevel: 'write',
		description: 'Utility - Extract Email Addresses from Text',
	},
	'utilities.extractTextBetweenValues': {
		riskLevel: 'write',
		description: 'Utility - Extract Text between Values',
	},
	'utilities.extractAllTextInstancesBetweenValues': {
		riskLevel: 'write',
		description: 'Utility - Extract Text Instances between Values',
	},
	'utilities.extractUrlsFromText': {
		riskLevel: 'write',
		description: "Utility - Extract URL's from Text",
	},
	'utilities.formatDate': {
		riskLevel: 'write',
		description: 'Utility - Format Date',
	},
	'utilities.formatTextCase': {
		riskLevel: 'write',
		description: 'Utility - Format Text Case',
	},
	'utilities.generatePassword': {
		riskLevel: 'write',
		description: 'Utility - Generate Password',
	},
	'utilities.generateRandomNumber': {
		riskLevel: 'write',
		description: 'Utility - Generate Random Number',
	},
	'utilities.getDateTimeDifference': {
		riskLevel: 'write',
		description: 'Utility - Get Date and Time Difference',
	},
	'utilities.getFileExtension': {
		riskLevel: 'write',
		description: 'Utility - Get File Extension',
	},
	'utilities.getFileFormat': {
		riskLevel: 'write',
		description: 'Utility - Get File Format',
	},
	'utilities.parseHtmlTable': {
		riskLevel: 'write',
		description: 'Utility - Parse HTML Table',
	},
	'utilities.removeDiacritics': {
		riskLevel: 'write',
		description: 'Utility - Remove Diacritics',
	},
	'utilities.removeTextBetweenValues': {
		riskLevel: 'write',
		description: 'Utility - Remove Text between Values',
	},
	'utilities.removeWhitespaceFromText': {
		riskLevel: 'write',
		description: 'Utility - Remove Whitespace from Text',
	},
	'utilities.replaceValueWithRegex': {
		riskLevel: 'write',
		description: 'Utility - Replace Value with Regex',
	},
	'utilities.replaceValueWithText': {
		riskLevel: 'write',
		description: 'Utility - Replace Value with Text',
	},
	'utilities.rsaEncryption': {
		riskLevel: 'write',
		description: 'Utility - RSA Encryption',
	},
	'utilities.rsaDecryption': {
		riskLevel: 'write',
		description: 'Utility - RSA Decryption',
	},
	'utilities.createRsaKeyPair': {
		riskLevel: 'write',
		description: 'Utility - RSA Create Key Pair',
	},
	'utilities.regexSearchTextV2': {
		riskLevel: 'write',
		description: 'Utility - Search Text (Regex)',
	},
	'utilities.splitText': {
		riskLevel: 'write',
		description: 'Utility - Split Text',
	},
	'utilities.splitTextViaRegex': {
		riskLevel: 'write',
		description: 'Utility - Split Text via Regex',
	},
	'utilities.textContainsValue': {
		riskLevel: 'write',
		description: 'Utility - Text Contains Value',
	},
	'utilities.trimText': {
		riskLevel: 'write',
		description: 'Utility - Trim Text',
	},
	'utilities.unescapeHtml': {
		riskLevel: 'write',
		description: 'Utility - Unescape HTML',
	},
	'utilities.validateEmailAddress': {
		riskLevel: 'write',
		description: 'Utility - Validate Email Address',
	},
	'utilities.validateGuid': {
		riskLevel: 'write',
		description: 'Utility - Validate GUID',
	},
	'utilities.validateJson': {
		riskLevel: 'write',
		description: 'Utility - Validate JSON',
	},
	'utilities.validateUrlAvailability': {
		riskLevel: 'write',
		description: 'Utility - Validate URL Availability',
	},
	'utilities.validateUrlSyntax': {
		riskLevel: 'write',
		description: 'Utility - Validate URL Syntax',
	},
	'word.addHtmlHeaderFooterWord': {
		riskLevel: 'write',
		description: 'Word - Add Headers and Footers',
	},
	'word.addImageWatermarkWord': {
		riskLevel: 'write',
		description: 'Word - Add Image Watermark',
	},
	'word.wordAddPageNumbers': {
		riskLevel: 'write',
		description: 'Word - Add Page Numbers',
	},
	'word.addTextWatermarkWord': {
		riskLevel: 'write',
		description: 'Word - Add Text Watermark',
	},
	'word.compareWordDocuments': {
		riskLevel: 'write',
		description: 'Word - Compare',
	},
	'word.deleteWordPages': {
		riskLevel: 'write',
		description: 'Word - Delete Pages',
	},
	'word.disableTrackedChanges': {
		riskLevel: 'write',
		description: 'Word - Disable Tracked Changes',
	},
	'word.enableTrackedChanges': {
		riskLevel: 'write',
		description: 'Word - Enable Tracked Changes',
	},
	'word.wordExtractFieldData': {
		riskLevel: 'write',
		description: 'Word - Extract Field Data',
	},
	'word.wordExtractFiles': {
		riskLevel: 'write',
		description: 'Word - Extract Files',
	},
	'word.wordExtractImages': {
		riskLevel: 'write',
		description: 'Word - Extract Images',
	},
	'word.wordExtractMetadata': {
		riskLevel: 'write',
		description: 'Word - Extract Metadata',
	},
	'word.extractWordPages': {
		riskLevel: 'write',
		description: 'Word - Extract Pages',
	},
	'word.getTextFromWord': {
		riskLevel: 'write',
		description: 'Word - Extract Text',
	},
	'word.getTrackedChanges': {
		riskLevel: 'write',
		description: 'Word - Extract Tracked Changes',
	},
	'word.wordInsertText': {
		riskLevel: 'write',
		description: 'Word - Insert Text',
	},
	'word.manageTrackedChanges': {
		riskLevel: 'write',
		description: 'Word - Manage Tracked Changes',
	},
	'word.mergeArrayOfDocumentsToWord': {
		riskLevel: 'write',
		description: 'Word - Merge Files',
	},
	'word.optimiseWordDocument': {
		riskLevel: 'write',
		description: 'Word - Optimise',
	},
	'word.populateWordDocument': {
		riskLevel: 'write',
		description: 'Word - Populate',
	},
	'word.removeHeaderFooterWord': {
		riskLevel: 'write',
		description: 'Word - Remove Headers and Footers',
	},
	'word.removeWordTableOfContents': {
		riskLevel: 'write',
		description: 'Word - Remove Table of Contents',
	},
	'word.removeWatermarksFromWord': {
		riskLevel: 'write',
		description: 'Word - Remove Watermark',
	},
	'word.wordSearchAndReplaceText': {
		riskLevel: 'write',
		description: 'Word - Replace Text',
	},
	'word.wordReplaceTextWithImage': {
		riskLevel: 'write',
		description: 'Word - Replace Text With Image',
	},
	'word.secureWordDocument': {
		riskLevel: 'write',
		description: 'Word - Secure',
	},
	'word.wordSetMetadata': {
		riskLevel: 'write',
		description: 'Word - Set Metadata',
	},
	'word.splitWordDocument': { riskLevel: 'write', description: 'Word - Split' },
	'word.wordSplitByText': {
		riskLevel: 'write',
		description: 'Word - Split by Text',
	},
	'word.wordUnlock': { riskLevel: 'write', description: 'Word - Unlock' },
	'word.searchAndReplaceHyperlink': {
		riskLevel: 'write',
		description: 'Word - Update Hyperlinks',
	},
	'word.updateWordTableOfContents': {
		riskLevel: 'write',
		description: 'Word - Update Table of Contents',
	},
	'sign.envelopeCreateSingle': {
		riskLevel: 'write',
		description: 'Envelope - Sign Single File',
	},
	'sign.envelopeCreateSingleWithStages': {
		riskLevel: 'write',
		description: 'Envelope - Sign Single File with Stages',
	},
	'sign.envelopeCreateMultiple': {
		riskLevel: 'write',
		description: 'Envelope - Sign Multiple Files',
	},
	'sign.envelopeCreateMultipleWithStages': {
		riskLevel: 'write',
		description: 'Envelope - Sign Multiple Files with Stages',
	},
	'sign.envelopeGetStatus': {
		riskLevel: 'write',
		description: 'Envelope - Get Status',
	},
	'sign.envelopeDownloadSignedDocuments': {
		riskLevel: 'write',
		description: 'Deliverable - Download Signed Documents',
	},
	'sign.envelopeDownloadAuditTrail': {
		riskLevel: 'write',
		description: 'Deliverable - Download Audit Trail',
	},
	'sign.recipientCreateSingle': {
		riskLevel: 'write',
		description: 'Recipient - Add',
	},
	'sign.recipientCreateMultiple': {
		riskLevel: 'write',
		description: 'Recipient - Add Multiple',
	},
	'sign.recipientDeleteSingle': {
		riskLevel: 'destructive',
		description: 'Recipient - Delete',
	},
	'sign.recipientGetSingle': {
		riskLevel: 'write',
		description: 'Recipient  - Get',
	},
	'sign.recipientListAll': {
		riskLevel: 'write',
		description: 'Recipient  - List All',
	},
} as const;
