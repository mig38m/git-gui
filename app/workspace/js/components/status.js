"use strict";

const { dialog } = require("electron").remote;

module.exports = {
  template: `
    <div class="row status">

      <div class="col-xs-4 file-list">
        <div class="commit-box" v-if="$store.getters.isDirty">
          <input type="text" placeholder="subject of your commit" v-model="subject"/>
          <textarea placeholder="optional: body of your commit" v-model="body"/></textarea>
          <button class="block" @click.prevent="commit">
            <i class="octicon octicon-git-commit"></i>
            Commit to {{ $store.state.currentBranch }}
          </button>
        </div>

        <div v-if="$store.getters.isDirty">
          <div class="file" :class="file.status.toLowerCase()" v-for="file in $store.state.status">
            
            <span class="badge" :class="file.status.toLowerCase()">{{ file.status.charAt(0) }}</span>
            {{ file.file }}</td>
          </div>
        </div>

        <span v-else>Clean, no changes...</span>

      </div>

      <div class="col-xs-8">

      </div>
    </div>
  `,

  name: "status",

  data() {
    return {
      subject: "",
      body: "",
    };
  },

  mounted() {
    setInterval(() => {
      this.$store.dispatch("gitStatus");
    }, 4000);
  },

  methods: {
    commit() {
      this.$store
        .dispatch("addAll")
        .then(() => {
          return this.$store.dispatch("commit", [this.subject, this.body]);
        })
        .then(() => {
          this.subject = this.body = "";
        });
    },
  },
};
