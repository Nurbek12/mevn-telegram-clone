<template>
  <div class="chat-list">
    <button @click="playSound" id="sound" hidden></button>
    <div class="chat-list-head">
      <div>
        <div class="btn" @click="store.commit('openNav', true)">
          <i class="fa bx bx-menu"></i>
        </div>
      </div>
      <input
        type="text"
        placeholder="Поиск"
        v-model="search"
        @keypress.enter="searching()"
      />
    </div>
    <div
      class="chat-items"
      v-if="searchchats.length === 0"
      ref="list"
      @scroll="scrolling = $event.target.scrollTop"
    >
      <div
        v-for="(r, i) in sorted"
        :key="r._id"
        :class="`user ${currentRoom?.chatId === r._id ? 'active' : ''}`"
        @click="changeRoom([r, true])"
      >
        <div class="imgbox">
          <img
            :src="(r.group ? r : r.users[0]).avatar[(r.group ? r : r.users[0]).avatar.length - 1]"
            v-if="(r.group ? r : r.users[0]).avatar.length !== 0"
            alt=""
          />
          <div :class="`noimg ${(r.group ? r : r.users[0]).usercolor}`" v-else>
            {{ (r.group ? r : r.users[0]).name.at(0) }}
          </div>
        </div>
        <div class="content">
          <h4 class="chat-item-name">{{ (r.group ? r : r.users[0]).name }}</h4>
          <p class="chat-item-message">
            <img :src="r.messages[r.messages.length - 1]?.image" v-if="r.messages[r.messages.length - 1]?.image" style="width: 15px;">
            {{ r.messages[r.messages.length - 1]?.text.substring(0, 25) }}
          </p>
        </div>
        <div class="chat-item-info">
          <div class="chat-item-info-time">
            <i
              v-if="r.messages[r.messages.length - 1]?.sender?._id === user._id"
              :class="`check-icon bx bx-check${
                r.messages[r.messages.length - 1].view ? '-double' : ''
              }`"
            >
            </i>
            {{ r.messages[r.messages.length - 1]?.date.time }}
          </div>
          <div :class="`chat-item-info-badge ${!newMessages[i] && 'none'}`">
            {{ newMessages[i] }}
          </div>
        </div>
      </div>
    </div>
    <div class="chat-items" v-else>
      <div
        v-for="r in searchchats"
        :key="r._id"
        class="user"
        @click="changeRoom([r, false])"
        v-show="r._id !== user?._id"
      >
        <div class="imgbox">
          <img
            :src="r?.avatar[r?.avatar.length - 1]"
            v-if="r?.avatar.length !== 0"
            alt=""
          />
          <div :class="`noimg ${r?.usercolor}`" v-else>
            {{ r?.name.at(0) }}
          </div>
        </div>
        <div class="content">
          <h4 class="chat-item-name">{{ r?.name }}</h4>
          <p class="chat-item-message">{{ r?.group ? "Группа" : "Личное" }}</p>
        </div>
      </div>
    </div>
    <div
      :class="`button-up ${scrolling > 500 ? 'up' : ''}`"
      @click="$refs.list.scrollTop = 0"
    >
      <i class="fa bx bx-chevron-up" style="font-size: 1.6rem"></i>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, useStore } from "vuex";

export default {
  name: "ChatList",
  data: () => ({
    store: useStore(),
    search: "",
    searchchats: [],
    scrolling: 0,
  }),
  methods: {
    ...mapActions(["createChat", "searchChat", "changeRoom", "getAllChat"]),
    beginChat(user) {
      this.createChat(user);
    },
    async searching() {
      if (this.search.trim() === "") {
        this.searchchats = [];
        return;
      }
      this.searchchats = await this.searchChat(this.search);
    },
    replaceDate(a, b) {
      let a2 = b
        ? parseFloat(
            b.createdAt.slice(0, 10).replaceAll("-", "") +
              b.createdAt.slice(11, 21).replaceAll(":", "")
          )
        : 1;
      let a1 = a
        ? parseFloat(
            a.createdAt.slice(0, 10).replaceAll("-", "") +
              a.createdAt.slice(11, 21).replaceAll(":", "")
          )
        : 0;
      return a2 - a1;
    },
    sortedList() {
      if (this.rooms.length <= 1) return this.rooms;
      return this.rooms.sort((a, b) =>
        this.replaceDate(
          a.messages[a.messages.length - 1],
          b.messages[b.messages.length - 1]
        )
      );
    },
    playSound() {
      let sound = new Audio(require("@/assets/sounds/telegram_desktop.mp3"));
      sound.oncanplaythrough = () => {
        var playedPromise = sound.play();
        if (playedPromise) {
          playedPromise
            .catch((e) => {
              console.log(e);
              if (
                e.name === "NotAllowedError" ||
                e.name === "NotSupportedError"
              ) {
                console.log(e.name);
              }
            })
            .then();
        }
      };
    },
  },
  computed: {
    ...mapGetters(["user", "rooms", "currentRoom"]),
    newMessages() {
      const mess = [];
      this.rooms.forEach((room) => {
        mess.push(
          room.messages.filter(
            (m) => !m.view && m.sender?._id !== this.user._id
          ).length
        );
      });
      return mess;
    },
    sorted() {
      return this.sortedList();
    },
  },
  async created() {
    await this.getAllChat();
  },
};
</script>

<style>
</style>