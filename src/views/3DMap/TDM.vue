<script lang="ts" setup>
import {onMounted} from "vue";

onMounted(() => {
  console.log("3D Cesium 页面创建完成");
  let viewer = new Cesium.Viewer('cesiumContainer', {
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
  // var imageryProvider = new Cesium.SuperMapImageryProvider({
  //   url: "http://221.130.54.58:8091/iserver/services/map-ugcv5-HPmap/rest/maps/HPmap"
  // });
  // //通过影像提供者创建影像图层
  // var imageryLayer = new Cesium.ImageryLayer(imageryProvider);
  // console.log(imageryLayer)
  var url = "http://221.130.54.58:8091/iserver/services/map-ugcv5-HPmap/rest/maps/HPmap";
  var originResult = {"viewBounds":{"top":31.444018752694234,"left":121.4435305380216,"bottom":31.356128127694234,"leftBottom":{"x":121.4435305380216,"y":31.356128127694234},"right":121.5314211630216,"rightTop":{"x":121.5314211630216,"y":31.444018752694234}},"viewer":{"leftTop":{"x":0,"y":0},"top":0,"left":0,"bottom":256,"rightBottom":{"x":256,"y":256},"width":256,"right":256,"height":256},"distanceUnit":null,"minVisibleTextSize":0,"coordUnit":"DEGREE","scale":6.922909989284476E-6,"description":null,"paintBackground":false,"maxVisibleTextSize":0,"maxVisibleVertex":0,"clipRegionEnabled":false,"antialias":false,"textOrientationFixed":false,"angle":0,"prjCoordSys":{"distanceUnit":"METER","projectionParam":null,"epsgCode":4490,"coordUnit":"DEGREE","name":"GCS_China_2000","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"CGCS_2000","type":"DATUM_CHINA_2000","spheroid":{"flatten":0.003352810681182319,"name":"China_2000","axis":6378137,"type":"SPHEROID_CHINA_2000"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_China_2000","type":"GCS_CHINA_2000","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}},"minScale":0,"markerAngleFixed":false,"overlapDisplayedOptions":null,"visibleScales":[6.922909989284476E-6,1.3845819978568952E-5,2.7691639957137904E-5,5.538327991427581E-5,1.1076655982855162E-4,2.2153311965710323E-4,4.4306623931420646E-4,8.861324786284129E-4,0.0017722649572568258],"dpi":96.00000000000001,"visibleScalesEnabled":true,"customEntireBoundsEnabled":false,"clipRegion":null,"maxScale":0,"customParams":"","center":{"x":121.4874758505216,"y":31.400073440194234},"dynamicPrjCoordSyses":[{"distanceUnit":"METER","projectionParam":null,"epsgCode":4490,"coordUnit":"DEGREE","name":"GCS_China_2000","projection":null,"type":"PCS_EARTH_LONGITUDE_LATITUDE","coordSystem":{"datum":{"name":"CGCS_2000","type":"DATUM_CHINA_2000","spheroid":{"flatten":0.003352810681182319,"name":"China_2000","axis":6378137,"type":"SPHEROID_CHINA_2000"}},"unit":"DEGREE","spatialRefType":"SPATIALREF_EARTH_LONGITUDE_LATITUDE","name":"GCS_China_2000","type":"GCS_CHINA_2000","primeMeridian":{"longitudeValue":0,"name":"Greenwich","type":"PRIMEMERIDIAN_GREENWICH"}}}],"colorMode":null,"textAngleFixed":false,"overlapDisplayed":false,"userToken":{"userID":""},"cacheEnabled":false,"dynamicProjection":false,"autoAvoidEffectEnabled":true,"customEntireBounds":null,"name":"HPmap","bounds":{"top":32.283646493926526,"left":119.94836256962498,"bottom":30.516500386461946,"leftBottom":{"x":119.94836256962498,"y":30.516500386461946},"right":123.02658913141823,"rightTop":{"x":123.02658913141823,"y":32.283646493926526}},"backgroundStyle":null};
  //初始化viewer部件
  var imageryLayers = viewer.imageryLayers;
  //利用服务url创建SuperMapImageryProvider实例
  var provider;
  if (!originResult.visibleScales || originResult.visibleScales.length == 0) {
    provider = new Cesium.SuperMapImageryProvider({
      url : url
    });
  } else {
    var visibleScales = originResult.visibleScales;
    var min = findNearScale(visibleScales[0]);
    var max = findNearScale(visibleScales[visibleScales.length-1]);
    provider = new Cesium.SuperMapImageryProvider({
      url : url,
      // 设置最大缩放层级后，到了最大缩放层级，不会去后端请求数据，但是地图还可以继续放大
      maximumLevel: max,
      minimumLevel: min
    });
  }
  var imagery = imageryLayers.addImageryProvider(provider);
  imagery.alpha = 1.0;
  // imagery.rectangle = bounds;
  // 缩放到图层可见
  viewer.zoomTo(imagery);

  function findNearScale(scale) {
    // webGL3D采用固定比例尺出图，且从第一级比例尺开始。
    var indexScale = 3.3803271432053056E-9;
    var sub;
    var zoom = 0;
    for(var j = 0; j < 20; j++) {
      var temp = Math.abs(scale - indexScale);
      if(j==0) {
        sub = temp;
        indexScale = indexScale * 2;
        continue;
      }
      if(sub > temp) {
        sub = temp;
        zoom = j;
      } else {
        break;
      }
      indexScale = indexScale * 2;
    }
    return zoom;
  }
  // let layer = new Cesium.SuperMapImageryProvider({
  //   name: "123",
  //   url : "http://221.130.54.58:8091/iserver/services/map-ugcv5-HPmap/rest/maps/HPmap"  //影像服务的地址
  // });
  // viewer.imageryLayers.addImageryProvider(layer)
})
console.log("初始化3D地图")
</script>

<template>
  <div id="cesiumContainer"></div>
</template>


<style scoped lang="scss">
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>