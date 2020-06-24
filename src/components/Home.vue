<template>
  <el-container class='el-container'>
    <!-- 头部 -->
    <el-header class='el-header'>
      <div>电商后台管理系统</div>
      <el-button type='info' @click='logout'>退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'" class='el-aside'>
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏区域 -->
        <el-menu class="el-menu" background-color="#545c64" text-color="#fff" active-text-color="#409EFE" unique-opened
          :collapse-transition='false' :collapse='isCollapse' router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单内容区域 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
              @click="saveNavState('/' + subItem.path)">
              <!-- 二级菜单内容区域 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右主体 -->
      <el-main class='el-main'>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      // 是否折叠
      isCollapse: false,
      // 按钮激活状态
      activePath: '',
      iconsObj: {
        // 125 103 101 102 145
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    // 获取左侧菜单栏数据
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 控制左侧菜单栏缩放
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 40px;
  color: #fff;
  background-color: #1a1b20;
  font-size: 24px;
}
.el-aside {
  color: #fff;
  background-color: #1a1b20;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #f1f1f1;
}
.el-container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #74757a;
  font-size: 10px;
  text-align: center;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
