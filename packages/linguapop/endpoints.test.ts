import { ZodError } from 'zod';
import {
	LinguapopEndpointInputSchemas as Inputs,
	LinguapopEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import { linguapop } from './index';
import {
	htmlFallbackBody,
	invalidKeyBody,
	invitationNoKioskFixture,
	invitationRequestFixture,
	invitationResponseFixture,
	languagesFixture,
	validationProblemBody,
} from './test-fixtures';
import {
	blockFetch,
	captureError,
	jsonResponse,
	linguapopFailure,
	makeContext,
	problemResponse,
	textResponse,
} from './test-helpers';

const API_KEY = 'lp-secret-test-key';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = blockFetch();
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

const plugin = linguapop({ key: API_KEY });
const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

const minimalInvitation = {
	email: 'candidate@example.com',
	languageCode: 'eng',
	sendEmail: false,
};

describe('languages.list output', () => {
	it('parses the live getLanguages answer', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(languagesFixture));

		const result = await endpoints.languages.list(makeContext(API_KEY), {});

		expect(result.map((language) => language.code)).toEqual([
			'eng',
			'ita',
			'spa',
			'ger',
			'fra',
		]);
		expect(result[0]).toEqual({ name: 'English', code: 'eng' });
	});

	it('accepts a language Linguapop adds later, since code is not an enum', () => {
		const parsed = Outputs.languagesList.parse([
			...languagesFixture,
			{ name: 'Portuguese', code: 'por', level: 'beta' },
		]);

		expect(parsed.at(-1)).toMatchObject({ code: 'por', level: 'beta' });
	});

	it('accepts an empty list', () => {
		expect(Outputs.languagesList.parse([])).toEqual([]);
	});

	it('rejects a wrong-shaped payload: an object instead of an array', () => {
		expect(
			Outputs.languagesList.safeParse({ languages: languagesFixture }).success,
		).toBe(false);
	});

	it('rejects a language without a code', () => {
		expect(Outputs.languagesList.safeParse([{ name: 'English' }]).success).toBe(
			false,
		);
	});

	it('rejects a malformed known field: a numeric code', () => {
		expect(
			Outputs.languagesList.safeParse([{ name: 'English', code: 1 }]).success,
		).toBe(false);
	});

	it('fails loudly on the HTML page a missing route answers with', async () => {
		fetchMock.mockResolvedValueOnce(
			textResponse(htmlFallbackBody, 200, 'text/html'),
		);

		const error = await captureError(
			endpoints.languages.list(makeContext(API_KEY), {}),
		);

		expect(error).toBeInstanceOf(ZodError);
	});

	it('takes no input', () => {
		expect(Inputs.languagesList.safeParse({}).success).toBe(true);
	});
});

describe('invitations.create output', () => {
	it('parses the documented example response', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(invitationResponseFixture));

		const result = await endpoints.invitations.create(
			makeContext(API_KEY),
			invitationRequestFixture,
		);

		expect(result).toEqual(invitationResponseFixture);
	});

	it('accepts a null kioskCode, which the docs promise when no kiosk was requested', () => {
		const parsed = Outputs.invitationsCreate.parse(invitationNoKioskFixture);

		expect(parsed.kioskCode).toBeNull();
	});

	it('accepts a response that omits the optional fields', () => {
		const parsed = Outputs.invitationsCreate.parse({
			invitationId: 7,
			url: invitationResponseFixture.url,
		});

		expect(parsed.invitationId).toBe(7);
		expect(parsed.kioskCode).toBeUndefined();
	});

	it('keeps fields the docs do not list', () => {
		const parsed = Outputs.invitationsCreate.parse({
			...invitationResponseFixture,
			expiresOn: '2026-12-01T00:00:00Z',
		});

		expect(parsed).toMatchObject({ expiresOn: '2026-12-01T00:00:00Z' });
	});

	it('rejects a wrong-shaped payload: a bare string', () => {
		expect(Outputs.invitationsCreate.safeParse('created').success).toBe(false);
	});

	it('rejects a response without the invitation id or the link', () => {
		expect(
			Outputs.invitationsCreate.safeParse({
				url: invitationResponseFixture.url,
			}).success,
		).toBe(false);
		expect(
			Outputs.invitationsCreate.safeParse({ invitationId: 1 }).success,
		).toBe(false);
	});

	it('rejects a malformed known field: a string id or a fractional id', () => {
		expect(
			Outputs.invitationsCreate.safeParse({
				...invitationResponseFixture,
				invitationId: '1',
			}).success,
		).toBe(false);
		expect(
			Outputs.invitationsCreate.safeParse({
				...invitationResponseFixture,
				invitationId: 1.5,
			}).success,
		).toBe(false);
	});

	it('throws a LinguapopAPIError carrying the 400 for an unrecognised key', async () => {
		fetchMock.mockResolvedValueOnce(textResponse(invalidKeyBody, 400));

		const error = await linguapopFailure(
			endpoints.invitations.create(makeContext(API_KEY), minimalInvitation),
		);

		expect(error.invalidApiKey).toBe(true);
		expect(error.message).toContain('No active integration');
	});

	it('throws a LinguapopAPIError for a validation failure', async () => {
		fetchMock.mockResolvedValueOnce(problemResponse(validationProblemBody));

		const error = await linguapopFailure(
			endpoints.invitations.create(makeContext(API_KEY), minimalInvitation),
		);

		expect(error.status).toBe(400);
		expect(error.message).toContain('The Email field is required.');
	});
});

