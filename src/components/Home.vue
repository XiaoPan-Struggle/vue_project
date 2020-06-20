<template>
  <el-button type="info" @click="logout">退出</el-button>
</template>

<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
