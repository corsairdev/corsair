import {
	DialpadEndpointInputSchemas,
	DialpadEndpointOutputSchemas,
} from './endpoints/types';

// Trimmed from the 200 example on https://developers.dialpad.com/reference/usersget.md:
// 64-bit integers arrive as decimal strings and the user carries `has_rbac`,
// which the documented schema does not list.
const documentedUser = {
	admin_office_ids: ['5088669967352129'],
	company_id: '4418352216239435',
	display_name: 'Test Bot',
	do_not_disturb: false,
	group_details: [
		{
			do_not_disturb: false,
			group_id: '4038308042484412',
			group_type: 'callcenter',
			role: 'admin',
		},
	],
	has_rbac: false,
	id: '6412710217718020',
	is_admin: true,
	license: 'talk',
	office_id: '5088669967352129',
	on_duty_status: 'unavailable',
	onboarding_completed: true,
	state: 'active',
	voicemail: { is_default_voicemail: true, name: 'default' },
};

describe('Dialpad response shapes', () => {
	it('parses a documented user whose ids are decimal strings', () => {
		const parsed =
			DialpadEndpointOutputSchemas['users.get'].parse(documentedUser);
		expect(parsed.id).toBe('6412710217718020');
		expect(parsed.has_rbac).toBe(false);
	});

	it('parses a users.list page of documented users', () => {
		const result = DialpadEndpointOutputSchemas['users.list'].safeParse({
			cursor: 'next',
			items: [documentedUser],
		});
		expect(result.success).toBe(true);
	});

	it('keeps reading when Dialpad adds an enum value', () => {
		const result = DialpadEndpointOutputSchemas['users.get'].safeParse({
			...documentedUser,
			license: 'some_future_license',
		});
		expect(result.success).toBe(true);
	});

	it('parses millisecond timestamps sent as strings on call info', () => {
		const result = DialpadEndpointOutputSchemas['call.get_call_info'].safeParse(
			{
				call_id: '6219138425569280',
				date_started: '1356998400000',
			},
		);
		expect(result.success).toBe(true);
	});

	it('accepts an id read from a response as a path parameter', () => {
		expect(
			DialpadEndpointInputSchemas['callcenters.get'].safeParse({
				path: { id: '6412710217718020' },
			}).success,
		).toBe(true);
		expect(
			DialpadEndpointInputSchemas['callcenters.get'].safeParse({
				path: { id: 'not-a-number' },
			}).success,
		).toBe(false);
	});

	it('still rejects undocumented request fields', () => {
		expect(
			DialpadEndpointInputSchemas['callcenters.get'].safeParse({
				path: { id: '1', extra: true },
			}).success,
		).toBe(false);
	});

	it('accepts the empty bodies Dialpad returns for no-content operations', () => {
		for (const body of [undefined, '', {}]) {
			expect(
				DialpadEndpointOutputSchemas['blockednumbers.add'].safeParse(body)
					.success,
			).toBe(true);
		}
	});
});
