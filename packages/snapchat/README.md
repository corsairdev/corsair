# @corsair-dev/snapchat

Snapchat plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/snapchat
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actions.addSegmentUsers` | `snapchat.api.actions.addSegmentUsers` | `write` | Add Segment Users |
| `actions.copyMedia` | `snapchat.api.actions.copyMedia` | `write` | Copy Media |
| `actions.createAccountRole` | `snapchat.api.actions.createAccountRole` | `write` | Create Account Role |
| `actions.createAdAccount` | `snapchat.api.actions.createAdAccount` | `write` | Create Ad Account |
| `actions.createAdaccountsAudienceSizeV2` | `snapchat.api.actions.createAdaccountsAudienceSizeV2` | `write` | Create Adaccounts Audience Size V2 |
| `actions.createAdaccountsCreativeElements` | `snapchat.api.actions.createAdaccountsCreativeElements` | `write` | Create Adaccounts Creative Elements |
| `actions.createAdaccountsDynamicTemplates` | `snapchat.api.actions.createAdaccountsDynamicTemplates` | `write` | Create Adaccounts Dynamic Templates |
| `actions.createAdaccountsEventDetails` | `snapchat.api.actions.createAdaccountsEventDetails` | `write` | Create Adaccounts Event Details |
| `actions.createAdaccountsInteractionZones` | `snapchat.api.actions.createAdaccountsInteractionZones` | `write` | Create Adaccounts Interaction Zones |
| `actions.createAdaccountsOfferDisclaimers` | `snapchat.api.actions.createAdaccountsOfferDisclaimers` | `write` | Create Adaccounts Offer Disclaimers |
| `actions.createAdaccountsReservedForecasting` | `snapchat.api.actions.createAdaccountsReservedForecasting` | `write` | Create Adaccounts Reserved Forecasting |
| `actions.createAdaccountsTargetingInsights` | `snapchat.api.actions.createAdaccountsTargetingInsights` | `write` | Create Adaccounts Targeting Insights |
| `actions.createAdSquad` | `snapchat.api.actions.createAdSquad` | `write` | Create Ad Squad |
| `actions.createBillingCenter` | `snapchat.api.actions.createBillingCenter` | `write` | Create Billing Center |
| `actions.createCampaign` | `snapchat.api.actions.createCampaign` | `write` | Create Campaign |
| `actions.createCatalogRole` | `snapchat.api.actions.createCatalogRole` | `write` | Create Catalog Role |
| `actions.createCatalogsFacets` | `snapchat.api.actions.createCatalogsFacets` | `write` | Create Catalogs Facets |
| `actions.createCatalogsFlightsSearch` | `snapchat.api.actions.createCatalogsFlightsSearch` | `write` | Create Catalogs Flights Search |
| `actions.createCatalogsProductFeeds` | `snapchat.api.actions.createCatalogsProductFeeds` | `write` | Create Catalogs Product Feeds |
| `actions.createCatalogsProductSets` | `snapchat.api.actions.createCatalogsProductSets` | `write` | Create Catalogs Product Sets |
| `actions.createMedia` | `snapchat.api.actions.createMedia` | `write` | Create Media |
| `actions.createOrganizationsCatalogs` | `snapchat.api.actions.createOrganizationsCatalogs` | `write` | Create Organizations Catalogs |
| `actions.createOrgRole` | `snapchat.api.actions.createOrgRole` | `write` | Create Org Role |
| `actions.createSegment` | `snapchat.api.actions.createSegment` | `write` | Create Segment |
| `actions.deleteAdaccountsOfferDisclaimers` | `snapchat.api.actions.deleteAdaccountsOfferDisclaimers` | `destructive` | Delete Adaccounts Offer Disclaimers |
| `actions.deleteAdsquads` | `snapchat.api.actions.deleteAdsquads` | `destructive` | Delete Adsquads |
| `actions.deleteAllSegmentUsers` | `snapchat.api.actions.deleteAllSegmentUsers` | `destructive` | Delete All Segment Users |
| `actions.deleteCampaign` | `snapchat.api.actions.deleteCampaign` | `destructive` | Delete Campaign |
| `actions.deleteCatalogs` | `snapchat.api.actions.deleteCatalogs` | `destructive` | Delete Catalogs |
| `actions.deleteEventDetails` | `snapchat.api.actions.deleteEventDetails` | `destructive` | Delete Event Details |
| `actions.deleteMember` | `snapchat.api.actions.deleteMember` | `destructive` | Delete Member |
| `actions.deleteProductFeeds` | `snapchat.api.actions.deleteProductFeeds` | `destructive` | Delete Product Feeds |
| `actions.deleteRole` | `snapchat.api.actions.deleteRole` | `destructive` | Delete Role |
| `actions.deleteSegment` | `snapchat.api.actions.deleteSegment` | `destructive` | Delete Segment |
| `actions.deleteSegmentUsers` | `snapchat.api.actions.deleteSegmentUsers` | `destructive` | Delete Segment Users |
| `actions.getAdAccount` | `snapchat.api.actions.getAdAccount` | `read` | Get Ad Account |
| `actions.getAdaccountsAdsquads` | `snapchat.api.actions.getAdaccountsAdsquads` | `read` | Get Adaccounts Adsquads |
| `actions.getAdaccountsAdSquadUiRenderData` | `snapchat.api.actions.getAdaccountsAdSquadUiRenderData` | `read` | Get Adaccounts Ad Squad Ui Render Data |
| `actions.getAdaccountsDynamicTemplates` | `snapchat.api.actions.getAdaccountsDynamicTemplates` | `read` | Get Adaccounts Dynamic Templates |
| `actions.getAdaccountsEventDetails` | `snapchat.api.actions.getAdaccountsEventDetails` | `read` | Get Adaccounts Event Details |
| `actions.getAdaccountsInteractionZones` | `snapchat.api.actions.getAdaccountsInteractionZones` | `read` | Get Adaccounts Interaction Zones |
| `actions.getAdAccountsLeadGenerationForms` | `snapchat.api.actions.getAdAccountsLeadGenerationForms` | `read` | Get Ad Accounts Lead Generation Forms |
| `actions.getAdaccountsLeadsReport` | `snapchat.api.actions.getAdaccountsLeadsReport` | `read` | Get Adaccounts Leads Report |
| `actions.getAdaccountsMobileApps` | `snapchat.api.actions.getAdaccountsMobileApps` | `read` | Get Adaccounts Mobile Apps |
| `actions.getAdaccountsOfferDisclaimers` | `snapchat.api.actions.getAdaccountsOfferDisclaimers` | `read` | Get Adaccounts Offer Disclaimers |
| `actions.getAdaccountsSpendGuidance` | `snapchat.api.actions.getAdaccountsSpendGuidance` | `read` | Get Adaccounts Spend Guidance |
| `actions.getAdAccountsStats` | `snapchat.api.actions.getAdAccountsStats` | `read` | Get Ad Accounts Stats |
| `actions.getAdaccountsStatsReport` | `snapchat.api.actions.getAdaccountsStatsReport` | `read` | Get Adaccounts Stats Report |
| `actions.getAdSquad` | `snapchat.api.actions.getAdSquad` | `read` | Get Ad Squad |
| `actions.getAdSquadRestrictions` | `snapchat.api.actions.getAdSquadRestrictions` | `read` | Get Ad Squad Restrictions |
| `actions.getAdsquadsAudienceSizeV2` | `snapchat.api.actions.getAdsquadsAudienceSizeV2` | `read` | Get Adsquads Audience Size V2 |
| `actions.getAdsquadsStatsReport` | `snapchat.api.actions.getAdsquadsStatsReport` | `read` | Get Adsquads Stats Report |
| `actions.getAdSquadStats` | `snapchat.api.actions.getAdSquadStats` | `read` | Get Ad Squad Stats |
| `actions.getAdSquadTargeting` | `snapchat.api.actions.getAdSquadTargeting` | `read` | Get Ad Squad Targeting |
| `actions.getAdStats` | `snapchat.api.actions.getAdStats` | `read` | Get Ad Stats |
| `actions.getAuthenticatedUser` | `snapchat.api.actions.getAuthenticatedUser` | `read` | Get Authenticated User |
| `actions.getBillingCenter` | `snapchat.api.actions.getBillingCenter` | `read` | Get Billing Center |
| `actions.getCampaign` | `snapchat.api.actions.getCampaign` | `read` | Get Campaign |
| `actions.getCampaignChangelog` | `snapchat.api.actions.getCampaignChangelog` | `read` | Get Campaign Changelog |
| `actions.getCampaignsByIds` | `snapchat.api.actions.getCampaignsByIds` | `read` | Get Campaigns By Ids |
| `actions.getCampaignStats` | `snapchat.api.actions.getCampaignStats` | `read` | Get Campaign Stats |
| `actions.getCatalogs` | `snapchat.api.actions.getCatalogs` | `read` | Get Catalogs |
| `actions.getCatalogsProductSets` | `snapchat.api.actions.getCatalogsProductSets` | `read` | Get Catalogs Product Sets |
| `actions.getDynamicTemplate` | `snapchat.api.actions.getDynamicTemplate` | `read` | Get Dynamic Template |
| `actions.getDynamicTemplatesExternalChangelogs` | `snapchat.api.actions.getDynamicTemplatesExternalChangelogs` | `read` | Get Dynamic Templates External Changelogs |
| `actions.getEventDetails` | `snapchat.api.actions.getEventDetails` | `read` | Get Event Details |
| `actions.getFundingSource` | `snapchat.api.actions.getFundingSource` | `read` | Get Funding Source |
| `actions.getInteractionZone` | `snapchat.api.actions.getInteractionZone` | `read` | Get Interaction Zone |
| `actions.getInvoice` | `snapchat.api.actions.getInvoice` | `read` | Get Invoice |
| `actions.getMedia` | `snapchat.api.actions.getMedia` | `read` | Get Media |
| `actions.getMediaByIds` | `snapchat.api.actions.getMediaByIds` | `read` | Get Media By Ids |
| `actions.getMediaStats` | `snapchat.api.actions.getMediaStats` | `read` | Get Media Stats |
| `actions.getMember` | `snapchat.api.actions.getMember` | `read` | Get Member |
| `actions.getOrganization` | `snapchat.api.actions.getOrganization` | `read` | Get Organization |
| `actions.getOrganizationsCatalogs` | `snapchat.api.actions.getOrganizationsCatalogs` | `read` | Get Organizations Catalogs |
| `actions.getOrganizationsMobileApps` | `snapchat.api.actions.getOrganizationsMobileApps` | `read` | Get Organizations Mobile Apps |
| `actions.getOrganizationsPublicProfiles` | `snapchat.api.actions.getOrganizationsPublicProfiles` | `read` | Get Organizations Public Profiles |
| `actions.getPixels` | `snapchat.api.actions.getPixels` | `read` | Get Pixels |
| `actions.getProductFeeds` | `snapchat.api.actions.getProductFeeds` | `read` | Get Product Feeds |
| `actions.getProductFeedsFeedUploads` | `snapchat.api.actions.getProductFeedsFeedUploads` | `read` | Get Product Feeds Feed Uploads |
| `actions.getProductSets` | `snapchat.api.actions.getProductSets` | `read` | Get Product Sets |
| `actions.getSegment` | `snapchat.api.actions.getSegment` | `read` | Get Segment |
| `actions.getTargetingCarriers` | `snapchat.api.actions.getTargetingCarriers` | `read` | Get Targeting Carriers |
| `actions.getTargetingConnectionTypes` | `snapchat.api.actions.getTargetingConnectionTypes` | `read` | Get Targeting Connection Types |
| `actions.getTargetingDemographicsAdvancedDemographics` | `snapchat.api.actions.getTargetingDemographicsAdvancedDemographics` | `read` | Get Targeting Demographics Advanced Demographics |
| `actions.getTargetingDemographicsAgeGroup` | `snapchat.api.actions.getTargetingDemographicsAgeGroup` | `read` | Get Targeting Demographics Age Group |
| `actions.getTargetingDemographicsGender` | `snapchat.api.actions.getTargetingDemographicsGender` | `read` | Get Targeting Demographics Gender |
| `actions.getTargetingDemographicsLanguages` | `snapchat.api.actions.getTargetingDemographicsLanguages` | `read` | Get Targeting Demographics Languages |
| `actions.getTargetingDeviceIosOsVersion` | `snapchat.api.actions.getTargetingDeviceIosOsVersion` | `read` | Get Targeting Device Ios Os Version |
| `actions.getTargetingDeviceMarketingNames` | `snapchat.api.actions.getTargetingDeviceMarketingNames` | `read` | Get Targeting Device Marketing Names |
| `actions.getTargetingGeoPostalCode` | `snapchat.api.actions.getTargetingGeoPostalCode` | `read` | Get Targeting Geo Postal Code |
| `actions.getTargetingGeoRegion` | `snapchat.api.actions.getTargetingGeoRegion` | `read` | Get Targeting Geo Region |
| `actions.getTargetingGeoUsPostalCode` | `snapchat.api.actions.getTargetingGeoUsPostalCode` | `read` | Get Targeting Geo Us Postal Code |
| `actions.getTargetingGeoUsRegion` | `snapchat.api.actions.getTargetingGeoUsRegion` | `read` | Get Targeting Geo Us Region |
| `actions.getTargetingInterestsDlxc` | `snapchat.api.actions.getTargetingInterestsDlxc` | `read` | Get Targeting Interests Dlxc |
| `actions.getTargetingInterestsDlxp` | `snapchat.api.actions.getTargetingInterestsDlxp` | `read` | Get Targeting Interests Dlxp |
| `actions.getTargetingInterestsDlxs` | `snapchat.api.actions.getTargetingInterestsDlxs` | `read` | Get Targeting Interests Dlxs |
| `actions.getTargetingInterestsNln` | `snapchat.api.actions.getTargetingInterestsNln` | `read` | Get Targeting Interests Nln |
| `actions.getTargetingInterestsPlc` | `snapchat.api.actions.getTargetingInterestsPlc` | `read` | Get Targeting Interests Plc |
| `actions.getTargetingLocationCategoriesLoi` | `snapchat.api.actions.getTargetingLocationCategoriesLoi` | `read` | Get Targeting Location Categories Loi |
| `actions.getTargetingMetros` | `snapchat.api.actions.getTargetingMetros` | `read` | Get Targeting Metros |
| `actions.getTargetingOsTypes` | `snapchat.api.actions.getTargetingOsTypes` | `read` | Get Targeting Os Types |
| `actions.getTargetingOsVersions` | `snapchat.api.actions.getTargetingOsVersions` | `read` | Get Targeting Os Versions |
| `actions.getTargetingV1InterestsScLs` | `snapchat.api.actions.getTargetingV1InterestsScLs` | `read` | Get Targeting V1 Interests Sc Ls |
| `actions.getTargetingV1InterestsShp` | `snapchat.api.actions.getTargetingV1InterestsShp` | `read` | Get Targeting V1 Interests Shp |
| `actions.getTargetingV1InterestsVac` | `snapchat.api.actions.getTargetingV1InterestsVac` | `read` | Get Targeting V1 Interests Vac |
| `actions.getTargetingV1Options` | `snapchat.api.actions.getTargetingV1Options` | `read` | Get Targeting V1 Options |
| `actions.listAccountRoles` | `snapchat.api.actions.listAccountRoles` | `read` | List Account Roles |
| `actions.listAdAccounts` | `snapchat.api.actions.listAdAccounts` | `read` | List Ad Accounts |
| `actions.listAdsByAccount` | `snapchat.api.actions.listAdsByAccount` | `read` | List Ads By Account |
| `actions.listAdsByAdSquad` | `snapchat.api.actions.listAdsByAdSquad` | `read` | List Ads By Ad Squad |
| `actions.listAdsByCampaign` | `snapchat.api.actions.listAdsByCampaign` | `read` | List Ads By Campaign |
| `actions.listAdSquads` | `snapchat.api.actions.listAdSquads` | `read` | List Ad Squads |
| `actions.listBillingCenters` | `snapchat.api.actions.listBillingCenters` | `read` | List Billing Centers |
| `actions.listCampaigns` | `snapchat.api.actions.listCampaigns` | `read` | List Campaigns |
| `actions.listCatalogRoles` | `snapchat.api.actions.listCatalogRoles` | `read` | List Catalog Roles |
| `actions.listCreatives` | `snapchat.api.actions.listCreatives` | `read` | List Creatives |
| `actions.listFundingSources` | `snapchat.api.actions.listFundingSources` | `read` | List Funding Sources |
| `actions.listInvoices` | `snapchat.api.actions.listInvoices` | `read` | List Invoices |
| `actions.listMedia` | `snapchat.api.actions.listMedia` | `read` | List Media |
| `actions.listMemberRoles` | `snapchat.api.actions.listMemberRoles` | `read` | List Member Roles |
| `actions.listMembers` | `snapchat.api.actions.listMembers` | `read` | List Members |
| `actions.listOrganizations` | `snapchat.api.actions.listOrganizations` | `read` | List Organizations |
| `actions.listOrgPixels` | `snapchat.api.actions.listOrgPixels` | `read` | List Org Pixels |
| `actions.listOrgRoles` | `snapchat.api.actions.listOrgRoles` | `read` | List Org Roles |
| `actions.listPhoneNumbers` | `snapchat.api.actions.listPhoneNumbers` | `read` | List Phone Numbers |
| `actions.listSegments` | `snapchat.api.actions.listSegments` | `read` | List Segments |
| `actions.listSponsoredContent` | `snapchat.api.actions.listSponsoredContent` | `read` | List Sponsored Content |
| `actions.listTransactions` | `snapchat.api.actions.listTransactions` | `read` | List Transactions |
| `actions.searchAdsLibrarySponsoredContent` | `snapchat.api.actions.searchAdsLibrarySponsoredContent` | `read` | Search Ads Library Sponsored Content |
| `actions.searchCatalogProducts` | `snapchat.api.actions.searchCatalogProducts` | `read` | Search Catalog Products |
| `actions.searchCatalogsHotels` | `snapchat.api.actions.searchCatalogsHotels` | `read` | Search Catalogs Hotels |
| `actions.updateAdAccount` | `snapchat.api.actions.updateAdAccount` | `write` | Update Ad Account |
| `actions.updateAdSquad` | `snapchat.api.actions.updateAdSquad` | `write` | Update Ad Squad |
| `actions.updateBillingCenter` | `snapchat.api.actions.updateBillingCenter` | `write` | Update Billing Center |
| `actions.updateCampaign` | `snapchat.api.actions.updateCampaign` | `write` | Update Campaign |
| `actions.updateSegment` | `snapchat.api.actions.updateSegment` | `write` | Update Segment |
| `actions.uploadMediaMultipart` | `snapchat.api.actions.uploadMediaMultipart` | `write` | Upload Media Multipart |
| `actions.validateConversionEvent` | `snapchat.api.actions.validateConversionEvent` | `write` | Validate Conversion Event |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/snapchat

## License

Apache-2.0
