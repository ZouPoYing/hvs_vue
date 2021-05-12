<template>
    <div>
      <h1>处方查看</h1>
      <el-row type="flex" justify="center">
        <el-col>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              type="index">
            </el-table-column>
            <el-table-column
              prop="name"
              label="患者姓名">
            </el-table-column>
            <el-table-column
              prop="disease"
              label="病名">
            </el-table-column>
            <el-table-column
              prop="cause"
              label="病因">
            </el-table-column>
            <el-table-column
              prop="money"
              label="医药费">
            </el-table-column>
            <el-table-column
              prop="sm"
              label="医药费说明">
            </el-table-column>
            <el-table-column
              prop="tip"
              label="医嘱">
            </el-table-column>
            <el-table-column
              prop="processstep"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="date"
              label="开就诊单时间">
            </el-table-column>
            <el-table-column
              label="操作"
              width="220">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="goPrint(scope.row)">打印</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div v-if="print" id="printCons">
        <el-row>
          <el-col>
            <p class="cf">桂林卫生院处方筏</p>
          </el-col>
        </el-row>
        <divider></divider>
        <el-row type="flex" justify="center">
          <el-col :span="6">
            <p class="cf">患者编号：{{data.username}}</p>
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
        <el-row type="flex" justify="center" v-for="(item,index) in cfdetail" :key="index" v-if='index%2==0'>
          <el-col :span="12">
            <p class="cf">{{item.mediname}} {{item.medinum}}</p>
          </el-col>
          <el-col :span="12" v-if='index+1<cfdetail.length'>
            <p class="cf">{{cfdetail[index+1].mediname}} {{cfdetail[index+1].medinum}}</p>
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
            <p class="cf">医生签名：{{user.name}}</p>
          </el-col>
        </el-row>
      </div>
    </div>
</template>

<script>
    import axios from "axios";
    import printJS from "print-js";
    import Divider from "../../common/divider/Divider";

    export default {
        name: "viewCf",
      data() {
          return{
            tableData: [],
            data: [],
            date: '',
            setForm: [],
            print: false,
            name: this.$store.state.user.name,
            cfdetail: [],
            user: []
          }
      },
      created() {
        this.getMyCf();
        this.getDate();
        this.getUser();
      },
      methods: {
        getUser() {
          var self = this;
          axios.post('http://localhost:9091/hvs/user/getUserById', {
            userid: this.$store.state.user.userid
          }).then(function(res){
            self.user = res.data
          }).catch(function(err){
            self.$message.error(err);
          })
        },
        goPrint(row){
          this.getMyCfdetail(row.cfid)
          this.data = row
          this.setForm = row
          printJS({
            printable: 'printCons',
            type: 'html',
            targetStyles: ['*'],
            ignoreElements:['no-print','bc','gb']
          })
          this.print = !this.print
        },
          getMyCf() {
            var self = this
            axios.post('http://localhost:9091/hvs/vform/getMyCf',{
              doctor: self.$store.state.user.userid
            }).then(function(res){
              self.tableData = res.data
            }).catch(function(err){
              self.$message.error(err);
            })
          },
        getMyCfdetail(cfid) {
          var self = this
          axios.post('http://localhost:9091/hvs/vform/getMyCfdetail',{
            cfid: cfid
          }).then(function(res){
            self.cfdetail = res.data
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
  #printCons{
    width: 700px;
    border: 1px solid black;
  }
  .cf{
    margin: 20px 0 20px 0;
    font-size: 20px;
  }
</style>
