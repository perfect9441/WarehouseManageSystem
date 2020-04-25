<template>
  <div>
    <div style="margin:30px;" class="info-form">
      <el-form :model="companyInfo" label-width="120px">
        <el-row>
          <el-col :span="8" class="table-cell">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.companyName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="公司编码">
              <el-input v-model="companyInfo.companyCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">
            <el-form-item label="公司等级">
              <el-select
                v-model="companyInfo.companyClassify"
                placeholder="请选择公司等级"
                @change="changelevel()"
                :disabled="disable"
              >
                <el-option
                  v-for="item in companyClassify"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="上级公司">
              <el-select
                v-model="companyInfo.parentCompanyId"
                placeholder="请选择上级公司"
               @change="getvalue()"
                :disabled="disable"
                ref="ad"
              >
                <el-option
                  v-for="item in parentCompanyList"
                  :label="item.companyName"
                  :value="item.companyId"
                  :key="item.companyId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="是否启用">
              <el-select v-model="companyInfo.useFlg" placeholder="请选择公司等级">
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
        <el-row>
          <el-col :span="8" class="table-cell">
            <el-form-item label="联系人">
              <el-input v-model="companyInfo.companyUser"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item
              label="联系电话"
              prop="companyTel"
              :rules="[
              { type: 'number', message: '电话号码必须为数字值'}
            ]"
            >
              <el-input type="companyTel" v-model.number="companyInfo.companyTel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="联系地址">
              <el-input v-model="companyInfo.companyAddr"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- TODO:时间格式化处理问题 -->
        <el-row>
          <el-col :span="6" class="table-cell">
            <el-form-item label="创建时间">
              <span>{{companyInfo.createTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-form-item label="创建人">
              <span>{{companyInfo.createUser}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-form-item label="更新时间">
              <span>{{companyInfo.updateTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-form-item label="更新人">
              <span>{{companyInfo.updateUser}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="saveorupdate">立即{{type}}</el-button>
          <el-button @click="backtoindex">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- TODO:上级公司不存在问题解决 -->
    <div style="margin:30px;" class="cpmoany-friends" v-show="disable" >
      <el-row>
        <el-col :span="24" class="col-title">所属上级公司</el-col>
        <el-form :model="parentCompany" label-width="80px" v-if="parentCompany !== null">
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

    <div style="margin:30px;" class="cpmoany-friends" v-show="disable">
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
    </div>

    <div style="margin:30px;" class="cpmoany-friends" v-show="disable">
      <el-row>
        <el-col :span="24" class="col-title">所辖仓库</el-col>
        <el-col :span="24" class="col-title">
           <vxe-table
          border="inner"
          :align="allAlign"
          :data="warehouseList"
        >
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="warehouseName" title="仓库名称"></vxe-table-column>
          <vxe-table-column field="warehouseCode" title="仓库编码"></vxe-table-column>
          <vxe-table-column field="warehouseClassify" title="仓库类别" :formatter="fmthouseClassify"></vxe-table-column>
          <vxe-table-column field="warehouseUser" title="仓库联系人"></vxe-table-column>
          <vxe-table-column field="warehouseTel" title="仓库联系电话"></vxe-table-column>
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
  getCompanyById,
  saveOrModifyCompany,
  getParentCompanyByChildCompanyId,
  getChildCompanyListByCompanyId,
  getCompanyPage,
  getCompanyPageByAttributes,
} from "@/api/wms/company/company";
import { getWarehousePageByAttributes } from "@/api/wms/warehouse/warehouse";
import moment from "moment";

export default {
  name: "companyInfo",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      companyid: "",
      type: "",
      companyInfo: {},
      companyList: [],
      tablePage: {
        current: 1,
        size: 100,
        total: 0
      },
      companyClassify: [
        {
          value: "ZGS",
          label: "总公司"
        },
        {
          value: "SGS",
          label: "省级分公司"
        },
        {
          value: "CGS",
          label: "市级分公司"
        },
        {
          value: "QXGS",
          label: "区县级分公司"
        },
        {
          value: "XSD",
          label: "乡镇、社区销售点"
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
      warehouseClassify: [
        {
          value: "ZCQ",
          label: "总公司仓库"
        },
        {
          value: "SCQ",
          label: "省级分公司仓库"
        },
        {
          value: "CCQ",
          label: "市级分公司仓库"
        },
        {
          value: "QXCQ",
          label: "区县级分公司仓库"
        },
        {
          value: "XSDCQ",
          label: "乡镇、社区销售点仓库"
        }
      ],
      parentCompanyList: [],
      parentCompany: {},
      chilidcompanylist:[],
      disable: false,
      allAlign: null,
      warehouseList:[]
    };
  },
  created() {
    this.companyInfo = {};
    this.companyid = this.$route.params.id;
    if (this.companyid === "add") {
      this.type = "保存";
      this.companyInfo.useFlg = 'use'
    } else {
      this._getCompanyById(this.companyid);
      this._getParentCompanyByChildCompanyId(this.companyid);
      this._getChildCompanyListByCompanyId(this.companyid)
      const data = {
        companyId:this.companyid
      }
      this._getWarehousePageByAttributes(data)
      this.type = "修改";
      this.disable = true;
      setTimeout(() => {
        this.getparentcompanylist();
      }, 500);
    }
  },
  methods: {
    saveorupdate() {
      this._saveOrModifyCompany(this.companyInfo);
    },
    _getCompanyById(companyId) {
      getCompanyById(companyId).then(res => {
        if (res.status === 200) {
          this.companyInfo = res.data;
        }
      });
    },
    _saveOrModifyCompany(data) {
      saveOrModifyCompany(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据上传成功",
            type: "success"
          });
          this.type = "修改";
          this._getCompanyById(res.data.companyId);
        }
      });
    },
    _getCompanyPage() {
      getCompanyPage(this.tablePage).then(res => {
        if (res.status === 200) {
        }
      });
    },
    _getCompanyPageByAttributes(data) {
      getCompanyPageByAttributes(data).then(res => {
        if (res.status === 200) {
          this.parentCompanyList = res.data.records;
        }
      });
    },
    _getParentCompanyByChildCompanyId(companyId) {
      getParentCompanyByChildCompanyId(companyId).then(res => {
        if (res.status === 200) {
          this.parentCompany = res.data;
        }
      });
    },
    _getChildCompanyListByCompanyId(companyId){
      getChildCompanyListByCompanyId(companyId).then(res=>{
        if(res.status === 200){
            this.chilidcompanylist = res.data
        }
      });
    },
    _getWarehousePageByAttributes(data){
      getWarehousePageByAttributes(data).then(res=>{
        if(res.status === 200){
          this.warehouseList = res.data.records
        }
      })
    },
    getparentcompanylist() {
      let parentClassify = "";
      if (this.companyInfo.companyClassify == "SGS") {
        parentClassify = "ZGS";
      } else if (this.companyInfo.companyClassify == "CGS") {
        parentClassify = "SGS";
      } else if (this.companyInfo.companyClassify == "QXGS") {
        parentClassify = "CGS";
      } else if (this.companyInfo.companyClassify == "XSD") {
        parentClassify = "QXGS";
      } else if (this.companyInfo.companyClassify == "ZGS") {
        return;
      }
      const data = {
        companyClassify: parentClassify
      };
      this._getCompanyPageByAttributes(data);
    },
    changelevel() {
      this.companyInfo.parentCompanyId = '';
      this.getparentcompanylist();
      
    },
    // 两个select进行级联操作的时候需要进行特殊处理
    getvalue(val){
      if (val) {
        let obj = {}
        obj = this.parentCompanyList.find(item => {
          return item.value === val 
        })
        this.$set(this.companyInfo, this.companyInfo.parentCompanyId, val.value)
      } 
    },
    backtoindex() {
      const router = {
        name: "CompanyManager",
        params: {},
        meat: {}
      };
      this.$router.push(router);
    },
     fmtcompanylevel({ cellValue }) {
      let item = this.companyClassify.find(item => item.value === cellValue);
      return item ? item.label : "";
    },
    fmtuseflg({ cellValue }) {
      let item = this.useFlg.find(item => item.value === cellValue);
      return item ? item.label : "";
    },
    fmthouseClassify({ cellValue }) {
      let item = this.warehouseClassify.find(item => item.value === cellValue);
      return item ? item.label : "";
    },
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
