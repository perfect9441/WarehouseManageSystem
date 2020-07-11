<template>
  <div class="contentbar">
    <el-container>
      <el-aside width="550px" class="asidebar">
        <el-tabs type="border-card" value="waitbill" @tab-click="handleClick">
          <el-tab-pane label="待出库单据" name="waitbill">
            <el-menu
              default-active="1"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect1"
            >
              <el-menu-item index="1" style="padding:0px 6px">待出库</el-menu-item>
              <el-menu-item index="2" style="padding:0px 6px">部分出库</el-menu-item>
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
                <span class="searchtitle">选择出库仓库:</span>
              </el-col>
              <el-col>
                <el-select v-model="pactSearchItem.warehouseId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col>
                <span class="searchtitle">销售单编号:</span>
              </el-col>
              <el-col>
                <el-input placeholder="请输入内容" v-model="pactSearchItem.PactId" clearable></el-input>
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
              :data="pickPactList"
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
              <!-- <vxe-table-column field="suppilerName" title="供应商名称" show-overflow="tooltip"></vxe-table-column> -->
              <vxe-table-column field="warehouseName" title="出库仓库名称" show-overflow="tooltip"></vxe-table-column>
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
          <el-tab-pane label="已出库单据" name="confirmbill">
            <el-menu
              default-active="1"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect2"
            >
              <!-- <el-menu-item index="1" style="padding:0px 6px">全部</el-menu-item> -->
              <el-menu-item index="1" style="padding:0px 6px">已出库</el-menu-item>
              <el-menu-item index="2" style="padding:0px 6px">已出库撤销</el-menu-item>
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
              <!-- <el-col>
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
              </el-col> -->
              <el-col>
                <span class="searchtitle">选择出库仓库:</span>
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
                <span class="searchtitle">销售单编号:</span>
              </el-col>
              <el-col>
                <el-input placeholder="请输入内容" v-model="searchItem.outPactId" clearable></el-input>
              </el-col>
              <el-col class="searchbutton">
                <el-button type="primary" icon="el-icon-search" @click="_getOutPactList">搜索</el-button>
              </el-col>
            </el-row>
            <div class="asidetable">
              <el-table
                :data="outPactList"
                border
                style="width: 100%;font-size:10px"
                @cell-click="outPactClickEvent"
              >
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="inDate"
                  label="出库日期"
                  :formatter="formatTime"
                ></el-table-column>
                <el-table-column show-overflow-tooltip prop="warehouseName" label="出库仓库"></el-table-column>
                <!-- <el-table-column show-overflow-tooltip prop="supplierName" label="供应商"></el-table-column> -->
                <el-table-column show-overflow-tooltip prop="outClassify" label="单据类型"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-container>
        <el-main class="mainbar">
          <div class="pickdiv" v-if="showdiv">
            <div class="outPactItembar">
              <el-form ref="PactItem" :model="PactItem" label-width="120px">
                <el-row>
                  <!-- <el-col :span="6">
                    <el-form-item label="出库仓库">
                      <el-select v-model="PactItem.warehouseId" clearable placeholder="请选择">
                        <el-option
                          v-for="item in warehouseList"
                          :key="item.warehouseId"
                          :label="item.warehouseName"
                          :value="item.warehouseId"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col> -->
                </el-row>
              </el-form>
            </div>
            <div class="recordOutList">
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
                <vxe-table-column field="pickNumber" title="销售数量"></vxe-table-column>
                <vxe-table-column field="allowedOutNumber" title="库存数量"></vxe-table-column>
                <vxe-table-column field="currentOutNumber" title="出库数量"></vxe-table-column>
                <vxe-table-column field="pickPrice" title="单价"></vxe-table-column>
                <vxe-table-column field="pickTax" title="税额"></vxe-table-column>
                <vxe-table-column title="操作" width="220">
                  <template v-slot="{ row }">
                    <template>
                      <vxe-button @click="changeNum(row)" status="primary">修改出库数量</vxe-button>
                      <vxe-button @click="deleteRowEvent(row)" status="danger">删除</vxe-button>
                    </template>
                  </template>
                </vxe-table-column>
              </vxe-table>
              <vxe-pager
                background
                :current-page.sync="recordOutItemListquery.current"
                :page-size.sync="recordOutItemListquery.size"
                :total="outpacttotal"
                :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
                @page-change="_getOutPactItemPage"
              ></vxe-pager>
            </div>
            <div class="footbar" v-if="showbuttom">
              <!-- 待出库显示 -->
              <div class="footbtn1" v-if="savemode == 0">
                <el-button type="primary" @click="gotochangstorage">去出库</el-button>
              </div>
              <!-- 已出库显示 -->
              <div class="footbtn2" v-else-if="savemode == 1">
                <!-- <el-button type="primary">撤销出库单</el-button> -->
              </div>
            </div>
          </div>
          <div class="inpactdiv" v-else>
            <div class="outPactItembar">
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
                :data="recordOutList"
              >
                <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
                <vxe-table-column field="itemName" title="商品名称"></vxe-table-column>
                <vxe-table-column field="detailName" title="货物名称"></vxe-table-column>
                <vxe-table-column field="outNumber" title="出库数量"></vxe-table-column>
                <vxe-table-column field="outPrice" title="单价"></vxe-table-column>
                <vxe-table-column field="outTax" title="税额"></vxe-table-column>
              </vxe-table>
              <vxe-pager
                background
                :current-page.sync="recordOutItemListquery.current"
                :page-size.sync="recordOutItemListquery.size"
                :total="outpacttotal"
                :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
                @page-change="_getOutPactItemPage"
              ></vxe-pager>
              <div class="footbar">
              <!-- 已出库显示 -->
              <div class="footbtn2">
                <!-- <el-button type="primary">撤销出库单</el-button> -->
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
                  v-model="eachItem.currentOutNumber"
                  controls-position="right"
                  :min="0"
                  :max="recordMax"
                  @change="getTotalPrice"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canclerecordouteachItem">取 消</el-button>
        <el-button type="primary" @click="comfirmrecordouteachItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import {
  getRecordOutPageByAttributes,
  saveOrModifyRecordOut,
  getOutPactrByAttributes
} from "@/api/wms/record/recordout";
import { getSupplierPage } from "@/api/wms/supplier/supplier";
import { getWarehousePage } from "@/api/wms/warehouse/warehouse";
import { getDictPageByAttributes } from "@/api/dict";
import { pickOutStorage,getStoragePageByAttributes } from "@/api/wms/storage/storage";
import {
  getPickPactPageByAttributes,
  getPickPactById
} from "@/api/wms/pickpact/pickpact";
import {
  getPickBillPageByAttributes,
  getPickBillListWithAllowedOutNumber
} from "@/api/wms/pickpact/pickbill";
export default {
  name: "pick-order",
  data() {
    return {
      allAlign: null,
      allAlign2: null,
      supplierList: [],
      warehouseList: [],
      recordOutList: [],
      loading: false,
      pactSearchItem: {
        current: 1,
        size: 10,
        pactDateStart: null,
        pactDateEnd: null,
        warehouseId: null,
        pactId: null,
        pactClassify: "WMS_PICKPACT_WAITSAVE"
      },
      pickPactList: [],
      PactItem: {},
      pactBillList: [],
      eachItem: {},
      searchItem: {
        outDateStart: null,
        outDateEnd: null,
        warehouseId: null,
        recordOutCode: null,
        outClassify: null,
        outType: null
      },
      DateList: [moment().subtract(1, "month"), moment()],
      total: 0,
      tablePage: {
        current: 1,
        size: 100
      },
      edit: true,
      recordOutItemListquery: {
        current: 1,
        size: 10
      },
      outpacttotal: 0,
      dialogVisible: false,
      editable: true,
      savemode: 0,
      showbuttom: false,
      recordOutCode: null,
      billtypeList: [],
      outPactList: [],
      outPactItem: {},
      recordMax: 0,
      recordouteachItem: {},
      storageList: [],
      outPactMap: {},
      outClassify: [
        {
          code: "PICK",
          name: "销售单"
        }
      ],
      outType: [
        {
          code: "0",
          name: "待出库"
        },
        {
          code: "1",
          name: "出库完成"
        },
        {
          code: "2",
          name: "撤销出库"
        },
        {
          code: "3",
          name: "草稿"
        }
      ],
      pactClassify: [
        {
          code: "WMS_PICKPACT_WAITSAVE",
          name: "销售单待出库"
        },
        {
          code: "WMS_PICKPACT_SOMESAVE",
          name: "销售单部分出库"
        },
        {
          code: "WMS_PICKPACTC_ABANDON",
          name: "销售单撤销"
        },
        {
          code: "WMS_PICKPACT_FINISH",
          name: "销售单出库完成"
        }
      ],
      showdiv: true,
      inPactBillList: [],
      pick:{}
    };
  },
  async created() {
    this.pactId = this.$route.params.id;
    if(this.pactId != ":id"){
      this.pick = {}
      this._getPickPactById(this.pactId,(data)=>{
        this.pick = data
        this.choicebuttonmode(data)
      })
      
      let params = {
        pactId: this.pactId
      };
      this._getPickBillListWithAllowedOutNumber(params, data => {
        for (var i = 0; i < data.data.length; i++) {
          data.data[i].currentOutNumber = data.data[i].pickNumber;
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
      pactClassify: "WMS_PICKPACT_WAITSAVE"
    };
    await this._getPickPactPageByAttributes(params, data => {});
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
    _getOutPactrByAttributes(data) {
      getOutPactrByAttributes(data).then(res => {
        if (res.status === 200) {
          this.outPactMap = res.data;
          this.outPactList = [];
          for (let key in this.outPactMap) {
            if (this.outPactMap[key][0].recordOutCode.indexOf("CG") != -1) {
              this.outPactMap[key][0].outClassify = "销售单出库记录";
            }
            this.outPactList.push(this.outPactMap[key][0]);
          }
        }
      });
    },
    _getInPactById(outPactId) {
      getInPactById(outPactId).then(res => {
        if (res.status === 200) {
          this.outPactItem = res.data.records;
        }
      });
    },
    _getRecordOutPageByAttributes(params) {
      getRecordOutPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.recordOutList = res.data.records;
          this.outpacttotal = res.data.total;
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
    _saveOrModifyRecordOut(data, callback) {
      saveOrModifyRecordOut(data).then(res => {
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
    _getOutPactList() {
      this.searchItem.outDateStart = this.DateList[0].valueOf();
      this.searchItem.outDateEnd = this.DateList[1].valueOf();
      this._getOutPactrByAttributes(this.searchItem);
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

    _removepickBillsBypickBillIdList(data) {
      removepickBillsBypickBillIdList(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据删除成功！",
            type: "success"
          });
        }
      });
    },
    _getOutPactItemPage() {
      let param = {
        outPactId: this.outPactItem.outPactId,
        current: this.recordOutItemListquery.current,
        size: this.recordOutItemListquery.size
      };
      this._getRecordOutPageByAttributes(param);
    },
    _getPickPactPageByAttributes(param, callback) {
      getPickPactPageByAttributes(param).then(res => {
        if (res.status === 200) {
          this.pickPactList = res.data.records;
          callback(res);
        }
      });
    },
    _getPickPactById(pactId, callback) {
      getPickPactById(pactId).then(res => {
        if (res.status === 200) {
          callback(res.data);
        }
      });
    },
    _getPickBillPageByAttributes(param, callback) {
      getPickBillPageByAttributes(param).then(res => {
        if (res.status === 200) {
          callback(res);
        }
      });
    },
    _getPickBillListWithAllowedOutNumber(pactId, callback) {
      getPickBillListWithAllowedOutNumber(pactId).then(res => {
        if (res.status === 200) {
          callback(res);
        }
      });
    },
    _pickOutStorage(data, warehouseId, callback) {
      pickOutStorage(data, warehouseId).then(res => {
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
      this._getPickPactPageByAttributes(this.pactSearchItem);
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
      this.pick = {}
      this.choicebuttonmode(row);
      this.pick = row
      let params = {
        pactId: row.pactId
      };
      this._getPickBillListWithAllowedOutNumber(params, data => {
        for (var i = 0; i < data.data.length; i++) {
          data.data[i].currentOutNumber = data.data[i].allowedOutNumber;
        }
        this.pactBillList = data.data;
      });
    },
    outPactClickEvent(row) {
      this.recordOutList = []
      let param = {
        recordOutCode: row.recordOutCode
      };
      this._getRecordOutPageByAttributes(param);
      
    },
    choicebuttonmode(data) {
      if (data.pactClassify == "WMS_PICKPACT_WAITSAVE" || data.pactClassify == "WMS_PICKPACT_SOMESAVE") {
        this.showbuttom = true;
        this.edit = true;
        this.savemode = 0;
        // 待出库操作
      } 
      // else if (data.outType == "WMS_PICKPACT_SOMESAVE") {
      //   this.showbuttom = false;
      //   this.edit = true;
      //   this.savemode = 1;
      //   // 部分出库操作
      // }
    },
    handleClick(tab, event) {
      if (tab.name === "confirmbill") {
        this.showdiv = false;
        this._getOutPactrByAttributes(this.searchItem);
      } else if (tab.name === "waitbill") {
        this.showdiv = true;
        let params = {
          pactDateStart: this.DateList[0].valueOf(),
          pactDateEnd: this.DateList[1].valueOf(),
          pactClassify: "WMS_PICKPACT_WAITSAVE"
        };
        this._getPickPactPageByAttributes(params, data => {});
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
        warehouseId: null,
        pactId: null,
        pactClassify: null
      };
      this.DateList = [moment().subtract(1, "month"), moment()];
      if (key === "1") {
        this.pickPactList = [];
        this.pactSearchItem.pactClassify = "WMS_PICKPACT_WAITSAVE";
        this._getPickPactPageByAttributes(this.pactSearchItem, data => {});
      } else if (key === "2") {
        this.pickPactList = [];
        this.pactSearchItem.pactClassify = "WMS_PICKPACT_SOMESAVE";
        this._getPickPactPageByAttributes(this.pactSearchItem, data => {});
      }
    },
    handleSelect2(key, keyPath) {},
    gotochangstorage() {
      // if (this.PactItem.warehouseId == null) {
      //   this.$message({
      //     message: "请选择出库仓库！",
      //     type: "warning"
      //   });
      // } else {
        for (var i = 0; i < this.pactBillList.length; i++) {
          this.pactBillList[i].pickNumber = this.pactBillList[
            i
          ].currentOutNumber;
        }
        console.info(this.pactBillList)
        this._pickOutStorage(
          this.pactBillList,
          this.pick.warehouseId,
          data => {
            if (data.status === 200) {
              let params = {
                pactDateStart: this.DateList[0].valueOf(),
                pactDateEnd: this.DateList[1].valueOf()
                // pactClassify: "WMS_PICKPACT_WAITSAVE"
              };
              this._getPickPactPageByAttributes(params, data => {});
              this.PactItem = {};
              this.pactBillList = [];
            }
          }
        );
      // }
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
          if (["pickNumber"].includes(column.property)) {
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
      this.recordMax = data.allowedOutNumber;
      this.dialogVisible = true;
    },
    // 取消数量修改操作
    canclerecordouteachItem() {
      this.eachItem = {};
      this.recordMax = 0;
      this.dialogVisible = false;
    },
    // 确认数量修改操作
    comfirmrecordouteachItem() {
      this.dialogVisible = false;
    },
    getTotalPrice(currentValue) {
      this.recordouteachItem.inTotalPrice =
        currentValue * this.recordouteachItem.inPrice;
      this.updateFooterEvent();
    },
    getwarehouseName() {
      for (var i = 0; i < this.warehouseList.length; i++) {
        if (this.warehouseList[i].warehouseId == this.outPactItem.warehouseId) {
          this.outPactItem.warehouseName = this.warehouseList[i].warehouseName;
        }
      }
    },
    getoutClassify({ cellValue }) {
      let item = this.outClassify.find(item => item.code === cellValue);
      return item ? item.name : "";
    },
    getoutType({ cellValue }) {
      let item = this.outType.find(item => item.code === cellValue);
      return item ? item.name : "";
    },
    getPactClassify({ cellValue }) {
      let item = this.pactClassify.find(item => item.code === cellValue);
      return item ? item.name : "";
    }
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
