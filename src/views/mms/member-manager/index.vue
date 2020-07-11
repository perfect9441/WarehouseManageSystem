<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">会员管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <vxe-select clearable v-model="queryList.vipId" placeholder="选择会员等级">
          <vxe-option
            v-for="(item,index) in vipList"
            :key="index"
            :value="item.vipId"
            :label="item.vipName"
          ></vxe-option>
        </vxe-select>
        <vxe-button @click="_getPage">搜索</vxe-button>
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
      <vxe-table-column field="memberId" title="会员ID"></vxe-table-column>
      <vxe-table-column field="memNikname" title="昵称"></vxe-table-column>

      <vxe-table-column
        field="vipId"
        title="会员等级"
        :edit-render="{name: '$select', options: vipList,optionProps:{value:'vipId',label:'vipName'}}"
      ></vxe-table-column>

      <vxe-table-column field="vipExceedDate" title="会员失效日期" >
        <template v-slot="{ row }">
          <template v-if="row.vipExceedDate && row.vipExceedDate!='undefind'">{{formatDate(row.vipExceedDate)}}</template>
          <template v-else>
            <el-tag type="info">永久</el-tag>
          </template>
        </template> 
      </vxe-table-column>

      <vxe-table-column title="操作" width="200">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button icon="vxe-icon--edit-outline " @click="editRowEvent(row)">编辑</vxe-button>
            <vxe-button @click="detailEvent(row)" status="primary">详细</vxe-button>
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
import { getVipPageByAttributes } from "@/api/mms/vip";
import { getMemberPageByAttributes, modifyMember } from "@/api/mms/member";
import { mapGetters } from "vuex";

export default {
  name: "MemberManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      tableLoading: false,
      vipList: [],
      queryList: {
        current: 1,
        size: 10,
        vipId: null
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
    detailEvent(row) {
      //TODO:跳转会员详情页
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getMemberPageByAttributes(this.queryList)
          .then(res => {
            console.info("getMemberPageByAttributes");
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
    },
    formatDate(date, format) {
      return this.$XEUtils.toDateString(date, format || "yyyy-MM-dd");
    }
  },
  created() {
    this._getPage();
    getVipPageByAttributes().then(res => {
      console.info("getVipPageByAttributes");
      console.info(res);
      this.vipList = res.data.records;
    });
  }
};
</script>

<style>
</style>
