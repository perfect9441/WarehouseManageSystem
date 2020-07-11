
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
          <el-input v-model.number="goodsData.goodsCommonPrice" placeholder="0.00">
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
          <template>
            <span>{{goodsData.categoryName}}</span>
          </template>
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

        <el-form-item label="商品简介">
          <el-input v-model="goodsData.goodsBrief" />
        </el-form-item>

        <el-form-item label="商品详细介绍">
          <editor :init="editorInit" v-model="goodsData.goodsDesc" />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitData" :loading="goodsSubmitBtnLoading">提交修改</el-button>
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
        <vxe-table-column title="图片" align="center">
          <template v-slot="{ row }">
            <img class="tableImage" v-if="row.detailImage" :src="imageDownLoadUrl+row.detailImage" />
            <el-tag v-if="!row.detailImage" type="info">无图片</el-tag>
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
        :loading="propTableLoading"
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
          <vxe-input v-model.number="goodsDetailEntity.storageNumber" type="integer" min="0"></vxe-input>
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
import Editor from "@tinymce/tinymce-vue";
import { getCategoryPageByAttributes } from "@/api/mall/category";
import { getSpecPageByAttributes } from "@/api/mall/spec";
import { getSpecValuePageByAttributes } from "@/api/mall/spec-value";
import { getPropValuePageByAttributes } from "@/api/mall/prop-value";
import { getPropPageByAttributes } from "@/api/mall/prop";
import { getBrandPageByAttributes } from "@/api/mall/brand";
import { getDictPageByAttributes } from "@/api/dict";
import {
  saveOrModifyGoods,
  getGoodsAndOthersByGoodsId,
  modifyGoodsDetail,
  removeGoodsResource,
  saveGoodsResource,
  saveGoodsAttrForGoods,
  removeGoodsAttrByGoodsIdAndPropValueId
} from "@/api/mall/goods";
import {
  getUploadImagePath,
  getDownLoadImagePath,
  uploadImageAndCrtThumbImage
} from "@/api/fastdfs";
import { _getDictMap } from "@/utils/my-utils";
import { getMerchantByUsername } from "@/api/mall/mer-admin";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["userInfo"])
  },
  name: "goodsPutaway",
  components: { Editor },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      imageDownLoadUrl: "",
      //商品图片

      //画廊图片

      goodsResourceList: [],
      uploadResImagefileList: [],
      //商品规格

      //商品详情
      goodsDetailList: [],
      goodsDetailData: {},
      showSetGoodsDetail: false,
      goodsDetailEntity: {},

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
      propTableLoading: false,

      //商品信息
      merchantList: [],
      goodsSubmitBtnLoading: false,
      formCateEdit: false,
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
          this.goodsSubmitBtnLoading = true;
          await saveOrModifyGoods(this.goodsData).then(res => {
            console.info("saveOrModifyGoods");
            console.info(res);
            if (res.data != null) {
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.goodsData.version = res.data.version;
            }
          });
          this.goodsSubmitBtnLoading = false;
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
        goodsId: this.goodsData.goodsId
      };
      saveGoodsResource(goodsResourceData).then(res => {
        console.info("saveGoodsResource");
        console.info(res);
        file.url = getDownLoadImagePath() + res.data.goresUrl;
        file.goresId = res.data.goresId;
      });
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
      // this.uploadResImagefileList = fileList;
      console.info(file);
      removeGoodsResource(file.goresId).then(res => {
        console.info("removeGoodsResource");
        console.info(res);
      });
    },
    handleResImageExceed(files, fileList) {
      console.info("handleImageExceed");
      this.$message({
        message: "封面图片仅可以上传9张",
        type: "warning"
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
    //商品参数
    handleAddProp() {
      this.resetPropData();
      this.showAddProp = true;
    },
    deletePropEvent(row) {
      console.info(row);
      removeGoodsAttrByGoodsIdAndPropValueId(
        this.goodsData.goodsId,
        row.propValueId
      ).then(res => {
        console.info("removeGoodsAttrByGoodsIdAndPropValueId");
        console.info(res);
        if (res.data) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          for (let i = 0; i < this.propDataList.length; i++) {
            if (this.propDataList[i]._XID == row._XID) {
              this.propDataList.splice(i, 1);
              break;
            }
          }
        }
      });
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
        this.$XModal.message({ message: "参数值已经存在", status: "warning" });
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
      saveGoodsAttrForGoods(this.goodsData.goodsId, this.propData).then(res => {
        console.info("saveGoodsAttrForGoods");
        console.info(res);
      });
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
      await modifyGoodsDetail(item).then(res => {
        console.info("modifyGoodsDetail");
        console.info(res);
        if (res.data != null) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          item.version = res.data.version;
          this.showSetGoodsDetail = false;
        }
      });
    },

    resetGoodsDetailData() {
      this.goodsDetailData = {
        specList: [],
        price: 0.0,
        storageNumber: 0
      };
    },

    //商品信息

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
    }
    // onUploadPicSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
  },
  async created() {
    console.info("this.userInfo");
    console.info(this.userInfo);
    this.imageDownLoadUrl = getDownLoadImagePath();
    await getMerchantByUsername(this.userInfo.username).then(res => {
      console.info("getMerchantByUsername");
      console.info(res);
      this.merchantList = res.data;
    });
    await getBrandPageByAttributes().then(res => {
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
    await getGoodsAndOthersByGoodsId(this.$route.params.id).then(res => {
      console.info("getGoodsAndOthersByGoodsId");
      console.info(res);
      this.goodsData = res.data.one;
      for (let i = 0; i < res.data.more1List.length; i++) {
        let goodsDetailData = {};
        goodsDetailData = res.data.more1List[i].one;
        goodsDetailData.specList = [];
        for (let w = 0; w < res.data.more1List[i].more2List.length; w++) {
          goodsDetailData.specList.push(res.data.more1List[i].more2List[w]);
        }
        this.goodsDetailList.push(goodsDetailData);
      }
      this.propDataList = res.data.more1List[0].more1List;

      for (let i = 0; i < res.data.more2List.length; i++) {
        let fileitem = {};
        fileitem.url = getDownLoadImagePath() + res.data.more2List[i].goresUrl;
        fileitem.goresId = res.data.more2List[i].goresId;
        this.uploadResImagefileList.push(fileitem);
      }
    });

    let propParams = {
      categoryId: this.goodsData.categoryId
    };
    getPropPageByAttributes(propParams).then(res => {
      console.info("getBrandPageByAttributes");
      console.info(res);
      this.propList = res.data.records;
    });
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