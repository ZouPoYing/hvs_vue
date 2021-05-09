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
                    <el-form :model="setForm" ref="setForm" label-width="100px" class="demo-ruleForm" enctype="multipart/form-data">
                        <el-form-item label="病名" prop="disease">
                            <el-input type="text" v-model="setForm.disease"></el-input>
                        </el-form-item>
                        <el-form-item label="病因" prop="cause">
                            <el-input type="text" v-model="setForm.cause"></el-input>
                        </el-form-item>
                        <el-form-item label="选药">
                            <el-button @click="addMedi" style="left: 20px" type="success" icon="el-icon-plus" circle></el-button>
                        </el-form-item>
                        <el-form-item
                                v-for="(domain, index) in setForm.domains"
                                :label="'药品' + index"
                                :key="domain.key"
                                :prop="'domains.' + index + '.value'">
                            <el-select @change="changeM" filterable v-model="domain.value" placeholder="请选择">
                                <el-option
                                        v-for="item in mediList"
                                        :key="item.key"
                                        :label="item.label"
                                        :value="item.label"
                                        :num="item.num"
                                        :money="item.money">
                                </el-option>
                            </el-select>
                            <el-input-number @change="changeM" v-model="domain.num" :precision="0" :min="1" label="描述文字"></el-input-number>
                            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
                        </el-form-item>
                        <el-form-item label="剂数">
                            <el-input-number @change="changeM" v-model="setForm.ji" :precision="0" :min="1" label="描述文字"></el-input-number>
                        </el-form-item>
<!--                        <el-form-item label="选药" prop="mediid">-->
<!--                            <el-transfer-->
<!--                                    filterable-->
<!--                                    :filter-method="filterMethod"-->
<!--                                    filter-placeholder="请输入药名"-->
<!--                                    :titles="['全部的药', '已选']"-->
<!--                                    v-model="mediid"-->
<!--                                    :data="mediList">-->
<!--                            </el-transfer>-->
<!--                        </el-form-item>-->
                        <el-form-item label="服药说明" prop="sm">
                        <el-input type="text" v-model="setForm.sm"></el-input>
                        </el-form-item>
                        <el-form-item label="医嘱" prop="tip">
                            <el-input type="text" v-model="setForm.tip"></el-input>
                        </el-form-item>
                        <el-form-item label="医药费" prop="money">
                            <el-input disabled="true" type="text" v-model="setForm.money"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addVform">确 定</el-button>
                        <el-button type="primary" @click="getMoney">计算医药费</el-button>
                        <el-button type="primary" @click="goPrint">打 印</el-button>
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
    <div v-if="print" id="printCons">
        <el-row>
            <el-col>
                <p class="cf">桂林卫生院处方筏</p>
            </el-col>
        </el-row>
        <divider></divider>
        <el-row type="flex" justify="center">
            <el-col :span="6">
                <p class="cf">患者编号：{{data.userid}}</p>
            </el-col>
            <el-col :span="6">
                <p class="cf">姓名：{{data.name}}</p>
            </el-col>
            <el-col :span="6">
                <p class="cf">性别：{{data.sex}}</p>
            </el-col>
            <el-col :span="6">
                <p class="cf">年龄：{{data.age}}</p>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="6">
                <p class="cf">日期：{{date}}</p>
            </el-col>
            <el-col :span="6">
                <p class="cf">联系电话：{{data.telephone}}</p>
            </el-col>
            <el-col :span="6">
                <p class="cf">邮箱：{{data.email}}</p>
            </el-col>
            <el-col :span="6">
                <p class="cf">地址：{{data.address}}</p>
            </el-col>
        </el-row>
        <divider></divider>
        <el-row type="flex" justify="center">
            <el-col :span="4"><p class="cf">病名：</p></el-col>
            <el-col :span="20">
                <p class="cf">{{setForm.disease}}</p>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="4"><p class="cf">病因：</p></el-col>
            <el-col :span="20">
                <p class="cf">{{setForm.cause}}</p>
            </el-col>
        </el-row>
        <divider></divider>
        <el-row type="flex" justify="center">
            <el-col :span="12"><p class="cf" style="text-align: left;padding-left: 40px;">RP</p></el-col>
            <el-col :span="12"><p class="cf" style="text-align: right;padding-right: 40px;">{{setForm.ji}}剂</p></el-col>
        </el-row>
        <p class="cf">注：中药的单位为g，其他药看具体规格，盒装为盒，袋装为袋，吊瓶为瓶...</p>
        <el-row type="flex" justify="center" v-for="(item,index) in setForm.domains" :key="index" v-if='index%2==0'>
            <el-col :span="12">
                <p class="cf">{{item.value}} {{item.num}}</p>
            </el-col>
            <el-col :span="12" v-if='index+1<setForm.domains.length'>
                <p class="cf">{{setForm.domains[index+1].value}} {{setForm.domains[index+1].num}}</p>
            </el-col>
        </el-row>
        <divider></divider>
        <el-row type="flex" justify="center">
            <el-col :span="4"><p class="cf">服药说明：</p></el-col>
            <el-col :span="20">
                <p class="cf">{{setForm.sm}}</p>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="4"><p class="cf">医嘱：</p></el-col>
            <el-col :span="20">
                <p class="cf">{{setForm.tip}}</p>
            </el-col>
        </el-row>
        <divider></divider>
        <el-row type="flex" justify="center">
            <el-col :span="12">
                <p class="cf">医药费：{{setForm.money}}</p>
            </el-col>
            <el-col :span="12">
                <p class="cf">医生签名：{{data.doctorName}}</p>
            </el-col>
        </el-row>
    </div>
  </div>
