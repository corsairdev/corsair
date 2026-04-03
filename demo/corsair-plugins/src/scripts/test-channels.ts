import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
    const res = await corsair.teams.api.teams.list({
    });
    console.log(res);
};

main();
