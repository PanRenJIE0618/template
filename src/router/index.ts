// @ts-ignore
import { createRouter, createWebHashHistory } from "vue-router";
// @ts-ignore
import { ref, reactive } from 'vue'
// @ts-ignore
import type {Ref} from 'vue'
// 1. 定义路由组件 导入组件。
// @ts-ignore
const routes: Ref<Array<object>> = ref(
    [
        {
            path: "/",
            name: "Home",
            component: () => import("../views/echarts/index.vue")
        },
        {
            path: "/3DMap",
            name: "3DMap",
            component: () => import("../views/3DMap/TDM.vue")
        },
        {
            path: "/2DMap",
            name: "2DMap",
            component: () => import("../views/2DMap/TDM.vue")
        },
    ]
)
let route = reactive<any>({
    history: createWebHashHistory(),
    routes
})
const router = createRouter(route)

export default router;
