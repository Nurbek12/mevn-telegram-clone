<template>
  <div class="alertbox">
    <transition-group name="alert">
      <div
        class="alert-item user"
        v-for="(ar, i) in store.getters.alertmessages"
        :key="i"
        @click="store.dispatch('changeRoom', [ar.room, false])"
      >
        <div class="imgbox">
          <img
            :src="ar.room.avatar[ar.room.avatar.length - 1]"
            v-if="ar.room.avatar.length !== 0"
          />
          <div :class="`noimg ${ar.room.usercolor}`" v-else>
            {{ ar.room.name.at(0) }}
          </div>
        </div>
        <div class="content">
          <h4 class="chat-item-name">{{ ar.room.name }}</h4>
          <p class="chat-item-message" style="color: var(--text-color)">
            {{ ar.message.text.substring(0, 30) }}
          </p>
        </div>
        <div class="chat-item-info">
          <div class="chat-item-info-time">{{ ar.message.date.time }}</div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  name: "AlertBox",
  data: () => ({
    alerts: [],
    store: useStore(),
  }),
  methods: {},
};
</script>

<style>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.5s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.alert-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.alert-move {
  transition: all 0.6s ease;
}
</style>