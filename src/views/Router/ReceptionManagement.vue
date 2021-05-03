<template>
  <div>
    <h1>就诊信息管理</h1>
    <div v-if="hasData">
      <el-row type="flex" justify="center">
        <el-col :span="8" class="order">
          用户名：{{data.username}}
        </el-col>
        <el-col :span="8" class="order">
          姓名：{{data.name}}
        </el-col>
        <el-col :span="8" class="order">
          性别：{{data.sex}}
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="8" class="order">
          年龄：{{data.age}}
        </el-col>
        <el-col :span="8" class="order">
          电话：{{data.telephone}}
        </el-col>
        <el-col :span="8" class="order">
          邮箱：{{data.email}}
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="8" class="order">
          状态：{{data.processstep}}
        </el-col>
        <el-col :span="8" class="order">
          病例本：{{data.file}}
        </el-col>
        <el-col :span="8" class="order">
          <el-button type="primary" @click="downloadFile(data.filename)">下载病例本</el-button>
        </el-col>
      </el-row>
    </div>
    <el-row v-else type="flex" justify="center">
      <el-col>
        <h1>您没有正在接诊的病人，请先接诊病人</h1>
      </el-col>
    </el-row>
    <el-button style="position: fixed;bottom: 60px;right: 50px; z-index: 100;" type="primary">开就诊单</el-button>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "ReceptionManagetion",
    data() {
      return {
        data: [],
        hasData: false
      }
    },
    created() {
      this.getReception();
    },
    methods: {
      getReception() {
        var self = this;
        axios.post('http://localhost:9091/hvs/process/getReception', {
          userid: self.$store.state.user.userid,
        }).then(function(res){
          if (res.data.success) {
            self.data = res.data
            self.hasData = true
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      downloadFile(filename) {
        window.location.href='http://localhost:9091/hvs/set/downloadFile/' + filename;
      }
    }
  }
</script>

<style scoped>
  .order {
    margin: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
