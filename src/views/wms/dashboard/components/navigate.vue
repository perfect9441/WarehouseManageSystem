<template>
  <el-row>
    <el-col :span="4" class="text-center">
      <router-link class="pan-btn tiffany-btn" to="">货物入库</router-link>
    </el-col>
    <el-col :span="4" class="text-center">
      <router-link class="pan-btn tiffany-btn" to="">货物出库</router-link>
    </el-col>
    <el-col :span="4" class="text-center">
      <router-link class="pan-btn tiffany-btn" to="">仓库盘库</router-link>
    </el-col>
    <el-col :span="4" class="text-center">
      <router-link class="pan-btn tiffany-btn" to="">退货单处理</router-link>
    </el-col>
    <el-col :span="4" class="text-center">
      <router-link class="pan-btn tiffany-btn" to="">货物调拨</router-link>
    </el-col>
    <el-col :span="4" class="text-center">
      <router-link class="pan-btn tiffany-btn" to="">数据报表</router-link>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";
import PanThumb from "@/components/PanThumb";   
import MdInput from "@/components/MDinput";
import Mallki from "@/components/TextHoverEffect/Mallki";
import DropdownMenu from "@/components/Share/DropdownMenu";

export default {
  components: {
    CountTo,
    PanThumb,
    MdInput,
    Mallki,
    DropdownMenu
  }
};
</script>

<style scoped>
</style>
