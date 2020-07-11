<template>
  <div style="margin:30px;">
    <div class="tabletree">
      <vxe-toolbar custom :refresh="{query: searchEvent}">
        <template v-slot:buttons>
          <vxe-input
            clearable
            v-model="searcheItem.categoryName"
            type="search"
            placeholder="输入分类名称"
          ></vxe-input>
          <vxe-input
            clearable
            v-model="searcheItem.categoryCode"
            type="search"
            placeholder="输入分类编号"
          ></vxe-input>
          <vxe-select clearable v-model="searcheItem.categoryClassify" placeholder="选择级别">
            <vxe-option
              v-for="item in Classify"
              :key="item.dictName"
              :value="item.dictCode"
              :label="item.dictName"
            ></vxe-option>
          </vxe-select>
          <vxe-button @click="searchEvent">搜索</vxe-button>
        </template>
      </vxe-toolbar>

      <vxe-table
        ref="xTable"
        border
        show-header-overflow
        show-overflow
        highlight-hover-row
        min-height="500"
        keep-source
        :tree-config="treeConfig"
        :data="categoryList"
        :loading="tableLoading"
      >
        <vxe-table-column field="categoryName" title="分类名称" tree-node></vxe-table-column>
        <vxe-table-column field="categoryCode" title="分类编号"></vxe-table-column>
        <vxe-table-column field="categoryClassify" title="分类级别" :formatter="fmtclassify"></vxe-table-column>
        <vxe-table-column field="categoryText" title="分类描述"></vxe-table-column>
        <vxe-table-column title="操作" width="300">
          <template v-slot="{ row }">
            <template>
              <vxe-button icon="vxe-icon--edit-outline " @click="editRowEvent(row)">编辑</vxe-button>
              <vxe-button @click="insertAtEvent(row)" status="primary">添加子分类</vxe-button>
              <vxe-button
                @click="deleteRowEvent(row)"
                v-if="row.categoryId != '1'"
                status="danger"
              >删除</vxe-button>
            </template>
          </template>
        </vxe-table-column>
      </vxe-table>
      <el-dialog title="修改信息" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div class="categoryInfo">
          <el-form ref="categoryItemInfo" :model="categoryItemInfo" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="分类名称">
                  <el-input v-model="categoryItemInfo.categoryName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分类编码">
                  <el-input v-model="categoryItemInfo.categoryCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="分类说明">
                  <el-input v-model="categoryItemInfo.categoryText" type="textarea"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="changecategoryiteminfo">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getCategoryPageByAttributes,
  getChildCategoryListById,
  getCategoryById,
  saveOrModifyCategory,
  removeCategory
} from "@/api/wms/category/category";

import { getDictPageByAttributes } from "@/api/dict";

export default {
  name: "HouseManage",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      searcheItem: {
        current: 1,
        size: 10,
        categoryName: null,
        categoryCode: null,
        categoryClassify: null
      },
      total: 0,
      treeConfig: {
        lazy: true,
        children: "children",
        hasChild: "hasChild",
        loadMethod: this._getChildrenPage
      },
      categoryList: [],
      Classify: [],
      tableLoading: false,
      dialogVisible: false,
      categoryItemInfo: {}
    };
  },
  created() {
    
    let params = {
      dictType: "wms_classify"
    };
    this._getDictPageByAttributes_classify(params);
    this._getInitPage();
  },
  methods: {
    searchEvent() {
      if (
        this.searcheItem.categoryName ||
        this.searcheItem.categoryCode ||
        this.searcheItem.categoryClassify
      ) {
        return this._getpage();
      } else {
        return this._getInitPage();
      }
    },
    _getChildCategoryListById(categoryId, callback) {
      getChildCategoryListById(categoryId).then(res => {
        if (res.status === 200) {
          callback(res);
        }
      });
    },
    _getInitPage() {
      this.categoryList = []
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getCategoryById("1")
          .then(res => {
            this.categoryList.push(res.data);
            this.categoryList[0].children = [];
            this.categoryList[0].hasChild = true;
            this.total = 1;
            this.tableLoading = false;
            resolve();
          })
          .catch(err => {
            this.tableLoading = false;
            reject();
          });
      });
    },
    _getDictPageByAttributes_classify(params) {
      getDictPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.Classify = res.data.records;
        }
      });
    },
    _getpage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getCategoryPageByAttributes(this.searcheItem)
          .then(async res => {
            this.categoryList = res.data.records;
            for (let i = 0; i < this.categoryList.length; i++) {
              this.categoryList[i].children = [];
              this.categoryList[i].hasChild = true;
            }
            this.total = res.data.total;
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
      return new Promise((resolve, reject) => {
        let params = {
          current: 1,
          size: 10,
          parentCategoryId: row.categoryId
        };
        let children = [];
        getCategoryPageByAttributes(params).then(async res => {
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
    },
    editRowEvent(row) {
      this.categoryItemInfo = row;
      this.dialogVisible = true;
    },
    insertAtEvent(row) {
      this.categoryItemInfo.parentCategoryId = row.categoryId;
      if (row.categoryClassify === "WMS_CLASSIFY_LEVEL1") {
        this.categoryItemInfo.categoryClassify = "WMS_CLASSIFY_LEVEL2";
      } else if (row.categoryClassify === "WMS_CLASSIFY_LEVEL2") {
        this.categoryItemInfo.categoryClassify = "WMS_CLASSIFY_LEVEL3";
      } else if (row.categoryClassify === "WMS_CLASSIFY_LEVEL3") {
        this.categoryItemInfo.categoryClassify = "WMS_CLASSIFY_LEVEL4";
      } else if (row.categoryClassify === "WMS_CLASSIFY_LEVEL4") {
        this.categoryItemInfo.categoryClassify = "WMS_CLASSIFY_LEVEL5";
      } else {
        this.$message({
          type: "warning",
          message: "最高支持五级分类，您已超出分类等级！自动置为五级分类！"
        });
        this.categoryItemInfo.categoryClassify = "WMS_CLASSIFY_LEVEL5";
      }
      this.dialogVisible = true;
    },
    deleteRowEvent(row) {
      this.$confirm("此操作将永久删除该分类 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._getChildCategoryListById(row.categoryId, resdata => {
            if (resdata.status === 200) {
              if (resdata.data.length > 0) {
                this.$message({
                  type: "warning",
                  message: "该分类存在子分类，无法删除！"
                });
              } else {
                this._removeCategory(row.categoryId);
                this.categoryList = [];
                this._getInitPage();
              }
            }
          });
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
    _saveOrModifyCategory(data, callback) {
      saveOrModifyCategory(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据上传成功",
            type: "success"
          });
          callback(res);
        }
      });
    },
    changecategoryiteminfo() {
      this._saveOrModifyCategory(this.categoryItemInfo, resdata => {
        if (resdata.status === 200) {
          this.dialogVisible = false;
          this.categoryList = [];
          this.categoryItemInfo = {}
          this._getInitPage();
        }
      });
    },
    _removeCategory(categoryId) {
      removeCategory(categoryId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    },
    fmtclassify({cellValue}){
       let item = this.Classify.find(item => item.dictCode === cellValue)
              return item ? item.dictName : ''
    }
  }
};
</script>

<style scope>

</style>
