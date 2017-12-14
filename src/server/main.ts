#!/usr/bin/env node

import * as path from "path";

import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import * as KoaStatic from "koa-static";

import tweets from "./tweets";

const app = new Koa();

app.use(KoaStatic(path.join(__dirname, "../../static")));
app.use(KoaStatic(path.join(__dirname, "../client")));

const router = new KoaRouter();

router.get("/api/tweets", (ctx, next) => {
    ctx.body = tweets;
});

app.use(router.routes());

app.listen(3000);
