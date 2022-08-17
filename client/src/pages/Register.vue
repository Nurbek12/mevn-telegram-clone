<template>
  <div class="login">
    <div class="login-head">
      <router-link to="/" style="cursor: pointer; color: var(--lead-text)">
            <i class="fa bx bx-left-arrow-alt"></i>
        </router-link>
      <div class="out-button">Настройки</div>
    </div>
    <div class="content">
      <div class="wrapper">
        <h3 class="title">Введите Ваше Информатции</h3>
        <p class="lead-text">
          Назовите свою учетную запись, потому что учетная запись, которую вы
          открыли, является новой
        </p>
        <div style="display: flex; column-gap: .8rem;">
          <div>
            <label for="group-image" class="img-label">
              <input type="file" id="group-image" name="image" @change="setAvatar" hidden />
              <i class="fa bx bxs-camera"></i>
              <img v-show="img" :src="img">
            </label>
          </div>
          <input type="text" class="login-input" v-model="userdata.name" placeholder="Имя и Фамилия" />
        </div>
        <input type="text" class="login-input" v-model="userdata.bio" placeholder="Напишите о себе">
        <button class="login-btn" @click="register()" :disabled="status">
          <span v-if="!status">Продолжить</span>
          <span v-else class="loader"><i class="bx bx-loader-alt"></i></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: "Register",
  data: () => ({
    userdata: {
      name: '',
      bio: '',
    },
    status: false,
    img: null,
  }),
  computed: mapGetters(['user']),
  methods: {
    ...mapActions(['updateProfile', 'subscrGroup', 'uploadAvatar']),
    async setAvatar({ target }){
      const filename = Date.now() + this.user._id + target.files[0].name; 
      const image = target.files[0];
      this.img = URL.createObjectURL(image);
      const formdata = new FormData();
      formdata.append('filename', filename);
      formdata.append('image', image);
      await this.uploadAvatar(formdata);
    },
    async register(){
      if(!this.userdata.name.trim() || this.status) return;
      this.status = true;
      await this.updateProfile({ registered: true, name: this.userdata.name, bio: this.userdata.bio });
    }
  }
};
</script>

<style>
</style>