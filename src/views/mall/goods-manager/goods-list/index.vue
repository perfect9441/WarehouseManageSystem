<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">商品列表</h1>
    <vxe-toolbar custom :refresh="{query: _getPage}" style="margin-bottom:20px">
      <template v-slot:buttons>
        <vxe-input
          clearable
          v-model="queryList.goodsCode"
          type="search"
          placeholder="输入编号"
          class="marginBottom"
        ></vxe-input>
        <vxe-input clearable v-model="queryList.goodsName" type="search" placeholder="输入名称"></vxe-input>
        <vxe-select clearable v-model="queryList.hotFlag" placeholder="选择是否热卖">
          <vxe-option
            v-for="(item,index) in goodsHotFlagList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        <vxe-select clearable v-model="queryList.newFlag" placeholder="选择是否新品">
          <vxe-option
            v-for="(item,index) in goodsNewFlagList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        <vxe-select clearable v-model="queryList.goodsState" placeholder="选择商品状态">
          <vxe-option
            v-for="(item,index) in goodsStateList"
            :key="index"
            :value="item.dictCode"
            :label="item.dictName"
          ></vxe-option>
        </vxe-select>
        <vxe-select clearable v-model="queryList.brandId" placeholder="选择品牌">
          <vxe-option
            v-for="(item,index) in brandList"
            :key="index"
            :value="item.brandId"
            :label="item.brandName"
          ></vxe-option>
        </vxe-select>

        <el-cascader
          clearable
          :props="cateCascaderProps"
          @change="handleSearchCateSelectChange"
          :options="categoryList"
          placeholder="选择类目"
        ></el-cascader>
        <vxe-select v-model="queryList.merchantId" placeholder="选择门店">
          <vxe-option
            v-for="(item,index) in merchantList"
            :key="index"
            :value="item.merchantId"
            :label="item.merchantName"
          ></vxe-option>
        </vxe-select>
        <vxe-button @click="_getPage">搜索</vxe-button>
        <vxe-button icon="fa fa-plus" @click="insertEvent">新增</vxe-button>
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
      <vxe-table-column title="图片" align="center">
        <template v-slot="{ row }">
          <img class="tableImage" v-if="row.goodsImages" :src="imageDownLoadUrl+row.goodsImages" />
          <el-tag v-if="!row.goodsImages" type="info">无图片</el-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="goodsCode" title="编号"></vxe-table-column>
      <vxe-table-column field="goodsName" title="名称"></vxe-table-column>
      <vxe-table-column field="goodsBrief" title="描述"></vxe-table-column>
      <vxe-table-column field="goodsCommonPrice" title="价格"></vxe-table-column>
      <vxe-table-column field="categoryName" title="类目"></vxe-table-column>
      <vxe-table-column field="brandName" title="品牌">
        <template v-slot="{ row }">
          <template v-if="row.brandId">{{row.brandName}}</template>
          <template v-else>
            <el-tag type="info">未设置</el-tag>
          </template>
        </template>
      </vxe-table-column>
      <vxe-table-column title="是否热卖">
        <template v-slot="{ row }">
          <template>
            <el-tag
              :type="row.hotFlag=='MALL_GOODS_HOTFLAG_HOT'?'danger':'info'"
            >{{goodsHotFlagMap[row.hotFlag] }}</el-tag>
          </template>
        </template>
      </vxe-table-column>
      <vxe-table-column title="是否新品">
        <template v-slot="{ row }">
          <template>
            <el-tag
              :type="row.newFlag=='MALL_GOODS_NEWFLAG_NEW'?'success':'info'"
            >{{goodsNewFlagMap[row.newFlag] }}</el-tag>
          </template>
        </template>
      </vxe-table-column>
      <vxe-table-column title="状态">
        <template v-slot="{ row }">
          <template>
            <el-tag
              :type="row.goodsState=='MALL_GOODS_STATE_SOLDOUT'?'danger':'success'"
            >{{goodsStateMap[row.goodsState] }}</el-tag>
          </template>
        </template>
      </vxe-table-column>

      <vxe-table-column title="操作">
        <template v-slot="{ row }">
          <vxe-button icon="vxe-icon--edit-outline " @click="editEvent(row)" status="primary">编辑</vxe-button>
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
import { getMerchantByUsername } from "@/api/mall/mer-admin";
import { getGoodsPageByAttributes } from "@/api/mall/goods";

