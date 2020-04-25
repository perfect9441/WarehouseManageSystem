<template>
  <div>
    <div style="margin:30px;" class="info-form">
      <el-form :model="categoryInfo" label-width="120px">
        <el-row>
          <el-col :span="8" class="table-cell">
            <el-form-item label="分类名称">
              <el-input v-model="categoryInfo.warehouseName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="分类编码">
              <el-input v-model="categoryInfo.warehouseCode"></el-input>
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
                v-model="categoryInfo.companyId"
                placeholder="请选择上级分类"
                :disabled="disable"
              >
                <el-option
                  v-for="item in companyList"
                  :label="item.companyName"
                  :value="item.companyId"
                  :key="item.companyId"
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
    <!-- <div style="margin:30px;" class="cpmoany-friends">
      <el-row>
        <el-col :span="24" class="col-title">所属上级公司</el-col>
        <el-form :model="parentCompany" label-width="80px">
          <el-col :span="4" class="col-text">
            <el-form-item label="公司名称">
              <span>{{parentCompany.companyName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="col-text">
            <el-form-item label="公司代码">
              <span>{{parentCompany.companyCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="col-text">
            <el-form-item label="公司名称">
              <span>{{parentCompany.companyUser}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="col-text">
            <el-form-item label="公司名称">
              <span>{{parentCompany.companyTel}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="col-text">
            <el-form-item label="公司地址">
              <span>{{parentCompany.companyAddr}}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>

    <div style="margin:30px;" class="cpmoany-friends">
      <el-row>
        <el-col :span="24" class="col-title">所辖子公司</el-col>
        <el-col :span="24" class="col-title">
           <vxe-table
          border="inner"
          :align="allAlign"
          :data="chilidcompanylist"
        >
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="companyName" title="公司名称"></vxe-table-column>
          <vxe-table-column field="companyCode" title="公司编码"></vxe-table-column>
          <vxe-table-column field="companyClassify" title="公司级别" :formatter="fmtcompanylevel"></vxe-table-column>
          <vxe-table-column field="companyUser" title="公司联系人"></vxe-table-column>
          <vxe-table-column field="companyTel" title="公司联系电话"></vxe-table-column>
          <vxe-table-column field="useFlg" title="是否使用" :formatter="fmtuseflg"></vxe-table-column>
        </vxe-table>
        </el-col>
        
      </el-row>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getCategoryById,saveOrModifyCategory } from "@/api/wms/category/category";

export default {
  name: "categoryInfo",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      categoryId: "",
      type: "",
      categoryInfo: {},
      parentCategoryList: [],
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
      this.categoryInfo.useFlg = 'use'
    } else {
        this._getCategoryById(this.categoryId);
      this.type = "修改";
      this.disable = true;
      // setTimeout(() => {
      //   this.getcompanylist();
      // }, 500);
    }
  },
  methods: {
    saveorupdate() {
      this._saveOrModifyWarehouse(this.categoryInfo);
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
          this._getCategoryById(res.data.categoryId);
        }
      });
    },
    // _getCompanyPageByAttributes(data) {
    //   getCompanyPageByAttributes(data).then(res => {
    //     if (res.status === 200) {
    //       this.companyList = res.data.records;
    //     }
    //   });
    // },
    getparentCategorylist() {
      let categoryClassify = "";
      if (this.categoryInfo.categoryClassify == "SCQ") {
        categoryClassify = "SGS";
      } else if (this.categoryInfo.categoryClassify == "CCQ") {
        categoryClassify = "CGS";
      } else if (this.categoryInfo.categoryClassify == "QXCQ") {
        categoryClassify = "QXGS";
      } else if (this.categoryInfo.categoryClassify == "XSDCQ") {
        categoryClassify = "XSD";
      } else if (this.categoryInfo.categoryClassify == "ZCQ") {
        categoryClassify = "ZGS";
      }
      const data = {
        categoryClassify: categoryClassify
      };
      this._getCompanyPageByAttributes(data);
    },
    changelevel() {
      this.categoryInfo.companyId = '';
      this.getcompanylist();
      
    },
    // 两个select进行级联操作的时候需要进行特殊处理
    getvalue(val){
      if (val) {
        let obj = {}
        obj = this.companyList.find(item => {
          return item.value === val 
        })
        this.$set(this.categoryInfo, this.categoryInfo.companyId, val.value)
      } 
    },
    backtoindex() {
      const router = {
        name: "HouseManager",
        params: {},
        meat: {}
      };
      this.$router.push(router);
    },
    fmtcompanylevel({ cellValue }) {
      let item = this.categoryClassify.find(item => item.value === cellValue);
      return item ? item.label : "";
    },
    fmtuseflg({ cellValue }) {
      let item = this.useFlg.find(item => item.value === cellValue);
      return item ? item.label : "";
    }
    // formatdate(data) {
    //   if (this.companyid === "add") {
    //     return;
    //   } else {
    //     var date = new Date(data);
    //     return moment(date).format("YYYY-MM-DD HH:mm:ss");
    //   }
    // }
  }
};
</script>

<style scope>
.info-form,
.cpmoany-friends {
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
