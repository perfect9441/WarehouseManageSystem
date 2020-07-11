<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">小程序首页广告管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
       
        <vxe-button @click="_getPage">搜索</vxe-button>
        <vxe-button icon="fa fa-plus" @click="insertEvent()">新增</vxe-button>
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
      :edit-rules="validRules"
    >
      <vxe-table-column type="seq" title="序号" width="60" ></vxe-table-column>
      <vxe-table-column
        field="name"
        title="名称"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="link"
        title="链接"
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>

      
      <vxe-table-column
        field="url"
        title="广告图片"
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
            <img v-if="row.url" :src="imageDownLoadUrl+row.url" class="avatarPicImage" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </template>
        <template v-slot="{ row }">
          <template v-if="!$refs.xTable.isActiveByRow(row)">
            <img class="tablePicImage" v-if="row.url" :src="imageDownLoadUrl+row.url" />
            <el-tag v-if="!row.url" type="info">无图片</el-tag>
          </template>
        </template>
      </vxe-table-column>
    

      <vxe-table-column title="操作" width="250">
        <template v-slot="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)" type="text">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)" type="text">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button icon="vxe-icon--edit-outline " type="text" @click="editRowEvent(row)">编辑</vxe-button>
            <vxe-button @click="deleteRowEvent(row)" status="danger" type="text">删除</vxe-button>
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
import {
  getAdPageByAttributes,
removeAd,
saveOrModifyAd
} from "@/api/mall/ad";
import { getUploadImagePath, getDownLoadImagePath } from "@/api/fastdfs";
import { mapGetters } from "vuex";

export default {
  name: "ADManager",
  computed: {
    ...mapGetters([])
  },
  data() {
    return {
      editRow: "",
      imageDownLoadUrl: "",

      tableLoading: false,
     
      queryList: {
        current: 1,
        size: 10,
       
      },
      dataList: [],
      total: 0,
      pages: 0,
      validRules: {
        name: [{ required: true, message: "名称必须填写" }],
        url: [{ required: true, message: "图片必须上传" }]
      }
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

      this.editRow.url = response.data;
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
   _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getAdPageByAttributes(this.queryList)
          .then(res => {
            console.info("getDictPage");
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
    },
     async insertEvent() {
      let record = {};
      let { row } = await this.$refs.xTable.insert(record);
      // console.info(newRow)
       this.editRow = row;
      await this.$refs.xTable.setActiveRow(row);
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
          if (row.adId) {
            removeAd(row.adId).then(res => {
              console.info("removeAd");
              console.info(res);
              this.$refs.xTable.remove(row);
            });
          } else {
            this.$refs.xTable.remove(row);
          }
        }
      });
    },
      async saveRowEvent(row) {

      const errMap = await this.$refs.xTable
        .validate(row)
        .catch(errMap => errMap);
      console.info(errMap);
      if (errMap) {
        return;
      }

      this.$refs.xTable.clearActived().then(() => {
        this.tableLoading = true;
        
        saveOrModifyAd(row)
          .then(res => {
            console.info("saveOrModifyAd");
            console.info(res);
            if (!row.adId) {
              row.adId = res.data.adId;
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

  },
  created() {
    this.imageDownLoadUrl = getDownLoadImagePath();
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
