<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/rights' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 角色列表区域 -->
    <el-table :data="roleList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item) in scope.row.children" :key="item.id">
            <!-- 渲染一级权限 -->
            <el-col :span="5">
              <el-tag closable @close="removeRightsById(scope.row,item.id)">{{item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级和三级权限 -->
            <el-col :span="19">
              <el-row v-for="(itemChild) in item.children" :key="itemChild.id">
                <!-- 渲染二级权限 -->
                <el-col :span="6">
                  <el-tag type="success" closable @close="removeRightsById(scope.row,itemChild.id)">{{itemChild.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 渲染三级权限 -->
                <el-col :span="18">
                  <el-tag type="warning" v-for="(itemChildren) in itemChild.children" :key="itemChildren.id"
                  closable @close="removeRightsById(scope.row,itemChildren.id)">{{itemChildren.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="权限描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="editRoles(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removeRoles(scope.row.id)">删除</el-button>
          <el-button type="warning" icon="el-icon-setting">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色区域 -->
    <el-dialog title="编辑角色" :visible.sync="addRolesVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色区域 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">修 改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取角色列表数据
      roleList: [],
      // 控制编辑角色表单显示隐藏
      editRolesVisible: false,
      // 控制添加角色表单显示隐藏
      addRolesVisible: false,
      // 添加角色编辑信息
      addForm: {},
      // 添加角色规范
      addFormRules: {
        roleName: [{
          required: true, message: '请输入角色名', triggle: true
        }, {
          min: 1,
          max: 10,
          message: '角色名长度在1-10个字符之间',
          triggle: 'blur'
        }],
        roleDesc: [{
          required: true, message: '请输入角色描述信息', triggle: true
        }, {
          min: 1,
          max: 100,
          message: '描述尽可能简洁',
          triggle: 'blur'
        }]
      },
      // 获取角色编辑信息
      editForm: {},
      // 编辑角色规范
      editFormRules: {
        roleName: [{
          required: true, message: '请输入角色名', triggle: true
        }, {
          min: 1,
          max: 10,
          message: '角色名长度在1-10个字符之间',
          triggle: 'blur'
        }],
        roleDesc: [{
          required: true, message: '请输入角色描述信息', triggle: true
        }, {
          min: 1,
          max: 100,
          message: '描述尽可能简洁',
          triggle: 'blur'
        }]
      }
    }
  },
  created () {
    // 获取角色列表信息
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    // 删除角色
    async removeRoles (id) {
      // 弹框确认删除
      const confirmResult = await this.$confirm('是否永久移除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 确认,打印字符串 confirm
      // 取消,打印字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('取消了删除操作')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除角色失败')
      }
      this.$message.success('删除成功')
      // 删除成功，重新渲染
      this.getRolesList()
    },
    // 添加角色
    addRoles () {
      this.addRolesVisible = true
    },
    // 编辑表单关闭监听
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 添加角色更新信息
    addRolesInfo () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发送添加角色请求
        const { data: res } = await this.$http.post('roles', {
          roleName: this.addForm.roleName,
          roleDesc: this.addForm.roleDesc
        })
        if (res.meta.status !== 200) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        // 关闭修改用户对话框
        this.addRolesVisible = false
        // 重新获取用户页面
        this.getRolesList()
      })
    },
    // 编辑角色
    async editRoles (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑失败')
      }
      this.editForm = res.data
      this.editRolesVisible = true
    },
    // 编辑表单关闭监听
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑更新信息
    editRolesInfo (id) {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发送修改角色请求
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
        if (res.meta.status !== 200) {
          this.$message.error('修改用户信息失败')
        }
        this.$message.success('修改用户信息成功')
        // 关闭修改用户对话框
        this.editRolesVisible = false
        // 重新获取用户页面
        this.getRolesList()
      })
    },
    // 删除权限
    async removeRightsById (roles, id) {
      // 弹框确认删除
      const confirmResult = await this.$confirm('是否删除该权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 确认,打印字符串 confirm
      // 取消,打印字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除操作')
      }
      const { data: res } = await this.$http.delete(`roles/${roles.id}/rights/${id}`)
      if (res.meta.status !== 200) {
        this.$message.error('删除权限失败')
      }
      // 防止全局更新，所以不能调用getRolesList
      // 让当前角色的children属性更新
      roles.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
</style>
