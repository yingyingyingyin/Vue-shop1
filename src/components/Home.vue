<template>
  <el-container class="HomeCon">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="outlog">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <NavLeft/>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import NavLeft from '@/components/NavLeft'
export default {
  components:{
    NavLeft
  },
  methods: {
    outlog() {
      //退出登录
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style  scoped lang="less">
.HomeCon {
  height: 100%;
}
.el-header {
  background-color: #373d37;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  color: aliceblue;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  button {
    height: 70%;
  }
}

.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>
