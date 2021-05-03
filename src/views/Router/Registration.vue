<template>
  <div>
    <h1>挂号</h1>
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
            label=用户名>
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
            :filters="[{ text: '小儿科', value: '小儿科' }, { text: '外科', value: '外科' }, { text: '泌尿科', value: '泌尿科' }]"
            :filter-method="filterKS">
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄">
          </el-table-column>
          <el-table-column
            prop="level"
            label="级别"
            :filters="[{ text: '初级', value: '初级' }, { text: '中级', value: '中级' }, { text: '高级', value: '高级' }]"
            :filter-method="filterJB">
          </el-table-column>
          <el-table-column
            prop="advantage"
            label="优势">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="update(scope.row)">挂号</el-button>
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
              <el-button slot="trigger" size="small" type="primary">上传病例本</el-button>
              <div slot="tip" class="el-upload__tip">如果你是初次看病，没有病例本，可以不上传</div>
            </el-upload>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addProcess">确 定</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Registration",
    data() {
      return {
        tableData: [],
        dialogVisible: false,
        fileid: '',
        doctor: ''
      }
    },
    created() {
      this.getDoctorDetail();
    },
    methods: {
      getDoctorDetail() {
        var self = this
        axios.post('http://localhost:9091/hvs/user/getDoctorDetail').then(function(res){
          self.tableData = res.data
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
