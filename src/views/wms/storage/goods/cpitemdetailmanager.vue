<template>
  <div style="margin:30px;">
    <div class="contettitle">
      {{parentitem.itemName}}--货物管理
    </div>
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" @click="addpage()">添加货物</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="content-bar">
        <vxe-toolbar :refresh="{query: _getpage}" custom></vxe-toolbar>
        <vxe-table border="inner" :align="allAlign" :data="itemDetialList">
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="detailName" title="货物名称"></vxe-table-column>
          <vxe-table-column field="detailCode" title="货物代码"></vxe-table-column>
          <vxe-table-column field="detailPrice" title="单价"></vxe-table-column>
          <vxe-table-column field="detailTax" title="税率"></vxe-table-column>
          <vxe-table-column field="detailDesc" title="备注" show-overflow="tooltip"></vxe-table-column>
          <!-- <vxe-table-column field="useFlg" title="使用状态" :formatter="fmtuseflg"></vxe-table-column> -->
          <vxe-table-column title="操作" width="420" fixed="right">
            <template v-slot="{ row }">
              <template>
                <vxe-button status="primary" @click="checkRowEvent(row)">查看详情</vxe-button>
              </template>
              <template>
                <vxe-button status="primary" @click="editRowEvent(row)">编辑</vxe-button>
              </template>
              <template>
                <vxe-button status="primary" @click="setRowProp(row)">参数、规格管理</vxe-button>
              </template>
              <template>
                <vxe-button status="danger" @click="deleteRowEvent(row)">删除</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          :loading="loading"
          :current-page="tablePage.current"
          :page-size="tablePage.size"
          :total="total"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="_getpage"
        ></vxe-pager>
      </el-main>
    </el-container>

    <el-dialog
      :title="dialogTitle"
      center
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <div class="dialog-context">
        <el-form ref="itemDetailInfo" :model="itemDetailInfo" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="货物名称:">
                <el-input clearable size="small" v-model="itemDetailInfo.detailName" v-if="edit"></el-input>
                <span v-else>{{ itemDetailInfo.detailName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货物代码:">
                <el-input clearable size="small" v-model="itemDetailInfo.detailCode" v-if="edit"></el-input>
                <span v-else>{{ itemDetailInfo.detailCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货物单价:">
                <el-input clearable size="small" v-model.number="itemDetailInfo.detailPrice" v-if="edit"></el-input>
                <span v-else>{{ itemDetailInfo.detailPrice }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税率:">
                <el-input clearable size="small" v-model.number="itemDetailInfo.detailTax" v-if="edit"></el-input>
                <span v-else>{{ itemDetailInfo.detailTax }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input clearable size="small" type="textarea" v-model="itemDetailInfo.detailDesc" v-if="edit"></el-input>
                <span v-else>{{ itemDetailInfo.detailDesc }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="使用状态:">
                <el-select v-if="edit" clearable v-model="itemDetailInfo.useFlg" placeholder="请选择使用类型">
                  <el-option
                    v-for="item in useFlg"
                    :label="item.dictName"
                    :value="item.dictCode"
                    :key="item.dictCode"
                  ></el-option>
                </el-select>
                <span v-else>{{ getuseflg(itemDetailInfo.useFlg) }}</span>
              </el-form-item>
            </el-col>
            <div v-if="!edit">
              <el-col :span="12">
                <el-form-item label="创建人:">
                  <span>{{ itemDetailInfo.createUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间:">
                  <span>{{ itemDetailInfo.createTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新人:">
                  <span>{{ itemDetailInfo.updateUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新时间:">
                  <span>{{ itemDetailInfo.updateTime }}</span>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <div v-if="edit">
          <el-button @click="saveormodifyitemdetailinfo">{{edittype}}信息</el-button>
          <el-button @click="dialogVisible = false">返回</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<!-- TODO:搜索问题-->

<script>
import { mapGetters } from "vuex";
import {
  getItemDetailPageByAttributes,
  removeItemDetail,
  saveOrModifyItemDetail
} from "@/api/wms/goods/goodsdetial";
import {
  getItemById,
} from "@/api/wms/goods/goods";
import { getDictPageByAttributes } from "@/api/dict";

export default {
  name: "itemDetialconf",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      allAlign: null,
      loading: false,
      tablePage: {
        current: 1,
        size: 10,
      },
      total: 0,
      itemDetialList: [],
      useFlg: [],
      Classify: [],
      dialogVisible: false,
      itemDetailInfo: {},
      searchItem: {},
      dialogTitle: "查看详情",
      edit: true,
      edittype: "",
      innerVisible: false,
      defaultProps: {
        children: "children",
        label: "categoryName"
      },
      choiceCategory: {},
      currentcategoryName:"",
      parentitem : {},
      itemId:''
    };
  },
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 30) {
        return value.slice(0, 30) + "...";
      }
      return value;
    }
  },
  async created() {
    this.itemId = this.$route.params.id;
    let params1 = {
      dictType: "wms_useflg"
    };
    let params2 = {
      dictType: "org_classify"
    };
    await this._getDictPageByAttributes_useflg(params1);
    await this._getDictPageByAttributes_classify(params2);
    await this._getItemById(this.itemId)
    await this._getpage()
    
  },
  methods: {
    _getItemDetailPageByAttributes(data) {
      getItemDetailPageByAttributes(data).then(res => {
        if (res.status === 200) {
          this.itemDetialList = res.data.records;
          this.total = res.data.total
        }
      });
    },
    _getDictPageByAttributes_useflg(params) {
      getDictPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.useFlg = res.data.records;
        }
      });
    },
    _getDictPageByAttributes_classify(params) {
      getDictPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.Classify = res.data.records;
        }
      });
    },
    _removeItemDetail(detailId) {
      console.info('detailId')
      console.info(detailId)
      removeItemDetail(detailId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    },
    _saveOrModifyItemDetail(data) {
      saveOrModifyItemDetail(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据上传成功",
            type: "success"
          });
        }
        setTimeout(() => {
          this.edittype = "添加";
          this.dialogVisible = false;
          let param = {
              itemId : this.parentitem.itemId,
              current:this.tablePage.current,
              size:this.tablePage.size
            }
            this._getItemDetailPageByAttributes(param);
        }, 1000);
      });
    },
   _getItemById(itemId){
     getItemById(itemId).then(res=>{
       if(res.status === 200){
        this.parentitem = res.data
       }
     })
   },
    _getpage() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let param = {
              itemId : this.itemId,
              current:this.tablePage.current,
              size:this.tablePage.size,
              detailType:"WMS_TYPE_PORODUCT"
            }
            this._getItemDetailPageByAttributes(param);
        this.loading = false;
        resolve();
      }).catch(err => {
        this.Loading = false;
        reject();
      });
    },
    addpage() {
      this.itemDetailInfo = {};
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "添加";
      this.currentcategoryName  = "选择分类"
      this.itemDetailInfo.itemId = this.parentitem.itemId
      this.itemDetailInfo.itemName = this.parentitem.itemName
      this.itemDetailInfo.categoryId = this.parentitem.categoryId
      this.itemDetailInfo.categoryName = this.parentitem.categoryName
      this.itemDetailInfo.detailType = this.parentitem.itemType
    },
    saveormodifyitemdetailinfo() {
      this.edit = false;
      
      this._saveOrModifyItemDetail(this.itemDetailInfo);
    },
    getclassify(data) {
      if (data) {
        for (var i = 0; i < this.Classify.length; i++) {
          if (this.Classify[i].dictCode === data) {
            return this.Classify[i].dictName;
          }
        }
      }
    },
    getuseflg(data) {
      if (data) {
        for (var i = 0; i < this.useFlg.length; i++) {
          if (this.useFlg[i].dictCode === data) {
            return this.useFlg[i].dictName;
          }
        }
      }
    },
    fmtuseflg({ cellValue }) {
      let item = this.useFlg.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    fmthouseClassify({ cellValue }) {
      let item = this.Classify.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    editRowEvent(row) {
      this.itemDetailInfo = {};
      this.itemDetailInfo = row;
      this.itemDetailInfo.detailType = "WMS_TYPE_PORODUCT"
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "修改";
    },
    checkRowEvent(row) {
      this.itemDetailInfo = {};
      this.itemDetailInfo = row;
      this.dialogVisible = true;
      this.edit = false;
    },
    deleteRowEvent(row) {
      this.$confirm("此操作将永久删除该货物, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          console.info(row.detailId)
          this._removeItemDetail(row.detailId);
          setTimeout(() => {
            let param = {
              itemId : this.parentitem.itemId,
              current:this.tablePage.current,
              size:this.tablePage.size
            }
            this._getItemDetailPageByAttributes(param);
          }, 1000);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    setRowProp(row){
      this.$router.push({
        name: "CPGoodsDetialPropInfo",
        params: { id: row.detailId }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  }
};
</script>

<style scope>
.button-bar {
  background-color: #ebebeb;
  border-radius: 10px;
  padding: 10px;
}
.content-bar {
  margin-top: 10px;
  background-color: #ebebeb;
  border-radius: 10px;
  padding: 10px;
  height: 500px;
}

.form-item {
  margin-bottom: 1px solid #dbdbdb;
}
.contettitle{
  height: 60px;
  line-height: 60px;
  font-size: 30px;
  text-align: center;
  letter-spacing: 8px;
  color: rgb(0, 70, 199);
}
</style>
