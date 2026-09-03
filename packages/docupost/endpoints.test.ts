import {
	DocupostEndpointInputSchemas,
	DocupostEndpointOutputSchemas,
} from './endpoints/types';

describe('Docupost endpoints', () => {
	describe('send.letter', () => {
		it('accepts a valid letter input', () => {
			const result = DocupostEndpointInputSchemas.sendLetter.safeParse({
				to_name: 'John Doe',
				to_address: '123 Main St',
				to_city: 'Austin',
				to_state: 'TX',
				to_zip: '78701',
				from_name: 'Jane Doe',
				from_address: '456 Oak St',
				from_city: 'Austin',
				from_state: 'TX',
				from_zip: '78702',
				html: '<p>Hello</p>',
			});

			expect(result.success).toBe(true);
		});

		it('rejects a letter input without recipient name', () => {
			const result = DocupostEndpointInputSchemas.sendLetter.safeParse({
				to_address: '123 Main St',
				to_city: 'Austin',
				to_state: 'TX',
				to_zip: '78701',
				from_name: 'Jane Doe',
				from_address: '456 Oak St',
				from_city: 'Austin',
				from_state: 'TX',
				from_zip: '78702',
				html: '<p>Hello</p>',
			});

			expect(result.success).toBe(false);
		});

		it('accepts a valid letter output', () => {
			const result = DocupostEndpointOutputSchemas.sendLetter.safeParse({
				id: 'letter-123',
				status: 'sent',
			});

			expect(result.success).toBe(true);
		});
	});

	describe('send.postcard', () => {
		it('accepts a valid postcard input', () => {
			const result = DocupostEndpointInputSchemas.sendPostcard.safeParse({
				to_name: 'John Doe',
				to_address: '123 Main St',
				to_city: 'Austin',
				to_state: 'TX',
				to_zip: '78701',
				from_name: 'Jane Doe',
				from_address: '456 Oak St',
				from_city: 'Austin',
				from_state: 'TX',
				from_zip: '78702',
				front_image_url: 'https://example.com/front.jpg',
				back_image_url: 'https://example.com/back.jpg',
			});

			expect(result.success).toBe(true);
		});

		it('rejects a postcard without front image URL', () => {
			const result = DocupostEndpointInputSchemas.sendPostcard.safeParse({
				to_name: 'John Doe',
				to_address: '123 Main St',
				to_city: 'Austin',
				to_state: 'TX',
				to_zip: '78701',
				from_name: 'Jane Doe',
				from_address: '456 Oak St',
				from_city: 'Austin',
				from_state: 'TX',
				from_zip: '78702',
				back_image_url: 'https://example.com/back.jpg',
			});

			expect(result.success).toBe(false);
		});

		it('accepts a valid postcard output', () => {
			const result = DocupostEndpointOutputSchemas.sendPostcard.safeParse({
				id: 'postcard-123',
				status: 'sent',
			});

			expect(result.success).toBe(true);
		});
	});
});
