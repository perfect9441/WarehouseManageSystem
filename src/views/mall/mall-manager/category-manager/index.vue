<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">商品类目管理</h1>
    <vxe-toolbar custom :refresh="{query: searchEvent}">
      <template v-slot:buttons>
        <vxe-input clearable v-model="queryList.categoryName" type="search" placeholder="输入名称"></vxe-input>

        <vxe-select clearable v-model="queryList.cateLevel" placeholder="选择级别">
          <vxe-option
            v-for="(item,index) in cateLevelList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        <vxe-button @click="searchEvent">搜索</vxe-button>
        <vxe-button icon="fa fa-plus" @click="insertEvent()">新增一级类目</vxe-button>
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
      :tree-config="treeConfig"
      :data="dataList"
      :loading="tableLoading"
      :edit-config="{trigger: 'manual', mode: 'row'}"
      :edit-rules="validRules"
    >
      <!-- <vxe-table-column type="seq" title="序号" width="60" tree-node></vxe-table-column> -->
      <vxe-table-column
        field="categoryName"
        title="名称"
        tree-node
        :edit-render="{name: 'input', attrs: {type: 'text'}}"
      ></vxe-table-column>

      <vxe-table-column
        field="cateLevel"
        title="类目级别"
        :edit-render="{name: '$select', options: cateLevelList,optionProps:{value:'dictCode',label:'dictName'}}"
      ></vxe-table-column>
      <vxe-table-column
        field="cateIcon"
        title="类目图标"
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
            <img v-if="row.cateIcon" :src="imageDownLoadUrl+row.cateIcon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </template>
        <template v-slot="{ row }">
          <template v-if="!$refs.xTable.isActiveByRow(row)">
            <img class="tableImage" v-if="row.cateIcon" :src="imageDownLoadUrl+row.cateIcon" />
            <el-tag v-if="!row.cateIcon" type="info">无图片</el-tag>
          </template>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="cateImage"
        title="类目图片"
        :edit-render="{type: 'default'}"
        align="center"
      >
        <template v-slot:edit="{ row, rowIndex }">
          <el-upload
            :action="action()"
            :show-file-list="false"
            :on-success="onUploadImagePicSuccess"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
            :before-upload="beforePicUpload"
            name="image-file"
          >
            <img v-if="row.cateImage" :src="imageDownLoadUrl+row.cateImage" class="avatarPicImage"    mode="aspectFill"/>
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </template>
        <template v-slot="{ row }">
          <template v-if="!$refs.xTable.isActiveByRow(row)">
            <img
              class="tablePicImage"
              mode="aspectFill"
              v-if="row.cateImage"
              :src="imageDownLoadUrl+row.cateImage"
            />
            <el-tag v-if="!row.cateImage" type="info">无图片</el-tag>
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
            <vxe-button
              v-if="!row.parentId"
              @click="insertAtEvent(row)"
              status="primary"
              type="text"
            >添加子类目</vxe-button>
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
  getCategoryPageByAttributes,
  removeCategory,
  saveOrModifyCategory
} from "@/api/mall/category";
import { getUploadImagePath, getDownLoadImagePath } from "@/api/fastdfs";
import { mapGetters } from "vuex";

