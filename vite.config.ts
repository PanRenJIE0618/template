import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(),
        AutoImport({
            imports: ['vue', 'vue-router',{
                '/src/store': [ // 全局引用 Pinia
                    'useStore', // import { BaiduImageryProvider } from '../../../public/BaiduMap',
                ],
                '/src/utils/CommonTool.js':[
                    'sleep'
                ],
                '/src/crossTagMsg.js':[ //全局引用跨标签通讯
                    'sendMsg', //发送
                    'listenMsg', //接收
                ]
            }],
            dts:"./src/auto-imports.d.ts"
        })
    ],
    base: "./",
    // build: {
    //     minify: "terser",
    //     terserOptions: {
    //         compress: {
    //             //生产环境时移除console
    //             drop_console: true,
    //             drop_debugger: true,
    //         },
    //     },
    // },
    server: {
        proxy: {
            '/iServer': {
                target: 'https://10.251.4.33:8002', //目标url
                changeOrigin: true, //支持跨域
                rewrite: (path) => path.replace(/^\/iServer/, ""),
                //重写路径,替换/iServer
            },
        }
    }
})
