<template>
  <div>
    <div class="toggle-button" @click="toggle">|||</div>
    <el-menu
      :default-active="activePath"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      ref="menuForm"
      unique-opened
      :collapse="zhankai"
      router
    >
      <!-- router启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
      <!-- 一级导航 -->
      <el-submenu v-for="item in menuList" :key="item.id" :index="item.id+''" uniqueOpened>
        <template slot="title">
          <i :class="iconList[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级导航 -->
        <el-menu-item
          :index="'/'+item.path+''"
          v-for="item in item.children"
          :key="item.id"
          @click="saveNavState('/'+item.path)"
        >
          <i class="el-icon-menu"></i>
          <span slot="title">{{item.authName}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-shangpin',
        '101': 'iconfont icon-danju',
        '102': 'iconfont icon-tijikongjian',
        '145': 'iconfont icon-baobiao'
      },
      zhankai: false,
      activePath:""
    }
  },
  created() {
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem('activePath')
  },

  methods: {
    //获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      else this.menuList = res.data
      console.log(this.menuList)
    },
    //点击按钮切换折叠与展开
    toggle() {
      this.zhankai = !this.zhankai
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath) ;
      //键值对
      this.activePath=activePath
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
<style lang="less" scoped>
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: 0px;
}
.toggle-button {
  text-align: center;
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
