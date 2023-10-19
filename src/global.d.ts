// src/global.d.ts
export {}

declare global {
    interface Window {
        viewer: any;//全局变量名,
        pipeline:any
    }
}