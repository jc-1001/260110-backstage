<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const account = ref('');
const password = ref('');
const handleLogin = () => {
    userStore.login(account.value, password.value)
}

</script>

<template>
    <div class="login-container">
        <div class="login-card">
            <div class="logo-section">
                <img src="@/assets/images/common/logo.svg" alt="logo">
            </div>

            <h2 class="title">後台登入</h2>

            <form @submit.prevent="handleLogin" class="login-form">
                <div class="input-group">
                    <img src="@/assets/images/account.svg" alt="accountpic" class="input-icon">
                    <input 
                        type="text" 
                        v-model="account" 
                        placeholder="輸入管理員帳號" 
                        required />
                </div>

                <div class="input-group">
                    <img src="@/assets/images/password.svg" alt="passwordpic" class="input-icon">
                    <input 
                        type="password" 
                        v-model="password" 
                        placeholder="輸入管理員密碼" 
                        required />
                </div>
                <!-- {{ userStore.isLogin ? 1 : 0 }} -->
                <button type="submit" class="login-btn">登入</button>
                {{ userStore.errorMsg}}
            </form>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: $primaryLight;
}

.login-card {
    background-color: $white;
    padding: 40px 60px;
    border-radius: 12px;
    box-shadow: $shadow;
    width: 600px;
    height: 450px;
    text-align: center;

    .logo-section {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;

        .logo-img {
            height: 40px;
            margin-right: 10px;
        }
    }

    .title {
        color: $black;
        @include subtitle1(true);
        margin-bottom: 30px;
        letter-spacing: 2px;
    }
}

.login-form {
    .input-group {
        position: relative;
        margin-bottom: 20px;

        .input-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            pointer-events: none;
        }

        input {
            width: 100%;
            height: 45px;
            padding: 12px 15px 12px 45px;
            border: 1.5px solid $black;
            border-radius: $radius_md;
            @include body1;
            box-sizing: border-box;
        }
    }

    .login-btn {
        width: 100%;
        padding: 8px;
        background-color: $primaryDark;
        color: $white;
        @include subtitle2(true);
        border-radius: $radius_md;
        border: none;
        cursor: pointer;
        margin-top: 10px;
    }
}
</style>