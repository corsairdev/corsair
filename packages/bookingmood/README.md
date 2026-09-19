# @corsair-dev/bookingmood

Bookingmood plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bookingmood
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attributeOptions.list` | `bookingmood.api.attributeOptions.list` | `read` | Bookingmood attributeOptions list |
| `attributeOptions.update` | `bookingmood.api.attributeOptions.update` | `write` | Bookingmood attributeOptions update |
| `attributes.delete` | `bookingmood.api.attributes.delete` | `destructive` | Bookingmood attributes delete |
| `attributes.list` | `bookingmood.api.attributes.list` | `read` | Bookingmood attributes list |
| `attributes.update` | `bookingmood.api.attributes.update` | `write` | Bookingmood attributes update |
| `availability.query` | `bookingmood.api.availability.query` | `read` | Bookingmood availability query |
| `bookingDetails.delete` | `bookingmood.api.bookingDetails.delete` | `destructive` | Bookingmood bookingDetails delete |
| `bookingDetails.list` | `bookingmood.api.bookingDetails.list` | `read` | Bookingmood bookingDetails list |
| `bookingDetails.update` | `bookingmood.api.bookingDetails.update` | `write` | Bookingmood bookingDetails update |
| `bookings.delete` | `bookingmood.api.bookings.delete` | `destructive` | Bookingmood bookings delete |
| `bookings.list` | `bookingmood.api.bookings.list` | `read` | Bookingmood bookings list |
| `bookings.update` | `bookingmood.api.bookings.update` | `write` | Bookingmood bookings update |
| `bookingUpdates.list` | `bookingmood.api.bookingUpdates.list` | `read` | Bookingmood bookingUpdates list |
| `calendarEventNotes.delete` | `bookingmood.api.calendarEventNotes.delete` | `destructive` | Bookingmood calendarEventNotes delete |
| `calendarEventNotes.list` | `bookingmood.api.calendarEventNotes.list` | `read` | Bookingmood calendarEventNotes list |
| `calendarEventNotes.update` | `bookingmood.api.calendarEventNotes.update` | `write` | Bookingmood calendarEventNotes update |
| `calendarEvents.delete` | `bookingmood.api.calendarEvents.delete` | `destructive` | Bookingmood calendarEvents delete |
| `calendarEvents.list` | `bookingmood.api.calendarEvents.list` | `read` | Bookingmood calendarEvents list |
| `calendarEvents.update` | `bookingmood.api.calendarEvents.update` | `write` | Bookingmood calendarEvents update |
| `calendarEventUpdates.list` | `bookingmood.api.calendarEventUpdates.list` | `read` | Bookingmood calendarEventUpdates list |
| `capacities.delete` | `bookingmood.api.capacities.delete` | `destructive` | Bookingmood capacities delete |
| `capacities.list` | `bookingmood.api.capacities.list` | `read` | Bookingmood capacities list |
| `capacities.update` | `bookingmood.api.capacities.update` | `write` | Bookingmood capacities update |
| `capacityGroupDeps.delete` | `bookingmood.api.capacityGroupDeps.delete` | `destructive` | Bookingmood capacityGroupDeps delete |
| `capacityGroupDeps.list` | `bookingmood.api.capacityGroupDeps.list` | `read` | Bookingmood capacityGroupDeps list |
| `capacityGroupDeps.update` | `bookingmood.api.capacityGroupDeps.update` | `write` | Bookingmood capacityGroupDeps update |
| `capacityGroups.delete` | `bookingmood.api.capacityGroups.delete` | `destructive` | Bookingmood capacityGroups delete |
| `capacityGroups.list` | `bookingmood.api.capacityGroups.list` | `read` | Bookingmood capacityGroups list |
| `capacityGroups.update` | `bookingmood.api.capacityGroups.update` | `write` | Bookingmood capacityGroups update |
| `contactBookings.delete` | `bookingmood.api.contactBookings.delete` | `destructive` | Bookingmood contactBookings delete |
| `contactBookings.list` | `bookingmood.api.contactBookings.list` | `read` | Bookingmood contactBookings list |
| `contactBookings.update` | `bookingmood.api.contactBookings.update` | `write` | Bookingmood contactBookings update |
| `contacts.create` | `bookingmood.api.contacts.create` | `write` | Bookingmood contacts create |
| `contacts.delete` | `bookingmood.api.contacts.delete` | `destructive` | Bookingmood contacts delete |
| `contacts.list` | `bookingmood.api.contacts.list` | `read` | Bookingmood contacts list |
| `contacts.update` | `bookingmood.api.contacts.update` | `write` | Bookingmood contacts update |
| `couponProducts.delete` | `bookingmood.api.couponProducts.delete` | `destructive` | Bookingmood couponProducts delete |
| `couponProducts.list` | `bookingmood.api.couponProducts.list` | `read` | Bookingmood couponProducts list |
| `couponProducts.update` | `bookingmood.api.couponProducts.update` | `write` | Bookingmood couponProducts update |
| `coupons.delete` | `bookingmood.api.coupons.delete` | `destructive` | Bookingmood coupons delete |
| `coupons.list` | `bookingmood.api.coupons.list` | `read` | Bookingmood coupons list |
| `coupons.update` | `bookingmood.api.coupons.update` | `write` | Bookingmood coupons update |
| `couponServices.delete` | `bookingmood.api.couponServices.delete` | `destructive` | Bookingmood couponServices delete |
| `couponServices.list` | `bookingmood.api.couponServices.list` | `read` | Bookingmood couponServices list |
| `couponServices.update` | `bookingmood.api.couponServices.update` | `write` | Bookingmood couponServices update |
| `couponUses.delete` | `bookingmood.api.couponUses.delete` | `destructive` | Bookingmood couponUses delete |
| `couponUses.list` | `bookingmood.api.couponUses.list` | `read` | Bookingmood couponUses list |
| `couponUses.update` | `bookingmood.api.couponUses.update` | `write` | Bookingmood couponUses update |
| `externalCalendars.delete` | `bookingmood.api.externalCalendars.delete` | `destructive` | Bookingmood externalCalendars delete |
| `externalCalendars.list` | `bookingmood.api.externalCalendars.list` | `read` | Bookingmood externalCalendars list |
| `externalCalendars.update` | `bookingmood.api.externalCalendars.update` | `write` | Bookingmood externalCalendars update |
| `invoices.delete` | `bookingmood.api.invoices.delete` | `destructive` | Bookingmood invoices delete |
| `invoices.list` | `bookingmood.api.invoices.list` | `read` | Bookingmood invoices list |
| `lineItems.delete` | `bookingmood.api.lineItems.delete` | `destructive` | Bookingmood lineItems delete |
| `lineItems.list` | `bookingmood.api.lineItems.list` | `read` | Bookingmood lineItems list |
| `lineItems.update` | `bookingmood.api.lineItems.update` | `write` | Bookingmood lineItems update |
| `lineItemTaxes.delete` | `bookingmood.api.lineItemTaxes.delete` | `destructive` | Bookingmood lineItemTaxes delete |
| `lineItemTaxes.list` | `bookingmood.api.lineItemTaxes.list` | `read` | Bookingmood lineItemTaxes list |
| `lineItemTaxes.update` | `bookingmood.api.lineItemTaxes.update` | `write` | Bookingmood lineItemTaxes update |
| `members.delete` | `bookingmood.api.members.delete` | `destructive` | Bookingmood members delete |
| `members.invite` | `bookingmood.api.members.invite` | `write` | Bookingmood members invite |
| `members.list` | `bookingmood.api.members.list` | `read` | Bookingmood members list |
| `organizations.list` | `bookingmood.api.organizations.list` | `read` | Bookingmood organizations list |
| `paddleSubscriptions.list` | `bookingmood.api.paddleSubscriptions.list` | `read` | Bookingmood paddleSubscriptions list |
| `payments.delete` | `bookingmood.api.payments.delete` | `destructive` | Bookingmood payments delete |
| `payments.list` | `bookingmood.api.payments.list` | `read` | Bookingmood payments list |
| `payments.update` | `bookingmood.api.payments.update` | `write` | Bookingmood payments update |
| `permissions.delete` | `bookingmood.api.permissions.delete` | `destructive` | Bookingmood permissions delete |
| `permissions.list` | `bookingmood.api.permissions.list` | `read` | Bookingmood permissions list |
| `permissions.update` | `bookingmood.api.permissions.update` | `write` | Bookingmood permissions update |
| `pricingWidgets.delete` | `bookingmood.api.pricingWidgets.delete` | `destructive` | Bookingmood pricingWidgets delete |
| `pricingWidgets.list` | `bookingmood.api.pricingWidgets.list` | `read` | Bookingmood pricingWidgets list |
| `pricingWidgets.update` | `bookingmood.api.pricingWidgets.update` | `write` | Bookingmood pricingWidgets update |
| `productAttrOptions.delete` | `bookingmood.api.productAttrOptions.delete` | `destructive` | Bookingmood productAttrOptions delete |
| `productAttrOptions.list` | `bookingmood.api.productAttrOptions.list` | `read` | Bookingmood productAttrOptions list |
| `productAttrOptions.update` | `bookingmood.api.productAttrOptions.update` | `write` | Bookingmood productAttrOptions update |
| `productCalendarLogs.list` | `bookingmood.api.productCalendarLogs.list` | `read` | Bookingmood productCalendarLogs list |
| `productReplyAddrs.delete` | `bookingmood.api.productReplyAddrs.delete` | `destructive` | Bookingmood productReplyAddrs delete |
| `productReplyAddrs.list` | `bookingmood.api.productReplyAddrs.list` | `read` | Bookingmood productReplyAddrs list |
| `productReplyAddrs.update` | `bookingmood.api.productReplyAddrs.update` | `write` | Bookingmood productReplyAddrs update |
| `products.create` | `bookingmood.api.products.create` | `write` | Bookingmood products create |
| `products.delete` | `bookingmood.api.products.delete` | `destructive` | Bookingmood products delete |
| `products.list` | `bookingmood.api.products.list` | `read` | Bookingmood products list |
| `products.update` | `bookingmood.api.products.update` | `write` | Bookingmood products update |
| `productServices.delete` | `bookingmood.api.productServices.delete` | `destructive` | Bookingmood productServices delete |
| `productServices.list` | `bookingmood.api.productServices.list` | `read` | Bookingmood productServices list |
| `productServices.update` | `bookingmood.api.productServices.update` | `write` | Bookingmood productServices update |
| `replyToAddresses.delete` | `bookingmood.api.replyToAddresses.delete` | `destructive` | Bookingmood replyToAddresses delete |
| `replyToAddresses.list` | `bookingmood.api.replyToAddresses.list` | `read` | Bookingmood replyToAddresses list |
| `replyToAddresses.update` | `bookingmood.api.replyToAddresses.update` | `write` | Bookingmood replyToAddresses update |
| `reviewProducts.delete` | `bookingmood.api.reviewProducts.delete` | `destructive` | Bookingmood reviewProducts delete |
| `reviewProducts.list` | `bookingmood.api.reviewProducts.list` | `read` | Bookingmood reviewProducts list |
| `reviewProducts.update` | `bookingmood.api.reviewProducts.update` | `write` | Bookingmood reviewProducts update |
| `reviews.delete` | `bookingmood.api.reviews.delete` | `destructive` | Bookingmood reviews delete |
| `reviews.list` | `bookingmood.api.reviews.list` | `read` | Bookingmood reviews list |
| `reviews.update` | `bookingmood.api.reviews.update` | `write` | Bookingmood reviews update |
| `reviewWidgetListings.delete` | `bookingmood.api.reviewWidgetListings.delete` | `destructive` | Bookingmood reviewWidgetListings delete |
| `reviewWidgetListings.list` | `bookingmood.api.reviewWidgetListings.list` | `read` | Bookingmood reviewWidgetListings list |
| `reviewWidgetListings.update` | `bookingmood.api.reviewWidgetListings.update` | `write` | Bookingmood reviewWidgetListings update |
| `reviewWidgets.list` | `bookingmood.api.reviewWidgets.list` | `read` | Bookingmood reviewWidgets list |
| `reviewWidgets.update` | `bookingmood.api.reviewWidgets.update` | `write` | Bookingmood reviewWidgets update |
| `search.availability` | `bookingmood.api.search.availability` | `read` | Bookingmood search availability |
| `seasons.list` | `bookingmood.api.seasons.list` | `read` | Bookingmood seasons list |
| `services.delete` | `bookingmood.api.services.delete` | `destructive` | Bookingmood services delete |
| `services.list` | `bookingmood.api.services.list` | `read` | Bookingmood services list |
| `services.update` | `bookingmood.api.services.update` | `write` | Bookingmood services update |
| `siteListings.list` | `bookingmood.api.siteListings.list` | `read` | Bookingmood siteListings list |
| `siteListings.update` | `bookingmood.api.siteListings.update` | `write` | Bookingmood siteListings update |
| `sitePages.create` | `bookingmood.api.sitePages.create` | `write` | Bookingmood sitePages create |
| `sitePages.delete` | `bookingmood.api.sitePages.delete` | `destructive` | Bookingmood sitePages delete |
| `sitePages.list` | `bookingmood.api.sitePages.list` | `read` | Bookingmood sitePages list |
| `sitePages.update` | `bookingmood.api.sitePages.update` | `write` | Bookingmood sitePages update |
| `sites.list` | `bookingmood.api.sites.list` | `read` | Bookingmood sites list |
| `sites.update` | `bookingmood.api.sites.update` | `write` | Bookingmood sites update |
| `siteViews.list` | `bookingmood.api.siteViews.list` | `read` | Bookingmood siteViews list |
| `taxes.delete` | `bookingmood.api.taxes.delete` | `destructive` | Bookingmood taxes delete |
| `taxes.list` | `bookingmood.api.taxes.list` | `read` | Bookingmood taxes list |
| `taxes.update` | `bookingmood.api.taxes.update` | `write` | Bookingmood taxes update |
| `userProfiles.list` | `bookingmood.api.userProfiles.list` | `read` | Bookingmood userProfiles list |
| `userProfiles.update` | `bookingmood.api.userProfiles.update` | `write` | Bookingmood userProfiles update |
| `webhookNotifications.list` | `bookingmood.api.webhookNotifications.list` | `read` | Bookingmood webhookNotifications list |
| `webhooks.delete` | `bookingmood.api.webhooks.delete` | `destructive` | Bookingmood webhooks delete |
| `webhooks.list` | `bookingmood.api.webhooks.list` | `read` | Bookingmood webhooks list |
| `webhooks.update` | `bookingmood.api.webhooks.update` | `write` | Bookingmood webhooks update |
| `widgetAnalytics.list` | `bookingmood.api.widgetAnalytics.list` | `read` | Bookingmood widgetAnalytics list |
| `widgetListings.delete` | `bookingmood.api.widgetListings.delete` | `destructive` | Bookingmood widgetListings delete |
| `widgetListings.list` | `bookingmood.api.widgetListings.list` | `read` | Bookingmood widgetListings list |
| `widgetListings.update` | `bookingmood.api.widgetListings.update` | `write` | Bookingmood widgetListings update |
| `widgets.create` | `bookingmood.api.widgets.create` | `write` | Bookingmood widgets create |
| `widgets.delete` | `bookingmood.api.widgets.delete` | `destructive` | Bookingmood widgets delete |
| `widgets.list` | `bookingmood.api.widgets.list` | `read` | Bookingmood widgets list |
| `widgets.update` | `bookingmood.api.widgets.update` | `write` | Bookingmood widgets update |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bookingmood

## License

Apache-2.0
