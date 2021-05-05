<template>
    <div>
        <h1>取药确认</h1>
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
                            prop="medinames"
                            label="药品">
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
                                    @click="downloadFile(scope.row)">下载病例本</el-button>
                            <el-button
                                    size="mini"
                                    type="primary"
                                    @click="qr(scope.row)">取药确认</el-button>
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
    name: "GiveMedi",
    data() {
      return {
        tableData: []
      }
    },
    created() {
      this.getMyVform();
    },
    methods: {
      qr(row) {
        var self = this
        axios.post('http://localhost:9091/hvs/process/updateP1',{
          processid: row.processid,
          patient: row.patient,
          userid: self.$store.state.user.userid
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('取药确认成功');
            self.getMyVform();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      downloadFile(row) {
        window.location.href='http://localhost:9091/hvs/set/downloadFile/' + row.filename;
      },
      getMyVform() {
        var self = this
        axios.post('http://localhost:9091/hvs/vform/getMyVform1',{
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