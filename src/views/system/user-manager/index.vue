<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">用户管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <vxe-input clearable v-model="queryList.username" type="search" placeholder="输入手机号码"></vxe-input>
        <vxe-input clearable v-model="queryList.empname" type="search" placeholder="输入姓名"></vxe-input>

        <el-cascader
          clearable
          :props="orgCascaderProps"
          @change="handleSearchOrgSelectChange"
          :options="orgList"
        ></el-cascader>

        <vxe-select clearable v-model="queryList.adminType" placeholder="选择用户类型">
          <vxe-option
            v-for="(item,index) in adminTypeList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
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
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="username" title="账号"></vxe-table-column>
      <vxe-table-column title="姓名">
        <template v-slot="{ row }">
          <template v-if="row.empname">{{row.empname}}</template>
          <template v-else>
            <el-tag type="info">未填写</el-tag>
          </template>
        </template>
      </vxe-table-column>
      <vxe-table-column field="adminType" title="用户类型">
        <template v-slot="{ row }">
          <template>
            <el-tag
              :type="row.adminType=='RBAC_ADMIN_TYPE_ADMIN'?'danger':'info'"
            >{{adminTypeMap[row.adminType] }}</el-tag>
          </template>
        </template>
      </vxe-table-column>
      <vxe-table-column title="联系电话">
        <template v-slot="{ row }">
          <template v-if="row.mobile">{{row.mobile}}</template>
          <template v-else>
            <el-tag type="info">未填写</el-tag>
          </template>
        </template>
      </vxe-table-column>

      <vxe-table-column title="所属组织">
        <template v-slot="{ row }">
          <template v-if="row.orgName">{{row.orgCrumbs}}</template>
          <template v-else>
            <el-tag type="info">无组织</el-tag>
          </template>
        </template>
      </vxe-table-column>

      <vxe-table-column title="操作" width="200">
        <template v-slot="{ row }">
          <template v-if="row.adminType=='RBAC_ADMIN_TYPE_ADMIN'">
            <vxe-button status="primary" type="text" @click="updateAdminEvent(row)">编辑</vxe-button>
            <vxe-button status="danger" type="text" @click="deleteAdminTypeEvent(row)">注销管理员</vxe-button>
          </template>
          <template v-if="row.adminType=='RBAC_ADMIN_TYPE_COMMON'">
            <vxe-button status="danger" type="text" @click="setAdminTypeEvent(row)">设为管理员</vxe-button>
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

    <vxe-modal
      v-model="showEdit"
      :title="selectRow ? '编辑&保存' : '新增&保存'"
      width="800"
      :loading="submitLoading"
      resize
      destroy-on-close
      lock-view
      @close="onModalClose"
    >
      <vxe-form
        ref="xForm"
        :data="formData"
        :rules="formRules"
        title-align="right"
        title-width="100"
        @submit="submitEvent"
      >
        <vxe-form-item title="基本信息" span="24"></vxe-form-item>
        <vxe-form-item title="账号" field="username" span="11">
          <template v-slot="scope">
            <vxe-input v-model="formData.username" placeholder="请输入账号" :disabled="true"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="姓名" field="empname" span="11">
          <template v-slot="scope">
            <vxe-input v-model="formData.empname" placeholder="请输入姓名" clearable></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item title="联系电话" field="mobile" span="12">
          <template v-slot="scope">
            <vxe-input v-model="formData.mobile" placeholder="请输入联系电话" clearable></vxe-input>
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

        <vxe-form-item title="高级" span="24" folding></vxe-form-item>
        <el-collapse v-model="collapseActiveName" accordion>
          <el-collapse-item title="管理门店" name="merchant">
            <el-select
              style="width:90%"
              v-model="formData.chooseMerchantList"
              multiple
              placeholder="请选择门店"
              @change="onChooseMerchantListChange"
            >
              <el-option
                v-for="item in merchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              ></el-option>
            </el-select>
          </el-collapse-item>
          <el-collapse-item title="角色" name="roles">
            <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
            <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
          </el-collapse-item>
        </el-collapse>
        <vxe-form-item align="center" span="24" collapse-node>
          <vxe-button type="submit" status="primary">提交</vxe-button>
        </vxe-form-item>
      </vxe-form>
    </vxe-modal>
  </div>
</template>

<script>
//TODO:BUG 当门店修改组织时，用户对该门店的管理依然有效，在下拉框中以门店Id形式显示
import { getDictPageByAttributes } from "@/api/dict";
import {
  getOrgPageOfParentIdIsNull,
  getOrgPageByAttributes,
  getOrgById
} from "@/api/org";
import { getAdminPageByAttributes, modifyAdmin } from "@/api/user";
import { getMerchantPageByAttributes } from "@/api/mall/merchant";
import {
  getMerchantByUsername,
  refreshMerAdminByUsernameAndMerchantIdList
} from "@/api/mall/mer-admin";
import { _getDictMap } from "@/utils/my-utils";
import { mapGetters } from "vuex";

