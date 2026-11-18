import { z } from 'zod';
import { bool, num, str } from '../schema-helpers';

export const AccountInputSchemas = {
	accountGet: z.object({}).strict(),
} as const;

export const AccountOutputSchemas = {
	accountGet: z
		.object({
			uid: str.describe('Team unique identifier'),
			team: str.describe('Team name'),
			admin_email: str.describe('Admin user email address'),
			total_credits: num.describe('Total wallet balance available'),
			credits_used: num.describe('Wallet balance consumed'),
			credits_remaining: num.describe('Remaining wallet balance available'),
			credits_per_google_mailbox: num.describe(
				'Price set for each Google mailbox per month, in USD.',
			),
			credits_per_ms_outlook_mailbox: num.describe(
				'Price set for each Microsoft Outlook mailbox per month, in USD.',
			),
			credits_per_azure_domain: num.describe(
				'Your current price for each new Azure domain, per month, in USD. Azure is charged per domain, not per mailbox.',
			),
			mailbox_renewal_cycle: str.describe(
				'How often your mailboxes and Azure domains are billed. A purchase is charged for one full cycle up front: 1 month for monthly, 3 for quarterly, 12 for yearly.',
			),
			subscription_mailbox_slots_google: num.describe(
				'Google mailbox slots granted by the subscription plan.',
			),
			subscription_mailbox_slots_google_used: num.describe(
				'Google slots currently occupied. Counted from live mailboxes, so it includes mailboxes scheduled for cancellation until their renewal date passes.',
			),
			subscription_mailbox_slots_google_remaining: num.describe(
				'Google slots still free. This is how many more Google mailboxes a Google-only order can place on slots without drawing on the wallet balance, provided…',
			),
			subscription_mailbox_slots_ms_outlook: num.describe(
				'Microsoft Outlook mailbox slots granted by the subscription plan.',
			),
			subscription_mailbox_slots_ms_outlook_used: num.describe(
				'Microsoft Outlook slots currently occupied. Counted from live mailboxes, so it includes mailboxes scheduled for cancellation until their renewal date passes.',
			),
			subscription_mailbox_slots_ms_outlook_remaining: num.describe(
				'Microsoft Outlook slots still free. This is how many more Outlook mailboxes an Outlook-only order can place on slots, provided…',
			),
			subscription_mailbox_slots_total: num.describe(
				'Total slots across both platforms (Google + Microsoft Outlook). Azure is not included: it is priced per domain and has no slot pool.',
			),
			subscription_mailbox_slots_used: num.describe(
				'Total slots occupied across both platforms.',
			),
			subscription_mailbox_slots_remaining: num.describe(
				'Total slots still free across both platforms. IMPORTANT: this is the sum of the two per-platform remaining values, NOT total minus used.',
			),
			subscription_mailbox_slots_purchasable: bool.describe(
				"Whether slots can be spent right now. False when the team's subscription is past_due, unpaid, cancelled, incomplete or payment_failed, in which case every slot…",
			),
			current_plan: z
				.object({
					name: str.describe('Plan name'),
					uid: str.describe('Plan unique identifier'),
					cycle: str.describe('Billing cycle'),
					pricing: num.describe('Plan price in USD'),
					renews_on: str.describe('Next renewal date'),
					purchased_on: str.describe('Purchase date'),
				})
				.loose()
				.nullish()
				.describe('Current subscription plan details'),
			auto_topup_enabled: bool.describe(
				'Whether automatic amount top-up is enabled',
			),
			auto_topup_config: z
				.object({
					mode: str.describe(
						'How auto top-up decides when to add funds. `threshold` adds `add_credits` when your balance drops below `drops_below`.',
					),
					drops_below: num.describe('Amount threshold to trigger auto top-up'),
					add_credits: num.describe('Amount to add during top-up'),
					forecast_hours: num.describe(
						'How many hours ahead forecast mode looks for upcoming renewals. May be missing on settings saved before forecast mode was available.',
					),
				})
				.loose()
				.nullish()
				.describe('Auto top-up configuration settings'),
			webhook_url: str.describe(
				'Webhook URL set for your account, or null when none is set.',
			),
		})
		.loose(),
} as const;
