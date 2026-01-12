<script setup>

</script>

<template>
<div class="quantity_selector">
  <button class="qty_btn minus">-</button>
  <input type="number" class="qty_input" value="1">
  <button class="qty_btn plus">+</button>
</div>
</template>

<style lang="scss" scoped>
.quantity_selector {
  flex: 1 1 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border: 1px solid $black;
  .qty_btn {
    padding: 24px;
    border: none;
    background-color: transparent;
    @include subtitle2(true);
    color: $black;
    cursor: pointer;
  }
  .qty_input {
    width: 50px;
    padding: 0;
    border: none;
    text-align: center;
  }

}
</style>