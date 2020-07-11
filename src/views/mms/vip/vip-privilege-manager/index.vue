<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">{{vipData.vipName+'--等级权益管理'}}</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <vxe-button icon="fa fa-plus" @click="insertEvent">新增</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      ref="xTable"
      border
      show-header-overflow
      show-overflow
      highlight-hover-row
      max-height="500"
      keep-source
      :data="dataList"
      :loading="tableLoading"
      :edit-config="{trigger: 'manual', mode: 'row'}"
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="vpName" title="名称"></vxe-table-column>
      <vxe-table-column field="busniessKey" title="业务">
        <template v-slot="{ row }">
          <template v-if="row.busniessKey!=null">
            <el-tag type="info">{{vpBizKeyMap[row.busniessKey]}}</el-tag>
          </template>
          <template v-else>
            <el-tag type="warning">{{'无'}}</el-tag>
          </template>
        </template>
      </vxe-table-column>
      <vxe-table-column field="vpType" title="分类">
        <template v-slot="{ row }">
          <el-tag :type="row.vpType=='VP_TYPE_BIZ'?'info':'warning'">{{vpTypeMap[row.vpType]}}</el-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="imageUrl" title="权益图标" align="center">
        <template v-slot="{ row }">
          <img class="tableImage" v-if="row.imageUrl" :src="imageDownLoadUrl+row.imageUrl" />
          <el-tag v-if="!row.imageUrl" type="info">无图片</el-tag>
        </template>
      </vxe-table-column>

      <vxe-table-column
        field="vpValue"
        title="值"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="200">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button icon="vxe-icon--edit-outline " @click="editRowEvent(row)">编辑</vxe-button>
            <vxe-button @click="deleteRowEvent(row)" status="danger">删除</vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
 

    <vxe-modal
      v-model="showEdit"
      title="新增权益"
      width="800"
      :loading="submitModalLoading"
      resize
      destroy-on-close
      lock-view
    >
      <vxe-form
        ref="xForm"
        :data="formData"
        :rules="formRules"
        title-align="right"
        title-width="150"
        @submit="submitFormEvent"
      >
        <vxe-form-item title="选择权益类型" field="vpcateId" >
          <vxe-select
            v-model="formData.vpcateId"
            placeholder="选择权益类型"
            @change="onChooseVpCateChange"
          >
            <vxe-option
              v-for="item in vpCateList"
              :key="item.vpcateId"
              :value="item.vpcateId"
              :label="item.vpName"
            ></vxe-option>
          </vxe-select>
        </vxe-form-item>

        <vxe-form-item align="center" span="24">
          <vxe-button type="submit" status="primary">提交</vxe-button>
        </vxe-form-item>
      </vxe-form>
    </vxe-modal>
  </div>
</template>

<script>
import { getDictPageByAttributes } from "@/api/dict";
import { _getDictMap } from "@/utils/my-utils";
import { getVpCatePage } from "@/api/mms/vp-cate.js";
import { getUploadImagePath, getDownLoadImagePath } from "@/api/fastdfs";
import { getVipById } from "@/api/mms/vip";
import {
  getVipPrivilegePageByAttributes,
  saveOrModifyVipPrivilege,
  removeVipPrivilege
} from "@/api/mms/vp";
import { mapGetters } from "vuex";

