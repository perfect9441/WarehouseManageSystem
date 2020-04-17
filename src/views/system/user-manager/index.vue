<template>
  <div >
    <h1 class="dashboard-text">UserManager</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserManager',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style>

</style>
