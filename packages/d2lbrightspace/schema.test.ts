import type { D2lJsonValue, D2lRouteInput } from './endpoints/types';
import {
	createD2lRouteInputSchema,
	createD2lRouteOutputSchema,
	D2lRouteOutputSchema,
} from './endpoints/types';
import { D2L_ROUTES } from './route-definitions';

function valueForQuery(route: (typeof D2L_ROUTES)[number], name: string) {
	const typeName =
		route.queryDetails
			.find((detail) => detail.name === name)
			?.type.toLowerCase() ?? 'string';
	if (typeName.includes('boolean')) return true;
	if (
		typeName.includes('number') ||
		typeName.includes('integer') ||
		typeName.includes('d2lid')
	) {
		return '1';
	}
	return 'value';
}

function bodyForRoute(routeId: string): D2lJsonValue {
	const createUser = {
		OrgDefinedId: null,
		FirstName: 'Ada',
		MiddleName: null,
		LastName: 'Lovelace',
		ExternalEmail: null,
		UserName: 'ada',
		RoleId: 1,
		IsActive: true,
		SendCreationEmail: false,
		Pronouns: null,
	};
	switch (routeId) {
		case 'd2l0004':
			return [{ ProductCode: 'lp', Version: '1.49' }];
		case 'd2l0855':
			return createUser;
		case 'd2l0858':
			return {
				OrgDefinedId: '',
				FirstName: 'Ada',
				MiddleName: null,
				LastName: 'Lovelace',
				ExternalEmail: null,
				UserName: 'ada',
				Activation: { IsActive: true },
				Pronouns: null,
			};
		case 'd2l0860':
			return { IsActive: true };
		case 'd2l0863':
			return {
				LegalFirstName: 'Ada',
				LegalLastName: 'Lovelace',
				PreferredFirstName: null,
				PreferredLastName: null,
				SortLastName: null,
			};
		case 'd2l0865':
			return { ForcePasswordReset: false };
		case 'd2l0866':
			return { Password: 'secure-password-fixture', ForcePasswordReset: false };
		case 'd2l0868':
			return [createUser];
		case 'd2l0869':
			return {
				SourceUserId: 1,
				DestinationUserId: 2,
				IncludedTools: ['awards'],
				DeleteSourceUser: false,
			};
		case 'd2l0871':
			return {
				UserDefinedPronouns: null,
				ShowPronouns: false,
				UseUserDefinedPronouns: false,
			};
		case 'd2l0873':
			return { ShowPronouns: false };
		default:
			return { value: 'fixture' };
	}
}

function validInput(route: (typeof D2L_ROUTES)[number]): D2lRouteInput {
	return {
		pathParams: Object.fromEntries(
			route.pathParams.map((name) => [name, 'value']),
		),
		...(route.queryParams.length > 0
			? {
					query: Object.fromEntries(
						route.queryParams.map((name) => [name, valueForQuery(route, name)]),
					),
				}
			: {}),
		...(route.jsonParams.length > 0
			? {
					body: bodyForRoute(route.routeId),
				}
			: {}),
		...(route.formFields.length > 0
			? {
					form: Object.fromEntries(
						route.formDetails.map((field) => [
							field.name,
							field.repeatable ? ['1'] : 'value',
						]),
					),
				}
			: {}),
		...(route.filePartNames.length > 0
			? {
					files: [
						{
							filename: 'fixture.txt',
							contentType: 'text/plain',
							base64: 'Zml4dHVyZQ==',
						},
					],
				}
			: {}),
		...(route.requestMode === 'resumable'
			? {
					upload: {
						filename: 'fixture.zip',
						contentType: 'application/zip',
						base64: 'Zml4dHVyZQ==',
					},
				}
			: {}),
	};
}

