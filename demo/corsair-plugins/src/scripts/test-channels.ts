import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
    const res = await corsair.teams.api.channels.list({
        teamId: 'bffe3fd3-a778-4343-8288-f1c23927c79e',
    });
    console.log(res);
};

main();
