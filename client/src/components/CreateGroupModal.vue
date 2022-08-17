<template>
  <div
    class="backgr"
    @click="store.commit('set_creategroupmodal', false)"
  ></div>
  <div class="modal create-group">
    <div class="input-group">
      <label for="group-image" class="img-label">
        <input
          type="file"
          id="group-image"
          name="image"
          @change="changeFile($event)"
          hidden
        />
        <i class="fa bx bxs-camera"></i>
        <img v-show="img" :src="img" />
      </label>
      <div class="input-form">
        <input type="text" placeholder="Название группы" v-model="name" />
      </div>
    </div>
    <div class="btns">
      <button
        class="out-button"
        @click="store.commit('set_creategroupmodal', false)"
      >
        Отмена
      </button>
      <button class="out-button" @click="createGroup">Далее</button>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  name: "CreateGroupModal",
  data: () => ({
    store: useStore(),
    name: "",
    file: null,
    img: null,
  }),
  methods: {
    async createGroup() {
      if (!this.name.trim()) return;
      const data = new FormData();
      data.append("name", this.name);
      data.append("admin", this.store.getters.user._id);
      if (this.file) {
        const filename = Date.now() + this.store.getters.user._id + this.file.name;
        data.append("filename", filename);
        data.append("image", this.file);
      }
      await this.store.dispatch("createGroup", data);
    },
    changeFile(file) {
      this.file = file.target.files[0];
      this.img = URL.createObjectURL(this.file);
    },
  },
};
</script>

<style>
</style>