<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
      <el-table :data="tableData" style="width: 100%" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
      {{scope.row}}
        </template>
      </el-table-column>
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="280"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="280"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="ShowEdit(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="DeleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-s-tools">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="30%">
      <!-- 内容 -->
      <el-form :model="addRolesForm" :rules="addRolesRules" ref="addRolesRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles()">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加修改对话框 -->
    <el-dialog title="编辑角色" :visible.sync="EditdialogVisible" width="30%">
      <!-- 内容 -->
      <el-form :model="EditConForm" :rules="addRolesRules" ref="EditFromRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="EditConForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="EditConForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditRoles()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { async } from 'q'
export default {
  data() {
    
    return {
      tableData: [],
      dialogVisible: false,
      EditdialogVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      //添加角色验证规则对象
      addRolesRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '请输入用户名在1-10字符之间',
            trigger: 'blur'
          }
        ]
      },
      //通过id获取用户名和描述
      EditConForm: {}
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return
      } else {
        this.tableData = res.data
      }
    },
    //点击确定按钮预校验，添加角色
    addRoles() {
      this.$refs.addRolesRef.validate(async valid => {
        console.log(valid)
        if (!valid) {
          return
        } else {
          //可以发起添加角色的请求
          const { data: res } = await this.$http.post(
            'roles',
            this.addRolesForm
          )
          console.log(res)
          if (res.meta.status !== 201) {
            return this.$message.error('添加角色失败')
          } else {
            this.$message.success(res.meta.msg)
            this.dialogVisible = false
            this.getTableData()
          }
        }
      })
    },
    //点击修改按钮显示默认信息
    async ShowEdit(id) {
      this.EditdialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      console.log('查询此行角色信息为' + res)
      if (res.meta.status !== 200) {
        return
      } else {
        this.EditConForm = res.data
      }
    },
    //提交修改角色信息
    EditRoles() {
      this.$refs.EditFromRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('提交失败')
        } else {
          const { data: res } = await this.$http.put(
            'roles/' + this.EditConForm.roleId,
            {
              roleName: this.EditConForm.roleName,
              roleDesc: this.EditConForm.roleDesc
            }
          )
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('提交失败')
          } else {
            this.$message.success('提交成功')
            this.EditdialogVisible = false
            this.getTableData()
          }
        }
      })
    },
 async   DeleteRole(id) {
      const res =await  this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      console.log('res的值为:'+res);
      if(res!=='confirm'){
        return this.$message.info('已取消删除')
      }
      else{
      const {data:res2}= await this.$http.delete('roles/'+id);
      console.log(res);
      if(res2.meta.status!==200){
        return this.$message.error('删除失败')
      }
      else{
        this.$message.success('删除成功');
        this.getTableData();
      }
      }
    }
  }
}
</script>
<style scoped>
.el-button {
  margin-bottom: 10px;
}
</style>