describe('D2L route schemas', () => {
	it('validates input and JSON output for all implemented routes', () => {
		const routes = D2L_ROUTES.filter(
			(route) => route.coverageStatus !== 'excluded',
		);
		expect(routes).toHaveLength(874);
		expect(
			routes.filter((route) => route.coverageStatus === 'schema_audited'),
		).toHaveLength(47);
		expect(
			routes.filter((route) => route.responseMode === 'binary'),
		).toHaveLength(26);
		for (const route of routes) {
			const inputSchema = createD2lRouteInputSchema(route);
			expect(inputSchema.safeParse(validInput(route)).success).toBe(true);
			const invalidPathParams = Object.fromEntries(
				route.pathParams.length > 0 ? [] : [['undocumented', 'value']],
			);
			const invalidInput =
				route.pathParams.length > 0
					? { pathParams: {} }
					: { pathParams: invalidPathParams };
			expect(inputSchema.safeParse(invalidInput).success).toBe(false);
		}
	});

	it('rejects non-JSON output and accepts nullable, primitive, array and object JSON', () => {
		for (const value of [null, true, 1, 'text', [], { key: 'value' }]) {
			expect(D2lRouteOutputSchema.safeParse(value).success).toBe(true);
		}
		expect(D2lRouteOutputSchema.safeParse(new Date()).success).toBe(false);
		expect(D2lRouteOutputSchema.safeParse(undefined).success).toBe(true);
	});

	it('uses documented operation schemas for API version discovery routes', () => {
		const route = (routeId: string) => {
			const found = D2L_ROUTES.find((entry) => entry.routeId === routeId);
			if (!found) throw new Error(`Missing route ${routeId}`);
			return found;
		};
		const productVersions = createD2lRouteOutputSchema(route('d2l0001'));
		const supportedVersion = createD2lRouteOutputSchema(route('d2l0002'));
		const versions = createD2lRouteOutputSchema(route('d2l0003'));
		const checkedVersions = createD2lRouteOutputSchema(route('d2l0004'));
		expect(
			productVersions.safeParse({
				ProductCode: 'lp',
				LatestVersion: '1.99',
				SupportedVersions: ['1.49'],
				FutureD2LField: true,
			}).success,
		).toBe(true);
		expect(
			supportedVersion.safeParse({ Supported: true, LatestVersion: '1.99' })
				.success,
		).toBe(true);
		expect(
			versions.safeParse([
				{
					ProductCode: 'lp',
					LatestVersion: '1.99',
					SupportedVersions: ['1.49'],
				},
			]).success,
		).toBe(true);
		expect(
			checkedVersions.safeParse({
				Supported: true,
				Versions: [
					{
						ProductCode: 'lp',
						Version: '1.49',
						Supported: true,
						LatestVersion: '1.99',
					},
				],
			}).success,
		).toBe(true);
		const whoAmI = D2L_ROUTES.find((entry) => entry.routeId === 'd2l0876');
		if (!whoAmI) throw new Error('D2L whoami route is missing.');
		expect(
			createD2lRouteOutputSchema(whoAmI).safeParse({
				Identifier: '1',
				FirstName: 'Ada',
				LastName: 'Lovelace',
				UniqueName: 'ada',
				ProfileIdentifier: 'profile',
				Pronouns: '',
			}).success,
		).toBe(true);
		const user = D2L_ROUTES.find((entry) => entry.routeId === 'd2l0857');
		if (!user) throw new Error('D2L get-user route is missing.');
		expect(
			createD2lRouteOutputSchema(user).safeParse({
				OrgId: 1,
				UserId: 1,
				FirstName: 'Ada',
				MiddleName: null,
				LastName: 'Lovelace',
				UserName: 'ada',
				ExternalEmail: null,
				OrgDefinedId: null,
				UniqueIdentifier: 'ada',
				Activation: { IsActive: true },
				DisplayName: 'Ada Lovelace',
				LastAccessedDate: null,
				Pronouns: '',
				FirstLoginDate: null,
			}).success,
		).toBe(true);
		expect(
			createD2lRouteInputSchema(route('d2l0004')).safeParse({
				pathParams: {},
				body: [{ ProductCode: 'lp', Version: '1.49' }],
			}).success,
		).toBe(true);
		for (const binaryRoute of D2L_ROUTES.filter(
			(entry) => entry.responseMode === 'binary',
		)) {
			expect(
				createD2lRouteOutputSchema(binaryRoute).safeParse({
					kind: 'binary',
					contentType: 'application/octet-stream',
					base64: 'AA==',
					sizeBytes: 1,
				}).success,
			).toBe(true);
		}
	});
});
