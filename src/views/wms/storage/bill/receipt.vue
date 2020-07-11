<template>
  <div class="contentbar">
    <el-container>
      <el-aside width="550px" class="asidebar">
        <el-tabs type="border-card" value="waitbill" @tab-click="handleClick">
          <el-tab-pane label="待入库单据" name="waitbill">
            <el-menu
              default-active="1"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect1"
            >
              <el-menu-item index="1" style="padding:0px 6px">待入库</el-menu-item>
              <el-menu-item index="2" style="padding:0px 6px">部分入库</el-menu-item>
            </el-menu>
            <el-row>
              <el-col>
                <span class="searchtitle">选择时间段:</span>
              </el-col>
              <el-col>
                <el-date-picker
                  v-model="DateList"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                ></el-date-picker>
              </el-col>
              <el-col>
                <span class="searchtitle">选择供应商:</span>
              </el-col>
              <el-col>
                <el-select v-model="pactSearchItem.supplierId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in supplierList"
                    :key="item.supplierId"
                    :label="item.supplierName"
                    :value="item.supplierId"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col>
                <span class="searchtitle">采购单编号:</span>
              </el-col>
              <el-col>
                <el-input placeholder="请输入内容" v-model="pactSearchItem.inPactId" clearable></el-input>
              </el-col>
              <el-col class="searchbutton">
                <el-button type="primary" icon="el-icon-search" @click="_getPactList">搜索</el-button>
              </el-col>
            </el-row>
            <vxe-table
              border
              show-header-overflow
              show-overflow
              highlight-hover-row
              :align="allAlign"
              :data="purPactList"
              @cell-click="cellClickEvent"
              style="font-size:10px"
            >
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column
                field="createTime"
                title="日期"
                show-overflow="tooltip"
                :formatter="formatTime"
              ></vxe-table-column>
              <vxe-table-column field="suppilerName" title="供应商名称" show-overflow="tooltip"></vxe-table-column>
              <!-- <vxe-table-column field="warehouseName" title="入库仓库名称" show-overflow="tooltip"></vxe-table-column> -->
              <vxe-table-column field="pactClassify" title="单据类型" :formatter="getPactClassify"></vxe-table-column>
            </vxe-table>
            <vxe-pager
              style="font-size:10px"
              :loading="loading"
              :current-page="searchItem.current"
              :page-size="searchItem.size"
              :total="total"
              :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
              @page-change="_getPactList"
            ></vxe-pager>
          </el-tab-pane>
          <el-tab-pane label="已入库单据" name="confirmbill">
            <el-menu
              default-active="1"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect2"
            >
              <!-- <el-menu-item index="1" style="padding:0px 6px">全部</el-menu-item> -->
              <el-menu-item index="1" style="padding:0px 6px">已入库</el-menu-item>
              <el-menu-item index="2" style="padding:0px 6px">已入库撤销</el-menu-item>
            </el-menu>
            <el-row>
              <el-col>
                <span class="searchtitle">选择时间段:</span>
              </el-col>
              <el-col>
                <el-date-picker
                  v-model="DateList"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                ></el-date-picker>
              </el-col>
              <el-col>
                <span class="searchtitle">选择供应商:</span>
              </el-col>
              <el-col>
                <el-select v-model="searchItem.supplierId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in supplierList"
                    :key="item.supplierId"
                    :label="item.supplierName"
                    :value="item.supplierId"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col>
                <span class="searchtitle">选择入库仓库:</span>
              </el-col>
              <el-col>
                <el-select v-model="searchItem.warehouseId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col>
                <span class="searchtitle">采购单编号:</span>
              </el-col>
              <el-col>
                <el-input placeholder="请输入内容" v-model="searchItem.inPactId" clearable></el-input>
              </el-col>
              <el-col class="searchbutton">
                <el-button type="primary" icon="el-icon-search" @click="_getInPactList">搜索</el-button>
              </el-col>
            </el-row>
            <div class="asidetable">
              <el-table
                :data="inPactList"
                border
                style="width: 100%;font-size:10px"
                @cell-click="inPactClickEvent"
              >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="inDate"
                  label="入库日期"
                  :formatter="formatTime"
                ></el-table-column>
                <el-table-column show-overflow-tooltip prop="warehouseName" label="入库仓库"></el-table-column>
                <el-table-column show-overflow-tooltip prop="supplierName" label="供应商"></el-table-column>
                <el-table-column show-overflow-tooltip prop="inClassify" label="单据类型" :formatter="getInClassify"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-container>
        <el-main class="mainbar">
          <div class="purchasediv" v-if="showdiv">
            <div class="inPactItembar">
              <el-form ref="PactItem" :model="PactItem" label-width="120px">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="入库仓库">
                      <el-select v-model="PactItem.warehouseId" clearable placeholder="请选择" style="width:80%">
                        <el-option
                          v-for="item in warehouseList"
                          :key="item.warehouseId"
                          :label="item.warehouseName"
                          :value="item.warehouseId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="recordInList">
              <vxe-toolbar custom></vxe-toolbar>
              <vxe-table
                ref="xTable"
                border
                show-header-overflow
                show-footer
                show-overflow
                highlight-hover-row
                max-height="500"
                keep-source
                :data="pactBillList"
                :footer-method="footerMethod"
              >
                <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
                <vxe-table-column field="itemName" title="商品名称"></vxe-table-column>
                <vxe-table-column field="detailName" title="货物名称"></vxe-table-column>
                <vxe-table-column field="purchaseNumber" title="采购数量"></vxe-table-column>
                <vxe-table-column field="shoudInNumber" title="可入库数量"></vxe-table-column>
                <vxe-table-column field="currentInNumber" title="入库数量"></vxe-table-column>
                <vxe-table-column field="purchasePrice" title="单价"></vxe-table-column>
                <vxe-table-column field="purchaseTax" title="税额"></vxe-table-column>
                <vxe-table-column title="操作" width="220">
                  <template v-slot="{ row }">
                    <template>
                      <vxe-button @click="changeNum(row)" status="primary">修改入库数量</vxe-button>
                      <vxe-button @click="deleteRowEvent(row)" status="danger">删除</vxe-button>
                    </template>
                  </template>
                </vxe-table-column>
              </vxe-table>
              <vxe-pager
                background
                :current-page.sync="recordInItemListquery.current"
                :page-size.sync="recordInItemListquery.size"
                :total="inpacttotal"
                :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
                @page-change="_getInPactItemPage"
              ></vxe-pager>
            </div>
            <div class="footbar" v-if="showbuttom">
              <!-- 待入库显示 -->
              <div class="footbtn1" v-if="savemode == 0">
                <el-button type="primary" @click="gotochangstorage">去入库</el-button>
              </div>
              <!-- 已入库显示 -->
              <div class="footbtn2" v-else-if="savemode == 1">
                <!-- <el-button type="primary">撤销入库单</el-button> -->
              </div>
            </div>
          </div>
          <div class="inpactdiv" v-else>
            <div class="inPactItembar">
            </div>
              <vxe-toolbar custom></vxe-toolbar>
              <vxe-table
                ref="xTable"
                border
                show-header-overflow
                show-overflow
                highlight-hover-row
                max-height="500"
                keep-source
                :data="recordInList"
              >
                <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
                <vxe-table-column field="itemName" title="商品名称"></vxe-table-column>
                <vxe-table-column field="detailName" title="货物名称"></vxe-table-column>
                <vxe-table-column field="inNumber" title="入库数量"></vxe-table-column>
                <vxe-table-column field="inPrice" title="单价"></vxe-table-column>
                <vxe-table-column field="inTax" title="税额"></vxe-table-column>
              </vxe-table>
              <vxe-pager
                background
                :current-page.sync="recordInItemListquery.current"
                :page-size.sync="recordInItemListquery.size"
                :total="inpacttotal"
                :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
                @page-change="_getInPactItemPage"
              ></vxe-pager>
              <div class="footbar">
              <!-- 已入库显示 -->
              <div class="footbtn2">
                <!-- <el-button type="primary">撤销入库单</el-button> -->
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog title="信息" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="dialogContext">
        <el-form ref="eachItem" :model="eachItem" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="数量">
                <el-input-number
                  v-model="eachItem.currentInNumber"
                  controls-position="right"
                  :min="1"
                  :max="recordMax"
                  @change="getTotalPrice"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canclerecordineachItem">取 消</el-button>
        <el-button type="primary" @click="comfirmrecordineachItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import {
  getRecordInPageByAttributes,
  saveOrModifyBatchRecordIn,
  getInPactByAttributes
} from "@/api/wms/record/recordin";
import { getSupplierPage } from "@/api/wms/supplier/supplier";
import { getWarehousePage } from "@/api/wms/warehouse/warehouse";
import { getDictPageByAttributes } from "@/api/dict";
import { purchaseInStorage } from "@/api/wms/storage/storage";
import {
  getPurchasePactPageByAttributes,
  getPurchasePactById
} from "@/api/wms/purchasepact/purchasepact";
import {
  getPurchaseBillPageByAttributes,
  getPurchaseBillListWithShoudInNumber
} from "@/api/wms/purchasepact/purchasebill";
export default {
  name: "purchase-order",
  data() {
    return {
      allAlign: null,
      allAlign2: null,
      supplierList: [],
      warehouseList: [],
      recordInList: [],
      loading: false,
      pactSearchItem: {
        current: 1,
        size: 10,
        pactDateStart: null,
        pactDateEnd: null,
        supplierId: null,
        pactId: null,
        pactClassify: "WMS_PURPACT_WAITSAVE"
      },
      purPactList: [],
      PactItem: {},
      pactBillList: [],
      eachItem: {},
      searchItem: {
        inDateStart: null,
        inDateEnd: null,
        supplierId: null,
        warehouseId: null,
        recordInCode: null,
        inClassify: null,
        inType: null
      },
      DateList: [moment().subtract(1, "month"), moment()],
      total: 0,
      tablePage: {
        current: 1,
        size: 100
      },
      edit: true,
      recordInItemListquery: {
        current: 1,
        size: 10
      },
      inpacttotal: 0,
      dialogVisible: false,
      editable: true,
      savemode: 0,
      showbuttom: false,
      recordInCode: null,
      billtypeList: [],
      inPactList: [],
      inPactItem: {},
      recordMax: 0,
      recordineachItem: {},
      storageList: [],
      inPactMap: {},
      inClassify: [
        {
          code: "PURCHASE",
          name: "采购单"
        },
         {
          code: "TRANSFER_IN",
          name: "调库入库单"
        },
         {
          code: "REFUND_IN",
          name: "退货入库单"
        }
      ],
      pactClassify: [
        {
          code: "WMS_PURPACT_WAITSAVE",
          name: "采购单待入库"
        },
        {
          code: "WMS_PURPACT_SOMESAVE",
          name: "采购单部分入库"
        },
        {
          code: "WMS_PURPACTC_ABANDON",
          name: "采购单撤销"
        },
        {
          code: "WMS_PURPACT_FINISH",
          name: "采购单入库完成"
        }
      ],
      showdiv: true,
      inPactBillList: [],
      purchase:{}
    };
  },
  async created() {
    this.pactId = this.$route.params.id;
    if(this.pactId != ":id"){
      this._getPurchasePactById(this.pactId,(data)=>{
        this.choicebuttonmode(data)
      })
      
      let params = {
        pactId: this.pactId
      };
      this._getPurchaseBillListWithShoudInNumber(params, data => {
        for (var i = 0; i < data.data.length; i++) {
          data.data[i].currentInNumber = data.data[i].shoudInNumber;
          data.data[i].supplierName = data.data[i].suppilerName
        }
        this.pactBillList = data.data;
      });
    }
    await this._getSupplierPage(this.tablePage);
    await this._getWarehousePage(this.tablePage);
    let params = {
      pactDateStart: this.DateList[0].valueOf(),
      pactDateEnd: this.DateList[1].valueOf(),
      pactClassify: "WMS_PURPACT_WAITSAVE"
    };
    await this._getPurchasePactPageByAttributes(params, data => {});
  },

  methods: {
    _getSupplierPage({ current, size }) {
      getSupplierPage({ current, size }).then(res => {
        if (res.status === 200) {
          this.supplierList = res.data.records;
        }
      });
    },
    _getWarehousePage({ current, size }) {
      getWarehousePage({ current, size }).then(res => {
        if (res.status === 200) {
          this.warehouseList = res.data.records;
        }
      });
    },
    _getInPactByAttributes(data) {
      getInPactByAttributes(data).then(res => {
        if (res.status === 200) {
          this.inPactMap = res.data;
          this.inPactList = [];
          for (let key in this.inPactMap) {
            // if (this.inPactMap[key][0].recordInCode.indexOf("CG") != -1) {
            //   this.inPactMap[key][0].inClassify = "采购单入库记录";
            // }
            this.inPactList.push(this.inPactMap[key][0]);
          }
        }
      });
    },
    _getInPactById(inPactId) {
      getInPactById(inPactId).then(res => {
        if (res.status === 200) {
          this.inPactItem = res.data.records;
        }
      });
    },
    _getRecordInPageByAttributes(params) {
      getRecordInPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.recordInList = res.data.records;
          this.inpacttotal = res.data.total;
        }
      });
      
    },
    _getDictPageByAttributes_billtype(params) {
      getDictPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.billtypeList = res.data.records;
        }
      });
    },
    _saveOrModifyInPact(data, callback) {
      saveOrModifyInPact(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据保存成功！",
            type: "success"
          });
          callback(res.data);
        }
      });
    },
    _saveOrModifyBatchRecordIn(data, callback) {
      saveOrModifyBatchRecordIn(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据保存成功！",
            type: "success"
          });
          callback(res.data);
        }
      });
    },
    // 左侧列表获取
    _getInPactList() {
      this.searchItem.inDateStart = this.DateList[0].valueOf();
      this.searchItem.inDateEnd = this.DateList[1].valueOf();
      this._getInPactByAttributes(this.searchItem);
    },
    _removePunchasePact(punchasePactId) {
      removePunchasePact(punchasePactId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据删除成功！",
            type: "success"
          });
        }
      });
    },

    _removePurchaseBillsByPurchaseBillIdList(data) {
      removePurchaseBillsByPurchaseBillIdList(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据删除成功！",
            type: "success"
          });
        }
      });
    },
    _getInPactItemPage() {
      let param = {
        inPactId: this.inPactItem.inPactId,
        current: this.recordInItemListquery.current,
        size: this.recordInItemListquery.size
      };
      this._getRecordInPageByAttributes(param);
    },
    _getPurchasePactPageByAttributes(param, callback) {
      getPurchasePactPageByAttributes(param).then(res => {
        if (res.status === 200) {
          this.purPactList = res.data.records;
          callback(res);
        }
      });
    },
    _getPurchasePactById(pactId, callback) {
      getPurchasePactById(pactId).then(res => {
        if (res.status === 200) {
          callback(res.data);
        }
      });
    },
    _getPurchaseBillPageByAttributes(param, callback) {
      getPurchaseBillPageByAttributes(param).then(res => {
        if (res.status === 200) {
          callback(res);
        }
      });
    },
    _getPurchaseBillListWithShoudInNumber(pactId, callback) {
      getPurchaseBillListWithShoudInNumber(pactId).then(res => {
        if (res.status === 200) {
          callback(res);
        }
      });
    },
    _purchaseInStorage(data, warehouseId, callback) {
      purchaseInStorage(data, warehouseId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "保存成功！",
            type: "success"
          });
          callback(res);
        }
      });
    },
    _getPactList() {
      this.pactSearchItem.pactDateStart = this.DateList[0].valueOf();
      this.pactSearchItem.pactDateEnd = this.DateList[1].valueOf();
      this._getPurchasePactPageByAttributes(this.pactSearchItem);
    },
    // 删除货物条目操作
    deleteRowEvent(row) {
      for (var i = 0; i < this.pactBillList.length; i++) {
        if (this.pactBillList[i].detailId == row.detailId) {
          this.pactBillList.splice(i, 1);
        }
      }
    },
    // 表格行点击操作
    cellClickEvent({ row }) {
      this.choicebuttonmode(row);
      let params = {
        pactId: row.pactId
      };
      this._getPurchaseBillListWithShoudInNumber(params, data => {
        for (var i = 0; i < data.data.length; i++) {
          data.data[i].currentInNumber = data.data[i].shoudInNumber;
        }
        this.pactBillList = data.data;
      });
    },
    inPactClickEvent(row) {
      this.recordInList = []
      let param = {
        recordInCode: row.recordInCode
      };
      this._getRecordInPageByAttributes(param);
      
    },
    choicebuttonmode(data) {
      if (data.pactClassify == "WMS_PURPACT_WAITSAVE" || data.pactClassify == "WMS_PURPACT_SOMESAVE") {
        this.showbuttom = true;
        this.edit = true;
        this.savemode = 0;
        // 待入库操作
      } 
      // else if (data.inType == "WMS_PURPACT_SOMESAVE") {
      //   this.showbuttom = false;
      //   this.edit = true;
      //   this.savemode = 1;
      //   // 部分入库操作
      // }
    },
    handleClick(tab, event) {
      if (tab.name === "confirmbill") {
        this.showdiv = false;
        this._getInPactByAttributes(this.searchItem);
      } else if (tab.name === "waitbill") {
        this.showdiv = true;
        let params = {
          pactDateStart: this.DateList[0].valueOf(),
          pactDateEnd: this.DateList[1].valueOf(),
          pactClassify: "WMS_PURPACT_WAITSAVE"
        };
        this._getPurchasePactPageByAttributes(params, data => {});
      }
    },
    handleSelect() {},
    // 左侧导航菜单选择
    handleSelect1(key) {
      this.pactSearchItem = {
        current: 1,
        size: 10,
        pactDateStart: null,
        pactDateEnd: null,
        supplierId: null,
        pactId: null,
        pactClassify: null
      };
      this.DateList = [moment().subtract(1, "month"), moment()];
      if (key === "1") {
        this.purPactList = [];
        this.pactSearchItem.pactClassify = "WMS_PURPACT_WAITSAVE";
        this._getPurchasePactPageByAttributes(this.pactSearchItem, data => {});
      } else if (key === "2") {
        this.purPactList = [];
        this.pactSearchItem.pactClassify = "WMS_PURPACT_SOMESAVE";
        this._getPurchasePactPageByAttributes(this.pactSearchItem, data => {});
      }
    },
    handleSelect2(key, keyPath) {},
    gotochangstorage() {
      if (this.PactItem.warehouseId == null) {
        this.$message({
          message: "请选择入库仓库！",
          type: "warning"
        });
      } else {
        for (var i = 0; i < this.pactBillList.length; i++) {
          this.pactBillList[i].purchaseNumber = this.pactBillList[
            i
          ].currentInNumber;
        }
        this._purchaseInStorage(
          this.pactBillList,
          this.PactItem.warehouseId,
          data => {
            if (data.status === 200) {
              let params = {
                pactDateStart: this.DateList[0].valueOf(),
                pactDateEnd: this.DateList[1].valueOf()
                // pactClassify: "WMS_PURPACT_WAITSAVE"
              };
              this._getPurchasePactPageByAttributes(params, data => {});
              this.PactItem = {};
              this.pactBillList = [];
            }
          }
        );
      }
    },
    // 格式化时间
    formatTime({ cellValue, row, column }) {
      return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
    // 表格合计更新
    updateFooterEvent(params) {
      let xTable = this.$refs.xTable;
      xTable.updateFooter();
    },
    // 表格底部合计算法
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return "总计";
          }
          if (["purchaseNumber"].includes(column.property)) {
            return this.$XEUtils.sum(data, column.property);
          }
          return null;
        })
      ];
    },
    // 格式化仓库类型
    fomtwmstype({ cellValue }) {
      let item = this.billtypeList.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    // 模态框关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 数量修改数量操作
    changeNum(data) {
      this.eachItem = data;
      this.recordMax = data.shoudInNumber;
      this.dialogVisible = true;
    },
    // 取消数量修改操作
    canclerecordineachItem() {
      this.eachItem = {};
      this.recordMax = 0;
      this.dialogVisible = false;
    },
    // 确认数量修改操作
    comfirmrecordineachItem() {
      this.dialogVisible = false;
    },
    getTotalPrice(currentValue) {
      this.recordineachItem.inTotalPrice =
        currentValue * this.recordineachItem.inPrice;
      this.updateFooterEvent();
    },
    getwarehouseName() {
      for (var i = 0; i < this.warehouseList.length; i++) {
        if (this.warehouseList[i].warehouseId == this.inPactItem.warehouseId) {
          this.inPactItem.warehouseName = this.warehouseList[i].warehouseName;
        }
      }
    },
    getInClassify(cellValue) {
      let item = this.inClassify.find(item => item.code === cellValue.inClassify);
      return item ? item.name : "";
    },
    getInType({ cellValue }) {
      let item = this.inType.find(item => item.code === cellValue);
      return item ? item.name : "";
    },
    getPactClassify({ cellValue }) {
      let item = this.pactClassify.find(item => item.code === cellValue);
      return item ? item.name : "";
    },
  }
};
</script>
<style scope>
.contentbar {
  margin: 30px;
}
.asidebar {
  background-color: rgb(252, 245, 237);
  min-height: 500px;
  font-size: 14px;
  padding: 5px 5px;
  margin: 0px 5px;
  border-radius: 10px;
}
.searchtitle {
  height: 40px;
  line-height: 40px;
  text-align: left;
  font-size: 14px;
}
.searchbutton {
  height: 60px;
  line-height: 60px;
  text-align: right;
}
.headerbar {
  height: 55px;
  background-color: rgb(252, 245, 237);
  padding: 12px;
  border-radius: 10px;
}
.mainbar {
  background-color: rgb(252, 245, 237);
  margin: 5px 0px;
  border-radius: 10px;
}
.footbtn1,
.footbtn2 {
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.asidetable {
  border: 1px solid #eeeeee;
  /* min-height: 200px; */
}
</style>
