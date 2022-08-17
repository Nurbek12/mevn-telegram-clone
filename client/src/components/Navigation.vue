<template>
  <div :class="`navigation-bar  ${$store.state.navOpen ? 'open' : ''}`">
    <div class="navigation-head">
      <div class="user-img" @click="open = !open">
        <img
          :src="user?.avatar[user?.avatar.length - 1]"
          v-if="user && user?.avatar.length !== 0"
          alt=""
        />
        <div :class="`noimg ${user?.usercolor}`" v-else>
          {{ user?.name.at(0) }}
        </div>
      </div>
      <div class="user-info">
        <div @click="open = !open">
          <h5>{{ user?.name }}</h5>
          <span>{{ user?.email }}</span>
        </div>
        <div class="nav-drop-down" @click="open = !open">
          <i :class="`fa bx bx-chevron-down ${open ? 'down' : ''}`"></i>
        </div>
      </div>
    </div>
    <div class="logout" @click="store.commit('logout')">
      <i class="fa bx bx-log-out-circle"></i> выход из аккаунта
    </div>
    <div :class="`setting-bar ${open ? 'down' : ''}`">
      <div
        class="setting-link blue"
        @click="
          () => {
            store.commit('set_creategroupmodal', true);
            store.commit('openNav', false);
          }
        "
      >
        <i class="fa bx bxs-group"></i>
        <h5>Создать пруппу</h5>
      </div>
      <div class="setting-link orange">
        <i class="fa bx bxs-megaphone"></i>
        <h5>Создать канал</h5>
      </div>
      <div class="setting-link red">
        <i class="fa bx bxs-user"></i>
        <h5>Контакты</h5>
      </div>
      <div class="setting-link green">
        <i class="fa bx bxs-phone"></i>
        <h5>Звонки</h5>
      </div>
      <div class="setting-link blue">
        <i class="fa bx bxs-bookmark"></i>
        <h5>Избранное</h5>
      </div>
      <div
        class="setting-link purple"
        @click="
          () => {
            store.commit('opensettings', true);
            store.commit('openNav', false);
          }
        "
      >
        <i class="fa bx bxs-cog"></i>
        <h5>Настройки</h5>
      </div>
      <div class="setting-link blue1" @click="store.commit('changeTheme')">
        <i class="fa bx bxs-moon"></i>
        <h5>Ночной режим</h5>
        <div :class="`checkbox ${$store.state.darktheme ? 'active' : ''}`">
          <div class="circle"></div>
        </div>
      </div>
    </div>

    <div class="links">
      <a href="https://telegram.org"><b>Telegram Desktop</b></a
      ><br />
      <a href="#">Версия 4.0.2 x64</a> <span>-</span>
      <a href="#">О программе</a>
    </div>
  </div>
  <div
    :class="`navigation-bar-shadow ${$store.state.navOpen ? 'show' : ''}`"
    @click="store.commit('openNav', false)"
  ></div>
</template>

<script>
import { mapGetters, useStore } from "vuex";

export default {
  name: "Navigation",
  data: () => ({
    open: false,
    store: useStore(),
  }),
  computed: mapGetters(["user"]),
};
</script>

<style>
</style>