</template>

<script>
    import printJS from "print-js";
  import axios from "axios";
    import Divider from "../../common/divider/Divider";

  export default {
    name: "ReceptionManagetion",
    components: {Divider},
    data() {
      return {
        date: '',
        data: [],
        hasData: false,
        dialogVisible: false,
        dialog: false,
        print: false,
        fileid: '',
        setForm: {
          domains: [{
            value: '',
            num: 1
          }],
          ji: 1,
          money: ''
        },
        mediList: [],
        mediid: [],
        name: this.$store.state.user.name,
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        }
      }
    },
    created() {
      this.getReception();
      this.selectMedi();
      this.getDate();
    },
    methods: {
      getMoney() {
        var self = this
        axios.post('http://localhost:9091/hvs/vform/getMoney',{
          domains: JSON.stringify(self.setForm.domains),
          ji: self.setForm.ji
        }).then(function(res){
          if (res.data.success) {
            self.setForm.money = res.data.money
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      goPrint(){
        printJS({
          printable: 'printCons',
          type: 'html',
          targetStyles: ['*'],
          ignoreElements:['no-print','bc','gb']
        })
        this.print = !this.print
      },
      changeM() {
        this.setForm.money = ''
      },
      removeDomain(item) {
        var index = this.setForm.domains.indexOf(item)
        if (index !== -1) {
          this.setForm.domains.splice(index, 1)
        }
        this.setForm.money = ''
      },
      addMedi() {
        this.setForm.domains.push({
          value: '',
          key: Date.now()
        });
        this.setForm.money = ''
      },
      addVform() {
        var self = this;
        // if (self.fileid === '') {
        //   self.$message.error('请先更新病历本');
        //   self.dialog = !self.dialog
        //   return
        // }
        if (self.setForm.money === '' || self.setForm.money === undefined) {
          self.$message.error('请先获取医药费');
          return
        }
        axios.post('http://localhost:9091/hvs/vform/addVform',{
          doctor: self.$store.state.user.userid,
          patient: self.data.patient,
          disease: self.setForm.disease,
          cause: self.setForm.cause,
          money: self.setForm.money,
          sm: self.setForm.sm,
          tip: self.setForm.tip,
          processid: self.data.processid,
          domains: JSON.stringify(self.setForm.domains),
          ji: self.setForm.ji
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
      },
      getDate() {
        const nowDate = new Date();
        let date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
        }
        let systemDate = date.year + '-' + 0 + date.month + '-' + 0 + date.date;
        this.date = systemDate
      }
    }
  }
</script>

<style scoped>
span.el-checkbox__input{
    left: 10px;
}
.el-checkbox__input{
    left: 10px;
}
#printCons{
    width: 700px;
    border: 1px solid black;
}
.cf{
    margin: 20px 0 20px 0;
    font-size: 20px;
}
</style>
