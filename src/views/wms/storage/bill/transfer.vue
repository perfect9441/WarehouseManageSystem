<template>
  <div class="contentbar">
    <el-container>
      <el-aside width="400px" class="asidebar">
        <el-menu default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1" style="padding:0px 12px">全部</el-menu-item>
          <el-menu-item index="2" style="padding:0px 12px">草稿</el-menu-item>
          <el-menu-item index="3" style="padding:0px 12px">调拨完成</el-menu-item>
          <el-menu-item index="4" style="padding:0px 13px">待出库</el-menu-item>
          <el-menu-item index="5" style="padding:0px 13px">待入库</el-menu-item>
          <!-- <el-menu-item index="6" style="padding:0px 14px">部分出库</el-menu-item> -->
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
                <el-select v-model="searchItem.warehouseOutId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>
              </el-col>
               <el-col>
                <span class="searchtitle">选择入库仓库:</span>
              </el-col>
              <el-col>
                <el-select v-model="searchItem.warehouseInId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>
              </el-col>
          <el-col>
            <span class="searchtitle">调拨单编号:</span>
          </el-col>
          <el-col>
            <el-input placeholder="请输入内容" v-model="searchItem.pactId" clearable></el-input>
          </el-col>
          <el-col class="searchbutton">
            <el-button type="primary" icon="el-icon-search" @click="_getpactList">搜索</el-button>
          </el-col>
        </el-row>
        <vxe-table
          border
          show-header-overflow
          show-overflow
          highlight-hover-row
          :align="allAlign"
          :data="transferPactlist"
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
          <vxe-table-column field="warehouseOutName" title="出库仓库名称" show-overflow="tooltip"></vxe-table-column>
          <vxe-table-column field="warehouseInName" title="入库仓库名称" show-overflow="tooltip"></vxe-table-column>
          <vxe-table-column field="pactClassify" title="单据状态" :formatter="fomtwmstype"></vxe-table-column>
        </vxe-table>
        <vxe-pager
          style="font-size:10px"
          :loading="loading"
          :current-page="searchItem.current"
          :page-size="searchItem.size"
          :total="total"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="_getpactList"
        ></vxe-pager>
      </el-aside>
      <el-container>
        <el-header class="headerbar">
          <el-row>
            <el-button type="primary" icon="el-icon-plus" @click="addPactItem">新增调库单</el-button>
          </el-row>
        </el-header>
        <el-main class="mainbar">
          <div class="transferPactItembar">
            <el-form ref="transferPactItem" :model="transferPactItem" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="出库仓库">
                    <el-select
                      v-model="transferPactItem.warehouseOutId"
                      clearable
                      placeholder="请选择出库仓库"
                      :disabled="!edit"
                      @change="getwarehouseOutName"
                      style="width:80%"
                    >
                      <el-option
                        v-for="item in warehouseList"
                        :key="item.warehouseId"
                        :label="item.warehouseName"
                        :value="item.warehouseId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="入库仓库">
                    <el-select
                      v-model="transferPactItem.warehouseInId"
                      clearable
                      placeholder="请选择入库仓库"
                      :disabled="!edit"
                      @change="getwarehouseInName"
                      style="width:80%"
                    >
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
              <el-row>
                <el-col :span="12">
                  <el-form-item label="调货日期">
                    <el-date-picker
                      v-model="transferPactItem.pactDate"
                      type="date"
                      placeholder="选择日期"
                      v-if="edit"
                      style="width:80%"
                    ></el-date-picker>
                    <span v-else>{{transferPactItem.pactDate}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="备注">
                    <el-input
                      placeholder="请输入内容"
                      v-model.number="transferPactItem.pactText"
                      clearable
                      v-if="edit"
                      type="textarea"
                    ></el-input>
                    <span v-else>{{transferPactItem.pactText}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-divider ></el-divider>
          <div class="pactitemlist">
            <vxe-toolbar custom>
              <template v-slot:buttons>
                <vxe-button
                  icon="vxe-icon--plus"
                  vxe-icon--plus
                  status="primary"
                  @click="inserttransferPactItem"
                >新增调货项目</vxe-button>
              </template>
            </vxe-toolbar>

            <vxe-table
              ref="xTable"
              border
              show-header-overflow
              show-footer
              show-overflow
              highlight-hover-row
              max-height="500"
              keep-source
              :data="pactItemList"
              :footer-method="footerMethod"
            >
              <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
              <vxe-table-column field="itemName" title="商品名称"></vxe-table-column>
              <vxe-table-column field="detailName" title="货物名称"></vxe-table-column>
              <vxe-table-column field="transferNumber" title="调库数量"></vxe-table-column>
              <vxe-table-column field="transferPrice" title="单价"></vxe-table-column>
              <vxe-table-column field="transferTotalPrice" title="总价"></vxe-table-column>
              <vxe-table-column title="操作" width="200" v-if="edit">
                <template v-slot="{ row }">
                  <template>
                    <vxe-button icon="vxe-icon--edit-outline " @click="editItemRowEvent(row)">修改数量</vxe-button>
                    <vxe-button v-if="edit" @click="deleteRowEvent(row)" status="danger">删除</vxe-button>
                  </template>
                </template>
              </vxe-table-column>
            </vxe-table>
            <vxe-pager
              background
              :current-page.sync="pactItemqueryList.current"
              :page-size.sync="pactItemqueryList.size"
              :total="pacttotal"
              :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
              @page-change="_getPactItemPage"
            ></vxe-pager>
          </div>
          <div class="footbar" v-if="showbuttom">
            <!-- 新建时显示 -->
            <div class="footbtn1" v-if="savemode == 0">
              <el-button type="primary" @click="saveNewTransferPact">保存为草稿</el-button>
              <el-button type="primary" @click="setPickPactClassify">生成调库单</el-button>
              <el-button type="primary" @click="addPactItem">取消</el-button>
            </div>
            <!-- 修改草稿时显示 -->
            <div class="footbtn2" v-else-if="savemode == 1">
              <el-button type="primary" @click="saveNewTransferPact">保存为草稿</el-button>
              <el-button type="primary" @click="setPickPactClassify">转为调库单</el-button>
              <el-button type="primary" @click="removePunPact">删除此单据</el-button>
            </div>
            <!-- 待入库操作时显示 -->
            <div class="footbtn2" v-else-if="savemode == 2">
              <!-- <el-button type="primary">撤销调库单</el-button> -->
              <!-- <el-button type="primary" @click="addSomeInPact">部分出库</el-button> -->
              <el-button type="primary" @click="outTransferPact">去出库</el-button>
            </div>
            <!-- 部分入库操作时显示 -->
            <div class="footbtn2" v-else-if="savemode == 3">
              <!-- <el-button type="primary" @click="addAllInPact">剩余出库</el-button> -->
              <el-button type="primary" @click="inTransferPact">去入库</el-button>
            </div>
            <!-- 采购完成操作时显示 -->
            <div class="footbtn2" v-else-if="savemode == 4">
              <!-- <el-button type="primary">撤销采购单</el-button> -->
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog title="信息" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <div class="dialogContext">
        <el-form ref="packeachItem" :model="packeachItem" label-width="120px">
          <el-row>
            <el-col :span="12" v-if="editable">
              <el-form-item label="商品分类">
                <el-cascader
                  clearable
                  placeholder="请选择分类"
                  v-model="categoryList"
                  :props="defaultProps"
                  @change="handleSearchCategorySelectChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="editable">
              <el-form-item label="选择商品">
                <el-select
                  v-model="packeachItem.itemId"
                  clearable
                  placeholder="请选择商品"
                  @change="itemselect"
                >
                  <el-option
                    v-for="item in itemlist"
                    :key="item.itemId"
                    :label="item.itemName"
                    :value="item.itemId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="editable">
              <el-form-item label="选择货物">
                <el-select
                  v-model="packeachItem.detailId"
                  clearable
                  placeholder="请选择货物"
                  @change="itemdetailselect"
                >
                  <el-option
                    v-for="item in itemdetailist"
                    :key="item.detailId"
                    :label="item.detailName"
                    :value="item.detailId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量">
                <el-input-number
                  v-model="packeachItem.transferNumber"
                  controls-position="right"
                  :min="0"
                  :max="maxnum"
                  @change="getTotalPrice"
                ></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canclePactItem">取 消</el-button>
        <el-button type="primary" @click="comfirmPactItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { getWarehousePage } from "@/api/wms/warehouse/warehouse";
import { getDictPageByAttributes } from "@/api/dict";
import {
  getTransferPactPageByAttributes,
  saveOrModifyTransferPact,
  getTransferPactById,
  removeTransferPact
} from "@/api/wms/transferpact/transferpact";
import {
  getTransferBillPageByAttributes,
  saveOrModifyTransferBill,
  saveOrModifyBatchTransferBill,
  removeBatchTransferBill,
  removeTransferBill
} from "@/api/wms/transferpact/transferbill";
import {
  getChildCategoryListById,
  getCategoryById
} from "@/api/wms/category/category";
import { getItemPageByAttributes, getItemById } from "@/api/wms/goods/goods";
import {
  getItemDetailPageByAttributes,
  getItemDetailById
} from "@/api/wms/goods/goodsdetial";
import { getStoragePageByAttributes,transferInStorage, transferOutStorage} from "@//api/wms/storage/storage";
export default {
  name: "pick-order",
  //   computed: {
  //   ...mapGetters(["name"])
  // },
  data() {
    return {
      allAlign: null,
      warehouseList: [],
      transferPactlist: [],
      payModeList: [],
      pactItemList: [],
      loading: false,
      searchItem: {
        current: 1,
        size: 10,
        pactDateStart: null,
        pactDateEnd: null,
        pactId: null,
        warehouseOutId:null,
        warehouseInId:null,
        pactClassify:null
      },
      DateList: [moment().subtract(1, "month"), moment()],
      total: 0,
      tablePage: {
        current: 1,
        size: 100
      },
      edit: true,
      pactItemqueryList: {
        current: 1,
        size: 10
      },
      pacttotal: 0,
      dialogVisible: false,
      transferPactItem: {},
      defaultProps: {
        checkStrictly: true,
        lazy: true,
        value: "categoryId",
        label: "categoryName",
        children: "children",
        lazyLoad: this._categoryLazyLoad
      },
      categoryList: [],
      itemdetailist: [],
      itemlist: [],
      packeachItem: {},
      editable: true,
      savemode: 0,
      showbuttom: true,
      billtypeList: [],
      transferpactId: null,
      pickBillIdList: [],
      maxnum: 0
    };
  },
  async created() {
    let param2 = {
      dictType: "wms_transfer"
    };
    await this._getDictPageByAttributes_billtype(param2);
    await this._getWarehousePage(this.tablePage);
    await this._getpactList();
  },

  methods: {
    _getWarehousePage({ current, size }) {
      getWarehousePage({ current, size }).then(res => {
        if (res.status === 200) {
          this.warehouseList = res.data.records;
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
    _getTransferPactPageByAttributes(params) {
      this.transferPactlist = [];
      getTransferPactPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.transferPactlist = res.data.records;
          this.total = res.data.total;
        }
      });
    },
    _getTransferPactById(pactId) {
      getTransferPactById(pactId).then(res => {
        if (res.status === 200) {
          this.transferPactItem = res.data;
          this.choicebuttonmode(this.transferPactItem);
        }
      });
    },
    _getTransferBillPageByAttributes(params) {
      getTransferBillPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.pactItemList = res.data.records;
          this.pacttotal = res.data.total;
        }
      });
    },
    _saveOrModifyTransferPact(data, callback) {
      saveOrModifyTransferPact(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据保存成功！",
            type: "success"
          });
          callback(res.data);
        }
      });
    },
    _saveOrModifyTransferBill(data, callback) {
      saveOrModifyTransferBill(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据保存成功！",
            type: "success"
          });
          callback(res.data);
        }
      });
    },
    _saveOrModifyBatchTransferBill(data, callback) {
      saveOrModifyBatchTransferBill(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据保存成功！",
            type: "success"
          });
          callback(res.data);
        }
      });
    },
    _transferInStorage(data,callback){
      transferInStorage(data).then(res=>{
        if(res.status === 200){
           this.$message({
            message: "调库入库成功！",
            type: "success"
          });
          callback(res)
        }
      })
    },
    _transferOutStorage(data,callback){
      transferOutStorage(data).then(res=>{
        if(res.status === 200){
           this.$message({
            message: "调库出库成功！",
            type: "success"
          });
          callback(res)
        }
      })
    },
    // 左侧列表获取
    _getpactList() {
      this.searchItem.pactDateStart = this.DateList[0].valueOf();
      this.searchItem.pactDateEnd = this.DateList[1].valueOf();
      this._getTransferPactPageByAttributes(this.searchItem);
    },

    _getPactItemPage() {
      let param = {
        pactId: this.transferPactItem.pactId,
        current: this.pactItemqueryList.current,
        size: this.pactItemqueryList.size
      };
      this._getTransferBillPageByAttributes(param);
    },
    // 商品分类懒加载
    _categoryLazyLoad(node, resolve) {
      if (node.data) {
        let categoryId = node.data.categoryId;
        getChildCategoryListById(categoryId).then(res => {
          if (res.status === 200) {
            resolve(res.data);
          }
        });
      } else {
        resolve([
          {
            categoryName: "商品分类",
            categoryId: "1",
            categoryClassify: "WMS_CLASSIFY_LEVEL1"
          }
        ]);
      }
    },
    _getStoragePageByAttributes(params, callback) {
      getStoragePageByAttributes(params).then(res => {
        if (res.status === 200) {
          callback(res.data);
        }
      });
    },
    _getItemPageByAttributes(params) {
      getItemPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.itemlist = res.data.records;
        }
      });
    },
    _getItemDetailPageByAttributes(params) {
      getItemDetailPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.itemdetailist = res.data.records;
        }
      });
    },
    _getCategoryById(categoryId, callback) {
      getCategoryById(categoryId).then(res => {
        if (res.status === 200) {
          callback(res.data);
        }
      });
    },
    _getItemById(itemId, callback) {
      getItemById(itemId).then(res => {
        if (res.status === 200) {
          callback(res.data);
        }
      });
    },
    _getItemDetailById(itemdetailId, callback) {
      getItemDetailById(itemdetailId).then(res => {
        if (res.status === 200) {
          callback(res.data);
        }
      });
    },
    _removeTransferPact(transferpactId) {
      removeTransferPact(transferpactId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据删除成功！",
            type: "success"
          });
        }
      });
    },

    _removeBatchTransferBill(data) {
      removeBatchTransferBill(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据删除成功！",
            type: "success"
          });
        }
      });
    },
    _removeTransferBill(pickBillId) {
      removeTransferBill(pickBillId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据删除成功！",
            type: "success"
          });
        }
      });
    },
    // 分类选择
    handleSearchCategorySelectChange(e) {
      if (e.length == 0) {
        this.packeachItem.categoryId = null;
      } else {
        this.packeachItem.categoryId = e[e.length - 1];
        let params = {
          categoryId: this.packeachItem.categoryId
        };
        this._getItemPageByAttributes(params);
      }
    },
    // 插入货物项
    inserttransferPactItem() {
      if (this.transferPactItem.warehouseOutId != null && this.transferPactItem.warehouseInId != null) {
        this.dialogVisible = true;
        this.editable = true;
      } else {
        this.$message({
          message: "必须选择仓库后才能添加货物！",
          type: "warning"
        });
      }
    },
    // 商品选择操作
    itemselect() {
      let params = {
        itemId: this.packeachItem.itemId
      };
      this._getItemDetailPageByAttributes(params);
    },
    // 货物选择操作
    itemdetailselect() {
      this._getItemDetailById(this.packeachItem.detailId, data => {
        this.packeachItem.detailId = data.detailId;
        this.packeachItem.detailName = data.detailName;
        this.packeachItem.categoryName = data.categoryName;
        this.packeachItem.itemName = data.itemName;
        this.packeachItem.transferPrice = data.detailPrice;
        this.packeachItem.transferTax = data.detailTax;
        this.packeachItem.transferType = data.detailType
        let params = {
          warehouseId: this.transferPactItem.warehouseOutId,
          detailId: this.packeachItem.detailId
        };
        this.maxnum = 0;
        this._getStoragePageByAttributes(params, returndata => {
          if (returndata.records.length > 0) {
            if (returndata.records[0].storageNumber > 0) {
              this.maxnum = returndata.records[0].storageNumber;
              this.packeachItem.storageOutId = returndata.records[0].storageId;
            } else {
              this.$message({
                message: "指定货物库存小于1！",
                type: "warning"
              });
            }
          } else {
            this.$message({
              message: "该仓库无指定货物！",
              type: "warning"
            });
          }
        });
      });
    },
    // 取消插入货物操作
    canclePactItem() {
      this.packeachItem = {};
      this.dialogVisible = false;
      this.clearList();
    },
    // 确认插入货物操作
    comfirmPactItem() {
      // 判断是不是为空列表
      if (this.pactItemList.length > 0) {
        // 判断是不是修改原有内容
        if (this.packeachItem.transferBillId) {
          for (var i = 0; i < this.pactItemList.length; i++) {
            if (
              this.pactItemList[i].transferBillId == this.packeachItem.transferBillId
            ) {
              this.pactItemList[i] = this.packeachItem;
            }
          }
        } else {
          let info = {
            status: null,
            num: null
          };
          for (var i = 0; i < this.pactItemList.length; i++) {
            // 判断是否已存在该商品
            if (this.pactItemList[i].detailId == this.packeachItem.detailId) {
              info.status = "edit";
              info.num = i;
            }
          }
          if (info.status == "edit" && !this.packeachItem._XID) {
            this.$message("存在重复添加的货物，系统自动合并！");
            this.pactItemList[info.num].transferNumber =
              this.packeachItem.transferNumber +
              this.pactItemList[info.num].transferNumber;
              if(this.pactItemList[info.num].transferNumber > this.maxnum){
                this.$message("累计出库数量大于库存数量！默认修改为库存数量。");
                this.pactItemList[info.num].transferNumber = this.maxnum
              }

          } else if (!this.packeachItem._XID) {
            this.pactItemList.push(this.packeachItem);
          }
        }
      } else {
        this.pactItemList.push(this.packeachItem);
      }
      this.packeachItem = {};
      this.dialogVisible = false;
      this.clearList();
    },
    clearList() {
      this.categoryList = [];
      this.itemlist = [];
      this.itemdetailist = [];
    },
    getwarehouseOutName() {
      for (var i = 0; i < this.warehouseList.length; i++) {
        if (
          this.warehouseList[i].warehouseId == this.transferPactItem.warehouseOutId
        ) {
          this.transferPactItem.warehouseOutName = this.warehouseList[i].warehouseName;
        }
      }
    },
     getwarehouseInName() {
      for (var i = 0; i < this.warehouseList.length; i++) {
        if (
          this.warehouseList[i].warehouseId == this.transferPactItem.warehouseInId
        ) {
          this.transferPactItem.warehouseInName = this.warehouseList[i].warehouseName;
        }
      }
    },
    // 编辑货物条目操作
    editItemRowEvent(row) {
      this.editable = false;
      this.packeachItem = row;
      this.dialogVisible = true;
    },
    // 删除货物条目操作
    deleteRowEvent(row) {
      if (row.pickBillId) {
        for (var i = 0; i < this.pactItemList.length; i++) {
          if (this.pactItemList[i].detailId == row.detailId) {
            this.pactItemList.splice(i, 1);
          }
        }
        this._removeTransferBill(row.transferBillId)
      } else {
        for (var i = 0; i < this.pactItemList.length; i++) {
          if (this.pactItemList[i].detailId == row.detailId) {
            this.pactItemList.splice(i, 1);
          }
        }
      }
    },
    // 表格行点击操作
    cellClickEvent({ row }) {
      this.savemode = false;
      this.transferPactItem = row;
      // 草稿
      this.choicebuttonmode(row);
      let param = {
        pactId: row.pactId,
        current: this.pactItemqueryList.current,
        size: this.pactItemqueryList.size
      };
      this._getTransferBillPageByAttributes(param);
    },
    choicebuttonmode(data) {
      if (data.pactClassify == "WMS_TRANSFER_DRIFT") {
        this.showbuttom = true;
        this.edit = true;
        this.savemode = 1;
        // 采购完成
      } else if (data.pactClassify == "WMS_TRANSFER_INFINISH") {
        this.showbuttom = true;
        this.edit = false;
        this.savemode = 4;
        // 待出库操作
      } else if (data.pactClassify == "WMS_TRANSFER_WAITOUT") {
        this.showbuttom = true;
        this.edit = false;
        this.savemode = 2;
        // 待入库操作
      } else if (data.pactClassify == "WMS_TRANSFER_OUTFINISH") {
        this.showbuttom = true;
        this.edit = false;
        this.savemode = 3;
      }
    },
    // 新增订单
    addPactItem() {
      this.edit = true;
      this.savemode = 0;
      this.transferPactItem = {};
      this.pactItemList = [];
    },
    // 草稿操作
    async saveNewTransferPact() {
      if (this.transferPactItem.warehouseOutId == null || this.transferPactItem.warehouseInId == null) {
        this.$message({
          message: "仓库为必选项！",
          type: "warning"
        });
      } else if(this.transferPactItem.warehouseOutId == this.transferPactItem.warehouseInId ){
        this.$message({
          message: "出库仓库和入库仓库不能为同一仓库！",
          type: "warning"
        });
      }else{
        this.transferpactId = null;
        this.transferPactItem.pactClassify = "WMS_TRANSFER_DRIFT";
        // 保存或修改合同信息
        await this._saveOrModifyTransferPact(this.transferPactItem, data => {
          this.transferpactId = data.pactId;
        });
        setTimeout(() => {
          for (var i = 0; i < this.pactItemList.length; i++) {
            this.pactItemList[i].pactId = this.transferpactId;
            this.pactItemList[i].warehouseOutId = this.transferPactItem.warehouseOutId;
            this.pactItemList[i].warehouseOutName = this.transferPactItem.warehouseOutName;
            this.pactItemList[i].warehouseInId = this.transferPactItem.warehouseInId;
            this.pactItemList[i].warehouseInName = this.transferPactItem.warehouseInName;
          }
          // 保存或修改条目信息
          this._saveOrModifyBatchTransferBill(this.pactItemList, data => {});
          setTimeout(() => {
            // 保存成功后获取合同信息
            this._getTransferPactById(this.transferpactId);
            let param = {
              pactId: this.transferpactId,
              current: this.pactItemqueryList.current,
              size: this.pactItemqueryList.size
            };
            // 保成功后获取条目信息
            this._getTransferBillPageByAttributes(param);
            // 刷新左侧列表
            this._getpactList();
          }, 500);
        }, 500);
      }
    },
    // 转订单操作
    async setPickPactClassify() {
      if (this.transferPactItem.warehouseOutId == null || this.transferPactItem.warehouseInId == null) {
        this.$message({
          message: "仓库为必选项！",
          type: "warning"
        });
      } else if(this.transferPactItem.warehouseOutId == this.transferPactItem.warehouseInId ){
        this.$message({
          message: "出库仓库和入库仓库不能为同一仓库！",
          type: "warning"
        });
      }else {
        this.transferpactId = null;
        this.transferPactItem.pactClassify = "WMS_TRANSFER_WAITOUT";
        // 保存或修改合同信息
        await this._saveOrModifyTransferPact(this.transferPactItem, data => {
          this.transferpactId = data.pactId;
        });
        setTimeout(() => {
          for (var i = 0; i < this.pactItemList.length; i++) {
            this.pactItemList[i].pactId = this.transferpactId;
           this.pactItemList[i].warehouseOutId = this.transferPactItem.warehouseOutId;
            this.pactItemList[i].warehouseOutName = this.transferPactItem.warehouseOutName;
            this.pactItemList[i].warehouseInId = this.transferPactItem.warehouseInId;
            this.pactItemList[i].warehouseInName = this.transferPactItem.warehouseInName;
          }
          // 保存或修改条目信息
          this._saveOrModifyBatchTransferBill(this.pactItemList, data => {});
          setTimeout(() => {
            // 保存成功后获取合同信息
            this._getTransferPactById(this.transferpactId);
            let param = {
              pactId: this.transferpactId,
              current: this.pactItemqueryList.current,
              size: this.pactItemqueryList.size
            };
            // 保成功后获取条目信息
            this._getTransferBillPageByAttributes(param);
            // 刷新左侧列表
            this._getpactList();
          }, 500);
        }, 500);
      }
    },
    // 删除合同
    removePunPact() {
      this.$confirm("此操作将永久删除该订单及订单下条目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._removeTransferPact(this.transferPactItem.pactId);
          this.pickBillIdList = [];
          for (var i = 0; i < this.pactItemList.length; i++) {
            this.pickBillIdList.push(this.pactItemList[i].pickBillId);
          }
          this._removeBatchTransferBill(this.pickBillIdList);
          setTimeout(() => {
            this.addPactItem();
            this._getpactList();
          }, 500);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handlePageChange() {},
    // 左侧导航菜单选择
    handleSelect(key, keyPath) {
      this.searchItem = {
        current: 1,
        size: 10,
        pactDateStart: null,
        pactDateEnd: null,
        pactId: null,
        pactClassify: null
      };
      this.DateList = [moment().subtract(1, "month"), moment()];
      if (key === "1") {
        this.transferPactlist = [];
        this.searchItem.pactClassify = null;
        this._getpactList();
      } else if (key === "2") {
        this.transferPactlist = [];
        this.searchItem.pactClassify = "WMS_TRANSFER_DRIFT";
        this._getpactList();
      } else if (key === "3") {
        this.transferPactlist = [];
        this.searchItem.pactClassify = "WMS_TRANSFER_INFINISH";
        this._getpactList();
      } else if (key === "4") {
        this.transferPactlist = [];
        this.searchItem.pactClassify = "WMS_TRANSFER_WAITOUT";
        this._getpactList();
      } else if (key === "5") {
        this.transferPactlist = [];
        this.searchItem.pactClassify = "WMS_TRANSFER_OUTFINISH";
        this._getpactList();
      } 
    },
    // 格式化时间
    formatTime({ cellValue, row, column }) {
      return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
    },
    // 格式化仓库类型
    fomtwmstype({ cellValue }) {
      let item = this.billtypeList.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    // 获取总价操作
    getTotalPrice(currentValue) {
      this.packeachItem.transferTotalPrice =
        currentValue * this.packeachItem.transferPrice;
      this.updateFooterEvent();
    },
    // 模态框关闭
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
          if (["pickNumber", "pickTotalPrice"].includes(column.property)) {
            return this.$XEUtils.sum(data, column.property);
          }
          return null;
        })
      ];
    },

    // 全部入库操作
    outTransferPact() {
   
      this._transferOutStorage(this.pactItemList,(data)=>{
        if(data.status === 200){
          this._getpactList()
          this._getTransferPactById(this.transferPactItem.pactId)
          let params = {
             pactId: this.transferPactItem.pactId,
              current: this.pactItemqueryList.current,
              size: this.pactItemqueryList.size
          }
          this._getTransferBillPageByAttributes(params)
        }
      })
      
    },

    // 部分入库操作
    inTransferPact() {
      this._transferInStorage(this.pactItemList,(data)=>{
        if(data.status === 200){
          this._getpactList()
          this._getTransferPactById(this.transferPactItem.pactId)
          let params = {
             pactId: this.transferPactItem.pactId,
              current: this.pactItemqueryList.current,
              size: this.pactItemqueryList.size
          }
          this._getTransferBillPageByAttributes(params)
        }
      })
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
</style>
