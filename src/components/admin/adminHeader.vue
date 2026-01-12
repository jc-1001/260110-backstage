<script setup>
defineProps({
  title: {
    type: String,
    default: '我是大標題', // 預設值
  },
  line: {
    type: String,
    default: '',
  },
})
</script>
<template>
  <h2 class="greeting">{{ title }}</h2>
  <hr style="margin: 16px 0" class="line" />
  {{ line }}
</template>
<style lang="scss" scoped>
.greeting {
  color: $primaryDark;
}
</style>
