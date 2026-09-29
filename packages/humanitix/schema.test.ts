import { HumanitixSchema } from './schema';
import { HumanitixEvent, HumanitixTag } from './schema/database';

describe('Humanitix schema', () => {
	it('declares a semver version', () => {
		expect(HumanitixSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers official events and tags entities', () => {
		expect(Object.keys(HumanitixSchema.entities)).toEqual(['events', 'tags']);
		expect(HumanitixSchema.entities.events).toBe(HumanitixEvent);
		expect(HumanitixSchema.entities.tags).toBe(HumanitixTag);
	});

	it('parses an official-shaped event', () => {
		const event = HumanitixEvent.parse({
			_id: '64f1c2a9b1234567890abcd',
			name: 'Summer Music Festival',
			startDate: '2025-07-20T10:00:00Z',
			location: 'AU',
			eventLocation: { type: 'address', city: 'Sydney', country: 'AU' },
		});
		expect(event._id).toBe('64f1c2a9b1234567890abcd');
		expect(event.eventLocation?.city).toBe('Sydney');
	});

	it('parses an official-shaped tag', () => {
		const tag = HumanitixTag.parse({
			_id: '64f1c2a9b7d34e0012345678',
			name: 'VIP',
			location: 'AU',
		});
		expect(tag.name).toBe('VIP');
	});
});
