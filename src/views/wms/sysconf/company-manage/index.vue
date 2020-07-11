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
          <vxe-table-column field="companyName" title="公司名称"></vxe-table-column>
          <vxe-table-column field="companyCode" title="公司编码"></vxe-table-column>
          <vxe-table-column field="companyClassify" title="公司级别" :formatter="fmtcompanylevel"></vxe-table-column>
          <vxe-table-column field="parentCompany.companyName" title="所属上级公司"></vxe-table-column>
          <vxe-table-column field="companyUser" title="公司联系人"></vxe-table-column>
          <vxe-table-column field="companyTel" title="公司联系电话"></vxe-table-column>
          <vxe-table-column field="useFlg" title="是否使用:" :formatter="fmtuseflg"></vxe-table-column>
          <vxe-table-column title="操作">
            <template v-slot="{ row }">
              <template>
                <vxe-button @click="checkEvent(row)">查看详情</vxe-button>
              </template>
              <template>
                <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          :loading="loading"
          :current-page="tablePage.current"
          :page-size="tablePage.size"
          :total="tablePage.total"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange"
        ></vxe-pager>
      </el-main>
    </el-container>

    <el-dialog title="详细信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="dialog-context">

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getCompanyPage,
  getCompanyPageCarryParentCompany
} from "@/api/wms/company/company";

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
        size: 10,
        total: 0
      },
      loading: false,
      companyClassify: [
        {
          value: "ZGS",
          label: "总公司"
        },
        {
          value: "SGS",
          label: "省级分公司"
        },
        {
          value: "CGS",
          label: "市级分公司"
        },
        {
          value: "QXGS",
          label: "区县级分公司"
        },
        {
          value: "XSD",
          label: "乡镇、社区销售点"
        }
      ],
      useFlg: [
        {
          value: "use",
          label: "启用"
        },
        {
          value: "pause",
          label: "暂停使用"
        },
        {
          value: "abandon",
          label: "弃用"
        }
      ],
       dialogVisible: false
    };
  },
  created() {
    this._getCompanyPageCarryParentCompany(this.tablePage);
  },
  methods: {
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.current = currentPage;
      this.tablePage.size = pageSize;
      this._getCompanyPageCarryParentCompany(this.tablePage);
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
    _getCompanyPageCarryParentCompany(data) {
      getCompanyPageCarryParentCompany(data).then(res => {
        if (res.status === 200) {
          this.companyList = res.data.records;
          this.tablePage.total = res.data.total;
        }
      });
    },
    selectAllEvent({ checked, records }) {
      console.log(checked ? "所有勾选事件" : "所有取消事件", records);
    },
    selectChangeEvent({ checked, records }) {
      console.log(checked ? "勾选事件" : "取消事件", records);
    },
    editRowEvent(row) {
      this.saveormodify(row.companyId);
    },
    checkEvent(row) {
      console.info(row);
    },
    fmtcompanylevel({ cellValue }) {
      let item = this.companyClassify.find(item => item.value === cellValue);
      return item ? item.label : "";
    },
    fmtuseflg({ cellValue }) {
      let item = this.useFlg.find(item => item.value === cellValue);
      return item ? item.label : "";
    },
     handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
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
