<template lang="html">
  <router-view :key="$route.fullPath"/>
</template>
<script>

export default {
  name: 'Search',
  beforeDestroy () {
    this.$store.commit('search/reset')
  }
}
</script>
<style lang="sass" scoped></style>
