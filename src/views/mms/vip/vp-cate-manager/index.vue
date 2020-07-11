<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">会员权益类型管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}"></vxe-toolbar>

    <vxe-table
      ref="xTable"
      border
      show-header-overflow
      show-overflow
      highlight-hover-row
      max-height="500"
      keep-source
      :edit-config="{trigger: 'manual', mode: 'row'}"
      :data="dataList"
      :loading="tableLoading"
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

      <vxe-table-column
        field="imageUrl"
        title="权益图标"
        :edit-render="{type: 'default'}"
        align="center"
      >
        <template v-slot:edit="{ row, rowIndex }">
          <el-upload
            :action="action()"
            :show-file-list="false"
            :on-success="onUploadIconPicSuccess"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
            :before-upload="beforePicUpload"
            name="image-file"
          >
            <img v-if="row.imageUrl" :src="imageDownLoadUrl+row.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </template>
        <template v-slot="{ row }">
          <template v-if="!$refs.xTable.isActiveByRow(row)">
            <img class="tableImage" v-if="row.imageUrl" :src="imageDownLoadUrl+row.imageUrl" />
            <el-tag v-if="!row.imageUrl" type="info">无图片</el-tag>
          </template>
        </template>
      </vxe-table-column>

      <vxe-table-column title="操作" width="200">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button icon="vxe-icon--edit-outline " @click="editRowEvent(row)">编辑</vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      background
      :current-page.sync="queryList.current"
      :page-size.sync="queryList.size"
      :total="total"
      :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
      @page-change="_getPage"
    ></vxe-pager>
  </div>
</template>

<script>
import { getDictPageByAttributes } from "@/api/dict";
import { _getDictMap } from "@/utils/my-utils";
import { getVpCatePage, modifyVpCate } from "@/api/mms/vp-cate.js";
import { getUploadImagePath, getDownLoadImagePath } from "@/api/fastdfs";
import { mapGetters } from "vuex";

export default {
  name: "VipManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      editRow: "",
      imageDownLoadUrl: "",

      tableLoading: false,
      vpTypeList: [],
      vpTypeMap: {},
      vpBizKeyList: [],
      vpBizKeyMap: {},
      queryList: {
        current: 1,
        size: 10
      },
      dataList: [],
      total: 0,
      pages: 0
    };
  },
  methods: {
    action() {
      return getUploadImagePath();
    },
    //类目图标
    onUploadIconPicSuccess(response, file, fileList) {
      console.info("onUploadDetailPicSuccess");
      console.info(file);
      console.info(response);

      this.editRow.imageUrl = response.data;
    },

    beforePicUpload(file) {
      console.info("beforeDetailPicUpload");
      console.info(file);
      return new Promise((resolve, reject) => {
        if (file.size > 1048576) {
          this.$message({
            message: "图片大小不可大于1M",
            type: "warning"
          });
          reject();
        }
        resolve();
      });
    },
    async insertEvent() {
      let record = {};
      let { row } = await this.$refs.xTable.insert(record);
      // console.info(newRow)
      await this.$refs.xTable.setActiveRow(row);
    },
    async saveRowEvent(row) {
      let selectRecords = [];

      this.$refs.xTable.clearActived().then(() => {
        this.tableLoading = true;

        modifyVpCate(row)
          .then(res => {
            console.info("saveOrModifyVip");
            console.info(res);
            if (!row.vpcateId) {
              row.vpcateId = res.data.vpcateId;
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
      this.editRow = row;
      this.$refs.xTable.setActiveRow(row);
    },
    deleteRowEvent(row) {
      this.$XModal.confirm("您确定要删除该数据?").then(type => {
        if (type === "confirm") {
          if (row.vpcateId) {
            removeVip(row.vpcateId).then(res => {
              console.info("removeDict");
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
        getVpCatePage(this.queryList)
          .then(res => {
            console.info("getVpCatePage");
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
    this.imageDownLoadUrl = getDownLoadImagePath();
    this._getPage();
    let vpTypeParams = {
      dictType: "vp_type"
    };

    getDictPageByAttributes(vpTypeParams).then(res => {
      console.info("getDictPageByAttributes");
      console.info(res);
      this.vpTypeList = res.data.records;
      this.vpTypeMap = _getDictMap(this.vpTypeList);
    });
    let vpBizKeyParams = {
      dictType: "vp_biz_key"
    };

    getDictPageByAttributes(vpBizKeyParams).then(res => {
      console.info("getDictPageByAttributes");
      console.info(res);
      this.vpBizKeyList = res.data.records;
      this.vpBizKeyMap = _getDictMap(this.vpBizKeyList);
    });
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
