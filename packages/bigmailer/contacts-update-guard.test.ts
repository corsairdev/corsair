import { BigmailerEndpointInputSchemas } from './endpoints/types';

// A contact update that supplies a list array but omits its *_op would hit
// BigMailer's `replace` default and wipe existing values, so the schema
// requires the paired op.
describe('contactsUpdate list-op guard', () => {
	const base = { brandId: 'b1', contactId: 'c1' };

	it('rejects an array without its paired *_op', () => {
		const result = BigmailerEndpointInputSchemas.contactsUpdate.safeParse({
			...base,
			listIds: ['l1'],
		});
		expect(result.success).toBe(false);
	});

	it('accepts an array when its *_op is supplied', () => {
		const result = BigmailerEndpointInputSchemas.contactsUpdate.safeParse({
			...base,
			listIds: ['l1'],
			listIdsOp: 'add',
		});
		expect(result.success).toBe(true);
	});

	it('accepts an update with no list arrays', () => {
		const result = BigmailerEndpointInputSchemas.contactsUpdate.safeParse({
			...base,
			email: 'x@example.com',
		});
		expect(result.success).toBe(true);
	});
});
