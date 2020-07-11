<template>
  <div style="margin:30px;">
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-button type="primary" icon="el-icon-folder-opened" disabled>按仓库显示</el-button>
              <el-button type="primary" icon="el-icon-folder-opened" disabled>按货物显示</el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="content-bar">
        <vxe-toolbar :refresh="{query: _getPage}" custom>
          <template v-slot:buttons>
            <el-row>
               <vxe-input
                clearable
                v-model="searchItem.itemName"
                type="search"
                placeholder="商品名称"
              ></vxe-input>
              <vxe-input
                clearable
                v-model="searchItem.itemionCode"
                type="search"
                placeholder="商品代码"
              ></vxe-input>
              <vxe-input
                clearable
                v-model="searchItem.itemDetialName"
                type="search"
                placeholder="货物名称"
              ></vxe-input>
              <vxe-input
                clearable
                v-model="searchItem.itemdetialCode"
                type="search"
                placeholder="货物代码"
              ></vxe-input>
              <el-cascader
                clearable
                placeholder="请选择分类"
                :props="defaultProps"
                @change="handleSearchCategorySelectChange"
              ></el-cascader> 
              <el-select v-model="searchItem.warehouseId" clearable placeholder="请选择仓库">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>

              <vxe-button @click="_getPage" status="primary">搜索</vxe-button>
            </el-row>
          </template>
        </vxe-toolbar>
        <vxe-table border="inner" :align="allAlign" :data="storageList" :loading="loading">
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
           <vxe-table-column field="categpryName" title="分类"></vxe-table-column>
          <vxe-table-column field="itemName" title="商品名称"></vxe-table-column>
          <vxe-table-column field="itemCode" title="商品代码"></vxe-table-column>
          <vxe-table-column field="detailName" title="货物名称"></vxe-table-column>
          <vxe-table-column field="detailCode" title="货物代码"></vxe-table-column>
          <vxe-table-column field="warehouseName" title="所在仓库"></vxe-table-column>
          <vxe-table-column field="locationCode" title="货位编码"></vxe-table-column>
           <vxe-table-column field="storageNumber" title="库存数量"></vxe-table-column>
          <vxe-table-column field="storageUnit" title="存储单位"></vxe-table-column>
          <vxe-table-column field="storageWorning" title="库存告警值"></vxe-table-column>
          <!-- <vxe-table-column field="useFlg" title="使用状态" :formatter="fmtuseflg"></vxe-table-column> -->
          <vxe-table-column title="操作" width="240" fixed="right">
            <template v-slot="{ row }">
              <template>
                <vxe-button status="primary" @click="checkRowEvent(row)">查看货物详情</vxe-button>
              </template>
              <template>
                <vxe-button status="primary" @click="editRowEvent(row)">设置货位</vxe-button>
              </template>
              <!-- <template>
                <vxe-button status="primary" @click="editRowValue(row)">规格值管理</vxe-button>
              </template>
              <template>
                <vxe-button status="danger" @click="deleteRowEvent(row)">删除</vxe-button>
              </template> -->
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
  :visible.sync="dialogVisible"
  width="40%"
  :before-close="handleClose"
  center
  >
  <div class="itemcontainer">
    <div class="itemDetailtitle">
      <span>{{itemDetail.detailName}}参数、规格</span>
    </div>
      <el-divider content-position="left">规格</el-divider>
      <div class="itemdetailspceification">
        <vxe-table
          border="none"
          :align="allAlign"
          :data="itemAttrList"
          style="font-size:10px"
          :show-header="false"
          >
          <vxe-table-column field="propName" title="规格名称" align="right"></vxe-table-column>
          <vxe-table-column field="propValueVal" title="规格值"></vxe-table-column>
        </vxe-table>
      </div>
      <el-divider content-position="left">参数</el-divider>
      <div class="itemdetailspceification">
        <vxe-table
          border="none"
          :align="allAlign"
          :data="itemSpecList"
          style="font-size:10px"
          :show-header="false">
          <vxe-table-column field="specificationName" title="参数名称" align="right"></vxe-table-column>
          <vxe-table-column field="spceValueVal" title="参数值"></vxe-table-column>
        </vxe-table>
      </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

<el-dialog
  title="选择货位"
  :visible.sync="dialogVisible2"
  width="30%"
  :before-close="handleClose2">
  <div class="locationcontainer">
    <el-select v-model="storageItem.locationId" @change="getlocationCode" placeholder="请选择" style="width:100%">
    <el-option
      v-for="item in houselocationList"
      :key="item.locationId"
      :label="item.locationCode"
      :value="item.locationId">
    </el-option>
  </el-select>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible2 = false">取 消</el-button>
    <el-button type="primary" @click="confirmhouselocation" >确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>
<!-- TODO:搜索问题-->

<script>
import { mapGetters } from "vuex";
import {
  getChildCategoryListById,
  getCategoryById
} from "@/api/wms/category/category";
import { getWarehousePage } from "@/api/wms/warehouse/warehouse";
import { getStoragePageByAttributes,saveOrModifyStorage,setUpWarehouseLocation } from "@/api/wms/storage/storage";
import { getItemAttrPageByAttributes } from "@/api/wms/parameter/itemparameter";
import { getItemSpecPageByAttributes } from "@/api/wms/specification/itemspecification";
import { getWarehouseLocationPageByAttributes,saveOrModifyWarehouseLocation } from "@/api/wms/warehouselocation/warehouselocation";

