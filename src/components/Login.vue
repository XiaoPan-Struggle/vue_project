<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.jpg" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
           <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 验证
      loginFormRules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置点击
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录点击
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 1.将登录成功后的token保存到客户端的sessionStorage中
        // 2.通过编程式导航跳转到后台主页，路由地址是/homoe
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;

    .login_box{
      position: absolute;
      left: 50%;
      top: 50%;
      width: 450px;
      height: 300px;
      border-radius: 3px;
      background-color: #fff;
      transform: translate(-50%,-50%);

      // 头像区域
      .avatar_box{
        position: absolute;
        left: 50%;
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
          width: 100%;
          border-radius: 50%;
          border: 1px solid #eee;
          background-color: #eee;
        }
      }

      // 登录表单区域
      .login_form{
        position: absolute;
        bottom: 0px;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        .btns{
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
</style>
