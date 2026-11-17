# @corsair-dev/sensibo

Sensibo plugin for Corsair: read and control Sensibo smart AC controllers (pods), their AC state, timers, schedules, Climate React and sensor history.

## Install

```bash
pnpm add @corsair-dev/sensibo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `devices.list` | `sensibo.api.devices.list` | `read` | List the Sensibo pods (AC controllers) on the account. Pass fields="*" for full pod details. |
| `devices.get` | `sensibo.api.devices.get` | `read` | Get one pod: room, AC state, measurements and remote capabilities. |
| `acStates.list` | `sensibo.api.acStates.list` | `read` | List the current and recent AC states of a pod, newest first. |
| `acStates.set` | `sensibo.api.acStates.set` | `write` | Set the AC state of a pod (on/off, mode, fan level, target temperature, swing). |
| `acStates.setProperty` | `sensibo.api.acStates.setProperty` | `write` | Change one property of the AC state of a pod, such as on or targetTemperature. |
| `measurements.history` | `sensibo.api.measurements.history` | `read` | Get the temperature and humidity readings of a pod for the last few days. |
| `events.list` | `sensibo.api.events.list` | `read` | List the events of a pod: AC state changes, schedule and Climate React changes, motion and geofence events. |
| `doorSensors.listEvents` | `sensibo.api.doorSensors.listEvents` | `read` | List the open and close events of a door sensor. |
| `climateReact.get` | `sensibo.api.climateReact.get` | `read` | Get the Climate React (smart mode) settings of a pod. |
| `climateReact.setEnabled` | `sensibo.api.climateReact.setEnabled` | `write` | Turn Climate React on or off for a pod. |
| `climateReact.configure` | `sensibo.api.climateReact.configure` | `write` | Set the Climate React thresholds and the AC states it applies; replaces the current Climate React settings. |
| `timer.get` | `sensibo.api.timer.get` | `read` | Get the timer set on a pod, if any. |
| `timer.set` | `sensibo.api.timer.set` | `write` | Set a timer that applies an AC state a number of minutes from now; replaces any current timer. |
| `timer.delete` | `sensibo.api.timer.delete` | `destructive` | Delete the timer on a pod. |
| `schedules.list` | `sensibo.api.schedules.list` | `read` | List the schedules of a pod. |
| `schedules.get` | `sensibo.api.schedules.get` | `read` | Get one schedule of a pod. |
| `schedules.create` | `sensibo.api.schedules.create` | `write` | Create a schedule that applies an AC state at a local time, once or on chosen weekdays. |
| `schedules.setEnabled` | `sensibo.api.schedules.setEnabled` | `write` | Enable or pause one schedule of a pod. |
| `schedules.delete` | `sensibo.api.schedules.delete` | `destructive` | Delete one schedule of a pod. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/sensibo

## License

Apache-2.0
