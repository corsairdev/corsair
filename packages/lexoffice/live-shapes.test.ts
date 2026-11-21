// Response shapes from a live Lexware Office trial (11-21), trimmed. The voucher id is from the test account.
import { VoucherListResponseSchema } from './endpoints/types';

describe('Lexware live response shapes', () => {
	it('lists an unchecked uploaded voucher that has no voucherDate or number yet', () => {
		const parsed = VoucherListResponseSchema.parse({
			content: [
				{
					id: '8d8bfe46-659e-4114-af93-ad177e9f9180',
					voucherType: 'purchaseinvoice',
					voucherStatus: 'unchecked',
					createdDate: '2026-11-21T15:46:00.000+01:00',
					updatedDate: '2026-11-21T15:46:01.000+01:00',
					currency: 'EUR',
					archived: false,
				},
			],
			first: true,
			last: true,
			totalPages: 1,
			totalElements: 1,
			numberOfElements: 1,
			size: 1,
			number: 0,
		});
		expect(parsed.content[0]?.voucherDate).toBeUndefined();
	});
});
