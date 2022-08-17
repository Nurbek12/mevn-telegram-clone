<template>
  <Navigation />
  <ChatList />
  <ChatBox />
  <SettingModal v-if="store.getters.settingmodal"/>
  <CreateGroupModal v-if="store.getters.creategroupmodal"/>
  <UserInfoModal v-if="store.getters.userinfomodal"/>
  <AvatarSlider v-if="store.getters.slider.length > 0"/>
  <AlertBox />
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import ChatList from '@/components/ChatList.vue'
import ChatBox from '@/components/ChatBox.vue'
import SettingModal from '@/components/SettingModal.vue'
import AlertBox from '@/components/AlertBox.vue'
import CreateGroupModal from '@/components/CreateGroupModal.vue'
import UserInfoModal from '@/components/UserInfoModal.vue'
import AvatarSlider from '@/components/AvatarSlider.vue'
import { useStore } from 'vuex'

export default {
  name: 'Telegram',
  components: {
    Navigation,
    ChatList,
    ChatBox,
    SettingModal,
    AlertBox,
    CreateGroupModal,
    UserInfoModal,
    AvatarSlider,
  },
  data: () => ({
    store: useStore(),
  }),
  mounted(){
    this.store.dispatch('createConnection');
  }
}
</script>

<style>

</style>