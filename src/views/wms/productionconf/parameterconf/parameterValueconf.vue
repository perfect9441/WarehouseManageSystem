<template>
  <div style="margin:30px;">
    <div class="contettitle">{{parentprop.propName}}参数值设定</div>
    <el-container>
      <el-header class="button-bar" style="height:55px;">
        <el-row>
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" @click="addpage()">添加参数值</el-button>
          </el-col>
        </el-row>
      </el-header>
      <el-main class="content-bar">
        <vxe-toolbar :refresh="{query: reload}" custom></vxe-toolbar>
        <vxe-table border="inner" :align="allAlign" :data="propValueList">
          <vxe-table-column type="checkbox" width="60"></vxe-table-column>
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <vxe-table-column field="propValueVal" title="参数值"></vxe-table-column>
          <vxe-table-column field="propValueCode" title="参数值代码"></vxe-table-column>
          <vxe-table-column field="useFlg" title="使用状态" :formatter="fmtuseflg"></vxe-table-column>
          <vxe-table-column title="操作" width="380" fixed="right">
            <template v-slot="{ row }">
              <template>
                <vxe-button status="primary" @click="checkRowEvent(row)">查看详情</vxe-button>
              </template>
              <template>
                <vxe-button status="primary" @click="editRowEvent(row)">编辑</vxe-button>
              </template>
              <template>
                <vxe-button status="danger" @click="deleteRowEvent(row)">删除</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          :loading="loading"
          :current-page="tablePage.current"
          :page-size="tablePage.size"
          :total="tablePage.totalResult"
          :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
          @page-change="handlePageChange"
        ></vxe-pager>
      </el-main>
    </el-container>

    <el-dialog
      :title="dialogTitle"
      center
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <div class="dialog-context">
        <el-form ref="propValueInfo" :model="propValueInfo" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="参数值:">
                <el-input clearable size="small" v-model="propValueInfo.propValueVal" v-if="edit"></el-input>
                <span v-else>{{ propValueInfo.propValueVal }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参数值代码:">
                <el-input clearable size="small" v-model="propValueInfo.propValueCode" v-if="edit"></el-input>
                <span v-else>{{ propValueInfo.propValueCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="使用状态:">
                <el-select
                  v-if="edit"
                  clearable
                  v-model="propValueInfo.useFlg"
                  placeholder="请选择使用类型"
                >
                  <el-option
                    v-for="item in useFlg"
                    :label="item.dictName"
                    :value="item.dictCode"
                    :key="item.dictCode"
                  ></el-option>
                </el-select>
                <span v-else>{{ getuseflg(propValueInfo.useFlg) }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注:">
                <el-input
                  clearable
                  size="small"
                  v-model="propValueInfo.propValueText"
                  type="textarea1"
                  autosize
                  v-if="edit"
                ></el-input>
                <span v-else>{{ propValueInfo.propValueText }}</span>
              </el-form-item>
            </el-col>
            <div v-if="!edit">
              <el-col :span="12">
                <el-form-item label="创建人:">
                  <span>{{ propValueInfo.createUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间:">
                  <span>{{ propValueInfo.createTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新人:">
                  <span>{{ propValueInfo.updateUser }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="更新时间:">
                  <span>{{ propValueInfo.updateTime }}</span>
                </el-form-item>
              </el-col>
            </div>
          </el-row>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <div v-if="edit">
          <el-button @click="saveormodifypropvalueinfo">{{edittype}}信息</el-button>
          <el-button @click="dialogVisible = false">返回</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<!-- TODO:搜索问题-->

<script>
import { mapGetters } from "vuex";
import {
  getPropValuePageByAttributes,
  removePropValue,
  saveOrModifyPropValue
} from "@/api/wms/parameter/parametervalue";
import { getPropById } from "@/api/wms/parameter/parameter";
import { getDictPageByAttributes } from "@/api/dict";

export default {
  name: "parameterValueconf",
  computed: {
    ...mapGetters(["name"])
  },
  data() {
    return {
      allAlign: null,
      loading: false,
      tablePage: {
        current: 1,
        size: 10,
        total: 0
      },
      propValueList: [],
      useFlg: [],
      Classify: [],
      dialogVisible: false,
      propValueInfo: {},
      searchItem: {},
      dialogTitle: "查看详情",
      edit: true,
      edittype: "",
      innerVisible: false,
      defaultProps: {
        children: "children",
        label: "categoryName"
      },
      choiceCategory: {},
      currentcategoryName: "",
      parentprop: {},
      propId: ""
    };
  },
  async created() {
    this.propId = this.$route.params.id;
    let params1 = {
      dictType: "wms_useflg"
    };
    let params2 = {
      dictType: "org_classify"
    };
    await this._getDictPageByAttributes_useflg(params1);
    await this._getDictPageByAttributes_classify(params2);
    await this._getPropById(this.propId);
    await setTimeout(() => {
      let param = {
        propId: this.propId,
        current: this.tablePage.current,
        size: this.tablePage.size
      };
      this._getPropValuePageByAttributes(param);
    }, 500);
  },
  methods: {
    handlePageChange({ current, size }) {
      this.tablePage.current = current;
      this.tablePage.size = size;
      this.findList();
    },
    _getPropValuePageByAttributes(data) {
      getPropValuePageByAttributes(data).then(res => {
        if (res.status === 200) {
          this.propValueList = res.data.records;
        }
      });
    },
    _getDictPageByAttributes_useflg(params) {
      getDictPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.useFlg = res.data.records;
        }
      });
    },
    _getDictPageByAttributes_classify(params) {
      getDictPageByAttributes(params).then(res => {
        if (res.status === 200) {
          this.Classify = res.data.records;
        }
      });
    },
    _removePropValue(propId) {
      removePropValue(propId).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      });
    },
    _saveOrModifyPropValue(data) {
      saveOrModifyPropValue(data).then(res => {
        if (res.status === 200) {
          this.$message({
            message: "数据上传成功",
            type: "success"
          });
        }
        setTimeout(() => {
          this.edittype = "添加";
          this.dialogVisible = false;
          let param = {
            propId: this.parentprop.propId,
            current: this.tablePage.current,
            size: this.tablePage.size
          };
          this._getPropValuePageByAttributes(param);
        }, 1000);
      });
    },
    _getPropById(propId) {
      getPropById(propId).then(res => {
        if (res.status === 200) {
          this.parentprop = res.data;
        }
      });
    },
    reload() {
      return new Promise(resolve => {
        setTimeout(() => {
          let param = {
            propId: this.parentprop.propId,
            current: this.tablePage.current,
            size: this.tablePage.size
          };
          this._getPropValuePageByAttributes(param);
          resolve(this.propValueList);
        }, 300);
      });
    },
    addpage() {
      this.propValueInfo = {};
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "添加";
      this.currentcategoryName = "选择分类";
      this.propValueInfo.propId = this.parentprop.propId;
      this.propValueInfo.propName = this.parentprop.propName;
      this.propValueInfo.categoryId = this.parentprop.categoryId;
      this.propValueInfo.categoryName = this.parentprop.categoryName;
    },
    saveormodifypropvalueinfo() {
      this.edit = false;
      this._saveOrModifyPropValue(this.propValueInfo);
    },
    getclassify(data) {
      if (data) {
        for (var i = 0; i < this.Classify.length; i++) {
          if (this.Classify[i].dictCode === data) {
            return this.Classify[i].dictName;
          }
        }
      }
    },
    getuseflg(data) {
      if (data) {
        for (var i = 0; i < this.useFlg.length; i++) {
          if (this.useFlg[i].dictCode === data) {
            return this.useFlg[i].dictName;
          }
        }
      }
    },
    fmtuseflg({ cellValue }) {
      let item = this.useFlg.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    fmthouseClassify({ cellValue }) {
      let item = this.Classify.find(item => item.dictCode === cellValue);
      return item ? item.dictName : "";
    },
    editRowEvent(row) {
      this.propValueInfo = {};
      this.propValueInfo = row;
      this.dialogVisible = true;
      this.edit = true;
      this.edittype = "修改";
    },
    checkRowEvent(row) {
      this.propValueInfo = {};
      this.propValueInfo = row;
      this.dialogVisible = true;
      this.edit = false;
    },
    deleteRowEvent(row) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this._removePropValue(row.propId);
          setTimeout(() => {
            let param = {
              propId: this.parentprop.propId,
              current: this.tablePage.current,
              size: this.tablePage.size
            };
            this._getPropValuePageByAttributes(param);
          }, 1000);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleClose(done) {
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
  height: 500px;
}

.form-item {
  margin-bottom: 1px solid #dbdbdb;
}
.contettitle {
  height: 60px;
  line-height: 60px;
  font-size: 30px;
  text-align: center;
  letter-spacing: 8px;
  color: rgb(0, 70, 199);
}
</style>
