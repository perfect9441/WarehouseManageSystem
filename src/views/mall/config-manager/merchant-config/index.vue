<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">门店管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <vxe-input clearable v-model="queryList.merchantNum" type="search" placeholder="输入编号"></vxe-input>
        <vxe-input clearable v-model="queryList.merchantName" type="search" placeholder="输入名称"></vxe-input>
        <el-cascader
          clearable
          :props="orgCascaderProps"
          @change="handleSearchOrgSelectChange"
          :options="orgList"
          placeholder="请选择组织"
        ></el-cascader>
        <el-cascader
          clearable
          :props="regCascaderProps"
          @change="handleSearchRegSelectChange"
          :options="regList"
          placeholder="请选择区域"
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
      <vxe-table-column field="merchantNum" title="编号"></vxe-table-column>
      <vxe-table-column field="merchantName" title="名称"></vxe-table-column>
      <vxe-table-column field="merchantDesc" title="描述"></vxe-table-column>
      <vxe-table-column field="merchantAddress" title="地址"></vxe-table-column>
      <vxe-table-column title="所属组织">
        <template v-slot="{ row }">
          <template>{{row.orgCrumbs}}</template>
        </template>
      </vxe-table-column>
      <vxe-table-column title="行政区域">
        <template v-slot="{ row }">
          <template>{{row.regCrumbs}}</template>
        </template>
      </vxe-table-column>

      <vxe-table-column title="操作" width="200">
        <template v-slot="{ row }">
          <vxe-button icon="vxe-icon--edit-outline " @click="editRowEvent(row)">编辑</vxe-button>
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
        <vxe-form-item title="编号" field="merchantNum" span="11">
          <template v-slot="scope">
            <vxe-input v-model="formData.merchantNum" placeholder="请输入编号"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="名称" field="merchantName" span="11">
          <template v-slot="scope">
            <vxe-input v-model="formData.merchantName" placeholder="请输入名称"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="描述" field="merchantDesc" span="24">
          <template v-slot="scope">
            <vxe-input v-model="formData.merchantDesc" placeholder="请输入描述" clearable></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="地址" field="merchantAddress" span="24">
          <template v-slot="scope">
            <vxe-input v-model="formData.merchantAddress" placeholder="请输入地址" clearable></vxe-input>
          </template>
        </vxe-form-item>

        <vxe-form-item title="组织" field="orgId" span="24">
          <template v-slot="scope">
            <template v-if="formData.orgId && !formOrgEdit">
              <span>{{formData.orgCrumbs}}</span>
            </template>

            <template v-if="formOrgEdit">
              <el-cascader
                style="width:90%"
                clearable
                :props="orgCascaderProps"
                @change="handleUpdateOrgSelectChange"
                :options="orgList"
              ></el-cascader>
            </template>
            <template v-if="formOrgEdit">
              <vxe-button size="small" @click="handleFormOrgEditOff">关闭</vxe-button>
            </template>
            <template v-else>
              <vxe-button
                size="small"
                @click="handleFormOrgEditOn"
                style="margin-left:10px"
                icon="el-icon-edit-outline"
              >编辑</vxe-button>
            </template>
          </template>
        </vxe-form-item>
        <vxe-form-item title="客服" field="merService" span="24">
          <vxe-select v-model="formData.merService" placeholder="请选择" clearable>
            <vxe-option v-for="(item,index) in empList" :key="index" :value="item.username" :label="item.empname"></vxe-option>
          </vxe-select>
        </vxe-form-item>
         <vxe-form-item title="客服名称" field="merServiceName" span="24">
            <vxe-input clearable v-model="formData.merServiceName"  placeholder="请输入"></vxe-input>
        </vxe-form-item>

        <vxe-form-item title="区域" field="regId" span="24">
          <template v-slot="scope">
            <template v-if="formData.regId && !formRegEdit">
              <span>{{formData.regCrumbs}}</span>
            </template>

            <template v-if="formRegEdit">
              <el-cascader
                style="width:90%"
                clearable
                :props="regCascaderProps"
                @change="handleUpdateRegSelectChange"
                :options="regList"
              ></el-cascader>
            </template>
            <template v-if="formRegEdit">
              <vxe-button size="small" @click="handleFormRegEditOff">关闭</vxe-button>
            </template>
            <template v-else>
              <vxe-button
                size="small"
                @click="handleFormRegEditOn"
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
import { getOrgPageOfParentIdIsNull, getOrgPageByAttributes } from "@/api/org";
import { getRegionPageByAttributes } from "@/api/region";
import { getAdminPageByAttributes } from "@/api/user";
import {
  getMerchantPageByAttributes,
  saveOrModifyMerchant,
  removeMerchant
} from "@/api/mall/merchant";
import { mapGetters } from "vuex";

