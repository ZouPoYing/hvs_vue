<template>
  <div>
    <h1>预约挂号</h1>
    <el-row type="flex" justify="center">
      <el-col>
        <el-button @click="clearFilter">清除所有过滤器</el-button>
        <el-table
          ref="filterTable"
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index">
          </el-table-column>
          <el-table-column
            prop="username"
            label="医生工号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名">
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
            prop="sex"
            label="性别">
          </el-table-column>
          <el-table-column
            prop="department"
            label="科室"
            :filters="fDepartment"
            :filter-method="filterKS">
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄">
          </el-table-column>
          <el-table-column
            prop="level"
            label="级别"
            :filters="fLever"
            :filter-method="filterJB">
          </el-table-column>
          <el-table-column
            prop="advantage"
            label="优势">
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="update(scope.row)">挂号</el-button>
                <el-button
                        size="mini"
                        type="primary"
                        @click="view(scope.row)">预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="18">
        <el-dialog
          title="新增"
          :visible.sync="dialogVisible"
          width="30%">
          <el-form label-width="100px" class="demo-ruleForm" enctype="multipart/form-data">
            <el-upload
              class="upload-demo"
              ref="upload"
              action
              :limit="1"
              :http-request="handleUploadForm"
              :on-remove="handleRemove"
              :auto-upload="true">
                <el-button slot="trigger" size="mini" type="primary">上传病例本</el-button>
            </el-upload>
            <el-button style="margin: 10px 0 10px 0" type="primary" size="mini" @click="downloadFile">下载病例本模板</el-button>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addProcess">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
    <el-dialog
          title="预览"
          :visible.sync="dialog"
          width="30%">
      <el-form label-width="100px" class="demo-ruleForm" enctype="multipart/form-data">
          <el-row type="flex" justify="center">
              <el-col :span="6">
                  <el-image
                          style="width: 100px; height: 100px"
                          :src="require('../../assets/img/head.jpg')"></el-image>
              </el-col>
              <el-col :span="18">
                  <p style="text-align: left">医生工号：{{viewData.username}}</p>
                  <p style="text-align: left">姓名：{{viewData.name}}</p>
                  <p style="text-align: left">性别：{{viewData.sex}}</p>
                  <p style="text-align: left">年龄：{{viewData.age}}</p>
              </el-col>
          </el-row>
          <p style="text-align: left;font-size: 20px">联系方式</p>
          <el-row type="flex" justify="center" style="margin-left: 20px">
              <el-col :span="24">
                  <p style="text-align: left">科室联系电话：{{viewData.telephone}}</p>
                  <p style="text-align: left">邮箱：{{viewData.email}}</p>
              </el-col>
          </el-row>
          <p style="text-align: left;font-size: 20px">职业信息</p>
          <el-row type="flex" justify="center" style="margin-left: 20px">
              <el-col :span="24">
                  <p style="text-align: left">科室：{{viewData.department}}</p>
                  <p style="text-align: left">等级：{{viewData.level}}</p>
                  <p style="text-align: left">优势：{{viewData.advantage}}</p>
              </el-col>
          </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Registration",
    data() {
      return {
        tableData: [],
        viewData: [],
        dialogVisible: false,
        dialog: false,
        fileid: '',
        doctor: '',
        fLever: [],
        fDepartment: [],
        filename: ''
      }
    },
    created() {
      this.getDoctorDetail();
      this.getLevel();
      this.getDepartment();
      this.getSetFile();
    },
    methods: {
      getSetFile() {
        var self = this
        axios.post('http://localhost:9091/hvs/set/getSetFilename').then(function(res){
          self.filename = res.data.filename
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      downloadFile() {
        window.location.href='http://localhost:9091/hvs/set/downloadFile/' + this.filename;
      },
      view(row) {
        this.dialog = true
        this.viewData = row
      },
      getDoctorDetail() {
        var self = this
        axios.post('http://localhost:9091/hvs/user/getDoctorDetail').then(function(res){
          self.tableData = res.data
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      getLevel() {
        var self = this
        axios.post('http://localhost:9091/hvs/user/getLevel').then(function(res){
          self.fLever = res.data
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      getDepartment() {
        var self = this
        axios.post('http://localhost:9091/hvs/user/getDepartment').then(function(res){
          self.fDepartment = res.data
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      filterJB(value, row) {
        return row.level === value;
      },
      filterKS(value, row) {
        return row.department === value;
      },
      clearFilter() {
        this.$refs.filterTable.clearFilter();
      },
      update(row) {
        this.dialogVisible = !this.dialogVisible
        this.doctor = row.userid
      },
      handleRemove() {
        this.$message.success('文件移除成功');
        this.fileid = ''
      },
      handleUploadForm(param) {
        var self = this
        let formData = new FormData();
        formData.append('userid', self.$store.state.user.userid)
        formData.append('file', param.file)
        axios.post('http://localhost:9091/hvs/set/upload',formData).then(function(res){
          self.$message.success('文件上传成功');
          self.fileid = res.data;
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      addProcess() {
        var self = this
        axios.post('http://localhost:9091/hvs/process/addProcess',{
          userid: self.$store.state.user.userid,
          doctor: self.doctor,
          fileid: self.fileid
        }).then(function(res){
          if (res.data.success) {
            self.tableData = res.data
          } else {
            self.$message.error(res.data.msg);
          }
          self.dialogVisible = !self.dialogVisible
        }).catch(function(err){
          self.$message.error(err);
          self.dialogVisible = !self.dialogVisible
        })
      }
    }
  }
</script>

<style scoped>

</style>
