<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">商品规格管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <el-cascader
          clearable
          :props="cateCascaderProps"
          @change="handleSearchCateSelectChange"
          :options="cateList"
          placeholder="请选择类目"
        ></el-cascader>

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
    >
    <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column title="类目">
        <template v-slot="{ row }">
          <template>{{row.categoryCrumbs}}</template>
        </template>
      </vxe-table-column>
      
      <vxe-table-column field="specificationName" title="规格名称"></vxe-table-column>
      <vxe-table-column field="specificationText" title="描述"></vxe-table-column>
      <vxe-table-column field="specificationCode" title="代码"></vxe-table-column>

      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <vxe-button icon="vxe-icon--edit-outline " @click="editRowEvent(row)">编辑</vxe-button>
          <vxe-button status="primary" @click="searchDetailEvent(row)">属性值</vxe-button>
          <vxe-button @click="deleteRowEvent(row)" status="danger">删除</vxe-button>
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

    <vxe-modal
      v-model="showEdit"
      :title="selectRow ? '编辑&保存' : '新增&保存'"
      width="800"
      :loading="submitLoading"
      resize
      destroy-on-close
      lock-view
    >
      <vxe-form
        ref="xForm"
        :data="formData"
        :rules="formRules"
        title-align="right"
        title-width="100"
        @submit="submitEvent"
      >
        <vxe-form-item title="名称" field="specificationName" span="11">
          <template v-slot="scope">
            <vxe-input v-model="formData.specificationName" placeholder="请输入名称"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="描述" field="specificationText" span="24">
          <template v-slot="scope">
            <vxe-input v-model="formData.specificationText" placeholder="请输入描述" clearable></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="代码" field="specificationCode" span="24">
          <template v-slot="scope">
            <vxe-input v-model="formData.specificationCode" placeholder="请输入代码" clearable></vxe-input>
          </template>
        </vxe-form-item>

        <vxe-form-item title="类目" field="categoryId" span="24">
          <template v-slot="scope">
            <template v-if="formData.categoryId && !formCateEdit">
              <span>{{formData.categoryCrumbs}}</span>
            </template>

            <template v-if="formCateEdit">
              <el-cascader
                style="width:90%"
                clearable
                :props="cateCascaderProps"
                @change="handleUpdateCateSelectChange"
                :options="cateList"
              ></el-cascader>
            </template>
            <template v-if="formCateEdit">
              <vxe-button size="small" @click="handleformCateEditOff">关闭</vxe-button>
            </template>
            <template v-else>
              <vxe-button
                size="small"
                @click="handleformCateEditOn"
                style="margin-left:10px"
                icon="el-icon-edit-outline"
              >编辑</vxe-button>
            </template>
          </template>
        </vxe-form-item>

        <vxe-form-item align="center" span="24">
          <vxe-button type="submit" status="primary">提交</vxe-button>
        </vxe-form-item>
      </vxe-form>
    </vxe-modal>
  </div>
</template>

<script>
import { getCategoryPageByAttributes } from "@/api/mall/category";

import {
  getSpecPageByAttributes,
  removeSpec,
  saveOrModifySpec
} from "@/api/mall/spec";
import { mapGetters } from "vuex";

