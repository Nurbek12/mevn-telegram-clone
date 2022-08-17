<template>
  <div class="container-slider">
    <div class="count">{{ activeimg + 1 }}/{{ reverseimg.length }}</div>
    <div class="slider-prev" @click="previmg">
      <i class="fa bx bx-chevron-left"></i>
    </div>
    <div class="wrapper-slider">
      <div class="slider">
        <div class="img-box">
          <img
            :src="reverseimg[activeimg]"
            v-if="reverseimg.length"
          />
        </div>
      </div>
    </div>
    <div class="slider-next" @click="nextimg">
      <i class="fa bx bx-chevron-right"></i>
    </div>
    <div class="slider-navig">
      <div
        v-for="(img, i) in reverseimg"
        :key="i"
        :class="`img ${i == activeimg ? 'active' : ''}`"
        @click="activeimg = i"
      >
        <img :src="img" />
      </div>
    </div>
    <div class="img-btns">
      <i
        class="fa bx bxs-trash"
        v-if="settingmodal || currentRoom?.admin === user._id"
        @click="removeAvataImg"
      ></i>
      <i class="fa bx bx-x" @click="store.commit('set_sliders', [])"></i>
    </div>
  </div>
</template>

<script>
import { useStore, mapGetters } from "vuex";

export default {
  name: "AvatarSlider",
  data: () => ({
    store: useStore(),
    activeimg: 0,
  }),
  methods: {
    previmg() {
      this.activeimg--;
      if (this.activeimg < 0) {
        this.activeimg = this.slider.length - 1;
      }
    },
    nextimg() {
      this.activeimg++;
      if (this.activeimg > this.slider.length - 1) {
        this.activeimg = 0;
      }
    },
    removeAvataImg() {
      this.store.dispatch("deleteAvatar", {
        filename: this.reverseimg[this.activeimg],
      });
      this.store.commit(
        "set_sliders",
        this.reverseimg.filter((u) => u !== this.reverseimg[this.activeimg])
      );
      this.nextimg();
    },
  },
  computed: {
    ...mapGetters([
      "slider",
      "user",
      "settingmodal",
      "currentRoom",
    ]),
    reverseimg() {
      const imgs = [];
      for (let i = this.slider.length - 1; i >= 0; --i) {
        imgs.push(this.slider[i]);
      }
      return imgs;
    },
  },
};
</script>

<style>
</style>