<template>
  <div id="cesiumContainer"></div>
</template>
<!--<script src="../lib/viewerCesiumNavigationMixin.min.js"></script>-->
<script>
/* eslint-disable */
import Cesium from 'cesium/Cesium'
import widgets from 'cesium/Widgets/widgets.css'
import XYTransform from '../utils/xytransform.js'
// import '../lib/viewerCesiumNavigationMixin.min'
export default {
  name:"cesiumContainer",
  mounted () {
    this.init();
    var gcj = XYTransform.getInstance().wgs84togcj02(117,38);
    var wgs84 = XYTransform.getInstance().gcj02towgs84(117,38);
    var gcj209 = XYTransform.getInstance().gcj02tobd09(117,38);
    console.log('gcj',gcj);
    console.log('wgs84',wgs84);
    console.log('gcj209',gcj209);
    var d = Cesium.Cartesian3.distance(new Cesium.Cartesian3.fromDegrees(gcj[0], gcj[1], 0.0), new Cesium.Cartesian3.fromDegrees(gcj209[0], gcj209[1], 0.0));
    console.log('d',d);
// Cesium.viewerCesiumNavigationMixin
    // this.viewer.extend(Cesium.viewerCesiumNavigationMixin, {});
    this.trackMoving(this.viewer);
  },
  data () {
    return {
        'viewer' : {}
    }
  },
  created(){

  },
  methods:{
    init:function(){
      this.viewer = new Cesium.Viewer('cesiumContainer',{shouldAnimate: true})
      /*var imageryProvider = new Cesium.WebMapServiceImageryProvider({
        url : 'http://47.99.163.131/geoserver/gwc/service/wms',
          layers: 'smart:r4',
          parameters:{
            service:'WMS',
            version:'1.1.0',
            request:'GetMap',
            styles:'',
            format:'image/png',
          },
          tilingScheme:new Cesium.WebMercatorTilingScheme(),
      });
    var imageryProvider = new Cesium.UrlTemplateImageryProvider({
      url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",
        layer: "googleImageLayer",
        show: false
      });
      // this.viewer = new Cesium.Viewer('cesiumContainer',{imageryProvider: imageryProvider});
      var longitude = 112.46618;
      var latitude = 39.98868;
      // var longitude = 114.29713458222913;
      // var latitude = 40.61034838401561;
      var height = 50000.482961281022705;
      var heading = 0;
      var tileset = new Cesium.Cesium3DTileset({
          // url: 'http://127.0.0.1/resource/testmodel/Tileset.json',
          url: 'http://127.0.0.1/resource/20181112/Tileset.json',
          // url: 'http://127.0.0.1/resource/Production_1/Scene/Production_1.json',
          // url: 'http://127.0.0.1/resource/test/tileset.json',
          // url: 'http://127.0.0.1/resource/model/youyu/tileset.json',
          lightColor:new Cesium.Color(255, 0, 0, 0.3)
      });
      this.viewer.scene.primitives.add(tileset);
      var self = this;
      tileset.readyPromise.then(function(argument) {
          var heightOffset = -130.0;
        var boundingSphere = tileset.boundingSphere;
        var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
        var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
        var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
          viewer.flyTo(tileset);
      });
      */
    },
    trackMoving:function(viewer){

      //Set bounds of our simulation time
      var start = Cesium.JulianDate.fromDate(new Date(2018, 11, 25, 16));
      var stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());

      //Make sure viewer is at the desired time.
      viewer.clock.startTime = start.clone();
      viewer.clock.stopTime = stop.clone();
      viewer.clock.currentTime = start.clone();
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
      viewer.clock.multiplier = 10;

      //Set timeline to simulation bounds
      viewer.timeline.zoomTo(start, stop);

      //Compute the entity position property.
      var position = this.computeCirclularFlight(117, 38, 0.03,start);
      //添加显示的实体
      var entity = viewer.entities.add({
        //Set the entity availability to the same interval as the simulation time.
        availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
            start : start,
            stop : stop
        })]),

        //Use our computed positions
        position : position,

        //Automatically compute orientation based on position movement.
        orientation : new Cesium.VelocityOrientationProperty(position),

        //Load the Cesium plane model to represent the entity
        model : {
            uri : '/static/models/CesiumAir/Cesium_Air.gltf',
            minimumPixelSize : 64
        },

        // point:{
        //   color:Cesium.Color.RED,
        //   pixelSize:5
        // },

        //Show the path as a pink line sampled in 1 second increments.
        path : {
            resolution : 1,
            material : new Cesium.PolylineGlowMaterialProperty({
                glowPower : 0.1,
                color : Cesium.Color.YELLOW
            }),
            width : 10
        }
      });
      viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90)));
      // this.createParticleSystem(entity);
      // viewer.trackedEntity = entity;
    },
    computeCirclularFlight:function(lon, lat, radius,start) {
      var property = new Cesium.SampledPositionProperty();
      for (var i = 0; i <= 360; i += 45) {
          var radians = Cesium.Math.toRadians(i);
          var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
          var position = Cesium.Cartesian3.fromDegrees(lon + (radius * 1.5 * Math.cos(radians)), lat + (radius * Math.sin(radians)), Cesium.Math.nextRandomNumber() * 500 + 1750);
          property.addSample(time, position);

          //Also create a point for each sample we generate.
          this.viewer.entities.add({
              position : position,
              point : {
                  pixelSize : 8,
                  color : Cesium.Color.TRANSPARENT,
                  outlineColor : Cesium.Color.YELLOW,
                  outlineWidth : 3
              }
          });
      }
      return property;
    },
    //发射器模型矩阵
    computeEmitterModelMatrix(){
      var hpr = Cesium.HeadingPitchRoll.fromDegrees(0,0,0,new Cesium.HeadingPitchRoll());
      var trs = new Cesium.TranslationRotationScale();
      trs.translation = Cesium.Cartesian3.fromElements(2.5,4,1.0,new Cesium.Cartesian3());
      trs.roatation = Cesium.Quaternion.fromHeadingPitchRoll(hpr,new Cesium.Quaternion());
      return Cesium.Matrix4.fromTranslationRotationScale(trs,new Cesium.Matrix4());
    },
    //创建粒子系统
    createParticleSystem(entity){
      var particleSystem = this.viewer.scene.primitives.add(new Cesium.ParticleSystem({
        image:'/src/assets/fire.png',
        startScale:1.0,
        endScale:4.0,
        life:1.0,
        speed:5.0,
        width:20,
        height:20,
        rate:5.0,
        lifeTime:16.0,
        modelMatrix:this.computeModelMatrix(entity,Cesium.JulianDate.now()),
        emitterModelMatrix:this.computeEmitterModelMatrix()
      }))
    },
    computeModelMatrix(entity,time){
      var position = Cesium.Property.getValueOrUndefined(entity.position,time,new Cesium.Cartesian3());
      if(!Cesium.defined(position)){
        return undefined;
      }
      var orientation = Cesium.Property.getValueOrUndefined(entity.orientation,time,new Cesium.Quaternion());
      if(!Cesium.defined(orientation)){
        var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position,undefined,new Cesium.Matrix4());
      }else{
        modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation,new Cesium.Matrix3()),position,new Cesium.Matrix4());
      }
      return modelMatrix
    }
  },
  destroyed(){
    this.viewer.destroy();
  }
}
</script>
<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
    position: relative;
    height: 800px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>


