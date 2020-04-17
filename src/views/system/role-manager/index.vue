<template>
  <div >
    <h1 class="dashboard-text">RoleManager</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'RoleManager',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style>

</style>