export default {
  name: "MerchantConfig",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      empList:[],
      formOrgEdit: false,
      formRegEdit: false,
      showEdit: false,
      selectRow: null,
      submitLoading: false,
      formData: {},
      tableLoading: false,
      orgList: [],
      orgCacheList: [],
      orgCascaderProps: {
        checkStrictly: true,
        lazy: true,
        value: "orgId",
        label: "orgName",
        lazyLoad: this._orgLazyLoad
      },
      regCascaderProps: {
        checkStrictly: true,
        lazy: true,
        value: "regId",
        label: "regName",
        lazyLoad: this._regLazyLoad
      },
      regList: [],
      regCacheList: [],
      queryList: {
        current: 1,
        size: 10,
        merchantNum: null,
        merchantName: null,
        regId: null,
        orgId: null
      },
      dataList: [],
      total: 0,
      pages: 0,
      formRules: {
        merchantNum: [{ required: true, message: "编号必须填写" }],
        merchantName: [{ required: true, message: "名称必须填写" }],
        merchantAddress: [{ required: true, message: "地址必须填写" }],
        orgId: [{ required: true, message: "组织必须选择" }],
        merService:[{ required: true, message: "客服必须选择" }],
        merServiceName:[{ required: true, message: "客服名称必须选择" }],
        regId: [{ required: true, message: "区域必须选择" }]
      }
    };
  },
  methods: {
    handleFormOrgEditOn() {
      this.formOrgEdit = true;
    },
    handleFormOrgEditOff() {
      this.formOrgEdit = false;
    },
    handleFormRegEditOn() {
      this.formRegEdit = true;
    },
    handleFormRegEditOff() {
      this.formRegEdit = false;
    },
    _orgLazyLoad(node, resolve) {
      console.info("orgLazyLoad");

      if (node.data) {
        let params = {
          parentId: node.data.orgId
        };
        let children = [];
        getOrgPageByAttributes(params).then(async res => {
          console.info("getOrgPageByAttributes");
          console.info(res);
          children = res.data.records;
          for (let i = 0; i < children.length; i++) {
            children[i].children = [];
            // children[i].leaf = "leaf";
            this.orgCacheList.push(children[i]);
          }
          console.info(this.orgCacheList);
          resolve(children);
        });
      } else {
        getOrgPageOfParentIdIsNull()
          .then(res => {
            console.info("getOrgPageOfParentIdIsNull");
            console.info(res);
            this.orgList = res.data.records;
            for (let i = 0; i < this.orgList.length; i++) {
              this.orgList[i].children = [];
              // this.orgList[i].leaf = "leaf";
              this.orgCacheList.push(this.orgList[i]);
            }
            console.info(this.orgCacheList);
            resolve(this.orgList);
          })
          .catch(err => {});
      }
    },
    _regLazyLoad(node, resolve) {
      console.info("orgLazyLoad");

      if (node.data) {
        let params = {
          parentId: node.data.regId
        };
        let children = [];
        getRegionPageByAttributes(params).then(async res => {
          console.info("getRegionPageByAttributes");
          console.info(res);
          children = res.data.records;
          for (let i = 0; i < children.length; i++) {
            children[i].children = [];
            // children[i].leaf = "leaf";
            this.regCacheList.push(children[i]);
          }
          console.info(this.regCacheList);
          resolve(children);
        });
      } else {
        let params = {
          regType: 1
        };
        getRegionPageByAttributes(params)
          .then(res => {
            console.info("getRegionPageByAttributes");
            console.info(res);
            this.regList = res.data.records;
            for (let i = 0; i < this.regList.length; i++) {
              this.regList[i].children = [];
              // this.orgList[i].leaf = "leaf";
              this.regCacheList.push(this.regList[i]);
            }

            resolve(this.regList);
          })
          .catch(err => {});
      }
    },
    handleSearchOrgSelectChange(e) {
      console.info("handleSearchOrgSelectChange");
      console.info(e);
      // console.info(this.queryList);
      if (e.length == 0) {
        this.queryList.orgId = null;
      } else {
        this.queryList.orgId = e[e.length - 1];
      }
    },
    handleSearchRegSelectChange(e) {
      console.info("handleSearchRegSelectChange");
      console.info(e);
      // console.info(this.queryList);
      if (e.length == 0) {
        this.queryList.regId = null;
      } else {
        this.queryList.regId = e[e.length - 1];
      }
    },
    handleUpdateOrgSelectChange(e) {
      if (e.length == 0) {
        this.formData.orgId = null;
        this.formData.orgName = null;
        this.formData.orgCrumbs = "";
        this.formData.empService=null
      } else {
        this.formData.orgId = e[e.length - 1];

        let crumbs = "";
        for (let i = 0; i < e.length; i++) {
          let temp = this.orgCacheList.find(item => {
            return item.orgId === e[i];
          });

          crumbs = crumbs + "/" + temp.orgName;
        }
        console.info(crumbs);
        let orgNameTemp = this.orgCacheList.find(item => {
          return item.orgId === this.formData.orgId;
        }).orgName;
        this.formData.orgCrumbs = crumbs;
        this.formData.orgName = orgNameTemp;
      }
      let getAdminParams={
        orgId:this.formData.orgId
      }
      getAdminPageByAttributes(getAdminParams).then(res=>{
        this.empList=res.data.records
      })
      console.info("this.formData");
      console.info(this.formData);
    },
    handleUpdateRegSelectChange(e) {
      if (e.length == 0) {
        this.formData.regId = null;
        this.formData.regName = null;
        this.formData.regCrumbs = "";
      } else {
        this.formData.regId = e[e.length - 1];

        let crumbs = "";
        for (let i = 0; i < e.length; i++) {
          let temp = this.regCacheList.find(item => {
            return item.regId === e[i];
          });
          console.info(temp);
          crumbs = crumbs + "/" + temp.regName;
        }
        console.info(crumbs);
        let regNameTemp = this.regCacheList.find(item => {
          return item.regId === this.formData.regId;
        }).regName;
        this.formData.regCrumbs = crumbs;
        this.formData.regName = regNameTemp;
      }
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
      await saveOrModifyMerchant(this.formData).then(async res => {
        console.info("modifyAdmin");
        console.info(res);
        this.$XModal.message({ message: "提交成功！", status: "success" });
        if (this.formData.merchantId) {
          for (let key in res.data) {
            this.selectRow[key] = res.data[key];
          }
        } else {
          await this.$refs.xTable.insert(res.data);
        }
      });
      this.submitLoading = false;
      this.handleFormOrgEditOff();
      this.handleFormRegEditOff();
      this.showEdit = false;
    },

    editRowEvent(row) {
      console.info(row);
      this.selectRow = row;
      this.formData = this.$lodash.cloneDeep(row);
      this.showEdit = true;
      let getAdminParams={
        orgId:this.formData.orgId
      }
      getAdminPageByAttributes(getAdminParams).then(res=>{
        this.empList=res.data.records
      })
    },
    deleteRowEvent(row) {
      this.$XModal.confirm("您确定要删除该数据?").then(type => {
        if (type === "confirm") {
          if (row.merchantId) {
            removeMerchant(row.merchantId).then(res => {
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
        getMerchantPageByAttributes(this.queryList)
          .then(res => {
            console.info("getMerchantPageByAttributes");
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
