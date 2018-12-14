<template>
  <div class="ec-demo" id="ec-demo">
  </div>
</template>
<script>
/* eslint-disable */
export default {
  name:'EchartsDemo',
  data(){
    return {
      chart:{}
    }
  },
  mounted(){
    this.initDemo()
  },
  methods:{
    initDemo:function(){
      this.chart = this.$echarts.init(document.getElementById('ec-demo'));
      var option = {
          tooltip: {
              show: true
          },
          legend: {
              data:['销量']
          },
          xAxis : [
              {
                  type : 'category',
                  data : ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
              }
          ],
          yAxis : [
              {
                  type : 'value'
              }
          ],
          series : [
              {
                  "name":"销量",
                  "type":"bar",
                  "data":[5, 20, 40, 10, 10, 20]
              }
          ],
      };

      // 为echarts对象加载数据
      this.chart.setOption(option);
      const self = this;
      window.onresize = self.chart.resize;
    }
  },
  destroyed(){
    this.chart.clear();
  }
}
</script>
<style lang="less">
.ec-demo{
  position: relative;
  width: 100%;
  height: 100%;
  background-color: antiquewhite;
  padding: 1px;
}
</style>