import { mapGetters } from "vuex";

import { getDictPageByAttributes } from "@/api/dict";
import { _getDictMap } from "@/utils/my-utils";
import { getBrandPageByAttributes } from "@/api/mall/brand";
import { getCategoryPageByAttributes } from "@/api/mall/category";
import { getDownLoadImagePath } from "@/api/fastdfs";
export default {
  name: "GoodsList",
  computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      merchantList: [],
      imageDownLoadUrl: "",
      goodsStateList: [],
      goodsStateMap: [],
      goodsHotFlagList: [],
      goodsHotFlagMap: [],
      goodsNewFlagList: [],
      goodsNewFlagMap: [],
      brandList: [],
      formData: {},
      tableLoading: false,
      categoryList: [],

      cateCascaderProps: {
        checkStrictly: true,
        lazy: true,
        value: "categoryId",
        label: "categoryName",
        lazyLoad: this._cateLazyLoad
      },

      queryList: {
        current: 1,
        size: 10,
        goodsCode: null,
        goodsName: null,
        hotFlag: null,
        newFlag: null,
        goodsState: null,
        brandId: null,
        categoryId: null,
        merchantId: null
      },
      dataList: [],
      total: 0,
      pages: 0
    };
  },
  methods: {
    insertEvent() {
      this.$router.push({
        name: "MallGoodsManagerGoodsPutaway"
      });
    },
    editEvent(row) {
      console.info("row");
      console.info(row);
      this.$router.push({
        name: "MallGoodsManagerGoodsEdit",
        params: { id: row.goodsId }
      });
    },
    _cateLazyLoad(node, resolve) {
      if (this.merchantList == null || this.merchantList.length == 0) {
        return;
      }
      console.info("_cateLazyLoad");

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

    handleSearchCateSelectChange(e) {
      console.info("handleSearchCateSelectChange");
      console.info(e);
      // console.info(this.queryList);
      if (e.length == 0) {
        this.queryList.categoryId = null;
      } else {
        this.queryList.categoryId = e[e.length - 1];
      }
    },

    _getPage() {
      return new Promise((resolve, reject) => {
        if (this.merchantList == null || this.merchantList.length == 0) {
          resolve();
          return;
        }
        this.tableLoading = true;
        getGoodsPageByAttributes(this.queryList)
          .then(res => {
            console.info("getGoodsPageByAttributes");
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
  async created() {
    await getMerchantByUsername(this.userInfo.username).then(res => {
      this.merchantList = res.data;
    });
    if (this.merchantList == null || this.merchantList.length == 0) {
      return;
    }
    this.queryList.merchantId = this.merchantList[0].merchantId;
    this.imageDownLoadUrl = getDownLoadImagePath();
    this._getPage();
    getBrandPageByAttributes().then(res => {
      console.info("getBrandPageByAttributes");
      console.info(res);
      this.brandList = res.data.records;
    });
    let dictGoodsStateParams = {
      dictType: "mall_goods_state"
    };
    getDictPageByAttributes(dictGoodsStateParams).then(res => {
      this.goodsStateList = res.data.records;
      this.goodsStateMap = _getDictMap(this.goodsStateList);
    });
    let dictGoodsNewFlagParams = {
      dictType: "mall_goods_newflag"
    };
    getDictPageByAttributes(dictGoodsNewFlagParams).then(res => {
      this.goodsNewFlagList = res.data.records;
      this.goodsNewFlagMap = _getDictMap(this.goodsNewFlagList);
    });
    let dictGoodsHotFlagParams = {
      dictType: "mall_goods_hotflag"
    };
    getDictPageByAttributes(dictGoodsHotFlagParams).then(res => {
      this.goodsHotFlagList = res.data.records;
      this.goodsHotFlagMap = _getDictMap(this.goodsHotFlagList);
    });
  }
};
</script>

<style>
.marginBottom {
  margin-bottom: 10px;
}
.tableImage {
  width: 50px;
  height: 50px;
  margin-top: 5px;
}
</style>
