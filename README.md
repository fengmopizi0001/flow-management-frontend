# 流水管理系统 - 前端部署指南

## 项目说明

这是流水管理系统前端代码，采用前后端分离架构，可以部署到 GitHub Pages 或其他静态托管服务。

## 项目结构

```
frontend/
├── index.html          # 主页面
├── css/
│   └── style.css      # 样式文件
└── js/
    ├── config.js       # API配置（包含开发和生产环境）
    └── app.js         # 主应用逻辑
```

## 部署到 GitHub Pages

### 1. 创建 GitHub 仓库

```bash
# 初始化 Git 仓库
git init

# 添加文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/flow-management-frontend.git

# 推送到 GitHub
git push -u origin main
```

### 2. 启用 GitHub Pages

1. 访问你的 GitHub 仓库
2. 点击 Settings（设置）
3. 滚动到 "GitHub Pages" 部分
4. 在 "Source" 下选择：
   - Branch: `main`
   - Folder: `/ (root)`
5. 点击 "Save"

### 3. 等待部署完成

几分钟后，你的网站将在以下地址可用：
```
https://your-username.github.io/flow-management-frontend/
```

### 4. 配置生产环境 API 地址

编辑 `js/config.js` 文件，修改生产环境 API 地址：

```javascript
const API_CONFIG = {
    development: 'http://localhost:5000/api',
    
    // 修改为你的 PythonAnywhere 地址
    production: 'https://your-username.pythonanywhere.com/api'
};
```

## 本地开发

### 方法 1: 直接打开

直接在浏览器中打开 `index.html` 文件即可。

### 方法 2: 使用本地服务器（推荐）

```bash
# 使用 Python 3
python -m http.server 8000

# 或使用 Node.js 的 http-server
npx http-server -p 8000
```

然后访问 `http://localhost:8000`

## 配置说明

### API 配置

`js/config.js` 文件包含 API 配置：

- **development**: 本地开发环境（localhost:5000）
- **production**: 生产环境（PythonAnywhere 地址）

系统会自动检测环境：
- 如果在 `localhost` 或 `127.0.0.1` 访问，使用开发环境
- 否则使用生产环境

### 跨域设置

确保后端服务器已配置 CORS（跨域资源共享）：

```python
# 在 app_new.py 中
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": ["https://your-username.github.io"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

## 功能说明

### 管理员功能

- 仪表盘：查看统计数据
- 导入 Excel：批量导入客户流水
- 添加目标：为客户设置月度目标
- 录入流水：手动录入流水记录
- 查看记录：查看所有流水记录
- 对账报表：按操作人、客户统计

### 客户功能

- 仪表盘：查看完成进度和统计
- 流水明细：查看和标记流水记录

## 默认账户

- 管理员：`admin` / `admin123`
- 客户：由管理员创建，默认密码 `123456`

## 技术栈

- HTML5
- CSS3（响应式设计）
- JavaScript (ES6+)
- Fetch API（用于 HTTP 请求）

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 移动端支持

- 响应式设计
- 触摸优化
- 底部导航栏
- 表格自适应

## 常见问题

### 1. API 请求失败

检查：
- 后端服务器是否运行
- API 地址配置是否正确
- CORS 是否正确配置

### 2. 登录后无法访问

检查：
- Session 配置
- CORS credentials 设置
- 后端登录状态检查接口

### 3. 样式显示异常

检查：
- CSS 文件路径是否正确
- 浏览器缓存（尝试刷新）

## 更新部署

修改代码后：

```bash
git add .
git commit -m "描述你的更改"
git push
```

GitHub Pages 会自动重新部署。

## 联系方式

如有问题，请联系后端管理员。
