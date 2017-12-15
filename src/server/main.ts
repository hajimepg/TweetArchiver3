#!/usr/bin/env node

import * as path from "path";

import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import * as KoaStatic from "koa-static";
import * as TwitterText from "twitter-text";

import TweetRepository from "./tweetRepository";

const app = new Koa();

app.use(KoaStatic(path.join(__dirname, "../../static")));
app.use(KoaStatic(path.join(__dirname, "../client")));

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

app.use(router.routes());

const tweetRepository = new TweetRepository();
tweetRepository.load().then(() => {
    app.listen(3000);
});
