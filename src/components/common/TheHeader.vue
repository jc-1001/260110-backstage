<script setup>
defineProps({
  title: {
    type: String,
    default: '我是大標題', // 預設值
  },
  subtitle: {
    type: String,
    default: '我是副標題',
  },
  imageSrc: {
    type: String,
    default: '', // 圖片路徑
  },
})
</script>
<template>
  <header class="header-banner">
    <div class="content">
      <h2 class="greeting">{{ title }}</h2>
      <p class="subtext">{{ subtitle }}</p>
    </div>
    <div class="illustration">
      <img :src="imageSrc" alt="header-img" />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header-banner {
  // margin-top: 20px;
  width: 100%;
  height: 120px;
  //   height: 19vh;
  border: 1px solid white;
  background: $linear1; /* 不用import */
  border-radius: $radius_md;
  box-shadow: $shadowDark;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.greeting {
  line-height: $lineHeightHeading;
  // @include title3(true); /* title1字體太大!! */
  // font-size: 24px;
  color: $primaryDark;
  padding: 0px 0 10px 30px;
  letter-spacing: 5%;
}
.subtext {
  line-height: $lineHeightSub;
  color: $primaryDark;
  @include subtitle2(false); // 字體太大!!
  font-size: 16px;
  padding: 0 30px;
  letter-spacing: 5%;
}
.illustration {
  padding: 20px 0px 0 0;
}
.illustration img {
  width: 70%;
}
</style>
