import { Campaigns, ReceiptValidation, Simple, Verbose } from './endpoints';
import type {
	CampaignsCreateInput,
	CampaignsGetResponse,
} from './endpoints/types';
import {
	CAMPAIGN_IDS,
	CAMPAIGN_SETTINGS,
	CAMPAIGN_VALIDATION_FAILED,
	CAMPAIGN_VALIDATION_PASSED,
	CREATE_ACK,
	LIVE_VERBOSE_RECEIPT,
	NOT_FOUND_ACK,
	SIMPLE_RECEIPT,
	TOTAL_AMOUNT_REGIONS,
	UNREADABLE_RECEIPT,
	VERBOSE_RECEIPT,
} from './test-fixtures';
import {
	captureError,
	invoke,
	pngFile,
	respond,
	respondRaw,
	spyOnFetch,
} from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses the simple answer and keeps an optional field absent', async () => {
		respond(fetchMock, SIMPLE_RECEIPT);

		const result = (await invoke(Simple.url, {
			url: 'https://files.example.com/receipt.png',
		})) as typeof SIMPLE_RECEIPT;

		expect(result).toMatchObject({
			confidenceLevel: 0.898,
			merchantCountryCode: { data: 'US' },
		});
		expect(result.totalAmount.data).toBe(14.42);
	});

	it('parses the verbose answer, including line items and helper arrays', async () => {
		respond(fetchMock, VERBOSE_RECEIPT);

		const result = (await invoke(Verbose.url, {
			url: 'https://files.example.com/receipt.png',
		})) as typeof VERBOSE_RECEIPT;

		expect(result.entities.productLineItems?.[0]?.data.name.data).toBe(
			'Chicken Bowl',
		);
		expect(result.amounts).toHaveLength(1);
		expect(result.numbers?.[1]?.classifyResult).toBe('primaryTotal');
	});

	it('keeps a real nested region through the parse', async () => {
		// The published examples empty every `regions` array, so a wrong shape
		// here would pass every offline test and reject a paid scan. The spec
		// nests points: an array of shapes, each an array of { x, y }.
		respond(fetchMock, VERBOSE_RECEIPT);

		const result = (await invoke(Verbose.url, {
			url: 'https://files.example.com/receipt.png',
		})) as typeof VERBOSE_RECEIPT;

		expect(result.totalAmount.regions).toEqual(TOTAL_AMOUNT_REGIONS);
		expect(result.totalAmount.regions?.[0]?.[0]?.x).toBe(437);
		expect(result.totalAmount.regions?.[0]?.at(-1)?.y).toBe(807);
	});

	it('parses a real verbose answer, whose full-text region is one flat box', async () => {
		// Field regions nest shapes of points; `text.regions` is a single box.
		// Reading it as nested rejected every live verbose scan after billing it.
		respond(fetchMock, LIVE_VERBOSE_RECEIPT);

		const result = (await invoke(Verbose.file, {
			file: pngFile(),
		})) as typeof LIVE_VERBOSE_RECEIPT;

		expect(result.text.regions).toEqual(LIVE_VERBOSE_RECEIPT.text.regions);
		expect(result.totalAmount.regions[1]?.[0]?.x).toBe(563);
		expect(result.entities.invoiceNumber.data).toBe('48213');
	});

	it('rejects a region whose points are not coordinates', async () => {
		respond(fetchMock, {
			...VERBOSE_RECEIPT,
			totalAmount: {
				...VERBOSE_RECEIPT.totalAmount,
				// A flat shape, which is what a wrong reading of the spec produces.
				regions: [{ x: 437, y: 787 }],
			},
		});

		await expect(
			invoke(Verbose.url, { url: 'https://files.example.com/receipt.png' }),
		).rejects.toThrow();
	});

	it('accepts an answer where only trackingId is present', async () => {
		// Taggun omits a property it produced no value for, so a document it
		// could not read must still parse rather than throw.
		respond(fetchMock, UNREADABLE_RECEIPT);

		const result = await invoke(Verbose.file, { file: pngFile() });

		expect(result).toEqual(UNREADABLE_RECEIPT);
	});

	it('parses a passed validation', async () => {
		respond(fetchMock, CAMPAIGN_VALIDATION_PASSED);

		const result = (await invoke(Campaigns.validateUrl, {
			campaignId: 'october-cola-24',
			url: 'https://example.com/receipts/receipt-123.jpg',
		})) as typeof CAMPAIGN_VALIDATION_PASSED;

		expect(result.successful).toBe(true);
		expect(result.smartValidate).toEqual({ is_credit_card: true });
		expect(result.matchedProductLineItems).toHaveLength(1);
	});

	it('parses a failed validation as a successful call reporting false', async () => {
		// A receipt that fails a rule is a 200 with successful: false. It must
		// not throw: the caller needs the failing keys to tell the user why.
		respond(fetchMock, CAMPAIGN_VALIDATION_FAILED);

		const result = (await invoke(ReceiptValidation.url, {
			url: 'https://example.com/receipts/receipt-123.png',
			validation: { merchantName: { allowed: ['H-E-B'] } },
		})) as typeof CAMPAIGN_VALIDATION_FAILED;

		expect(result.successful).toBe(false);
		expect(result.failedValidations).toContain('merchant_name_validated');
		expect(result.similarReceipts?.[0]?.similarityScore).toBe(0.93);
	});

	it('parses the campaign id list as strings', async () => {
		respond(fetchMock, CAMPAIGN_IDS);

		await expect(invoke(Campaigns.list, {})).resolves.toEqual(CAMPAIGN_IDS);
	});

	it('parses stored campaign settings', async () => {
		respond(fetchMock, CAMPAIGN_SETTINGS);

		const result = (await invoke(Campaigns.get, {
			campaignId: 'coffee-june-2026',
		})) as typeof CAMPAIGN_SETTINGS;

		expect(result.smartValidate.prompts[0]?.question).toContain('credit card');
		expect(result.balanceOwing.max).toBe(0.01);
	});

	it('reads settings that hold balanceOwing.max of zero', async () => {
		// A campaign created outside this plugin can store zero, which Taggun
		// treats as skipping the comparison. The read side must accept it, or
		// those settings can never be fetched and so never repaired.
		respond(fetchMock, {
			...CAMPAIGN_SETTINGS,
			balanceOwing: { max: 0 },
		});

		const result = (await invoke(Campaigns.get, {
			campaignId: 'external-campaign',
		})) as typeof CAMPAIGN_SETTINGS;

		expect(result.balanceOwing.max).toBe(0);
	});

	it('keeps a real balanceOwing type on both directions', () => {
		// The read and write schemas come from one builder. If its type parameter
		// degrades, the field collapses to `{}` and callers lose the shape without
		// any test failing, so pin both sides at the type level.
		const stored: CampaignsGetResponse = { balanceOwing: { max: 0 } };
		const writeBody: CampaignsCreateInput = {
			campaignId: 'coffee',
			settings: { balanceOwing: { max: 5 } },
		};

		expect(stored.balanceOwing?.max).toBe(0);
		expect(writeBody.settings.balanceOwing?.max).toBe(5);
	});
});

