import 'dotenv/config';
import { createCorsair } from 'corsair';
import { github } from '@corsair-dev/github';
import { linear } from '@corsair-dev/linear';
import { slack } from '@corsair-dev/slack';
import sqlite from './db.js';

// Environment configuration
const config = {
  kek: process.env.CORSAIR_KEK!,
  hub: {
    projectApiKey: process.env.CORSAIR_DEV_API_KEY!,
    signingSecret: process.env.CORSAIR_DEV_SIGNING_SECRET!,
  },
} as const;

// Active plugin integrations
const plugins = [
  slack(),
  linear(),
  github({ authType: 'managed' }),
];

export const corsair = createCorsair({
  database: sqlite,
  kek: config.kek,
  multiTenancy: true,
  hub: config.hub,
  plugins,
});