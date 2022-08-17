<template>
  <div class="chat-room">
    <div class="chat-head">
      <div class="media-user-info">
        <i class="bx bx-left-arrow-alt" @click="clearRoom"></i>
        <div class="imgbox" @click="set_user_info_modal(true)">
          <img v-if="currentRoom?.avatar.length !== 0" :src="currentRoomAvatar" />
          <div :class="`noimg ${currentRoom.usercolor}`" v-else>
            {{ currentRoom.name.at(0) }}
          </div>
        </div>
      </div>
      <div class="chat-head-name" @click="set_user_info_modal(true)">
        <h5>{{ currentRoom.name }}</h5>
        <span v-if="currentRoom.typedUsers.length === 0" @click.stop :style="{color: `var(--${onlineuser && !currentRoom.group ? 'active-color' : 'lead-text'})`}">
          {{currentRoom.group? `${currentRoom.users.length} участников`: onlineuser? "в сети": "был(а) недавно"}}
        </span>
        <span v-else class="typing-box">
          <div class="anim">
            <span style="--i: 0"></span>
            <span style="--i: 1"></span>
            <span style="--i: 2"></span>
          </div>
          <div v-if="currentRoom.typedUsers.length < 3" style="display: flex; align-items: center; column-gap: .4rem;">
            <div class="typing" v-for="(tp, i) in currentRoom.typedUsers" :key="tp.id">
              {{currentRoom.group || (currentRoom.typedUsers.length > 1) ? tp.name: ""}}{{ (currentRoom.typedUsers.length > 1) && (currentRoom.typedUsers.length - 1 !== i) ? ',': '' }}
            </div>
          </div>
          <div v-else>
            и {{ currentRoom.typedUsers.length }} ещё 
          </div>
          <div>
              печатает
          </div>
        </span>
      </div>
      <div class="chat-head-icons">
        <i class="fa bx bx-search-alt-2"></i>
        <i class="fa bx bx-dots-vertical-rounded" @click="showdetails = !showdetails" v-if="rooms.find(rm => rm._id === currentRoom.chatId)"></i>
        <div class="set-room" v-show="showdetails" v-if="rooms.find(rm => rm._id === currentRoom.chatId)">
          <span v-if="currentRoom.group" @click="unjoingroup({userid: user._id, name: user.name, id: currentRoom.chatId})">
            <i class="fa bx bx-log-out-circle"></i> Покинуть группу
          </span>
          <span v-else @click="deleteChat({ receiver: currentRoom._id, id: currentRoom.chatId })">
            <i class="fa bx bxs-trash"></i> Удалит</span>
        </div>
      </div>
    </div>
    <div class="chatbox" @scroll="scrollBox" id="box" ref="box">
      <div class="chat-messages">
        <MessageDate v-for="(mess, i) in sortedMessages" :key="i" :messages="mess" />
      </div>
    </div>
    <div :class="`upbtn ${scrolling > 1000 && 'up'}`" @click="$refs.box.scrollTop = $refs.box.scrollHeight">
      <i class="fa bx bx-chevron-down" style="font-size: 1.6rem"></i>
    </div>
    <div class="chat-form">
      <div class="send-input-content" v-show="!currentRoom.group || sucscribegrup">
        <label for="message-file">
          <input type="file" id="message-file" @change="image = $event.target.files[0]" hidden />
          <i class="fa bx bx-paperclip" style="transform: rotate(135deg)"></i>
        </label>
        <input autocomplete="cc-number" type="text" id="text" v-model="text" placeholder="Написать сообшение..."
          @keypress.enter="send" ref="text"/>
        <div @click="showsmile = !showsmile">
          <i class="fa bx bx-smile" :style="{ color: `${showsmile ? 'var(--active-color)' : ''}` }"></i>
        </div>
        <div class="send-icons mic">
          <i class="fa bx bx-microphone" v-if="!text"></i>
          <i class="fa bx bxs-send" @click="send" v-else-if="text && !sending" style="color: var(--active-color)"></i>
          <i class="fa bx bx-loader loader" @click="send" v-else style="color: var(--active-color)"></i>
        </div>
        <Smiles v-show="showsmile" @putsmile="textsmile($event)" />
        <ImageMessage v-if="image" :image="image"/>
      </div>
      <div class="subscr-btn" v-show="currentRoom.group && !sucscribegrup" @click="subscrGroup(currentRoom.chatId)">
        Присоединиться
      </div>
    </div>
  </div>
