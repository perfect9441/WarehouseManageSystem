<template>
  <div class="dashboard-container">
    <div>账号:{{userInfo.username}}</div>
    <div>组织:{{userInfo.orgCrumbs}}</div>
  
    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import PanelGroup from "./components/PanelGroup";
// import Navigate from "./components/navigate";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["userInfo"])
  },
  // components: {
  //   PanelGroup,
  //   Navigate
  // },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  } 
}
.dash-header ,.dash-navigate{
    background-color: rgb(240, 240, 240);
    border-radius: 10px;
    margin: 10px 0px;
  }
</style>
