---
title: 并查集
description: 并查集是一种用于管理元素所属集合的数据结构。
pubDate: 2026-09-29
tags: [算法, 并查集]
# heroImage: windows.png
---

## 核心思想

- 并 （Union / Merge）代表合并
- 查 （Find）代表查找
- 集 （Set）代表是一个以字典为数据结构的算法

> [!abstract] 应用
> 并查集一般被用于求解有关连通分量的问题

### 查

查找的适合沿着链条不同查找，直到找到根节点。

- 一种初始化根节点的方法是`parent = list(range(n))`，这样子当节点的父节点就是它自己时，这个节点是根节点
- 另一种添加根节点的方式是`parent[x] = None`，当节点的父节点不存在时，这个节点就是根节点

>[!note] 路径压缩
>当树很深的时候，并查集会退化为链表，此时需要对路径进行压缩，将树的深度固定为2。压缩方式为，将当前节点的父节点设置为根节点，然后继续遍历更上层的节点，进行相同的操作

```python
def find(x):
    root = x
    while parent[root] != root:
        root = parent[root]
    # 压缩
    while x != root:
        new = parent[x]
        parent[x] = root
        x = new
    return root
```

如果两个节点有关联，则将其中一个节点的根节点的上级设置为另一个节点的根节点（两个树进行合并）

```python
def union(x, y):s
    if root_x != root_y:
        parent[root_x] = root_y
        self.nums -= 1
```

### 集

- 可以用`Dict`也可以用数组实现
