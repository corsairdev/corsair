import { corsair } from '@/server/corsair';
import 'dotenv/config';

const main = async () => {
    
    const res = await corsair.sharepoint.api.folders.getAll({})
        console.log(res)

    // const res = await corsair.gmail.keys.get_expires_at();
    // const date = res ? new Date(Number(res) * 1000) : null;

    // console.log('Expires at (date):', date);
                            
};

main();
