<template>
  <div class="backgr" @click="opensettings(false)"></div>
  <div class="modal setting-card">
    <div class="setting-card-head">
      <span>Информатция</span>
      <i class="bx bx-x" @click="opensettings(false)"></i>
    </div>
    <div class="user-info-content">
      <div class="imgbox">
        <img :src="user.avatar[user.avatar.length-1]" 
        v-if="user.avatar.length !== 0" @click="set_sliders(user.avatar)" />
        <div :class="`noimg ${user.usercolor}`" v-else>{{ user.name.at(0) }}</div>
        <label for="user-avatar-file">
          <i class="fa bx bxs-camera"></i>
          <input type="file" id="user-avatar-file"
          hidden @change="setAvatar" /> 
        </label>
      </div>
      <h5>{{ user.name }}</h5>
      <span class="user-status online">в сети</span>
    </div> 
    <input class="setting-card-input" type="text" placeholder="О себе" data-numb="70" v-model="userdata.bio" />
    <p class="help-text">
      Любые подробности, например: возраст, род занятий или город. Пример 23
      года, дизайнер из Санкт-Петербурга.
    </p>

    <div class="setting-link blue">
      <h5><i class="fa bx bxs-user"></i> Имя</h5>
      <input type="text" v-model="userdata.name">
    </div>
    <div class="setting-link green">
      <h5><i class="fa bx bxs-phone"></i> Электронная почта</h5>
      <input type="text" v-model="userdata.email">
    </div>
    <div class="setting-link orange">
      <h5><span class="fa">@</span> Имя пользователя</h5>
      <input type="text" v-model="userdata.username">
    </div>
    <div class="help-text empty"></div>
    <div class="btns">
        <div class="out-button" @click="updateProfile(userdata)">Submit</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: "SettingModal",
  data: () => ({
      userdata: {}
  }),
  methods: {
      ...mapActions(['getProfile', 'uploadAvatar', 'updateProfile']),
      ...mapMutations(['opensettings', 'set_sliders']),
      async setAvatar({ target }){
       const filename = Date.now() + this.user._id + target.files[0].name; 
        const image = target.files[0];
        const formdata = new FormData();
        formdata.append('filename', filename);
        formdata.append('image', image);
        await this.uploadAvatar(formdata);
      },
  },
  computed: mapGetters(['user']),
  created(){
      this.userdata = {
        name: this.user.name,
        bio: this.user.bio,
        email: this.user.email,
        username: this.user.username
      }
  }
};
</script>

<style>
</style>