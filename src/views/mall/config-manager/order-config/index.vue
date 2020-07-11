<!--  -->
<template>
  <div style="padding:10px">
    <h1 class="dashboard-text">订单配置管理</h1>
    <el-collapse v-model="activeNames" @change="handleCollapseChange">
      <el-collapse-item title="运费配置" name="deliveryCost">
        <vxe-table
          ref="xDelTable"
          border
          show-header-overflow
          show-overflow
          highlight-hover-row
          max-height="500"
          keep-source
          :data="deliveryConfigList"
          :loading="deliverytableLoading"
          :edit-rules="deliveryvalidRules"
          :edit-config="{trigger: 'manual', mode: 'row'}"
        >
          <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
          <vxe-table-column field="cfgDesc" title="描述"></vxe-table-column>
         
          <vxe-table-column
            field="paramValue"
            title="值"
            :edit-render="{name: 'input', attrs: {type: 'text'}}"
          ></vxe-table-column>

          <vxe-table-column title="操作" width="200">
            <template v-slot="{ row }">
              <template v-if="$refs.xDelTable.isActiveByRow(row)">
                <vxe-button @click="saveRowEvent(row,'xDelTable')">保存</vxe-button>
                <vxe-button @click="cancelRowEvent(row,'xDelTable')">取消</vxe-button>
              </template>
              <template v-else>
                <vxe-button icon="vxe-icon--edit-outline " @click="editRowEvent(row,'xDelTable')">编辑</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getConfigPageByAttributes, modifyConfig } from "@/api/config.js";
import { _getConfigMap } from "@/utils/my-utils.js";
export default {
  name: "OrderConfig",
  components: {},
  data() {
    return {
      activeNames: ["deliveryCost"],
      deliveryConfigList: [],
      deliveryConfigMap: {},
      deliverytableLoading: false,
      deliveryvalidRules: {
        paramValue: [{ required: true, message: "值必须填写" },{ type:'number', message: "值必须为数字" }]
      }
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleCollapseChange(e) {
      console.info(e);
    },
    _getConfigList(type) {
      return new Promise((resolve, reject) => {
        let param = {
          cfgType: type
        };
        getConfigPageByAttributes(param)
          .then(res => {
            resolve(res.data.records);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    //运费配置
    async saveRowEvent(row, table) {
      const errMap = await this.$refs[table]
        .validate(row)
        .catch(errMap => errMap);
      console.info(errMap);
      if (errMap) {
        return;
      }

      this.$refs[table].clearActived().then(() => {
        modifyConfig(row)
          .then(res => {
            console.info("modifyConfig");
            console.info(res);

            this.$XModal.message({ message: "保存成功！", status: "success" });
          })
          .catch(err => {
            this.$XModal.message({ message: "保存失败！", status: "error" });
          });
      });
    },
    cancelRowEvent(row, table) {
      const xTable = this.$refs[table];
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row);
      });
    },
    editRowEvent(row, table) {
      console.info(row);
      this.$refs[table].setActiveRow(row);
    }
  },
  async created() {
    this.deliverytableLoading = true;
    await this._getConfigList("mall_del_config")
      .then(res => {
        this.deliveryConfigList = res;
        this.deliveryConfigMap = _getConfigMap(this.deliveryConfigList);
      })
      .catch(err => {});
    this.deliverytableLoading = false;
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>