describe('rejections', () => {
	it('rejects a receipt body that is not JSON', async () => {
		respondRaw(fetchMock, '<html>upstream</html>');

		const error = await captureError(
			invoke(Simple.url, { url: 'https://files.example.com/receipt.png' }),
		);

		expect(error).toBeInstanceOf(Error);
	});

	it('rejects a known field with the wrong type', async () => {
		respond(fetchMock, {
			...SIMPLE_RECEIPT,
			// A number where the schema, and the documented answer, say string.
			merchantName: { data: 12345, confidenceLevel: 0.9 },
		});

		await expect(
			invoke(Simple.url, { url: 'https://files.example.com/receipt.png' }),
		).rejects.toThrow();
	});

	it('rejects a campaign list that is a string rather than an array', async () => {
		// An account without the feature, or a proxy, can answer text. Reading
		// that as one campaign ID would be a silent wrong answer.
		respond(
			fetchMock,
			'Please contact Taggun for the feature Campaign Validation',
		);

		await expect(invoke(Campaigns.list, {})).rejects.toThrow();
	});

	it('throws on a 200 whose body reports its own failure', async () => {
		// Campaign Settings Update and Delete report a missing campaign as a
		// `statusCode` inside a 200-shaped body, so a body that names its own
		// failure must never reach the caller as a successful write.
		respond(
			fetchMock,
			{ statusCode: 400, error: 'Bad Request', message: 'File is required' },
			200,
		);

		await expect(invoke(Simple.file, { file: pngFile() })).rejects.toThrow(
			/File is required/,
		);
	});

	it('throws when a delete reports a missing campaign inside a 200 body', async () => {
		// The documented not-found branch is a 404 code inside the body. A
		// caller must not be told a delete succeeded on that evidence.
		respond(fetchMock, NOT_FOUND_ACK);

		await expect(
			invoke(Campaigns.remove, { campaignId: 'coffee-june-2026' }),
		).rejects.toThrow(/Campaign ID not found/);
	});

	it('throws when an update reports a missing campaign inside a 200 body', async () => {
		respond(fetchMock, NOT_FOUND_ACK);

		await expect(
			invoke(Campaigns.update, {
				campaignId: 'coffee-june-2026',
				settings: { merchantNames: { allowList: ['Fresh Market'] } },
			}),
		).rejects.toThrow(/Campaign ID not found/);
	});

	it('accepts a create acknowledgement', async () => {
		respond(fetchMock, CREATE_ACK, 201);

		await expect(
			invoke(Campaigns.create, {
				campaignId: 'coffee-june-2026',
				settings: { merchantNames: { allowList: ['Fresh Market'] } },
			}),
		).resolves.toMatchObject({ statusCode: 201 });
	});
});

