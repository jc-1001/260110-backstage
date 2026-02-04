
const API_BASE_URL = 'http://localhost:8888/unicare_api'; // 確定的網址

// 具體功能入口
export const API_ENDPOINTS = {
    USER_LIST: `${API_BASE_URL}/member/user_api.php`,
    LOGIN: `${API_BASE_URL}/member/login_api.php`,
    REGISTER: `${API_BASE_URL}/member/register_api.php`,
};

// 預設匯出時的基礎網址
export default API_BASE_URL;