import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import App from "./App.vue"
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
window.gsap = gsap
//引入路由
import router from '../src/router';
//引入Pinia
import {createPinia} from "pinia";

import './style.scss'
import 'element-plus/dist/index.css'
import 'animate.css';

//引入flexible
import 'amfe-flexible';

const app = createApp(App);
app.use(router).use(createPinia()).use(ElementPlus).mount('#app')
