<template>
  <div class="chat-box" :class="currentRoom ? 'open' : ''">
    <div class="message-alert" v-if="!currentRoom">
      Выберите, кому хотели бы написать
    </div>
    <MessageBox v-else />
  </div>
</template>

<script>
import MessageBox from "./MessageBox.vue";
import { mapGetters } from "vuex";

export default {
  name: "ChatBox",
  computed: mapGetters(["currentRoom"]),
  components: {
    MessageBox,
  },
};
</script>

<style>
</style>