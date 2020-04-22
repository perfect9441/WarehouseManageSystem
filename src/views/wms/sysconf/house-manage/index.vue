<template>
  <div style="margin:30px;">
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <el-button type="primary" icon="el-icon-plus" @click="addpage()">添加仓库</el-button>

          <el-button type="primary" icon="el-icon-setting">批量操作</el-button>

          <el-button type="primary" icon="el-icon-delete">批量删除</el-button>
        </el-row>
      </el-header>
      <el-main class="content-bar">
        <vxe-table
          border="inner"
          :align="allAlign"
          :data="warehouseList"
          @checkbox-all="selectAllEvent"
          @checkbox-change="selectChangeEvent"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="warehouseName" title="仓库名称"></vxe-table-column>
          <vxe-table-column field="warehouseCode" title="仓库代码"></vxe-table-column>
          <vxe-table-column field="company.companyName" title="仓库所属公司"></vxe-table-column>
          <vxe-table-column field="warehouseUser" title="仓库联系人"></vxe-table-column>
          <vxe-table-column field="warehouseTel" title="仓库联系电话"></vxe-table-column>
          <vxe-table-column field="warehouseAddr" title="仓库地址"></vxe-table-column>
          <vxe-table-column field="warehouseClassify" title="仓库类型" :formatter="fmthouseClassify"></vxe-table-column>
          <vxe-table-column field="useFlg" title="使用状态" :formatter="fmtuseflg"></vxe-table-column>
          <vxe-table-column title="操作">
            <template v-slot="{ row }">
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
import { getWarehousePage,getWarehousePageCarryCompany } from "@/api/wms/warehouse/warehouse";

export default {
  name: "HouseManage",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      allAlign: null,
      loading: false,
      tablePage: {
        current: 1,
        size: 10,
        total: 0
      },
      warehouseList: [],
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
      warehouseClassify: [
        {
          value: "ZCQ",
          label: "总公司仓库"
        },
        {
          value: "SCQ",
          label: "省级分公司仓库"
        },
        {
          value: "CCQ",
          label: "市级分公司仓库"
        },
        {
          value: "QXCQ",
          label: "区县级分公司仓库"
        },
        {
          value: "XSDCQ",
          label: "乡镇、社区销售点仓库"
        }
      ],
    };
  },
  created() {
    this._getWarehousePageCarryCompany(this.tablePage);
  },
  methods: {
    handlePageChange({ current, size }) {
      this.tablePage.current = current;
      this.tablePage.size = size;
      this.findList();
    },
    _getWarehousePage(data) {
      getWarehousePage(data).then(res => {
        if (res.status === 200) {
          this.warehouseList = res.data.records;
        }
      });
    },
    _getWarehousePageCarryCompany(data){
      getWarehousePageCarryCompany(data).then(res=>{
        if(res.status === 200){
           this.warehouseList = res.data.records;
        }
      })
    },
    addpage() {
      this.saveormodify("add")
    },
    saveormodify(warehouseId) {
      this.$router.push({
        name: "HouseInfo",
        params: { id: warehouseId }
      });
    },
    selectAllEvent({ checked, records }) {
      console.log(checked ? "所有勾选事件" : "所有取消事件", records);
    },
    selectChangeEvent({ checked, records }) {
      console.log(checked ? "勾选事件" : "取消事件", records);
    },
    fmtuseflg({ cellValue }) {
      let item = this.useFlg.find(item => item.value === cellValue);
      return item ? item.label : "";
    },
    fmthouseClassify({ cellValue }) {
      let item = this.warehouseClassify.find(item => item.value === cellValue);
      return item ? item.label : "";
    },
    editRowEvent(row) {
      this.saveormodify(row.warehouseId);
    },
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
