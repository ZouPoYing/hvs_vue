<template>
  <div>
    <h1>接诊</h1>
    <el-row type="flex" justify="center">
      <el-col>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index">
          </el-table-column>
          <el-table-column
            prop="username"
            label=用户名>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄">
          </el-table-column>
          <el-table-column
            prop="telephone"
            label="电话号码">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="processstep"
            label="状态">
          </el-table-column>
          <el-table-column
            prop="date"
            label="挂号时间">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="downloadFile(scope.row)">下载病例本</el-button>
              <el-button
                size="mini"
                type="success"
                @click="reception(scope.row)">接诊</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Reception",
    data() {
      return {
        tableData: []
      }
    },
    created() {
      this.getReception();
    },
    methods: {
      getReception() {
        var self = this;
        axios.post('http://localhost:9091/hvs/msg/getReception', {
          userid: self.$store.state.user.userid
        }).then(function(res){
          self.tableData = res.data
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      downloadFile(row) {
        if (row.filename === undefined || row.filename === '') {
          self.$message.error('病人没有上传病例本');
        } else {
          window.location.href='http://localhost:9091/hvs/set/downloadFile/' + row.filename;
        }
      },
      reception(row) {
        var self = this;
        axios.post('http://localhost:9091/hvs/process/reception', {
          userid: self.$store.state.user.userid,
          processid: row.processid,
          patient: row.patient
        }).then(function(res){
          if (res.data.success) {
            self.getReception();
            self.$message.success('接诊成功，请等待病人就医')
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
      }
    }
  }
</script>

<style scoped>

</style>
