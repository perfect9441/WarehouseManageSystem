<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">会员等级管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <vxe-select clearable v-model="queryList.vipType" placeholder="选择会员类型">
          <vxe-option
            v-for="(item,index) in vipTypeList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
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
      :edit-rules="validRules"
      :edit-config="{trigger: 'manual', mode: 'row'}"
      :data="dataList"
      :loading="tableLoading"
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column
        field="vipName"
        title="名称"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="vipDesc"
        title="描述"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>

      <vxe-table-column
        field="vipLevel"
        title="vip等级排序"
        :edit-render="{name: '$select', options: levelList,optionProps:{value:'value',label:'label'}}"
      >
        <template v-slot="{ row }">
          <el-tag type="info">{{'第'+row.vipLevel+'级'}}</el-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="vipType"
        title="分类"
        :edit-render="{name: '$select', options: vipTypeList,optionProps:{value:'dictCode',label:'dictName'}}"
      >
        <template v-slot="{ row }">
          <template v-if="row.vipType=='VIP_TYPE_COMMON'">
            <el-tag type="info">{{vipTypeMap[row.vipType]}}</el-tag>
          </template>
          <template v-else>
            <el-tag type="warning">{{vipTypeMap[row.vipType]}}</el-tag>
          </template>
        </template>
      </vxe-table-column>

      <vxe-table-column title="操作" width="300">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button icon="vxe-icon--edit-outline " @click="editRowEvent(row)">编辑</vxe-button>
            <vxe-button status="success" @click="gotoPrivilegeEvent(row)">权益</vxe-button>
            <vxe-button status="primary" @click="gotoRuleEvent(row)">规则</vxe-button>
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
import { getDictPageByAttributes } from "@/api/dict";
import { _getDictMap } from "@/utils/my-utils";
import {
  getVipPageByAttributes,
  saveOrModifyVip,
  removeVip
} from "@/api/mms/vip";

import { mapGetters } from "vuex";

export default {
  name: "VipManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      selectRow: null,
      levelList: [],
      tableLoading: false,
      vipTypeList: [],
      vipTypeMap: {},
      queryList: {
        current: 1,
        size: 10,
        vipType: null
      },
      dataList: [],
      total: 0,
      pages: 0,
      validRules: {
        vipName: [{ required: true, message: "名称必须填写" }],
        vipLevel: [{ required: true, message: "等级必须选择" }],
        vipType: [{ required: true, message: "类型必须选择" }]
      }
    };
  },
  methods: {
    gotoPrivilegeEvent(row) {
      this.$router.push({
        name: "VipPrivilegeManager",
        params: { id: row.vipId }
      });
    },
    gotoRuleEvent(row) {
      this.$router.push({
        name: "VipRuleManager",
        params: { id: row.vipId }
      });
    },
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
      if (errMap) {
        return;
      }
      let { hasThisLevel, data } = await this._getVipByLevel(
        row.vipType,
        row.vipLevel
      );

      if (hasThisLevel) {
        //查看查出来已有的等级是不是正在编辑的这个
        let isEditRow = data.find(item => {
          return item.vipId == this.selectRow.vipId;
        });
        if (!isEditRow) {
          this.$XModal.message({
            message: "该类型已有" + row.vipLevel + "级！请更换等级",
            status: "warning"
          });
          return;
        }
      }

      this.$refs.xTable.clearActived().then(() => {
        this.tableLoading = true;

        saveOrModifyVip(row)
          .then(res => {
            console.info("saveOrModifyVip");
            console.info(res);
            if (!row.vipId) {
              row.vipId = res.data.vipId;
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
      this.selectRow = null;
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable;
      this.selectRow = null;
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row);
      });
    },
    editRowEvent(row) {
      this.selectRow = row;
      console.info(row);
      this.$refs.xTable.setActiveRow(row);
    },
    deleteRowEvent(row) {
      this.$XModal.confirm("您确定要删除该数据?").then(type => {
        if (type === "confirm") {
          if (row.vipId) {
            removeVip(row.vipId).then(res => {
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
    _getVipByLevel(type, level) {
      return new Promise((resolve, rejevct) => {
        let params = {
          vipType: type,
          vipLevel: level
        };
        getVipPageByAttributes(params).then(res => {
          console.info(res);
          if (res.data.records.length == 0) {
            resolve({
              hasThisLevel: false,
              data: null
            });
          } else {
            resolve({
              hasThisLevel: true,
              data: res.data.records
            });
          }
        });
      });
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getVipPageByAttributes(this.queryList)
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
    let vipTypeParams = {
      dictType: "vip_type"
    };

    getDictPageByAttributes(vipTypeParams).then(res => {
      console.info("getDictPageByAttributes");
      console.info(res);
      this.vipTypeList = res.data.records;
      this.vipTypeMap = _getDictMap(this.vipTypeList);
    });
    for (let i = 1; i < 100; i++) {
      let item = {
        label: i,
        value: i
      };
      this.levelList.push(item);
    }
  }
};
</script>

<style>
</style>
