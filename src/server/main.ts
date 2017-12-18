#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as url from "url";

import * as Koa from "koa";
import * as KoaBodyParser from "koa-body-parser";
import * as KoaMount from "koa-mount";
import * as KoaRouter from "koa-router";
import * as KoaStatic from "koa-static";
import * as TwitterText from "twitter-text";

import { downloadMedia, downloadProfileImage } from "./downloadImage";
import TweetRepository from "./tweetRepository";
import TwitterGateway from "./twitterGateway";

const twitterGateway = new TwitterGateway({
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
});

const app = new Koa();

const iconDirName = path.join(__dirname, "../../db/icons");
if (fs.existsSync(iconDirName) === false) {
    fs.mkdirSync(iconDirName);
}

const mediaDirName = path.join(__dirname, "../../db/media");
if (fs.existsSync(mediaDirName) === false) {
    fs.mkdirSync(mediaDirName);
}

app.use(KoaMount("/icons", KoaStatic(iconDirName)));
app.use(KoaMount("/media", KoaStatic(mediaDirName)));
app.use(KoaStatic(path.join(__dirname, "../../static")));
app.use(KoaStatic(path.join(__dirname, "../client")));

app.use(KoaBodyParser());

const router = new KoaRouter();

function convertDbTweetToClientTweet(tweet: any) {
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

        media.fileName = "media/" + media.fileName;
    }

    tweet.iconFileName = "icons/" + tweet.iconFileName;
}

router.get("/api/tweets", async (ctx, next) => {
    const offset = ctx.request.query.offset || 0;
    const limit = 10;
    const tweets = await tweetRepository.find({}, offset, limit);

    for (const tweet of tweets) {
        convertDbTweetToClientTweet(tweet);
    }

    ctx.body = tweets;
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

function imageFileExistsWithBaseName(dirName: string, baseName: string): string | null {
    for (const iconExtension of ["jpg", "png"]) {
        const iconFullPath = path.join(dirName, `${baseName}.${iconExtension}`);

        if (fs.existsSync(iconFullPath)) {
            return `${baseName}.${iconExtension}`;
        }
    }

    return null;
}

router.post("/api/tweet", async (ctx, next) => {
    console.log(`/api/tweet called. ctx.request.body.url=${ctx.request.body.url}`);

    const tweetId = parseTweetId(ctx.request.body.url);
    if (tweetId === null) {
        ctx.response.status = 400;
        ctx.response.body = {
            error: {
                message: "Invalid URL"
            }
        };
        return;
    }
    console.log(`tweetId = ${tweetId}`);

    const tweet = await twitterGateway.getTweet((tweetId as string));
    console.log(JSON.stringify(tweet, null, 4));

    const iconBaseFileName = tweet.user.screen_name;

    let iconFileName = imageFileExistsWithBaseName(iconDirName, iconBaseFileName);

    if (iconFileName === null) {
        iconFileName = await downloadProfileImage(tweet.user.profile_image_url,
            iconDirName, iconBaseFileName);
    }

    const media = new Array<object>();
    if (tweet.extended_entities !== undefined) {
        for (const mediaEntity of tweet.extended_entities.media) {
            const mediaBaseName = mediaEntity.id_str;
            let mediaFileName = imageFileExistsWithBaseName(mediaDirName, mediaBaseName);

            if (mediaFileName === null) {
                mediaFileName = await downloadMedia(mediaEntity.media_url, mediaDirName, mediaBaseName);
            }

            media.push({
                fileName: mediaFileName,
                height: mediaEntity.sizes.medium.h,
                width: mediaEntity.sizes.medium.w
            });
        }
    }

    /* tslint:disable:object-literal-sort-keys */
    const newDoc = {
        originalTweet : tweet,
        iconFileName,
        media,
    };
    /* tslint:enable:object-literal-sort-keys */

    const insertedDoc = await tweetRepository.insert(newDoc);

    convertDbTweetToClientTweet(insertedDoc);

    ctx.body = insertedDoc;
});

app.use(router.routes());

const tweetRepository = new TweetRepository();
tweetRepository.load().then(() => {
    app.listen(3000);
});
