<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">行政区域管理</h1>
    <vxe-toolbar custom :refresh="{query: searchEvent}">
      <template v-slot:buttons>
        <vxe-input clearable v-model="queryList.regName" type="search" placeholder="输入名称"></vxe-input>
        <vxe-input clearable v-model="queryList.regCode" type="search" placeholder="输入编号"></vxe-input>
        <vxe-select clearable v-model="queryList.regType" placeholder="选择级别">
          <vxe-option
            v-for="(item,index) in regTypeList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></vxe-option>
        </vxe-select>
        <vxe-button @click="searchEvent">搜索</vxe-button>
        <vxe-button icon="fa fa-plus" @click="insertEvent()">新增一级行政区域</vxe-button>
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
        field="regName"
        title="名称"
        tree-node
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="regCode"
        title="编号"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="bmapCityCode"
        title="百度城市代码"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="regType"
        title="级别"
        :edit-render="{name: '$select', options: regTypeList,optionProps:{value:'value',label:'label'}}"
      ></vxe-table-column>
      
      <vxe-table-column title="操作" width="250">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)" type="text">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)" type="text">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button icon="vxe-icon--edit-outline " type="text" @click="editRowEvent(row)">编辑</vxe-button>
            <vxe-button @click="insertAtEvent(row)" status="primary" type="text">添加子区域</vxe-button>
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
  getRegionPageByAttributes,
  saveOrModifyRegion,
  removeRegion
} from "@/api/region";
import { mapGetters } from "vuex";

export default {
  name: "regManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      regTypeList: [
        {
          value: 1,
          label: "省、直辖市级"
        },
        {
          value: 2,
          label: "市级"
        },
        {
          value: 3,
          label: "区、县级"
        }
      ],
      treeConfig: {
        lazy: true,
        children: "children",
        hasChild: "hasChild",
        loadMethod: this._getChildrenPage
      },
      tableLoading: false,
      regClassifyList: [],
      queryList: {
        current: 1,
        size: 10,
        regName: null,
        regCode: null,
        regType: null
      },
      dataList: [],
      total: 0,
      pages: 0,
      validRules: {
        regName: [{ required: true, message: "名称必须填写" }],
        regCode: [{ required: true, message: "编号必须填写" }],
        regType: [{ required: true, message: "级别必须选择" }]
      }
    };
  },
  methods: {
    async insertEvent() {
      let xTree = this.$refs.xTable;
      xTree.createRow({ parentId: 0}).then(newRow => {
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
          parentId: father.regId
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
        saveOrModifyRegion(row)
          .then(async res => {
            // console.info("saveOrModifyreg");
            // console.info(res);
            // console.info(row);
            this.tableLoading = false;
            if (!row.regId) {
              row.regId = res.data.regId;
              row.version = res.data.version;
              row.children = [];
              row.hasChild = true;
              console.info("新增组织");
              console.info(row);
            } 

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
          if (row.regId) {
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
              removeRegion(row.regId).then(res => {
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
        this.queryList.regName ||
        this.queryList.regCode ||
        this.queryList.regType
      ) {
        return this._getPage();
      } else {
        return this._getInitPage();
      }
    },
     _getInitPage() {
      return new Promise(async (resolve, reject) => {
        this.tableLoading = true;
        this.queryList.regType=1
       await getRegionPageByAttributes(this.queryList)
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
          this.queryList.regType=null
      });
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getRegionPageByAttributes(this.queryList)
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
          parentId: row.regId
        };
        let children = [];
        getRegionPageByAttributes(params).then(async res => {
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

  }
};
</script>

<style>
</style>
