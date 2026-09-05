# @corsair-dev/boltiot

Bolt IoT plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/boltiot
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `device.analogRead` | `boltiot.api.device.analogRead` | `read` | Read the analog value (0-1023) from a specified pin on a Bolt device |
| `device.checkStatus` | `boltiot.api.device.checkStatus` | `read` | Check whether a specified Bolt device is online |
| `device.digitalRead` | `boltiot.api.device.digitalRead` | `read` | Read the status of a digital pin on a specified Bolt device |
| `device.digitalWrite` | `boltiot.api.device.digitalWrite` | `write` | Set a digital pin HIGH or LOW on a specified Bolt device |
| `serial.read` | `boltiot.api.serial.read` | `read` | Read incoming serial data from a Bolt device UART |
| `serial.write` | `boltiot.api.serial.write` | `write` | Send ASCII serial data to a Bolt device over UART |
| `serial.writeRead` | `boltiot.api.serial.writeRead` | `write` | Send serial data and read reply immediately on a Bolt device |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/boltiot

## License

Apache-2.0
