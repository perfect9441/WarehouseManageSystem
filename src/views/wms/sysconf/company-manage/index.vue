<template>
  <div style="margin:30px;">
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <el-button type="primary" icon="el-icon-plus" @click="addpage()">添加公司</el-button>

          <el-button type="primary" icon="el-icon-setting">批量操作</el-button>

          <el-button type="primary" icon="el-icon-delete">批量删除</el-button>
        </el-row>
      </el-header>
      <el-main class="content-bar">
        <vxe-table
          border="inner"
          :align="allAlign"
          :data="companyList"
          @checkbox-all="selectAllEvent"
          @checkbox-change="selectChangeEvent"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="companyName" title="companyName"></vxe-table-column>
          <vxe-table-column field="companyCode" title="companyCode"></vxe-table-column>
          <vxe-table-column field="companyUser" title="companyUser"></vxe-table-column>
          <vxe-table-column title="操作">
            <template v-slot="{ row }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
              </template>
              <template v-else>
                <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          :loading="loading"
          :current-page="tablePage.currentPage"
          :page-size="tablePage.pageSize"
          :total="tablePage.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange"
        ></vxe-pager>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getCompanyPage } from "@/api/wms/company/company";

export default {
  name: "companyManage",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      allAlign: null,
      companyList: [],
      tablePage: {
        current: 1,
        size: 10
      },
      loading: false
    };
  },
  created() {
    this._getCompanyPage(this.tablePage);
  },
  methods: {
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage;
      this.tablePage.pageSize = pageSize;
      this.findList();
    },
    addpage() {
      this.saveormodify("add");
    },
    saveormodify(companyid) {
      this.$router.push({
        name: "CompanyInfo",
        params: { id: companyid }
      });
    },
    _getCompanyPage(data) {
      getCompanyPage(data).then(res => {
        if (res.status === 200) {
          this.companyList = res.data.records;
        }
      });
    },
    selectAllEvent({ checked, records }) {
      console.log(checked ? "所有勾选事件" : "所有取消事件", records);
    },
    selectChangeEvent({ checked, records }) {
      console.log(checked ? "勾选事件" : "取消事件", records);
    }
  }
};
</script>

<style scope>
.button-bar {
  background-color: #ebebeb;
  border-radius: 10px;
  padding: 10px;
}
.content-bar {
  margin-top: 10px;
  background-color: #ebebeb;
  border-radius: 10px;
  padding: 10px;
  height: 500px;
}
</style>
