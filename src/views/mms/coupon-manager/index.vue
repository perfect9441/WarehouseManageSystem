<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">会员优惠券管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <vxe-input clearable v-model="queryList.memberId" type="search" placeholder="输入会员ID"></vxe-input>
        <vxe-input clearable v-model="queryList.couponId" type="search" placeholder="输入优惠券ID"></vxe-input>
        <vxe-select clearable v-model="queryList.merCouponState" placeholder="选择状态">
          <vxe-option
            v-for="(item,index) in couponStateList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        <vxe-select clearable v-model="queryList.merCouponType" placeholder="选择类型">
          <vxe-option
            v-for="(item,index) in couponTypeList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        <vxe-button @click="_getPage">搜索</vxe-button>
       
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
    >
      <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
      <vxe-table-column field="couponName" title="优惠券名称"></vxe-table-column>
      <vxe-table-column field="memberId" title="会员ID"></vxe-table-column>
      <vxe-table-column field="merCouponState" title="优惠券状态">
        <template v-slot="{ row }">
          <template v-if="row.merCouponState=='MMS_MER_COUPON_STATE_USED'">
            <el-tag type="warning">{{couponStateMap[row.merCouponState]}}</el-tag>
          </template>
          <template v-else-if="row.merCouponState=='MMS_MER_COUPON_STATE_DISABLE'">
            <el-tag type="danger">{{couponStateMap[row.merCouponState]}}</el-tag>
          </template>
          <template v-else-if="row.merCouponState=='MMS_MER_COUPON_STATE_EFFECT'">
            <el-tag type="success">{{couponStateMap[row.merCouponState]}}</el-tag>
          </template>
          <template v-else>
            <el-tag type="info">{{couponStateMap[row.merCouponState]}}</el-tag>
          </template>
        </template>
      </vxe-table-column>
      <vxe-table-column field="merCouponType" title="优惠券类型">
        <template v-slot="{ row }">{{couponTypeMap[row.merCouponType]}}</template>
      </vxe-table-column>
      <vxe-table-column field="createTime" title="领取日期" :formatter="formatDateForCell"></vxe-table-column>
      <vxe-table-column field="effectDate" title="生效日期" :formatter="formatDateForCell"></vxe-table-column>
      <vxe-table-column field="disableDate" title="失效日期" :formatter="formatDateForCell"></vxe-table-column>

      <vxe-table-column field="useDate" title="使用日期">
        <template v-slot="{ row }">
          <template v-if="row.useDate">{{formatDate(row.useDate)}}</template>
          <template v-else>
            <el-tag type="info">未使用</el-tag>
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
import { getMerCouponPageByAttributes } from "@/api/mms/coupon";
import { mapGetters } from "vuex";

export default {
  name: "MemberCouponManager",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      tableLoading: false,
      couponStateList: [],
      couponStateMap: {},
      couponTypeList: [],
      couponTypeMap: {},
      queryList: {
        current: 1,
        size: 10,
        memberId: null,
        couponId: null,
        merCouponState: null,
        merCouponType: null
      },
      dataList: [],
      total: 0,
      pages: 0
    };
  },
  methods: {
    formatDate(date, format) {
      return this.$XEUtils.toDateString(date, format || "yyyy-MM-dd HH:mm:ss");
    },
    formatDateForCell({ cellValue }, format) {
      return this.$XEUtils.toDateString(
        cellValue,
        format || "yyyy-MM-dd HH:mm:ss"
      );
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getMerCouponPageByAttributes(this.queryList)
          .then(res => {
            console.info("getMerCouponPageByAttributes");
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
    this._getPage();
    let dictCouponStateParams = {
      dictType: "mms_mer_coupon_state"
    };
    getDictPageByAttributes(dictCouponStateParams).then(res => {
      console.info("getDictPageByAttributes");
      console.info(res);
      this.couponStateList = res.data.records;
      this.couponStateMap = _getDictMap(this.couponStateList);
    });
    let dictCouponTypeParams = {
      dictType: "coupon_type"
    };
    getDictPageByAttributes(dictCouponTypeParams).then(res => {
      console.info("getDictPageByAttributes");
      console.info(res);
      this.couponTypeList = res.data.records;
      this.couponTypeMap = _getDictMap(this.couponTypeList);
    });
  }
};
</script>

<style>
</style>
