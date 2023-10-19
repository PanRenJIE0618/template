<script lang="ts" setup>
import {onMounted} from "vue";
onMounted(() => {
  console.log("2D Cesium 页面创建完成");
  let viewer = new Cesium.Viewer('TwoCesiumContainer', {
    infoBox: false,
    timeline: false,
    navigation: false,
    selectionIndicator: false,
    shadows: true,
  });
  //设置时间光照受时间影响。
  viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2023/06/14 14:00:00"));
  //设置Web浏览器内存
  viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
    maximumMemoryUsage: 1024 * 1024 * 1024
  }));
  viewer._cesiumWidget._creditContainer.style.display = "none";
  //设置为二维视图
  viewer.scene.mode = Cesium.SceneMode.SCENE2D
  })
console.log("初始化3D地图")
sendMsg('Test',{
  name:"来自2DMap的跨标签通讯"
})
</script>

<template>
  <div id="TwoCesiumContainer"></div>
</template>


<style scoped lang="scss">
#TwoCesiumContainer {
  width: 100%;
  height: 100%;
}
</style>