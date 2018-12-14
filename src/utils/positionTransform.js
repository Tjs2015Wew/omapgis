/*eslint-disable*/
class PositionTrans{
  constructor(){

  }

}
/*
1.坐标系
new Cesium.Cartesian2(1,1) //表示一个二维笛卡尔坐标系，也就是直角坐标系（屏幕坐标系）
new Cesium.Cartesian3(1,1,1) //表示一个三维笛卡尔坐标系，也是直角坐标系(就是真实世界的坐标系)
2.二维到三维坐标系的转换
var pick1= scene.globe.pick(viewer.camera.getPickRay(pt1), scene) //其中pt1为一个二维屏幕坐标
3.三维坐标到地理坐标的转换
var geoPt1= scene.globe.ellipsoid.cartesianToCartographic(pick1) //其中pick1是一个Cesium.Cartesian3对象。
4.地理坐标到经纬度坐标的转换
var point1=[geoPt1.longitude / Math.PI * 180,geoPt1.latitude / Math.PI * 180]; //其中geoPt1是一个地理坐标。
5.经纬度坐标转地理坐标（弧度）
var cartographic = Cesium.Cartographic.fromDegree(point) //point是经纬度值
var coord_wgs84 = Cesium.Cartographic.fromDegrees(lng, lat, alt);//单位：度，度，米
6.经纬度坐标转世界坐标
var cartesian = Cesium.Cartesian3.fromDegree(point)
7.计算两个三维坐标系之间的距离
var d = Cesium.Cartesian3.distance(
    new Cesium.Cartesian3(pick1.x, pick1.y, pick1.z),
    new Cesium.Cartesian3(pick3.x, pick3.y, pick3.z)
); //pick1、pick3都是三维坐标系
*/

//////////////////////////////////////////////////////////////////


//定义一些常量
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var PI = 3.1415926535897932384626;
var a = 6378245.0;
var ee = 0.00669342162296594323;

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bd_lon
 * @param bd_lat
 * @returns {*[]}
 */
function bd09togcj02(bd_lon, bd_lat) {
  var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  var x = bd_lon - 0.0065;
  var y = bd_lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  var gg_lng = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return [gg_lng, gg_lat]
}

/**
* 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
* 即谷歌、高德 转 百度
* @param lng
* @param lat
* @returns {*[]}
*/
function gcj02tobd09(lng, lat) {
  var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
  var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return [bd_lng, bd_lat]
}

/**
* WGS84转GCj02
* @param lng
* @param lat
* @returns {*[]}
*/
function wgs84togcj02(lng, lat) {
  if (out_of_china(lng, lat)) {
      return [lng, lat]
  }
  else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = lat / 180.0 * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
      var mglat = lat + dlat;
      var mglng = lng + dlng;
      return [mglng, mglat]
  }
}

/**
* GCJ02 转换为 WGS84
* @param lng
* @param lat
* @returns {*[]}
*/
function gcj02towgs84(lng, lat) {
  if (out_of_china(lng, lat)) {
      return [lng, lat]
  }
  else {
      var dlat = transformlat(lng - 105.0, lat - 35.0);
      var dlng = transformlng(lng - 105.0, lat - 35.0);
      var radlat = lat / 180.0 * PI;
      var magic = Math.sin(radlat);
      magic = 1 - ee * magic * magic;
      var sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
      dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
      mglat = lat + dlat;
      mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat]
  }
}

function transformlat(lng, lat) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret
}

function transformlng(lng, lat) {
  var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
  return ret
}

/**
* 判断是否在国内，不在国内则不做偏移
* @param lng
* @param lat
* @returns {boolean}
*/
function out_of_china(lng, lat) {
  return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
}



//////////////////////////////////////////////////////////////////////









