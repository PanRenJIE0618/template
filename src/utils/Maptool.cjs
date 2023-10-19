
let tooltip = createTooltip(document.body);
tooltip.setVisible(false);

class Maptools {
  constructor() {
    //测量结果集合
    this.DrawingResult = [];
    //可视域分析结果对象
    this.viewshed3DList = "";
    //可视域分析点位对象
    this.pointHandler = "";
    //地形开挖结果对象
    this.Topographic = {};
    //地形开挖 抽出显示结果对象
    this.TopographicDrawOut = {};
    //填挖方分析对象
    this.CutAnalysis = {};
    //Box裁剪 交互模式
    this.editorBox;
    this.BoxTailor;
    //Viewr部件
    this.viewer = {};
    //天际线分析对象
    this.skyline = {};
  }

  /***
   * @function measuringdistance
   * @description 测量距离
   * @param viewer {Object} 部件
   */
  measuringdistance(viewer) {
    console.log("测量距离")
    let handlerDis = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Distance);
    // 注册测距功能事件
    handlerDis.measureEvt.addEventListener(function (result) {
      const dis = Number(result.distance)
      const distance = dis > 1000 ? (dis / 1000).toFixed(2) + "km" : dis.toFixed(2) + "m"
      handlerDis.disLabel.text = "距离:" + distance;
    });
    handlerDis && handlerDis.activate();
    this.DrawingResult.push(handlerDis);
  }

  /***
   * @function measuringheight
   * @description 测量高度
   * @param viewer {Object} 部件
   */
  measuringheight(viewer) {
    const handlerHeight = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH)
    // 注册测距功能事件
    handlerHeight.measureEvt.addEventListener(function (result) {
      const distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + "km" : (result.distance * 1).toFixed(2) + "m"
      const vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + "km" : (result.verticalHeight * 1).toFixed(2) + "m"
      const hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + "km" : (result.horizontalDistance * 1).toFixed(2) + "m"
      handlerHeight.disLabel.text = "空间距离:" + distance;
      handlerHeight.vLabel.text = "垂直高度:" + vHeight;
      handlerHeight.hLabel.text = "水平距离:" + hDistance;
    });
    handlerHeight.activeEvt.addEventListener(function (isActive) {
      if (isActive == true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = "";
      } else {
        viewer.enableCursorStyle = true;
      }
    });
    handlerHeight && handlerHeight.activate();
    this.DrawingResult.push(handlerHeight);
  }

  /***
   * @function measuringArea
   * @description 测量面积
   * @param viewer {Object} 部件
   */
  measuringArea(viewer) {
    const handlerArea = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Area, Cesium.ClampMode.Ground)
    // 注册测距功能事件
    handlerArea.measureEvt.addEventListener(function (result) {
      const area = result.area > 1000000 ? (result.area / 1000000).toFixed(2) + 'km²' : (result.area * 1).toFixed(2) + '㎡'
      handlerArea.areaLabel.text = '面积:' + area;
    });
    // handlerArea.activeEvt.addEventListener(function(isActive) {
    //   if (isActive == true) {
    //     viewer.enableCursorStyle = false;
    //     viewer._element.style.cursor = "";
    //   } else {
    //     viewer.enableCursorStyle = true;
    //   }
    // });
    handlerArea && handlerArea.activate();
    this.DrawingResult.push(handlerArea);
  }

  /***
   * @function Visibleanalysis
   * @description 可视域分析
   * @param viewer {Object} 部件
   * @constructor
   */
  Visibleanalysis(viewer) {
    const _that = this
    if (this.viewshed3DList != "") {
      this.viewer.scene.viewFlag = true;
      this.pointHandler.clear();
      this.viewshed3DList.distance = 0.1;
    }
    this.viewer = viewer;
    const scene = viewer.scene
    let viewPosition
    if (!scene.pickPositionSupported) {
      alert("不支持深度纹理,可视域分析功能无法使用（无法添加观测）！");
    }
    // 先将此标记置为true，不激活鼠标移动事件中对可视域分析对象的操作
    scene.viewFlag = true;
    // 创建点位对象
    const pointHandler = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Point)
    // 创建可视域分析对象
    this.viewshed3DList = new Cesium.ViewShed3D(scene);
    //可视域分析对象属性
    const viewModel = {
      direction: 1.0,
      pitch: 1.0,
      distance: 1.0,
      verticalFov: 1.0,
      horizontalFov: 1.0,
    }
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    handler.setInputAction(function (e) {
      //鼠标右键事件回调，不再执行鼠标移动事件中对可视域的操作
      scene.viewFlag = true;
      viewModel.direction = _that.viewshed3DList.direction;
      viewModel.pitch = _that.viewshed3DList.pitch;
      viewModel.distance = _that.viewshed3DList.distance;
      viewModel.horizontalFov = _that.viewshed3DList.horizontalFov;
      viewModel.verticalFov = _that.viewshed3DList.verticalFov;
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    //激活绘制点类
    pointHandler.activate();
    pointHandler.drawEvt.addEventListener(function (result) {
      const point = result.object
      const position = point.position
      viewPosition = position;
      // 将获取的点的位置转化成经纬度
      const cartographic = Cesium.Cartographic.fromCartesian(position)
      const longitude = Cesium.Math.toDegrees(cartographic.longitude)
      const latitude = Cesium.Math.toDegrees(cartographic.latitude)
      const height = cartographic.height + 1.8
      point.position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
      if (scene.viewFlag) {
        // 设置视口位置
        _that.viewshed3DList.viewPosition = [longitude, latitude, height];
        _that.viewshed3DList.build();
        // 将标记置为false以激活鼠标移动回调里面的设置可视域操作
        scene.viewFlag = false;
      }
    });
    // 鼠标移动时间回调
    handler.setInputAction(function (e) {
      // 若此标记为false，则激活对可视域分析对象的操作
      if (!scene.viewFlag) {
        //获取鼠标屏幕坐标,并将其转化成笛卡尔坐标
        const position = e.endPosition
        const last = scene.pickPosition(position)
        //计算该点与视口位置点坐标的距离
        const distance = Cesium.Cartesian3.distance(viewPosition, last)
        if (distance > 0) {
          // 将鼠标当前点坐标转化成经纬度
          const cartographic = Cesium.Cartographic.fromCartesian(last)
          const longitude = Cesium.Math.toDegrees(cartographic.longitude)
          const latitude = Cesium.Math.toDegrees(cartographic.latitude)
          const height = cartographic.height
          // 通过该点设置可视域分析对象的距离及方向
          _that.viewshed3DList.setDistDirByPoint([longitude, latitude, height]);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.pointHandler = pointHandler;
  }

  /***
   * @function skylineanalysis
   * @description 天际线分析
   * @param viewer {Object} 部件
   */
  skylineanalysis(viewer) {
    let scene = viewer.scene;
    // this.skyline && this.skyline.clear()
    try {
      this.skyline.clear();
      console.log("抛出")
    } catch (err) {

    }
    this.skyline = new Cesium.Skyline(scene);//创建天际线分析对象
    let cartographic = scene.camera.positionCartographic;
    let longitude = Cesium.Math.toDegrees(cartographic.longitude);
    let latitude = Cesium.Math.toDegrees(cartographic.latitude);
    let height = cartographic.height;
    //天际线分析的视口位置设置成当前相机位置
    this.skyline.viewPosition = [longitude, latitude, height];
    //设置俯仰和方向
    this.skyline.pitch = Cesium.Math.toDegrees(scene.camera.pitch);
    this.skyline.direction = Cesium.Math.toDegrees(scene.camera.heading);
    this.skyline.radius = 10000; // 天际线分析半径设置为10000米
    this.skyline.build();
  }

  /***
   * @function panorama
   * @description 回归初始化视角
   * @param viewer {Object} 部件
   * @param position {Object} 坐标
   * @param Directional {Object} 方向角度
   */
  panorama(viewer, position, Directional) {
    viewer.camera.setView({
      destination: new Cesium.Cartesian3(position.longitude, position.latitude, position.height),
      orientation: {
        heading: Directional.heading,
        pitch: Directional.pitch,
        roll: Directional.roll
      }
    });
  }

  /**
   * @description 地形开挖
   * @param viewer
   */
  TopographicExcavation(viewer) {
    let height = prompt("请输入高度")
    if (height === null) {
      return
    }
    //地形开挖
    let handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, Cesium.ClampMode.Ground);
    handlerPolygon.activeEvt.addEventListener(function (isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false;
      } else {
        viewer.enableCursorStyle = true;
        tooltip.setVisible(false);
      }
    });
    handlerPolygon.movingEvt.addEventListener(function (windowPosition) {
      if (handlerPolygon.isDrawing) {
        tooltip.showAt(windowPosition, '<p>点击确定开挖区域中间点</p><p>右键单击结束绘制,进行开挖</p>');
      } else {
        tooltip.showAt(windowPosition, '<p>点击绘制开挖区域第一个点</p>');
      }
    });
    handlerPolygon.drawEvt.addEventListener(function (result) {
      if (!result.object.positions) {
        tooltip.showAt(result, '<p>请绘制正确的多边形</p>');
        handlerPolygon.polygon.show = false;
        handlerPolygon.polyline.show = false;
        handlerPolygon.deactivate();
        handlerPolygon.activate();
        return;
      }
      let array = [].concat(result.object.positions);
      tooltip.setVisible(false);
      let positions = [];
      for (let i = 0, len = array.length; i < len; i++) {
        let cartographic = Cesium.Cartographic.fromCartesian(array[i]);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let h = cartographic.height;
        if (positions.indexOf(longitude) == -1 && positions.indexOf(latitude) == -1) {
          positions.push(longitude);
          positions.push(latitude);
          positions.push(h);
        }
      }
      viewer.scene.globe.removeAllExcavationRegion();
      viewer.scene.globe.addExcavationRegion({
        name: 'ggg',
        position: positions,
        height: height,
        transparent: false
      });
      let region = []
      region.push(positions)
      viewer.scene.layers.layerQueue.forEach((item) => {
        item.setModifyRegions(region, Cesium.ModifyRegionMode.CLIP_INSIDE);
      })
      handlerPolygon.polygon.show = false;
      handlerPolygon.polyline.show = false;
      handlerPolygon.deactivate();

    });
    handlerPolygon.activate();
    this.Topographic = handlerPolygon
  }

  /**
   * @description 地形开挖 抽出显示
   * @param viewer
   */
  TopographicExcavationDrawOut(viewer) {
    let height = prompt("请输入高度")
    if (height === null) {
      return
    }
    //地形开挖
    let handlerPolygon = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, Cesium.ClampMode.Ground);
    handlerPolygon.activeEvt.addEventListener(function (isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false;
      } else {
        viewer.enableCursorStyle = true;
        tooltip.setVisible(false);
      }
    });
    handlerPolygon.movingEvt.addEventListener(function (windowPosition) {
      if (handlerPolygon.isDrawing) {
        tooltip.showAt(windowPosition, '<p>点击确定开挖区域中间点</p><p>右键单击结束绘制,进行开挖</p>');
      } else {
        tooltip.showAt(windowPosition, '<p>点击绘制开挖区域第一个点</p>');
      }
    });
    handlerPolygon.drawEvt.addEventListener(function (result) {
      let array = [].concat(result.object.positions);
      let positions = [];
      for (let i = 0; i < array.length; i++) {
        let cartographic = Cesium.Cartographic.fromCartesian(array[i]);
        let lon = Cesium.Math.toDegrees(cartographic.longitude);
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let h = cartographic.height;
        positions = positions.concat([lon, lat, h]);
      }
      viewer.scene.globe.removeAllExtractRegion();
      viewer.scene.globe.addExtractRegion({
        name: 'extract',
        position: positions,
        height: Number(height),
        extractHeight: 300,
        transparent: false,
        granularity: 1 //精度
      });
      handlerPolygon.clear();
      handlerPolygon.deactivate();
    });
    handlerPolygon.activate();
  }

  /**
   * @description BOX裁剪 交互模式
   * @constructor
   */
  BoxTailorInteraction(viewer) {
    let layers = viewer.scene.layers.layerQueue

    function setClipBox() {
      let clipMode = "clip_behind_all_plane";
      if (typeof (boxEntity) == "undefined") {
        return;
      }
      let newDim = boxEntity.box.dimensions.getValue();
      let position = boxEntity.position.getValue(0);

      let heading = 0;
      if (typeof (boxEntity.orientation) != "undefined") {
        let rotationM3 = Cesium.Matrix3.fromQuaternion(boxEntity.orientation._value, new Cesium.Matrix3());
        let localFrame = Cesium.Matrix4.fromRotationTranslation(rotationM3, Cesium.Cartesian3.ZERO, new Cesium.Matrix4());
        let inverse = Cesium.Matrix4.inverse(Cesium.Transforms.eastNorthUpToFixedFrame(position), new Cesium.Matrix4());
        let hprm = Cesium.Matrix4.multiply(inverse, localFrame, new Cesium.Matrix4());
        var rotation = Cesium.Matrix4.getMatrix3(hprm, new Cesium.Matrix3());
        let hpr = Cesium.HeadingPitchRoll.fromQuaternion(Cesium.Quaternion.fromRotationMatrix(rotation));
        heading = hpr.heading;
      }
      let boxOptions = {
        dimensions: newDim,
        position: position,
        clipMode: clipMode,
        heading: heading
      };
      setAllLayersClipOptions(boxOptions);
    }

    function setAllLayersClipOptions(boxOptions) {
      for (var i = 0, j = layers.length; i < j; i++) {
        layers[i].setCustomClipBox(boxOptions);
      }
    }

    let tooltip = createTooltip(document.body);
    let boxEntity = undefined;
    //交互绘制box
    this.BoxTailor = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Box);
    let _that = this
    this.BoxTailor.activeEvt.addEventListener(function (isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false;
      } else {
        viewer.enableCursorStyle = true;
        tooltip.setVisible(false);
      }
    });
    this.BoxTailor.movingEvt.addEventListener(function (windowPosition) {
      if (_that.BoxTailor.isDrawing) {
        tooltip.showAt(windowPosition, '<p>点击鼠标左键结束矩形绘制，移动鼠标绘制box高度。</p><p>右键结束绘制.</p>');
      } else {
        tooltip.showAt(windowPosition, '<p>点击鼠标左键，开始绘制矩形作为box底面</p>');
      }

    });
    this.BoxTailor.drawEvt.addEventListener(function (e) {
      boxEntity = e.object;
      let newDim = boxEntity.box.dimensions.getValue();
      let position = boxEntity.position.getValue(0);
      let boxOption = {
        dimensions: newDim,
        position: position,
        clipMode: "clip_behind_all_plane",
        heading: 0
      };

      //box编辑
      _that.editorBox = new Cesium.BoxEditor(viewer, boxEntity);
      _that.editorBox.editEvt.addEventListener(function (e) {
        boxEntity.box.dimensions = e.dimensions
        boxEntity.position = e.position;
        boxEntity.orientation = e.orientation;
        setClipBox();
      });
      _that.editorBox.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0, 950);
      _that.editorBox.activate();
      tooltip.setVisible(false);
      // setAllLayersClipOptions(boxOption);
      try {
        setAllLayersClipOptions(boxOption);
      } catch (err) {
        _that.editorBox.destroy()
        _that.editorBox.deactivate()
        alert("当前范围内不存在图层")
      }
      _that.BoxTailor.clear();
      _that.BoxTailor.deactivate();
    });
    this.BoxTailor.activate();
  }

  /**
   * @description 控制帧数的显示
   * @param viewer
   */
  ShowFrameNumber(viewer) {
    viewer.scene.debugShowFramesPerSecond = viewer.scene.debugShowFramesPerSecond === true ? false : true
    // viewer.scene.debugShowFramesPerSecond = true; //帧率
  }

  /**
   * @description 填挖方分析
   * @param viewer
   */
  FillCutAnalysis(viewer) {
    this.CutAnalysis = new Cesium.DrawHandler(viewer, Cesium.DrawMode.Polygon, 0);
    let _that = this
    this.CutAnalysis.activeEvt.addEventListener(function (isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false;
      } else {
        viewer.enableCursorStyle = true;
        tooltip.setVisible(false);
      }
    });
    this.CutAnalysis.movingEvt.addEventListener(function (windowPosition) {
      if (_that.CutAnalysis.isDrawing) {
        tooltip.showAt(windowPosition, '<p>点击确定多边形中间点</p><p>右键单击结束绘制</p>');
      } else {
        tooltip.showAt(windowPosition, '<p>点击绘制第一个点</p>');
      }
    });
    this.CutAnalysis.drawEvt.addEventListener(function (result) {
      _that.CutAnalysis.polygon.show = false;
      // handlerPolygon.polyline.show = false;
      _that.CutAnalysis.deactivate();
      tooltip.setVisible(false);
      let dep = 5000
      let array = [].concat(result.object.positions);
      let positions = [];
      let positionsii = [];
      for (let i = 0, len = array.length; i < len; i++) {
        let cartographic = Cesium.Cartographic.fromCartesian(array[i]);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let h = cartographic.height;
        if (positions.indexOf(longitude) === -1 && positions.indexOf(latitude) === -1) {
          positions.push(longitude);
          positions.push(latitude);
          positions.push(parseInt(dep));
          positionsii.push({
            x: longitude,
            y: latitude
          });
        }
      }

      //此处用的地形修改 而不是地形开挖
      viewer.scene.globe.removeAllModifyRegion();
      viewer.scene.globe.addModifyRegion({
        name: 'ggg',
        position: positions
      });

      let length = [];
      length.push(positionsii.length);
      //需要在此 动态构造一个 REGION类型的对象
      let geometry = {
        "id": 23,
        "parts": length,
        "points": positionsii,
        "style": null,
        "type": "REGION"
      };
      let queryObj = {
        "cutFillType": "REGIONANDALTITUDE",
        "baseAltitude": dep,
        "region": geometry,
        "resultDataset": "result",
        "buildPyramid": true,
        "deleteExistResultDataset": true
      };
      let queryObjJSON = JSON.stringify(queryObj);
      // try {
      //   getFillExcavationData(queryObjJSON).then((res) => {
      //     console.log(res)
      //     if (res.status == null) {
      //       alert("当前开挖区域不存在地形，请在地形图层上操作")
      //     }
      //   })
      // } catch (err) {
      //   alert("服务不存在,此功能为本地测试地形图层使用")
      // }
    });
    _that.CutAnalysis.activate();
  }

  /**
   * @description 日照效果
   * @param viewer
   */
  SunshineEffect(viewer) {
    let startTime = new Date()
    let shour = 8
    let ehour = 18
    let nTimer = 0.0;
    let nIntervId = setInterval(function () {
      if (shour < ehour) {
        startTime.setHours(shour);
        startTime.setMinutes(nTimer);
        viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime);
        nTimer += 10.0;
        if (nTimer > 60.0) {
          shour += 1.0;
          nTimer = 0.0;
        }
      } else {
        clearInterval(nIntervId);
      }
    }, 20);
  }

  /***
   * @function clear
   * @description 清除所有绘制效果
   */
  clear(viewer) {
    this.viewer = viewer;
    tooltip.setVisible(false);
    try {
      this.BoxTailor.clear();
      this.BoxTailor.deactivate();
    } catch (err) {
    }
    try {
      this.CutAnalysis.deactivate()
    } catch (err) {
    }
    viewer.scene.globe.removeAllExcavationRegion();
    viewer.scene.globe.removeAllExtractRegion();
    viewer.scene.globe.removeAllModifyRegion();
    viewer.scene.layers.layerQueue.forEach((item) => {
      item.clearModifyRegions();
    })
    if (this.editorBox !== "") {
      for (var i = 0, j = viewer.scene.layers.layerQueue.length; i < j; i++) {
        viewer.scene.layers.layerQueue[i].clearCustomClipBox();
      }
      try {
        this.editorBox.destroy()
        this.editorBox.deactivate()
      } catch (err) {
      }
    }
    if (this.DrawingResult.length !== 0) {
      this.DrawingResult.filter((i) => i.clear());
      this.DrawingResult = [];
    }

    if (this.skyline.viewPosition !== undefined) {
      this.skyline.clear();
      this.skyline = {};
    }
    if (this.viewshed3DList.viewPosition !== undefined) {
      this.viewer.scene.viewFlag = true;
      this.viewshed3DList.distance = 0.1;
      this.viewshed3DList = new Cesium.ViewShed3D(this.viewer.scene);
      this.pointHandler.clear();
      this.viewshed3DList = "";
    }
  }
}

export default {
  Maptools
};