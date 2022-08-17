<template>
  <div class="login">
    <div class="login-head">
        <router-link v-if="page == 0" to="/" style="cursor: pointer; color: var(--lead-text)">
            <i class="fa bx bx-left-arrow-alt"></i>
        </router-link>
        <i class="fa bx bx-left-arrow-alt" v-else @click="page = 0" style="cursor: pointer; color: var(--lead-text)"></i>
      <div class="out-button">Настройки</div>
    </div>
    <div class="content">
      <div class="wrapper" v-show="page == 0">
        <h3 class="title">Ваш электронная почта</h3>
        <p class="lead-text">
         Введите свой электронная почту.
        </p>
        <input
          type="email"
          class="login-input"
          v-model="email"
          placeholder="example@domain.com"
        />
        <button class="login-btn" @click="submitEmail()">Продолжить</button>
      </div>

      <div class="wrapper" v-show="page == 1">
        <h3 class="title">{{ email }}</h3>
        <p class="lead-text">
          Если Вы используете это почту, код отправлен через Gmail.
        </p>
        <p class="lead-text" style="color: var(--warning-color)">
          Eсли вы не получили код, обновите страницу и снова введите адрес электронной почты
        </p>
        <label class="title">Код</label>
        <input type="text" v-model="code" class="login-input" placeholder="-----" max="5"
        :style="{color: !codeError && 'red', borderColor: !codeError && 'red',}" />
        <button class="login-btn" @click="submitCode()">Продолжить</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "Login",
  data: () => ({
      email: '',
      code: '',
      codeError: true,
      page: 0,
  }),
  methods: {
    ...mapActions(['emailSend', 'codeSend']),
    submitEmail(){
      if(!this.email.trim()) return;
      this.emailSend(this.email);
      this.page++;
    },
    async submitCode(){
      if(!this.email.trim()) return;
      const err = await this.codeSend({email: this.email, code: this.code});
      this.codeError = err;
    }
  }
};
</script>

<style>
</style>