# @corsair-dev/benchmarkemail

BenchmarkEmail plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/benchmarkemail
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.addRemoveInboxTestsFromSubAccount` | `benchmarkemail.api.account.addRemoveInboxTestsFromSubAccount` | `write` | Add or remove inbox tests from a sub-account |
| `account.changePassword` | `benchmarkemail.api.account.changePassword` | `write` | Change the password for the client account |
| `account.changeSecurityPIN` | `benchmarkemail.api.account.changeSecurityPIN` | `write` | Change the security PIN for the client account |
| `account.checkIfResponsive` | `benchmarkemail.api.account.checkIfResponsive` | `read` | Check whether the client is responsive |
| `account.copyImageToSubAccount` | `benchmarkemail.api.account.copyImageToSubAccount` | `write` | Copy an image to sub-accounts |
| `account.deleteLinkedAgencyAccount` | `benchmarkemail.api.account.deleteLinkedAgencyAccount` | `destructive` | Delete a linked agency account |
| `account.disableSecurityPIN` | `benchmarkemail.api.account.disableSecurityPIN` | `write` | Disable the security PIN for the client account |
| `account.generateSupportTicket` | `benchmarkemail.api.account.generateSupportTicket` | `write` | Generate a support ticket |
| `account.getAccountSummary` | `benchmarkemail.api.account.getAccountSummary` | `read` | Get the account summary including image storage |
| `account.getAllConfirmedEmails` | `benchmarkemail.api.account.getAllConfirmedEmails` | `read` | Retrieve all confirmed email addresses |
| `account.getClientAccountSettings` | `benchmarkemail.api.account.getClientAccountSettings` | `read` | Get client account settings |
| `account.getClientDetails` | `benchmarkemail.api.account.getClientDetails` | `read` | Get client details |
| `account.getClientFilterDomain` | `benchmarkemail.api.account.getClientFilterDomain` | `read` | Get client filter domains |
| `account.getClientPlanInformation` | `benchmarkemail.api.account.getClientPlanInformation` | `read` | Get client plan information |
| `account.getClientProfileDetails` | `benchmarkemail.api.account.getClientProfileDetails` | `read` | Get client profile details |
| `account.getClientsRatingRange` | `benchmarkemail.api.account.getClientsRatingRange` | `read` | Get the clients rating range |
| `account.getCommissionList` | `benchmarkemail.api.account.getCommissionList` | `read` | Get the partner commission list |
| `account.getCommunityDomain` | `benchmarkemail.api.account.getCommunityDomain` | `read` | Get the community domain name for the client |
| `account.getCurrentEmailAtTimeOfReset` | `benchmarkemail.api.account.getCurrentEmailAtTimeOfReset` | `read` | Get the current email at the time of a reset |
| `account.getDMARCList` | `benchmarkemail.api.account.getDMARCList` | `read` | Retrieve the DMARC list for the client account |
| `account.getHelpTopics` | `benchmarkemail.api.account.getHelpTopics` | `read` | Retrieve the list of help topics |
| `account.getLinkedAgencyAccountDetails` | `benchmarkemail.api.account.getLinkedAgencyAccountDetails` | `read` | Get the details of a linked agency account |
| `account.getLinkedAgencyAccounts` | `benchmarkemail.api.account.getLinkedAgencyAccounts` | `read` | Get the list of linked agency accounts |
| `account.getListOfConfirmedEmails` | `benchmarkemail.api.account.getListOfConfirmedEmails` | `read` | Retrieve the list of confirmed email addresses |
| `account.getNotification` | `benchmarkemail.api.account.getNotification` | `read` | Get client notifications |
| `account.getPartnerProfileDetails` | `benchmarkemail.api.account.getPartnerProfileDetails` | `read` | Get partner profile details |
| `account.getReferralsLevel1List` | `benchmarkemail.api.account.getReferralsLevel1List` | `read` | Get the level 1 referrals list |
| `account.getReferralsList` | `benchmarkemail.api.account.getReferralsList` | `read` | Retrieve the list of partner referrals |
| `account.getSubAccountBalance` | `benchmarkemail.api.account.getSubAccountBalance` | `read` | Get a sub-account balance |
| `account.getSubAccountDetails` | `benchmarkemail.api.account.getSubAccountDetails` | `read` | Get sub-account details |
| `account.getSubAccountHistory` | `benchmarkemail.api.account.getSubAccountHistory` | `read` | Get sub-account history |
| `account.getSubAccountHistoryDetails` | `benchmarkemail.api.account.getSubAccountHistoryDetails` | `read` | Get sub-account history details |
| `account.getSubAccounts` | `benchmarkemail.api.account.getSubAccounts` | `read` | Retrieve all sub-accounts |
| `account.getSubAccountsPlanList` | `benchmarkemail.api.account.getSubAccountsPlanList` | `read` | Retrieve available plans for a sub-account |
| `account.getWebPageAdsDetail` | `benchmarkemail.api.account.getWebPageAdsDetail` | `read` | Get web page ads details |
| `account.linkAgencyAccount` | `benchmarkemail.api.account.linkAgencyAccount` | `write` | Link an agency account |
| `account.loginRedirectUsingToken` | `benchmarkemail.api.account.loginRedirectUsingToken` | `write` | Generate a login redirect token |
| `account.patchUpdateClientSettings` | `benchmarkemail.api.account.patchUpdateClientSettings` | `write` | Update client account settings |
| `account.resendConfirmEmail` | `benchmarkemail.api.account.resendConfirmEmail` | `read` | Resend a confirm email |
| `account.saveSecurityPIN` | `benchmarkemail.api.account.saveSecurityPIN` | `write` | Save the security PIN |
| `account.saveWebsiteDomain` | `benchmarkemail.api.account.saveWebsiteDomain` | `write` | Save the website domain |
| `account.sendPINViaEmail` | `benchmarkemail.api.account.sendPINViaEmail` | `write` | Send the security PIN via email |
| `account.sendResetEmail` | `benchmarkemail.api.account.sendResetEmail` | `write` | Send a reset email |
| `account.sendSupportFeedback` | `benchmarkemail.api.account.sendSupportFeedback` | `write` | Send support feedback |
| `account.setResponsive` | `benchmarkemail.api.account.setResponsive` | `write` | Set the responsive flag |
| `account.shareListsWithSubAccounts` | `benchmarkemail.api.account.shareListsWithSubAccounts` | `write` | Share contact lists with sub-accounts |
| `account.updateEditProfile` | `benchmarkemail.api.account.updateEditProfile` | `write` | Update the client profile |
| `account.updateLinkedAgencyAccount` | `benchmarkemail.api.account.updateLinkedAgencyAccount` | `write` | Update a linked agency account |
| `account.updatePartnerProfile` | `benchmarkemail.api.account.updatePartnerProfile` | `write` | Update the partner profile |
| `account.updateResetEmail` | `benchmarkemail.api.account.updateResetEmail` | `write` | Update or reset the account email |
| `archive.addEmailToArchive` | `benchmarkemail.api.archive.addEmailToArchive` | `write` | Add an email campaign to the archive page |
| `archive.deleteEmailFromArchive` | `benchmarkemail.api.archive.deleteEmailFromArchive` | `destructive` | Delete an email from the archive |
| `archive.getArchiveDomainName` | `benchmarkemail.api.archive.getArchiveDomainName` | `read` | Get the archive domain name for the client |
| `archive.getArchiveEmailDetails` | `benchmarkemail.api.archive.getArchiveEmailDetails` | `read` | Get the details of an archived email |
| `archive.getArchiveEmails` | `benchmarkemail.api.archive.getArchiveEmails` | `read` | Retrieve a list of emails from the archive |
| `archive.getArchiveHomeData` | `benchmarkemail.api.archive.getArchiveHomeData` | `read` | Get archive home data for a domain and type |
| `archive.getArchiveHomePage` | `benchmarkemail.api.archive.getArchiveHomePage` | `read` | Get the archive home page |
| `archive.getArchivePages` | `benchmarkemail.api.archive.getArchivePages` | `read` | Retrieve the list of archive pages |
| `archive.getDetailsAboutArchivePage` | `benchmarkemail.api.archive.getDetailsAboutArchivePage` | `read` | Get details about the archive page |
| `archive.getHTMLForArchiveNewsletter` | `benchmarkemail.api.archive.getHTMLForArchiveNewsletter` | `write` | Get HTML content for an archive newsletter |
| `archive.getHTMLForButton` | `benchmarkemail.api.archive.getHTMLForButton` | `read` | Get HTML content for an archive button |
| `archive.getImageForButton` | `benchmarkemail.api.archive.getImageForButton` | `read` | Get the image archive button HTML |
| `archive.updateArchiveHomePage` | `benchmarkemail.api.archive.updateArchiveHomePage` | `write` | Update the archive home page |
| `archive.updateArchiveHomePageData` | `benchmarkemail.api.archive.updateArchiveHomePageData` | `write` | Update archive home page data |
| `automations.addEmailInAutomation` | `benchmarkemail.api.automations.addEmailInAutomation` | `write` | Add an email to an automation workflow |
| `automations.copyEmailInAutomation` | `benchmarkemail.api.automations.copyEmailInAutomation` | `write` | Create a copy of an automation email |
| `automations.createAutomationCopy` | `benchmarkemail.api.automations.createAutomationCopy` | `write` | Create a copy of an existing automation |
| `automations.deleteAutomation` | `benchmarkemail.api.automations.deleteAutomation` | `destructive` | Delete an automation |
| `automations.deleteAutomationEmail` | `benchmarkemail.api.automations.deleteAutomationEmail` | `destructive` | Delete an automation email from a workflow |
| `automations.getAutomationDetails` | `benchmarkemail.api.automations.getAutomationDetails` | `read` | Get the details of an automation |
| `automations.getAutomationEmailDetails` | `benchmarkemail.api.automations.getAutomationEmailDetails` | `read` | Get details for an automation email |
| `automations.getAutomationSummaryReport` | `benchmarkemail.api.automations.getAutomationSummaryReport` | `read` | Get the summary report of an automation |
| `automations.updateEmailContentForAutomation` | `benchmarkemail.api.automations.updateEmailContentForAutomation` | `write` | Update email content for an automation |
| `contacts.addContactToList` | `benchmarkemail.api.contacts.addContactToList` | `write` | Add a new contact to a specific contact list |
| `contacts.cleanContactList` | `benchmarkemail.api.contacts.cleanContactList` | `write` | Clean a contact list by removing invalid or bounced addresses |
| `contacts.compareContacts` | `benchmarkemail.api.contacts.compareContacts` | `read` | Compare contacts across multiple contact lists |
| `contacts.copyBulkContacts` | `benchmarkemail.api.contacts.copyBulkContacts` | `write` | Copy multiple contacts in bulk to target lists |
| `contacts.copyContact` | `benchmarkemail.api.contacts.copyContact` | `write` | Copy a contact to a specific list |
| `contacts.createSegmentCriteria` | `benchmarkemail.api.contacts.createSegmentCriteria` | `write` | Create criteria for a contact segment |
| `contacts.createSegmentFromContactIDs` | `benchmarkemail.api.contacts.createSegmentFromContactIDs` | `write` | Create a segment from a list of contact IDs |
| `contacts.deleteContactFromAllListsByID` | `benchmarkemail.api.contacts.deleteContactFromAllListsByID` | `destructive` | Delete a specific contact from all lists |
| `contacts.deleteContactFromList` | `benchmarkemail.api.contacts.deleteContactFromList` | `destructive` | Delete a contact from a specific list |
| `contacts.deleteContactFromSearch` | `benchmarkemail.api.contacts.deleteContactFromSearch` | `destructive` | Delete a contact from the search contact page |
| `contacts.deleteContactsFromAllLists` | `benchmarkemail.api.contacts.deleteContactsFromAllLists` | `destructive` | Delete selected contacts from all lists |
| `contacts.deleteContactsFromCurrentLists` | `benchmarkemail.api.contacts.deleteContactsFromCurrentLists` | `destructive` | Delete selected contacts from current lists |
| `contacts.deleteSegment` | `benchmarkemail.api.contacts.deleteSegment` | `destructive` | Delete a contact segment |
| `contacts.deleteSegmentCriteria` | `benchmarkemail.api.contacts.deleteSegmentCriteria` | `destructive` | Delete criteria from a segment |
| `contacts.deleteTrashList` | `benchmarkemail.api.contacts.deleteTrashList` | `destructive` | Delete all trash contacts from a list |
| `contacts.getActiveContactCount` | `benchmarkemail.api.contacts.getActiveContactCount` | `read` | Get the total count of all active contacts |
| `contacts.getCleanCount` | `benchmarkemail.api.contacts.getCleanCount` | `read` | Get the clean count for a contact list |
| `contacts.getContactAuditHistory` | `benchmarkemail.api.contacts.getContactAuditHistory` | `read` | Retrieve audit history for contacts in a list |
| `contacts.getContactAuditHistoryDetail` | `benchmarkemail.api.contacts.getContactAuditHistoryDetail` | `read` | Get detailed audit history for a batch and group of contact changes |
| `contacts.getContactDetails` | `benchmarkemail.api.contacts.getContactDetails` | `read` | Retrieve detailed information for a specific contact |
| `contacts.getContactImportStatus` | `benchmarkemail.api.contacts.getContactImportStatus` | `read` | Get the status of contact import operations |
| `contacts.getContactMergeList` | `benchmarkemail.api.contacts.getContactMergeList` | `read` | Retrieve contact lists that can be merged with a list |
| `contacts.getContactsCount` | `benchmarkemail.api.contacts.getContactsCount` | `read` | Get the count of contacts in specified lists and segments |
| `contacts.getDownloadSegmentData` | `benchmarkemail.api.contacts.getDownloadSegmentData` | `read` | Download segment data |
| `contacts.getFilteredContacts` | `benchmarkemail.api.contacts.getFilteredContacts` | `read` | Fetch filtered and paginated contacts from a list |
| `contacts.getFilteredContactsWithExtraFields` | `benchmarkemail.api.contacts.getFilteredContactsWithExtraFields` | `read` | Fetch filtered contacts with custom and extra fields |
| `contacts.getNonContactCount` | `benchmarkemail.api.contacts.getNonContactCount` | `read` | Get the count of non-contacts for campaigns |
| `contacts.getSegmentAutoGenerateName` | `benchmarkemail.api.contacts.getSegmentAutoGenerateName` | `read` | Get an auto-generated segment name for a list |
| `contacts.getSegmentByID` | `benchmarkemail.api.contacts.getSegmentByID` | `read` | Retrieve a contact segment by ID |
| `contacts.getSegmentDetails` | `benchmarkemail.api.contacts.getSegmentDetails` | `read` | Retrieve contact details from a segment |
| `contacts.getSegmentList` | `benchmarkemail.api.contacts.getSegmentList` | `read` | Retrieve segment lists for a contact list |
| `contacts.getSegments` | `benchmarkemail.api.contacts.getSegments` | `read` | Retrieve a paginated list of contact segments |
| `contacts.getTrashCount` | `benchmarkemail.api.contacts.getTrashCount` | `read` | Get the count of contacts in the trash |
| `contacts.getUniqueContactCount` | `benchmarkemail.api.contacts.getUniqueContactCount` | `read` | Get the unique contact count |
| `contacts.mergeContactsIntoExistingList` | `benchmarkemail.api.contacts.mergeContactsIntoExistingList` | `write` | Merge contacts into an existing list |
| `contacts.mergeContactsIntoNewList` | `benchmarkemail.api.contacts.mergeContactsIntoNewList` | `write` | Merge contacts into a new list |
| `contacts.moveBulkContacts` | `benchmarkemail.api.contacts.moveBulkContacts` | `write` | Move multiple contacts in bulk |
| `contacts.moveContacts` | `benchmarkemail.api.contacts.moveContacts` | `write` | Move contacts to a target list |
| `contacts.moveContactToDoNotContactList` | `benchmarkemail.api.contacts.moveContactToDoNotContactList` | `destructive` | Move a contact to the do-not-contact list |
| `contacts.resendEmails` | `benchmarkemail.api.contacts.resendEmails` | `write` | Resend emails to contacts in a list |
| `contacts.saveEmailAddress` | `benchmarkemail.api.contacts.saveEmailAddress` | `write` | Save an email address to a contact list |
| `contacts.saveVerifiedEmailAddresses` | `benchmarkemail.api.contacts.saveVerifiedEmailAddresses` | `write` | Save verified email addresses to a contact list |
| `contacts.searchContactDetailsByEmail` | `benchmarkemail.api.contacts.searchContactDetailsByEmail` | `read` | Search contact details by email |
| `contacts.sendConfirmEmailVerification` | `benchmarkemail.api.contacts.sendConfirmEmailVerification` | `write` | Send a confirm-email verification message |
| `contacts.updateContactDetails` | `benchmarkemail.api.contacts.updateContactDetails` | `write` | Update the details of a contact |
| `contacts.updateSegment` | `benchmarkemail.api.contacts.updateSegment` | `write` | Update a contact segment |
| `emails.addEmailToCommunity` | `benchmarkemail.api.emails.addEmailToCommunity` | `write` | Add an email campaign to the public community |
| `emails.addOrUpdateScheme` | `benchmarkemail.api.emails.addOrUpdateScheme` | `write` | Add or update a color scheme |
| `emails.copyExistingEmail` | `benchmarkemail.api.emails.copyExistingEmail` | `write` | Copy an existing email campaign |
| `emails.deleteABSplitCampaign` | `benchmarkemail.api.emails.deleteABSplitCampaign` | `destructive` | Delete an ABSplit campaign configuration from an email |
| `emails.deleteABTestEmail` | `benchmarkemail.api.emails.deleteABTestEmail` | `destructive` | Move an AB test email to trash |
| `emails.deleteEmailCampaign` | `benchmarkemail.api.emails.deleteEmailCampaign` | `destructive` | Delete an email campaign |
| `emails.getABSplitDetails` | `benchmarkemail.api.emails.getABSplitDetails` | `read` | Get AB split test details for an email campaign |
| `emails.getABSplitResults` | `benchmarkemail.api.emails.getABSplitResults` | `read` | Get the results of an AB split test |
| `emails.getABTests` | `benchmarkemail.api.emails.getABTests` | `read` | Retrieve a list of AB tests |
| `emails.getBadgesList` | `benchmarkemail.api.emails.getBadgesList` | `read` | Retrieve all available email badges |
| `emails.getCommunityCategory` | `benchmarkemail.api.emails.getCommunityCategory` | `read` | List available community categories |
| `emails.getCommunityEmailByID` | `benchmarkemail.api.emails.getCommunityEmailByID` | `read` | Get a community email by ID |
| `emails.getEmailDetails` | `benchmarkemail.api.emails.getEmailDetails` | `read` | Get the details of an email campaign |
| `emails.getEmailPreview` | `benchmarkemail.api.emails.getEmailPreview` | `read` | Get the preview of an email campaign |
| `emails.getEmailRecipientCount` | `benchmarkemail.api.emails.getEmailRecipientCount` | `read` | Get the recipient count for an email campaign |
| `emails.getEmails` | `benchmarkemail.api.emails.getEmails` | `read` | Retrieve all email campaigns |
| `emails.getEmailSpamCheck` | `benchmarkemail.api.emails.getEmailSpamCheck` | `read` | Check the spam score for an email campaign |
| `emails.getEmailTemplates` | `benchmarkemail.api.emails.getEmailTemplates` | `read` | Retrieve email templates |
| `emails.getLayoutList` | `benchmarkemail.api.emails.getLayoutList` | `read` | Get the email layout list |
| `emails.getRSSHistoryByEmailID` | `benchmarkemail.api.emails.getRSSHistoryByEmailID` | `read` | Get RSS history for an email campaign |
| `emails.getScheme` | `benchmarkemail.api.emails.getScheme` | `read` | Retrieve color schemes for email templates |
| `emails.getTemplateByID` | `benchmarkemail.api.emails.getTemplateByID` | `read` | Get an email template by ID |
| `emails.getTemplateCategoryByID` | `benchmarkemail.api.emails.getTemplateCategoryByID` | `read` | Get a template category by ID |
| `emails.getTemplateCategoryList` | `benchmarkemail.api.emails.getTemplateCategoryList` | `read` | Retrieve the template category list |
| `emails.initiateEmailScreenCapture` | `benchmarkemail.api.emails.initiateEmailScreenCapture` | `write` | Initiate an email screen capture process |
| `emails.permanentlyDeleteEmailFromTrash` | `benchmarkemail.api.emails.permanentlyDeleteEmailFromTrash` | `destructive` | Permanently delete an email from trash |
| `emails.restoreEmailFromTrash` | `benchmarkemail.api.emails.restoreEmailFromTrash` | `write` | Restore an email from trash |
| `emails.scheduleEmailCampaign` | `benchmarkemail.api.emails.scheduleEmailCampaign` | `write` | Schedule an email campaign |
| `emails.shareTemplateToSubAccounts` | `benchmarkemail.api.emails.shareTemplateToSubAccounts` | `write` | Share an email template with sub-accounts |
| `emails.updateEmailCampaign` | `benchmarkemail.api.emails.updateEmailCampaign` | `write` | Update an email campaign |
| `integrations.assignProductToList` | `benchmarkemail.api.integrations.assignProductToList` | `write` | Assign a Shopify product to a list |
| `integrations.configureShopifyPurchaseList` | `benchmarkemail.api.integrations.configureShopifyPurchaseList` | `write` | Configure the Shopify purchase list |
| `integrations.connectService` | `benchmarkemail.api.integrations.connectService` | `write` | Connect a third-party service via OAuth URL |
| `integrations.deleteProductAssociation` | `benchmarkemail.api.integrations.deleteProductAssociation` | `destructive` | Delete a Shopify product association |
| `integrations.disconnectEbayIntegration` | `benchmarkemail.api.integrations.disconnectEbayIntegration` | `destructive` | Disconnect the eBay integration |
| `integrations.disconnectEtsyIntegration` | `benchmarkemail.api.integrations.disconnectEtsyIntegration` | `destructive` | Disconnect the Etsy integration |
| `integrations.disconnectEventbriteIntegration` | `benchmarkemail.api.integrations.disconnectEventbriteIntegration` | `destructive` | Disconnect the Eventbrite integration |
| `integrations.disconnectFacebookEvents` | `benchmarkemail.api.integrations.disconnectFacebookEvents` | `destructive` | Disconnect the Facebook Events integration |
| `integrations.disconnectFacebookIntegration` | `benchmarkemail.api.integrations.disconnectFacebookIntegration` | `destructive` | Disconnect the Facebook integration |
| `integrations.disconnectInstagramIntegration` | `benchmarkemail.api.integrations.disconnectInstagramIntegration` | `destructive` | Disconnect the Instagram integration |
| `integrations.disconnectLinkedInIntegration` | `benchmarkemail.api.integrations.disconnectLinkedInIntegration` | `destructive` | Disconnect the LinkedIn integration |
| `integrations.disconnectPinterestConnection` | `benchmarkemail.api.integrations.disconnectPinterestConnection` | `destructive` | Disconnect the Pinterest integration |
| `integrations.disconnectSalesforceIntegration` | `benchmarkemail.api.integrations.disconnectSalesforceIntegration` | `destructive` | Disconnect the Salesforce integration |
| `integrations.disconnectShopify` | `benchmarkemail.api.integrations.disconnectShopify` | `destructive` | Disconnect the Shopify integration |
| `integrations.disconnectTwitterIntegration` | `benchmarkemail.api.integrations.disconnectTwitterIntegration` | `destructive` | Disconnect the Twitter integration |
| `integrations.getContactListsForShopify` | `benchmarkemail.api.integrations.getContactListsForShopify` | `read` | Get Shopify integration contact lists |
| `integrations.getDigiohUsername` | `benchmarkemail.api.integrations.getDigiohUsername` | `read` | Get the Digioh username |
| `integrations.getEbaySellerID` | `benchmarkemail.api.integrations.getEbaySellerID` | `read` | Get the eBay seller ID |
| `integrations.getEbaySiteList` | `benchmarkemail.api.integrations.getEbaySiteList` | `read` | Get the eBay site list |
| `integrations.getEtsyStoreName` | `benchmarkemail.api.integrations.getEtsyStoreName` | `read` | Get the connected Etsy store name |
| `integrations.getEventbriteUsername` | `benchmarkemail.api.integrations.getEventbriteUsername` | `read` | Get the Eventbrite username |
| `integrations.getFacebookAccountHolder` | `benchmarkemail.api.integrations.getFacebookAccountHolder` | `read` | Get the Facebook account holder |
| `integrations.getFacebookAccountName` | `benchmarkemail.api.integrations.getFacebookAccountName` | `read` | Get the Facebook account name |
| `integrations.getIntegrationAuthURL` | `benchmarkemail.api.integrations.getIntegrationAuthURL` | `read` | Get the OAuth authorization URL for a service |
| `integrations.getIntegrationConnectionList` | `benchmarkemail.api.integrations.getIntegrationConnectionList` | `read` | Get the editor integration connection list |
| `integrations.getLinkedInToken` | `benchmarkemail.api.integrations.getLinkedInToken` | `read` | Get LinkedIn integration token information |
| `integrations.getPaypalLink` | `benchmarkemail.api.integrations.getPaypalLink` | `read` | Get the PayPal integration link for a list |
| `integrations.getPaypalLists` | `benchmarkemail.api.integrations.getPaypalLists` | `read` | Get contact lists formatted for PayPal |
| `integrations.getPinterestUsername` | `benchmarkemail.api.integrations.getPinterestUsername` | `read` | Get the Pinterest username |
| `integrations.getSalesforceStatus` | `benchmarkemail.api.integrations.getSalesforceStatus` | `read` | Get the Salesforce integration status |
| `integrations.getShopifyProductGrid` | `benchmarkemail.api.integrations.getShopifyProductGrid` | `read` | Get the Shopify product list in tabular format |
| `integrations.getShopifyProducts` | `benchmarkemail.api.integrations.getShopifyProducts` | `read` | Get the list of Shopify products |
| `integrations.getTwitterLogin` | `benchmarkemail.api.integrations.getTwitterLogin` | `read` | Get the Twitter login status |
| `integrations.getUnbounceLink` | `benchmarkemail.api.integrations.getUnbounceLink` | `read` | Get the Unbounce integration URL for a list |
| `integrations.getUnbounceLists` | `benchmarkemail.api.integrations.getUnbounceLists` | `read` | Get Unbounce contact lists |
| `integrations.logOutTwitterTweets` | `benchmarkemail.api.integrations.logOutTwitterTweets` | `destructive` | Log out of Twitter Tweets |
| `integrations.testEbayIntegration` | `benchmarkemail.api.integrations.testEbayIntegration` | `read` | Test the eBay integration |
| `integrations.testEtsyIntegration` | `benchmarkemail.api.integrations.testEtsyIntegration` | `read` | Test the Etsy integration |
| `integrations.testEventbriteIntegration` | `benchmarkemail.api.integrations.testEventbriteIntegration` | `read` | Test the Eventbrite integration |
| `integrations.testFacebookEventsIntegration` | `benchmarkemail.api.integrations.testFacebookEventsIntegration` | `read` | Test the Facebook Events integration |
| `integrations.testFacebookIntegration` | `benchmarkemail.api.integrations.testFacebookIntegration` | `read` | Test the Facebook integration |
| `integrations.testLinkedInConnection` | `benchmarkemail.api.integrations.testLinkedInConnection` | `read` | Test the LinkedIn connection |
| `integrations.testPinterestIntegration` | `benchmarkemail.api.integrations.testPinterestIntegration` | `read` | Test the Pinterest integration |
| `integrations.testSalesforceIntegration` | `benchmarkemail.api.integrations.testSalesforceIntegration` | `read` | Test the Salesforce integration |
| `integrations.testTwitterIntegration` | `benchmarkemail.api.integrations.testTwitterIntegration` | `read` | Test the Twitter integration |
| `integrations.testTwitterTweets` | `benchmarkemail.api.integrations.testTwitterTweets` | `read` | Test Twitter Tweets |
| `lists.createContactList` | `benchmarkemail.api.lists.createContactList` | `write` | Create a new contact list |
| `lists.deleteContactList` | `benchmarkemail.api.lists.deleteContactList` | `destructive` | Delete a contact list |
| `lists.deleteList` | `benchmarkemail.api.lists.deleteList` | `destructive` | Delete one or more contact lists |
| `lists.getContactListDeepView` | `benchmarkemail.api.lists.getContactListDeepView` | `read` | Fetch a deep view of contact lists |
| `lists.getContactListDetails` | `benchmarkemail.api.lists.getContactListDetails` | `read` | Fetch detailed information for a contact list |
| `lists.getContactListFieldNames` | `benchmarkemail.api.lists.getContactListFieldNames` | `read` | Retrieve field names and attributes for a contact list |
| `lists.getContactLists` | `benchmarkemail.api.lists.getContactLists` | `read` | Retrieve all contact lists |
| `lists.getContactListSummary` | `benchmarkemail.api.lists.getContactListSummary` | `read` | Get the summary of a contact list |
| `lists.getDeleteListCheck` | `benchmarkemail.api.lists.getDeleteListCheck` | `read` | Check whether contact lists can be deleted |
| `lists.getListUploadTerms` | `benchmarkemail.api.lists.getListUploadTerms` | `read` | Get the terms for contact list uploads |
| `lists.restoreTrashList` | `benchmarkemail.api.lists.restoreTrashList` | `write` | Restore a trash list |
| `lists.updateContactList` | `benchmarkemail.api.lists.updateContactList` | `write` | Update a contact list |
| `media.createInbox` | `benchmarkemail.api.media.createInbox` | `write` | Create a new inbox for email testing |
| `media.deleteImage` | `benchmarkemail.api.media.deleteImage` | `destructive` | Delete an image |
| `media.deleteInbox` | `benchmarkemail.api.media.deleteInbox` | `destructive` | Delete an inbox |
| `media.deleteVideo` | `benchmarkemail.api.media.deleteVideo` | `destructive` | Delete a video |
| `media.getGiphyImages` | `benchmarkemail.api.media.getGiphyImages` | `read` | Get the list of Giphy images |
| `media.getImageDetails` | `benchmarkemail.api.media.getImageDetails` | `read` | Get the details of an image |
| `media.getImages` | `benchmarkemail.api.media.getImages` | `read` | Retrieve a list of images |
| `media.getInboxDetailResult` | `benchmarkemail.api.media.getInboxDetailResult` | `read` | Get inbox detail test statistics |
| `media.getInboxList` | `benchmarkemail.api.media.getInboxList` | `read` | Retrieve the inbox list |
| `media.getInboxMasterResult` | `benchmarkemail.api.media.getInboxMasterResult` | `read` | Get an inbox master result |
| `media.getVideoDetails` | `benchmarkemail.api.media.getVideoDetails` | `read` | Get the details of a video |
| `media.shareVideo` | `benchmarkemail.api.media.shareVideo` | `write` | Share a video |
| `media.uploadVideo` | `benchmarkemail.api.media.uploadVideo` | `write` | Upload a video |
| `polls.copyPoll` | `benchmarkemail.api.polls.copyPoll` | `write` | Copy an existing poll |
| `polls.createPoll` | `benchmarkemail.api.polls.createPoll` | `write` | Create a new poll |
| `polls.deletePoll` | `benchmarkemail.api.polls.deletePoll` | `destructive` | Delete a poll |
| `polls.getPollDetails` | `benchmarkemail.api.polls.getPollDetails` | `read` | Retrieve the details of a poll |
| `polls.getPollPreview` | `benchmarkemail.api.polls.getPollPreview` | `read` | Get a preview of a poll |
| `polls.getPollResponseReport` | `benchmarkemail.api.polls.getPollResponseReport` | `read` | Retrieve the response report of a poll |
| `polls.getPolls` | `benchmarkemail.api.polls.getPolls` | `read` | Retrieve a list of polls |
| `polls.updatePoll` | `benchmarkemail.api.polls.updatePoll` | `write` | Update a poll |
| `reports.downloadContactReport` | `benchmarkemail.api.reports.downloadContactReport` | `read` | Download the contact list report |
| `reports.getABTestReport` | `benchmarkemail.api.reports.getABTestReport` | `read` | Retrieve AB split test reports |
| `reports.getAbuseCampaignReportByEmailID` | `benchmarkemail.api.reports.getAbuseCampaignReportByEmailID` | `read` | Get the abuse campaign report for an email |
| `reports.getAbuseReport` | `benchmarkemail.api.reports.getAbuseReport` | `read` | Get the abuse report with complaint statistics |
| `reports.getBouncesReportByEmailID` | `benchmarkemail.api.reports.getBouncesReportByEmailID` | `read` | Get the bounces report for an email campaign |
| `reports.getCampaignEngagementList` | `benchmarkemail.api.reports.getCampaignEngagementList` | `read` | Retrieve campaign engagement statistics |
| `reports.getCampaignHistoryByEmailID` | `benchmarkemail.api.reports.getCampaignHistoryByEmailID` | `read` | Get campaign history for an email |
| `reports.getClickContactCount` | `benchmarkemail.api.reports.getClickContactCount` | `read` | Get the click contact count for campaigns |
| `reports.getClickHeatMapByEmailID` | `benchmarkemail.api.reports.getClickHeatMapByEmailID` | `read` | Get the click heatmap report for an email |
| `reports.getClickPerformanceByEmailID` | `benchmarkemail.api.reports.getClickPerformanceByEmailID` | `read` | Get click performance for an email campaign |
| `reports.getClickPerformanceDetailsByEmail` | `benchmarkemail.api.reports.getClickPerformanceDetailsByEmail` | `read` | Get click performance details for an email campaign |
| `reports.getClicksReportByEmailID` | `benchmarkemail.api.reports.getClicksReportByEmailID` | `read` | Get the clicks report for an email campaign |
| `reports.getClickURLContactCount` | `benchmarkemail.api.reports.getClickURLContactCount` | `read` | Get the click URL contact count of engagement metrics |
| `reports.getContactReportHistory` | `benchmarkemail.api.reports.getContactReportHistory` | `read` | Get engagement history for a contact by email address |
| `reports.getDownloadReport` | `benchmarkemail.api.reports.getDownloadReport` | `write` | Get the download report for a contact list |
| `reports.getEmailOpensByCountryRegion` | `benchmarkemail.api.reports.getEmailOpensByCountryRegion` | `read` | Get email opens by country and region |
| `reports.getEmailReport` | `benchmarkemail.api.reports.getEmailReport` | `read` | Get email campaign reports |
| `reports.getEmailReportForwards` | `benchmarkemail.api.reports.getEmailReportForwards` | `read` | Get the forwards report for an email campaign |
| `reports.getForwardsReportByEmailID` | `benchmarkemail.api.reports.getForwardsReportByEmailID` | `read` | Get the forwards report for an email campaign by ID |
| `reports.getLinkDetailByEmailID` | `benchmarkemail.api.reports.getLinkDetailByEmailID` | `read` | Get the link detail report for an email campaign |
| `reports.getOpenContactCount` | `benchmarkemail.api.reports.getOpenContactCount` | `read` | Get the count of contacts who opened campaigns |
| `reports.getOpensHourlyReportByEmail` | `benchmarkemail.api.reports.getOpensHourlyReportByEmail` | `read` | Get the hourly opens report for an email campaign |
| `reports.getOpensLocationReport` | `benchmarkemail.api.reports.getOpensLocationReport` | `read` | Get the opens location report for a campaign |
| `reports.getOpensLocationReportByEmail` | `benchmarkemail.api.reports.getOpensLocationReportByEmail` | `read` | Get opens for an email from a specific country |
| `reports.getOpensReport` | `benchmarkemail.api.reports.getOpensReport` | `read` | Get the opens report for an email campaign |
| `reports.getReportDetailsByABTest` | `benchmarkemail.api.reports.getReportDetailsByABTest` | `read` | Get report details for an AB split test |
| `reports.getReportDetailsByEmailID` | `benchmarkemail.api.reports.getReportDetailsByEmailID` | `read` | Get the detailed report summary for an email campaign |
| `reports.getReportDownload` | `benchmarkemail.api.reports.getReportDownload` | `read` | Download an email campaign report by type |
| `reports.getReportsForAutoresponders` | `benchmarkemail.api.reports.getReportsForAutoresponders` | `read` | Get reports for autoresponders |
| `reports.getSaveAsList` | `benchmarkemail.api.reports.getSaveAsList` | `read` | Get the save-as-list data |
| `reports.getSocialPerformanceReport` | `benchmarkemail.api.reports.getSocialPerformanceReport` | `read` | Get the social performance report for a campaign |
| `reports.getUnopensReport` | `benchmarkemail.api.reports.getUnopensReport` | `read` | Get the unopens report for an email campaign |
| `reports.getUnopensReportByEmailID` | `benchmarkemail.api.reports.getUnopensReportByEmailID` | `read` | Get unopens for an email campaign by ID |
| `reports.getUnsubscribeReportByEmailID` | `benchmarkemail.api.reports.getUnsubscribeReportByEmailID` | `read` | Get the unsubscribe report for an email campaign |
| `reports.getURLEngagementList` | `benchmarkemail.api.reports.getURLEngagementList` | `read` | Retrieve URL engagement statistics |
| `reports.getURLListByEmailID` | `benchmarkemail.api.reports.getURLListByEmailID` | `read` | Get the URL list for an email campaign |
| `reports.updateListCompilationDetails` | `benchmarkemail.api.reports.updateListCompilationDetails` | `write` | Update list compilation details |
| `signupForms.copySignupForm` | `benchmarkemail.api.signupForms.copySignupForm` | `write` | Copy an existing signup form |
| `signupForms.createSignupForm` | `benchmarkemail.api.signupForms.createSignupForm` | `write` | Create a new signup form |
| `signupForms.getHTMLSignupForm` | `benchmarkemail.api.signupForms.getHTMLSignupForm` | `write` | Get the HTML embed code for a signup form |
| `signupForms.getMagentoHTMLDropdown` | `benchmarkemail.api.signupForms.getMagentoHTMLDropdown` | `read` | Get the Magento signup form dropdown HTML |
| `signupForms.getMagentoHTMLSelected` | `benchmarkemail.api.signupForms.getMagentoHTMLSelected` | `read` | Get Magento HTML for a selected signup form |
| `signupForms.getSignupFormButtonCode` | `benchmarkemail.api.signupForms.getSignupFormButtonCode` | `read` | Get the code for the signup form button |
| `signupForms.getSignupFormContactFields` | `benchmarkemail.api.signupForms.getSignupFormContactFields` | `read` | Get the contact fields of a signup form |
| `signupForms.getSignupFormDetails` | `benchmarkemail.api.signupForms.getSignupFormDetails` | `read` | Get the details of a signup form |
| `signupForms.getSignupFormForMagento` | `benchmarkemail.api.signupForms.getSignupFormForMagento` | `read` | Get signup form data for Magento |
| `signupForms.getSignupFormForUnbounce` | `benchmarkemail.api.signupForms.getSignupFormForUnbounce` | `read` | Get signup form data for Unbounce |
| `signupForms.getSignupFormLink` | `benchmarkemail.api.signupForms.getSignupFormLink` | `read` | Get the public link URL for a signup form |
| `signupForms.getSignupFormList` | `benchmarkemail.api.signupForms.getSignupFormList` | `read` | Retrieve all signup forms |
| `signupForms.getSignupFormsForContactList` | `benchmarkemail.api.signupForms.getSignupFormsForContactList` | `read` | Get signup forms for a contact list |
| `signupForms.getSignupFormTumbler` | `benchmarkemail.api.signupForms.getSignupFormTumbler` | `read` | Get signup form Tumbler parameters |
| `signupForms.getTemplatesForSignupFormClassic` | `benchmarkemail.api.signupForms.getTemplatesForSignupFormClassic` | `read` | Get templates for classic signup forms |
| `signupForms.getTumblerLists` | `benchmarkemail.api.signupForms.getTumblerLists` | `read` | Get Tumbler signup form lists |
| `signupForms.sendTestEmailForSignupForm` | `benchmarkemail.api.signupForms.sendTestEmailForSignupForm` | `write` | Send a test email for a signup form |
| `surveys.deleteSurvey` | `benchmarkemail.api.surveys.deleteSurvey` | `destructive` | Delete a survey |
| `surveys.getSurveyDetails` | `benchmarkemail.api.surveys.getSurveyDetails` | `read` | Retrieve the details of a survey |
| `surveys.getSurveyFullReport` | `benchmarkemail.api.surveys.getSurveyFullReport` | `read` | Retrieve the full report of a survey |
| `surveys.getSurveyIndividualQuestionResult` | `benchmarkemail.api.surveys.getSurveyIndividualQuestionResult` | `read` | Get individual question results for a survey respondent |
| `surveys.getSurveyIndividualResults` | `benchmarkemail.api.surveys.getSurveyIndividualResults` | `read` | Retrieve paginated individual survey results |
| `surveys.getSurveyReportAnswerComment` | `benchmarkemail.api.surveys.getSurveyReportAnswerComment` | `read` | Retrieve comment answers from a survey report |
| `surveys.getSurveyReportAnswerOther` | `benchmarkemail.api.surveys.getSurveyReportAnswerOther` | `read` | Retrieve other answers from a survey report |
| `surveys.getSurveyReportAnswerText` | `benchmarkemail.api.surveys.getSurveyReportAnswerText` | `read` | Retrieve text answers from a survey report |
| `surveys.getSurveyReportDetail` | `benchmarkemail.api.surveys.getSurveyReportDetail` | `read` | Get the report detail of a survey |
| `surveys.getSurveyReportList` | `benchmarkemail.api.surveys.getSurveyReportList` | `read` | Retrieve a paginated list of survey reports |
| `surveys.getSurveyTemplateList` | `benchmarkemail.api.surveys.getSurveyTemplateList` | `read` | Retrieve the list of survey templates |
| `surveys.updateSurveyStatus` | `benchmarkemail.api.surveys.updateSurveyStatus` | `write` | Update the status of a survey |
| `webhooks.createWebhook` | `benchmarkemail.api.webhooks.createWebhook` | `write` | Create a webhook for a contact list |
| `webhooks.deleteWebhook` | `benchmarkemail.api.webhooks.deleteWebhook` | `destructive` | Delete a webhook from a contact list |
| `webhooks.getWebhooks` | `benchmarkemail.api.webhooks.getWebhooks` | `read` | Retrieve all webhooks for a contact list |
| `webhooks.updateWebhook` | `benchmarkemail.api.webhooks.updateWebhook` | `write` | Update a webhook for a contact list |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/benchmarkemail

## License

Apache-2.0
