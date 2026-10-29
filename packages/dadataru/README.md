# @corsair-dev/dadataru

Dadataru plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/dadataru
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `clean.address` | `dadataru.api.clean.address` | `read` | Clean and standardize Russian addresses |
| `clean.birthdate` | `dadataru.api.clean.birthdate` | `read` | Clean and standardize birthdates |
| `clean.email` | `dadataru.api.clean.email` | `read` | Clean and standardize email addresses |
| `clean.name` | `dadataru.api.clean.name` | `read` | Clean and parse full names |
| `clean.passport` | `dadataru.api.clean.passport` | `read` | Clean and validate Russian passport numbers |
| `clean.phone` | `dadataru.api.clean.phone` | `read` | Clean and standardize phone numbers |
| `clean.record` | `dadataru.api.clean.record` | `read` | Clean composite multi-field records |
| `clean.vehicle` | `dadataru.api.clean.vehicle` | `read` | Clean and recognize vehicle models |
| `find.address` | `dadataru.api.find.address` | `read` | Find address details by ID |
| `find.bank` | `dadataru.api.find.bank` | `read` | Find bank details |
| `find.carBrand` | `dadataru.api.find.carBrand` | `read` | Find car brand details |
| `find.companyByEmail` | `dadataru.api.find.companyByEmail` | `read` | Find companies by email domain |
| `find.country` | `dadataru.api.find.country` | `read` | Find country metadata |
| `find.courtById` | `dadataru.api.find.courtById` | `read` | Find court details by ID |
| `find.currency` | `dadataru.api.find.currency` | `read` | Find currency details |
| `find.delivery` | `dadataru.api.find.delivery` | `read` | Find delivery city mapping IDs |
| `find.fiasById` | `dadataru.api.find.fiasById` | `read` | Find address by FIAS ID |
| `find.fmsUnit` | `dadataru.api.find.fmsUnit` | `read` | Find passport issuing authority (FMS) |
| `find.fnsUnit` | `dadataru.api.find.fnsUnit` | `read` | Find tax office (FNS) details |
| `find.ftsUnit` | `dadataru.api.find.ftsUnit` | `read` | Find customs office (FTS) details |
| `find.medicalPositionById` | `dadataru.api.find.medicalPositionById` | `read` | Find medical positions by ID |
| `find.mktu` | `dadataru.api.find.mktu` | `read` | Find MKTU trademark classification items |
| `find.okpd2ById` | `dadataru.api.find.okpd2ById` | `read` | Find OKPD2 classifications by ID |
| `find.okpdtrPosition` | `dadataru.api.find.okpdtrPosition` | `read` | Find OKPDTR job positions by code |
| `find.okpdtrProfession` | `dadataru.api.find.okpdtrProfession` | `read` | Find OKPDTR worker professions |
| `find.oktmoById` | `dadataru.api.find.oktmoById` | `read` | Find territory details by OKTMO code |
| `find.okved2` | `dadataru.api.find.okved2` | `read` | Find OKVED2 economic activities |
| `find.party` | `dadataru.api.find.party` | `read` | Find Russian party/company details |
| `find.partyBy` | `dadataru.api.find.partyBy` | `read` | Find Belarus party by UNP |
| `find.partyKz` | `dadataru.api.find.partyKz` | `read` | Find Kazakhstan company details |
| `find.postalOffice` | `dadataru.api.find.postalOffice` | `read` | Find postal office details |
| `find.postalUnitById` | `dadataru.api.find.postalUnitById` | `read` | Find postal unit details |
| `geolocate.address` | `dadataru.api.geolocate.address` | `read` | Find addresses near coordinates |
| `geolocate.postalUnit` | `dadataru.api.geolocate.postalUnit` | `read` | Find postal units near coordinates |
| `ipLocate.address` | `dadataru.api.ipLocate.address` | `read` | Geolocate address by IP |
| `profile.balance` | `dadataru.api.profile.balance` | `read` | Get current account balance |
| `profile.statistics` | `dadataru.api.profile.statistics` | `read` | Get usage statistics |
| `profile.versions` | `dadataru.api.profile.versions` | `read` | Get reference database update versions |
| `suggest.address` | `dadataru.api.suggest.address` | `read` | Autocomplete and suggest addresses |
| `suggest.bank` | `dadataru.api.suggest.bank` | `read` | Autocomplete and suggest banks |
| `suggest.carBrand` | `dadataru.api.suggest.carBrand` | `read` | Autocomplete and suggest car brands |
| `suggest.country` | `dadataru.api.suggest.country` | `read` | Autocomplete and suggest countries |
| `suggest.court` | `dadataru.api.suggest.court` | `read` | Autocomplete and suggest courts |
| `suggest.currency` | `dadataru.api.suggest.currency` | `read` | Autocomplete and suggest currencies |
| `suggest.email` | `dadataru.api.suggest.email` | `read` | Autocomplete and suggest emails |
| `suggest.fias` | `dadataru.api.suggest.fias` | `read` | Autocomplete and suggest FIAS addresses |
| `suggest.fmsUnit` | `dadataru.api.suggest.fmsUnit` | `read` | Suggest passport issuing departments |
| `suggest.fnsUnit` | `dadataru.api.suggest.fnsUnit` | `read` | Suggest tax inspection (FNS) offices |
| `suggest.ftsUnit` | `dadataru.api.suggest.ftsUnit` | `read` | Suggest customs (FTS) offices |
| `suggest.medicalPosition` | `dadataru.api.suggest.medicalPosition` | `read` | Suggest medical positions/specialties |
| `suggest.metro` | `dadataru.api.suggest.metro` | `read` | Suggest metro stations |
| `suggest.mktu` | `dadataru.api.suggest.mktu` | `read` | Suggest MKTU trademark classifications |
| `suggest.name` | `dadataru.api.suggest.name` | `read` | Autocomplete and suggest names (FIO) |
| `suggest.okpd2` | `dadataru.api.suggest.okpd2` | `read` | Suggest product classification (OKPD2) codes |
| `suggest.okpdtrPosition` | `dadataru.api.suggest.okpdtrPosition` | `read` | Suggest job positions from OKPDTR classifier |
| `suggest.okpdtrProfession` | `dadataru.api.suggest.okpdtrProfession` | `read` | Suggest worker professions from OKPDTR |
| `suggest.oktmo` | `dadataru.api.suggest.oktmo` | `read` | Suggest municipal territories (OKTMO) |
| `suggest.okved2` | `dadataru.api.suggest.okved2` | `read` | Suggest economic activities (OKVED2) |
| `suggest.party` | `dadataru.api.suggest.party` | `read` | Suggest Russian parties/companies |
| `suggest.partyBy` | `dadataru.api.suggest.partyBy` | `read` | Suggest Belarus parties/companies |
| `suggest.partyKz` | `dadataru.api.suggest.partyKz` | `read` | Suggest Kazakhstan parties/companies |
| `suggest.postalOffice` | `dadataru.api.suggest.postalOffice` | `read` | Suggest postal offices |
| `suggest.postalUnit` | `dadataru.api.suggest.postalUnit` | `read` | Suggest postal units |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dadataru

## License

Apache-2.0
