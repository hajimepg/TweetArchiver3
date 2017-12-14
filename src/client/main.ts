import axios from "axios";
import Vue from "vue";

/* tslint:disable:object-literal-sort-keys */
const app = new Vue({
    el: "#app",
    data: {
        tweets: [] as any[],
        search: ""
    },
    computed: {
        filteredTweets(): any[] {
            return this.tweets.filter((t) => t.originalTweet.text.indexOf(this.search) !== -1);
        }
    },
    mounted() {
        axios.get("http://localhost:3000/api/tweets")
            .then((response) => {
                console.log(response.data);
                this.$data.tweets = response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }
});
/* tslint:enable:object-literal-sort-keys */
