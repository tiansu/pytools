# PyTools 开发文档

## 架构设计

### 核心架构
PyTools 采用分层架构设计：
1. **CLI 层**: 命令行接口，处理用户输入和输出
2. **业务逻辑层**: 处理具体的 Python 工具操作
3. **执行层**: 调用系统命令执行 Python 工具
4. **UI 层**: Web 界面，提供可视化操作

### 模块说明

#### 1. CLI 模块 (`bin/pytools.js`)
- 使用 `commander` 库处理命令行参数
- 提供 5 个主要命令：format、lint、deps、venv、run
- 统一的错误处理和用户反馈

#### 2. 工具执行模块
- 使用 `execa` 安全执行系统命令
- 支持多种 Python 工具：black、autopep8、pylint、flake8、pip、venv
- 跨平台兼容性处理

#### 3. UI 模块 (`ui/`)
- 基于 React + Vite 的现代化前端
- 使用 Tailwind CSS 进行样式设计
- 响应式设计，支持桌面端使用
- 实时终端输出显示

#### 4. 配置模块
- `sub-app-manifest.json`: 子应用清单配置
- `package.json`: 依赖管理配置

## 开发指南

### 添加新命令

1. **更新 CLI 处理器**
```javascript
// 在 bin/pytools.js 中添加
async function handleNewCommand(arg, options) {
  console.log(chalk.blue(`执行新命令: ${arg}`));
  // 实现逻辑
}

// 注册命令
program
  .command('new <arg>')
  .description('新命令描述')
  .option('-o, --option <value>', '选项描述')
  .action(handleNewCommand);
```

2. **更新清单配置**
```json
{
  "cli": {
    "commands": {
      "new": {
        "description": "新命令描述",
        "args": {
          "arg": "参数说明",
          "option": "选项说明"
        }
      }
    }
  }
}
```

3. **更新 UI 界面**
   - 在 `ui/src/App.jsx` 中添加新的标签页
   - 实现对应的状态管理和 UI 组件

### 扩展 Python 工具支持

1. **添加新工具**
```javascript
// 在工具执行函数中添加新工具支持
if (tool === 'new-tool') {
  return await runPythonCommand('new-tool', args);
}
```

2. **添加对应的 UI 选项**
   - 更新选择器或按钮组件
   - 添加工具说明和配置选项

## API 接口设计

### CLI API
```javascript
// 格式化 API
pytools format <path> [--formatter <tool>]

// 代码检查 API  
pytools lint <path> [--linter <tool>]

// 依赖管理 API
pytools deps <action> [package]

// 虚拟环境 API
pytools venv <action> [name]

// 脚本执行 API
pytools run <script> [args]
```

### 库模块 API (`lib/index.js`)
```javascript
// 基础 API
import pytools from './lib/index.js';

// 使用示例
await pytools.format.black('./file.py');
await pytools.lint.pylint('./file.py');
await pytools.deps.list();
await pytools.venv.create('myenv');
```

## 配置说明

### 环境变量
```bash
# 调试模式
export PYTools_DEBUG=true

# Python 路径覆盖
export PYTools_PYTHON_PATH=/usr/local/bin/python3

# 镜像源配置
export PYTools_PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
```

### 配置文件
支持以下配置文件（按优先级）：
1. 命令行参数
2. 环境变量
3. 项目级 `.pytoolsrc`
4. 用户级 `~/.pytoolsrc`
5. 系统默认值

## 测试策略

### 单元测试
```javascript
// 测试 CLI 命令解析
test('format command', () => {
  // 测试逻辑
});

// 测试工具执行
test('black formatter', async () => {
  // 测试逻辑
});
```

### 集成测试
1. **CLI 集成测试**: 测试完整的命令执行流程
2. **UI 集成测试**: 测试用户界面交互
3. **端到端测试**: 测试从 UI 到命令执行的完整流程

### 测试工具
- Jest: JavaScript 单元测试
- React Testing Library: UI 组件测试
- Playwright: 端到端测试

## 性能优化

### CLI 性能
- 延迟加载大型模块
- 缓存频繁使用的命令结果
- 并行执行独立任务

### UI 性能
- 代码分割和懒加载
- 虚拟列表优化长列表
- 记忆化计算密集型操作

### 资源优化
- 按需加载 Python 工具
- 清理临时文件和缓存
- 优化图片和静态资源

## 安全考虑

### 命令注入防护
- 使用参数化命令执行
- 验证用户输入路径
- 限制命令执行权限

### 文件系统安全
- 验证文件路径在允许范围内
- 限制文件操作权限
- 防止路径遍历攻击

### 网络安全
- 使用 HTTPS 传输敏感数据
- 验证下载源的完整性
- 保护 API 密钥和凭证

## 部署指南

### 构建流程
```bash
# 安装依赖
npm install

# 构建 UI
cd ui && npm run build

# 测试 CLI
npm test

# 打包发布
npm run package
```

### 发布检查清单
- [ ] 所有测试通过
- [ ] 文档更新完成
- [ ] 版本号更新
- [ ] 变更日志更新
- [ ] 兼容性验证

## 维护指南

### 版本管理
- 遵循语义化版本控制
- 维护变更日志
- 提供版本迁移指南

### 问题排查
1. **查看日志**: `pytools --verbose <command>`
2. **启用调试**: `export DEBUG=pytools*`
3. **检查依赖**: `pytools deps list`
4. **验证环境**: `python3 --version`

### 性能监控
- 命令执行时间统计
- 内存使用监控
- 错误率跟踪
- 用户行为分析

## 路线图

### v1.0.0 (当前)
- ✓ 基础格式化功能
- ✓ 代码检查功能
- ✓ 依赖管理
- ✓ 虚拟环境管理
- ✓ 脚本执行
- ✓ Web UI 界面

### v1.1.0 (计划中)
- 测试框架集成
- 性能分析工具
- 文档生成功能
- 团队协作功能

### v1.2.0 (规划中)
- AI 代码辅助
- 云环境同步
- 插件系统
- 多项目管理

---

*最后更新: 2026-03-07*