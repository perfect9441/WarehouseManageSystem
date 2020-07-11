<template>
  <div style="margin:30px;">
    <div class="contettitle">{{detailInfo.detailName}}--参数、规格管理</div>
    <div class="container">
      <div class="propsetting">
        <div class="proptitle">货物参数设定</div>
        <div class="propcontent">
          <vxe-toolbar custom>
            <template v-slot:buttons>
              <vxe-button @click="addNewPropValue">新增参数</vxe-button>
            </template>
          </vxe-toolbar>
          <vxe-table
            border
            show-header-overflow
            show-overflow
            highlight-hover-row
            :align="allAlign1"
            :data="selectPropValueList"
          >
            <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="propName" title="参数名称"></vxe-table-column>
            <vxe-table-column field="propValueVal" title="参数值"></vxe-table-column>
            <vxe-table-column title="操作" width="100" show-overflow>
              <template v-slot="{ row }">
                <vxe-button type="button" status="danger" @click="handleDeletePropEvent(row)">删除参数</vxe-button>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <!-- <div class="propbutton">
          <el-button type="primary" @click="saveOrModifyItemProp">确定</el-button>
        </div> -->
      </div>
      <div class="specsetting">
        <div class="proptitle">货物规格设定</div>
        <div class="propcontent">
          <vxe-toolbar custom>
            <template v-slot:buttons>
              <vxe-button @click="addNewSpecValue">新增规格</vxe-button>
            </template>
          </vxe-toolbar>
          <vxe-table
            border
            show-header-overflow
            show-overflow
            highlight-hover-row
            :align="allAlign2"
            :data="selectSpecValueList"
          >
            <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
            <vxe-table-column field="specificationName" title="规格名称"></vxe-table-column>
            <vxe-table-column field="spceValueVal" title="规格值"></vxe-table-column>
            <vxe-table-column title="操作" width="100" show-overflow>
              <template v-slot="{ row }">
                <vxe-button type="button" status="danger" @click="handleDeleteSpecEvent(row)">删除规格</vxe-button>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <!-- <div class="propbutton">
          <el-button type="primary">确定</el-button>
        </div> -->
      </div>
    </div>

    <el-dialog
      title="新增货物参数"
      :visible.sync="dialogVisible1"
      width="30%"
      :before-close="handleClose1"
    >
      <div class="propfdialog">
        <el-form ref="addNewPropItem" :model="addNewPropItem" label-width="140px">
          <el-form-item label="选择参数">
            <el-select v-model="addNewPropItem.propId" @change="getpropValue" placeholder="请选择参数">
              <el-option
                v-for="item in PropList"
                :key="item.propId"
                :label="item.propName"
                :value="item.propId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择参数值">
            <el-select v-model="addNewPropItem.propValueId" placeholder="请选择参数值">
              <el-option
                v-for="item in PropValueList"
                :key="item.propValueId"
                :label="item.propValueVal"
                :value="item.propValueId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addPropItem">添加参数</el-button>
            <el-button @click="canclePropItem">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog
      title="新增货物规格"
      :visible.sync="dialogVisible2"
      width="30%"
      :before-close="handleClose2"
    >
      <div class="propfdialog">
        <el-form ref="addNewSpecItem" :model="addNewSpecItem" label-width="140px">
          <el-form-item label="选择规格">
            <el-select v-model="addNewSpecItem.specificationId" @change="getspecValue" placeholder="请选择规格">
              <el-option
                v-for="item in SpecList"
                :key="item.specificationId"
                :label="item.specificationName"
                :value="item.specificationId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择规格值">
            <el-select v-model="addNewSpecItem.specValueId" placeholder="请选择规格值">
              <el-option
                v-for="item in SpecValueList"
                :key="item.specValueId"
                :label="item.specValueVal"
                :value="item.specValueId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addSpecItem">添加规格</el-button>
            <el-button @click="cancleSpecItem">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
        </div>

    </div>
  </div>
</template>
<!-- TODO:搜索问题-->

