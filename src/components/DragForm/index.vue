<template>
  <div class="board-column">
    <div class="board-column-header">
      {{headerText}}
    </div>
    <draggable
      :list="list"
      @add='addCollection'
      @update='sortCollection'
      @clone="cloneCollection"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
    >
      <div v-for="(element,index) in list" :key="element.index" class="board-item" @click="onItemClick(element)">
        <template v-if="element.type==='input'">
          <div style="width:100%;display: flex;flex-direction: row;align-items: center">

            <span v-if="element.validate.required" style="color:red;margin-right: 10px;margin-left: 10px">*</span>
            <span v-if="!element.validate.required" style="margin-right: 10px;margin-left: 15px"></span>
            <span style="color:#606266;margin-right: 10px;margin-left: 10px;font-size: 15px;">{{element.title}}</span>
            <el-input :readonly="true" v-model="element.value" style="width:50%"></el-input>
          </div>
        </template>
        <template v-else-if="element.type==='radio'">
          <div style="width:100%;display: flex;flex-direction: row;align-items: center">

            <span style="color:#606266;margin-right: 10px;margin-left: 35px;font-size: 15px;">{{element.title}}</span>
            <el-radio-group v-model="element.value" :readonly="true">
              <el-radio :label="option.value" v-for="option in element.options">{{option.label}}</el-radio>
            </el-radio-group>
          </div>
        </template>
        <template v-else-if="element.type==='DatePicker'">
          <div style="width:100%;display: flex;flex-direction: row;align-items: center">

            <span style="color:#606266;margin-right: 10px;margin-left: 35px;font-size: 15px;">{{element.title}}</span>
            <el-date-picker
              v-model="element.value"
              :type="element.props.type"
              :format="element.props.format"
              :readonly="true"
            >
            </el-date-picker>
          </div>
        </template>


      </div>

    </draggable>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import {maker} from 'form-create/element'

  export default {
    name: 'DragKanbanDemo',
    components: {
      draggable
    },

    props: {
      headerText: {
        type: String,
        default: '表单'
      },
      options: {
        type: Object,
        default() {
          return {}
        }
      },
      list: {
        type: Array,
        default() {
          return []
        }
      },

    },
    methods: {
      onItemClick(item) {
        console.info('component--onItemClick')
        console.info(item)
        this.$emit('clickItem', item)
      },
      setData(dataTransfer) {
        // to avoid Firefox bug
        // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        dataTransfer.setData('Text', '')
      },
      addCollection(e) {
        this.$emit('add', e)
      },
      cloneCollection(e){
        this.$emit('clone', e)
      },
      sortCollection(e) {
        this.$emit('update', e)

      }
    }
  }
</script>
<style lang="scss" scoped>
  .board-column {
    min-width: 300px;
    min-height: 100px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;

    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #409EFF;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }

    .board-column-content {
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;

      .board-item {
        cursor: pointer;
        width: 100%;
        height: 64px;
        margin: 5px 0;
        background-color: #fff;
        text-align: left;
        line-height: 54px;
        padding: 5px 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>

