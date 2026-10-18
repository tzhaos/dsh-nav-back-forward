# dsh-nav-back-forward

简体中文 | [English](README.en.md)

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 客户端插件：在左上角
提供 **后退 / 前进** 按钮，在最近切换过的会话之间导航。

## 为什么

DSH 的主视图一次只显示一个 Session。从侧边栏连续切换会话后，想回到上一个会话只能重新找。这个
插件把会话切换记录成一条历史，并提供浏览器式的后退/前进按钮。

## 行为

- 在左上角显示两个紧凑按钮
- 记录主视图当前 Session 的切换历史
- 后退回到上一个 Session，前进回到下一个
- 没有可后退/可前进项时按钮禁用
- 支持键盘 `Alt+←` / `Alt+→`
- 外部切到新会话时截断前进历史，和浏览器行为一致
- 只记录 Session，不记录右侧标签页、文件标签或滚动位置

## 实现

插件注册在 `shell.overlay`：

1. 订阅 `uiSession.current`，把当前 Session id 追加到本地历史；
2. 后退/前进只调整历史索引，再调用 `uiWorkspace.openSession(id)`；
3. 外部导航产生的新分支会截断旧的前进记录；
4. 打开失败时恢复索引。

按钮使用主题 token，固定在左上角 `--dsh-frame-top-clearance` 下方。

## 安装

```text
plugin_manager(action="install_bundle", target="<monorepo>/packages/dsh-nav-back-forward")
```

或安装整个 monorepo：

```powershell
git clone --recurse-submodules https://github.com/tzhaos/dsh-plugins.git
cd dsh-plugins
node scripts/install-all.mjs
```

安装后完全退出 DSH 再启动。

## 已知限制

- 只记录 Session 切换，不包含右侧栏标签页/文件标签/滚动位置
- 历史只存在当前页面生命周期内；刷新页面后从当前 Session 重新开始
- 依赖 `uiSession.current` 和 `uiWorkspace.openSession()` 客户端服务
- 左上角位置固定；如果 DSH 以后改变标题栏结构，需要跟随调整

## 开发与测试

```sh
node scripts/check.mjs
```

零依赖测试覆盖清单/patch/locale/icon、历史记录、后退/前进、外部分支截断、快捷键和空历史隐藏，
共 11 项检查。

## 许可证

[MIT](LICENSE)
