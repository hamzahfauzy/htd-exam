import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
window.base_api_url = import.meta.env.VITE_API_PROTOCOL + '://{app_code}' + import.meta.env.VITE_API_PREFIX

if("app_code" in localStorage)
{
    const app_code = localStorage.getItem('app_code')
    window.app_code = app_code
    window.base_api_url = window.base_api_url.replace('{app_code}', app_code)
}

app.use(router)

app.mount('#app')
