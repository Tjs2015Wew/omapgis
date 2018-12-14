/*eslint-disable*/
//坐标转换工具
class XYTransform{
  constructor(){
    //定义一些常量
    this.x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    this.PI = 3.1415926535897932384626;
    this.a = 6378245.0;
    this.ee = 0.00669342162296594323;
  }
  static getInstance(){
    if(!XYTransform.instance){
      XYTransform.instance = new XYTransform();
    }
    return XYTransform.instance;
  }
  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
   * 即 百度 转 谷歌、高德
   * @param bd_lon
   * @param bd_lat
   * @returns {*[]}
   */
  bd09togcj02(bd_lon, bd_lat) {
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
  gcj02tobd09(lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * this.x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * this.x_PI);
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
  wgs84togcj02(lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    }
    else {
        var dlat = transformlat(lng - 105.0, lat - 35.0,this.PI);
        var dlng = transformlng(lng - 105.0, lat - 35.0,this.PI);
        var radlat = lat / 180.0 * this.PI;
        var magic = Math.sin(radlat);
        magic = 1 - this.ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
        dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
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
  gcj02towgs84(lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    }
    else {
        var dlat = transformlat(lng - 105.0, lat - 35.0,this.PI);
        var dlng = transformlng(lng - 105.0, lat - 35.0,this.PI);
        var radlat = lat / 180.0 * this.PI;
        var magic = Math.sin(radlat);
        magic = 1 - this.ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
        dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat]
    }
  }
}
//维度转换
function transformlat(lng, lat,PI) {
  var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
  ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
  return ret
}
//经度转换
function transformlng(lng, lat,PI) {
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

export default XYTransform;
