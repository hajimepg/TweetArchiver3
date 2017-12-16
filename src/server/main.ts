#!/usr/bin/env node

import * as path from "path";
import * as url from "url";

import * as Koa from "koa";
import * as KoaBodyParser from "koa-body-parser";
import * as KoaRouter from "koa-router";
import * as KoaStatic from "koa-static";
import * as TwitterText from "twitter-text";

import TweetRepository from "./tweetRepository";
import TwitterGateway from "./twitterGateway";

const twitterGateway = new TwitterGateway({
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
});

const app = new Koa();

app.use(KoaStatic(path.join(__dirname, "../../static")));
app.use(KoaStatic(path.join(__dirname, "../client")));

app.use(KoaBodyParser());

const router = new KoaRouter();

router.get("/api/tweets", async (ctx, next) => {
    const tweets = await tweetRepository.find({});

    for (const tweet of tweets) {
        tweet.autoLinkedText = TwitterText.autoLink(
            tweet.originalTweet.text,
            { urlEntities: tweet.originalTweet.entities.urls }
        );

        for (const media of tweet.media) {
            if (media.width >= media.height && media.width > 400) {
                const resizeRate = media.width / 400;
                media.displayWidth = media.width / resizeRate;
                media.displayHeight = media.height / resizeRate;
            }
            else if (media.height > media.width && media.height > 400) {
                const resizeRate = media.height / 400;
                media.displayWidth = media.width / resizeRate;
                media.displayHeight = media.height / resizeRate;
            }
            else {
                media.displayWidth = media.width;
                media.displayHeight = media.height;
            }
        }

        ctx.body = tweets;
    }
});

function parseTweetId(urlString): string | null {
    const tweetUrl = url.parse(urlString);
    if (tweetUrl.hostname !== "twitter.com" || tweetUrl.pathname === undefined) {
        return null;
    }

    const regExpResult = /^\/[\w\d]+\/status\/(\d+)$/.exec(tweetUrl.pathname);
    if (regExpResult === null) {
        return null;
    }

    return regExpResult[1];
}

router.post("/api/tweet", async (ctx, next) => {
    console.log(`/api/tweet called. ctx.request.body.url=${ctx.request.body.url}`);

    const tweetId = parseTweetId(ctx.request.body.url);
    if (tweetId === null) {
        ctx.throw(400);
        return;
    }
    console.log(`tweetId = ${tweetId}`);

    const tweet = await twitterGateway.getTweet((tweetId as string));
    console.log(JSON.stringify(tweet, null, 4));

    ctx.body = {};
});

app.use(router.routes());

const tweetRepository = new TweetRepository();
tweetRepository.load().then(() => {
    app.listen(3000);
});
