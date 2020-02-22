<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="Right_Card">
      <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="280"></el-table-column>
        <el-table-column prop="path" label="路径" width="260"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
             <el-tag  type="" v-if="scope.row.level==='0'">一级</el-tag>
             <el-tag  type="success" v-if="scope.row.level==='1'">二级</el-tag>
             <el-tag  type="warning" v-if="scope.row.level==='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { async } from 'q'
export default {
  data() {
    return{
      tableData: []

    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      } else {
        this.tableData=res.data;
      }
    }
  }
}
</script>
<style scoped>
.Right_Card {
  margin-top: 15px;
}
</style>
