<template>
  <div>
    <h1>忘记密码</h1>
    <el-row type="flex" justify="center">
      <el-col :span="6">
        <span>请联系管理员</span>
          <el-card style="margin: 50px 0 100px 0">
              <el-row type="flex" justify="center">
                  <el-col>
                      <p style="font-size: 20px">管理员电话：1518</p>
                      <p style="font-size: 20px">管理员邮箱：1518@qq.com</p>
                  </el-col>
              </el-row>
          </el-card>
          <el-link @click="toLogin" :underline="false">立即登录</el-link>
          <el-link @click="toRegist" :underline="false">立即注册</el-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "forgetPassword",
    data () {
      return {
        data: []
      }
    },
    create() {
      this.getAdmin();
    },
    methods: {
      toLogin() {
        this.$router.push('/login')
      },
      toRegist() {
        this.$router.push('/regist')
      },
      getAdmin() {
        var self = this;
        axios.post('http://localhost:9091/hvs/user/getAdmin').then(function (res) {
          self.data = res.data
        }).catch(function(err){
          self.$message.error(err);
        })
      }
    }
  }
</script>

<style scoped>

</style>
