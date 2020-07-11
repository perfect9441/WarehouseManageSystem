<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">组织架构管理</h1>
    <vxe-toolbar custom :refresh="{query: searchEvent}">
      <template v-slot:buttons>
        <vxe-input clearable v-model="queryList.orgName" type="search" placeholder="输入名称"></vxe-input>
        <vxe-input clearable v-model="queryList.orgNum" type="search" placeholder="输入编号"></vxe-input>
        <vxe-select clearable v-model="queryList.orgClassify" placeholder="选择级别">
          <vxe-option
            v-for="(item,index) in orgClassifyList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        <vxe-button @click="searchEvent">搜索</vxe-button>
        <vxe-button icon="fa fa-plus" @click="insertEvent()">新增一级组织</vxe-button>
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
      :tree-config="treeConfig"
      :data="dataList"
      :loading="tableLoading"
      :edit-config="{trigger: 'manual', mode: 'row'}"
      :edit-rules="validRules"
    >
      <!-- <vxe-table-column type="seq" title="序号" width="60" tree-node></vxe-table-column> -->
      <vxe-table-column
        field="orgName"
        title="名称"
        tree-node
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="orgNum"
        title="编号"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="orgClassify"
        title="组织级别"
        :edit-render="{name: '$select', options: orgClassifyList,optionProps:{value:'dictCode',label:'dictName'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="orgAddress"
        title="组织地址"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="250">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)" type="text">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)" type="text">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button icon="vxe-icon--edit-outline " type="text" @click="editRowEvent(row)">编辑</vxe-button>
            <vxe-button @click="insertAtEvent(row)" status="primary" type="text">添加子组织</vxe-button>
            <vxe-button @click="deleteRowEvent(row)" status="danger" type="text">删除</vxe-button>
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
import {
  getOrgPageByAttributes,
  removeOrg,
  saveOrModifyOrg,
  getOrgPageOfParentIdIsNull
} from "@/api/org";
import { mapGetters } from "vuex";

export default {
  name: "OrgManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      treeConfig: {
        lazy: true,
        children: "children",
        hasChild: "hasChild",
        loadMethod: this._getChildrenPage
      },
      tableLoading: false,
      orgClassifyList: [],
      queryList: {
        current: 1,
        size: 10,
        orgName: null,
        orgNum: null,
        orgClassify: null
      },
      dataList: [],
      total: 0,
      pages: 0,
      validRules: {
        orgName: [{ required: true, message: "名称必须填写" }],
        orgNum: [{ required: true, message: "组织编号必须填写" }],
        orgClassify: [{ required: true, message: "组织级别必须选择" }]
      }
    };
  },
  methods: {
    async insertEvent() {
      let xTree = this.$refs.xTable;
      xTree.createRow({}).then(newRow => {
        // 插入到第一行
        this.dataList.unshift(newRow);
        xTree.syncData().then(() => xTree.setActiveRow(newRow));
      });
    },
    insertAtEvent(father) {
      console.info("father");
      console.info(father);
      let xTree = this.$refs.xTable;

      xTree
        .createRow({
          parentId: father.orgId
        })
        .then(newRow => {
          console.info("newRow");
          console.info(newRow);
          if (newRow) {
            father.children.unshift(newRow);
            xTree.syncData().then(() => xTree.setActiveRow(newRow));
          }
        });
    },
    async saveRowEvent(row) {
      const errMap = await this.$refs.xTable
        .validate(row)
        .catch(errMap => errMap);
      console.info(errMap);
      if (errMap) {
        return;
      }

      this.$refs.xTable.clearActived().then(() => {
        this.tableLoading = true;
        saveOrModifyOrg(row)
          .then(async res => {
            // console.info("saveOrModifyOrg");
            // console.info(res);
            // console.info(row);
            this.tableLoading = false;
            if (!row.orgId) {
              row.orgId = res.data.orgId;
              row.version = res.data.version;
              row.children = [];
              row.hasChild = true;
              // console.info("新增组织");
              // console.info(row);
            } //

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
      let xTree = this.$refs.xTable;
      this.$XModal.confirm("您确定要删除该数据?").then(async type => {
        if (type === "confirm") {
          if (row.orgId) {
            let children = [];
            let info = {
              row: row
            };
            await this._getChildrenPage(info).then(res => {
              children = res;
            });
            if (children.length != 0) {
              this.$XModal.message({
                message: "该组织存在子组织，无法删除！",
                status: "error"
              });
            } else {
              removeOrg(row.orgId).then(res => {
                console.info("removeDict");
                console.info(res);
                this.$XModal.message({
                  message: "删除成功",
                  status: "success"
                });

                let matchObj = this.$XEUtils.findTree(
                  this.dataList,
                  item => item === row,
                  this.treeConfig
                );

                console.info(matchObj);
                let { items, index } = matchObj;
                items.splice(index, 1);
                xTree.syncData();
              });
            }
          } else {
            let matchObj = this.$XEUtils.findTree(
              this.dataList,
              item => item === row,
              this.treeConfig
            );

            console.info(matchObj);
            let { items, index } = matchObj;
            items.splice(index, 1);
            xTree.syncData();
          }
        }
      });
    },
    searchEvent() {
      if (
        this.queryList.orgName ||
        this.queryList.orgNum ||
        this.queryList.orgClassify
      ) {
        return this._getPage();
      } else {
        return this._getInitPage();
      }
    },
    _getInitPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getOrgPageOfParentIdIsNull(this.queryList)
          .then(res => {
            this.dataList = res.data.records;
            for (let i = 0; i < this.dataList.length; i++) {
              this.dataList[i].children = [];
              this.dataList[i].hasChild = true;
            }

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
    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getOrgPageByAttributes(this.queryList)
          .then(async res => {
            console.info("getDictPage");
            console.info(res);
            this.dataList = res.data.records;
            for (let i = 0; i < this.dataList.length; i++) {
              this.dataList[i].children = [];
              this.dataList[i].hasChild = true;
            }
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
    _getChildrenPage({ row }) {
      console.info(row);

      return new Promise((resolve, reject) => {
        let params = {
          parentId: row.orgId
        };
        let children = [];
        getOrgPageByAttributes(params).then(async res => {
          console.info("_getChildrenPage");
          console.info(res);
          children = res.data.records;
          row.children = children;
          for (let i = 0; i < row.children.length; i++) {
            row.children[i].children = [];
            row.children[i].hasChild = true;
          }
          if (children.length == 0) {
            row.hasChild = false;
          }
          resolve(children);
        });
      });
    }
  },
  created() {
    this._getInitPage();
    let params = {
      dictType: "org_classify"
    };
    getDictPageByAttributes(params).then(res => {
      this.orgClassifyList = res.data.records;
    });
  }
};
</script>

<style>
</style>
