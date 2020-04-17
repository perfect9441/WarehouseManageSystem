<template>
  <div class="board-column">
    <div class="board-column-header">
      {{headerText}}
    </div>
    <draggable
      :list="list"
      v-bind="$attrs"
      class="board-column-content"
      :set-data="setData"
    >
      <div v-for="element in list" :key="element.id" class="board-item" style="font-size: 15px;color:#606266">
        {{ element.type | displayFilter}}
      </div>
    </draggable>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'DragKanbanDemo',
    components: {
      draggable
    },
    filters: {
      displayFilter(e) {
        switch(e) {
          case 'input':
            return '输入框'
            break;
          case 'radio':
            return '单选'
            break;
          case 'DatePicker':
            return '时间选择器'
            break;
          default :
            return '其他'
        }
      },

    },
    props: {
      headerText: {
        type: String,
        default: '组件'
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
      }
    },
    methods: {
      setData(dataTransfer) {
        // to avoid Firefox bug
        // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        dataTransfer.setData('Text', '')
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
      background: #304156;
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

