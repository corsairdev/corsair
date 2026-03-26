import 'dotenv/config';
import { corsair } from '@/server/corsair';

const main = async () => {
    const res = await corsair.withTenant('default').outlook.api.messages.send({
        subject: 'Test',
        body: 'Test',
        to: 'mukulydv15@gmail.com',
    });
    console.log(res);
};

main();
