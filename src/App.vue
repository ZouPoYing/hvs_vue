<template>
  <div id="app">
    <el-header>
      <el-menu class="el-menu-demo" mode="horizontal" style="background: lightblue">
          <el-row type="flex" justify="center">
              <el-col :span="16">
                  <p style="text-align: left;padding-left: 50px" >门诊信息管理系统</p>
              </el-col>
              <el-col :span="4">
                  <p>{{username}}</p>
              </el-col>
              <el-col :span="4">
                  <p @click="LogOut">退出</p>
              </el-col>
          </el-row>
      </el-menu>
    </el-header>
    <el-container style="height: 860px; border: 1px solid #eee">
      <el-aside width="300px">
        <el-row style="height: 859px;" class="tac">
          <el-col>
            <el-row v-if="userid" class="user" type="flex" justify="center" align="middle">
              <el-col @click.native="toSetting()">
                <el-avatar class="head-pic"> {{username}} </el-avatar>
              </el-col>
            </el-row>
            <el-row v-else class="login" type="flex" justify="center" align="middle">
              <el-button @click="toLogin">请登录</el-button>
            </el-row>
            <el-menu style="background: lightblue;text-align: left">
              <el-menu-item v-for="(item, index) in app" :key="index" @click="routerJump(item.router)" :class="color">
                <i class="el-icon-menu"></i>
                <span slot="title">{{item.name}}</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-container>
        <el-main>
          <el-col>
            <router-link></router-link>
            <router-view @logout="reusername" @login="getUserid"></router-view>
          </el-col>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'App',
  data() {
    return {
      userid: this.$store.state.user.userid,
      username: this.$store.state.user.username,
      usertype: this.$store.state.user.usertype,
      audit: this.$store.state.user.audit,
      router: '',
      color: false,
      isCollapse: true,
      app: []
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    LogOut() {
      this.$store.commit('clearUserCache');
      this.getUser()
      this.$message.success('注销成功，即将跳转登录页');
      setTimeout(() => {
        this.$router.push('/login')
      }, 1000)
    },
    getUser() {
      var self = this;
      if (this.$store.state.user.userid == '') {
        self.getApp('',0);
      } else {
        this.userid = this.$store.state.user.userid
        axios.post('http://localhost:9091/hvs/user/getUserById', {
          userid: this.userid
        }).then(function(res){
          self.usertype = res.data.usertype;
          self.username = res.data.username;
          self.audit = res.data.audit;
          self.getApp(res.data.usertype);
        }).catch(function(err){
          self.$message.error(err);
        })
      }
    },
    getApp(usertype) {
      var self = this;
      axios.post('http://localhost:9091/hvs/app/getAppByType', {
        type: usertype
      }).then(function(res){
        self.app = res.data;
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    routerJump(router) {
      this.$router.push('/'+router)
      this.color = !this.color;
    },
    toLogin() {
      this.$router.push('/login')
    },
    toSetting() {
      this.$router.push('/setting')
    },
    getUserid() {
      this.getUser()
    },
    reusername() {
      this.userid= ''
      this.username = ''
      this.getApp('',0)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
    background: lightblue;
  /*margin-top: 60px;*/
}
.user,.login {
  height: 100px;
}
.color span{
  background: lightblue;
}
</style>
