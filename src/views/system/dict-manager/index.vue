<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">数据字典管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <vxe-input clearable v-model="queryList.dictCode" type="search" placeholder="输入代码"></vxe-input>
        <vxe-input clearable v-model="queryList.dictType" type="search" placeholder="输入分类"></vxe-input>
        <vxe-select clearable v-model="queryList.sysId" placeholder="选择系统">
          <vxe-option
            v-for="(item,index) in systemList"
            :key="index"
            :value="item.sysId"
            :label="item.sysName"
          ></vxe-option>
        </vxe-select>
        <vxe-button @click="_getPage">搜索</vxe-button>
        <vxe-button icon="fa fa-plus" @click="insertEvent">新增</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table 
      ref="xTable"
      border
      show-header-overflow
      show-overflow
      highlight-hover-row
      max-height="500"
      keep-source
      :data="dataList"
      :loading="tableLoading"
      :edit-rules="validRules"
      :edit-config="{trigger: 'manual', mode: 'row'}"
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column
        field="dictName"
        title="名称"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="dictDesc"
        title="描述"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="dictCode"
        title="代码"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="dictType"
        title="分类"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="sysId"
        title="所属系统"
        :edit-render="{name: '$select', options: systemList,optionProps:{value:'sysId',label:'sysName'}}"
      ></vxe-table-column>
      <vxe-table-column 
        field="dictValue"
        title="值"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="200">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button icon="vxe-icon--edit-outline " @click="editRowEvent(row)">编辑</vxe-button>
            <vxe-button @click="deleteRowEvent(row)" status="danger">删除</vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      background
      :current-page.sync="queryList.current"
      :page-size.sync="queryList.size"
      :total="total"
      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
      @page-change="_getPage"
    ></vxe-pager>
  </div>
</template>

<script>
import { getSysPage } from "@/api/system";
import {
  getDictPageByAttributes,
  saveOrModifyDict,
  removeDict
} from "@/api/dict";
import { mapGetters } from "vuex";

export default {
  name: "DictManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      tableLoading: false,
      systemList: [],
      queryList: {
        current: 1,
        size: 10,
        dictType: null,
        sysId: null,
        dictCode: null,
        dictType: null
      },
      dataList: [],
      total: 0,
      pages: 0,
      validRules: {
        dictName: [{ required: true, message: "名称必须填写" }],
        dictCode: [{ required: true, message: "代码必须填写" }],
        dictType: [{ required: true, message: "分类必须填写" }],
        sysId: [{ required: true, message: "所属系统必须选择" }]
      }
    };
  },
  methods: {
    async insertEvent() {
      let record = {};
      let { row } = await this.$refs.xTable.insert(record);
      // console.info(newRow)
      await this.$refs.xTable.setActiveRow(row);
    },
    async saveRowEvent(row) {
      let selectRecords = [];

      const errMap = await this.$refs.xTable
        .validate(row)
        .catch(errMap => errMap);
      console.info(errMap);
      if (errMap) {
        return;
      }

      this.$refs.xTable.clearActived().then(() => {
        this.tableLoading = true;
        try {
          row.sysName = this.systemList.find(
            item => item.sysId === row.sysId
          ).sysName;
          console.info(row);
        } catch (err) {
          this.tableLoading = false;
          this.$XModal.message({ message: "保存失败！", status: "error" });
          return;
        }
        saveOrModifyDict(row)
          .then(res => {
            console.info("saveOrModifyDict");
            console.info(res);
            if (!row.dictId) {
              row.dictId = res.data.dictId;
              row.version = res.data.version;
            }
            this.tableLoading = false;
            this.$XModal.message({ message: "保存成功！", status: "success" });
          })
          .catch(err => {
            this.tableLoading = false;
            this.$XModal.message({ message: "保存失败！", status: "error" });
          });
      });
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable;
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row);
      });
    },
    editRowEvent(row) {
      console.info(row);
      this.$refs.xTable.setActiveRow(row);
    },
    deleteRowEvent(row) {
      this.$XModal.confirm("您确定要删除该数据?").then(type => {
        if (type === "confirm") {
          if (row.dictId) {
            removeDict(row.dictId).then(res => {
              console.info("removeDict");
              console.info(res);
              this.$refs.xTable.remove(row);
            });
          } else {
            this.$refs.xTable.remove(row);
          }
        }
      });
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getDictPageByAttributes(this.queryList)
          .then(res => {
            console.info("getDictPage");
            console.info(res);
            this.dataList = res.data.records;
            this.total = res.data.total;
            this.pages = res.data.pages;
            this.tableLoading = false;
            resolve();
          })
          .catch(err => {
            this.tableLoading = false;
            reject();
          });
      });
    }
  },
  created() {
    this._getPage();
    getSysPage().then(res => {
      console.info("getSysPage");
      console.info(res);
      this.systemList = res.data.records;
    });
  }
};
</script>

<style>
</style>
