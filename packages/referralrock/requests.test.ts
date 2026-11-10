import * as Endpoints from './endpoints/endpoints';
import {
	MEMBER,
	MEMBER_ID,
	MEMBER_REJECTED,
	MEMBER_SET,
	MEMBER_SET_MORE,
	PROGRAM_ID,
	PROGRAM_SET,
	REFERRAL,
	REFERRAL_ID,
	REFERRAL_SET,
	REWARD,
	REWARD_SET,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('programs.list', () => {
	it('lists programs', async () => {
		respond(fetchMock, PROGRAM_SET);

		const result = (await invoke(Endpoints.programsList, {})) as Awaited<
			ReturnType<typeof Endpoints.programsList>
		>;

		expect(lastRequest(fetchMock).path).toBe('/api/programs');
		expect(result.programs[0]?.name).toBe('acme-referrals');
		expect(result.programs[0]?.isActive).toBe(true);
		expect(result.total).toBe(1);
		// A single page, so there is no next offset.
		expect(result.next_offset).toBeNull();
	});

	it('narrows to one program id', async () => {
		respond(fetchMock, PROGRAM_SET);

		await invoke(Endpoints.programsList, { program_id: PROGRAM_ID });

		expect(lastRequest(fetchMock).query).toEqual({ programId: PROGRAM_ID });
	});
});

describe('members.list', () => {
	it('sends the filters and reports the next offset', async () => {
		respond(fetchMock, MEMBER_SET_MORE);

		const result = (await invoke(Endpoints.membersList, {
			program_id: PROGRAM_ID,
			query: 'sam@example.com',
			show_disabled: false,
			offset: 0,
		})) as Awaited<ReturnType<typeof Endpoints.membersList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/members');
		expect(request.query).toEqual({
			programId: PROGRAM_ID,
			query: 'sam@example.com',
			showDisabled: 'false',
			offset: '0',
		});
		expect(result.members[0]?.referralCode).toBe('SAM123');
		// One row of five, so the next page starts at 1.
		expect(result.next_offset).toBe(1);
		expect(result.total).toBe(5);
	});

	it('stops paging once the rows reach the total', async () => {
		respond(fetchMock, MEMBER_SET);

		const result = (await invoke(Endpoints.membersList, {})) as Awaited<
			ReturnType<typeof Endpoints.membersList>
		>;

		expect(result.next_offset).toBeNull();
	});

	it('rejects an unrecognised sort, which the API would silently ignore', async () => {
		await expect(
			invoke(Endpoints.membersList, { sort: 'Name_Asc' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts a documented sort value exactly', async () => {
		respond(fetchMock, MEMBER_SET);

		await invoke(Endpoints.membersList, { sort: 'Member_Full_Name_Asc' });

		expect(lastRequest(fetchMock).query.sort).toBe('Member_Full_Name_Asc');
	});
});

describe('members.create', () => {
	it('posts the member with the program id and the email flag as a query', async () => {
		respond(fetchMock, { member: MEMBER, message: '' });

		const result = (await invoke(Endpoints.membersCreate, {
			program_id: PROGRAM_ID,
			first_name: 'Sam',
			last_name: 'Rivera',
			email: 'sam@example.com',
			should_send_email: true,
		})) as Awaited<ReturnType<typeof Endpoints.membersCreate>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/api/members');
		expect(request.query).toEqual({ shouldSendEmail: 'true' });
		expect(request.json()).toEqual({
			programId: PROGRAM_ID,
			firstName: 'Sam',
			lastName: 'Rivera',
			email: 'sam@example.com',
		});
		expect(result.member?.id).toBe(MEMBER_ID);
	});

	it('rejects a member with no email', async () => {
		await expect(
			invoke(Endpoints.membersCreate, {
				program_id: PROGRAM_ID,
				first_name: 'Sam',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a member with no program', async () => {
		await expect(
			invoke(Endpoints.membersCreate, {
				first_name: 'Sam',
				email: 'sam@example.com',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('returns the message when the API refuses with a 200', async () => {
		respond(fetchMock, MEMBER_REJECTED);

		const result = (await invoke(Endpoints.membersCreate, {
			program_id: PROGRAM_ID,
			first_name: 'Sam',
			email: 'sam@example.com',
		})) as Awaited<ReturnType<typeof Endpoints.membersCreate>>;

		// A refusal arrives as a 200 with the reason in `message`, so the caller
		// sees both the absence of a member and the reason.
		expect(result.member).toBeNull();
		expect(result.message).toContain('already exists');
	});
});

describe('referrals', () => {
	it('lists referrals for a member', async () => {
		respond(fetchMock, REFERRAL_SET);

		const result = (await invoke(Endpoints.referralsList, {
			member_id: MEMBER_ID,
			status: 'Qualified',
		})) as Awaited<ReturnType<typeof Endpoints.referralsList>>;

		expect(lastRequest(fetchMock).query).toEqual({
			memberId: MEMBER_ID,
			status: 'Qualified',
		});
		expect(result.referrals[0]?.status).toBe('Qualified');
		expect(result.referrals[0]?.referringMemberId).toBe(MEMBER_ID);
	});

	it('creates a referral against a referral code', async () => {
		respond(fetchMock, { referral: REFERRAL, message: '' });

		await invoke(Endpoints.referralsCreate, {
			referral_code: 'SAM123',
			first_name: 'Jordan',
			last_name: 'Lee',
			email: 'jordan@example.com',
			amount: 250,
			external_identifier: 'order-42',
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			referralCode: 'SAM123',
			firstName: 'Jordan',
			lastName: 'Lee',
			email: 'jordan@example.com',
			amount: 250,
			externalIdentifier: 'order-42',
		});
	});

	it('rejects a referral with no code', async () => {
		await expect(
			invoke(Endpoints.referralsCreate, { email: 'jordan@example.com' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a preferred contact the API does not define', async () => {
		await expect(
			invoke(Endpoints.referralsCreate, {
				referral_code: 'SAM123',
				preferred_contact: 'sms',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('rewards', () => {
	it('lists rewards for a member', async () => {
		respond(fetchMock, REWARD_SET);

		const result = (await invoke(Endpoints.rewardsList, {
			member_id: MEMBER_ID,
			status: 'Issued',
		})) as Awaited<ReturnType<typeof Endpoints.rewardsList>>;

		expect(lastRequest(fetchMock).query).toEqual({
			memberId: MEMBER_ID,
			status: 'Issued',
		});
		expect(result.rewards[0]?.amount).toBe(10);
		expect(result.rewards[0]?.payoutDescription).toBe('PayPal');
	});

	it('creates a reward in the array body the API takes', async () => {
		respond(fetchMock, { reward: REWARD, message: '' });

		await invoke(Endpoints.rewardsCreate, {
			member_id: MEMBER_ID,
			referral_id: REFERRAL_ID,
			amount: 10,
			payout_id: 'paypal',
			description: 'Referral bonus',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/api/rewards');
		// The route takes an array of reward infos, not a single object.
		expect(request.jsonArray()).toEqual([
			{
				memberQuery: { primaryInfo: { memberId: MEMBER_ID } },
				referralQuery: { primaryInfo: { referralId: REFERRAL_ID } },
				newReward: {
					amount: 10,
					payoutId: 'paypal',
					description: 'Referral bonus',
				},
			},
		]);
	});

	it('omits the referral query when no referral is given', async () => {
		respond(fetchMock, { reward: REWARD, message: '' });

		await invoke(Endpoints.rewardsCreate, {
			member_id: MEMBER_ID,
			amount: 5,
		});

		const body = lastRequest(fetchMock).jsonArray()[0];
		expect(body).not.toHaveProperty('referralQuery');
	});

	it('rejects a reward with no member', async () => {
		await expect(
			invoke(Endpoints.rewardsCreate, { amount: 10 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a negative amount', async () => {
		await expect(
			invoke(Endpoints.rewardsCreate, { member_id: MEMBER_ID, amount: -5 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('set envelope', () => {
	it('fails rather than inventing an empty list when the array is missing', async () => {
		respond(fetchMock, { offset: 0, total: 0 });

		await expect(invoke(Endpoints.membersList, {})).rejects.toThrow();
	});
});
