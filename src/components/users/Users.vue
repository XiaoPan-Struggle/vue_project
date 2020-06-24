<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div>
        <!-- 搜索和添加 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="addEditDialog">添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 添加用户区域 -->
        <el-dialog title="添加用户" :visible.sync="isDialogVisible" width="50%" @close="addDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="isDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">添 加</el-button>
          </span>
        </el-dialog>

        <!-- 用户列表 -->
        <el-table :data="userlist" style="width: 100%" stripe border>
          <el-table-column type="index">
          </el-table-column>
          <el-table-column prop="username" label="用户">
          </el-table-column>
          <el-table-column prop="email" label="邮箱">
          </el-table-column>
          <el-table-column prop="mobile" label="电话">
          </el-table-column>
          <el-table-column prop="role_name" label="权限">
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" active-color="#13ce66" @change="userStateChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-button type="primary" icon="el-icon-edit" round @click="showEditDialog(scope.row.id)"></el-button>
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" round @click="removeUserById(scope.row.id)"></el-button>
              <!-- 权限设置 -->
              <el-tooltip content="权限管理" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" round></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 修改用户区域 -->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
          <!-- 内容主体区域 -->
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">修 改</el-button>
          </span>
        </el-dialog>

        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 4, 8]" :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([A-Za-z0-9_-])+@([A-Za-z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入正确的手机号'))
    }
    return {
      // 获取用户数据列表请求参数
      queryInfo: {
        query: '',
        // 页码
        pagenum: 1,
        // 每页多少条数据
        pagesize: 8
      },
      // 用户
      userlist: [],
      // 几条数据
      total: 0,
      // 添加用户区域显示隐藏
      isDialogVisible: false,
      // 修改用户区域显示隐藏
      editDialogVisible: false,
      // 添加用户参数
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户参数
      editForm: {},
      // 添加用户的验证
      addFormRules: {
        username: [{
          required: true, message: '请输入用户名', triggle: true
        }, {
          min: 3,
          max: 10,
          message: '用户名长度在3-10个字符之间',
          triggle: 'blur'
        }],
        password: [{
          required: true, message: '请输入密码', triggle: true
        }, {
          min: 6,
          max: 16,
          message: '密码长度在6-16个字符之间',
          triggle: 'blur'
        }],
        email: [{
          required: true, message: '请输入邮箱', triggle: true
        }, {
          validator: checkEmail, triggle: 'blur'
        }],
        mobile: [{
          required: true, message: '请输入手机号', triggle: true
        }, {
          validator: checkMobile, triggle: 'blur'
        }]
      },
      // 修改用户的验证
      editFormRules: {
        email: [{
          required: true, message: '请输入邮箱', triggle: true
        }, {
          validator: checkEmail, triggle: 'blur'
        }],
        mobile: [{
          required: true, message: '请输入手机号', triggle: true
        }, {
          validator: checkMobile, triggle: 'blur'
        }]
      }
    }
  },
  created () {
    // 获取用户列表数据
    this.getUserList()
  },
  methods: {
    // 获取用户列表信息
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 每页数据数量切换
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 页码切换
    handleCurrentChange (newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
    },
    // 状态切换
    async userStateChange (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新状态失败')
      } return this.$message.success('更新状态成功')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 展示用户添加对话框
    addEditDialog () {
      this.isDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 展示用户修改对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 添加用户预效验
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发送添加用户请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 关闭添加用户对话框
        this.isDialogVisible = false
        // 重新获取用户页面
        this.getUserList()
      })
    },
    // 修改用户预效验
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发送修改用户请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          this.$message.error('修改用户信息失败')
        }
        this.$message.success('修改用户信息成功')
        // 关闭修改用户对话框
        this.editDialogVisible = false
        // 重新获取用户页面
        this.getUserList()
      })
    },
    // 删除用户
    async removeUserById (id) {
      // 弹框确认删除
      const confirmResult = await this.$confirm('是否永久删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 确认,打印字符串 confirm
      // 取消,打印字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('取消了删除操作')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      // 删除成功后,重新跟新用户列表
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
