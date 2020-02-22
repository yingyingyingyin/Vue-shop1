<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model=" queryinfo.query" clearable @clear="getUserList()">
            <!-- 双向绑定queryinfo.query获取关键词，用点击调用getUserList -->
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="add_user" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table ref="singleTable" :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" width="90"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="160"></el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <!-- scope slot可以获取(每一行row的userList数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="ShowEditDialog(scope.row.id)"
              circle
            ></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="open(scope.row.id)"></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="角色分配"
              placement="top"
              :enterable="false"
            >
              <!-- 角色分配按钮 -->
              <el-button type="warning" icon="el-icon-star-off" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底边分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[2,1,5,10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="addruleForm" :rules="addrules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { async } from 'q'
export default {
  data() {
    //验证邮箱自定义规则
    let checkEmail = (rule, value, cb) => {
      //验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9])/
      if (regEmail.test(value)) {
        return cb()
      } else {
        cb(new Error('请输入合法的邮箱'))
      }
    }
    //验证手机的正则表达式
    let checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[168]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      } else {
        cb(new Error('请输入合法的手机号码'))
      }
    }
    return {
      input3: '',
      queryinfo: {
        //获取当前用户列表的参数对象
        query: '',
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条
        pagesize: 2
      },
      userList: [],
      total: 0,
      addDialogVisible: false, //添加用户对话框初始隐藏
      editDialogVisible: false, //修改用户对话框初始隐藏
      //添加用户的表单数据
      addruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加表单的验证规则对象
      addrules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '请输入用户名在3-10字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 13,
            message: '请输入密码在6-13个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: false,
            message: '请输入您的邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: false,
            message: '请输入您的手机号码',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      //修改表单的验证规则对象
      editRules: {
        email: [
          {
            required: true,
            message: '请输入您的邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入您的手机号码',
            trigger: 'blur'
          },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      //查询到的用户信息对象
      editForm: {}
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryinfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(this.userList)
    },
    // 监听pagesize的值
    handleSizeChange(newsize) {
      this.queryinfo.pagesize = newsize
      this.getUserList()
    },
    //监听页码值
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage
      this.getUserList()
    },
    //监听开关状态mg_state
    async userStateChange(newstate) {
      console.log(newstate)
      const { data: res } = await this.$http.put(
        `users/${newstate.id}/state/${newstate.mg_state}`
      )
      if (res.meta.status !== 200) {
        this.newstate.mg_state = !newstate.mg_state
        return this.$message.error('更新用户状态失败！')
      } else {
        this.$message.success('更新用户状态成功!')
      }
    },
    //重置添加用户表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    //重置修改用户表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    //点击按钮预校验，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) {
          return
        } else {
          //可以发起添加用户的的请求
          const { data: res } = await this.$http.post('users', this.addruleForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加用户失败')
          } else {
            this.$message.success(res.meta.msg)
            this.addDialogVisible = false
            this.getUserList()
          }
        }
      })
    },
    //点击按钮预校验，修改用户
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          )
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('修改用户失败')
          } else {
            //提示修改成功
            this.$message.success(res.meta.msg)
            //关闭对话框
            this.editDialogVisible = false
            //刷新数据列表
            this.getUserList()
          }
        }
      })
    },
    //点击修改按钮弹出对话
    async ShowEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      } else {
        this.editForm = res.data
        this.editDialogVisible = true
      }
    },
    async open(id) {
      const res = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      console.log(res)
      if (res !== 'confirm') {
        return this.$message.info('已取消删除')
      } else {
        const { data: res1 } = await this.$http.delete('users/' + id)
        console.log(res1)
        if (res1.meta.status !== 200) {
          return this.$message.error('删除失败')
        } else {
          this.$message.success(res1.meta.msg)
          this.getUserList()
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.add_user {
  margin-left: 15px;
}
.el-table {
  margin: 15px 0px 15px 0px;
}
</style>
