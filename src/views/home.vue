<template>
  <div>
    <h1>首页</h1>
    <el-row v-if="this.$store.state.user.userid">
      <h2>欢迎您：{{username}}</h2>
<!--      <h2>审核状态：{{audit}}</h2>-->
      <h2>用户类型：{{usertype}}</h2>
<!--      <el-button v-if="audit==='未审核'" @click="toAudit">去审核</el-button>-->
    </el-row>
    <el-row v-else>
      <h2>暂无用户信息，请先登录</h2>
      <el-button @click="toLogin">请登录</el-button>
    </el-row>
    <el-row  type="flex" justify="center">
      <el-col :span="6" v-if="hasMsg1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>挂号信息</span>
          </div>
          <div v-for="item in msg1" :key="index" class="text item">
            <el-row type="flex">
              <el-col :span="24">
                <span>{{item.msg}}</span>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="12">
                {{item.date}}
              </el-col>
              <el-col :span="6">
                <el-button @click="read(item.msgid)" size="mini" type="danger">已读</el-button>
              </el-col>
              <el-col :span="6">
                <el-button @click="toReception" size="mini" type="success">去接诊</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" v-if="hasMsg2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>接诊消息</span>
          </div>
          <div v-for="item in msg2" :key="index" class="text item">
            <el-row type="flex">
              <el-col :span="24">
                <span>{{item.msg}}</span>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="20">
                {{item.date}}
              </el-col>
              <el-col :span="4">
                <el-button @click="read(item.msgid)" size="mini" type="danger">已读</el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "home",
  data() {
    return {
      username: this.$store.state.user.username,
      usertype: this.$store.state.user.usertype,
      audit: this.$store.state.user.audit,
      hasMsg1: false,
      hasMsg2: false,
      msg1: [],
      msg2: []
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      var self = this;
      axios.post('http://localhost:9091/hvs/user/getUserById', {
        userid: this.$store.state.user.userid
      }).then(function(res){
        self.usertype = res.data.usertype===0?'管理员':res.data.usertype===1?'病人':'医生';
        self.username = res.data.username;
        self.audit = res.data.audit===0?'未审核':'已审核';
        self.changeMsg11(res.data.usertype);
        self.changeMsg12(res.data.usertype);
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    getMsg11() {
      var self = this;
      axios.post('http://localhost:9091/hvs/msg/queryMsg11', {
        userid: this.$store.state.user.userid
      }).then(function(res){
        self.msg1 = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    getMsg12() {
      var self = this;
      axios.post('http://localhost:9091/hvs/msg/queryMsg12', {
        userid: this.$store.state.user.userid
      }).then(function(res){
        self.msg2 = res.data
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    read(msgid) {
      var self = this;
      axios.post('http://localhost:9091/hvs/msg/UpdateMsgUse', {
        msgid: msgid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success("消息已读");
          self.getMsg11();
          self.getMsg12();
        } else {
          self.$message.error(res.data.msg);
        }
      }).catch(function(err){
        self.$message.error(err);
      })
    },
    toReception() {
      this.$router.push('/reception')
    },
    changeMsg11(usertype) {
      if (usertype === 2) {
        this.hasMsg1 = true
        this.getMsg11()
      } else {
        this.hasMsg1 = false
      }
    },
    changeMsg12(usertype) {
      if (usertype === 1) {
        this.hasMsg2 = true
        this.getMsg12()
      } else {
        this.hasMsg2 = false
      }
    },
    toLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
