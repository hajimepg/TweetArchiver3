#!/usr/bin/env node

import * as path from "path";

import * as Koa from "koa";
import * as KoaStatic from "koa-static";

const app = new Koa();

app.use(KoaStatic(path.join(__dirname, "../../html")));
app.use(KoaStatic(path.join(__dirname, "../../dist")));

app.listen(3000);
