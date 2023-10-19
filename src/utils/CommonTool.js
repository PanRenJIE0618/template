/**
 * @description 获取当前摄像机(camera)的坐标、视角
 * @param viewer
 * @returns {{heading: number, latitude: number, roll: number, pitch: number, position: Cartesian3, longitude: number, height: (*|number|Number)}}
 */
export function getPositiondirection(viewer) {
  let camera = viewer.scene.camera;
  let cartographit = Cesium.Cartographic.fromCartesian(camera.position);
  let longitude = Cesium.Math.toDegrees(cartographit.longitude);
  let latitude = Cesium.Math.toDegrees(cartographit.latitude);
  let height = cartographit.height;
  let cameraText = {
    longitude: longitude,
    latitude: latitude,
    height: height,
    heading: camera.heading,
    pitch: camera.pitch,
    roll: camera.roll,
    position: camera.position
  }
  console.log(cameraText)
  return cameraText
}

/**
 * @description 获取当前点击位置的坐标
 * @param viewer
 */
export function getClickOnThePointCoordinates(viewer) {
  let scene = viewer.scene
  let screenSpaceEventHandler;
  screenSpaceEventHandler && screenSpaceEventHandler.destroy();
  screenSpaceEventHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  screenSpaceEventHandler.setInputAction(function (e) {
    // 获取选中的S3M图层
    let pick = viewer.scene.pick(e.position);
    console.log(pick);
    let position = viewer.scene.pickPosition(e.position);
    console.log(position);
    let Cartographic = Cesium.Cartographic.fromCartesian(position);
    let longitude = Cesium.Math.toDegrees(Cartographic.longitude);
    let latitude = Cesium.Math.toDegrees(Cartographic.latitude);
    let height = Cartographic.height;
    console.log(longitude);
    console.log(latitude);
    console.log(height);
    screenSpaceEventHandler.destroy();
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

export function getWebGlInternalMemory() {
  let MaxAvailableSpace = Cesium.MemoryManager.getMaxMemory()
  let CacheSpace = Cesium.MemoryManager.getCacheSize()
  let MinRenderQuality = Cesium.MemoryManager.getMinQuality()
  console.log("可用内存的最大空间:" + MaxAvailableSpace + "MB")
  console.log("缓存空间大小:" + CacheSpace + "MB")
  console.log("最低渲染质量:" + MinRenderQuality + "%")


  // Cesium.MemoryManager.showMemoryInfo()
  // Cesium.MemoryManager.setMaxMemory(8000)
}

/**
 * @description 获取当前网页IP信息
 */
export function getLocation() {
  // let Ip = window.location.hostname
  let Ip = window.location
  console.log(Ip)
  alert(
    "hash:  " + Ip.hash + "\r" +
    "host:  " + Ip.host + "\r" +
    "hostname:  " + Ip.hostname + "\r" +
    "href:  " + Ip.href + "\r" +
    "origin:  " + Ip.origin + "\r" +
    "pathname:  " + Ip.pathname + "\r" +
    "port:  " + Ip.port + "\r" +
    "protocol:  " + Ip.protocol + "\r")
}

export function addEntity(viewer,position) {
  console.log(viewer)
  const Entity3D = {
    name: "Test",
    type:"polygon",
    polygon: {
      hierarchy: {
        positions: Cesium.Cartesian3.fromDegreesArray(position)
      },
      outline: true,
      height: 3,
      outlineColor: Cesium.Color.ORANGE,
      material: Cesium.Color.ORANGE.withAlpha(0.5)
    },
  };
  viewer.entities.add(Entity3D)
}

/**
 * @function 睡眠函数 已全局引用
 * @param time
 * @returns {*}
 */
export function sleep(time){
  return new Promise((resolve) => setTimeout(resolve, time));
}