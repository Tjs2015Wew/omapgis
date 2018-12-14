import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Index from '@/pages/Index.vue'
import Content from '@/pages/Content'
import cesiumViewer from '@/components/cesiumViewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'cesiumViewer',
      component: Index
    },
    {
      path: '/Content/3',
      name: 'cesiumViewer',
      component: cesiumViewer
    },
    {
      path: '/Content/2',
      // name: 'cesiumViewer',
      component: Content
    }

  ]
})
