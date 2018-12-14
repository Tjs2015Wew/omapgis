<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <router-link to="/">首页</router-link>
    <router-link to="/Content/2">详细内容</router-link>
    <router-link to="/Content/3">3d</router-link>
    <router-view/> -->
    <div class="header-top">
      <div class="logo">
        Cesium 测试
      </div>
      <div class="top-menu">
        <el-menu
          :default-active="this.activeMenu"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#23262e"
          text-color="#fff"
          active-text-color="#ffd04b">
        　<template  v-for="(item , index) in this.list" >
        　  <el-submenu :index="item.index"  :key="index" v-if="item.children.length>0">
              <template slot="title">{{item.name}}</template>
              <template v-for="itemsub in item.children" >
                <el-submenu :index="itemsub.index"  :key="itemsub.index" v-if="itemsub.children.length>0" class="menuitem">
                  <template slot="title">{{itemsub.name}}</template>
                  <el-menu-item v-for="itemChild in itemsub.children" :index="itemChild.index" :key="itemChild.index" >
                　　{{itemChild.name}}
              　　</el-menu-item>
                </el-submenu>
                <el-menu-item :index="itemsub.index" v-else :key="itemsub.index">
                  {{itemsub.name}}
                </el-menu-item>
              </template>
            </el-submenu>
            <el-menu-item :index="item.index" v-else :key="index" class="menuitem">
              <a :href="item.link" target="_blank" v-if="item.link">
                {{item.name}}
              </a>
              <template v-else>{{item.name}}</template>
            </el-menu-item>
    　　　　</template>
        </el-menu>
      </div>
      <div class="user">
        <a href="javascript:">
          <img src="./assets/usericon.jpg" alt="">lyq
        </a>
        <a href="">退出</a>
      </div>
    </div>
    <div class="leftSide">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo left-menu"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>模型加载</span>
          </template>
          <el-menu-item-group>
            <template slot="title">分组一</template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">选项4</template>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">矢量加载</span>
        </el-menu-item>
        <el-menu-item index="3" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">相机控制</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">label显示</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="content-right">
      <component :is="flag"></component>
    </div>
    <div class="footer">@lyq-copyright 2018-11</div>
  </div>
</template>

<script>
/* eslint-disable */
import CesiumViewer from "./components/cesiumViewer";
import EchartsDemo from "./components/echartsDemo";
import MenuData from './config/menu.js'
import OlDemo from './components/oldemo'
export default {
  name: "App",
  components: {
    CesiumViewer,EchartsDemo,OlDemo
  },
  data() {
    return {
      list:MenuData.navmenu.list,
      activeMenu:'1',
      flag:'cesiumViewer'
    };
  },
  methods:{
    handleSelect:function(item){
      this.activeMenu = item;
      switch (item) {
        case '1':
          this.flag = 'cesiumViewer'
          break;
        case '2-1':
          this.flag = 'OlDemo'
          break;
        case '2-2':
          this.flag = 'EchartsDemo'
          break;

        default:
          break;
      }
      console.log(item.index);
    },
    handleOpen:function(item){
      console.log('handleOpen',item);
    },
    handleClose:function(item){
      console.log('handleClose',item);
    },
  }
};
</script>

<style lang="less">
/* 保证浏览器全屏幕显示，没有多余的白边 */
@headerHeight: 60px;
@logoWidth: 200px;
@contentPadWidth: 10px;
@footerHeight: 45px;
html,
body,
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: relative;
}
.header-top {
  background-color: #23262e;
  height: @headerHeight;
  line-height: @headerHeight;
  text-align: center;
  color: #009688;
  font-size: 16px;
  position: relative;
  .logo {
    width: @logoWidth;
    float: left;
  }
  .top-menu {
    left: @logoWidth;
    padding: 0 24px;
    position: absolute;
    .menuitem:hover{
      // border-bottom:solid 5px #5FB878 !important;
    }
  }
  .user{
    position: absolute !important;
    right: 0px;
    top: 0px;
    padding: 0 20px;
    a{
      display: inline-block;
      color: rgb(218, 213, 213);
      text-decoration:none;
      padding: 0 5px;
      font: 0.8em sans-serif;
      img{
        vertical-align: middle;
        width: 30px;
        height: 30px;
        margin-right: 10px;
        border-radius: 50%;
      }
    }
    a:hover{
      color: #fff;
    }
  }
}
.leftSide {
  background-color: #2c3e50;
  height: 100%;
  width: @logoWidth;
  color: #fff;
  float: left;
  position: relative;
  .left-menu {
    height: 100%;
    border-right: none !important;
  }
}
.content-right {
  padding: @contentPadWidth;
  // background-color: rgba(214, 203, 173, 0.096);
  background-color: #000;
  width: calc(100% - @logoWidth - 2 * @contentPadWidth);
  height: calc(100% - @headerHeight - @footerHeight - 2 * @contentPadWidth);
  right: 0px;
  top: 0px;
  float: right;
  position: relative;
}
.footer {
  height: @footerHeight;
  width: calc(100% - @logoWidth);
  right: 0;
  background-color: #eee;
  line-height: @footerHeight;
  text-align: center;
  color: #000;
  float: right;
  position: relative;
}
</style>
