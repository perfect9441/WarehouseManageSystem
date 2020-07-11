<template>
  <div style="margin:30px;">
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" @click="addpage()">添加商品</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="content-bar">
        <vxe-toolbar :refresh="{query: _getPage}" custom>
          <template v-slot:buttons>
            <el-row>
              <vxe-input clearable v-model="searchItem.itemName" type="search" placeholder="商品名称"></vxe-input>
              <vxe-input clearable v-model="searchItem.itemCode" type="search" placeholder="商品代码"></vxe-input>
              <el-cascader
                clearable
                placeholder="请选择分类"
                v-model="selectCategoryinfo"
                :props="defaultProps"
                @change="handleSearchCategorySelectChange"
              ></el-cascader>
              <vxe-select clearable v-model="searchItem.supplierId" placeholder="选择供应商">
                <vxe-option
                  v-for="(item,index) in supplierList"
                  :key="index"
                  :value="item.supplierId"
                  :label="item.supplierName"
                ></vxe-option>
              </vxe-select>
              <vxe-button @click="_getPage" status="primary">搜索</vxe-button>
            </el-row>
          </template>
        </vxe-toolbar>
        <vxe-table border="inner" :align="allAlign" :data="itemList" :loading="loading" highlight-hover-row stripe>
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="itemName" title="商品名称"></vxe-table-column>
          <vxe-table-column field="itemCode" title="商品代码"></vxe-table-column>
          <vxe-table-column field="categoryName" title="分类"></vxe-table-column>
          <vxe-table-column field="itemUnit" title="计量单位"></vxe-table-column>
          <vxe-table-column title="操作" width="380" fixed="right">
            <template v-slot="{ row }">
              <template>
                <vxe-button status="primary" @click="checkRowEvent(row)">查看详情</vxe-button>
              </template>
              <template>
                <vxe-button status="primary" @click="editRowEvent(row)">编辑</vxe-button>
              </template>
              <template>
                <vxe-button status="primary" @click="editRowValue(row)">货物管理</vxe-button>
              </template>
              <template>
                <vxe-button status="danger" @click="deleteRowEvent(row)">删除</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          :current-page="searchItem.current"
          :page-size="searchItem.size"
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
        <el-form ref="itemInfo" :model="itemInfo" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商品名称:">
                <el-input clearable size="small" v-model="itemInfo.itemName" v-if="edit"></el-input>
                <span v-else>{{ itemInfo.itemName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商品代码:">
                <el-input clearable size="small" v-model="itemInfo.itemCode" v-if="edit"></el-input>
                <span v-else>{{ itemInfo.itemCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="商品分类:">
                <el-button @click="choicecategory" :disabled="!edit" style="width:100%">{{currentcategoryName}}</el-button>
                <el-dialog width="30%" title="选择分类" :visible.sync="innerVisible" append-to-body>
                  <div>
                    <el-cascader
                      clearable
                      placeholder="请选择商品分类"
                      :props="defaultProps"
                       v-model="selectCategoryinfo"
                      @change="handleChoiceCategorySelectChange"
                    ></el-cascader>
                  </div>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="innerVisible = false">选择</el-button>
                  </div>
                </el-dialog>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商:">
                <el-select v-if="edit" clearable v-model="itemInfo.supplierId" placeholder="请选择供应商" style="width:100%" @change="handleselectsupplierchange">
                  <el-option
                    v-for="item in supplierList"
                    :label="item.supplierName"
                    :value="item.supplierId"
                    :key="item.supplierName"
                  ></el-option>
                </el-select>
                <span v-else>{{ itemInfo.supplierName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计量单位:">
                <el-input clearable size="small" v-model="itemInfo.itemUnit" v-if="edit"></el-input>
                <span v-else>{{ itemInfo.itemUnit }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input
                  clearable
                  size="small"
                  v-model="itemInfo.itemText"
                  type="textarea1"
                  autosize
                  v-if="edit"
                ></el-input>
                <span v-else>{{ itemInfo.itemText }}</span>
              </el-form-item>
            </el-col>
            <div v-if="!edit">
              <el-col :span="12">
                <el-form-item label="创建人:">
                  <span>{{ itemInfo.createUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间:">
                  <span>{{ itemInfo.createTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新人:">
                  <span>{{ itemInfo.updateUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新时间:">
                  <span>{{ itemInfo.updateTime }}</span>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <div v-if="edit">
          <el-button @click="saveormodifyiteminfo">{{edittype}}信息</el-button>
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
  getItemPage,
  removeItem,
  saveOrModifyItem,
  getItemPageByAttributes
} from "@/api/wms/goods/goods";
import {
  getChildCategoryListById,
  getCategoryById
} from "@/api/wms/category/category";
import { getDictPageByAttributes } from "@/api/dict";
import { getSupplierPageByAttributes,getSupplierById } from "@/api/wms/supplier/supplier"

export default {
  name: "GoodsManage",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      allAlign: null,
      loading: false,
      itemList: [],
      useFlg: [],
      Classify: [],
      dialogVisible: false,
      itemInfo: {},
      dialogTitle: "查看详情",
      edit: true,
      edittype: "",
      innerVisible: false,
      choiceCategory: {},
      currentcategoryName: "",
      defaultProps: {
        checkStrictly: true,
        lazy: true,
        value: "categoryId",
        label: "categoryName",
        children: "children",
        lazyLoad: this._categoryLazyLoad
      },
      categoryList: [],
      searchItem: {
        current: 1,
        size: 10,
        itemName: null,
        itemCode: null,
        useFlg: null,
        itemType:"WMS_TYPE_PORODUCT",
        supplierId:null
      },
      total: 0,
      selectCategoryinfo:{},
      supplierList:[]
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
    await this._getSupplierPageByAttributes()
  },
  methods: {
    _getItemPage(data) {
      getItemPage(data).then(res => {
        if (res.status === 200) {
          this.itemList = res.data.records;
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
    _removeItem(itemId) {
      removeItem(itemId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    },
    _saveOrModifyItem(data) {
      saveOrModifyItem(data).then(res => {
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
    _getItemPageByAttributes(params) {
      getItemPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.itemList = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    _getCategoryById(categoryId, callback) {
      getCategoryById(categoryId).then(res => {
        if (res.status === 200) {
          callback(res.data);
        }
      });
    },
    _getSupplierPageByAttributes(params){
      getSupplierPageByAttributes(params).then(res=>{
        if(res.status === 200){
          this.supplierList = res.data.records
        }
      })
    },
    _getSupplierById(supplierId,callback){
      getSupplierById(supplierId).then(res=>{
        if(res.status === 200){
          callback(res)
        }
      })
    },
    _categoryLazyLoad(node, resolve) {
      if (node.data) {
        let categoryId = node.data.categoryId;
        getChildCategoryListById(categoryId).then(res => {
          if (res.status === 200) {
            resolve(res.data);
          }
        });
      } else {
        resolve([
          {
            categoryName: "商品分类",
            categoryId: "1",
            categoryClassify: "WMS_CLASSIFY_LEVEL1"
          }
        ]);
      }
    },
    handleSearchCategorySelectChange(e) {
      if (e.length == 0) {
        this.searchItem.categoryId = null;
      } else {
        this.searchItem.categoryId = e[e.length - 1];
      }
    },
    handleChoiceCategorySelectChange(e) {
      if (e.length == 0) {
        this.itemInfo.categoryId = null;
        this.itemInfo.categoryName = null;
      } else {
        this.itemInfo.categoryId = e[e.length - 1];
      }
      this._getCategoryById(this.itemInfo.categoryId, data => {
        this.itemInfo.categoryName = data.categoryName;
        this.currentcategoryName = data.categoryName;
      });
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this._getItemPageByAttributes(this.searchItem);
        this.loading = false;
        resolve();
      }).catch(err => {
        this.Loading = false;
        reject();
      });
    },
    addpage() {
      this.itemInfo = {};
      this.itemInfo.itemType = "WMS_TYPE_PORODUCT"
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "添加";
      this.currentcategoryName = "选择分类";
    },
    saveormodifyiteminfo() {
      this.edit = false;
      this._saveOrModifyItem(this.itemInfo);
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
    fmtcategory({ cellValue }) {},
    editRowEvent(row) {
      this.itemInfo = {};
      this.itemInfo = row;
      this.itemInfo.itemType = "WMS_TYPE_PORODUCT"
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "修改";
      this._getCategoryById(row.categoryId, data => {
        this.currentcategoryName = data.categoryName;
      });
      
    },
    checkRowEvent(row) {
      this.itemInfo = {};
      this.itemInfo = row;
      this.dialogVisible = true;
      this.edit = false;
      this._getCategoryById(row.categoryId, data => {
        this.currentcategoryName = data.categoryName;
      });
    },
    deleteRowEvent(row) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this._removeItem(row.itemId);
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
    choicecategory() {
      this.selectCategoryinfo = {}
      this.innerVisible = true;
    },
    editRowValue(row) {
      this.$router.push({
        name: "CPGoodsDetialInfo",
        params: { id: row.itemId }
      });
    },
    handleselectsupplierchange(e){
    this._getSupplierById(e,resdata=>{
        this.itemInfo.supplierName = resdata.data.supplierName
      })
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
  min-height: 500px;
}

.form-item {
  margin-bottom: 1px solid #dbdbdb;
}
</style>