describe('invitations.create input', () => {
	const parse = (value: Record<string, string | boolean | number>) =>
		Inputs.invitationsCreate.safeParse(value);

	it('accepts the documented example body', () => {
		expect(
			Inputs.invitationsCreate.safeParse(invitationRequestFixture).success,
		).toBe(true);
	});

	it('accepts the three required fields alone', () => {
		expect(Inputs.invitationsCreate.safeParse(minimalInvitation).success).toBe(
			true,
		);
	});

	it.each(['email', 'languageCode', 'sendEmail'])(
		'rejects a body without the required %s',
		(field) => {
			const without = Object.fromEntries(
				Object.entries(minimalInvitation).filter(([key]) => key !== field),
			);

			expect(parse(without).success).toBe(false);
		},
	);

	it('rejects a malformed email', () => {
		expect(parse({ ...minimalInvitation, email: 'not-an-email' }).success).toBe(
			false,
		);
	});

	it('rejects an empty language code but not a new one', () => {
		expect(parse({ ...minimalInvitation, languageCode: '' }).success).toBe(
			false,
		);
		expect(parse({ ...minimalInvitation, languageCode: 'por' }).success).toBe(
			true,
		);
	});

	it('rejects a non-boolean sendEmail', () => {
		expect(parse({ ...minimalInvitation, sendEmail: 'yes' }).success).toBe(
			false,
		);
	});

	it('pins externalIdentifier at 500 characters', () => {
		expect(
			parse({ ...minimalInvitation, externalIdentifier: 'x'.repeat(500) })
				.success,
		).toBe(true);
		expect(
			parse({ ...minimalInvitation, externalIdentifier: 'x'.repeat(501) })
				.success,
		).toBe(false);
	});

	it.each(['callbackUrl', 'returnUrl'])(
		'pins %s at 1000 characters',
		(field) => {
			const path = 'a'.repeat(1000 - 'https://example.com/'.length);
			const atLimit = `https://example.com/${path}`;

			expect(atLimit).toHaveLength(1000);
			expect(parse({ ...minimalInvitation, [field]: atLimit }).success).toBe(
				true,
			);
			expect(
				parse({ ...minimalInvitation, [field]: `${atLimit}a` }).success,
			).toBe(false);
		},
	);

	it.each(['callbackUrl', 'returnUrl'])(
		'rejects a %s that is not an http(s) URL',
		(field) => {
			expect(
				parse({ ...minimalInvitation, [field]: 'not a url' }).success,
			).toBe(false);
			expect(
				parse({ ...minimalInvitation, [field]: 'javascript:alert(1)' }).success,
			).toBe(false);
			expect(
				parse({ ...minimalInvitation, [field]: 'ftp://example.com/x' }).success,
			).toBe(false);
			expect(
				parse({ ...minimalInvitation, [field]: 'http://localhost:3000/x' })
					.success,
			).toBe(true);
		},
	);

	it('rejects a non-boolean section flag', () => {
		for (const field of ['testReading', 'testListening', 'generateKioskCode']) {
			expect(parse({ ...minimalInvitation, [field]: 'true' }).success).toBe(
				false,
			);
		}
	});

	it('rejects extra fields, including apiKey', () => {
		expect(parse({ ...minimalInvitation, apiKey: 'other' }).success).toBe(
			false,
		);
		expect(parse({ ...minimalInvitation, phone: '123' }).success).toBe(false);
	});

	it('never sends a request when the input is invalid', async () => {
		await expect(
			endpoints.invitations.create(makeContext(API_KEY), {
				...minimalInvitation,
				email: 'nope',
			}),
		).rejects.toBeInstanceOf(ZodError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
