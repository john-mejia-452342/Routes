import Buses from "../components/Buses.vue"


import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {path: "/buses", component:Buses},
]

export const router = createRouter({
    history:createWebHashHistory(),
    routes
})