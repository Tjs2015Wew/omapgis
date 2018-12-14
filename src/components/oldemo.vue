<template>
  <div class="mainmap" id="mainmap">

  </div>
</template>
<script>
/**eslint-disable */
export default {
  name:'olMap',
  data(){
    return {
      olMap:{}
    }
  },
  mounted(){
    var ol = this.$ol;
    this.olMap = new ol.Map({
      target: 'mainmap',
      view: new ol.View({
        center: ol.proj.fromLonLat([108.532, 34.145]),
        zoom:5,
        minZoom:3
      }),
      controls: [

      ]

    });
    var l1 = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: "http://t3.tianditu.com/DataServer?T=cta_w&x={x}&y={y}&l={z}"// 注记
      })
    });
    var l2 = new ol.layer.Tile({
      source: new ol.source.XYZ({
        // url: "http://t3.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"  // 行政区划
        // url: "http://www.google.cn/maps/vt?lyrs=s@804&gl=cn&x={x}&y={y}&z={z}"  // 行政区划
        url: "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali"  // 行政区划

      })
    });
    this.olMap.addLayer(l2);
    this.olMap.addLayer(l1);
  },
  destroyed(){

  }
}
</script>
<style lang="less">
.mainmap{
  height: 100%;
  width: 100%;
}
</style>


