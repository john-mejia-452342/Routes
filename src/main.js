import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from "./routes/routes.js"
import { Quasar } from 'quasar'
import axios from 'axios'

import '@quasar/extras/material-icons/material-icons.css'

import 'quasar/src/css/index.sass'

const app = createApp(App)

axios.defaults.baseURL="https://transporte-czaa.onrender.com/api/"

app.use(Quasar, {
    plugins:{}
})
app.use(router)

app.mount('#app')
