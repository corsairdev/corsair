import { ThinkificComponentSchemas } from './endpoints/schemas';
import { thinkificEndpointOperations } from './test-fixtures';

describe('Thinkific operation schemas', () => {
	for (const operation of thinkificEndpointOperations) {
		it(`${operation.key} validates its documented input and output`, () => {
			expect(
				operation.inputSchema.safeParse(operation.inputFixture).success,
			).toBe(true);
			expect(
				operation.outputSchema.safeParse(operation.outputFixture).success,
			).toBe(true);

			const invalidInput = {
				...operation.inputFixture,
				undocumented: 'not accepted',
			};
			expect(operation.inputSchema.safeParse(invalidInput).success).toBe(false);
			expect(operation.outputSchema.safeParse(null).success).toBe(false);
		});
	}

	it('accepts documented nullable product-price response fields', () => {
		expect(
			ThinkificComponentSchemas.ProductPriceResponse.safeParse({
				label: null,
			}).success,
		).toBe(true);
	});

	it('validates publish-request lists with publish-request items', () => {
		const response = ThinkificComponentSchemas.GetProductPublishResponse;
		expect(
			response.safeParse({
				items: [{ product_id: 1, requesting_user_id: 2, status: 'pending' }],
				meta: {},
			}).success,
		).toBe(true);
		expect(
			response.safeParse({
				items: [{ id: 1, name: 'Promotion' }],
				meta: {},
			}).success,
		).toBe(false);
	});

	it('enforces documented user password length and role enums', () => {
		const userRequest = ThinkificComponentSchemas.CreateUserRequest;
		const requiredUserFields = {
			first_name: 'Sample',
			last_name: 'Learner',
			email: 'learner@example.com',
		};
		expect(
			userRequest.safeParse({ ...requiredUserFields, password: '12345' })
				.success,
		).toBe(false);
		expect(
			userRequest.safeParse({ ...requiredUserFields, roles: ['not_a_role'] })
				.success,
		).toBe(false);
		expect(
			userRequest.safeParse({ ...requiredUserFields, roles: ['course_admin'] })
				.success,
		).toBe(true);
	});

	it('registers input and output schemas for all implemented routes', () => {
		expect(thinkificEndpointOperations).toHaveLength(73);
		for (const operation of thinkificEndpointOperations) {
			expect(operation.inputSchema).toBeDefined();
			expect(operation.outputSchema).toBeDefined();
		}
	});
});
