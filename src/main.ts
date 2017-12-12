import tweets from "./tweets";

import Vue from "vue";

/* tslint:disable:object-literal-sort-keys */
const app = new Vue({
    el: "#app",
    template: `
<div class="container">
    <section class="tweets">
        <article class="tweet">
            <div class="icon">
                <img v-bind:src="tweets[0].iconFileName" width="48px" height="48px">
            </div>
            <div class="name">
                <strong>{{ tweets[0].originalTweet.user.name }}</strong>
                <span>@{{ tweets[0].originalTweet.user.screen_name }}</span>
            </div>
            <div class="text">{{ tweets[0].autoLinkedText }}</div>
            <div class="time">{{ tweets[0].originalTweet.created_at }}</div>
        </article>

        <article class="tweet">
            <div class="icon">
                <img src="hajimepg.jpg" width="48px" height="48px">
            </div>
            <div class="name"><strong>はじぴー</strong><span>@hajimepg</span></div>
            <div class="text">もっもっ</div>
            <div class="time">Tue Dec 12 07:18:18 +0000 2017</div>
        </article>

        <article class="tweet">
            <div class="icon">
                <img src="hajimepg.jpg" width="48px" height="48px">
            </div>
            <div class="name"><strong>はじぴー</strong><span>@hajimepg</span></div>
            <div class="text"><a href="https://t.co/aQb1wU9Q3D" rel="nofollow">https://t.co/aQb1wU9Q3D</a></div>
            <div class="time">Mon Dec 11 12:14:49 +0000 2017</div>
            <img src="940193145676996608.jpg" width="400px" height="300px">
        </article>

        <article class="tweet">
            <div class="icon">
                <img src="hajimepg.jpg" width="48px" height="48px">
            </div>
            <div class="name"><strong>はじぴー</strong><span>@hajimepg</span></div>
            <div class="text">帰宅しまいたち</div>
            <div class="time">Tue Dec 12 13:25:55 +0000 2017</div>
        </article>

        <article class="tweet">
            <div class="icon">
                <img src="hajimepg.jpg" width="48px" height="48px">
            </div>
            <div class="name"><strong>はじぴー</strong><span>@hajimepg</span></div>
            <div class="text">帰宅後2時間は何もしたくない(理想)</div>
            <div class="time">Tue Dec 12 13:42:06 +0000 2017</div>
        </article>

        <article class="tweet">
            <div class="icon">
                <img src="hajimepg.jpg" width="48px" height="48px">
            </div>
            <div class="name"><strong>はじぴー</strong><span>@hajimepg</span></div>
            <div class="text">プログラミングやっていくぞ</div>
            <div class="time">Tue Dec 12 13:58:21 +0000 2017</div>
        </article>

        <article class="tweet">
            <div class="icon">
                <img src="hajimepg.jpg" width="48px" height="48px">
            </div>
            <div class="name"><strong>はじぴー</strong><span>@hajimepg</span></div>
            <div class="text">Vuex、ドキュメントを全部読んだけど、「おー、これがあると便利そうだなぁ」という感じがない。俺にはまだ価値が分からないのだろう</div>
            <div class="time">Tue Dec 12 07:15:48 +0000 2017</div>
        </article>

        <article class="tweet">
            <div class="icon">
                <img src="hajimepg.jpg" width="48px" height="48px">
            </div>
            <div class="name"><strong>はじぴー</strong><span>@hajimepg</span></div>
            <div class="text">やっと終わった。今回も最終的には100件ぐらいになるだろうからまだ20%か。 <a href="https://t.co/lFWtmtGcZm" rel="nofollow">https://t.co/lFWtmtGcZm</a></div>
            <div class="time">Sun Dec 10 09:51:46 +0000 2017</div>
            <img src="939794751519301638.jpg" width="400.00000000000006px" height="202.60869565217394px">
        </article>

        <article class="tweet">
            <div class="icon">
                <img src="hajimepg.jpg" width="48px" height="48px">
            </div>
            <div class="name"><strong>はじぴー</strong><span>@hajimepg</span></div>
            <div class="text">本日のマンガ <a href="https://t.co/CIVNxRbI7l" rel="nofollow">https://t.co/CIVNxRbI7l</a></div>
            <div class="time">Sun Dec 10 08:28:36 +0000 2017</div>
            <img src="939773828397350912.jpg" width="300px" height="400px">
        </article>

        <article class="tweet">
            <div class="icon">
                <img src="hajimepg.jpg" width="48px" height="48px">
            </div>
            <div class="name"><strong>はじぴー</strong><span>@hajimepg</span></div>
            <div class="text">1人鳥貴族、いいですね</div>
            <div class="time">Tue Dec 12 10:23:32 +0000 2017</div>
        </article>

        <article class="tweet">
            <div class="icon">
                <img src="hajimepg.jpg" width="48px" height="48px">
            </div>
            <div class="name"><strong>はじぴー</strong><span>@hajimepg</span></div>
            <div class="text">Vuexのドキュメント、話を出す順番で損をしている感じ</div>
            <div class="time">Tue Dec 12 06:46:23 +0000 2017</div>
        </article>
    </section>
</div>
`,
    data: {
        tweets
    },
});
/* tslint:enable:object-literal-sort-keys */
