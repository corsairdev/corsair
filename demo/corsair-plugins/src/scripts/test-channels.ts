import 'dotenv/config';
import { corsair } from '../server/corsair';

const TWITTER_USERNAME = process.env.TWITTER_USERNAME!;
const TWITTER_EMAIL = process.env.TWITTER_EMAIL!;
const TWITTER_PASSWORD = process.env.TWITTER_PASSWORD!;
const REPLY_TO_TWEET_ID = process.env.REPLY_TO_TWEET_ID ?? '2034958327055020168';

const main = async () => {
    const tenant = corsair.withTenant('default');

    console.log('Logging in to Twitter...');
    const loginRes = await tenant.twitterapiio.api.users.login({
        userName: 'MukulYadav36028',
        email: 'mukulydv15@gmail.com',
        password: 'Mukul#123@',
        proxy: process.env.TWITTER_PROXY!,
    });
    console.log('Login response:', loginRes);

    const loginCookie = loginRes.login_cookies;
    if (!loginCookie) {
        throw new Error('Login failed — no login_cookie returned');
    }

    // console.log('\nPosting reply...');
    // const replyRes = await tenant.twitterapiio.api.replies.post({
    //     replyToTweetId: REPLY_TO_TWEET_ID,
    //     tweet: 'Hello, world!',
    //     loginCookie,
    // });
    // console.log('Reply response:', replyRes);

    console.log('\nPosting tweet...');
    const tweetRes = await tenant.twitterapiio.api.tweets.create({
        // replyToTweetId: REPLY_TO_TWEET_ID,
        tweet: 'Hello, world!',
        loginCookie,
    });
    console.log('Tweet response:', tweetRes);
};

main().catch(console.error);
