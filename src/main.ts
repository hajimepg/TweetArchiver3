import tweets from "./tweets";

import Vue from "vue";

/* tslint:disable:object-literal-sort-keys */
const app = new Vue({
    el: "#app",
    template: `
<div class="container">
    <section class="tweets">
        <article v-for="tweet in tweets" class="tweet">
            <div class="icon">
                <img v-bind:src="tweet.iconFileName" width="48px" height="48px">
            </div>
            <div class="name">
                <strong>{{ tweet.originalTweet.user.name }}</strong>
                <span>@{{ tweet.originalTweet.user.screen_name }}</span>
            </div>
            <div v-html="tweet.autoLinkedText" class="text"></div>
            <div class="time">{{ tweet.originalTweet.created_at }}</div>
        </article>
    </section>
</div>
`,
    data: {
        tweets
    },
});
/* tslint:enable:object-literal-sort-keys */
