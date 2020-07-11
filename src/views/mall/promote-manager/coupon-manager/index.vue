<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">优惠券管理</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}">
      <template v-slot:buttons>
        <vxe-input clearable v-model="queryList.dictCode" type="search" placeholder="输入名称" class="marginBottom"></vxe-input>
        <vxe-select clearable v-model="queryList.useScopeType" placeholder="选择使用范围类型">
          <vxe-option
            v-for="(item,index) in useScopeTypeList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        <vxe-select clearable v-model="queryList.useType" placeholder="选择应用类型">
          <vxe-option
            v-for="(item,index) in useTypeList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        <vxe-select clearable v-model="queryList.distributeType" placeholder="选择分发类型">
          <vxe-option
            v-for="(item,index) in distributeTypeList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        <vxe-select clearable v-model="queryList.thresholdFlag" placeholder="使用门槛标识">
          <vxe-option
            v-for="(item,index) in thresholdFlagList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        
        </vxe-select>
        <vxe-button @click="_getPage">搜索</vxe-button>
        <vxe-button icon="fa fa-plus" @click="insertEvent">新增</vxe-button>
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
      <vxe-table-column type="expand" width="60" title="展开详情">
          <template v-slot:content="{ row, rowIndex }">
              <ul>
                
                  <li style="margin-bottom:10px">
                    <span>使用门槛：</span>
                    <template v-if="row.thresholdFlag=='MALL_COUPON_TH_ENOUGH'">
                    <span>{{'消费满'+ row.useThreshold+'元使用' }}</span>
                    </template>
                    <template v-else>
                      <span>{{'无门槛'}}</span>
                    </template>
                  </li>
                  <li style="margin-bottom:10px">
                    <span>有效期：</span>
                    <template v-if="row.effectType=='MALL_COUPON_EFFECT_RELA'">
                    <span>{{'领取后'+ row.effectNum+'天内使用' }}</span>
                     <span>{{'截止日期：'+ row.effectEndDate}}</span>
                    </template>
                    <template v-if="row.effectType=='MALL_COUPON_EFFECT_ABS'">
                      <span>{{formatDate(row.effectBeginDate) +'至'+ formatDate(row.effectEndDate) }}</span>
                    </template>
                  </li>
                  <li style="margin-bottom:10px">
                    <span>应用范围：</span>
                    <template v-if="row.useScopeType=='MALL_COUPON_USESCOPE_MER'">
                    <span>{{'指定店铺--'+ row.useScopeName+'  使用' }}</span>
                    </template>
                    <template v-else>
                      <span>{{'全场通用'}}</span>
                    </template>
                  </li>
                  <li style="margin-bottom:10px">
                    <span>使用品类范围：</span>
                    <template v-if="row.useType=='MALL_COUPON_USETYPE_CATE'">
                    <span>{{'指定类目--'+ row.useTypeKeyName+'  使用' }}</span>
                    </template>
                    <template v-else-if="row.useType=='MALL_COUPON_USETYPE_GOODS'">
                      <span>{{'指定商品--'+ row.useTypeKeyName+'  使用' }}</span>
                    </template>
                    <template v-else>
                      <span>{{'全类目通用'}}</span>
                    </template>
                  </li>
              </ul>
          </template>
      </vxe-table-column>
      <vxe-table-column field="couponName" title="名称"></vxe-table-column>
      <vxe-table-column field="couponDesc" title="描述"></vxe-table-column>
      <vxe-table-column field="couponTag" title="标签"></vxe-table-column>
      <vxe-table-column field="mitigateAmount" title="减免金额"></vxe-table-column>
      <vxe-table-column field="receiveAmount" title="限领数量"></vxe-table-column>
      <vxe-table-column field="distributeType" title="分发类型">
        <template v-slot="{ row }">{{distributeTypeMap[row.distributeType] }}</template>
      </vxe-table-column>
      <vxe-table-column field="useType" title="使用类型">
        <template v-slot="{ row }">{{useTypeMap[row.useType] }}</template>
      </vxe-table-column>
      <vxe-table-column field="useScopeType" title="使用范围类型">
        <template v-slot="{ row }">{{useScopeTypeMap[row.useScopeType] }}</template>
      </vxe-table-column>
      <vxe-table-column field="thresholdFlag" title="使用门槛类型">
        <template v-slot="{ row }">{{thresholdFlagMap[row.thresholdFlag] }}</template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="100">
        <template v-slot="{ row }">
          <vxe-button @click="deleteRowEvent(row)" status="danger">删除</vxe-button>
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
import {
  getCouponPageByAttributes,
  removeCoupon,
  saveOrModifyCoupon
} from "@/api/mall/coupon";
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
      tableLoading: false,
      effectTypeList: [],
      distributeTypeList: [],
      thresholdFlagList: [],
      useScopeTypeList: [],
      useTypeList: [],
      effectTypeMap: {},
      distributeTypeMap: {},
      thresholdFlagMap: {},
      useScopeTypeMap: {},
      useTypeMap: {},
      queryList: {
        current: 1,
        size: 10,
        effectType: null,
        distributeType: null,
        thresholdFlag: null,
        useScopeType: null,
        useType: null
      },
      dataList: [],
      total: 0,
      pages: 0,
     
    };
  },
  methods: {
    formatDate(date, format) {
      return this.$XEUtils.toDateString(date, format || "yyyy-MM-dd HH:mm:ss");
    },
    async insertEvent() {
         this.$router.push({
        name: "PromoteManagerCouponEdit"
      });
    },

    deleteRowEvent(row) {
      this.$XModal.confirm("您确定要删除该数据?").then(type => {
        if (type === "confirm") {
          if (row.couponId) {
            removeCoupon(row.couponId).then(res => {
              console.info("removeCoupon");
              console.info(res);
              this.$refs.xTable.remove(row);
            });
          } else {
            this.$refs.xTable.remove(row);
          }
        }
      });
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.tableLoading = true;
        getCouponPageByAttributes(this.queryList)
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
    }
  },
  created() {
   
    let useScopeTypeParams = {
      dictType: "mall_coupon_usescope"
    };
    getDictPageByAttributes(useScopeTypeParams).then(res => {
      this.useScopeTypeList = res.data.records;
      this.useScopeTypeMap = _getDictMap(this.useScopeTypeList);
    });
     let useTypeParams = {
      dictType: "mall_coupon_usetype"
    };
    getDictPageByAttributes(useTypeParams).then(res => {
      this.useTypeList = res.data.records;
      this.useTypeMap = _getDictMap(this.useTypeList);
    });
     let distributeTypeParams = {
      dictType: "mall_coupon_disttype"
    };
    getDictPageByAttributes(distributeTypeParams).then(res => {
      this.distributeTypeList = res.data.records;
      this.distributeTypeMap = _getDictMap(this.distributeTypeList);
    });
     let effectTypeParams = {
      dictType: "mall_coupon_effecttype"
    };
    getDictPageByAttributes(effectTypeParams).then(res => {
      this.effectTypeList = res.data.records;
      this.effectTypeMap = _getDictMap(this.effectTypeList);
    });
 
     let thresholdFlagParams = {
      dictType: "mall_coupon_thflag"
    };
    getDictPageByAttributes(thresholdFlagParams).then(res => {
      this.thresholdFlagList = res.data.records;
      this.thresholdFlagMap = _getDictMap(this.thresholdFlagList);
      console.info('this.thresholdFlagMap')
      console.info(this.thresholdFlagMap)
    });
    
    this._getPage();
  }
};
</script>

<style scoped>
.marginBottom{
    margin-bottom: 10px
}
</style>
