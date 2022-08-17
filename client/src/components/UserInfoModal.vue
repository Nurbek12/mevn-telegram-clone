<template>
  <div class="backgr" @click="set_user_info_modal(false)"></div>
  <div class="modal setting-card">
    <div class="setting-card-head">
      <span>Информатция</span>
      <i class="bx bx-x" @click="set_user_info_modal(false)"></i>
    </div>
    <div class="user-info-content receiver-info">
      <div class="imgbox">
        <img v-if="currentRoom.avatar.length!==0" 
        :src="currentRoomAvatar"
        @click="set_sliders(currentRoom.avatar)" />
        <div :class="`noimg ${currentRoom.usercolor}`" v-else>{{ currentRoom.name.at(0) }}</div>
        <label for="user-avatar-file" v-if="currentRoom?.admin === user._id">
          <i class="fa bx bxs-camera"></i>
          <input type="file" id="user-avatar-file"
          hidden @change="setAvatar" />
        </label>
      </div>
      <div>
        <h5>{{ currentRoom.name }}</h5>
        <span class="user-status" :style="{color: `var(--${onlineuser&&!currentRoom?.group?'active-color':'lead-text'})`}">
            {{currentRoom?.group?`${currentRoom.users.length} участников`: onlineuser?'в сети':'был(а) недавно'}}
        </span>
      </div>
    </div>
    <div class="help-text empty"></div>
    <div class="user-info-detals">
        <div>
          <i>i</i>
        </div>
        <div v-if="currentRoom?.admin === user._id">
          <input type="text" style="padding-left: 0; margin: 5px 0; border-bottom: 1px solid #555a;" placeholder="Имя" v-model="admindata.name">
          <input type="text" style="padding-left: 0; margin: 5px 0; border-bottom: 1px solid #555a;" placeholder="Описание" v-model="admindata.bio">
          <input type="text" style="padding-left: 0; margin: 5px 0; border-bottom: 1px solid #555a;" placeholder="Имя пользователя" v-model="admindata.username">
          <div class="btns" @click="updateGroup(admindata)">
              <div class="out-button">Submit</div>
          </div>
        </div>
        <div v-else>
            <div class="user-info-panel" v-if="currentRoom.email">
                <h5>{{ currentRoom.email }} <br> <span>Электронная почта</span></h5>
            </div>

            <div class="user-info-panel" v-if="currentRoom.bio">
                <h5>{{ currentRoom.bio }} <br> <span>О себе</span></h5>
            </div>

            <div class="user-info-panel" v-if="currentRoom.username">
                <h5>@{{ currentRoom.username }} <br> <span>Имя пользователя</span></h5>
            </div>
        </div>
    </div>
    <div class="group-users" v-if="currentRoom.group">
      <div v-for="r in currentRoom.users" :key="r._id" class="user"
        @click="change([r, false])">
        <div class="imgbox">
          <img :src="r.avatar[0]" v-if="r.avatar.length !== 0" alt="" />
          <div :class="`noimg ${r.usercolor}`" v-else>
            {{ r.name.at(0) }}
          </div>
        </div>
        <div class="content">
          <h4 class="chat-item-name">{{ r.name }}</h4>
          <p class="chat-item-message" :style="{color: `var(--${thisOnline(r._id)?'active-color':'lead-text'})`}">
            {{ thisOnline(r._id)?'в сети':'был(а) недавно' }}
          </p>
        </div>
        <div class="chat-item-info">
          <div class="chat-item-info-time" style="color: var(--active-color)">{{ currentRoom.admin === r._id ? 'админ':'' }}</div>
          <div class="chat-item-info-badge none"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: "UserInfoModal",
  data: () => ({
    admindata: {}
  }),
  methods: {
    ...mapActions(['changeRoom', 'updateGroup', 'uploadGroupAvatar']),
    ...mapMutations(['set_user_info_modal', 'opensettings', 'set_sliders']),
    thisOnline(id){
      return this.online.filter(u => u.id === id).length > 0
    },
    change(data){
      if(data[0]._id === this.user._id){
        this.opensettings(true);
      }else{
        this.changeRoom(data);
      }
      this.set_user_info_modal(false);
    },
    async setAvatar({ target }){
       const filename = Date.now() + this.user._id + target.files[0].name; 
        const image = target.files[0];
        const formdata = new FormData();
        formdata.append('id', this.currentRoom.chatId);
        formdata.append('admin', this.user._id);
        formdata.append('filename', filename);
        formdata.append('image', image);
        await this.uploadGroupAvatar(formdata);
    },
  },
  computed: {
    ...mapGetters(['user', 'online', 'currentRoom', 'currentRoomAvatar']),
    onlineuser(){
      return this.online.filter(u => u.id === this.currentRoom._id).length > 0
    },
  },
  created(){
    this.admindata = {
      name: this.currentRoom.name,
      bio: this.currentRoom.bio,
      username: this.currentRoom.username,
    }
  }
};
</script>

<style>
</style>