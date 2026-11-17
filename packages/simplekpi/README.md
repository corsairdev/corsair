# @corsair-dev/simplekpi

KPIs from SimpleKPI: create and manage KPIs, categories and units, write actuals and targets as entries one at a time or in bulk, and read aggregated reports.

## Install

```bash
pnpm add @corsair-dev/simplekpi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `breakdownItems.create` | `simplekpi.api.breakdownItems.create` | `write` | Create a breakdown item, such as a person, team, product or region; its id is what an entry sends as source_id |
| `breakdownItems.delete` | `simplekpi.api.breakdownItems.delete` | `destructive` | Delete a breakdown item, which removes that slice from the KPIs that use it; this cannot be undone |
| `breakdownItems.get` | `simplekpi.api.breakdownItems.get` | `read` | Read one breakdown item by id, with the breakdown it belongs to |
| `breakdownItems.list` | `simplekpi.api.breakdownItems.list` | `read` | List the breakdown items a KPI can be broken down by, optionally only those under one breakdown |
| `breakdownItems.update` | `simplekpi.api.breakdownItems.update` | `write` | Replace a breakdown item; anything left out is reset to its default |
| `kpiCategories.create` | `simplekpi.api.kpiCategories.create` | `write` | Create a KPI category, which groups KPIs on the dashboard |
| `kpiCategories.delete` | `simplekpi.api.kpiCategories.delete` | `destructive` | Delete a KPI category; the KPIs in it are affected and this cannot be undone |
| `kpiCategories.get` | `simplekpi.api.kpiCategories.get` | `read` | Read one KPI category by id, with its name and sort order |
| `kpiCategories.kpis.create` | `simplekpi.api.kpiCategories.kpis.create` | `write` | Create a KPI inside one category; it lands in the category in the path even when the body names another |
| `kpiCategories.kpis.delete` | `simplekpi.api.kpiCategories.kpis.delete` | `destructive` | Delete a KPI through its category, with every entry recorded against it; this cannot be undone |
| `kpiCategories.kpis.get` | `simplekpi.api.kpiCategories.kpis.get` | `read` | Read one KPI through its category. A KPI under a different category answers 404 |
| `kpiCategories.kpis.list` | `simplekpi.api.kpiCategories.kpis.list` | `read` | List the KPIs inside one category |
| `kpiCategories.kpis.update` | `simplekpi.api.kpiCategories.kpis.update` | `write` | Replace a KPI through its category. Anything left out is reset to its default |
| `kpiCategories.list` | `simplekpi.api.kpiCategories.list` | `read` | List the KPI categories on the account |
| `kpiCategories.update` | `simplekpi.api.kpiCategories.update` | `write` | Replace a KPI category; anything left out is reset to its default |
| `kpiEntries.create` | `simplekpi.api.kpiEntries.create` | `write` | Write or update one KPI entry. kpi_id, source_id and entry_date identify it, so the same trio again updates rather than duplicating. A write with every value empty answers stored: false |
| `kpiEntries.createBatch` | `simplekpi.api.kpiEntries.createBatch` | `write` | Write many KPI entries in one request. It answers 200 even when every row was rejected, so rows_added is the only signal; a batch that stored nothing throws |
| `kpiEntries.delete` | `simplekpi.api.kpiEntries.delete` | `destructive` | Delete one KPI entry; this cannot be undone |
| `kpiEntries.get` | `simplekpi.api.kpiEntries.get` | `read` | Read one KPI entry by id, with its actual, target and notes |
| `kpiEntries.list` | `simplekpi.api.kpiEntries.list` | `read` | List KPI entries, filtered by user, KPI, breakdown source and date range; narrow by KPI and dates or the response gets large |
| `kpiEntries.update` | `simplekpi.api.kpiEntries.update` | `write` | Change one KPI entry named in the path; the setActual, setTarget and setNotes flags choose which values are written |
| `kpiFrequencies.get` | `simplekpi.api.kpiFrequencies.get` | `read` | Read one KPI frequency by its id, such as W for weekly |
| `kpiFrequencies.list` | `simplekpi.api.kpiFrequencies.list` | `read` | List the frequencies a KPI can use: D daily, W weekly, M monthly, Q quarterly, Y yearly |
| `kpiIcons.get` | `simplekpi.api.kpiIcons.get` | `read` | Read one KPI icon by id, which is what a KPI sends as icon_id |
| `kpiIcons.list` | `simplekpi.api.kpiIcons.list` | `read` | List the icons a KPI can use, which is where a valid icon_id comes from |
| `kpis.create` | `simplekpi.api.kpis.create` | `write` | Create a KPI. icon_id and unit_id must be real ids from kpiIcons and kpiUnits even though the contract does not mark them mandatory |
| `kpis.delete` | `simplekpi.api.kpis.delete` | `destructive` | Delete a KPI and every entry recorded against it; this cannot be undone |
| `kpis.get` | `simplekpi.api.kpis.get` | `read` | Read one KPI by id, with its frequency, unit, icon, value direction and aggregate function |
| `kpis.list` | `simplekpi.api.kpis.list` | `read` | List the KPIs on the account with their frequency, unit, icon, value direction and aggregate function; page until a page comes back short |
| `kpis.update` | `simplekpi.api.kpis.update` | `write` | Replace a KPI wholesale. Anything left out is reset to its default rather than kept, so read it first and send it back changed |
| `kpiUnits.create` | `simplekpi.api.kpiUnits.create` | `write` | Create a KPI unit with a numeric entry format and a display format |
| `kpiUnits.delete` | `simplekpi.api.kpiUnits.delete` | `destructive` | Delete a KPI unit; KPIs using it are affected, and this cannot be undone |
| `kpiUnits.get` | `simplekpi.api.kpiUnits.get` | `read` | Read one KPI unit by id, with its entry and display formats |
| `kpiUnits.list` | `simplekpi.api.kpiUnits.list` | `read` | List the units a KPI can use, with their entry and display formats |
| `kpiUnits.update` | `simplekpi.api.kpiUnits.update` | `write` | Replace a KPI unit; anything left out is reset to its default |
| `reports.allDataEntries` | `simplekpi.api.reports.allDataEntries` | `read` | Read actuals and targets as one row per KPI, breakdown source and period, already aggregated to each KPI's own frequency |
| `users.get` | `simplekpi.api.users.get` | `read` | Read one user by id, which is what an entry sends as user_id |
| `users.list` | `simplekpi.api.users.list` | `read` | List the people on the account with their role and status; read-only, because people are added in the app |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/simplekpi

## License

Apache-2.0
