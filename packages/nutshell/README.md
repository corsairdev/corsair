# Nutshell plugin for Corsair

The Nutshell plugin exposes the current documented Nutshell REST API through Corsair, with request and response validation for each operation.

## Authentication

Nutshell uses HTTP Basic authentication. Supply the Nutshell user's email as the username and the API key as the password:

```ts
nutshell({
	credentials: {
		email: process.env.NUTSHELL_EMAIL!,
		apiKey: process.env.NUTSHELL_API_KEY!,
	},
});
```

The compact `key` option also accepts `email:api-key`. Requests use HTTPS and the REST base URL `https://app.nutshell.com/rest`.

## Scope

The plugin covers the documented REST operations. Nutshell's legacy JSON-RPC API is not exposed. Nutshell webhooks are outbound notifications configured in the provider, so they are not represented as inbound plugin operations.
