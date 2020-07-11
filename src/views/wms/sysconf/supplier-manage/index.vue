dialogTitle<template>
  <div style="margin:30px;">
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" @click="addpage()">添加供应商</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="content-bar">
        <vxe-toolbar :refresh="{query: _getPage}" custom>
          <template v-slot:buttons>
            <el-row>
              <vxe-input
                clearable
                v-model="searchItem.supplierName"
                type="search"
                placeholder="供应商名称"
              ></vxe-input>
              <vxe-input
                clearable
                v-model="searchItem.supplierCode"
                type="search"
                placeholder="供应商代码"
              ></vxe-input>

              <vxe-select clearable v-model="searchItem.supplierClasify" placeholder="选择供应商类型">
                <vxe-option
                  v-for="(item,index) in Classify"
                  :key="index"
                  :value="item.dictCode"
                  :label="item.dictName"
                ></vxe-option>
              </vxe-select>
              <vxe-select clearable v-model="searchItem.useFlg" placeholder="选择供应商类型">
                <vxe-option
                  v-for="(item,index) in useFlg"
                  :key="index"
                  :value="item.dictCode"
                  :label="item.dictName"
                ></vxe-option>
              </vxe-select>
              <vxe-button @click="_getPage" status="primary">搜索</vxe-button>
            </el-row>
          </template>
        </vxe-toolbar>
        <vxe-table border="inner" :align="allAlign" :data="supplierList" :loading="loading">
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="supplierName" title="供应商名称"></vxe-table-column>
          <vxe-table-column field="supplierCode" title="供应商代码"></vxe-table-column>
          <vxe-table-column field="supplierPerson" title="供应商联系人"></vxe-table-column>
          <vxe-table-column field="supplierTel" title="供应商联系电话"></vxe-table-column>
          <vxe-table-column field="supplierAddr" title="供应商地址"></vxe-table-column>
          <vxe-table-column field="supplierClasify" title="供应商类型" :formatter="fmthouseClassify"></vxe-table-column>
          <vxe-table-column field="useFlg" title="使用状态" :formatter="fmtuseflg"></vxe-table-column>
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
        <el-form ref="supplierInfo" :model="supplierInfo" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商名称:">
                <el-input clearable size="small" v-model="supplierInfo.supplierName" v-if="edit"></el-input>
                <span v-else>{{ supplierInfo.supplierName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商简称:">
                <el-input
                  clearable
                  size="small"
                  v-model="supplierInfo.supplierShortName"
                  v-if="edit"
                ></el-input>
                <span v-else>{{ supplierInfo.supplierShortName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商代码:">
                <el-input clearable size="small" v-model="supplierInfo.supplierCode" v-if="edit"></el-input>
                <span v-else>{{ supplierInfo.supplierCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商管理员:">
                <el-input clearable size="small" v-model="supplierInfo.supplierPerson" v-if="edit"></el-input>
                <span v-else>{{ supplierInfo.supplierPerson }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话:">
                <el-input clearable size="small" v-model="supplierInfo.supplierTel" v-if="edit"></el-input>
                <span v-else>{{ supplierInfo.supplierTel }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商地址:">
                <el-input clearable size="small" v-model="supplierInfo.supplierAddr" v-if="edit"></el-input>
                <span v-else>{{ supplierInfo.supplierAddr }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商开户行:">
                <el-input clearable size="small" v-model="supplierInfo.supplierBank" v-if="edit"></el-input>
                <span v-else>{{ supplierInfo.supplierBank }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行卡号:">
                <el-input
                  clearable
                  size="small"
                  v-model.number="supplierInfo.supplierBankCode"
                  v-if="edit"
                ></el-input>
                <span v-else>{{ supplierInfo.supplierBankCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商级别:">
                <el-input clearable size="small" v-model="supplierInfo.supplierLevel" v-if="edit"></el-input>
                <span v-else>{{ supplierInfo.supplierLevel }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="适用税率:">
                <el-input
                  clearable
                  size="small"
                  v-model.number="supplierInfo.supplierTax"
                  v-if="edit"
                ></el-input>
                <span v-else>{{ supplierInfo.supplierTax }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="开票信息:">
                <el-input clearable size="small" v-model="supplierInfo.supplierTaxInfo" v-if="edit"></el-input>
                <span v-else>{{ supplierInfo.supplierTaxInfo }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="供应商类型:">
                <el-select
                  v-model="supplierInfo.supplierClasify"
                  clearable
                  v-if="edit"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in Classify"
                    :label="item.dictName"
                    :value="item.dictCode"
                    :key="item.dictCode"
                  ></el-option>
                </el-select>
                <span v-else>{{ getclassify(supplierInfo.supplierClasify) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用状态:">
                <el-select
                  v-if="edit"
                  clearable
                  v-model="supplierInfo.useFlg"
                  placeholder="请选择使用类型"
                >
                  <el-option
                    v-for="item in useFlg"
                    :label="item.dictName"
                    :value="item.dictCode"
                    :key="item.dictCode"
                  ></el-option>
                </el-select>
                <span v-else>{{ getuseflg(supplierInfo.useFlg) }}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item label="备注:">
                <el-input
                  clearable
                  size="small"
                  v-model="supplierInfo.supplierText"
                  type="textarea1"
                  autosize
                  v-if="edit"
                ></el-input>
                <span v-else>{{ supplierInfo.supplierText }}</span>
              </el-form-item>
            </el-col>-->
            <div v-if="!edit">
              <el-col :span="12">
                <el-form-item label="创建人:">
                  <span>{{ supplierInfo.createUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间:">
                  <span>{{ supplierInfo.createTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新人:">
                  <span>{{ supplierInfo.updateUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新时间:">
                  <span>{{ supplierInfo.updateTime }}</span>
                </el-form-item>
              </el-col>
            </div>
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
  getSupplierPage,
  removeSupplier,
  saveOrModifySupplier,
  getSupplierPageByAttributes,
} from "@/api/wms/supplier/supplier";
import { getDictPageByAttributes } from "@/api/dict";

export default {
  name: "SupplierManage",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      allAlign: null,
      loading: false,
       
      supplierList: [],
      useFlg: [],
      Classify: [],
      dialogVisible: false,
      supplierInfo: {},
      searchItem: {
        current: 1,
        size: 10,
        supplierName: null,
        supplierCode: null,
        supplierClassify: null,
        useFlg: null
      },
      total: 0,
      dialogTitle: "查看详情",
      edit: true,
      edittype: ""
    };
  },
  async created() {
    let params1 = {
      dictType: "wms_useflg"
    };
    let params2 = {
      dictType: "org_classify"
    };
    await this._getDictPageByAttributes_useflg(params1);
    await this._getDictPageByAttributes_classify(params2);
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
    _getSupplierPage(data) {
      getSupplierPage(data).then(res => {
        if (res.status === 200) {
          this.supplierList = res.data.records;
        }
      });
    },
    _getDictPageByAttributes_useflg(params) {
      getDictPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.useFlg = res.data.records;
        }
      });
    },
    _getDictPageByAttributes_classify(params) {
      getDictPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.Classify = res.data.records;
        }
      });
    },
    _removeSupplier(supplierId) {
      removeSupplier(supplierId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    },
    _saveOrModifySupplier(data) {
      saveOrModifySupplier(data).then(res => {
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
    _getSupplierPageByAttributes(params){
      getSupplierPageByAttributes(params).then(res=>{
        if(res.status === 200){
          this.supplierList = res.data.records;
          this.total = res.data.total;
        }
      })
    },
   _getPage() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this._getSupplierPageByAttributes(this.searchItem);
        this.loading = false;
        resolve()
      }).catch(err => {
        this.Loading = false;
        reject();
      });
    },
    addpage() {
      this.supplierInfo = {};
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "添加";
    },
    saveormodifyhouseinfo() {
      this.edit = false;
      this._saveOrModifySupplier(this.supplierInfo);
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
    getuseflg(data) {
      if (data) {
        for (var i = 0; i < this.useFlg.length; i++) {
          if (this.useFlg[i].dictCode === data) {
            return this.useFlg[i].dictName;
          }
        }
      }
    },
    fmtuseflg({ cellValue }) {
      let item = this.useFlg.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    fmthouseClassify({ cellValue }) {
      let item = this.Classify.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    editRowEvent(row) {
      this.supplierInfo = {};
      this.supplierInfo = row;
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "修改";
    },
    checkRowEvent(row) {
      this.supplierInfo = {};
      this.supplierInfo = row;
      this.dialogVisible = true;
      this.edit = false;
    },
    deleteRowEvent(row) {
      this.$confirm("此操作将永久删除该供应商, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this._removeSupplier(row.supplierId);
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
    }
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