export default {
  name: "CategoryManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      editRow: "",
      imageDownLoadUrl: "",
      treeConfig: {
        lazy: true,
        children: "children",
        hasChild: "hasChild",
        loadMethod: this._getChildrenPage
      },
      tableLoading: false,
      cateLevelList: [],
      queryList: {
        current: 1,
        size: 10,
        categoryName: null,
        cateLevel: null
      },
      dataList: [],
      total: 0,
      pages: 0,
      validRules: {
        categoryName: [{ required: true, message: "名称必须填写" }],
        cateLevel: [{ required: true, message: "类目级别必须选择" }]
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

      this.editRow.cateIcon = response.data;
    },
    onUploadImagePicSuccess(response, file, fileList) {
      console.info("onUploadDetailPicSuccess");
      console.info(file);
      console.info(response);

      this.editRow.cateImage = response.data;
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
      let xTree = this.$refs.xTable;
      xTree.createRow({}).then(newRow => {
        // 插入到第一行
        this.editRow = newRow;
        console.info(" this.editRow");
        console.info(this.editRow);
        this.dataList.unshift(newRow);
        xTree.syncData().then(() => xTree.setActiveRow(newRow));
      });
    },
    insertAtEvent(father) {
      console.info("father");
      console.info(father);
      let xTree = this.$refs.xTable;

      xTree
        .createRow({
          parentId: father.categoryId
        })
        .then(newRow => {
          console.info("newRow");
          console.info(newRow);
          if (newRow) {
            this.editRow = newRow;
            console.info(" this.editRow");
            console.info(this.editRow);
            father.children.unshift(newRow);
            xTree.syncData().then(() => xTree.setActiveRow(newRow));
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
        saveOrModifyCategory(row)
          .then(async res => {
            // console.info("saveOrModifycategory");
            // console.info(res);
            // console.info(row);
            this.tableLoading = false;
            if (!row.categoryId) {
              row.categoryId = res.data.categoryId;
              row.version = res.data.version;
              row.children = [];
              row.hasChild = true;
              // console.info("新增组织");
              // console.info(row);
            } //

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
      console.info(" this.editRow");
      console.info(this.editRow);
      this.$refs.xTable.setActiveRow(row);
    },
    deleteRowEvent(row) {
      let xTree = this.$refs.xTable;
      this.$XModal.confirm("您确定要删除该数据?").then(async type => {
        if (type === "confirm") {
          if (row.categoryId) {
            let children = [];
            let info = {
              row: row
            };
            await this._getChildrenPage(info).then(res => {
              children = res;
            });
            if (children.length != 0) {
              this.$XModal.message({
                message: "该组织存在子组织，无法删除！",
                status: "error"
              });
            } else {
              removeCategory(row.categoryId).then(res => {
                console.info("removeCategory");
                console.info(res);
                this.$XModal.message({
                  message: "删除成功",
                  status: "success"
                });

                let matchObj = this.$XEUtils.findTree(
                  this.dataList,
                  item => item === row,
                  this.treeConfig
                );

                console.info(matchObj);
                let { items, index } = matchObj;
                items.splice(index, 1);
                xTree.syncData();
              });
            }
          } else {
            let matchObj = this.$XEUtils.findTree(
              this.dataList,
              item => item === row,
              this.treeConfig
            );

            console.info(matchObj);
            let { items, index } = matchObj;
            items.splice(index, 1);
            xTree.syncData();
          }
        }
      });
    },
    searchEvent() {
      if (this.queryList.categoryName || this.queryList.cateLevel) {
        return this._getPage();
      } else {
        return this._getInitPage();
      }
    },
    _getInitPage() {
      return new Promise(async (resolve, reject) => {
        this.tableLoading = true;
        this.queryList.cateLevel = "MALL_CATE_LEVEL_FIRST";
        await getCategoryPageByAttributes(this.queryList)
          .then(res => {
            this.dataList = res.data.records;
            for (let i = 0; i < this.dataList.length; i++) {
              this.dataList[i].children = [];
              this.dataList[i].hasChild = true;
            }

            this.total = res.data.total;
            this.pages = res.data.pages;
            this.tableLoading = false;
            resolve();
          })
          .catch(err => {
            this.tableLoading = false;
            reject();
          });
        this.queryList.cateLevel = null;
      });
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getCategoryPageByAttributes(this.queryList)
          .then(async res => {
            console.info("getDictPage");
            console.info(res);
            this.dataList = res.data.records;
            for (let i = 0; i < this.dataList.length; i++) {
              this.dataList[i].children = [];
              this.dataList[i].hasChild = true;
            }
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
    _getChildrenPage({ row }) {
      console.info(row);

      return new Promise((resolve, reject) => {
        let params = {
          parentId: row.categoryId
        };
        let children = [];
        getCategoryPageByAttributes(params).then(async res => {
          console.info("_getChildrenPage");
          console.info(res);
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
    }
  },
  created() {
    this.imageDownLoadUrl = getDownLoadImagePath();
    this._getInitPage();
    let params = {
      dictType: "mall_cate_level"
    };
    getDictPageByAttributes(params).then(res => {
      this.cateLevelList = res.data.records;
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
