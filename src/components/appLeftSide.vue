<template>
  <el-container >
    <el-aside width="200px">Aside</el-aside>
  </el-container>
</template>
<script>
export default {
    name:'appLeftSide'
}
</script>
<style scoped>
body > .el-container {
    margin-bottom: 40px;
    width:200px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
</style>


