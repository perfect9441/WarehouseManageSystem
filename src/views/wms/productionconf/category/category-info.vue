<template>
  <div>
    <div style="margin:30px;" class="info-form">
      <el-form :model="categoryInfo" label-width="120px">
        <el-row>
          <el-col :span="8" class="table-cell">
            <el-form-item label="分类名称">
              <el-input v-model="categoryInfo.categoryName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="分类编码">
              <el-input v-model="categoryInfo.categoryCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">
            <el-form-item label="分类类型">
              <el-select
                v-model="categoryInfo.categoryClassify"
                placeholder="请选择分类等级"
                @change="changelevel()"
                :disabled="disable"
              >
                <el-option
                  v-for="item in categoryClassify"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="上级分类">
              <el-select
                v-model="categoryInfo.parentCategoryId"
                placeholder="请选择上级分类"
                :disabled="disable"
              >
                <el-option
                  v-for="item in categoryList"
                  :label="item.categoryName"
                  :value="item.categoryId"
                  :key="item.categoryId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="是否启用">
              <el-select v-model="categoryInfo.useFlg" placeholder="请选择使用类型">
                <el-option
                  v-for="item in useFlg"
                  :label="item.label"
                  :value="item.value"
                  :key="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- TODO:时间格式化处理问题 -->
        <el-row>
          <el-col :span="6" class="table-cell">
            <el-form-item label="创建时间">
              <span>{{categoryInfo.createTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-form-item label="创建人">
              <span>{{categoryInfo.createUser}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-form-item label="更新时间">
              <span>{{categoryInfo.updateTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-form-item label="更新人">
              <span>{{categoryInfo.updateUser}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="saveorupdate">立即{{type}}</el-button>
          <el-button @click="backtoindex">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin:30px;" class="category-friends" v-show="disable">
      <el-row>
        <el-col :span="24" class="col-title">所属上级分类</el-col>
        <el-form :model="parentcategory" label-width="80px">
          <el-col :span="4" class="col-text">
            <el-form-item label="分类名称">
              <span>{{parentcategory.categoryName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="col-text">
            <el-form-item label="分类代码">
              <span>{{parentcategory.categoryCode}}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4" class="col-text">
            <el-form-item label="分类级别">
              <span>{{parentcategory.categoryClassify}}</span>
            </el-form-item>
          </el-col> -->
        </el-form>
      </el-row>
    </div>
    <div style="margin:30px;" class="category-friends" v-show="disable">
      <el-row>
        <el-col :span="24" class="col-title">所辖子公司</el-col>
        <el-col :span="24" class="col-title">
          <vxe-table border="inner" :align="allAlign" :data="childcategorylist">
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column field="categoryName" title="分类名称"></vxe-table-column>
            <vxe-table-column field="categoryCode" title="分类编码"></vxe-table-column>
            <vxe-table-column field="categoryClassify" title="分类级别" :formatter="fmtcategorylevel"></vxe-table-column>
            <vxe-table-column field="useFlg" title="是否使用" :formatter="fmtuseflg"></vxe-table-column>
          </vxe-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getCategoryById,
  saveOrModifyCategory,
  getCategoryPageByAttributes,
  getParentCategoryByChildCategoryId,
  getChildCategoryListById
} from "@/api/wms/category/category";

export default {
  name: "CategoryInfo",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      categoryId: "",
      type: "",
      categoryInfo: {},
      parentcategory: {},
      categoryList: [],
      childcategorylist: [],
      tablePage: {
        current: 1,
        size: 100,
        total: 0
      },
      categoryClassify: [
        {
          value: "L1",
          label: "一级分类"
        },
        {
          value: "L2",
          label: "二级分类"
        },
        {
          value: "L3",
          label: "三级分类"
        },
        {
          value: "L4",
          label: "四级分类"
        },
        {
          value: "L5",
          label: "五级分类"
        }
      ],
      useFlg: [
        {
          value: "use",
          label: "启用"
        },
        {
          value: "pause",
          label: "暂停使用"
        },
        {
          value: "abandon",
          label: "弃用"
        }
      ],
      disable: false,
      allAlign: null
    };
  },
  created() {
    this.categoryInfo = {};
    this.categoryId = this.$route.params.id;
    if (this.categoryId === "add") {
      this.type = "保存";
      this.categoryInfo.useFlg = "use";
    } else {
      this._getCategoryById(this.categoryId);
      this._getChildCategoryListById(this.categoryId);
      this._getParentCategoryByChildCategoryId(this.categoryId);
      this.type = "修改";
      this.disable = true;
      setTimeout(() => {
        this.getparentCategorylist();
      }, 500);
    }
  },
  methods: {
    saveorupdate() {
      this._saveOrModifyCategory(this.categoryInfo);
    },
    _getCategoryById(categoryId) {
      getCategoryById(categoryId).then(res => {
        if (res.status === 200) {
          this.categoryInfo = res.data;
        }
      });
    },
    _saveOrModifyCategory(data) {
      saveOrModifyCategory(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据上传成功",
            type: "success"
          });
          this.type = "修改";
          this.disable = false
          this._getCategoryById(res.data.categoryId);
        }
      });
    },
    _getCategoryPageByAttributes(data) {
      getCategoryPageByAttributes(data).then(res => {
        if (res.status === 200) {
          this.categoryList = res.data.records;
        }
      });
    },
    _getChildCategoryListById(categoryId) {
      getChildCategoryListById(categoryId).then(res => {
        if (res.status === 200) {
          this.childcategorylist = res.data;
        }
      });
    },
    _getParentCategoryByChildCategoryId(categoryId) {
      getParentCategoryByChildCategoryId(categoryId).then(res => {
        if (res.status === 200) {
          this.parentcategory = res.data;
        }
      });
    },
    getparentCategorylist() {
      let categoryClassify = "";
      if (this.categoryInfo.categoryClassify == "L2") {
        categoryClassify = "L1";
      } else if (this.categoryInfo.categoryClassify == "L3") {
        categoryClassify = "L2";
      } else if (this.categoryInfo.categoryClassify == "L4") {
        categoryClassify = "L3";
      } else if (this.categoryInfo.categoryClassify == "L5") {
        categoryClassify = "L4";
      } else if (this.categoryInfo.categoryClassify == "L1") {
        // categoryClassify = "ZGS";
        return;
      }
      const data = {
        categoryClassify: categoryClassify
      };
      this._getCategoryPageByAttributes(data);
    },
    changelevel() {
      this.categoryInfo.parentCategoryId = "";
      this.getparentCategorylist();
    },
    getvalue(val) {
      if (val) {
        let obj = {};
        obj = this.categoryList.find(item => {
          return item.value === val;
        });
        this.$set(this.categoryInfo, this.categoryInfo.categoryId, val.value);
      }
    },
    backtoindex() {
      const router = {
        name: "CategoryManager",
        params: {},
        meat: {}
      };
      this.$router.push(router);
    },
    fmtcategorylevel({ cellValue }) {
      let item = this.categoryClassify.find(item => item.value === cellValue);
      return item ? item.label : "";
    },
    fmtuseflg({ cellValue }) {
      let item = this.useFlg.find(item => item.value === cellValue);
      return item ? item.label : "";
    }
  }
};
</script>

<style scope>
.info-form,
.category-friends {
  background-color: #eeeeee;
  border-radius: 10px;
  /* min-height: 500px; */
  padding: 20px;
}
.col-title {
  text-align: center;
  letter-spacing: 8px;
  font-size: 20px;
  border-bottom: 2px solid rgb(164, 165, 165);
}
.col-text {
  padding-top: 10px;
}
</style>
