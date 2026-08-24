import { list as projectsList } from './projects';
import { list as webhooksList } from './webhooks';

export const Projects = {
        list: projectsList,
};

export const Webhooks = {
        list: webhooksList,
};

export * from './types';
