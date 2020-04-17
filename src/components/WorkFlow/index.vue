<template>


  <div>
    <div style="margin-top: 10px;margin-bottom: 30px;width:100%">



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



        <div style="font-weight: 700;margin-bottom: 10px" v-if="nextTaskItem.name">{{'下一节点：'+nextTaskItem.name}}</div>
        <div style="font-weight: 700;margin-bottom: 10px">选择处理人：</div>
        <template v-if="nextTaskItem.assignee!=null">
          <!-- 个人任务 -->
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
          <!--todo 部门升级级联选择器-->

        </template>
        <template v-else>
          <!-- 组任务 -->
        </template>





    </div>
  </div>


</template>

<script>
    export default {
        props:{
            comment:String,
            nextTaskItem:Object,
            assignOrgId:String,
            assignId:String,
            assignOrgList:Array,
            assignList:Array,
        },
        data() {
            return {}
        },
        methods:{
            onSelectAssignOrgChange(e){

                this.$emit('assignOrgChange',e)
            },
            onSelectAssignChange(e){

                this.$emit('assignChange',e)
            },

            onCommentInput(e){
                console.info('onCommentInput')
                this.$emit('onCommentInput',e)
            }
        },
    }
</script>

<style>

</style>
