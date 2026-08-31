// Kraken.io has no persistent, uniquely-identified resources to cache:
// optimization results carry no stable id when `wait: true` is used, and
// the provider deletes optimized files from its own servers after one hour.
// All operations are live API calls; nothing is stored locally.
