<script setup></script>
<template>
  <div class="create-medicine-modal">
    <h1>新增藥品</h1>
    <form action="#">
        <div class="medicine-create">
      <div>
        <label for="medicine-image">藥品圖片：</label>
        <input type="file" id="medicine-image" name="medicine-image" />
        <div class="input-image"><span>點擊或拖曳上傳藥品照片</span></div>
      </div>
      <div>
        <label for="medicine-name">藥品名稱 ：</label>
        <input type="text" id="medicine-name" name="medicine-name" />

        <label for="quantity">藥品數量：</label>
        <input type="text" id="quantity" name="quantity" />

        <label for="expiration-date">有效期限：</label>
        <input type="date" id="expiration-date" name="expiration-date" />

        <label for="notes">備註：</label>
        <textarea id="notes" name="notes"></textarea>
      </div>
      <div>
        <span>服用時間</span> <span>醫囑用法</span> <span>服用數量</span>
        <label for="">早上</label>
        <select name="morning-tips" id="morning-tips">
          <option value="飯前">飯前</option>
          <option value="飯後">飯後</option>
          <option value="睡前">睡前</option>
        </select>
        <select name="morning-quantity" id="morning-quantity">
          <option value="1">1份</option>
          <option value="2">2份</option>
          <option value="3">3份</option>
          <option value="4">4份</option>
          <option value="5">5份</option>
        </select>
        <label for="noon">中午</label>
        <select name="noon-tips" id="noon-tips">
          <option value="飯前">飯前</option>
          <option value="飯後">飯後</option>
          <option value="睡前">睡前</option>
        </select>
        <select name="noon-quantity" id="noon-quantity">
          <option value="1">1份</option>
          <option value="2">2份</option>
          <option value="3">3份</option>
          <option value="4">4份</option>
          <option value="5">5份</option>
        </select>
        <label for="evening">晚上</label>
        <select name="evening-tips" id="evening-tips">
          <option value="飯前">飯前</option>
          <option value="飯後">飯後</option>
          <option value="睡前">睡前</option>
        </select>
        <select name="evening-quantity" id="evening-quantity">
          <option value="1">1份</option>
          <option value="2">2份</option>
          <option value="3">3份</option>
          <option value="4">4份</option>
          <option value="5">5份</option>
        </select>
        <label for="before-bed">睡前</label>
        <select name="before-bed-tips" id="before-bed-tips">
          <option value="睡前">睡前</option>
        </select>
        <select name="before-bed-quantity" id="before-bed-quantity">
          <option value="1">1份</option>
          <option value="2">2份</option>
          <option value="3">3份</option>
          <option value="4">4份</option>
          <option value="5">5份</option>
        </select>
      </div>
      </div>
      <button type="submit">儲存</button>
      
    </form>
  </div>
</template>

<style lang="scss" scoped>
.create-medicine-modal {
  position: fixed;
  background-color: $white;
  z-index: 1000;
  width: 1200px;
  height: 800px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 24px;
  border-radius: $radius_md;
  box-shadow: $shadowDark;
  form {
    display: flex;
    flex-direction: column;

    .medincine-create {
      display: flex;
      justify-content: space-between;
      gap: 24px;
    }
    label {
      margin-top: 16px;
      @include body2;
      color: $primaryDark;

    }
    input,
    textarea {
      margin-top: 8px;
      padding: 8px;
      border: 1px solid $primaryDark;
      border-radius: $radius_sm;
      @include body3;
    }
    button {
      margin-top: 24px;
      padding: 12px;
      background-color: $primaryDark;
      color: $white;
      border: none;
      border-radius: $radius_md;
      cursor: pointer;
      @include body2;
      &:hover {
        background-color: $white;
        color: $primaryDark;
      }
    }
    .input-image {
      width: 500px;
      height: 500px;
      margin-top: 8px;
      border: 1px solid $primaryDark;
      border-radius: $radius_sm;
      background-color:$primaryLight;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        @include body3;
        color: $white;
      }
    }
  }
}
</style>
