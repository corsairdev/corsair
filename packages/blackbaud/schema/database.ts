import { z } from 'zod';
import {
	GetMembershipDetailsResponseSchema,
	GetPaymentTransactionResponseSchema,
	GiftReadShape,
	JsonWebKeySchema,
} from '../endpoints/types';

// Gift API Gift object:
// https://developer.sky.blackbaud.com/developer/apis/gift-api/operations?api-version=2022-04-01-preview
export const BlackbaudGift = z.object({
	...GiftReadShape,
	id: z.string(),
});

// Gift API GiftBatchGift (a gift sitting in an open batch, not yet approved):
// https://developer.sky.blackbaud.com/developer/apis/gift-api/operations?api-version=2022-04-01-preview
export const BlackbaudBatchGift = z.object({
	...GiftReadShape,
	id: z.string(),
	batch_id: z.string().optional(),
	approved_gift_id: z.string().optional(),
});

// Membership API MembershipDetails. The API returns no id, so the entity id
// is the member_junction_id the details were requested for.
// https://developer.sky.blackbaud.com/developer/apis/membership-api/operations?api-version=2022-04-01-preview
export const BlackbaudMembership = GetMembershipDetailsResponseSchema.extend({
	id: z.string(),
});

// Payments API TransactionRead:
// https://developer.sky.blackbaud.com/developer/apis/payments-api/operations?api-version=2022-04-01-preview
export const BlackbaudPaymentTransaction =
	GetPaymentTransactionResponseSchema.extend({
		id: z.string(),
	});

// JSON Web Key from https://oauth2.sky.blackbaud.com/publickeys, keyed by kid.
export const BlackbaudOneRosterKey = JsonWebKeySchema.extend({
	id: z.string(),
});

export type BlackbaudGift = z.infer<typeof BlackbaudGift>;
export type BlackbaudBatchGift = z.infer<typeof BlackbaudBatchGift>;
export type BlackbaudMembership = z.infer<typeof BlackbaudMembership>;
export type BlackbaudPaymentTransaction = z.infer<
	typeof BlackbaudPaymentTransaction
>;
export type BlackbaudOneRosterKey = z.infer<typeof BlackbaudOneRosterKey>;
