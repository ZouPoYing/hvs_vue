<template>
  <div>
    <h1>忘记密码</h1>
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <span>请联系管理员</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "ForgetPassword",
    data () {
      return {

      }
    },
    methods: {
      toLogin() {
        this.$router.push('/login')
      },
      toRegist() {
        this.$router.push('/regist')
      }
    }
  }
</script>

<style scoped>

</style>
