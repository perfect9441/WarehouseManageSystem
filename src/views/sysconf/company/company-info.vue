<template>
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
        <el-col :span="8" class="table-cell">
          <el-form-item label="上级公司">
            <el-input v-model="companyInfo.parentCompanyId"></el-input>
          </el-form-item>
        </el-col>
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
      </el-row>
      <el-row>
        <el-col :span="6" class="table-cell">
          <el-form-item label="创建时间">
            <span>{{companyInfo.createTime}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="table-cell">
          <el-form-item label="创建人">
            <span>{{companyInfo.createUse}}r</span>
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
</template>

<script>
import { mapGetters } from "vuex";
import { getCompanyById, saveOrModifyCompany } from "@/api/company";
import moment from 'moment'

export default {
  name: "companyInfo",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      data: {},
      status: "",
      type: "",
      // ables:false,
      companyInfo: {}
    };
  },
  created() {
    this.data = this.$route.params.data;
    this.status = this.$route.params.status;
    if (this.status === "create") {
      this.type = "保存";
      // this.ables = true
    } else if (this.status === "update") {
      /*
        根据传过来的id获取车辆信息
         */

      this.type = "修改";
      // this.ables = false
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
        console.info(res)
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
    backtoindex() {
      const router = {
        name: "CompanyManager",
        params: {},
        meat: {}
      };
      this.$router.push(router);
    }
  }
};
</script>

<style scope>
.info-form {
  background-color: #eeeeee;
  border-radius: 10px;
  /* min-height: 500px; */
  padding: 20px;
}
</style>