<script>
import { mapGetters } from "vuex";
import { getItemDetailById } from "@/api/wms/goods/goodsdetial";
import { getPropPageByAttributes } from "@/api/wms/parameter/parameter";
import { getPropValuePageByAttributes } from "@/api/wms/parameter/parametervalue";
import {
  getItemAttrPageByAttributes,
  saveOrModifyItemAttr,
  removeItemAttr
} from "@/api/wms/parameter/itemparameter";
import { getSpecificationPageByAttributes } from "@/api/wms/specification/specification";
import { getSpecificationValuePageByAttributes } from "@/api/wms/specification/specificationvalue";
import {
  getItemSpecPageByAttributes,
  saveOrModifyItemSpec,
  removeItemSpec
} from "@/api/wms/specification/itemspecification";
export default {
  name: "itemDetialPropconf",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      detailId: "",
      allAlign1: null,
      allAlign2: null,
      detailInfo: {},
      PropList: [],
      PropValueList: [],
      selectPropValueList: [],
      SpecList: [],
      SpecValueList: [],
      selectSpecValueList: [],
      addNewPropItem: {},
      addNewSpecItem: {},
      dialogVisible1: false,
      dialogVisible2: false
    };
  },

  async created() {
    this.detailId = this.$route.params.id;
    await this._getItemDetailById(this.detailId);
    let param = {
      detailId: this.detailId
    };
    await this._getItemAttrPageByAttributes(param);
    await this._getItemSpecPageByAttributes(param);
  },
  methods: {
    _getItemDetailById(detailId) {
      getItemDetailById(detailId).then(res => {
        if (res.status === 200) {
          this.detailInfo = res.data;
        }
      });
    },
    _getPropPageByAttributes(params) {
      getPropPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.PropList = res.data.records;
        }
      });
    },
    _getPropValuePageByAttributes(params) {
      getPropValuePageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.PropValueList = res.data.records;
        }
      });
    },
    _getItemAttrPageByAttributes(params) {
      getItemAttrPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.selectPropValueList = res.data.records;
        }
      });
    },
    _getSpecificationPageByAttributes(params) {
      getSpecificationPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.SpecList = res.data.records;
        }
      });
    },
    _getSpecificationValuePageByAttributes(params) {
      getSpecificationValuePageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.SpecValueList = res.data.records;
        }
      });
    },
    _getItemSpecPageByAttributes(params) {
      getItemSpecPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.selectSpecValueList = res.data.records;
        }
      });
    },
    _saveOrModifyItemAttr(data) {
      saveOrModifyItemAttr(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据保存成功！",
            type: "success"
          });
        }
      });
    },
    _removeItemAttr(itemAttrId) {
      removeItemAttr(itemAttrId).then(res => {
        if (res.status === 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }
      });
    },
    _saveOrModifyItemSpec(data) {
      saveOrModifyItemSpec(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据保存成功！",
            type: "success"
          });
        }
      });
    },
    _removeItemSpec(itemSpecId){
      removeItemSpec(itemSpecId).then(res=>{
        if(res.status === 200){
           this.$message({
            message: "删除成功!",
            type: "success"
          });
        }
      })
    },
    // 参数删除操作
    handleDeletePropEvent(row) {
      console.info(row);
    },
    // 保存参数操作
    saveOrModifyItemProp() {
      // this.selectPropValueList
    },
    // 新增参数操作
    addNewPropValue() {
      let params = {
        categoryId: this.detailInfo.categoryId
      };
      this._getPropPageByAttributes(params);
      this.addNewPropItem = {};
      this.dialogVisible1 = true;
    },
    addNewSpecValue() {
      let params = {
        categoryId: this.detailInfo.categoryId
      };
      this._getSpecificationPageByAttributes(params);
      this.addNewSpecItem = {};
      this.dialogVisible2 = true;
    },
    // 获得参数值
    getpropValue() {
      for (var i = 0; i < this.PropList.length; i++) {
        if (this.addNewPropItem.propId === this.PropList[i].propId) {
          this.addNewPropItem.propName = this.PropList[i].propName;
        }
      }
      let params = {
        propId: this.addNewPropItem.propId
      };
      this._getPropValuePageByAttributes(params);
    },
    // 获得规格值
    getspecValue() {
      for (var i = 0; i < this.SpecList.length; i++) {
        if (this.addNewSpecItem.specificationId === this.SpecList[i].specificationId) {
          this.addNewSpecItem.specificationName = this.SpecList[i].specificationName;
        }
      }
      let params = {
        specificationId: this.addNewSpecItem.specificationId
      };
      this._getSpecificationValuePageByAttributes(params);
    },
    // 添加参数
    addPropItem() {
      for (var i = 0; i < this.PropValueList.length; i++) {
        if (
          this.addNewPropItem.propValueId === this.PropValueList[i].propValueId
        ) {
          this.addNewPropItem.propValueVal = this.PropValueList[i].propValueVal;
        }
      }
      this.addNewPropItem.detailId = this.detailInfo.detailId;
      this.addNewPropItem.categoryId = this.detailInfo.categoryId;
      this.addNewPropItem.categoryName = this.detailInfo.categoryName;
      this._saveOrModifyItemAttr(this.addNewPropItem);
      setTimeout(() => {
        let params = {
          detailId: this.detailId
        };
        this._getItemAttrPageByAttributes(params);
      }, 500);
      this.dialogVisible1 = false;
    },
    // 添加规格
    addSpecItem() {
      for (var i = 0; i < this.SpecValueList.length; i++) {
        if (
          this.addNewSpecItem.specValueId === this.SpecValueList[i].specValueId
        ) {
          this.addNewSpecItem.spceValueVal = this.SpecValueList[i].specValueVal;
        }
      }
      this.addNewSpecItem.detailId = this.detailInfo.detailId;
      this.addNewSpecItem.categoryId = this.detailInfo.categoryId;
      this.addNewSpecItem.categoryName = this.detailInfo.categoryName;
      this._saveOrModifyItemSpec(this.addNewSpecItem);
      setTimeout(() => {
        let params = {
          detailId: this.detailId
        };
        this._getItemSpecPageByAttributes(params);
      }, 500);
      this.dialogVisible2 = false;
    },
    // 取消添加参数
    canclePropItem() {
      this.dialogVisible1 = false;
      this.addNewPropItem = {};
    },
    // 取消规格操作
    cancleSpecItem() {
      this.dialogVisible2 = false;
      this.addNewSpecItem = {};
    },
    // 删除参数操作
    handleDeletePropEvent(row) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this._removeItemAttr(row.itemAttrId)
        setTimeout(() => {
        let params = {
          detailId: this.detailId
        };
        this._getItemAttrPageByAttributes(params);
      }, 500);
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      
    },
    // 删除规格操作
     handleDeleteSpecEvent(row) {
      this.$confirm("此操作将永久删除该规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this._removeItemSpec(row.itemSpecId)
        setTimeout(() => {
        let params = {
          detailId: this.detailId
        };
        this._getItemSpecPageByAttributes(params);
      }, 500);
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      
    },
    // 模态框1关闭
    handleClose1(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 模态框2关闭
    handleClose2(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style scope>
.contettitle {
  height: 60px;
  line-height: 60px;
  font-size: 30px;
  text-align: center;
  letter-spacing: 8px;
  color: rgb(0, 70, 199);
}
.container {
  background-color: rgb(240, 238, 238);
  min-height: 500px;
  border-radius: 10px;
}
.propsetting {
  width: 49%;
  float: left;
  padding: 10px;
}
.specsetting {
  width: 49%;
  float: right;
  padding: 10px;
}
.proptitle {
  height: 60px;
  line-height: 60px;
  text-align: center;
  letter-spacing: 8px;
  font-size: 30px;
}
.propbutton {
  margin: 10px;
  text-align: center;
}
</style>
