
<template>
  <div class="app-container">
    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="goodsDataForm" :rules="rules" :model="goodsData" label-width="150px">
        <el-form-item label="商品编号" prop="goodsCode">
          <el-input v-model="goodsData.goodsCode" />
        </el-form-item>
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="goodsData.goodsName" />
        </el-form-item>
        <el-form-item label="市场售价" prop="goodsCommonPrice">
          <el-input v-model.number="goodsData.goodsCommonPrice">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否新品" prop="newFlag">
          <el-radio-group v-model="goodsData.newFlag">
            <el-radio
              v-for="(item,index) in goodsNewFlagList"
              :key="index"
              :label="item.dictCode"
            >{{item.dictName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否热卖" prop="hotFlag">
          <el-radio-group v-model="goodsData.hotFlag">
            <el-radio
              v-for="(item,index) in goodsHotFlagList"
              :key="index"
              :label="item.dictCode"
            >{{item.dictName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否在售" prop="goodsState">
          <el-radio-group v-model="goodsData.goodsState">
            <el-radio
              v-for="(item,index) in goodsStateList"
              :key="index"
              :label="item.dictCode"
            >{{item.dictName}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="商品图片">
          <el-upload
            :action="action()"
            :show-file-list="false"
            :on-success="onUploadPicSuccess"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
            :before-upload="beforePicUpload"
            name="image-file"
          >
            <img
              v-if="goodsData.goodsImages"
              :src="imageDownLoadUrl+goodsData.goodsImages"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

        <el-form-item label="宣传画廊">
          <el-upload
            :action="action()"
            list-type="picture-card"
            :on-preview="handleResImagePreview"
            name="image-file"
            :file-list="uploadResImagefileList"
            :before-upload="beforeResImageFileUpload"
            :on-success="handleOnResImageUploadSuccess"
            :on-error="handleOnResImageUploadError"
            :before-remove="beforeResImageRemove"
            :on-remove="handleResImageRemove"
            :auto-upload="true"
            :on-exceed="handleResImageExceed"
            :limit="9"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="商品单位">
          <el-input v-model="goodsData.goodsUnit" placeholder="件 / 个 / 盒" />
        </el-form-item>

        <!-- <el-form-item label="关键字">
          <el-tag v-for="tag in keywords" :key="tag" closable type="primary" @close="handleClose(tag)">
            {{ tag }}
          </el-tag>
          <el-input
            v-if="newKeywordVisible"
            ref="newKeywordInput"
            v-model="newKeyword"
            class="input-new-keyword"

            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-keyword" type="primary" @click="showInput">+ 增加</el-button>
        </el-form-item>-->

        <el-form-item label="所属分类">
          <el-cascader
            :props="cateCascaderProps"
            @change="handleCategoryChange"
            :options="categoryList"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="所属品牌商">
          <el-select v-model="goodsData.brandId" clearable @change="handleBrandChange">
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="所属门店" prop="merchantId">
          <el-select v-model="goodsData.merchantId">
            <el-option
              v-for="item in merchantList"
              :key="item.merchantId"
              :label="item.merchantName"
              :value="item.merchantId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品简介">
          <el-input v-model="goodsData.goodsBrief" />
        </el-form-item>

        <el-form-item label="商品详细介绍">
          <editor :init="editorInit" v-model="goodsData.goodsDesc" />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card" style="margin-top:10px">
      <h3>商品规格</h3>
      <vxe-button
        :status="goodsData.categoryId!=null? 'primary':'info'"
        :disabled="goodsData.categoryId==null"
        @click="handleAddSpec"
      >{{goodsData.categoryId!=null?'添加':'请选择商品类目'}}</vxe-button>

      <vxe-table
        style="margin-top:10px"
        ref="xSpecTable"
        border
        show-header-overflow
        show-overflow
        highlight-hover-row
        max-height="500"
        :data="specDataList"
        :loading="specTableLoading"
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="specificationName" title="规格名称"></vxe-table-column>
        <vxe-table-column field="specValueVal" title="规格值"></vxe-table-column>
        <vxe-table-column title="操作" width="200">
          <template v-slot="{ row }">
            <vxe-button @click="deleteSpecEvent(row)" status="danger">删除</vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>

    <el-card class="box-card" style="margin-top:10px">
      <h3>商品库存</h3>
      <vxe-table
        style="margin-top:10px"
        ref="xGoodsDetailTable"
        border
        show-header-overflow
        show-overflow
        highlight-hover-row
        max-height="500"
        :data="goodsDetailList"
        :loading="specTableLoading"
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column title="货品规格">
          <template v-slot="{ row }">
            <span v-for="(item,index) in row.specList" :key="index" style="margin-right:5px">
              <el-tag>{{item.specValueVal}}</el-tag>
            </span>
          </template>
        </vxe-table-column>

        <vxe-table-column field="price" title="价格"></vxe-table-column>
        <vxe-table-column field="storageNumber" title="库存"></vxe-table-column>
        <vxe-table-column  title="图片" align="center">
          <template v-slot="{ row }">
             <img
              class="tableImage"
              v-if="row.detailImage"
              :src="imageDownLoadUrl+row.detailImage"
               mode="aspectFill"
            />
             <el-tag  v-if="!row.detailImage" type="info">无图片</el-tag>

          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" width="200">
          <template v-slot="{ row }">
            <vxe-button @click="setGoodsDetailEvent(row)" status="primary">设置</vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>

    <el-card class="box-card" style="margin-top:10px">
      <h3>商品参数</h3>
      <vxe-button
        :status="goodsData.categoryId!=null? 'primary':'info'"
        :disabled="goodsData.categoryId==null"
        @click="handleAddProp"
      >{{goodsData.categoryId!=null?'添加':'请选择商品类目'}}</vxe-button>

      <vxe-table
        style="margin-top:10px"
        ref="xPropTable"
        border
        show-header-overflow
        show-overflow
        highlight-hover-row
        max-height="500"
        :data="propDataList"
        :loading="specTableLoading"
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="propName" title="参数名称"></vxe-table-column>
        <vxe-table-column field="propValueVal" title="参数值"></vxe-table-column>
        <vxe-table-column title="操作" width="200">
          <template v-slot="{ row }">
            <vxe-button @click="deletePropEvent(row)" status="danger">删除</vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>
    <el-card class="box-card" style="margin-top:10px">
      <template v-if="canISubmit">
        <el-button type="primary" @click="submitData" :loading="submitBtnLoading">提交上架</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click="gotoEdit">继续编辑</el-button>
      </template>
    </el-card>
    <vxe-modal v-model="showAddSpec" title="添加规格" width="800" resize destroy-on-close lock-view>
      <vxe-form
        ref="xSpecForm"
        :data="specData"
        :rules="specValidRules"
        title-align="right"
        title-width="100"
        @submit="submitSpecEvent"
      >
        <vxe-form-item title="选择规格" span="24" field="specId">
          <vxe-select
            clearable
            v-model="specData.specId"
            placeholder="请选择"
            @change="onAddSpecSpecChange"
          >
            <vxe-option
              v-for="(item,index) in specList"
              :key="index"
              :value="item.specId"
              :label="item.specificationName"
            ></vxe-option>
          </vxe-select>
        </vxe-form-item>
        <vxe-form-item title="选择规格值" span="24" field="specValueId">
          <vxe-select clearable v-model="specData.specValueId" placeholder="请选择">
            <vxe-option
              v-for="(item,index) in specValueList"
              :key="index"
              :value="item.specValueId"
              :label="item.specValueVal"
            ></vxe-option>
          </vxe-select>
        </vxe-form-item>
        
        <vxe-form-item align="center" span="24">
          <vxe-button type="submit" status="primary">提交</vxe-button>
        </vxe-form-item>
      </vxe-form>
    </vxe-modal>
    <vxe-modal v-model="showAddProp" title="添加参数" width="800" resize destroy-on-close lock-view>
      <vxe-form
        ref="xPropForm"
        :data="propData"
        :rules="propValidRules"
        title-align="right"
        title-width="100"
        @submit="submitPropEvent"
      >
        <vxe-form-item title="选择参数" span="24" field="propId">
          <vxe-select
            clearable
            v-model="propData.propId"
            placeholder="请选择"
            @change="onAddPropPropChange"
          >
            <vxe-option
              v-for="(item,index) in propList"
              :key="index"
              :value="item.propId"
              :label="item.propName"
            ></vxe-option>
          </vxe-select>
        </vxe-form-item>
        <vxe-form-item title="选择属性值" span="24" field="propValueId">
          <vxe-select clearable v-model="propData.propValueId" placeholder="请选择">
            <vxe-option
              v-for="(item,index) in propValueList"
              :key="index"
              :value="item.propValueId"
              :label="item.propValueVal"
            ></vxe-option>
          </vxe-select>
        </vxe-form-item>
        <vxe-form-item align="center" span="24">
          <vxe-button type="submit" status="primary">提交</vxe-button>
        </vxe-form-item>
      </vxe-form>
    </vxe-modal>

    <vxe-modal
      v-model="showSetGoodsDetail"
      title="设置价格库存"
      width="800"
      resize
      destroy-on-close
      lock-view
    >
      <vxe-form
        ref="xGoodsDetailForm"
        :data="goodsDetailEntity"
        :rules="goodsDetailValidRules"
        title-align="right"
        title-width="100"
        @submit="submitGoodsDetailEvent"
      >
        <vxe-form-item title="录入价格" span="24" field="price">
          <vxe-input v-model.number="goodsDetailEntity.price" clearable></vxe-input>
        </vxe-form-item>
        <vxe-form-item title="录入库存" span="24" field="storageNumber">
          <vxe-input v-model="goodsDetailEntity.storageNumber" type="integer" min="0"></vxe-input>
        </vxe-form-item>
        <vxe-form-item title="规格图片">
          <el-upload
            :action="action()"
            :show-file-list="false"
            :on-success="onUploadDetailPicSuccess"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
            :before-upload="beforeDetailPicUpload"
            name="image-file"
          >
            <img
              v-if="goodsDetailEntity.detailImage"
              :src="imageDownLoadUrl+goodsDetailEntity.detailImage"
              class="avatar"
                mode="aspectFill"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </vxe-form-item>
        <vxe-form-item align="center" span="24">
          <vxe-button type="submit" status="primary">提交</vxe-button>
        </vxe-form-item>
      </vxe-form>
    </vxe-modal>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import {
  getMerchantByUsername,
 
} from "@/api/mall/mer-admin";
import Editor from "@tinymce/tinymce-vue";
import { getCategoryPageByAttributes } from "@/api/mall/category";
import { getSpecPageByAttributes } from "@/api/mall/spec";
import { getSpecValuePageByAttributes } from "@/api/mall/spec-value";
import { getPropValuePageByAttributes } from "@/api/mall/prop-value";
import { getPropPageByAttributes } from "@/api/mall/prop";
import { getBrandPageByAttributes } from "@/api/mall/brand";
import { getDictPageByAttributes } from "@/api/dict";
import { saveOrModifyGoodsAndOthers } from "@/api/mall/goods";
import { getUploadImagePath, getDownLoadImagePath,uploadImageAndCrtThumbImage } from "@/api/fastdfs";
import { _getDictMap } from "@/utils/my-utils";
import { mapGetters } from "vuex";
export default {
  
  name: "goodsPutaway",
  components: { Editor },
   computed: {
    ...mapGetters(["userInfo"])
  },
  data() {
    return {
      submitBtnLoading:false,
      editId: "",
      canISubmit: true,
      dialogVisible: false,
      dialogImageUrl: "",
      imageDownLoadUrl: "",
      //商品图片

      //画廊图片

      goodsResourceList: [],
      uploadResImagefileList: [],
      //商品规格

      specList: [],
      specValueList: [],
      showAddSpec: false,
      specData: {},
      specDataList: [],
      specValidRules: {
        specId: [{ required: true, message: "规格必须选择" }],
        specValueId: [{ required: true, message: "规格值必须选择" }]
      },
      specTableLoading: false,

      //商品详情
      goodsDetailList: [],
      goodsDetailData: {},
      showSetGoodsDetail: false,
      goodsDetailEntity: {},
      goodsDetailOrigin: {},
      goodsDetailValidRules: {
        price: [{ required: true, message: "价格必须填写" }],
        storageNumber: [{ required: true, message: "库存必须填写" }]
      },
      //商品参数
      propList: [],
      propValueList: [],
      propDataList: [],
      propData: {},
      showAddProp: false,
      propValidRules: {
        propId: [{ required: true, message: "属性必须选择" }],
        propValueId: [{ required: true, message: "属性值必须选择" }]
      },

      //商品信息
      merchantList:[],
      goodsStateList: [],
      goodsHotFlagList: [],
      goodsNewFlagList: [],

      rules: {
        goodsCode: [
          { required: true, message: "请输入商品编号", trigger: "blur" }
        ],
        goodsName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goodsCommonPrice: [
          { required: true, message: "请输入市场价格", trigger: "blur" }
        ],
        newFlag: [
          { required: true, message: "请选择是否新品", trigger: "change" }
        ],
        hotFlag: [
          { required: true, message: "请选择是否热卖", trigger: "change" }
        ],
        goodsState: [
          { required: true, message: "请选择商品状态", trigger: "change" }
        ],
        merchantId: [
          { required: true, message: "请选择门店", trigger: "change" }
        ]
      },
      goodsData: {
        categoryId: null,
        goodsImages: null
      },
      uploadPath: "",
      categoryList: [],
      cateCacheList: [],
      brandList: [],
      cateCascaderProps: {
        checkStrictly: true,
        lazy: true,
        value: "categoryId",
        label: "categoryName",
        lazyLoad: this._cateLazyLoad
      },
      editorInit: {
        language: "zh_CN",
        height: 500,
        convert_urls: false,
        branding: false,
        plugins: [
          "advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount"
        ],
        toolbar: [
          "searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample",
          "hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen"
        ],
        images_upload_handler: function(blobInfo, success, failure) {
           console.info("blobInfo");
          console.info(blobInfo);
          uploadImageAndCrtThumbImage(blobInfo.blob(), blobInfo.filename())
            .then(res => {
              console.info("uploadImageAndCrtThumbImage");
              console.info(res);
              success(getDownLoadImagePath() + res.data.data);
            })
            .catch(err => {
              failure("上传失败，请重新上传");
            });
        }
      }
    };
  },
 
  watch: {},
  methods: {
    action() {
      return getUploadImagePath();
    },
    gotoEdit() {
      this.$router.push({
        name: "MallGoodsManagerGoodsEdit",
        params: { id: this.editId }
      });
    },
    submitData() {
      this.$refs["goodsDataForm"].validate(async valid => {
        if (valid) {
          if (!this.goodsData.goodsImages) {
            this.$message({
              message: "封面图片必须上传！",
              type: "warning"
            });
            return;
          }
          if (this.goodsDetailList.length == 0) {
            this.$message({
              message: "至少设置一条规格数据！",
              type: "warning"
            });
            return;
          }
          this.submitBtnLoading=true
          let data = {
            more1List: [],
            more2List: [],
            one: {}
          };
          for (let i = 0; i < this.goodsDetailList.length; i++) {
            let moreListItem = {
              one: {},
              more1List: [],
              more2List: []
            };
            moreListItem.one = this.goodsDetailList[i];
            moreListItem.more1List = this.propDataList;
            moreListItem.more2List = this.goodsDetailList[i].specList;
            data.more1List.push(moreListItem);
          }
          data.more2List = this.goodsResourceList;
          data.one = this.goodsData;
          console.info("data");
          console.info(data);
        await  saveOrModifyGoodsAndOthers(data).then(res => {
            console.info("saveGoodsAndOthers");
            console.info(res);
            //TODO:返回goodsId
            if (res.data != null) {
              this.$message({
                message: "商品上架成功",
                type: "success"
              });
              this.canISubmit = false;
              this.editId = res.data.goodsId;
            }
          });
           this.submitBtnLoading=false
        } else {
          return false;
        }
      });
    },
    //画廊图片

    handleResImagePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeResImageFileUpload(file) {
      console.info("beforeImageFileUpload");
      console.info(file);
      return new Promise((resolve, reject) => {
        if (file.size > 1048576) {
          this.$message({
            message: "图片大小不可大于1M",
            type: "warning"
          });
          reject();
        }
        resolve();
      });
    },
    handleOnResImageUploadSuccess(response, file, fileList) {
      console.info("handleOnImageUploadSuccess");
      console.info(file);
      console.info(response);
      let goodsResourceData = {
        goresUrl: response.data,
        uid: file.uid
      };
      this.goodsResourceList.push(goodsResourceData);
      console.info("this.goodsResourceList");
      console.info(this.goodsResourceList);
    },
    handleOnResImageUploadError(err, file, fileList) {
      console.info("handleOnImageUploadError");
      this.$message({
        message: err,
        type: "error"
      });
    },
    beforeResImageRemove(file, fileList) {
      return new Promise((resolve, reject) => {
        resolve();
      });
    },
    handleResImageRemove(file, fileList) {
      this.uploadResImagefileList = fileList;
      // if (file.uid) {
      //   //未保存数据库的数据
      // } else {
        
      // }
      for (let i = 0; i < this.goodsResourceList.length; i++) {
          if (this.goodsResourceList[i].uid == file.uid) {
            this.goodsResourceList.splice(i, 1);
            i--;
          }
        }
      console.info("this.goodsResourceList");
      console.info(this.goodsResourceList);
      // if (file.uid>10000000000000) {
      //   removeConfig(file.uid).then(res => {
      //     console.info("removeConfig");
      //     this.$message({
      //       type: "success",
      //       message: "删除成功!"
      //     });
      //   });
      // }
    },
    handleResImageExceed(files, fileList) {
      console.info("handleImageExceed");
      this.$message({
        message: "封面图片仅可以上传9张",
        type: "warning"
      });
    },
    //规格图片
    onUploadDetailPicSuccess(response, file, fileList) {
      console.info("onUploadDetailPicSuccess");
      console.info(file);
      console.info(response);

      this.goodsDetailEntity.detailImage = response.data;
    },
    beforeDetailPicUpload(file) {
      console.info("beforeDetailPicUpload");
      console.info(file);
      return new Promise((resolve, reject) => {
        if (file.size > 1048576) {
          this.$message({
            message: "图片大小不可大于1M",
            type: "warning"
          });
          reject();
        }
        resolve();
      });
    },
    //封面图片
    onUploadPicSuccess(response, file, fileList) {
      console.info("onUploadPicSuccess");
      console.info(file);
      console.info(response);

      this.goodsData.goodsImages = response.data;
    },
    beforePicUpload(file) {
      console.info("beforeImageFileUpload");
      console.info(file);
      return new Promise((resolve, reject) => {
        if (file.size > 1048576) {
          this.$message({
            message: "图片大小不可大于1M",
            type: "warning"
          });
          reject();
        }
        resolve();
      });
    },
    //商品规格

    handleAddSpec() {
      if(!this.goodsData.goodsName){
        this.$message({
          message:'请先输入商品名称',
          type:'error'
        })
        return
      }
      this.resetSpecData();
      this.showAddSpec = true;
    },
    resetSpecData() {
      this.specData = {
        specId: null,
        specificationName: null,
        specValueId: null,
        specValueVal: null
      };
    },

    resetSpecValueData() {
      this.specData.specValueId = null;
      this.specData.specValueVal = null;
    },
    onAddSpecSpecChange() {
      this.resetSpecValueData();

      let specValueParams = {
        specId: this.specData.specId
      };
      getSpecValuePageByAttributes(specValueParams).then(res => {
        console.info("getSpecValuePageByAttributes");
        this.specValueList = res.data.records;
      });
    },
    async submitSpecEvent() {
      let specValueTemp = this.specDataList.find(item => {
        return item.specValueId === this.specData.specValueId;
      });
      if (specValueTemp) {
        this.$XModal.message({ message: "规格值已经存在", status: "warning" });
        return;
      }

      const errMap = await this.$refs.xSpecForm
        .validate(this.specData)
        .catch(errMap => errMap);
      console.info(errMap);
      if (errMap) {
        return;
      }
      this.specData.specificationName = this.specList.find(item => {
        return item.specId == this.specData.specId;
      }).specificationName;
      this.specData.specValueVal = this.specValueList.find(item => {
        return item.specValueId == this.specData.specValueId;
      }).specValueVal;
      this.specDataList.push(this.specData);

      //添加商品详情
      this.refreshGoodsDetailList();

      this.showAddSpec = false;
    },
    deleteSpecEvent(row) {
      console.info(row);
      for (let i = 0; i < this.specDataList.length; i++) {
        if (this.specDataList[i]._XID === row._XID) {
          this.specDataList.splice(i, 1);
          break;
        }
      }
      // this.specDataList.push(this.specData);
      this.refreshGoodsDetailList();
    },
    //商品参数
    handleAddProp() {
      this.resetPropData();
      this.showAddProp = true;
    },
    deletePropEvent(row) {
      console.info(row);
      for (let i = 0; i < this.propDataList.length; i++) {
        if (this.propDataList[i]._XID === row._XID) {
          this.propDataList.splice(i, 1);
          break;
        }
      }
    },
    resetPropData() {
      this.propData = {
        propId: null,
        propName: null,
        propValueId: null,
        propValueVal: null
      };
    },

    resetPropValueData() {
      this.propData.propValueId = null;
      this.propData.propValueVal = null;
    },
    async submitPropEvent() {
      let propValueTemp = this.propDataList.find(item => {
        return item.propValueId === this.propData.propValueId;
      });
      if (propValueTemp) {
        this.$XModal.message({ message: "规格值已经存在", status: "warning" });
        return;
      }
      const errMap = await this.$refs.xPropForm
        .validate(this.propData)
        .catch(errMap => errMap);
      console.info(errMap);
      if (errMap) {
        return;
      }
      this.propData.propName = this.propList.find(item => {
        return item.propId == this.propData.propId;
      }).propName;
      this.propData.propValueVal = this.propValueList.find(item => {
        return item.propValueId == this.propData.propValueId;
      }).propValueVal;
      this.propDataList.push(this.propData);

      this.showAddProp = false;
    },
    onAddPropPropChange() {
      this.resetPropValueData();

      let peopValueParams = {
        propId: this.propData.propId
      };
      getPropValuePageByAttributes(peopValueParams).then(res => {
        console.info("getPropValuePageByAttributes");
        this.propValueList = res.data.records;
      });
    },

    //商品详情
    setGoodsDetailEvent(row) {
      console.info(row);

      this.goodsDetailEntity = this.$lodash.cloneDeep(row);
      this.showSetGoodsDetail = true;
    },
    async submitGoodsDetailEvent() {
      const errMap = await this.$refs.xGoodsDetailForm
        .validate(this.goodsDetailEntity)
        .catch(errMap => errMap);
      console.info(errMap);
      if (errMap) {
        return;
      }
      let item = this.goodsDetailList.find(item => {
        return item._XID === this.goodsDetailEntity._XID;
      });
      item.price = this.goodsDetailEntity.price;
      item.storageNumber = this.goodsDetailEntity.storageNumber;
      item.detailImage = this.goodsDetailEntity.detailImage;

      this.showSetGoodsDetail = false;
    },
    restoreRowData() {},
    resetGoodsDetailData() {
      this.goodsDetailData = {
        specList: [],
        price: 0.0,
        storageNumber: 0
      };
    },
    refreshGoodsDetailList() {
      this.goodsDetailList = [];

      //把规格数组中的内容分类拆解
      
      let specIdList = [];
      for (let i = 0; i < this.specDataList.length; i++) {
        if (specIdList.length == 0) {
          specIdList.push(this.specDataList[i].specId);
        } else {
          let id = specIdList.find(item => {
            return item == this.specDataList[i].specId;
          });
          if (!id) {
            specIdList.push(this.specDataList[i].specId);
          }
        }
      }
      console.info('specIdList')
      console.info(specIdList)
      let specTempList = [];
      for (let i = 0; i < specIdList.length; i++) {
        let item = {};
        item.specId = specIdList[i];
        item.specValueList = this.specDataList.filter(item => {
          return item.specId == specIdList[i];
        });
        specTempList.push(item);
      }

      //计算排列组合calculateCombination

      this.calculateCombination(specTempList, 0, []);
      // console.info("refreshGoodsDetailList");
      // console.info(this.goodsDetailList);
    },
    calculateCombination(inputList, beginIndex, outArray) {
      console.info('inputList')
      console.info(inputList)
      if(inputList.length==0){
        return
      }
      if (beginIndex == inputList.length) {
        let array = [];
        for (let i = 0; i < outArray.length; i++) {
          console.info(outArray[i]);
          array.push(outArray[i]);
        }

        // this.resetGoodsDetailData()
        let goodsDetailData = {
          price: 0.0,
          storageNumber: 0,
          detailImage:null,
          goodsName:this.goodsData.goodsName
        };
        goodsDetailData.specList = array;
        // goodsDetailData.specList = outArray;
        this.goodsDetailList.push(goodsDetailData);
        console.info("finish");
        return;
      }
      for (let i = 0; i < inputList[beginIndex].specValueList.length; i++) {
        outArray[beginIndex] = inputList[beginIndex].specValueList[i];
        this.calculateCombination(inputList, beginIndex + 1, outArray);
      }
    },

    //商品信息

    handleCategoryChange(e) {
      if (e.length == 0) {
        this.goodsData.categoryId = null;
        this.goodsData.categoryName = "";
      } else {
        this.goodsData.categoryId = e[e.length - 1];

        let crumbs = "";
        for (let i = 0; i < e.length; i++) {
          let temp = this.cateCacheList.find(item => {
            return item.categoryId === e[i];
          });

          crumbs = crumbs + "/" + temp.categoryName;
        }
        this.goodsData.categoryName = crumbs;
        console.info("this.goodsData");
        console.info(this.goodsData);
        //清空已有规格选项
        this.specDataList = [];
        this.specValueList = [];
        this.goodsDetailList = [];
        let specParams = {
          categoryId: this.goodsData.categoryId
        };
        getSpecPageByAttributes(specParams).then(res => {
          console.info("getSpecPageByAttributes");
          this.specList = res.data.records;
        });
        //清空已有参数选项
        this.propDataList = [];
        this.propValueList = [];
        let propParams = {
          categoryId: this.goodsData.categoryId
        };
        getPropPageByAttributes(propParams).then(res => {
          console.info("getBrandPageByAttributes");
          console.info(res);
          this.propList = res.data.records;
        });
      }
    },
    handleBrandChange(e) {
      // console.info(e)
      if (e) {
        this.goodsData.brandName = this.brandList.find(item => {
          return item.brandId === e;
        }).brandName;
      } else {
        this.goodsData.brandId = null;
        this.goodsData.brandName = null;
      }
      // console.info(this.goodsData.brandName)
    },
    // onUploadPicSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
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
    }
  },
  async created() {
    this.imageDownLoadUrl = getDownLoadImagePath();
  await  getBrandPageByAttributes().then(res => {
      console.info("getBrandPageByAttributes");
      console.info(res);
      this.brandList = res.data.records;
    });
    let dictGoodsStateParams = {
      dictType: "mall_goods_state"
    };
    await getDictPageByAttributes(dictGoodsStateParams).then(res => {
      this.goodsStateList = res.data.records;
    });
    let dictGoodsNewFlagParams = {
      dictType: "mall_goods_newflag"
    };
    await getDictPageByAttributes(dictGoodsNewFlagParams).then(res => {
      this.goodsNewFlagList = res.data.records;
    });
    let dictGoodsHotFlagParams = {
      dictType: "mall_goods_hotflag"
    };
    await getDictPageByAttributes(dictGoodsHotFlagParams).then(res => {
      this.goodsHotFlagList = res.data.records;
    });
    getMerchantByUsername(this.userInfo.username).then(res=>{
      this.merchantList=res.data
    })
  },
  mounted() {}
};
</script>
<style  scoped>
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload .avatar-uploader-icon:hover {
  border-color: #409eff;
  color: #409eff;
}
.avatar-uploader-icon {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.tableImage {
  width: 50px;
  height: 50px;
  margin-top: 5px;
}
</style>