export default {
  name: "SpecificationManage",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      allAlign: null,
      loading: false,
      storageInfo: {},
      storageList:[],
      searchItem: {},
      categoryList: [],
      choiceCategory: {},
      currentcategoryName: "",
      searchItem: {
        current: 1,
        size: 10,
        itemName: null,
        itemCode: null,
        detialName: null,
        detialCode: null,
        categoryId:null,
        warehouseId:null,
        storageType:"WMS_TYPE_REPLACE"
      },
      defaultProps: {
        checkStrictly: true,
        lazy: true,
        value: "categoryId",
        label: "categoryName",
        children: "children",
        lazyLoad: this._categoryLazyLoad
      },
      total: 0,
      warehouseList:[],
      tablePage:{
        current:1,
        size:100
      },
      itemDetail:{},
      itemAttrList:[],
      itemSpecList:[],
      dialogVisible:false,
      dialogVisible2:false,
      houselocationList:[],
      storageItem:{}
    };
  },
  async created() {
    this._getWarehousePage(this.tablePage)
    let params = {
      current:1,
      size:10,
      storageType:"WMS_TYPE_REPLACE"
    }
    this._getStoragePageByAttributes(params)

  },
  methods: {
    _getCategoryById(categoryId) {
      let categoryName = "";
      getCategoryById(categoryId).then(res => {
        if (res.status === 200) {
          categoryName = res.data.categoryName;
        }
      });
      return categoryName;
    },
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
    _getWarehousePage({ current, size }){
      getWarehousePage({ current, size }).then(res=>{
        if(res.status === 200){
          this.warehouseList = res.data.records
        }
      })
    },
    _getStoragePageByAttributes(params){
      getStoragePageByAttributes(params).then(res=>{
        if(res.status === 200){
          this.storageList = res.data.records
        }
      })
    },
    _getItemAttrPageByAttributes(params){
      getItemAttrPageByAttributes(params).then(res=>{
        if(res.status === 200){
          this.itemAttrList = res.data.records
        }
      })
    },
    _getItemSpecPageByAttributes(params){
      getItemSpecPageByAttributes(params).then(res=>{
        if(res.status === 200){
          this.itemSpecList = res.data.records
        }
      })
    },
    _getWarehouseLocationPageByAttributes(params,callback){
      getWarehouseLocationPageByAttributes(params).then(res=>{
        if(res.status === 200){
          callback(res)
        }
      })
    },
    _saveOrModifyWarehouseLocation(data){
      saveOrModifyWarehouseLocation(data).then(res=>{
        if(res.status === 200){
          this.$message({
          message: '修改成功！',
          type: 'success'
        });
        }
      })
    },
    _saveOrModifyStorage(data){
      saveOrModifyStorage(data).then(res=>{
        if(res.status === 200){
          this.$message({
          message: '修改成功！',
          type: 'success'
        });
        }
      })
    },
    _setUpWarehouseLocation(data,callback){
      setUpWarehouseLocation(data).then(res=>{
        if(res.status === 200){
          callback(res)
        }
      })
    },
    handleSearchCategorySelectChange(e) {
      if (e.length == 0) {
        this.searchItem.categoryId = null;
      } else {
        this.searchItem.categoryId = e[e.length - 1];
      }
    },
    _getPage() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        this._getStoragePageByAttributes(this.searchItem);
        this.loading = false;
        resolve();
      }).catch(err => {
        this.Loading = false;
        reject();
      });
    },
    checkRowEvent(data){
      this.itemDetail = {}
      this.itemSpecList = []
      this.itemAttrList = []
      this.itemDetail = data
      let params = {
        detailId:data.detailId
      }
      this._getItemAttrPageByAttributes(params)
      this._getItemSpecPageByAttributes(params)
      this.dialogVisible = true
      
    },
    editRowEvent(data){
      this.storageItem = data
      this.houselocationList = []
      let param = {
        warehouseId:data.warehouseId,
        useFlg:"0"
      }
      this._getWarehouseLocationPageByAttributes(param,resdata=>{
        this.houselocationList = resdata.data.records
      })
      this.dialogVisible2 = true
    },
    getlocationCode(){
      let item = this.houselocationList.find(item => item.locationId === this.storageItem.locationId)
      this.storageItem.locationCode = item.locationCode
    },
    confirmhouselocation(){
      this._setUpWarehouseLocation(this.storageItem,resdata=>{
        if(resdata.status === 200){
          this.$message({
          message: '仓位设置成功！',
          type: 'success'
        });
          this.dialogVisible2 = false
        }else{
          this.$message({
          message: '仓位设置失败！',
          type: 'warning'
        });
          this.dialogVisible2 = false
        }
      })
    },
     handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleClose2(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
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
  min-height: 500px;
}

.form-item {
  margin-bottom: 1px solid #dbdbdb;
}
.itemcontainer{
  /* border: 1px solid aqua; */
  min-height: 200px;
}
.itemDetailtitle{
  text-align: center;
  font-size: 24px;
  letter-spacing: 8px;
}
</style>
