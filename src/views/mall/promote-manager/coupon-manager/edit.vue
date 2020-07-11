<!--  -->
<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="couponDataForm" :rules="rules" :model="couponData" label-width="150px">
        <el-form-item label="名称" prop="couponName">
          <el-input v-model="couponData.couponName" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="couponData.couponDesc" />
        </el-form-item>
        <el-form-item label="减免金额" prop="mitigateAmount">
          <el-input v-model.number="couponData.mitigateAmount">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="分发数量" prop="receiveAmount">
          <el-input v-model.number="couponData.receiveAmount">
            <template slot="append">张</template>
          </el-input>
        </el-form-item>
        <el-form-item label="分发类型" prop="distributeType">
          <el-radio-group v-model="couponData.distributeType" @change="onDistributeTypeChange">
            <el-radio
              v-for="(item,index) in distributeTypeList"
              :key="index"
              :label="item.dictCode"
            >{{item.dictName}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="使用门槛" prop="thresholdFlag">
          <el-radio-group v-model="couponData.thresholdFlag" @change="onThresholdFlagChange">
            <el-radio-button
              v-for="(item,index) in thresholdFlagList"
              :key="index"
              :label="item.dictCode"
            >{{item.dictName}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="couponData.thresholdFlag=='MALL_COUPON_TH_ENOUGH'">
          <el-form-item label="消费满" prop="useThreshold">
            <el-input v-model.number="couponData.useThreshold">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </template>

        <el-form-item label="有效期类型" prop="effectType">
          <el-radio-group v-model="couponData.effectType" @change="onEffectTypeChange">
            <el-radio-button
              v-for="(item,index) in effectTypeList"
              :key="index"
              :label="item.dictCode"
            >{{item.dictName}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="couponData.effectType=='MALL_COUPON_EFFECT_RELA'">
          <el-form-item label="领取后" prop="effectNum">
            <el-input v-model.number="couponData.effectNum">
              <template slot="append">天内使用</template>
            </el-input>
          </el-form-item>
          <el-form-item label="截止日期" prop="effectEndDate">
            <el-date-picker v-model="couponData.effectEndDate" type="datetime" placeholder="选择截止日期"></el-date-picker>
          </el-form-item>
        </template>
        <template v-if="couponData.effectType=='MALL_COUPON_EFFECT_ABS'">
          <el-form-item label="使用时间范围" prop="effectDateTemp">
            <el-date-picker
              style="width:90%"
              @change="onEffectDateChange"
              v-model="couponData.effectDateTemp"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </el-form-item>
        </template>

        <el-form-item label="应用范围类型" prop="useScopeType">
          <el-radio-group v-model="couponData.useScopeType" @change="onUseScopeTypeChange">
            <el-radio-button
              v-for="(item,index) in useScopeTypeList"
              :key="index"
              :label="item.dictCode"
            >{{item.dictName}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="couponData.useScopeType=='MALL_COUPON_USESCOPE_MER'">
          <el-form-item label="选择指定店铺" prop="useScope">
            <el-select v-model="couponData.useScope" clearable @change="onUseScopeChange">
              <el-option
                v-for="item in merchantList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </el-form-item>
        </template>
        <!-- 应用范围为全场通用时不可选择指定商品，因为商品都是和店铺挂钩的 -->
        <el-form-item label="使用类目范围类型" prop="useType">
          <el-radio-group v-model="couponData.useType" @change="onUseTypeChange">
            <el-radio-button
              :disabled="couponData.useScopeType=='MALL_COUPON_USESCOPE_ALL'&&item.dictCode=='MALL_COUPON_USETYPE_GOODS'"
              v-for="(item,index) in useTypeList"
              :key="index"
              :label="item.dictCode"
            >{{item.dictName}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <template v-if="couponData.useType=='MALL_COUPON_USETYPE_CATE'">
          <el-form-item label="选择指定类目" prop="useScopeCateTemp">
            <el-cascader
              style="width:90%"
              v-model="couponData.useScopeCateTemp"
              :props="cateCascaderProps"
              @change="handleCategoryChange"
              :options="categoryList"
            ></el-cascader>
          </el-form-item>
        </template>
        <template v-if="couponData.useType=='MALL_COUPON_USETYPE_GOODS'">
          <el-form-item label="选择指定商品" prop="useScopeGoodsTemp">
            <el-select
              style="width:90%"
              v-model="couponData.useScopeGoodsTemp"
              filterable
              remote
              reserve-keyword
              placeholder="请输入名称"
              :remote-method="_goodsLazyLoad"
              :loading="goodsSearchLoading"
              @change="handleScopeGoodsSelect"
            >
              <el-option
                v-for="item in goodsList"
                :key="item.goodsId"
                :label="item.goodsName"
                :value="item.goodsId"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <el-button type="primary" @click="onSubmit" :disabled="!canIedit">立即创建</el-button>
    </el-card>
  </div>
</template>

<script>
import { getGoodsPageByAttributes } from "@/api/mall/goods";
import { getDictPageByAttributes } from "@/api/dict";
import { _getDictMap } from "@/utils/my-utils";
import moment from "moment";
import { getMerchantByUsername } from "@/api/mall/mer-admin";
import { getMerchantPageByAttributes } from "@/api/mall/merchant";
import { getCategoryPageByAttributes } from "@/api/mall/category";
import { saveOrModifyCoupon } from "@/api/mall/coupon";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  components: {},
  data() {
    return {
      canIedit: true,
      goodsSearchLoading: false,
      categoryList: [],
      cateCacheList: [],
      merchantList: [],
      couponData: {
        effectDateTemp: null,
        useScope: null,
        effectNum: null,
        useScopeCateTemp: null,
        useScopeGoodsTemp: null,
        useThreshold: null
      },
      cateCascaderProps: {
        checkStrictly: true,
        lazy: true,
        value: "categoryId",
        label: "categoryName",
        lazyLoad: this._cateLazyLoad
      },
      goodsList: [],
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
      rules: {
        effectDateTemp: [
          { required: true, message: "请选择时间", trigger: "change" }
        ],
        effectEndDate: [
          { required: true, message: "请选择截止日期", trigger: "change" }
        ],
        effectNum: [{ required: true, message: "请录入天数", trigger: "blur" }],
        useScope: [
          { required: true, message: "请选择商户", trigger: "change" }
        ],
        useScopeCateTemp: [
          { required: true, message: "请选择类目", trigger: "change" }
        ],
        useScopeGoodsTemp: [
          { required: true, message: "请选择类目", trigger: "change" }
        ]
      }
    };
  },

  watch: {},
  methods: {
    onSubmit() {
      this.$refs["couponDataForm"].validate(async valid => {
        console.info(valid);
        if (valid) {
          saveOrModifyCoupon(this.couponData).then(res => {
            console.info(res);
            if (res.data) {
              this.$message({
                message: "创建成功",
                type: "success"
              });
              this.canIedit = false;
            }
          });
        }
      });
    },
    onDistributeTypeChange(e) {
      //TODO:扫码分发时自动生成兑换码
      if (e == "MALL_COUPON_DISTR_QRCODE") {
        this.couponData.redeemCode = this.$lodashUuid.uuid();
        console.info(this.couponData.redeemCode);
      } else {
        this.couponData.redeemCode = null;
      }
      console.info(this.couponData);
    },
    onThresholdFlagChange(e) {
      this.couponData.useThreshold = null;
      this.$refs["couponDataForm"].clearValidate();
    },
    onEffectTypeChange(e) {
      this.couponData.effectNum = null;
      this.couponData.effectBeginDate = null;
      this.couponData.effectEndDate = null;
      this.couponData.effectDateTemp = null;
      this.$refs["couponDataForm"].clearValidate();
    },
    onEffectDateChange(e) {
      console.info(e);
      this.couponData.effectBeginDate = moment(e[0]).format(
        "YYYY-MM-DD" + "T" + "HH:mm:ss"
      );
      this.couponData.effectEndDate = moment(e[1]).format(
        "YYYY-MM-DD" + "T" + "HH:mm:ss"
      );
    },
    onUseScopeTypeChange() {
      this.couponData.useScope = null;
      this.couponData.useScopeName = null;

      this.$refs["couponDataForm"].clearValidate();
    },
    onUseScopeChange(e) {
      this.couponData.useScopeName = this.merchantList.find(item => {
        return item.merchantId === e;
      }).merchantName;
      console.info(this.couponData.useScopeName);
    },
    onUseTypeChange() {
      this.couponData.useTypeKey = null;
      this.couponData.useTypeKeyName = null;
      this.couponData.useScopeCateTemp = null;
      this.couponData.useScopeGoodsTemp = null;
      this.$refs["couponDataForm"].clearValidate();
    },
    handleCategoryChange(e) {
      if (e.length == 0) {
        this.couponData.useTypeKey = null;
        this.couponData.useTypeKeyName = null;
      } else {
        this.couponData.useTypeKey = e[e.length - 1];

        let crumbs = "";
        for (let i = 0; i < e.length; i++) {
          let temp = this.cateCacheList.find(item => {
            return item.categoryId === e[i];
          });

          crumbs = crumbs + "/" + temp.categoryName;
        }
        this.couponData.useTypeKeyName = crumbs;
      }
    },
    handleScopeGoodsSelect(e) {
      this.couponData.useTypeKey = e;
      this.couponData.useTypeKeyName = this.goodsList.find(item => {
        return item.goodsId == e;
      }).goodsName;
    },

    _cateLazyLoad(node, resolve) {
      console.info("orgLazyLoad");

      if (node.data) {
        let params = {
          parentId: node.data.categoryId
        };
        let children = [];
        getCategoryPageByAttributes(params).then(async res => {
          console.info("getCategoryPageByAttributes");
          console.info(res);
          children = res.data.records;
          for (let i = 0; i < children.length; i++) {
            children[i].children = [];
            // children[i].leaf = "leaf";
            this.cateCacheList.push(children[i]);
          }
          console.info(this.cateCacheList);
          resolve(children);
        });
      } else {
        let params = {
          cateLevel: "MALL_CATE_LEVEL_FIRST"
        };
        getCategoryPageByAttributes(params)
          .then(res => {
            console.info("getCategoryPageByAttributes");
            console.info(res);
            this.categoryList = res.data.records;
            for (let i = 0; i < this.categoryList.length; i++) {
              this.categoryList[i].children = [];
              // this.categoryList[i].leaf = "leaf";
              this.cateCacheList.push(this.categoryList[i]);
            }
            console.info(this.cateCacheList);
            resolve(this.categoryList);
          })
          .catch(err => {});
      }
    },
    _goodsLazyLoad(queryString) {
      if (!this.couponData.useScope) {
        this.$message({
          message: "选择指定商品时请先选择指定店铺",
          type: "warning"
        });
        return;
      }
      let params = {
        current: 1,
        size: 100,
        goodsNameLike: queryString,
        merchantId: this.couponData.useScope
      };
      getGoodsPageByAttributes(params).then(res => {
        console.info("getGoodsPageByAttributes");
        console.info(res);
        this.goodsList = res.data.records;
      });
    }
  },
  created() {
    getMerchantByUsername(this.userInfo.username).then(res => {
      this.merchantList = res.data;
    });

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
    });
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>