export default {
  name: "SpecManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      formCateEdit: false,

      showEdit: false,
      selectRow: null,
      submitLoading: false,
      formData: {},
      tableLoading: false,
      cateList: [],
      cateCacheList: [],
      cateCascaderProps: {
        checkStrictly: true,
        lazy: true,
        value: "categoryId",
        label: "categoryName",
        lazyLoad: this._cateLazyLoad
      },

      queryList: {
        current: 1,
        size: 10,
        categoryId: null
      },
      dataList: [],
      total: 0,
      pages: 0,
      formRules: {
        specificationName: [{ required: true, message: "名称必须填写" }],
        categoryId: [{ required: true, message: "组织必须选择" }]
      }
    };
  },
  methods: {
    searchDetailEvent(row) {
      this.$router.push({
        name: "MallManagerSpecValueManager",
        params: { id: row.specId }
      });
    },

    handleformCateEditOn() {
      this.formCateEdit = true;
    },
    handleformCateEditOff() {
      this.formCateEdit = false;
    },

    _cateLazyLoad(node, resolve) {
      console.info("orgLazyLoad");

      if (node.data) {
        let params = {
          parentId: node.data.categoryId
        };
        let children = [];
        getCategoryPageByAttributes(params).then(async res => {
          console.info("getOrgPageByAttributes");
          console.info(res);
          children = res.data.records;
          for (let i = 0; i < children.length; i++) {
            children[i].children = [];
            // children[i].leaf = "leaf";
            this.cateCacheList.push(children[i]);
          }
          console.info(this.cateCacheList);
          resolve(children);
        });
      } else {
        let params = {
          cateLevel: "MALL_CATE_LEVEL_FIRST"
        };
        getCategoryPageByAttributes(params)
          .then(res => {
            console.info("getCategoryPageByAttributes");
            console.info(res);
            this.cateList = res.data.records;
            for (let i = 0; i < this.cateList.length; i++) {
              this.cateList[i].children = [];
              // this.cateList[i].leaf = "leaf";
              this.cateCacheList.push(this.cateList[i]);
            }
            console.info(this.cateCacheList);
            resolve(this.cateList);
          })
          .catch(err => {});
      }
    },

    handleSearchCateSelectChange(e) {
      console.info("handleSearchCateSelectChange");
      console.info(e);
      // console.info(this.queryList);
      if (e.length == 0) {
        this.queryList.categoryId = null;
      } else {
        this.queryList.categoryId = e[e.length - 1];
      }
    },

    handleUpdateCateSelectChange(e) {
      if (e.length == 0) {
        this.formData.categoryId = null;
        this.formData.categoryName = null;
        this.formData.categoryCrumbs = "";
      } else {
        this.formData.categoryId = e[e.length - 1];

        let crumbs = "";
        for (let i = 0; i < e.length; i++) {
          let temp = this.cateCacheList.find(item => {
            return item.categoryId === e[i];
          });

          crumbs = crumbs + "/" + temp.categoryName;
        }
        console.info(crumbs);
        let categoryNameTemp = this.cateCacheList.find(item => {
          return item.categoryId === this.formData.categoryId;
        }).categoryName;
        this.formData.categoryCrumbs = crumbs;
        this.formData.categoryName = categoryNameTemp;
      }
      console.info("this.formData");
      console.info(this.formData);
    },

    async insertEvent() {
      this.selectRow = null;
      this.formData = {};
      this.showEdit = true;
    },
    async submitEvent() {
      const errMap = await this.$refs.xForm
        .validate(this.formData)
        .catch(errMap => errMap);
      console.info(errMap);
      if (errMap) {
        return;
      }
      console.info("提交");
      this.submitLoading = true;
      await saveOrModifySpec(this.formData).then(async res => {
        console.info("modifyAdmin");
        console.info(res);
        this.$XModal.message({ message: "提交成功！", status: "success" });
        if (this.formData.specId) {
          for (let key in res.data) {
            this.selectRow[key] = res.data[key];
          }
        } else {
          await this.$refs.xTable.insert(res.data);
        }
      });
      this.submitLoading = false;
      this.handleformCateEditOff();

      this.showEdit = false;
    },

    editRowEvent(row) {
      console.info(row);
      this.selectRow = row;
      this.formData = this.$lodash.cloneDeep(row);
      this.showEdit = true;
    },
    deleteRowEvent(row) {
      this.$XModal.confirm("您确定要删除该数据?").then(type => {
        if (type === "confirm") {
          if (row.specId) {
            removeSpec(row.specId).then(res => {
              console.info("removeMerchant");
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
        getSpecPageByAttributes(this.queryList)
          .then(res => {
            console.info("getSpecPageByAttributes");
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
  }
};
</script>

<style>
</style>
