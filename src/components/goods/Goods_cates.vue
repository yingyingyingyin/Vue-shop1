<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="dialogVisible = true">添加分类</el-button>
      <el-table :data="GoodsTableData" style="width: 100%" border stripe>
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="280"></el-table-column>
        <el-table-column prop="roleDesc" label="是否有效" width="280"></el-table-column>
        <el-table-column prop="cat_level" label="排序" width="280"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //商品分类的数据列表
      GoodsTableData: [
        {
          cat_id: '',
          cat_name: '',
          cat_pid: '',
          cat_level: '',
          cat_deleted: ''
        }
      ]
    }
  },
  created() {
    this.getCatData()
  },
  methods: {
    async getCatData() {
      const { data: res } = await this.$http.get('/categories');
      console.log(res);
      if(res.meta.status!==200){
        return
      }
      else{
        this.GoodsTableData=res.data;
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>

