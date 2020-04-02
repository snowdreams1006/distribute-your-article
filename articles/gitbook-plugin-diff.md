<!-- ![gitbook-plugin-diff-badge-wechat.png](https://imgkr.cn-bj.ufileos.com/6747c7cc-8f7e-4713-b8b2-db14bbcdffdd.png)
 -->
 
> 在 markdown 文档中显示代码之间的差异的 Gitbook 插件

[English](https://snowdreams1006.github.io/gitbook-plugin-diff/en/ "English") | [中文](https://snowdreams1006.github.io/gitbook-plugin-diff/zh/ "中文")

### 🏠 [主页](https://github.com/snowdreams1006/gitbook-plugin-diff#readme "主页")

- Github : [https://snowdreams1006.github.io/gitbook-plugin-diff/](https://snowdreams1006.github.io/gitbook-plugin-diff/ "https://snowdreams1006.github.io/gitbook-plugin-diff/")
- GitLab: [https://snowdreams1006.gitlab.io/gitbook-plugin-diff/](https://snowdreams1006.gitlab.io/gitbook-plugin-diff/ "https://snowdreams1006.gitlab.io/gitbook-plugin-diff/")
- Gitee : [https://snowdreams1006.gitee.io/gitbook-plugin-diff/](https://snowdreams1006.gitee.io/gitbook-plugin-diff/ "https://snowdreams1006.gitee.io/gitbook-plugin-diff/")

## 屏幕截图

- 用法

````markdown
{% diff method="diffJson" %}

```json
{
  "name": "gitbook-plugin-simple-mind-map",
  "version": "0.2.1",
  "description": "A gitBook plugin for generating and exporting mind map within markdown"
}
```

```json
{
  "name": "gitbook-plugin-diff",
  "version": "0.2.1",
  "description": "A gitbook plugin for showing the differences between the codes within markdown"
}
```

{% enddiff %}
````

- 预览

```diff
{
-   "description": "A gitBook plugin for generating and exporting mind map within markdown",
-   "name": "gitbook-plugin-simple-mind-map",
+   "description": "A gitbook plugin for showing the differences between the codes within markdown",
+   "name": "gitbook-plugin-diff",
    "version": "0.2.1"
}
```

## 用法

### 步骤＃1-更新 `book.json` 文件

在您的 `gitbook` 的 `book.json` 文件中,将 `diff` 添加到 `plugins` 列表中.

这是最简单的示例:

```json
{
    "plugins": ["diff"]
}
```

此外,受支持的配置选项如下:

```json
"gitbook": {
    "properties": {
        "method": {
            "type": "string",
            "title": "jsdiff api method",
            "required": false,
            "default": "diffLines",
            "description": "some supported methods such as diffChars or diffWords or diffWordsWithSpace or diffLines or diffTrimmedLines or diffSentences or diffCss or diffJson or diffArrays"
        },
        "options": {
            "type": "object",
            "title": "jsdiff api options",
            "required": false,
            "description": "some methods may not support options"
        }
    }
}
```

### 步骤＃2- 使用 `markdown` 语法

`diff` 插件支持 `method` 和 `options` 等选项生成差异代码块.

这是在 `markdown` 文件中基本使用语法:

````
{% diff %}
```
old code
```
```
new code
```
{% enddiff %}
````

### 步骤＃3- 运行 `gitbook` 命令

1. 运行 `gitbook install` .它将自动为您的 `gitbook` 安装 `diff` 插件.

> 该步骤仅需要允许一次即可.

```bash
gitbook install
```

或者您可以运行 `npm install gitbook-plugin-diff` 命令本地安装 `gitbook-plugin-diff` 插件.

```bash
npm install gitbook-plugin-diff
```

2. 像往常一样构建您的书（ `gitbook build` ）或服务（ `gitbook serve` ）.

```bash
gitbook serve
```

## 示例

- 官方文档配置文件

> [https://github.com/snowdreams1006/gitbook-plugin-diff/blob/master/docs/book.json](https://github.com/snowdreams1006/gitbook-plugin-diff/blob/master/docs/book.json "https://github.com/snowdreams1006/gitbook-plugin-diff/blob/master/docs/book.json")

```json
{
    "plugins": ["diff"],
    "pluginsConfig": {
        "diff": {
            "method": "diffJson"
        }
    }
}
```

- 官方示例配置文件

> [https://github.com/snowdreams1006/gitbook-plugin-diff/blob/master/example/book.json](https://github.com/snowdreams1006/gitbook-plugin-diff/blob/master/example/book.json "https://github.com/snowdreams1006/gitbook-plugin-diff/blob/master/example/book.json")

```json
{
    "plugins": ["diff"],
    "pluginsConfig": {
        "diff": {
            "method": "diffJson"
        }
    }
}
```

- 示例`book.json`文件

```json
{
    "plugins": ["diff"]
}
```

或者您可以将 `method` 设置为默认方法用于代码之间进行比较方式：

```json
{
    "plugins": ["diff"],
    "pluginsConfig": {
        "diff": {
            "method": "diffChars"
        }
    }
}
```

或者您可以根据方法将 `options` 设置为默认选项.

```json
{
    "plugins": ["diff"],
    "pluginsConfig": {
        "diff": {
            "method": "diffChars",
            "options": {
              "ignoreCase": true
            }
        }
    }
}
```

**注意** ：如果您的书还没有创建,以上代码段可以用作完整的 `book.json` 文件.

## 致谢

- A javascript text differencing implementation. : [https://github.com/kpdecker/jsdiff](https://github.com/kpdecker/jsdiff "https://github.com/kpdecker/jsdiff")
- get colors in your node.js console : [https://github.com/Marak/colors.js](https://github.com/Marak/colors.js "https://github.com/Marak/colors.js")
- GitBook CodeGroup Plugin : [https://github.com/lwhiteley/gitbook-plugin-codegroup](https://github.com/lwhiteley/gitbook-plugin-codegroup "https://github.com/lwhiteley/gitbook-plugin-codegroup")

## 作者

👤 **snowdreams1006**

- 网站 : [snowdreams1006.tech](https://snowdreams1006.tech/ "snowdreams1006.tech")
- GitHub : [@snowdreams1006](https://github.com/snowdreams1006 "@snowdreams1006")
- 电子邮件 : [snowdreams1006@163.com](mailto:snowdreams1006@163.com "snowdreams1006@163.com")

## 贡献

欢迎贡献，问题和功能要求！随时检查[问题页面](https://github.com/snowdreams1006/gitbook-plugin-diff/issues "问题页面") 。

## 支持

如果这个项目对您有帮助，请给个[星星](https://github.com/snowdreams1006/gitbook-plugin-diff "星星") ！

## 版权

版权所有 ©2019 [snowdreams1006](https://github.com/snowdreams1006 "snowdreams1006") 。

该项目是[MIT](https://github.com/snowdreams1006/gitbook-plugin-diff/blob/master/LICENSE "MIT")许可的。

<!-- ![snowdreams1006-wechat-open.png](https://snowdreams1006.github.io/snowdreams1006-wechat-open.png) -->
