/**
 * 流水管理系统 - 前端应用
 * 前后端分离版本
 */

// 应用状态
const AppState = {
    currentUser: null,
    role: null,
    isLoggedIn: false
};

// 页面路由
const Router = {
    currentPage: 'login',
    
    navigate: function(page) {
        this.currentPage = page;
        this.render();
    },
    
    render: function() {
        // 隐藏所有页面
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('mainPage').style.display = 'none';
        
        if (!AppState.isLoggedIn) {
            document.getElementById('loginPage').style.display = 'block';
        } else {
            document.getElementById('mainPage').style.display = 'block';
            this.renderNavigation();
            this.renderContent();
        }
    },
    
    renderNavigation: function() {
        const navLinks = document.getElementById('navLinks');
        const bottomNav = document.getElementById('bottomNav');
        
        if (AppState.role === 'admin') {
            navLinks.innerHTML = `
                <a href="#" class="nav-link" data-page="dashboard">仪表盘</a>
                <a href="#" class="nav-link" data-page="import">导入Excel</a>
                <a href="#" class="nav-link" data-page="add-target">添加目标</a>
                <a href="#" class="nav-link" data-page="add-record">录入流水</a>
                <a href="#" class="nav-link" data-page="view-records">查看记录</a>
                <a href="#" class="nav-link" data-page="reconciliation">对账报表</a>
                <a href="#" class="nav-link" id="logoutBtn">退出</a>
            `;
            bottomNav.style.display = 'none';
        } else {
            navLinks.innerHTML = `
                <a href="#" class="nav-link" data-page="dashboard">仪表盘</a>
                <a href="#" class="nav-link" data-page="records">流水明细</a>
                <a href="#" class="nav-link" id="logoutBtn">退出</a>
            `;
            bottomNav.innerHTML = `
                <a href="#" class="bottom-nav-item" data-page="dashboard">
                    <span class="bottom-nav-icon">📊</span>
                    <span class="bottom-nav-text">仪表盘</span>
                </a>
                <a href="#" class="bottom-nav-item" data-page="records">
                    <span class="bottom-nav-icon">📋</span>
                    <span class="bottom-nav-text">明细</span>
                </a>
                <a href="#" class="bottom-nav-item" id="logoutBtn">
                    <span class="bottom-nav-icon">🚪</span>
                    <span class="bottom-nav-text">退出</span>
                </a>
            `;
            bottomNav.style.display = 'flex';
        }
        
        // 绑定导航事件
        navLinks.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(link.dataset.page);
            });
        });
        
        bottomNav.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigate(link.dataset.page);
            });
        });
        
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    },
    
    renderContent: function() {
        const content = document.getElementById('mainContent');
        
        switch(this.currentPage) {
            case 'dashboard':
                Pages.renderDashboard(content);
                break;
            case 'import':
                Pages.renderImport(content);
                break;
            case 'add-target':
                Pages.renderAddTarget(content);
                break;
            case 'add-record':
                Pages.renderAddRecord(content);
                break;
            case 'view-records':
                Pages.renderViewRecords(content);
                break;
            case 'records':
                Pages.renderRecords(content);
                break;
            case 'reconciliation':
                Pages.renderReconciliation(content);
                break;
            default:
                Pages.renderDashboard(content);
        }
    }
};

// 认证管理
const Auth = {
    login: async function(username, password) {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                AppState.currentUser = data.username;
                AppState.role = data.role;
                AppState.isLoggedIn = true;
                Router.navigate('dashboard');
                return { success: true };
            } else {
                return { success: false, message: data.message || '登录失败' };
            }
        } catch (error) {
            console.error('登录错误:', error);
            return { success: false, message: '网络错误，请稍后重试' };
        }
    },
    
    logout: async function() {
        try {
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('登出错误:', error);
        }
        
        AppState.currentUser = null;
        AppState.role = null;
        AppState.isLoggedIn = false;
        Router.navigate('login');
    }
};

