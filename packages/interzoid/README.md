# @corsair-dev/interzoid

Interzoid plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/interzoid
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `intelligence.getBuildingProfile` | `interzoid.api.intelligence.getBuildingProfile` | `read` | Retrieve commercial building intelligence, class, square footage, and tenants |
| `intelligence.getBusinessInfo` | `interzoid.api.intelligence.getBusinessInfo` | `read` | Retrieve comprehensive business intelligence and firmographic profile |
| `intelligence.getBusinessInfoDomain` | `interzoid.api.intelligence.getBusinessInfoDomain` | `read` | Resolve company name, ticker, or brand into primary internet domain |
| `intelligence.getBusinessInfoName` | `interzoid.api.intelligence.getBusinessInfoName` | `read` | Resolve domain or brand name into standard company name |
| `intelligence.getBuyingSignals` | `interzoid.api.intelligence.getBuyingSignals` | `read` | Retrieve real-time B2B purchase intent signals and expansion indicators |
| `intelligence.getCompanyVerification` | `interzoid.api.intelligence.getCompanyVerification` | `read` | Verify the legitimacy, existence, and reputability of a company |
| `intelligence.getCompetitorAnalysis` | `interzoid.api.intelligence.getCompetitorAnalysis` | `read` | Retrieve structured competitive intelligence, advantages, and market dynamics |
| `intelligence.getCustomData` | `interzoid.api.intelligence.getCustomData` | `read` | Query custom AI-powered dataset attributes specified by topic and requested columns |
| `intelligence.getCustomsDutyRates` | `interzoid.api.intelligence.getCustomsDutyRates` | `read` | Retrieve international customs duty rates based on origin, destination, and HS code |
| `intelligence.getEsgProfile` | `interzoid.api.intelligence.getEsgProfile` | `read` | Retrieve ESG, carbon scope emissions, and corporate sustainability intelligence |
| `intelligence.getEuVatRates` | `interzoid.api.intelligence.getEuVatRates` | `read` | Retrieve European VAT tax rates, standard/reduced categories, and thresholds |
| `intelligence.getExecutiveProfile` | `interzoid.api.intelligence.getExecutiveProfile` | `read` | Retrieve executive profile details based on company name and title |
| `intelligence.getFacilitiesProfile` | `interzoid.api.intelligence.getFacilitiesProfile` | `read` | Retrieve corporate facilities and real estate portfolio intelligence |
| `intelligence.getGovContracts` | `interzoid.api.intelligence.getGovContracts` | `read` | Retrieve US federal government contracting intelligence and major awards |
| `intelligence.getIndustryCodes` | `interzoid.api.intelligence.getIndustryCodes` | `read` | Retrieve NAICS and SIC industry classification codes for a company |
| `intelligence.getIrsPerDiemRates` | `interzoid.api.intelligence.getIrsPerDiemRates` | `read` | Retrieve official IRS per diem reimbursement rates for travel |
| `intelligence.getMuniIssuerProfile` | `interzoid.api.intelligence.getMuniIssuerProfile` | `read` | Retrieve municipal bond issuer profiles and credit diligence intelligence |
| `intelligence.getNearestCoffeeShops` | `interzoid.api.intelligence.getNearestCoffeeShops` | `read` | Find nearest coffee shops and proximity data for a location |
| `intelligence.getParentCompanyInfo` | `interzoid.api.intelligence.getParentCompanyInfo` | `read` | Retrieve corporate ownership and ultimate parent company intelligence |
| `intelligence.getPrivateCompanyDealIntel` | `interzoid.api.intelligence.getPrivateCompanyDealIntel` | `read` | Retrieve venture capital and private equity deal intelligence for private firms |
| `intelligence.getProductRecallInfo` | `interzoid.api.intelligence.getProductRecallInfo` | `read` | Retrieve consumer safety recall intelligence for products and brands |
| `intelligence.getPropertyHistory` | `interzoid.api.intelligence.getPropertyHistory` | `read` | Retrieve historical real estate property sales, deeds, and mortgages |
| `intelligence.getSalesUseTaxRates` | `interzoid.api.intelligence.getSalesUseTaxRates` | `read` | Retrieve US sales and use tax rates by address, zip code, or city |
| `intelligence.getSicCodes` | `interzoid.api.intelligence.getSicCodes` | `read` | Retrieve primary and secondary SIC codes with SEC filing provenance |
| `intelligence.getStockInfo` | `interzoid.api.intelligence.getStockInfo` | `read` | Retrieve financial stock metrics, market cap, and analyst consensus for a ticker |
| `intelligence.getTechStack` | `interzoid.api.intelligence.getTechStack` | `read` | Retrieve technology stack and web infrastructure detected for a domain |
| `intelligence.getUniversityInfo` | `interzoid.api.intelligence.getUniversityInfo` | `read` | Retrieve comprehensive higher education profile and statistics for a university |
| `intelligence.getUserXHandle` | `interzoid.api.intelligence.getUserXHandle` | `read` | Lookup X/Twitter handle for a person, company, or team |
| `intelligence.getXLast3` | `interzoid.api.intelligence.getXLast3` | `read` | Retrieve the latest three posts from an X/Twitter account |
| `intelligence.getXUserProfile` | `interzoid.api.intelligence.getXUserProfile` | `read` | Retrieve public profile statistics and bio for an X/Twitter handle |
| `matching.getAddressAndFullNameMatch` | `interzoid.api.matching.getAddressAndFullNameMatch` | `read` | Generate a composite similarity key based on both address and full name |
| `matching.getAddressMatch` | `interzoid.api.matching.getAddressMatch` | `read` | Generate a standard similarity key for street address matching and deduplication |
| `matching.getAddressMatchAdvanced` | `interzoid.api.matching.getAddressMatchAdvanced` | `read` | Generate an AI-powered similarity key for a street address to identify duplicates |
| `matching.getCityMatch` | `interzoid.api.matching.getCityMatch` | `read` | Generate a similarity key for city name matching and deduplication |
| `matching.getCompanyAndAddressMatch` | `interzoid.api.matching.getCompanyAndAddressMatch` | `read` | Generate a composite similarity key based on both company name and street address |
| `matching.getCompanyAndFullNameMatch` | `interzoid.api.matching.getCompanyAndFullNameMatch` | `read` | Generate a composite similarity key based on both company name and individual full name |
| `matching.getCompanyMatch` | `interzoid.api.matching.getCompanyMatch` | `read` | Generate a standard similarity key for company name matching and deduplication |
| `matching.getCompanyMatchAdvanced` | `interzoid.api.matching.getCompanyMatchAdvanced` | `read` | Generate an AI-powered similarity key for a company or organization name to identify duplicates |
| `matching.getCountryMatch` | `interzoid.api.matching.getCountryMatch` | `read` | Generate a similarity key for country name matching and deduplication |
| `matching.getFullNameMatch` | `interzoid.api.matching.getFullNameMatch` | `read` | Generate an AI-powered similarity key for an individual full name to identify duplicates |
| `matching.getFullNameMatchScore` | `interzoid.api.matching.getFullNameMatchScore` | `read` | Calculate a match similarity score between two individual names (0-100) |
| `matching.getFullNameParsedMatch` | `interzoid.api.matching.getFullNameParsedMatch` | `read` | Generate a similarity key from separate first and last names |
| `matching.getGlobalAddressMatch` | `interzoid.api.matching.getGlobalAddressMatch` | `read` | Generate an AI-powered similarity key for global addresses worldwide |
| `matching.getOrgMatchScore` | `interzoid.api.matching.getOrgMatchScore` | `read` | Calculate a match similarity score between two organization names (0-100) |
| `matching.getProductMatch` | `interzoid.api.matching.getProductMatch` | `read` | Generate an AI-powered similarity key for product names to detect duplicate items |
| `standardization.getCityStandard` | `interzoid.api.standardization.getCityStandard` | `read` | Standardize a city name to its canonical form |
| `standardization.getCountryInfo` | `interzoid.api.standardization.getCountryInfo` | `read` | Get standardized country metadata including ISO codes, currency, and calling code |
| `standardization.getCountryStandard` | `interzoid.api.standardization.getCountryStandard` | `read` | Standardize a country name or alias to canonical form |
| `standardization.getOfficialName` | `interzoid.api.standardization.getOfficialName` | `read` | Resolve commercial or colloquial brand name into official legal entity registration |
| `standardization.getOrgStandard` | `interzoid.api.standardization.getOrgStandard` | `read` | Standardize an organization name to its canonical English form |
| `standardization.getStateAbbreviation` | `interzoid.api.standardization.getStateAbbreviation` | `read` | Standardize a US state or Canadian province name into its two-letter abbreviation |
| `utilities.convertCurrency` | `interzoid.api.utilities.convertCurrency` | `read` | Convert an amount from one foreign currency into another |
| `utilities.getCurrencyRate` | `interzoid.api.utilities.getCurrencyRate` | `read` | Retrieve live USD foreign exchange rate for a currency symbol |
| `utilities.getEntityType` | `interzoid.api.utilities.getEntityType` | `read` | Classify text into entity type (Location, Organization, Individual, or Text) |
| `utilities.getGender` | `interzoid.api.utilities.getGender` | `read` | Infer the likely gender from an individual first name |
| `utilities.getGlobalLatency` | `interzoid.api.utilities.getGlobalLatency` | `read` | Measure website or API URL latency from a specified worldwide location |
| `utilities.getGlobalPageLoad` | `interzoid.api.utilities.getGlobalPageLoad` | `read` | Measure browser page load performance from a specified global geography |
| `utilities.getGlobalTime` | `interzoid.api.utilities.getGlobalTime` | `read` | Retrieve current date and time for a global city or locale |
| `utilities.getGlobalWeather` | `interzoid.api.utilities.getGlobalWeather` | `read` | Retrieve current weather conditions for worldwide city locations |
| `utilities.getNameOrigin` | `interzoid.api.utilities.getNameOrigin` | `read` | Infer the likely geographic country or region of origin from a personal name |
| `utilities.getRemainingCredits` | `interzoid.api.utilities.getRemainingCredits` | `read` | Retrieve the remaining API credits balance for the active API license key |
| `utilities.getWeatherZipCode` | `interzoid.api.utilities.getWeatherZipCode` | `read` | Retrieve current live weather conditions for a US ZIP code |
| `utilities.identifyLanguage` | `interzoid.api.utilities.identifyLanguage` | `read` | Detect the natural language of a text string |
| `utilities.translateToAny` | `interzoid.api.utilities.translateToAny` | `read` | Translate text from any language into a specified target language |
| `utilities.translateToEnglish` | `interzoid.api.utilities.translateToEnglish` | `read` | Translate non-English text to English |
| `validation.addressParse` | `interzoid.api.validation.addressParse` | `read` | Parse a free-form address string into structured postal components |
| `validation.getAreaCode` | `interzoid.api.validation.getAreaCode` | `read` | Retrieve geographic locale and city for a telephone area code |
| `validation.getAreaCodeFromNumber` | `interzoid.api.validation.getAreaCodeFromNumber` | `read` | Extract area code and locale information from a telephone number |
| `validation.getEmailDomainType` | `interzoid.api.validation.getEmailDomainType` | `read` | Classify email domain into Business, Government, Education, Generic, or Disposable |
| `validation.getEmailInfo` | `interzoid.api.validation.getEmailInfo` | `read` | Validate and enrich an email address with deliverability and demographic details |
| `validation.getEmailTrustScore` | `interzoid.api.validation.getEmailTrustScore` | `read` | Compute a trust and quality score for an email address |
| `validation.getGlobalNumberInfo` | `interzoid.api.validation.getGlobalNumberInfo` | `read` | Retrieve demographic and geographic information for an international phone number |
| `validation.getIpProfile` | `interzoid.api.validation.getIpProfile` | `read` | Retrieve IP intelligence, geolocation, ASN, and reputation profile |
| `validation.getPhoneProfile` | `interzoid.api.validation.getPhoneProfile` | `read` | Retrieve phone number intelligence, carrier, time zone, and risk assessment |
| `validation.getZipCodeInfo` | `interzoid.api.validation.getZipCodeInfo` | `read` | Retrieve detailed demographics, city, state, and geographic data for a US ZIP code |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Credit usage

Interzoid's pricing documentation says standard API calls consume one credit; premium APIs and selected AI models consume multiple credits. Every operation is a lookup and is marked `read`, like other metered reads in Corsair: a call spends credits but changes nothing on the account. Check the provider's [API pricing](https://www.interzoid.com/api-pricing) and [AI model credit usage](https://docs.interzoid.com/entries/interzoid-ai-models) for current per-operation or model-specific costs.

## Webhooks

No webhooks.

## Out-of-Scope Operations

- **Batch Processing (`/enrich`)**: Hosted at `https://enrich-api.interzoid.com` for large multi-record/CSV file transformations, which operates outside Corsair's synchronous single-record request/response model.
- **Key Display (`INTERZOID_GET_LICENSE`)**: Catalog helper operation; excluded because credentials must not be reflected through endpoints (R6 security rule).

## Reference

- Official Interzoid Documentation: https://www.interzoid.com/services/
- Interzoid API Pricing: https://www.interzoid.com/api-pricing
- AI Model Credit Usage: https://docs.interzoid.com/entries/interzoid-ai-models
- Corsair Plugin Documentation: https://docs.corsair.dev/plugins/interzoid

## License

Apache-2.0
