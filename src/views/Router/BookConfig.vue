<template>
    <div>
        <h1>病历本模板配置</h1>
        <el-row type="flex">
            <el-col :span="18" pull="5">
                <el-button
                        size="mini"
                        type="primary"
                        @click="add">新增</el-button>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="18">
                <el-table
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column
                            type="index"
                            :index="indexMethod">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="上传时间"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="filename"
                            label="模板名">
                    </el-table-column>
                    <el-table-column
                            prop="px"
                            label="是否使用">
                    </el-table-column>
                    <el-table-column
                            prop="action"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="primary"
                                    @click="handleEdit(scope.row)">修改</el-button>
                            <el-button
                                    size="mini"
                                    type="primary"
                                    @click="handleDelete(scope.row)">删除</el-button>
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
                        <el-form-item label="模板名" prop="filename">
                            <el-input maxlength="10" type="text" v-model="setForm.filename"></el-input>
                        </el-form-item>
                        <el-upload
                                class="upload-demo"
                                ref="upload"
                                action
                                :limit="1"
                                :http-request="handleUploadForm"
                                :on-remove="handleRemove"
                                :auto-upload="true">
                            <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
                        </el-upload>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addSet">确 定</el-button>
                        <el-button @click="dialogVisible = false">取 消</el-button>
                    </span>
                </el-dialog>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="18">
                <el-dialog
                        title="修改"
                        :visible.sync="dialog"
                        width="30%">
                    <el-form label-width="100px" class="ruleForm" enctype="multipart/form-data">
                        <el-form-item label="模板名" prop="filename">
                            <el-input maxlength="10" type="text" v-model="editFormfilename"></el-input>
                        </el-form-item>
                        <el-form-item label="是否使用" prop="px">
                            <el-radio-group v-model="editFormpx">
                                <el-radio label="是" border>是</el-radio>
                                <el-radio label="否" border>否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="editSet">确 定</el-button>
                        <el-button @click="dialog = false">取 消</el-button>
                    </span>
                </el-dialog>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "BookConfig",
    data() {
      return {
        tableData: [],
        setForm: [],
        editFormfilename: '',
        editFormpx: '',
        dialogVisible: false,
        dialog: false,
        fileid: '',
        id: ''
      }
    },
    created() {
      this.getSet();
    },
    methods: {
      getSet() {
        var self = this
        axios.post('http://localhost:9091/hvs/set/listSet').then(function(res){
          self.tableData = res.data
          self.changePX();
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      indexMethod(index) {
        return index + 1;
      },
      add() {
        this.dialogVisible = !this.dialogVisible
      },
      addSet() {
        var self = this;
        axios.post('http://localhost:9091/hvs/set/addSet', {
          filename: self.setForm.filename,
          fileid: self.fileid
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('配置成功');
            self.getSet();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      handleRemove() {
        this.$message.success('文件移除成功');
        this.fileid = ''
      },
      handleUploadForm(param) {
        var self = this
        let formData = new FormData();
        formData.append('userid', this.$store.state.user.userid)
        formData.append('file', param.file)
        axios.post('http://localhost:9091/hvs/set/upload',formData).then(function(res){
          self.$message.success('文件上传成功');
          self.fileid = res.data;
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      handleDelete(row) {
        var self = this
        axios.post('http://localhost:9091/hvs/set/deleteSet', {
          id: row.id
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('删除成功');
            self.getSet();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      handleEdit(row) {
        this.editFormfilename = row.filename
        this.editFormpx = row.px
        this.id = row.id
        this.dialog = !this.dialog
      },
      editSet() {
        var self = this
        axios.post('http://localhost:9091/hvs/set/updateSet', {
          id: self.id,
          filename: self.editFormfilename,
          px: self.editFormpx
        }).then(function(res){
          if (res.data.success) {
            self.$message.success('修改成功');
            self.getSet();
          } else {
            self.$message.error(res.data.msg);
          }
        }).catch(function(err){
          self.$message.error(err);
        })
        self.dialog = !self.dialog
      },
      changePX() {
        var self = this
        self.tableData.forEach(function(item) {
          if (item.px === 0) {
            item.px = '否'
          } else {
            item.px = '是'
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>