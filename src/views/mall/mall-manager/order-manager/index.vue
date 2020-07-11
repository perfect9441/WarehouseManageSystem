<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">订单管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <vxe-input
          clearable
          v-model="queryList.orderId"
          type="search"
          placeholder="输入订单编号"
          class="marginBottom"
        ></vxe-input>
        <vxe-select clearable v-model="queryList.orderState" placeholder="选择订单状态">
          <vxe-option
            v-for="(item,index) in orderStateList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>

        <vxe-button @click="_getPage">搜索</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      style="margin-top:20px"
      ref="xTable"
      border
      show-header-overflow
      show-overflow
      highlight-hover-row
      max-height="500"
      keep-source
      :data="dataList"
      :loading="tableLoading"
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="orderId" title="订单编号"></vxe-table-column>
      <vxe-table-column field="body" title="订单描述"></vxe-table-column>
      <vxe-table-column field="totalFee" title="实付金额">
        <template v-slot="{ row }">{{formatFee(row.totalFee) }}</template>
      </vxe-table-column>
      <vxe-table-column field="subFee" title="优惠券减免">
        <template v-slot="{ row }">{{formatFee(row.subFee) }}</template>
      </vxe-table-column>
      <vxe-table-column field="discountFee" title="折扣减免">
        <template v-slot="{ row }">{{formatFee(row.discountFee) }}</template>
      </vxe-table-column>
      <vxe-table-column field="distributionFee" title="配送费">
        <template v-slot="{ row }">{{formatFee(row.distributionFee) }}</template>
      </vxe-table-column>
      <vxe-table-column field="orderState" title="订单状态">
        <template v-slot="{ row }">{{orderStateMap[row.orderState] }}</template>
      </vxe-table-column>
      <vxe-table-column field="createTime" title="下单时间">
        <template v-slot="{ row }">{{formatDate(row.createTime)}}</template>
      </vxe-table-column>
      <vxe-table-column field="timeEnd" title="支付时间">
        <template v-slot="{ row }">
          <template v-if="row.timeEnd">{{row.timeEnd}}</template>
          <template v-else>未支付</template>
        </template>
      </vxe-table-column>

      <vxe-table-column title="操作" width="100">
        <template v-slot="{ row }">
          <vxe-button @click="detailRowEvent(row)" status="primary">详情</vxe-button>
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

    <el-dialog title="订单详情" :visible.sync="dialogDetailVisible" width="80%">
      <div>
        <span>收货人：</span>
        <span>{{orderDetailData.addrData.acceptName}}</span>
      </div>
      <div>
        <span>联系方式：</span>
        <span>{{orderDetailData.addrData.acceptPhone}}</span>
      </div>
      <div>
        <span>收货地址：</span>
        <span>{{orderDetailData.addrData.areaName+orderDetailData.addrData.addrDetail}}</span>
      </div>
      <div>
        <span>订单详细：</span>
      </div>
      <el-table :data="orderDetailData.orderItemList">
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsDetail.goodsName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品编号">
          <template slot-scope="scope">
            <span>{{ scope.row.goodsDetail.goodsId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="购买数量"></el-table-column>
        <el-table-column  label="单价（元）">
             <template slot-scope="scope">
            <span>{{ scope.row.goodsDetail.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="总价（元）">
             <template slot-scope="scope">
            <span>{{ formatFee(scope.row.price) }}</span>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <!-- <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderPageByAttributes,
  getOrderWithOrderItemAndGoodsDetail
} from "@/api/mall/order";
import { getAddrById } from "@/api/mms/addr";
import { getDictPageByAttributes } from "@/api/dict";
import { _getDictMap } from "@/utils/my-utils";
import { mapGetters } from "vuex";

export default {
  name: "PromoteManagerCouponManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      dialogDetailVisible: false,
      tableLoading: false,

      orderStateList: [],
      orderStateMap: {},

      queryList: {
        current: 1,
        size: 10,
        orderId: null,
        orderState: null
      },
      dataList: [],
      orderDetailData: {
        addrData: ""
      },
      total: 0,
      pages: 0
    };
  },
  methods: {
    formatDate(date, format) {
      return this.$XEUtils.toDateString(date, format || "yyyy-MM-dd HH:mm:ss");
    },
    formatFee(fee) {
      //fee以分为单位
      return parseFloat(parseFloat(fee) / 100).toFixed(2);
    },

    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getOrderPageByAttributes(this.queryList)
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
    async detailRowEvent(row) {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      await getOrderWithOrderItemAndGoodsDetail(row.orderId).then(res => {
        console.info("getOrderWithOrderItemAndGoodsDetail");
        console.info(res);
        res.data.addrData={}
        this.orderDetailData = res.data;
        this.orderDetailData.goodsFee = 0;
        for (let i = 0; i < this.orderDetailData.orderItemList.length; i++) {
          this.orderDetailData.goodsFee =
            this.orderDetailData.goodsFee +
            this.orderDetailData.orderItemList[i].price;
        }
      });
      await getAddrById(row.addrId).then(res => {
        console.info("getAddrById");
        console.info(res);
        this.orderDetailData.addrData = res.data;
      });
      console.info("this.orderDetailData");
      console.info(this.orderDetailData);
      loading.close();
      this.dialogDetailVisible = true;
    }
  },
  created() {
    let orderStateParams = {
      dictType: "trade_state"
    };
    getDictPageByAttributes(orderStateParams).then(res => {
      this.orderStateList = res.data.records;
      this.orderStateMap = _getDictMap(this.orderStateList);
    });

    this._getPage();
  }
};
</script>

<style scoped>
.marginBottom {
  margin-bottom: 10px;
}
</style>