export default {
  name: "UserManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      merchantChooseListIsChange:false,
      merchantList: [],
      collapseActiveName: "",
      formOrgEdit: false,
      formData: {
        chooseMerchantList: []
      },
      formRules: {
        empname: [{ required: true, message: "姓名必须填写" }],
        orgId: [{ required: true, message: "组织必须选择" }]
      },
      submitLoading: false,
      showEdit: false,
      selectRow: null,
      tableLoading: false,
      orgList: [],
      adminTypeList: [],
      adminTypeMap: {},
      queryList: {
        current: 1,
        size: 10,
        username: null,
        empname: null,
        orgId: null,
        adminType: null
      },
      dataList: [],
      total: 0,
      pages: 0,
      orgCascaderProps: {
        checkStrictly: true,
        lazy: true,
        value: "orgId",
        label: "orgName",
        lazyLoad: this._orgLazyLoad
      },
      orgCacheList: []
    };
  },
  methods: {
    handleFormOrgEditOn() {
      this.formOrgEdit = true;
    },
    handleFormOrgEditOff() {
      this.formOrgEdit = false;
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
    setAdminTypeEvent(row) {
      this.$XModal.confirm("您确定要设为管理员?").then(type => {
        if (type === "confirm") {
          row.adminType = "RBAC_ADMIN_TYPE_ADMIN";
          modifyAdmin(row).then(res => {
            console.info("modifyAdmin");
            console.info(res);
            row = res.data;
          });
        }
      });
    },
    deleteAdminTypeEvent(row) {
      this.$XModal.confirm("您确定要注销管理员?").then(type => {
        if (type === "confirm") {
          row.adminType = "RBAC_ADMIN_TYPE_COMMON";
          modifyAdmin(row).then(res => {
            console.info("modifyAdmin");
            console.info(res);
            row = res.data;
          });

          //TODO:删除管理员所有角色
        }
      });
    },
    updateAdminEvent(row) {
      this.selectRow = row;
      this.formData = this.$lodash.cloneDeep(row);
      this.showEdit = true;
      let getMerParams = {
        orgId: this.formData.orgId
      };
      getMerchantPageByAttributes(getMerParams).then(res => {
        console.info("getMerchantPageByAttributes");
        console.info(res);
        this.merchantList = res.data.records;
      });
      //获取用户的meradminlist

      getMerchantByUsername(this.formData.username).then(res => {
        console.info("getMerchantByUsername");
        console.info(res);
        this.formData.chooseMerchantList = [];
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            this.formData.chooseMerchantList.push(res.data[i].merchantId);
          }
        }
      });
    },
    onChooseMerchantListChange(e) {
      this.merchantChooseListIsChange = true;
      this.formData.chooseMerchantList = e;
    },
    onModalClose() {
      this.merchantChooseListIsChange = false;
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
      await modifyAdmin(this.formData).then(res => {
        console.info("modifyAdmin");
        console.info(res);
        this.$XModal.message({ message: "提交成功！", status: "success" });
        for (let key in res.data) {
          this.selectRow[key] = res.data[key];
        }
      });
      if (this.merchantChooseListIsChange) {
        await refreshMerAdminByUsernameAndMerchantIdList(
          this.formData.username,
          this.formData.chooseMerchantList
        ).then(res => {
          console.info("refreshMerAdminByUsernameAndMerchantIdList");
          console.info(res);
          this.merchantChooseListIsChange = false;
        });
      }

      this.submitLoading = false;
      this.handleFormOrgEditOff();
      this.showEdit = false;
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
    handleUpdateOrgSelectChange(e) {
      if (e.length == 0) {
        this.formData.orgId = null;
        this.formData.orgName = null;
        this.formData.orgCrumbs = "";
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
      console.info("this.formData");
      console.info(this.formData);
      this.merchantList = [];
      this.formData.chooseMerchantList=[]
      this.merchantChooseListIsChange = true;
      //修改组织时要同时刷新所管辖的门店，因为门店是和组织绑定的
      let getMerParams = {
        orgId: this.formData.orgId
      };
      getMerchantPageByAttributes(getMerParams).then(res => {
        console.info("getMerchantPageByAttributes");
        console.info(res);
        this.merchantList = res.data.records;
      });
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;

        getAdminPageByAttributes(this.queryList)
          .then(res => {
            // console.info("getAdminPageByAttributes");
            // console.info(res);
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
    let dictAdminTypeParams = {
      dictType: "rbac_admin_type"
    };
    getDictPageByAttributes(dictAdminTypeParams).then(res => {
      // console.info("getDictPageByAttributes");
      // console.info(res);
      this.adminTypeList = res.data.records;
      this.adminTypeMap = _getDictMap(this.adminTypeList);
      // console.info("adminTypeMap");
      // console.info(this.adminTypeMap);
    });
  }
};
</script>

<style>
</style>
