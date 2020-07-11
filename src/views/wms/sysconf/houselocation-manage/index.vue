<template>
  <div style="margin:30px;">
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <!-- <el-col :span="24"> -->
          <span class="headertitle">选择查询仓库：</span>
          <vxe-select
            clearable
            v-model="selectwarehouseId"
            @change="getselectwarehouse"
            placeholder="选择仓库"
          >
            <vxe-option
              v-for="item in warehouseList"
              :key="item.warehouseId"
              :value="item.warehouseId"
              :label="item.warehouseName"
            ></vxe-option>
          </vxe-select>
          <el-button type="primary" icon="el-icon-search" @click="searchlocationbyhouse()">查询</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deletelocationList()"
            style="float:right;"
          >删除货位</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addNewLocation()"
            style="float:right;"
          >设置货位</el-button>

          <!-- </el-col> -->
        </el-row>
      </el-header>
      <el-main class="content-bar">
        <vxe-toolbar :refresh="{query: _getPage}" custom>
          <template v-slot:buttons>
            <el-row>
              <vxe-select v-model="searchItem.locationArea" clearable placeholder="请选择货位区域">
                <vxe-option
                  v-for="item in locationarealist"
                  :key="item.dictCode"
                  :value="item.dictCode"
                  :label="item.dictName"
                ></vxe-option>
              </vxe-select>
              <vxe-input
                clearable
                v-model="searchItem.locationCapacity"
                type="search"
                placeholder="货架容量"
              ></vxe-input>
              <vxe-input
                clearable
                v-model="searchItem.locationCode"
                type="search"
                placeholder="货架编号"
              ></vxe-input>
              <vxe-input
                clearable
                v-model="searchItem.locationClassify"
                type="search"
                placeholder="货架类型"
              ></vxe-input>
              <vxe-button @click="_getPage" status="primary">搜索</vxe-button>
            </el-row>
          </template>
        </vxe-toolbar>
        <vxe-table
          border="inner"
          class="mytable-style"
          :align="allAlign"
          :data="warehouseLocationList"
          :row-class-name="rowClassName"
          :loading="loading"
        >
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="locationCode" title="货位编码"></vxe-table-column>
          <vxe-table-column field="locationCapacity" title="货架容量"></vxe-table-column>
          <vxe-table-column field="locationRow" title="货架号"></vxe-table-column>
          <vxe-table-column field="locationCell" title="货架列号"></vxe-table-column>
          <vxe-table-column field="locationHeight" title="货架层数"></vxe-table-column>
          <vxe-table-column field="locationArea" title="货架类型" :formatter="fmtArea"></vxe-table-column>
          <vxe-table-column field="useFlg" title="使用状态" :formatter="fmtUseFlg"></vxe-table-column>
          <vxe-table-column title="操作" width="140">
            <template v-slot="{ row }">
              <template>
                <vxe-button status="primary" @click="checkRowEvent(row)">查看货位库存</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          :current-page.sync="searchItem.current"
          :page-size.sync="searchItem.size"
          :total="total"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="_getPage"
        ></vxe-pager>
      </el-main>
    </el-container>
    <!-- 创建仓库货位dialog -->
    <el-dialog
      :title="dialogTitle"
      center
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <div class="topalarm">
        <span class="topalarmspan">货架仅可一次添加完成，需修改请删除所有货位后重新添加</span>
      </div>
      <div class="dialog-context">
        <el-form ref="houselocationpact" :model="houselocationpact" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="货位区域">
                <el-select
                  v-model="houselocationpact.locationArea"
                  placeholder="请选择活动区域"
                  style="width:80%"
                >
                  <el-option
                    v-for="item in locationarealist"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="货架数量">
                <el-slider
                  v-model="houselocationpact.rownum"
                  show-stops
                  :max="15"
                  style="width:80%"
                ></el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货架列数">
                <el-slider
                  v-model="houselocationpact.cellnum"
                  show-stops
                  :max="30"
                  style="width:80%"
                ></el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货架层数">
                <el-slider
                  v-model="houselocationpact.heightnum"
                  show-stops
                  :max="5"
                  style="width:80%"
                ></el-slider>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="货架容量">
                <el-slider
                  v-model="houselocationpact.capacitynum"
                  show-stops
                  :max="100"
                  :step="5"
                  style="width:80%"
                ></el-slider>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <div>
          <el-button @click="saveormodifyhouselocationpact">确定</el-button>
          <el-button @click="dialogVisible = false">返回</el-button>
        </div>
        <!-- <div v-else>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>-->
      </span>
    </el-dialog>
    <!-- 货位删除dialog -->
    <el-dialog
      title="选择删除货位类型"
      center
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleClose2"
    >
      <div class="dialog-context">
        <el-select v-model="deletelocationArea" placeholder="请选择货位区域" style="width:100%">
          <el-option
            v-for="item in locationarealist"
            :key="item.dictCode"
            :label="item.dictName"
            :value="item.dictCode"
          ></el-option>
        </el-select>
      </div>

      <span slot="footer" class="dialog-footer">
        <div>
          <el-button @click="confirmdelete">确定删除</el-button>
          <el-button @click="dialogVisible2 = false">返回</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 货物详情dialog -->

    <el-dialog
      title="在库货物详情"
      center
      :visible.sync="dialogVisible3"
      width="30%"
      :before-close="handleClose3"
    >
      <div class="dialog-context">
        <el-row>
          <el-form ref="storage" :model="storage" label-width="80px">
            <el-col :span="12">
              <el-form-item label="分类名称">
                <!-- <el-input v-model="storage.categpryName"></el-input> -->
                <span>
                  {{ storage.categpryName }}
                </span>
              </el-form-item>
            </el-col>
            <el-col  :span="12">
              <el-form-item label="商品名称">
                <!-- <el-input v-model="storage.itemName"></el-input> -->
                 <span>
                  {{ storage.itemName }}
                </span>
              </el-form-item>
            </el-col >
            <el-col :span="12">
              <el-form-item label="货物名称">
                <!-- <el-input v-model="storage.detailName"></el-input> -->
                 <span>
                  {{ storage.detailName }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="仓库名称">
                <!-- <el-input v-model="storage.warehouseName"></el-input> -->
                 <span>
                  {{ storage.warehouseName }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存数量">
                <!-- <el-input v-model="storage.warehouseName"></el-input> -->
                 <span>
                  {{ storage.storageNumber }}
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="库存单位">
                <!-- <el-input v-model="storage.warehouseName"></el-input> -->
                 <span>
                  {{ storage.storageUnit }}
                </span>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>

      <span slot="footer" class="dialog-footer">
        <div>
          <el-button @click="dialogVisible3 = false">返回</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<!-- TODO:搜索问题-->

<script>
import { mapGetters } from "vuex";
import {
  getWarehousePageByAttributes,
  getWarehouseById
} from "@/api/wms/warehouse/warehouse";
import { getDictPageByAttributes } from "@/api/dict";
import {
  getWarehouseLocationPageByAttributes,
  getWarehouseLocationById,
  removeBatchWarehouseLocation,
  removeWarehouseLocation,
  saveOrModifyBatchWarehouseLocation,
  saveOrModifyWarehouseLocation
} from "@/api/wms/warehouselocation/warehouselocation";
import { getStorageById } from "@/api/wms/storage/storage";

export default {
  name: "HouseManage",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      allAlign: null,
      loading: false,
      selectwarehouseId: null,
      selectwarehouse: {},
      warehouseList: [],
      warehouseLocationList: [],
      locationStorageList: [],
      dialogVisible: false,
      dialogVisible2: false,
      warehouseLocationInfo: {},
      houselocationpact: {},
      searchItem: {
        current: 1,
        size: 10,
        warehouseId: null,
        locationArea: null,
        locationCapacity: null,
        locationCell: null,
        locationHeight: null,
        locationLrface: null,
        locationRow: null,
        locationSize: null,
        locationTunnel: null,
        locationClassify: null
      },
      total: 0,
      locationarealist: [],
      dialogTitle: "添加货位",
      deletelocationArea: null,
      storage: {},
      useFlg: [
        {
          code: "UN_USE",
          value: "未使用"
        },
        {
          code: "USE",
          value: "已使用"
        }
      ],
      dialogVisible3: false,

    };
  },
  async created() {
    this._getWarehousePageByAttributes();
    let params = {
      dictType: "wms_location"
    };
    this._getDictPageByAttributes_locationarea(params);
  },
  methods: {
    _getDictPageByAttributes_locationarea(params) {
      getDictPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.locationarealist = res.data.records;
        }
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
    _getWarehouseById(warehouseId, callback) {
      getWarehouseById(warehouseId).then(res => {
        if (res.status === 200) {
          this.selectwarehouse = res.data;
          callback(res);
        }
      });
    },
    _getWarehouseLocationPageByAttributes(params) {
      getWarehouseLocationPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.warehouseLocationList = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    _getWarehouseLocationPageByAttributes_deletelist(params, callback) {
      getWarehouseLocationPageByAttributes(params).then(res => {
        if (res.status === 200) {
          callback(res);
        }
      });
    },
    _getWarehouseLocationById(warehouseLocationId) {
      warehouseLocationId(warehouseLocationId).then(res => {
        if (res.status === 200) {
        }
      });
    },
    _removeBatchWarehouseLocation(data, callback) {
      removeBatchWarehouseLocation(data).then(res => {
        if (res.status === 200) {
          callback(res);
        }
      });
    },
    _removeWarehouseLocation(warehouseLocationId) {
      removeWarehouseLocation(warehouseLocationId).then(res => {
        if (res.status === 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          });
        }
      });
    },
    _saveOrModifyBatchWarehouseLocation(data, callback) {
      saveOrModifyBatchWarehouseLocation(data).then(res => {
        if (res.status === 200) {
          callback(res);
        }
      });
    },
    _saveOrModifyWarehouseLocation(data) {
      saveOrModifyWarehouseLocation(data).then(res => {
        if (res.status === 200) {
        }
      });
    },
    _getStorageById(storageId, callback) {
      getStorageById(storageId).then(res => {
        if (res.status === 200) {
          callback(res);
        }
      });
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        if (this.selectwarehouseId != null) {
          this.searchItem.warehouseId = this.selectwarehouseId;
          this._getWarehouseLocationPageByAttributes(this.searchItem);
        } else {
          this.$message({
            type: "warning",
            message: "请选择仓库"
          });
        }

        this.loading = false;
        resolve();
      }).catch(err => {
        this.Loading = false;
        reject();
      });
    },
    searchlocationbyhouse() {
      if (this.selectwarehouseId != null) {
        this.searchItem.warehouseId = this.selectwarehouseId;
        this._getWarehouseLocationPageByAttributes(this.searchItem);
      } else {
        this.$message({
          type: "warning",
          message: "请选择仓库"
        });
      }
    },
    saveormodifyhouseinfo() {
      this.edit = false;
      this._saveOrModifyWarehouse(this.warehouseLocationInfo);
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
    checkRowEvent(row) {
      this._getStorageById(row.storageId, resdata => {
        this.storage = resdata.data;
        this.dialogVisible3 = true
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleClose2(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleClose3(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    addNewLocation() {
      if (this.selectwarehouseId != null) {
        this.dialogVisible = true;
      } else {
        this.$message({
          type: "warning",
          message: "请选择仓库"
        });
      }
    },
    getselectwarehouse() {
      this.warehouseLocationList = [];
      this._getWarehouseById(this.selectwarehouseId, resdata => {});
    },
    saveormodifyhouselocationpact() {
      this.locationStorageList = [];
      for (var i = 0; i < this.houselocationpact.rownum; i++) {
        for (var j = 0; j < this.houselocationpact.cellnum; j++) {
          for (var k = 0; k < this.houselocationpact.heightnum; k++) {
            let locationitem = {
              locationArea: this.houselocationpact.locationArea,
              locationCapacity: this.houselocationpact.capacitynum,
              locationRow: i + 1,
              locationCell: j + 1,
              locationHeight: k + 1,
              useFlg: 0,
              locationCode:
                this.selectwarehouse.warehouseCode +
                "-" +
                (i + 1) +
                "-" +
                (j + 1) +
                "-" +
                (k + 1),
              warehouseId: this.selectwarehouse.warehouseId,
              warehouseName: this.selectwarehouse.warehouseName
            };
            this.locationStorageList.push(locationitem);
          }
        }
      }

      this._saveOrModifyBatchWarehouseLocation(
        this.locationStorageList,
        resdata => {
          if (resdata.status === 200) {
            this.$message({
              type: "success",
              message: "添加成功！"
            });
            this.houselocationpact = {};
            this.dialogVisible = false;
          }
        }
      );
    },
    deletelocationList() {
      if (this.selectwarehouseId != null) {
        this.deletelocationArea = null;
        this.dialogVisible2 = true;
      } else {
        this.$message({
          type: "warning",
          message: "请选择仓库"
        });
      }
    },
    confirmdelete() {
      if (this.deletelocationArea != null) {
        let param = {
          current: 1,
          size: 200,
          warehouseId: this.selectwarehouse.warehouseId,
          locationArea: this.deletelocationArea
        };
        this._getWarehouseLocationPageByAttributes_deletelist(
          param,
          resdata => {
            if (resdata.status === 200) {
              let deleteidlist = [];
              for (var i = 0; i < resdata.data.records.length; i++) {
                deleteidlist.push(resdata.data.records[i].locationId);
              }
              this._removeBatchWarehouseLocation(deleteidlist, deldata => {
                if (deldata.status === 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this._getPage();
                  this.dialogVisible2 = false;
                }
              });
            }
          }
        );
      } else {
        this.$message({
          type: "warning",
          message: "请选择要删除的货位类型"
        });
      }
    },
    fmtArea({ cellValue }) {
      let item = this.locationarealist.find(
        item => item.dictCode === cellValue
      );
      return item ? item.dictName : "";
    },
    fmtUseFlg({ cellValue }) {
      let item = this.useFlg.find(item => item.code === cellValue);
      return item ? item.value : "";
    },
    rowClassName({ row }) {
      if (row.useFlg === "USE") {
        return "row-red";
      }
    }
  }
};
</script>

<style >
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
  min-height: 500px;
}

.form-item {
  margin-bottom: 1px solid #dbdbdb;
}
.headertitle {
  font-size: 14px;
  letter-spacing: 4px;
  color: #ff0000;
}
.topalarmspan {
  font-size: 14px;
  letter-spacing: 4px;
  color: #ff0000;
}
.mytable-style .vxe-body--row.row-red {
  background-color: #d1ffe2;
  /* color: rgb(0, 0, 0); */
}
</style>
