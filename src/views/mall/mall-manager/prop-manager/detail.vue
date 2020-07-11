<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">{{propEntity.propName+'--属性值'}}</h1>
    <span class="crubms">{{'属性类目：'+propEntity.categoryCrumbs}}</span>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <vxe-button icon="fa fa-plus" status="primary" @click="insertEvent">新增</vxe-button>
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
        field="propValueVal"
        title="属性值"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="propValueText"
        title="描述"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>

      <vxe-table-column
        field="propValueCode"
        title="代码"
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
import { getPropById } from "@/api/mall/prop";
import {
  getPropValuePageByAttributes,
  removePropValue,
  saveOrModifyPropValue
} from "@/api/mall/prop-value";
import { mapGetters } from "vuex";

export default {
  name: "PropValueManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      propEntity: {},

      tableLoading: false,

      queryList: {
        current: 1,
        size: 20
      },
      dataList: [],
      total: 0,
      pages: 0,
      validRules: {
        propValueVal: [{ required: true, message: "属性值必须填写" }]
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
      row.propId = this.propEntity.propId;
      row.propName = this.propEntity.propName;
      this.$refs.xTable.clearActived().then(() => {
        this.tableLoading = true;

        saveOrModifyPropValue(row)
          .then(res => {
            console.info("saveOrModifyPropValue");
            console.info(res);
            if (!row.propValueId) {
              row.propValueId = res.data.propValueId;
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
          if (row.propValueId) {
            removePropValue(row.propValueId).then(res => {
              console.info("removePropValue");
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
        getPropValuePageByAttributes(this.queryList)
          .then(res => {
            console.info("getPropValuePageByAttributes");
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
    console.info(this.$route.params.id);
    this.queryList.propId = this.$route.params.id;
    getPropById(this.$route.params.id).then(res => {
      this.propEntity = res.data;
    });

    this._getPage();
  }
};
</script>

<style scoped>
.crubms {
  font-size: 15px;
  color: #909399;
  margin-bottom: 10px;
}
</style>
