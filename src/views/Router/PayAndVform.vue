<template>
    <div>
        <h1>缴费&查看就诊单</h1>
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
                            label="医生姓名">
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
                            width="200">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="primary"
                                    @click="downloadFile(scope.row)">下载病例本</el-button>
                            <el-button
                                    size="mini"
                                    type="primary"
                                    @click="pay(scope.row)">缴费</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-dialog
                title="假装这是缴费二维码"
                :visible.sync="dialogVisible"
                width="30%">
            <el-image
                    style="width: 200px; height: 200px"
                    :src="require('../../assets/img/code.png')"></el-image>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="pay2">缴费</el-button>
                <el-button @click="dialogVisible = false">取消</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "payAndVform",
    data() {
      return {
        tableData: [],
        dialogVisible: false,
        processid: '',
        doctor: ''
      }
    },
    created() {
      this.getMyVform();
    },
    methods: {
      pay2() {
        var self = this
        axios.post('http://localhost:9091/hvs/process/updateP',{
          processid: self.processid,
          doctor: self.doctor,
          userid: self.$store.state.user.userid
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('缴费成功');
            self.getMyVform();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
        this.dialogVisible = !this.dialogVisible
      },
      pay(row) {
        this.processid = row.processid
        this.doctor = row.doctor
        this.dialogVisible = !this.dialogVisible
      },
      downloadFile(row) {
        window.location.href='http://localhost:9091/hvs/set/downloadFile/' + row.filename;
      },
      getMyVform() {
        var self = this
        axios.post('http://localhost:9091/hvs/vform/getMyVform',{
          userid: self.$store.state.user.userid
        }).then(function(res){
          self.tableData = res.data
        }).catch(function(err){
          self.$message.error(err);
        })
      }
    }
  }
</script>

<style scoped>

</style>