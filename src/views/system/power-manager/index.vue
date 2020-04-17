<template>
  <div >
    <h1 class="dashboard-text">PowerManager</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PowerManager',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style>

</style>
