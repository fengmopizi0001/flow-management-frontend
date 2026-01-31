/**
 * API配置文件 - 用于前后端分离部署
 */

// API配置
const API_CONFIG = {
    // 开发环境API地址（本地测试）
    development: 'http://localhost:5000',
    
    // 生产环境API地址（PythonAnywhere）
    // 请替换为您的 PythonAnywhere 地址
    // 格式: https://your-username.pythonanywhere.com
    production: 'https://fengmopizi0001.pythonanywhere.com'
};

// 自动选择环境
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.protocol === 'file:';

// 当前API地址
const API_URL = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

// 导出配置
window.API_CONFIG = API_CONFIG;
window.API_URL = API_URL;
window.isDevelopment = isDevelopment;

console.log('当前API地址:', API_URL);
console.log('环境:', isDevelopment ? '开发环境' : '生产环境');

/**
 * API请求封装函数
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...options
    };
    
    try {
        const response = await fetch(url, defaultOptions);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API请求失败:', error);
        throw error;
    }
};

/**
 * API方法集合
 */
const API = {
    // GET请求
    get: (endpoint) => apiRequest(endpoint),
    
    // POST请求
    post: (endpoint, data) => apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    // PUT请求
    put: (endpoint, data) => apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    // DELETE请求
    delete: (endpoint) => apiRequest(endpoint, {
        method: 'DELETE'
    })
};

window.API = API;
