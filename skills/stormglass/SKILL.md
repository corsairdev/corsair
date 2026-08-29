---
name: stormglass
description: stormglass.io provides a global weather API offering high-resolution forecasts and historical data from trusted meteorological institutions.
---

-- site: https://dashboard.stormglass.io
-- docs: https://docs.stormglass.io/#/

# API SURFACE

# Operations
Get Elevation for Point
STORMGLASS_IO_GET_ELEVATION_POINT
Tool to fetch elevation data for a single geographic point. Use when you need bathymetry or topography for a specific latitude/longitude.

Get Tide Stations in Area
STORMGLASS_IO_GET_TIDE_STATIONS_AREA
Tool to list tide stations within a defined geographic bounding box. Use when you need stations in a specific region defined by coordinates.

Get solar data for a point
STORMGLASS_IO_STORMGLASS_GET_SOLAR_POINT
Tool to fetch solar irradiation and sun-position data for a specific coordinate. Use after confirming lat/lng, desired parameters, and optional ISO-formatted start/end.

Get tide extremes for a point
STORMGLASS_IO_GET_TIDE_EXTREMES_POINT
Tool to retrieve high and low tide times with corresponding sea level heights for a coordinate. Returns tide extreme points (high/low) for the specified time interval.

Get weather data for a point
STORMGLASS_IO_STORMGLASS_GET_WEATHER_POINT
Tool to fetch marine and land weather data for a specific coordinate. Use after confirming latitude, longitude, and desired parameters.

List All Tide Stations
STORMGLASS_IO_GET_TIDE_STATIONS_LIST
Tool to list all available tide stations. Use when you need a catalog of stations before querying tide data.

# Webhooks

No webhooks

# Auth types
- API Key (header)


Run the plugin generator

Pass your plugin name in PascalCase, for example Stripe, GoogleCalendar, or HubSpot.
pnpm run generate:plugin <PluginName>
For example:
pnpm run generate:plugin Stripe
This creates packages/stripe/ with the full plugin structure:
packages/stripe/
├── index.ts
├── client.ts
├── error-handlers.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── endpoints/
│   ├── index.ts
│   ├── types.ts
│   └── example.ts
├── webhooks/
│   ├── index.ts
│   ├── types.ts
│   └── example.ts
└── schema/
    ├── index.ts
    └── database.ts
It also automatically registers your plugin in packages/corsair/core/constants.ts.
3
Choose your auth type

Open packages/<yourplugin>/index.ts and update the auth type to match the API you’re integrating with.
API key (most REST APIs):
authType?: PickAuth<'api_key'>;
OAuth 2 (Google, GitHub, etc.):
authType?: PickAuth<'oauth_2'>;
Also update the defaultAuthType constant and authConfig to match:
const defaultAuthType: AuthTypes = 'api_key'; // or 'oauth_2'

export const stripeAuthConfig = {
    api_key: {
        account: ['one'] as const,
    },
} as const satisfies PluginAuthConfig;
4
Let Claude Code implement it

Point Claude Code at the API docs for your integration and let it do the heavy lifting.
Open Claude Code in the repo root and give it a prompt like:
I've generated a Corsair plugin scaffold at packages/stripe/.
Please implement it using the Stripe API docs at https://docs.stripe.com/api.

- Update client.ts with the correct base URL and auth headers (Bearer token)
- Replace the example endpoint with real Stripe endpoints (e.g. list customers, get invoice)
- Update the schema/database.ts with relevant entity shapes
- Remove the example webhook and add real Stripe webhook event types
Claude Code can read the scaffold, understand the patterns from existing plugins (e.g. packages/github/), and produce a working starting point.
5
Typecheck and build

cd packages/<yourplugin>
pnpm typecheck
pnpm build
Fix any type errors, then register the plugin in your app the same way as any other Corsair plugin:
src/server/corsair.ts
import { stripe } from '@corsair-dev/stripe';

export const corsair = createCorsair({
    plugins: [stripe({ key: process.env.STRIPE_API_KEY })],
    database: db,
    kek: process.env.CORSAIR_KEK!,
});
6
Test your plugin

The repo includes a ready-made testing sandbox at demo/testing/. Add your plugin there and run scripts against it without setting up a new project.
1. Add your plugin as a workspace dependency in demo/testing/package.json:
demo/testing/package.json
{
  "dependencies": {
    "@corsair-dev/stripe": "workspace:*"
  }
}
Then run pnpm install from the repo root to link it.
2. Register your plugin in the test corsair instance:
demo/testing/src/server/corsair.ts
import { stripe } from '@corsair-dev/stripe';

export const corsair = createCorsair({
    plugins: [
        // ... existing plugins
        stripe({ key: process.env.STRIPE_API_KEY }),
    ],
    database: sqlite,
    kek: process.env.CORSAIR_KEK!,
});
3. Write your test in demo/testing/src/scripts/test-script.ts:
demo/testing/src/scripts/test-script.ts
import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
    const customer = await corsair.stripe.api.customers.get({ id: 'cus_123' });
    console.log(customer);
};

main();
4. Run the script:
cd demo/testing
pnpm run test
Build watch required In a separate terminal, run the build watcher in your plugin package so changes are picked up immediately:
cd packages/stripe
pnpm run build --watch
Without this, the test sandbox will be running stale compiled output.
​
Tips
Look at existing plugins for reference. packages/github/ and packages/resend/ are good examples at different complexity levels.
Auth headers go in client.ts inside the HEADERS config object. Most APIs use Authorization: Bearer <key> or Authorization: <key>.
Webhook signature verification: update the TODO in webhooks/types.ts with the HMAC logic for your provider.
Database entities: define Zod schemas in schema/database.ts for any data you want to cache locally. Leave entities: {} empty if you only need live API calls.
