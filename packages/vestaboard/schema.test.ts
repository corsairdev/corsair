import {
	VestaboardCharactersSchema,
	VestaboardMessageEntity,
	VestaboardSubscriptionEntity,
	VestaboardViewerEntity,
} from './schema/database';
import { VestaboardSchema } from './schema';

describe('Vestaboard Schema Tests', () => {
	it('validates VestaboardSchema version and entities', () => {
		expect(VestaboardSchema.version).toBe('1.0.0');
		expect(VestaboardSchema.entities.messages).toBeDefined();
		expect(VestaboardSchema.entities.subscriptions).toBeDefined();
		expect(VestaboardSchema.entities.viewer).toBeDefined();
	});

	it('validates 6x22 characters matrix schema', () => {
		const validMatrix = Array.from({ length: 6 }, () => Array(22).fill(0));
		const result = VestaboardCharactersSchema.safeParse(validMatrix);
		expect(result.success).toBe(true);
	});

	it('rejects invalid character codes out of range', () => {
		const invalidMatrix = [[-1, 100]];
		const result = VestaboardCharactersSchema.safeParse(invalidMatrix);
		expect(result.success).toBe(false);
	});

	it('validates VestaboardMessageEntity', () => {
		const validMessage = {
			id: 'msg-123',
			text: 'Hello World',
			created: 1700000000,
		};
		const parsed = VestaboardMessageEntity.parse(validMessage);
		expect(parsed.id).toBe('msg-123');
		expect(parsed.text).toBe('Hello World');
	});

	it('validates VestaboardSubscriptionEntity', () => {
		const validSub = {
			_id: 'sub-456',
			_created: 1700000000,
			_user: { _id: 'usr-1', username: 'pragyan' },
			installation: {
				_id: 'inst-1',
				installable: { _id: 'inst-app-1', name: 'Corsair' },
			},
		};
		const parsed = VestaboardSubscriptionEntity.parse(validSub);
		expect(parsed._id).toBe('sub-456');
		expect(parsed._user?._id).toBe('usr-1');
	});

	it('validates VestaboardViewerEntity', () => {
		const validViewer = {
			_id: 'viewer-789',
			type: 'installation',
		};
		const parsed = VestaboardViewerEntity.parse(validViewer);
		expect(parsed._id).toBe('viewer-789');
	});
});