export default {
  name: "VipPrivilegeManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      submitModalLoading:false,
      showEdit:false,
      formData: {},
      formRules: {
        vpcateId: [{ required: true, message: "必须选择分类" }]
      },
      imageDownLoadUrl: "",
      vpTypeList: [],
      vpTypeMap: {},
      vpBizKeyList: [],
      vpBizKeyMap: {},
      chooseVpCateData: {},
      vpCateList: [],
      vipData: {},
      tableLoading: false,

      queryList: {
        current: 1,
        size: 100,
        vipId: ""
      },
      dataList: [],
      total: 0,
      pages: 0
    };
  },
  methods: {
  async  onChooseVpCateChange(e) {
      console.info(e);
      let hasVpCate=this.dataList.find(item=>{
        return item.vpcateId==e.value
      })
      if(hasVpCate){
        this.formData.vpcateId=null
        this.$XModal.message({
          message: "该会员等级已存在该权益", status: "warning"
        })
        return
      }
      this.chooseVpCateData=this.vpCateList.find(item=>{
        return item.vpcateId==e.value
      })
      console.info( this.chooseVpCateData)

      
    },
    async submitFormEvent() {
      const errMap = await this.$refs.xForm
        .validate(this.formData)
        .catch(errMap => errMap);
      console.info(errMap);
      if (errMap) {
        return;
      }
      let record = {};
      record.busniessKey=this.chooseVpCateData.busniessKey
      record.imageUrl=this.chooseVpCateData.imageUrl
      record.vipId=this.$route.params.id
      record.vipName=this.vipData.vipName
      record.vpName=this.chooseVpCateData.vpName
      record.vpType=this.chooseVpCateData.vpType
      record.vpcateId=this.chooseVpCateData.vpcateId
   
      let { row } = await this.$refs.xTable.insert(record);
      // console.info(newRow)
      await this.$refs.xTable.setActiveRow(row);
      this.showEdit = false;
    },
    async insertEvent() {
      this.formData = {};
      this.showEdit = true;
      
    },
    async saveRowEvent(row) {
      let selectRecords = [];

      this.$refs.xTable.clearActived().then(() => {
        this.tableLoading = true;

        saveOrModifyVipPrivilege(row)
          .then(res => {
            console.info("saveOrModifyVipPrivilege");
            console.info(res);
            if (!row.vpId) {
              row.vpId = res.data.vpId;
              row.version = res.data.version;
            }
            this.tableLoading = false;
            this.$XModal.message({ message: "保存成功！", status: "success" });
          })
          .catch(err => {
            this.tableLoading = false;
            this.$XModal.message({ message: "保存失败！", status: "error" });
          });
      });
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable;
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row);
      });
    },
    editRowEvent(row) {
      console.info(row);
      this.$refs.xTable.setActiveRow(row);
    },
    deleteRowEvent(row) {
      this.$XModal.confirm("您确定要删除该数据?").then(type => {
        if (type === "confirm") {
          if (row.vpId) {
            removeVipPrivilege(row.vpId).then(res => {
              console.info("removeVipPrivilege");
              console.info(res);
              this.$refs.xTable.remove(row);
            });
          } else {
            this.$refs.xTable.remove(row);
          }
        }
      });
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getVipPrivilegePageByAttributes(this.queryList)
          .then(res => {
            console.info("getVipPrivilegePageByAttributes");
            console.info(res);
            this.dataList = res.data.records;
            this.total = res.data.total;
            this.pages = res.data.pages;
            this.tableLoading = false;
            resolve();
          })
          .catch(err => {
            this.tableLoading = false;
            reject();
          });
      });
    }
  },
  created() {
    this.queryList.vipId = this.$route.params.id;
    getVipById(this.$route.params.id).then(res => {
      // console.info("getVipById");
      // console.info(res);
      this.vipData = res.data;
    });
    getVpCatePage().then(res => {
      // console.info("getVpCatePage");
      // console.info(res);
      this.vpCateList = res.data.records;
    });
    this.imageDownLoadUrl = getDownLoadImagePath();
    let vpTypeParams = {
      dictType: "vp_type"
    };

    getDictPageByAttributes(vpTypeParams).then(res => {
      // console.info("getDictPageByAttributes");
      // console.info(res);
      this.vpTypeList = res.data.records;
      this.vpTypeMap = _getDictMap(this.vpTypeList);
    });
    let vpBizKeyParams = {
      dictType: "vp_biz_key"
    };

    getDictPageByAttributes(vpBizKeyParams).then(res => {
      // console.info("getDictPageByAttributes");
      // console.info(res);
      this.vpBizKeyList = res.data.records;
      this.vpBizKeyMap = _getDictMap(this.vpBizKeyList);
    });
    this._getPage();
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload .avatar-uploader-icon:hover {
  border-color: #409eff;
  color: #409eff;
}
.avatar-uploader-icon {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.avatar {
  width: 50px;
  height: 50px;
  margin-top: 5px;
}
.avatarPicImage {
  width: 100px;
  height: 50px;
  margin-top: 5px;
}
.tableImage {
  width: 50px;
  height: 50px;
  margin-top: 5px;
}
.tablePicImage {
  width: 100px;
  height: 50px;
  margin-top: 5px;
}
</style>