describe('input rejections', () => {
	it('rejects an HTTP document URL before sending', async () => {
		const error = await captureError(
			invoke(Simple.url, { url: 'http://files.example.com/receipt.png' }),
		);

		expect((error as Error).message).toContain('https');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		'https://localhost/receipt.png',
		'https://127.0.0.1/receipt.png',
		'https://10.1.2.3/receipt.png',
		'https://192.168.0.5/receipt.png',
		'https://172.16.4.4/receipt.png',
		'https://169.254.1.1/receipt.png',
		'https://[::1]/receipt.png',
	])('rejects the private target %s before sending', async (url) => {
		await expect(invoke(Simple.url, { url })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a malformed URL', async () => {
		await expect(invoke(Simple.url, { url: 'not a url' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a three-letter language hint', async () => {
		await expect(
			invoke(Simple.url, {
				url: 'https://files.example.com/receipt.png',
				language: 'eng',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a tag longer than the documented 50 characters', async () => {
		await expect(
			invoke(Simple.url, {
				url: 'https://files.example.com/receipt.png',
				referenceId: 'x'.repeat(51),
			}),
		).rejects.toThrow();
	});

	it('rejects a campaign id longer than 50 characters', async () => {
		await expect(
			invoke(Campaigns.get, { campaignId: 'x'.repeat(51) }),
		).rejects.toThrow();
	});

	it('rejects a create with no settings section', async () => {
		await expect(
			invoke(Campaigns.create, { campaignId: 'coffee', settings: {} }),
		).rejects.toThrow(/at least one settings section/);
	});

	it('rejects merchant lists that would be combined', async () => {
		// The docs do not define how allowList, blockList and list interact, so
		// sending two of them is rejected rather than sent to be guessed at.
		await expect(
			invoke(Campaigns.create, {
				campaignId: 'coffee',
				settings: {
					merchantNames: {
						allowList: ['Fresh Market'],
						blockList: ['Other'],
					},
				},
			}),
		).rejects.toThrow(/one of allowList, blockList or list/);
	});

	it('rejects a product-code section with both a description and a list', async () => {
		await expect(
			invoke(Campaigns.create, {
				campaignId: 'coffee',
				settings: {
					productCodes: { description: 'Find coffee codes', list: ['COF-250'] },
				},
			}),
		).rejects.toThrow();
	});

	it('rejects a balanceOwing section with no max', async () => {
		await expect(
			invoke(Campaigns.create, {
				campaignId: 'coffee',
				settings: { balanceOwing: { skip: true } },
			}),
		).rejects.toThrow();
	});

	it('rejects a balanceOwing max of zero, which Taggun does not compare', async () => {
		// The write side still refuses it: sending zero would look like a rule
		// and behave like no rule.
		await expect(
			invoke(Campaigns.create, {
				campaignId: 'coffee',
				settings: { balanceOwing: { max: 0 } },
			}),
		).rejects.toThrow(/greater than zero/);
	});

	it('rejects a zero balanceOwing max on update as well as create', async () => {
		await expect(
			invoke(Campaigns.update, {
				campaignId: 'coffee',
				settings: { balanceOwing: { max: 0 } },
			}),
		).rejects.toThrow(/greater than zero/);
	});

	it('rejects a half-specified totalPrice range', async () => {
		await expect(
			invoke(Campaigns.create, {
				campaignId: 'coffee',
				settings: { productLineItems: { totalPrice: { min: 5 } } },
			}),
		).rejects.toThrow(/both min and max/);
	});

	it('rejects an inverted price range', async () => {
		await expect(
			invoke(Campaigns.create, {
				campaignId: 'coffee',
				settings: { productLineItems: { totalPrice: { min: 80, max: 5 } } },
			}),
		).rejects.toThrow(/must not exceed/);
	});

	it('rejects a smartValidate prompt with more than one answer key', async () => {
		await expect(
			invoke(Campaigns.create, {
				campaignId: 'coffee',
				settings: {
					smartValidate: {
						prompts: [
							{
								question: 'Is it paid by card?',
								example: { is_credit_card: true, is_cash: false },
							},
						],
					},
				},
			}),
		).rejects.toThrow(/exactly one boolean key/);
	});

	it('rejects more than three smartValidate prompts', async () => {
		await expect(
			invoke(Campaigns.create, {
				campaignId: 'coffee',
				settings: {
					smartValidate: {
						prompts: Array.from({ length: 4 }, (_, index) => ({
							question: `Question ${index}?`,
							example: { [`key_${index}`]: true },
						})),
					},
				},
			}),
		).rejects.toThrow();
	});

	it('rejects an inline merchant name rule with an empty allowed list', async () => {
		await expect(
			invoke(ReceiptValidation.url, {
				url: 'https://example.com/receipts/receipt-123.png',
				validation: { merchantName: { allowed: [] } },
			}),
		).rejects.toThrow();
	});

	it('rejects an inline address confidence above the documented maximum', async () => {
		await expect(
			invoke(ReceiptValidation.url, {
				url: 'https://example.com/receipts/receipt-123.png',
				validation: {
					merchantAddress: { value: '702 E Boise Ave', confidenceThreshold: 1 },
				},
			}),
		).rejects.toThrow();
	});
});
