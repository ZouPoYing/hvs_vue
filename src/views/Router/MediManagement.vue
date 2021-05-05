<template>
    <div>
        <h1>药房信息管理</h1>
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
                        :data="tableData.filter(data => !search || data.mediname.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%">
                    <el-table-column
                            type="index">
                    </el-table-column>
                    <el-table-column
                            prop="mediname"
                            label="药品名">
                    </el-table-column>
                    <el-table-column
                            prop="meditype"
                            label="药品类型">
                    </el-table-column>
                    <el-table-column
                            prop="medimsg"
                            label="药品信息">
                    </el-table-column>
                    <el-table-column
                            prop="num"
                            label="库存">
                    </el-table-column>
                    <el-table-column
                            prop="money"
                            label="价格">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="添加时间">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="150">
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mini"
                                    placeholder="输入关键字搜索"/>
                        </template>
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
                        :title="title"
                        :visible.sync="dialogVisible"
                        width="30%">
                    <el-form label-width="100px" class="demo-ruleForm" enctype="multipart/form-data">
                        <el-form-item label="药品名" prop="mediname">
                            <el-input maxlength="10" type="text" v-model="setForm.mediname"></el-input>
                        </el-form-item>
                        <el-form-item label="药品类型" prop="meditype">
                            <el-radio-group v-model="meditype">
                                <el-radio label="处方药" border>处方药</el-radio>
                                <el-radio label="非处方药" border>非处方药</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="药品信息" prop="medimsg">
                            <el-input maxlength="200" type="textarea" v-model="setForm.medimsg" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="药品库存" prop="num">
                            <el-input-number v-model="num" :precision="0" :min="0" :max="99999999" :step="10"></el-input-number>
                        </el-form-item>
                        <el-form-item label="价格" prop="money">
                            <el-input maxlength="21" type="text" v-model="setForm.money"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
            <el-button v-if="isAdd" type="primary" @click="addMedi">确 定</el-button>
                <el-button v-else type="primary" @click="updateMedi">修 改</el-button>
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
    name: "MediManagement",
    data() {
      return {
        tableData: [],
        setForm: [],
        num: 0,
        meditype: '处方药',
        dialogVisible: false,
        isAdd: true,
        title: '新增',
        search: ''
      }
    },
    created() {
      this.getMedi();
    },
    methods: {
      getMedi() {
        var self = this
        axios.post('http://localhost:9091/hvs/medi/getMedi').then(function(res){
          self.tableData = res.data
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      add() {
        this.setForm = []
        this.title = '新增'
        this.meditype = '处方药'
        this.num = 0
        this.dialogVisible = !this.dialogVisible
        this.isAdd = true
      },
      addMedi() {
        var self = this;
        axios.post('http://localhost:9091/hvs/medi/addMedi', {
          mediname: self.setForm.mediname,
          meditype: self.meditype,
          medimsg: self.setForm.medimsg,
          num: self.num,
          money: self.setForm.money
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('新增成功');
            self.getMedi();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
        self.dialogVisible = !self.dialogVisible
      },
      update(row) {
        this.title = '修改'
        this.dialogVisible = true
        this.isAdd = false
        this.setForm = row
        this.num = row.num
        this.meditype = row.meditype
      },
      updateMedi() {
        var self = this;
        axios.post('http://localhost:9091/hvs/medi/updateMedi', {
          mediname: self.setForm.mediname,
          meditype: self.meditype,
          medimsg: self.setForm.medimsg,
          num: self.num,
          money: self.setForm.money,
          mediid: self.setForm.mediid
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('修改成功');
            self.getMedi();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
        self.dialogVisible = !self.dialogVisible
      },
      deleteRow(row) {
        var self = this;
        axios.post('http://localhost:9091/hvs/medi/deleteMedi', {
          mediid: row.mediid
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('删除成功');
            self.getMedi();
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