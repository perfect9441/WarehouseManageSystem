<template>
  <div>
    <div style="margin:30px;" class="info-form">
      <el-form :model="warehouseInfo" label-width="120px">
        <el-row>
          <el-col :span="8" class="table-cell">
            <el-form-item label="仓库名称">
              <el-input v-model="warehouseInfo.warehouseName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="仓库编码">
              <el-input v-model="warehouseInfo.warehouseCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">
            <el-form-item label="仓库类型">
              <el-select
                v-model="warehouseInfo.warehouseClassify"
                placeholder="请选择仓库等级"
                @change="changelevel()"
                :disabled="disable"
              >
                <el-option
                  v-for="item in warehouseClassify"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="所属公司">
              <el-select
                v-model="warehouseInfo.companyId"
                placeholder="请选择所属公司"
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
              <el-select v-model="warehouseInfo.useFlg" placeholder="请选择使用类型">
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
              <el-input v-model="warehouseInfo.warehouseUser"></el-input>
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
              <el-input type="companyTel" v-model.number="warehouseInfo.warehouseTel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="table-cell">
            <el-form-item label="联系地址">
              <el-input v-model="warehouseInfo.warehouseAddr"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- TODO:时间格式化处理问题 -->
        <el-row>
          <el-col :span="6" class="table-cell">
            <el-form-item label="创建时间">
              <span>{{warehouseInfo.createTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-form-item label="创建人">
              <span>{{warehouseInfo.createUser}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-form-item label="更新时间">
              <span>{{warehouseInfo.updateTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="table-cell">
            <el-form-item label="更新人">
              <span>{{warehouseInfo.updateUser}}</span>
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
import {
  getWarehouseById,
  saveOrModifyWarehouse
} from "@/api/wms/warehouse/warehouse";
import { getCompanyPageByAttributes } from "@/api/wms/company/company";
import moment from "moment";

export default {
  name: "companyInfo",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      warehouseid: "",
      type: "",
      warehouseInfo: {},
      companyList: [],
      tablePage: {
        current: 1,
        size: 100,
        total: 0
      },
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
    this.warehouseInfo = {};
    
    this.warehouseid = this.$route.params.id;
    if (this.warehouseid === "add") {
      this.type = "保存";
      this.warehouseInfo.useFlg = 'use'
    } else {
        this._getWarehouseById(this.warehouseid);
      this.type = "修改";
      this.disable = true;
      setTimeout(() => {
        this.getcompanylist();
      }, 500);
    }
  },
  methods: {
    saveorupdate() {
      this._saveOrModifyWarehouse(this.warehouseInfo);
    },
    _getWarehouseById(warehouseId) {
      getWarehouseById(warehouseId).then(res => {
        if (res.status === 200) {
          this.warehouseInfo = res.data;
        }
      });
    },
    _saveOrModifyWarehouse(data) {
      saveOrModifyWarehouse(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据上传成功",
            type: "success"
          });
          this.type = "修改";
          this._getWarehouseById(res.data.warehouseId);
        }
      });
    },
    _getCompanyPageByAttributes(data) {
      getCompanyPageByAttributes(data).then(res => {
        if (res.status === 200) {
          this.companyList = res.data.records;
        }
      });
    },
    getcompanylist() {
      let warehouseClassify = "";
      if (this.warehouseInfo.warehouseClassify == "SCQ") {
        warehouseClassify = "SGS";
      } else if (this.warehouseInfo.warehouseClassify == "CCQ") {
        warehouseClassify = "CGS";
      } else if (this.warehouseInfo.warehouseClassify == "QXCQ") {
        warehouseClassify = "QXGS";
      } else if (this.warehouseInfo.warehouseClassify == "XSDCQ") {
        warehouseClassify = "XSD";
      } else if (this.warehouseInfo.warehouseClassify == "ZCQ") {
        warehouseClassify = "ZGS";
      }
      const data = {
        companyClassify: warehouseClassify
      };
      this._getCompanyPageByAttributes(data);
    },
    changelevel() {
      this.warehouseInfo.companyId = '';
      this.getcompanylist();
      
    },
    // 两个select进行级联操作的时候需要进行特殊处理
    getvalue(val){
      if (val) {
        let obj = {}
        obj = this.companyList.find(item => {
          return item.value === val 
        })
        this.$set(this.warehouseInfo, this.warehouseInfo.companyId, val.value)
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
      let item = this.warehouseClassify.find(item => item.value === cellValue);
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
