import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
    const res = await corsair.outlook.api.messages.send({
        subject: 'Test',
        body: 'Test',
        to: 'mukulydv15@gmail.com',
    });
};

main();
