<template>
  <div>
    <h1>就诊信息管理</h1>
    <div v-if="hasData">
        <el-card class="box-card">
            <el-row type="flex" justify="center">
                <el-col :span="6">
                    <el-image
                            style="width: 100px; height: 100px"
                            :src="require('../../assets/img/head.jpg')"></el-image>
                </el-col>
                <el-col :span="6">
                    <p style="text-align: left">患者编号：{{data.username}}</p>
                    <p style="text-align: left">姓名：{{data.name}}</p>
                    <p style="text-align: left">性别：{{data.sex}}</p>
                    <p style="text-align: left">年龄：{{data.age}}</p>
                </el-col>
                <el-col :span="6">
                    <p style="text-align: left;font-size: 20px">联系方式</p>
                    <p style="text-align: left">联系电话：{{data.telephone}}</p>
                    <p style="text-align: left">邮箱：{{data.email}}</p>
                    <p style="text-align: left">地址：{{data.address}}</p>
                </el-col>
                <el-col :span="6">
                    <p style="text-align: left;font-size: 20px">其他信息</p>
                    <p style="text-align: left">状态：{{data.processstep}}</p>
                    <p style="text-align: left">病例本：{{data.file}}</p>
                    <el-button type="primary" @click="downloadFile(data.filename)">下载病例本</el-button>
                    <el-button type="primary" @click="upload">上传新的病例本</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-row type="flex" justify="center">
            <el-col :span="18">
                <el-dialog
                        title="上传新的病历本"
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
                            <el-button slot="trigger" size="mini" type="primary">上传新的病例本</el-button>
                        </el-upload>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="updateFileid">确 定</el-button>
                        <el-button @click="dialogVisible = false">取 消</el-button>
                      </span>
                </el-dialog>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="18">
                <el-dialog
                        title="开就诊单"
                        :visible.sync="dialog"
                        width="50%">
                    <el-form label-width="100px" class="demo-ruleForm" enctype="multipart/form-data">
                        <el-form-item label="病名" prop="disease">
                            <el-input type="text" v-model="setForm.disease"></el-input>
                        </el-form-item>
                        <el-form-item label="病因" prop="cause">
                            <el-input type="text" v-model="setForm.cause"></el-input>
                        </el-form-item>
                        <el-form-item label="选药" prop="mediid">
                            <el-transfer
                                    filterable
                                    :filter-method="filterMethod"
                                    filter-placeholder="请输入药名"
                                    :titles="['全部的药', '已选']"
                                    v-model="mediid"
                                    :data="mediList">
                            </el-transfer>
                        </el-form-item>
                        <el-form-item label="医药费" prop="money">
                            <el-input type="text" v-model="setForm.money"></el-input>
                        </el-form-item>
                        <el-form-item label="说明" prop="sm">
                        <el-input type="text" v-model="setForm.sm"></el-input>
                        </el-form-item>
                        <el-form-item label="建议" prop="tip">
                            <el-input type="text" v-model="setForm.tip"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addVform">确 定</el-button>
                        <el-button @click="dialog = false">取 消</el-button>
                      </span>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
    <el-row v-else type="flex" justify="center">
      <el-col>
        <h1>您没有正在接诊的病人，请先接诊病人</h1>
      </el-col>
    </el-row>
    <el-button @click="dialog = true" style="position: fixed;bottom: 60px;right: 50px; z-index: 100;" type="primary">开就诊单</el-button>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "ReceptionManagetion",
    data() {
      return {
        data: [],
        hasData: false,
        dialogVisible: false,
        dialog: false,
        fileid: '',
        setForm: [],
        mediList: [],
        mediid: [],
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        }
      }
    },
    created() {
      this.getReception();
      this.selectMedi();
    },
    methods: {
      addVform() {
        var self = this;
        if (self.fileid === '') {
          self.$message.error('请先更新病历本');
          self.dialog = !self.dialog
          return
        }
        axios.post('http://localhost:9091/hvs/vform/addVform',{
          doctor: self.$store.state.user.userid,
          patient: self.data.patient,
          disease: self.setForm.disease,
          cause: self.setForm.cause,
          mediid: JSON.stringify(self.mediid),
          money: self.setForm.money,
          sm: self.setForm.sm,
          tip: self.setForm.tip,
          processid: self.data.processid
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('开就诊单成功');
            self.getReception();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
        self.dialog = !self.dialog
      },
      selectMedi() {
        var self = this;
        axios.post('http://localhost:9091/hvs/medi/selectMedi').then(function(res){
          self.mediList = res.data
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      updateFileid() {
        var self = this;
        axios.post('http://localhost:9091/hvs/process/updateFileid', {
          fileid: self.fileid,
          processid: self.data.processid
        }).then(function(res){
          if (res.data.success) {
            self.getReception()
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
        self.dialogVisible = !self.dialogVisible
      },
      upload() {
        this.dialogVisible = !this.dialogVisible
      },
      getReception() {
        var self = this;
        axios.post('http://localhost:9091/hvs/process/getReception', {
          userid: self.$store.state.user.userid
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
      }
    }
  }
</script>

<style scoped>
span.el-checkbox__input{
    left: 10px;
}
</style>
