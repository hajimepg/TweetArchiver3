import axios from "axios";
import Vue from "vue";
import VueInfiniteLoading from "vue-infinite-loading";

/* tslint:disable:object-literal-sort-keys */
const app = new Vue({
    el: "#app",
    data: {
        tweets: [] as any[],
        add: "",
        addError: {
            isError: false,
            message: ""
        },
        search: ""
    },
    methods: {
        addTweet() {
            axios.post("http://localhost:3000/api/tweet", {
                    url: this.$data.add
                })
                .then((response) => {
                    this.$data.add = "";
                    this.$data.addError.isError = false;
                    this.$data.tweets.unshift(response.data);
                })
                .catch((error) => {
                    this.$data.addError.isError = true;
                    this.$data.addError.message = error.response.data.error.message;
                });
        },
        loadTweets($state) {
            axios.get("http://localhost:3000/api/tweets", {
                params: {
                    offset: this.$data.tweets.length
                }
            })
            .then((response) => {
                this.$data.tweets.push(...response.data);
                $state.loaded();
            })
            .catch((error) => {
                console.log(error);
            });
        }
    },
    computed: {
        filteredTweets(): any[] {
            return this.tweets.filter((t) => t.originalTweet.text.indexOf(this.search) !== -1);
        },
        addClass(): object {
            return {
                error: this.addError.isError
            };
        }
    },
    components: {
        "infinite-loading": VueInfiniteLoading
    }
});
/* tslint:enable:object-literal-sort-keys */
