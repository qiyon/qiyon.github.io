---
title: Linux-Tmux记录
publishedAt: 2016-07-15T22:45:00+08:00
tags:
  - linux
  - tmux
  - command
  - cli
draft: false
---

## 1 基本概念

```text
Session  会话，包含多个窗口
Window   窗口，包含多个窗格
Pane     窗格，运行独立的终端
```

## 2 命令行操作

以下命令在 shell 中执行。

### 2.1 会话管理

```sh
# 启动会话
tmux

# 列出会话
tmux ls

# 连接指定会话
tmux a -t name-or-number

# 关闭当前会话
tmux kill-session

# 关闭指定会话
tmux kill-session -t name-or-number
```

## 3 基本操作

`prefix` 默认为 `Ctrl + b`，先按前缀并松开，再按对应按键。

### 3.1 帮助与命令

```text
prefix + ?         查看按键列表
prefix + :         打开 tmux 命令提示符
```

命令提示符中直接输入 `kill-session -t name-or-number` 等命令，无需加 `tmux`。

### 3.2 会话（Session）

```text
prefix + s         列出并选择会话
prefix + d         分离会话（保持后台运行）
prefix + $         重命名会话
```

### 3.3 窗口（Window）

```text
prefix + c         新建窗口
prefix + w         列出并选择窗口
prefix + &         关闭当前窗口
prefix + 数字      切换到指定编号的窗口
```

### 3.4 窗格（Pane）

```text
prefix + "         上下拆分窗格
prefix + %         左右拆分窗格
prefix + q         显示窗格编号，再按编号切换
prefix + o         切换到下一个窗格（字母 o）
prefix + z         放大 / 恢复当前窗格
exit               在 shell 中退出当前窗格；最后一个窗格退出时关闭窗口
```

### 3.5 复制与粘贴

```text
prefix + [         进入复制模式，查看历史并选择文本
prefix + ]         粘贴 tmux 缓冲区内容
```

## 4 查看历史与终端复制（mouse off）

在 tmux 会话中的 shell 关闭鼠标：

```sh
tmux set -g mouse off
```

进入历史后，用终端拖选并复制到本机剪贴板：

```text
prefix + [         进入复制模式，查看历史
方向键             移动光标
PageUp / PageDown  向上 / 向下翻页
鼠标拖选           使用终端选择文本
⌘C                 macOS Terminal：复制
Ctrl + Shift + C   Windows Terminal：复制
Ctrl + c           退出复制模式
```

多窗格时，可先用 `prefix + z` 放大目标窗格再操作。复制后，在目标应用使用系统粘贴快捷键，无需配置 `pbcopy`。

## 5 常用配置

以下配置写入 `~/.tmux.conf`。

### 5.1 窗口与窗格编号

```tmux
# 编号从 1 开始
set -g base-index 1
setw -g pane-base-index 1
```

### 5.2 状态栏位置

```tmux
# 状态栏置顶
set -g status-position top
```

### 5.3 窗口命名

```tmux
# 禁止程序通过转义序列重命名窗口
set -g allow-rename off

# 关闭 tmux 自身的自动命名
setw -g automatic-rename off
```

### 5.4 重新加载配置

```sh
tmux source-file ~/.tmux.conf
```

## 6 鼠标操作

tmux 3.8 默认开启鼠标。开启后可点击切换窗格、拖动边框、滚轮查看历史。

### 6.1 查看与切换

在 tmux 会话中的 shell 执行：

```sh
# 查看当前会话的有效设置
tmux show-options -A mouse

# 开启 / 关闭全局鼠标设置
tmux set -g mouse on
tmux set -g mouse off

# 清除当前会话的单独设置，恢复继承全局值
tmux set -u mouse
```

### 6.2 持久配置

```tmux
# 写入 ~/.tmux.conf；开启则改为 on
set -g mouse off
```

## 7 系统剪贴板

tmux 缓冲区与系统剪贴板独立；复制到本机剪贴板可使用以下方式。

### 7.1 macOS 自带终端（本地或 SSH）

```text
⌘R                 切换终端“允许鼠标报告”，不修改 tmux 的 mouse 设置
关闭鼠标报告后拖选  选择终端文本
⌘C                 复制到 Mac 剪贴板
⌘V                 粘贴
再次按 ⌘R          恢复鼠标报告
```

### 7.2 macOS 本机 tmux：拖选即复制

适用于 tmux 3.2 及以后、默认复制绑定；需先开启 `mouse on`，并确保终端已开启“允许鼠标报告”。在 shell 中执行：

```sh
# 让 tmux 复制操作同时写入 Mac 剪贴板
tmux set -s copy-command '/usr/bin/pbcopy'

# 或手动将已有缓冲区写入 Mac 剪贴板
tmux show-buffer | /usr/bin/pbcopy
```

持久配置写入 `~/.tmux.conf`：

```tmux
set -s copy-command '/usr/bin/pbcopy'
```

鼠标拖选后松开，再到其他应用按 `⌘V`。此配置用于本机 Mac，不用于 SSH 远程 Linux。

### 7.3 Windows Terminal：SSH 连接远程 tmux

在远程 tmux 会话中的 shell 开启鼠标：

```sh
tmux set -g mouse on
```

使用 Windows Terminal 默认快捷键：

```text
普通鼠标操作       切换窗格、拖动边框、滚动历史
Shift + 拖选       绕过 tmux，选择终端文本
Ctrl + Shift + C   复制到 Windows 剪贴板
Ctrl + Shift + V   粘贴
```

多窗格时，可先用 `prefix + z` 放大目标窗格再拖选。

## 8 参考

- [tmux 3.8 变更记录](https://github.com/tmux/tmux/blob/3.8/CHANGES)
- [tmux 剪贴板配置](https://github.com/tmux/tmux/wiki/Clipboard)
- [macOS Terminal 快捷键](https://support.apple.com/guide/terminal/keyboard-shortcuts-trmlshtcts/mac)
- [Windows Terminal 文本选择](https://learn.microsoft.com/en-us/windows/terminal/selection)
