<template>
  <div class="fillcontain">
    <el-form :inline="true" :model="search_data" ref="search_data">
      <el-form-item label="按时间筛选:">
        <el-date-picker v-model="search_data.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>--
        <el-date-picker v-model="search_data.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" size="small" icon="search">筛选</el-button>
      </el-form-item>

      <el-form-item class="btnRight">
        <el-button
          type="primary"
          size="small"
          icon="search"
          v-if="user.identity =='manager'"
          @click="handleAdd"
        >添加</el-button>
      </el-form-item>
    </el-form>
    <div class="table-container">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-if="allTableData.length"
        class="btnRight"
        max-height="450"
      >
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="date" label="创建时间" width="250"></el-table-column>
        <el-table-column prop="type" label="收支类型" align="center" width="80"></el-table-column>
        <el-table-column prop="describe" label="收支描述" align="center" width="80"></el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="70"></el-table-column>
        <el-table-column prop="expend" label="支出" align="center" width="70">
          <template slot-scope="scope">
            <span style="color:#f56767">- {{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="账户现金" align="center" width="100">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="200"></el-table-column>

        <el-table-column label="操作" v-if="user.identity =='manager'">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <el-row> -->
      <el-col :span="24">
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="paginations.page_index"
            :page-sizes="paginations.page_sizes"
            :page-size="paginations.page_size"
            :layout="paginations.layout"
            :total="paginations.total"
          ></el-pagination>
        </div>
      </el-col>
      <!-- </el-row> -->
    </div>

    <!-- 弹框 -->
    <Dialog :dialog="dialog" :formData="formData" @update:fundlist="getProfiles"></Dialog>
  </div>
</template>

<script>
import Dialog from "../components/Dialog";

export default {
  name: "fund-list",
  data() {
    return {
      search_data: {
        startTime: "",
        endTime: ""
      },
      paginations: {
        page_sizes: [5, 10, 15, 20],
        page_size: 5,
        page_index: 1,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0
      },
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog: {
        show: false,
        option: ""
      },
      formData: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      }
    };
  },
  components: {
    Dialog
  },
  created() {
    this.getProfiles();
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  },
  methods: {
    getProfiles() {
      this.$axios.get("/api/profile").then(res => {
        this.allTableData = res.data;
        this.filterTableData = res.data;
        // 设置分页
        this.setPaginations();
      });
    },
    handleEdit(index, row) {
      // console.log(row);
      this.dialog = {
        title: "编辑资金信息",
        show: true,
        option: "edit"
      };
      this.formData = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
    },
    handleDelete(index, row) {
      console.log(row);
      this.$axios.delete(`/api/profile/delete/${row._id}`).then(
        res => {
          this.$message("数据删除成功");
          this.getProfiles();
        },
        err => {
          console.log(err);
        }
      );
    },
    handleAdd() {
      this.dialog = {
        title: "修改资金信息",
        show: true,
        option: "add"
      };
    },
    handleSizeChange(page_size) {
      // 切换每页size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;

      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size;
      });
    },
    handleCurrentChange(page) {
      // 切换当前页
      let index = this.paginations.page_size * (page - 1);
      let nums = this.paginations.page_size * page;
      let tables = [];
      for (let i = index; i < nums; i++) {
        if (this.allTableData[i]) {
          tables.push(this.allTableData[i]);
        }
        this.tableData = tables;
      }
    },
    setPaginations() {
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;

      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    handleSearch() {
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message({ type: "warning", message: "请选择时间区间" });
        // this.getProfiles();
        return;
      }
      const sTime = this.search_data.startTime.getTime();
      const eTime = this.search_data.endTime.getTime();
      // console.log(sTime);

      this.allTableData = this.filterTableData.filter(item => {
        //console.log(item);
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= sTime && time <= eTime;
      });

      // 分页数据调用
      this.setPaginations();
    }
  }
};
</script>

<style scoped>
.fillcontain {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>
