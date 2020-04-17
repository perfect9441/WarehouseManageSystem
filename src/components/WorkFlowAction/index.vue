<template>


  <div style="margin-top: 10px;margin-bottom: 30px;width:100%" v-if="outComeList && outComeList.length>0">

    <div style="margin-bottom: 30px;width:100%" >
      <el-radio-group :value="chooseOutCome"  @input="onChooseOutComeChange" >
        <el-radio  v-for="(item,index) in outComeList" :key="index" :label="item.label">{{item.outComeLine}}</el-radio>
      </el-radio-group>
    </div>

    <div style="margin-bottom: 30px;width:100%">
      <div style="font-weight: 700;margin-bottom: 10px">处理意见：</div>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入处理意见"
        :value="comment"
        @input="onCommentInput"
      >
      </el-input>
    </div>

    <template v-if="nextTaskItem">
      <div style="font-weight: 700;margin-bottom: 10px">{{'下一节点：'+nextTaskItem.targetFlowElement.name}}</div>

      <template v-if="nextTaskItem.targetFlowElementType=='USERTASK'">


        <template v-if="nextTaskItem.targetFlowElement.loopCharacteristics">
          <!-- 会签任务 -->

        </template>

        <template v-else-if="nextTaskItem.targetFlowElement.assignee!=null">
          <!-- 个人任务 -->
          <div style="font-weight: 700;margin-bottom: 10px">选择处理人：</div>

          <el-select filterable :value="assignOrgId" placeholder="选择处理人部门"
                     @change="onSelectAssignOrgChange">
            <el-option
              v-for="item in assignOrgList"
              :key="item.orgId"
              :label="item.orgName"
              :value="item.orgId">
            </el-option>
          </el-select>
          <el-select filterable :value="assignId" placeholder="选择处理人"
                     @change="onSelectAssignChange">
            <el-option
              v-for="item in assignList"
              :key="item.adminId"
              :label="item.empname"
              :value="item.adminId">
            </el-option>
          </el-select>


        </template>

        <template v-else>
          <!-- 组任务 -->
        </template>



      </template>
      <template v-else-if="nextTaskItem.targetFlowElementType=='GATEWAY'">
        <!-- 网关 -->
        <template >
          <!--TODO 网关暂不处理，在程序中定制化处理，尽量在后处理器中进行处理 -->
        </template>
      </template>
      <template v-else-if="nextTaskItem.targetFlowElementType=='ENDEVENT'">
        <!-- 结束节点 -->

      </template>
    </template>

  </div>


</template>

<script>
    export default {
        watch:{
            outComeList: function (e) {
                console.info('outComeList')
                console.info(this.outComeList)
                // console.info('chooseOutCome')
                // console.info(e)
                // if (this.chooseOutCome) {
                //     this.nextTaskItem = this.outComeList.filter(item => {
                //         return item.label == e
                //     })[0]
                // }
                // this.submitItem = {
                //     assignee: undefined,
                // }
            },
        },
        props: {
            comment: String,
            chooseOutCome: String,
            outComeList: Array,
            nextTaskItem: Object,
            assignOrgId: String,
            assignId: String,
            assignOrgList: Array,
            assignList: Array,
        },
        data() {
            return {
                componentOutComeList:[],
            }
        },
        methods: {
            onSelectAssignOrgChange(e) {

                this.$emit('assignOrgChange', e)
            },
            onSelectAssignChange(e) {

                this.$emit('assignChange', e)
            },
            onChooseOutComeChange(e) {

                this.$emit('outComeChange', e)
            },
            onCommentInput(e) {
                console.info('onCommentInput')
                this.$emit('onCommentInput', e)
            }
        },
        created() {
           //  console.info('onWorkFlowActionCreated')
           //  console.info('outComeList--onLoad')
           //  console.info(this.outComeList)
           // this.componentOutComeList=this.$lodash.cloneDeep(this.outComeList)
           //  console.info('componentOutComeList--onLoad')
           //  console.info(this.componentOutComeList)
        }
    }
</script>

<style>

</style>