// 页面渲染
const Pages = {
    renderDashboard: function(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">仪表盘</div>
                <div id="dashboardStats" class="loading">
                    <div class="spinner"></div>
                    <p>加载中...</p>
                </div>
            </div>
        `;
        this.loadDashboardStats();
    },
    
    loadDashboardStats: async function() {
        try {
            const response = await API.get(`/customer/${AppState.userId}/stats`);
            const stats = response;
            
            document.getElementById('dashboardStats').innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                    <div style="text-align: center; padding: 20px; background: #e7f1ff; border-radius: 8px;">
                        <div style="font-size: 2rem; color: #007bff;">¥${stats.completed_flow.toLocaleString()}</div>
                        <div style="color: #666; margin-top: 10px;">已完成流水</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #fff3cd; border-radius: 8px;">
                        <div style="font-size: 2rem; color: #856404;">¥${stats.pending_flow.toLocaleString()}</div>
                        <div style="color: #666; margin-top: 10px;">待刷流水</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #d4edda; border-radius: 8px;">
                        <div style="font-size: 2rem; color: #155724;">¥${stats.total_flow.toLocaleString()}</div>
                        <div style="color: #666; margin-top: 10px;">总流水</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: #d1ecf1; border-radius: 8px;">
                        <div style="font-size: 2rem; color: #0c5460;">¥${stats.daily_flow.toLocaleString()}</div>
                        <div style="color: #666; margin-top: 10px;">今日流水</div>
                    </div>
                </div>
            `;
        } catch (error) {
            document.getElementById('dashboardStats').innerHTML = `
                <div class="alert alert-danger">加载数据失败: ${error.message}</div>
            `;
        }
    },
    
    renderRecords: function(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">流水明细</div>
                <div id="recordsList" class="loading">
                    <div class="spinner"></div>
                    <p>加载中...</p>
                </div>
            </div>
        `;
        this.loadRecords();
    },
    
    loadRecords: async function() {
        try {
            const response = await API.get(`/customer/records`);
            const records = response.records || [];
            
            if (records.length === 0) {
                document.getElementById('recordsList').innerHTML = '<div class="alert alert-info">暂无流水记录</div>';
                return;
            }
            
            let html = `
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>日期</th>
                                <th>金额</th>
                                <th>状态</th>
                                <th>操作员</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            records.forEach(record => {
                const statusClass = record.status === 'done' ? 'alert-success' : 'alert-warning';
                const statusText = record.status === 'done' ? '已刷' : '待刷';
                
                html += `
                    <tr>
                        <td>${record.date}</td>
                        <td>¥${record.amount.toLocaleString()}</td>
                        <td><span class="alert ${statusClass}" style="display: inline-block; padding: 2px 8px; border-radius: 3px;">${statusText}</span></td>
                        <td>${record.operator || '-'}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table></div>';
            document.getElementById('recordsList').innerHTML = html;
        } catch (error) {
            document.getElementById('recordsList').innerHTML = `
                <div class="alert alert-danger">加载数据失败: ${error.message}</div>
            `;
        }
    },
    
    renderImport: function(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">导入Excel</div>
                <form id="importForm">
                    <div class="form-group">
                        <label class="form-label">选择Excel文件</label>
                        <input type="file" id="excelFile" class="form-control" accept=".xlsx,.xls" required>
                    </div>
                    <button type="submit" class="btn btn-primary">导入</button>
                </form>
                <div id="importResult" style="margin-top: 20px;"></div>
            </div>
        `;
        
        document.getElementById('importForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('excelFile');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('请选择文件');
                return;
            }
            
            const formData = new FormData();
            formData.append('file', file);
            
            try {
                const response = await fetch(`${API_URL}/admin/import-excel`, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    document.getElementById('importResult').innerHTML = `
                        <div class="alert alert-success">
                            ${result.message}
                        </div>
                    `;
                } else {
                    document.getElementById('importResult').innerHTML = `
                        <div class="alert alert-danger">
                            ${result.message || '导入失败'}
                        </div>
                    `;
                }
            } catch (error) {
                document.getElementById('importResult').innerHTML = `
                    <div class="alert alert-danger">
                        网络错误: ${error.message}
                    </div>
                `;
            }
        });
    },
    
    renderAddTarget: function(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">添加目标</div>
                <form id="addTargetForm">
                    <div class="form-group">
                        <label class="form-label">客户</label>
                        <select id="targetCustomer" class="form-control" required></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">年月</label>
                        <input type="month" id="targetMonth" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">目标金额</label>
                        <input type="number" id="targetAmount" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">添加</button>
                </form>
                <div id="addTargetResult" style="margin-top: 20px;"></div>
            </div>
        `;
        
        // 加载客户列表
        this.loadCustomers();
    },
    
    loadCustomers: async function() {
        try {
            const response = await API.get('/admin/customers');
            const customers = response.customers || [];
            
            const select = document.getElementById('targetCustomer');
            customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = customer.username;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('加载客户失败:', error);
        }
    },
    
    renderAddRecord: function(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">录入流水</div>
                <form id="addRecordForm">
                    <div class="form-group">
                        <label class="form-label">客户</label>
                        <select id="recordCustomer" class="form-control" required></select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">日期</label>
                        <input type="date" id="recordDate" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">金额</label>
                        <input type="number" id="recordAmount" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">录入</button>
                </form>
                <div id="addRecordResult" style="margin-top: 20px;"></div>
            </div>
        `;
        
        this.loadCustomers();
    },
    
    renderViewRecords: function(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">查看记录</div>
                <div id="allRecords" class="loading">
                    <div class="spinner"></div>
                    <p>加载中...</p>
                </div>
            </div>
        `;
        this.loadAllRecords();
    },
    
    loadAllRecords: async function() {
        try {
            const response = await API.get('/admin/records');
            const records = response.records || [];
            
            if (records.length === 0) {
                document.getElementById('allRecords').innerHTML = '<div class="alert alert-info">暂无记录</div>';
                return;
            }
            
            let html = `
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>客户</th>
                                <th>日期</th>
                                <th>金额</th>
                                <th>状态</th>
                                <th>操作员</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            records.forEach(record => {
                const statusClass = record.status === 'done' ? 'alert-success' : 'alert-warning';
                const statusText = record.status === 'done' ? '已刷' : '待刷';
                
                html += `
                    <tr>
                        <td>${record.customer_name || record.customer_id}</td>
                        <td>${record.date}</td>
                        <td>¥${record.amount.toLocaleString()}</td>
                        <td><span class="alert ${statusClass}" style="display: inline-block; padding: 2px 8px; border-radius: 3px;">${statusText}</span></td>
                        <td>${record.operator || '-'}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table></div>';
            document.getElementById('allRecords').innerHTML = html;
        } catch (error) {
            document.getElementById('allRecords').innerHTML = `
                <div class="alert alert-danger">加载数据失败: ${error.message}</div>
            `;
        }
    },
    
    renderReconciliation: function(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">对账报表</div>
                <div id="reconciliationStats" class="loading">
                    <div class="spinner"></div>
                    <p>加载中...</p>
                </div>
            </div>
        `;
        this.loadReconciliationStats();
    },
    
    loadReconciliationStats: async function() {
        try {
            const response = await API.get('/admin/reconciliation');
            const stats = response;
            
            let html = '<div style="margin-top: 20px;">';
            
            if (stats.by_operator && stats.by_operator.length > 0) {
                html += '<h3>按操作员统计</h3>';
                html += '<table class="table"><thead><tr><th>操作员</th><th>总流水</th></tr></thead><tbody>';
                stats.by_operator.forEach(item => {
                    html += `<tr><td>${item.operator || '未指定'}</td><td>¥${item.total.toLocaleString()}</td></tr>`;
                });
                html += '</tbody></table>';
            }
            
            if (stats.by_customer && stats.by_customer.length > 0) {
                html += '<h3>按客户统计</h3>';
                html += '<table class="table"><thead><tr><th>客户</th><th>总流水</th></tr></thead><tbody>';
                stats.by_customer.forEach(item => {
                    html += `<tr><td>${item.customer_name || item.customer_id}</td><td>¥${item.total.toLocaleString()}</td></tr>`;
                });
                html += '</tbody></table>';
            }
            
            html += '</div>';
            document.getElementById('reconciliationStats').innerHTML = html;
        } catch (error) {
            document.getElementById('reconciliationStats').innerHTML = `
                <div class="alert alert-danger">加载数据失败: ${error.message}</div>
            `;
        }
    }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 登录表单
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('loginMessage');
        
        const result = await Auth.login(username, password);
        
        if (result.success) {
            messageDiv.style.display = 'none';
        } else {
            messageDiv.textContent = result.message;
            messageDiv.className = 'alert alert-danger';
            messageDiv.style.display = 'block';
        }
    });
    
    // 检查是否已登录
    checkLoginStatus();
});

// 检查登录状态
async function checkLoginStatus() {
    try {
        const response = await fetch(`${API_URL}/auth/status`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.logged_in) {
                AppState.currentUser = data.username;
                AppState.role = data.role;
                AppState.isLoggedIn = true;
                AppState.userId = data.user_id;
                Router.navigate('dashboard');
            }
        }
    } catch (error) {
        console.error('检查登录状态失败:', error);
    }
}
