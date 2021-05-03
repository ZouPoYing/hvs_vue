<template>
  <div>
    <h1>医生信息管理</h1>
    <el-row type="flex">
      <el-col :span="18" pull="5">
        <el-button
          size="mini"
          type="primary"
          @click="add">新增</el-button>
      </el-col>
    </el-row>
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
            prop="password"
            label="密码">
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
            label="科室">
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄">
          </el-table-column>
          <el-table-column
            prop="level"
            label="级别">
          </el-table-column>
          <el-table-column
            prop="advantage"
            label="优势">
          </el-table-column>
          <el-table-column
            prop="date"
            label="时间">
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="update(scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteRow(scope.row)">删除</el-button>
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
            <el-form-item label="用户名" prop="username">
              <el-input maxlength="10" type="text" v-model="setForm.username"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input maxlength="10" type="text" v-model="setForm.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input maxlength="16" type="text" v-model="setForm.password"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="telephone">
              <el-input maxlength="11" type="text" v-model="setForm.telephone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input maxlength="11" type="text" v-model="setForm.email"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="setForm.sex">
                <el-radio label="男" border>男</el-radio>
                <el-radio label="女" border>女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用户类型" prop="usertype">
              <el-radio-group :disabled="true" v-model="setForm.usertype">
                <el-radio label="1" border>病人</el-radio>
                <el-radio label="2" border>医生</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="科室" prop="department">
              <el-input type="text" v-model="setForm.department"></el-input>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-input type="text" v-model="setForm.age"></el-input>
            </el-form-item>
            <el-form-item label="级别" prop="level">
              <el-input type="text" v-model="setForm.level"></el-input>
            </el-form-item>
            <el-form-item label="优势" prop="advantage">
              <el-input type="text" v-model="setForm.advantage"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button v-if="isAdd" type="primary" @click="addDoctorDetail">确 定</el-button>
            <el-button v-else type="primary" @click="updateDoctorDetail">修 改</el-button>
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
  name: "UserInfoManagement",
  data() {
    return {
      tableData: [],
      setForm: {},
      dialogVisible: false,
      isAdd: true
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
    add() {
      this.setForm = {}
      this.setForm.sex = '男'
      this.setForm.usertype = '2'
      this.dialogVisible = !this.dialogVisible
      this.isAdd = true
    },
    addDoctorDetail() {
      var self = this;
      axios.post('http://localhost:9091/hvs/user/addDoctorDetail', {
        username: self.setForm.username,
        name: self.setForm.name,
        password: self.setForm.password,
        telephone: self.setForm.telephone,
        email: self.setForm.email,
        sex: self.setForm.sex,
        usertype: self.setForm.usertype,
        department: self.setForm.department,
        level: self.setForm.level,
        advantage: self.setForm.advantage,
        age: self.age
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('新增成功');
          self.getDoctorDetail();
          self.dialogVisible = !self.dialogVisible
        } else {
          self.$message.error(res.data.msg);
          self.dialogVisible = !self.dialogVisible
        }
      }).catch(function(err){
        self.$message.error(err);
        self.dialogVisible = !self.dialogVisible
      })
    },
    update(row) {
      this.dialogVisible = true
      this.isAdd = false
      this.setForm = row
    },
    updateDoctorDetail() {
      var self = this;
      axios.post('http://localhost:9091/hvs/user/updateDoctorDetail', {
        username: self.setForm.username,
        name: self.setForm.name,
        password: self.setForm.password,
        telephone: self.setForm.telephone,
        email: self.setForm.email,
        sex: self.setForm.sex,
        usertype: self.setForm.usertype,
        department: self.setForm.department,
        level: self.setForm.level,
        advantage: self.setForm.advantage,
        age: self.setForm.age,
        userid: self.setForm.userid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('修改成功');
          self.getDoctorDetail();
          self.dialogVisible = !self.dialogVisible
        } else {
          self.$message.error(res.data.msg);
          self.dialogVisible = !self.dialogVisible
        }
      }).catch(function(err){
        self.$message.error(err);
        self.dialogVisible = !self.dialogVisible
      })
    },
    deleteRow(row) {
      var self = this;
      axios.post('http://localhost:9091/hvs/user/deleteDoctorDetail', {
        userid: row.userid
      }).then(function(res){
        if (res.data.success) {
          self.$message.success('删除成功');
          self.getDoctorDetail();
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
