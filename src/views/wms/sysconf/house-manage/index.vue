<template>
  <div style="margin:30px;">
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" @click="addpage()">添加仓库</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="content-bar" >
        <vxe-toolbar :refresh="{query: _getPage}" custom>
          <template v-slot:buttons>
            <el-row>
              <vxe-input
                clearable
                v-model="searchItem.warehouseName"
                type="search"
                placeholder="仓库名称"
              ></vxe-input>
              <vxe-input
                clearable
                v-model="searchItem.warehouseCode"
                type="search"
                placeholder="仓库代码"
              ></vxe-input>

              <vxe-select clearable v-model="searchItem.warehouseClassify" placeholder="选择仓库类型">
                <vxe-option
                  v-for="(item,index) in Classify"
                  :key="index"
                  :value="item.dictCode"
                  :label="item.dictName"
                ></vxe-option>
              </vxe-select>
              <vxe-select clearable v-model="searchItem.warehouseType" placeholder="选择仓库类别">
                <vxe-option
                  v-for="(item,index) in Type"
                  :key="index"
                  :value="item.dictCode"
                  :label="item.dictName"
                ></vxe-option>
              </vxe-select>
              <vxe-button @click="_getPage" status="primary">搜索</vxe-button>
            </el-row>
          </template>
        </vxe-toolbar>
        <vxe-table border="inner" :align="allAlign" :data="warehouseList" :loading="loading">
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="warehouseName" title="仓库名称"></vxe-table-column>
          <vxe-table-column field="warehouseCode" title="仓库代码"></vxe-table-column>
          <vxe-table-column field="warehouseUser" title="仓库联系人"></vxe-table-column>
          <vxe-table-column field="warehouseTel" title="仓库联系电话"></vxe-table-column>
          <vxe-table-column field="warehouseAddr" title="仓库地址" show-overflow="tooltip"></vxe-table-column>
          <vxe-table-column field="warehouseClassify" title="仓库类型" :formatter="fmthouseClassify"></vxe-table-column>
          <vxe-table-column field="warehouseType" title="仓库类别" :formatter="fmthouseType"></vxe-table-column>
          <vxe-table-column title="操作" width="280">
            <template v-slot="{ row }">
              <template>
                <vxe-button status="primary" @click="checkRowEvent(row)">查看详情</vxe-button>
              </template>
              <template>
                <vxe-button status="primary" @click="editRowEvent(row)">编辑</vxe-button>
              </template>
              <template>
                <vxe-button status="danger" @click="deleteRowEvent(row)">删除</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          :current-page="searchItem.current"
          :page-size="searchItem.size"
          :total="total"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="_getPage"
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
        <el-form ref="warehouseInfo" :model="warehouseInfo" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="仓库名称:">
                <el-input clearable size="small" v-model="warehouseInfo.warehouseName" v-if="edit"></el-input>
                <span v-else>{{ warehouseInfo.warehouseName }}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="所属公司:">
                <el-input clearable size="small" v-model="warehouseInfo.orgName" v-if="edit"></el-input>
                <span v-else>{{ warehouseInfo.orgName }}</span>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="管理人员:">
                <el-select
                  v-model="warehouseInfo.stuffId"
                  clearable
                  size="small"
                  v-if="edit"
                  placeholder="请选择"
                  @change="handleStuffChange"
                >
                  <el-option
                    v-for="item in StuffList"
                    :label="item.stuffName"
                    :value="item.stuffId"
                    :key="item.stuffId"
                  ></el-option>
                </el-select>
                <span v-else>{{ warehouseInfo.stuffName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库代码:">
                <el-input clearable size="small" v-model="warehouseInfo.warehouseCode" v-if="edit"></el-input>
                <span v-else>{{ warehouseInfo.warehouseCode }}</span>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="仓库管理员:">
                <el-input clearable size="small" v-model="warehouseInfo.warehouseUser" v-if="edit"></el-input>
                <span v-else>{{ warehouseInfo.warehouseUser }}</span>
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="联系电话:">
                <el-input clearable size="small" v-model="warehouseInfo.warehouseTel" v-if="edit"></el-input>
                <span v-else>{{ warehouseInfo.warehouseTel }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库地址:">
                <el-input clearable size="small" v-model="warehouseInfo.warehouseAddr" v-if="edit"></el-input>
                <span v-else>{{ warehouseInfo.warehouseAddr }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="仓库类型:">
                <el-select
                  v-model="warehouseInfo.warehouseClassify"
                  clearable
                  v-if="edit"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in Classify"
                    :label="item.dictName"
                    :value="item.dictCode"
                    :key="item.dictCode"
                  ></el-option>
                </el-select>
                <span v-else>{{ getclassify(warehouseInfo.warehouseClassify) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库类别:">
                <el-select
                  v-model="warehouseInfo.warehouseType"
                  clearable
                  v-if="edit"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in Type"
                    :label="item.dictName"
                    :value="item.dictCode"
                    :key="item.dictCode"
                  ></el-option>
                </el-select>
                <span v-else>{{ gettype(warehouseInfo.warehouseType) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input
                  clearable
                  size="small"
                  v-model="warehouseInfo.warehouseText"
                  type="textarea1"
                  autosize
                  v-if="edit"
                ></el-input>
                <span v-else>{{ warehouseInfo.warehouseText }}</span>
              </el-form-item>
            </el-col>
            <div v-if="!edit">
              <el-col :span="12">
                <el-form-item label="创建人:">
                  <span>{{ warehouseInfo.createUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间:">
                  <span>{{ warehouseInfo.createTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新人:">
                  <span>{{ warehouseInfo.updateUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新时间:">
                  <span>{{ warehouseInfo.updateTime }}</span>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <div v-if="edit">
          <el-button @click="saveormodifyhouseinfo">{{edittype}}信息</el-button>
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
  getWarehousePage,
  removeWarehouse,
  saveOrModifyWarehouse,
  getWarehousePageByAttributes
} from "@/api/wms/warehouse/warehouse";
import {
  getStuffPageByAttributes,getStuffById
} from "@/api/wms/stuff/stuff";
import { getDictPageByAttributes } from "@/api/dict";

export default {
  name: "HouseManage",
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      allAlign: null,
      loading: false,
      warehouseList: [],
      // useFlg: [],
      Classify: [],
      Type: [],
      dialogVisible: false,
      warehouseInfo: {},
      searchItem: {
        current: 1,
        size: 10,
        warehouseName: null,
        warehouseCode: null,
        warehouseClassify: null,
        warehouseType: null
        // useFlg: null
      },
      total: 0,
      dialogTitle: "查看详情",
      edit: true,
      edittype: "",
      StuffList:[]
    };
  },
  async created() {
    let params1 = {
      dictType: "wms_type"
    };
    let params2 = {
      dictType: "org_classify"
    };
    await this._getDictPageByAttributes_type(params1);
    await this._getDictPageByAttributes_classify(params2);
    await setTimeout(() => {
      this._getPage();
    }, 500);
    console.info(this.userInfo)
  },
  methods: {
    handlePageChange({ current, size }) {
      this.tablePage.current = current;
      this.tablePage.size = size;
      this.findList();
    },
    _getWarehousePage(data) {
      getWarehousePage(data).then(res => {
        if (res.status === 200) {
          this.warehouseList = res.data.records;
        }
      });
    },
    _getDictPageByAttributes_type(params) {
      getDictPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.Type = res.data.records;
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
    _removeWarehouse(warehouseId) {
      removeWarehouse(warehouseId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
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
        }
        setTimeout(() => {
          this.edittype = "添加";
          this.dialogVisible = false;
          this._getPage();
        }, 1000);
      });
    },
    _getWarehousePageByAttributes(params) {
      getWarehousePageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.warehouseList = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    _getStuffPageByAttributes(params){
      getStuffPageByAttributes(params).then(res=>{
        if(res.status === 200){
          this.StuffList = res.data.records
        }
      })
    },
    _getStuffById(stuffId,callback){
      getStuffById(stuffId).then(res=>{
        if(res.status === 200){
          callback(res)
        }
      })
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this._getWarehousePageByAttributes(this.searchItem);
        this.loading = false;
        resolve();
      }).catch(err => {
        this.Loading = false;
        reject();
      });
    },
    addpage() {
      this.warehouseInfo = {};
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "添加";
      this._getStuffPageByAttributes()
    },
    saveormodifyhouseinfo() {
      this.edit = false;
      this._saveOrModifyWarehouse(this.warehouseInfo);
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
    gettype(data) {
      if (data) {
        for (var i = 0; i < this.Type.length; i++) {
          if (this.Type[i].dictCode === data) {
            return this.Type[i].dictName;
          }
        }
      }
    },
    // getuseflg(data) {
    //   if (data) {
    //     for (var i = 0; i < this.useFlg.length; i++) {
    //       if (this.useFlg[i].dictCode === data) {
    //         return this.useFlg[i].dictName;
    //       }
    //     }
    //   }
    // },
    // fmtuseflg({ cellValue }) {
    //   let item = this.useFlg.find(item => item.dictCode === cellValue);
    //   return item ? item.dictName : "";
    // },
    fmthouseClassify({ cellValue }) {
      let item = this.Classify.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    fmthouseType({ cellValue }) {
      let item = this.Type.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    editRowEvent(row) {
      this.warehouseInfo = {};
      this.warehouseInfo = row;
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "修改";
      this._getStuffPageByAttributes()
    },
    checkRowEvent(row) {
      this.warehouseInfo = {};
      this.warehouseInfo = row;
      this.dialogVisible = true;
      this.edit = false;
    },
    deleteRowEvent(row) {
      this.$confirm("此操作将永久删除该仓库, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this._removeWarehouse(row.warehouseId);
          setTimeout(() => {
            this._getPage();
          }, 1000);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleStuffChange(e){
      this._getStuffById(e,resdata=>{
        this.warehouseInfo.stuffName = resdata.data.stuffName
        this.warehouseInfo.stuffCode = resdata.data.stuffCode
      })
    }
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
</style>
