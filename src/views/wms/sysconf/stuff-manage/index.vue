dialogTitle<template>
  <div style="margin:30px;">
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" @click="addpage()">添加管理人员</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="content-bar">
        <vxe-toolbar :refresh="{query: _getPage}" custom>
          <template v-slot:buttons>
            <el-row>
              <vxe-input
                clearable
                v-model="searchItem.stuffName"
                type="search"
                placeholder="员工名称"
              ></vxe-input>
              <vxe-input
                clearable
                v-model="searchItem.stuffCode"
                type="search"
                placeholder="员工代码"
              ></vxe-input>
              <el-cascader
              clearable
              placeholder="请选择部门"
              :props="defaultProps"
              @change="handleSearchorgSelectChange"
            ></el-cascader>
             <vxe-input
                clearable
                v-model="searchItem.stuffPost"
                type="search"
                placeholder="员工岗位"
              ></vxe-input>
              <vxe-button @click="_getPage" status="primary">搜索</vxe-button>
            </el-row>
          </template>
        </vxe-toolbar>
        <vxe-table border="inner" :align="allAlign" :data="stuffList" :loading="loading">
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="stuffName" title="员工名称"></vxe-table-column>
          <vxe-table-column field="stuffCode" title="员工代码"></vxe-table-column>
          <vxe-table-column field="stuffTel" title="员工联系电话"></vxe-table-column>
          <vxe-table-column field="stuffPost" title="员工岗位"></vxe-table-column>
          <vxe-table-column field="departmentName" title="所属部门"></vxe-table-column>
          <vxe-table-column field="stuffText" title="备注"></vxe-table-column>
          <vxe-table-column title="操作" width="280">
            <template v-slot="{ row }">
              <template>
                <vxe-button status="primary" @click="checkRowEvent(row)">查看详情</vxe-button>
              </template>
              <template>
                <vxe-button status="primary" @click="editRowEvent(row)">编辑</vxe-button>
              </template>
              <template>
                <vxe-button status="danger" @click="deleteRowEvent(row)">删除</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          :current-page.sync="searchItem.current"
          :page-size.sync="searchItem.size"
          :total="total"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="_getPage"
        ></vxe-pager>
      </el-main>
    </el-container>

    <el-dialog
      :title="dialogTitle"
      center
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <div class="dialog-context">
        <el-form ref="stuffInfo" :model="stuffInfo" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工名称:">
                <el-input clearable size="small" v-model="stuffInfo.stuffName" v-if="edit"></el-input>
                <span v-else>{{ stuffInfo.stuffName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工工号:">
                <el-input clearable size="small" v-model="stuffInfo.stuffCode" v-if="edit"></el-input>
                <span v-else>{{ stuffInfo.stuffCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工联系电话:">
                <el-input clearable size="small" v-model="stuffInfo.stuffTel" v-if="edit"></el-input>
                <span v-else>{{ stuffInfo.stuffTel }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工岗位:">
                <el-input clearable size="small" v-model="stuffInfo.stuffPost" v-if="edit"></el-input>
                <span v-else>{{ stuffInfo.stuffPost }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属部门:">
                <!-- <el-input clearable size="small" v-model="stuffInfo.companyName" v-if="edit"></el-input>
                <span v-else>{{ stuffInfo.companyName }}</span>-->
                <el-button @click="choicedepartment" :disabled="!edit">{{currentDepartmentName}}</el-button>
                <el-dialog width="30%" title="选择部门" :visible.sync="innerVisible" append-to-body>
                  <div>
                    <el-cascader
                      clearable
                      placeholder="请选择部门"
                      v-model="orgList"
                      :props="defaultProps"
                      @change="handleorgSelectChange"
                    ></el-cascader>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="innerVisible = false">选择</el-button>
                  </div>
                </el-dialog>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="所属部门:">
                <el-input clearable size="small" v-model="stuffInfo.departmentName" v-if="edit"></el-input>
                <span v-else>{{ stuffInfo.departmentName }}</span>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input
                  clearable
                  size="small"
                  v-model="stuffInfo.stuffText"
                  type="textarea"
                  autosize
                  v-if="edit"
                ></el-input>
                <span v-else>{{ stuffInfo.stuffText }}</span>
              </el-form-item>
            </el-col>
            <!-- <div v-if="!edit">
              <el-col :span="12">
                <el-form-item label="创建人:">
                  <span>{{ stuffInfo.createUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间:">
                  <span>{{ stuffInfo.createTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新人:">
                  <span>{{ stuffInfo.updateUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新时间:">
                  <span>{{ stuffInfo.updateTime }}</span>
                </el-form-item>
              </el-col>
            </div>-->
          </el-row>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <div v-if="edit">
          <el-button @click="saveormodifyhouseinfo">{{edittype}}信息</el-button>
          <el-button @click="dialogVisible = false">返回</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<!-- TODO:搜索问题-->

<script>
import { mapGetters } from "vuex";
import {
  getStuffPage,
  removeStuff,
  saveOrModifyStuff,
  getStuffPageByAttributes
} from "@/api/wms/stuff/stuff";
import { getOrgPageByAttributes, getOrgById } from "@/api/org";

export default {
  name: "StuffManage",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      allAlign: null,
      loading: false,

      stuffList: [],
      Company: [],
      Department: [],
      dialogVisible: false,
      stuffInfo: {},
      searchItem: {
        current: 1,
        size: 10,
        companyId: null,
        stuffCode: null,
        departmentId: null,
        stuffClassify: null,
        stuffPost: null,
        stuffType: null,
        stuffName:null
      },
      total: 0,
      dialogTitle: "查看详情",
      edit: true,
      edittype: "",
      orgList: [],
      defaultProps: {
        checkStrictly: true,
        lazy: true,
        value: "orgId",
        label: "orgName",
        children: "children",
        lazyLoad: this._categoryLazyLoad
      },
      currentDepartmentName:null,
      innerVisible: false,
    };
  },
  async created() {
    let params1 = {
      orgClassify: "ORG_CLASSIFY_FIRST"
    };
    // let params2 = {
    //   dictType: "org_classify"
    // };
    await this._getOrgPageByAttributes_Company(params1);
    // await this._getOrgPageByAttributes_Department(params2);
    await setTimeout(() => {
      this._getPage();
    }, 500);
  },
  methods: {
    handlePageChange({ current, size }) {
      this.tablePage.current = current;
      this.tablePage.size = size;
      this.findList();
    },
    _getStuffPage(data) {
      getStuffPage(data).then(res => {
        if (res.status === 200) {
          this.stuffList = res.data.records;
        }
      });
    },
    _getOrgPageByAttributes_Company(params) {
      getOrgPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.Company = res.data.records;
        }
      });
    },
    _getOrgPageByAttributes_Department(params) {
      getOrgPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.Department = res.data.records;
        }
      });
    },
    _removeStuff(stuffId) {
      removeStuff(stuffId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    },
    _saveOrModifyStuff(data) {
      saveOrModifyStuff(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据上传成功",
            type: "success"
          });
        }
        setTimeout(() => {
          this.edittype = "添加";
          this.dialogVisible = false;
          this._getPage();
        }, 1000);
      });
    },
    _getStuffPageByAttributes(params) {
      getStuffPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.stuffList = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this._getStuffPageByAttributes(this.searchItem);
        this.loading = false;
        resolve();
      }).catch(err => {
        this.Loading = false;
        reject();
      });
    },
    addpage() {
      this.stuffInfo = {};
      this.dialogVisible = true;
      this.orgList = []
      this.edit = true;
      this.edittype = "添加";
      this.currentDepartmentName = "选择部门"
    },
    saveormodifyhouseinfo() {
      this.edit = false;
      this._saveOrModifyStuff(this.stuffInfo);
    },
    getclassify(data) {
      if (data) {
        for (var i = 0; i < this.Classify.length; i++) {
          if (this.Classify[i].dictCode === data) {
            return this.Classify[i].dictName;
          }
        }
      }
    },
    getCompany(data) {
      if (data) {
        for (var i = 0; i < this.Company.length; i++) {
          if (this.Company[i].dictCode === data) {
            return this.Company[i].dictName;
          }
        }
      }
    },
    fmtCompany({ cellValue }) {
      let item = this.Company.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    fmthouseClassify({ cellValue }) {
      let item = this.Classify.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    editRowEvent(row) {
      this.stuffInfo = {};
      this.stuffInfo = row;
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "修改";
      this.currentDepartmentName = row.departmentName
    },
    checkRowEvent(row) {
      this.stuffInfo = {};
      this.stuffInfo = row;
      this.dialogVisible = true;
      this.edit = false;
      this.currentDepartmentName = row.departmentName
    },
    deleteRowEvent(row) {
      this.$confirm("此操作将永久删除该员工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this._removeStuff(row.stuffId);
          setTimeout(() => {
            this._getPage();
          }, 1000);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    _categoryLazyLoad(node, resolve) {
      if (node.data) {
        let params = {
          parentId: node.data.orgId
        };
        getOrgPageByAttributes(params).then(res => {
          if (res.status === 200) {
            resolve(res.data.records);
          }
        });
      } else {
        let params = {
          orgClassify: "ORG_CLASSIFY_FIRST"
        };
        getOrgPageByAttributes(params).then(res => {
          if (res.status === 200) {
            resolve(res.data.records);
          }
        });
      }
    },
    handleorgSelectChange(e) {
      if (e.length == 0) {
        this.stuffInfo.departmentId = null;
      } else {
        this.stuffInfo.departmentId = e[e.length - 1];
        getOrgById(this.stuffInfo.departmentId).then(res => {
          if (res.status === 200) {
            this.stuffInfo.departmentName = res.data.orgName;
            this.currentDepartmentName = res.data.orgName
          }
        });
      }
    },
    handleSearchorgSelectChange(e){
      if (e.length == 0) {
        this.searchItem.departmentId = null;
      } else {
        this.searchItem.departmentId = e[e.length - 1];
      }
    },
     choicedepartment() {
      this.orgList = []
      this.innerVisible = true;
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

.form-item {
  margin-bottom: 1px solid #dbdbdb;
}
</style>