</template>

<script>
import Smiles from "./Smiles.vue";
import MessageDate from "./MessageDate.vue";
import ImageMessage from "./ImageMessage.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "MessageBox",
  components: {
    Smiles,
    MessageDate,
    ImageMessage,
  },
  data: () => ({
    showsmile: false,
    text: "",
    scrolling: 0,
    prevtext: "",
    showdetails: false,
    image: null,
    sending: false,
  }),
  methods: {
    ...mapActions([
      "sendMessage",
      "typingText",
      "subscrGroup",
      "deleteChat",
      "unjoingroup",
      "messageImage",
    ]),
    ...mapMutations(["set_user_info_modal", "clearRoom"]),
    textsmile(e) {
      this.text += e;
      this.$refs.text.focus();
    },
    scrollBox(e) {
      this.scrolling = e.target.scrollHeight - e.target.scrollTop;
    },
    getTime(){
        const date = new Date();
        const time = `${
            date.getHours() >= 10 ? date.getHours() : "0" + date.getHours()
        }:${
            date.getMinutes() >= 10 ? date.getMinutes() : "0" + date.getMinutes()
        }`;
        let month;
        switch (date.getMonth()) {
            case 0: month = "января"; break;
            case 1: month = "февраля"; break;
            case 2: month = "марта"; break;
            case 3: month = "апреля"; break;
            case 4: month = "мая"; break;
            case 5: month = "июня"; break;
            case 6: month = "июля"; break;
            case 7: month = "августа"; break;
            case 8: month = "сентября"; break;
            case 9: month = "октября"; break;
            case 10: month = "ноября"; break;
            case 11: month = "декабря"; break;
        }
        const day = `${date.getDate()} ${month}`;
        return [time, day];
    },
    async send() {
      if (!this.text.trim() || this.sending) return;
      this.sending = true;
      const { chatId, ...userdata } = this.currentRoom;
      const data = {
        chatId,
        receiver: {
          _id: userdata._id,
          group: !!userdata.group,
        },
        sender: this.user._id,
        text: this.text.trim(),
        date: {
          day: this.getTime()[1],
          time: this.getTime()[0],
        },
        image: '',
      };
      if(this.image){
        const filename = Date.now() + this.user._id + this.image.name; 
        const image = this.image;
        const formdata = new FormData();
        formdata.append('filename', filename);
        formdata.append('image', image);
        const { url } = await this.messageImage(formdata);
        data.image = url;
      }
      this.showsmile = false;
      this.text = "";
      this.image = null;
      this.$refs.text.focus();
      await this.sendMessage(data);
      this.sending = false;
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.$refs.text) {
        this.$refs.text.focus();
      }
      if (this.$refs.box) {
        this.$refs.box.scrollTop = this.$refs.box.scrollHeight;
      }
    }, 100);
  },
  watch: {
    text() {
      if (
        (this.prevtext === "" && this.text !== "") ||
        (this.text === "" && this.prevtext !== "")
      ) {
        this.typingText(this.text);
        this.prevtext = this.text;
      }
    },
  },
  computed: {
    ...mapGetters([
      "user",
      "online",
      "currentRoomAvatar",
      "currentRoom",
      "sortedMessages",
      "rooms",
    ]),
    onlineuser() {
      return (
        this.online.filter((u) => u.id === this.currentRoom._id).length > 0
      );
    },
    sucscribegrup() {
      return this.rooms.filter((rm) => rm._id === this.currentRoom.chatId)[0]?.group;
    },
  },
};
</script>

<style>
</style>