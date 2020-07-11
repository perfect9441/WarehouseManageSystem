<template>
  <div style="margin:30px;">
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" @click="addpage()">添加参数</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="content-bar">
        <vxe-toolbar :refresh="{query: _getPage}" custom>
          <template v-slot:buttons>
          <el-row>
            <vxe-input clearable v-model="searchItem.propName" type="search" placeholder="参数名称"></vxe-input>
            <vxe-input clearable v-model="searchItem.propCode" type="search" placeholder="参数代码"></vxe-input>
            <el-cascader
              clearable
              placeholder="请选择分类"
              :props="defaultProps"
              @change="handleSearchCategorySelectChange"
            ></el-cascader>
            <vxe-select clearable v-model="searchItem.useFlg" placeholder="选择参数类型">
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
        <vxe-table border="inner" :align="allAlign" :data="propList" :loading="loading">
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="propName" title="参数名称"></vxe-table-column>
          <vxe-table-column field="propCode" title="参数代码"></vxe-table-column>
          <vxe-table-column field="categoryName" title="分类"></vxe-table-column>
          <vxe-table-column field="useFlg" title="使用状态" :formatter="fmtuseflg"></vxe-table-column>
          <vxe-table-column title="操作" width="380" fixed="right">
            <template v-slot="{ row }">
              <template>
                <vxe-button status="primary" @click="checkRowEvent(row)">查看详情</vxe-button>
              </template>
              <template>
                <vxe-button status="primary" @click="editRowEvent(row)">编辑</vxe-button>
              </template>
              <template>
                <vxe-button status="primary" @click="editRowValue(row)">参数值管理</vxe-button>
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
        <el-form ref="propInfo" :model="propInfo" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="参数名称:">
                <el-input clearable size="small" v-model="propInfo.propName" v-if="edit"></el-input>
                <span v-else>{{ propInfo.propName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数代码:">
                <el-input clearable size="small" v-model="propInfo.propCode" v-if="edit"></el-input>
                <span v-else>{{ propInfo.propCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="参数分类:">
                <el-button @click="choicecategory" :disabled="!edit">{{currentcategoryName}}</el-button>
                <el-dialog width="30%" title="选择分类" :visible.sync="innerVisible" append-to-body>
                  <div>
                    <el-cascader
                      clearable
                      placeholder="请选择商品分类"
                      v-model="CategoryInfo"
                      :props="defaultProps"
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
              <el-form-item label="使用状态:">
                <el-select v-if="edit" clearable v-model="propInfo.useFlg" placeholder="请选择使用类型">
                  <el-option
                    v-for="item in useFlg"
                    :label="item.dictName"
                    :value="item.dictCode"
                    :key="item.dictCode"
                  ></el-option>
                </el-select>
                <span v-else>{{ getuseflg(propInfo.useFlg) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input
                  clearable
                  size="small"
                  v-model="propInfo.propText"
                  type="textarea1"
                  autosize
                  v-if="edit"
                ></el-input>
                <span v-else>{{ propInfo.propText }}</span>
              </el-form-item>
            </el-col>
            <div v-if="!edit">
              <el-col :span="12">
                <el-form-item label="创建人:">
                  <span>{{ propInfo.createUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间:">
                  <span>{{ propInfo.createTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新人:">
                  <span>{{ propInfo.updateUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新时间:">
                  <span>{{ propInfo.updateTime }}</span>
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
  getPropPage,
  removeProp,
  saveOrModifyProp,
  getPropPageByAttributes
} from "@/api/wms/parameter/parameter";
import {
  getChildCategoryListById,
  getCategoryById
} from "@/api/wms/category/category";
import { getDictPageByAttributes } from "@/api/dict";

export default {
  name: "PropManage",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      allAlign: null,
      loading: false,
      propList: [],
      useFlg: [],
      Classify: [],
      dialogVisible: false,
      propInfo: {},
      dialogTitle: "查看详情",
      edit: true,
      edittype: "",
      innerVisible: false,
      defaultProps: {
        checkStrictly: true,
        lazy: true,
        value: "categoryId",
        label: "categoryName",
        children: "children",
        lazyLoad: this._categoryLazyLoad
      },
      categoryList: [],
      choiceCategory: {},
      currentcategoryName: "",
      searchItem: {
        current: 1,
        size: 10,
        warehouseName: null,
        warehouseCode: null,
        warehouseClassify: null,
        useFlg: null
      },
      total: 0,
      CategoryInfo:{}
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
    _getPropPage(data) {
      getPropPage(data).then(res => {
        if (res.status === 200) {
          this.propList = res.data.records;
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
    _removeProp(propId) {
      removeProp(propId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    },
    _saveOrModifyProp(data) {
      saveOrModifyProp(data).then(res => {
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
    _getPropPageByAttributes(pramers) {
      getPropPageByAttributes(pramers).then(res => {
        if (res.status === 200) {
          this.propList = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    _getCategoryById(categoryId,callback) {
      getCategoryById(categoryId).then(res => {
        if (res.status === 200) {
          callback(res.data)
        }
      });
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
    async handleChoiceCategorySelectChange(e) {
      if (e.length == 0) {
        this.propInfo.categoryId = null;
        this.propInfo.categoryName = null;
      } else {
        this.propInfo.categoryId = e[e.length - 1];
      }
      this._getCategoryById(this.propInfo.categoryId,(data)=>{
        this.currentcategoryName = data.categoryName;
        this.propInfo.categoryName = data.categoryName
      })
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this._getPropPageByAttributes(this.searchItem);
        this.loading = false;
        resolve();
      }).catch(err => {
        this.Loading = false;
        reject();
      });
    },
    addpage() {
      this.propInfo = {};
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "添加";
      this.currentcategoryName = "选择分类";
    },
    saveormodifyhouseinfo() {
      this.edit = false;
      this._saveOrModifyProp(this.propInfo);
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
      this.propInfo = {};
      this.propInfo = row;
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "修改";
      this._getCategoryById(row.categoryId,(data)=>{
        this.currentcategoryName = data.categoryName;
      })
    },
    checkRowEvent(row) {
      this.propInfo = {};
      this.propInfo = row;
      this.dialogVisible = true;
      this.edit = false;
      this._getCategoryById(row.categoryId,(data)=>{
        this.currentcategoryName = data.categoryName;
      })
    },
    deleteRowEvent(row) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this._removeProp(row.propId);
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
      this.CategoryInfo = {}
      this.innerVisible = true;
    },
    editRowValue(row) {
      this.$router.push({
        name: "ParameterValueManager",
        params: { id: row.propId }
      });
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
