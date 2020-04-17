<template>
  <div>
    <h1 class="dashboard-text">OrgManager</h1>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "OrgManager",
  computed: {
    ...mapGetters(["name"])
  }
};
</script>

<style>
</style>
