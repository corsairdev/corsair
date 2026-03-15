import { corsair } from '@/server/corsair';
import { setupCorsair } from 'corsair';
import 'dotenv/config';

const main = async () => {
	// const res = await corsair.twitterapiio.api.users.getByUsername({
	// 	userName: '',
	// })

	// console.log(res)

	const res = await corsair.twitterapiio.api.tweets.getReplies({
		tweetId: '2032622929729474792'
	})

	console.log(res)

};

main();
