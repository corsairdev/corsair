# @corsair-dev/griptape

Corsair integration for the Griptape Cloud API.

## Authentication

Griptape Cloud uses HTTP Bearer authentication.

Provide a Griptape Cloud API key when creating the plugin:

```ts
import { griptape } from '@corsair-dev/griptape';

const plugin = griptape({
	key: process.env.GT_CLOUD_API_KEY,
});