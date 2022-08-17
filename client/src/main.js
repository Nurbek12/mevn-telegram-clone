import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

const app = createApp(App)

function token(){
    const token = localStorage.getItem('telegram-clone-token');
    if(token){
        app.config.globalProperties.$http = axios;
        app.config.globalProperties.$http.defaults.headers.common['Authorization'] = token;
    }
}

export function beginToken(token){
    app.config.globalProperties.$http = axios;
    app.config.globalProperties.$http.defaults.headers.common['Authorization'] = token;
}

token()

app
.use(router)
.use(store)
.mount('#app');