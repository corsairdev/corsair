import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
    const res = await corsair.onedrive.api.files.list({
    });
    console.log(res);
};

main();
