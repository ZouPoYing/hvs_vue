<template>
    <div>
        <h1>统计</h1>
        <el-row type="flex" justify="center">
            <el-col :span="4">
                <p>统计维度：</p>
            </el-col>
            <el-col :span="10">
                时间：
<!--                <el-date-picker-->
<!--                        @change="change"-->
<!--                        v-model="tjdate"-->
<!--                        type="date"-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        placeholder="选择日期">-->
<!--                </el-date-picker>-->
              <el-date-picker
                @change="change"
                v-model="tjdate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
<!--                <el-select @change="change" v-model="tjdate" placeholder="请选择">-->
<!--                    <el-option-->
<!--                            v-for="item in options1"-->
<!--                            :key="item.value"-->
<!--                            :label="item.label"-->
<!--                            :value="item.value">-->
<!--                    </el-option>-->
<!--                </el-select>-->
            </el-col>
            <el-col :span="5">
                部门：
                <el-select @change="changeBM" v-model="tjdepartment" placeholder="请选择">
                    <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="5">
                医生：
                <el-select @change="change" v-model="tjdoctor" placeholder="请选择">
                    <el-option
                            v-for="item in options3"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <!-- 图表 -->
        <el-row type="flex" justify="center">
            <el-col :span="12">
                <div id="myChart" :style="{width:'100%',height:'600px'}"></div>
                <span style="margin-left: 120px">各阶段就诊人数统计柱状图</span>
            </el-col>
            <el-col :span="12">
                <div id="pieChart" :style="{width:'100%',height:'600px'}"></div>
                <span style="margin-left: 120px">各阶段就诊人数统计饼状图</span>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import * as echarts from "echarts";
    import axios from "axios"
  export default {
    name: "Statistics",
    data() {
      return {
        tjdate: '',
        tjdepartment: '全部',
        tjdoctor: '全部',
        options1: [{
          value: '全部',
          label: '全部'
        }, {
          value: '今天',
          label: '今天'
        }],
        options2: [],
        options3: [],
        chartZ: [],
        chartB: [],
        dataX: [],
        dataY: []
      }
    },
    created() {
      this.getTJDepartment();
      this.getTJDoctor();
      this.getStatistics();
      this.getStatisticsPie();
    },
    methods: {
      initChart() {
        var myChart = echarts.init(document.getElementById('myChart'));
        myChart.setOption({
          xAxis: {
            type: 'category',
            data: this.dataX
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.dataY,
            type: 'bar' //pie饼 line线
          }]
        })
      },
      initChartPie() {
        var self = this
        var pieChart = echarts.init(document.getElementById('pieChart'));
        pieChart.setOption({
          series: [{
            data: self.chartB,
            type: 'pie', //饼 line线
            radius : '55%',
            center: ['50%', '60%'],
            itemStyle: {
              normal: {
                label:{
                  show: true,
                  formatter: '{b}:{c}({d}%)'
                },
                labelLine :{show:true}
              }
            }
          }]
        })
      },
      initChartDate() {
        var self = this
        self.dataX = []
        self.dataY = []
        self.chartZ.forEach(function(item) {
          self.dataX.push(item.step)
          self.dataY.push(item.num)
        })
        self.initChart();
      },
      getStatisticsPie() {
        var self = this
        axios.post('http://localhost:9091/hvs/user/getStatisticsPie', {
          tjdate: JSON.stringify(self.tjdate),
          tjdepartment: self.tjdepartment,
          tjdoctor: self.tjdoctor
        }).then(function(res){
          self.chartB = res.data
          self.initChartPie()
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      getStatistics() {
        var self = this
        axios.post('http://localhost:9091/hvs/user/getStatistics', {
          tjdate: JSON.stringify(self.tjdate),
          tjdepartment: self.tjdepartment,
          tjdoctor: self.tjdoctor
        }).then(function(res){
          self.chartZ = res.data
          self.initChartDate()
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      change() {
        this.getStatistics();
        this.getStatisticsPie();
      },
      changeBM() {
        this.getTJDoctor();
        this.getStatistics();
        this.getStatisticsPie();
      },
      getTJDoctor() {
        var self = this
        axios.post('http://localhost:9091/hvs/user/getTJDoctor',{
          department: self.tjdepartment
        }).then(function(res){
          self.options3 = res.data
        }).catch(function(err){
          self.$message.error(err);
        })
      },
      getTJDepartment() {
        var self = this
        axios.post('http://localhost:9091/hvs/user/getTJDepartment').then(function(res){
          self.options2 = res.data
        }).catch(function(err){
          self.$message.error(err);
        })
      }

    }
  }
</script>

<style scoped>

</style>
