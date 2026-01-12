<!-- 補充: 關於組件名稱，官方推薦使用大駝峰寫法，用以區分vue組件和原生html元素 -->
<script setup>
// 設定props主要是為了宣告接收權，元件只會接收下面寫的幾種資料
defineProps({
  id: Number,
  category: String,
  image: String,
  title: String,
  spec: String, // 商品規格
  price: Number,
  tag: String,
})

// 加入購物車
const addToCart = () => {
  console.log('加入購物車，但不會跳轉頁面！');
}

</script>
<template>
  <router-link :to="`/product/${id}`" class="product_card">
    <div class="card_img">
      <img v-if="image" :src="image" :alt="title">
      <div v-else class="no_img">尚無圖片</div>
      <div v-if="tag" class="product_tag">{{ tag }}</div>
    </div>
    <div class="card_body">
      <div class="product_txt">
        <h3 class="product_title">{{ title }}</h3>
        <p class="product_spec">{{ spec }}</p>
      </div>
      <p class="product_price">${{ price }}</p>
      <div class="card_button">
        <!-- 筆記: @click.prevent(阻擋預設行為)/@click.stop(阻擋冒泡) 此為"事件修飾符" -->
        <button type="button" @click.stop.prevent="addToCart">加入購物車</button>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.product_card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  box-shadow: $shadow;
  border-radius: 10px;
  background-color: $white;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: $shadowHover;
  }

  .card_img {
    width: 100%;
    position: relative;
    border-radius: 10px 10px 0 0;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .product_tag {
      position: absolute;
      left: 8px;
      top: 8px;
      padding: 2px 16px;
      background-color: $accent;
      color: $white;
      @include body3;
      border-radius: 5px;
    }
  }

  .card_body {
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .product_txt {
      .product_title {
        margin-bottom: 8px;
        @include subtitle2(true);
        color: $primaryDark;
      }
      .product_spec {
        display: inline-block;
        padding: 0 12px;
        @include body3(true);
        color: $primaryDark;
        color: $grayDark;
        background-color: $grayLight;
        border: 2px solid $gray;
        border-radius: 100px
      }
    }

    .product_price {
      @include body1(true);
      color: $black;
    }

    .card_button {
      background-color: $primaryDark;
      text-align: center;
      border-radius: 5px;
      transition: all .3s;

      &:hover {
        background-color: $primary;
      }

      button {
        width: 100%;
        border: none;
        background: none;
        color: $white;
        padding: 8px;
        cursor: pointer;
        @include body2(true);
      }
    }
  }
}
</style>