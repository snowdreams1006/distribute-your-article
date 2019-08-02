# go list

# go list

 
`go list`命令的作用是列出指定的代码包的信息。与其他命令相同，我们需要以代码包导入路径的方式给定代码包。被给定的代码包可以有多个。这些代码包对应的目录中必须直接保存有Go语言源码文件，其子目录中的文件不算在内。否则，代码包将被看做是不完整的。现在我们来试用一下：

```bash
hc@ubt:~$ go list cnet/ctcp pkgtool
cnet/ctcp
pkgtool
```

我们看到，在不加任何标记的情况下，命令的结果信息中只包含了我们指定的代码包的导入路径。我们刚刚提到，作为参数的代码包必须是完整的代码包。例如：

```bash
hc@ubt:~$ go list cnet pkgtool
can't load package: package cnet: no buildable Go source files in /home/hc/golang/goc2p/src/cnet/
pkgtool
```

这时，`go list`命令报告了一个错误——代码包`cnet`对应的目录下没有Go源码文件。但是命令还是把代码包pkgtool的导入路径打印出来了。然而，当我们在执行`go list`命令并加入标记`-e`时，即使参数中包含有不完整的代码包，命令也不会提示错误。示例如下：

```bash
hc@ubt:~$ go list -e cnet pkgtool
cnet
pkgtool
```

标记`-e`的作用是以容错模式加载和分析指定的代码包。在这种情况下，命令程序如果在加载或分析的过程中遇到错误只会在内部记录一下，而不会直接把错误信息打印出来。我们为了看到错误信息可以使用`-json`标记。这个标记的作用是把代码包的结构体实例用JSON的样式打印出来。

这里解释一下，JSON的全称是Javascript Object Notation。它一种轻量级的承载数据的格式。JSON的优势在于语法简单、短小精悍，且非常易于处理。JSON还是一种纯文本格式，独立于编程语言。正因为如此，得到了绝大多数编程语言和浏览器的支持，应用非常广泛。Go语言当然也不例外，在它的标准库中有专门用于处理和转换JSON格式的数据的代码包`encoding/json`。关于JSON格式的具体内容，读者可以去它的[官方网站](http://www.json.org)查看说明。

在了解了这些基本概念之后，我们来试用一下`-json`标记。示例如下：

```bash
hc@ubt:~$ go list -e -json cnet
    {
            "Dir": "/home/hc/golang/goc2p/src/cnet",
            "ImportPath": "cnet",
            "Stale": true,
            "Root": "/home/hc/golang/goc2p",
            "Incomplete": true,
            "Error": {
                    "ImportStack": [
                            "cnet"
                    ],
                    "Pos": "",
                    "Err": "no Go source files in /home/hc/golang/goc2p/src/cnet"
            }
    }
```

在上述JSON格式的代码包信息中，对于结构体中的字段的显示是不完整的。因为命令程序认为我们指定`cnet`就是不完整的。在名为`Error`的字段中，我们可以看到具体说明。`Error`字段的内容其实也是一个结构体。在JSON格式下，这种嵌套的结构体被完美的展现了出来。`Error`字段所指代的结构体实例的`Err`字段说明了`cnet`不完整的原因。这与我们在没有使用`-e`标记的情况下所打印出来的错误提示信息是一致的。我们再来看`Incomplete`字段。它的值为`true`。这同样说明`cnet`是一个不完整的代码包。

实际上，在从这个代码包结构体实例到JSON格式文本的转换过程中，所有的值为其类型的空值的字段都已经被忽略了。

现在我们使用带`-json`标记的`go list`命令列出代码包`cnet/ctcp`的信息：

```bash
hc@ubt:~$ go list -json cnet/ctcp
{
    "Dir": "/home/hc/golang/github/goc2p/src/cnet/ctcp",
    "ImportPath": "cnet/ctcp",
    "Name": "ctcp",
    "Target": "/home/hc/golang/github/goc2p/pkg/darwin_amd64/cnet/ctcp.a",
    "Stale": true,
    "Root": "/home/hc/golang/github/goc2p",
    "GoFiles": [
        "base.go",
        "tcp.go"
    ],
    "Imports": [
        "bufio",
        "bytes",
        "errors",
        "logging",
        "net",
        "sync",
        "time"
    ],
    "Deps": [
        "bufio",
        "bytes",
        "errors",
        "fmt",
        "internal/singleflight",
        "io",
        "log",
        "logging",
        "math",
        "math/rand",
        "net",
        "os",
        "reflect",
        "runtime",
        "runtime/cgo",
        "sort",
        "strconv",
        "strings",
        "sync",
        "sync/atomic",
        "syscall",
        "time",
        "unicode",
        "unicode/utf8",
        "unsafe"
    ],
    "TestGoFiles": [
        "tcp_test.go"
    ],
    "TestImports": [
        "bytes",
        "fmt",
        "net",
        "runtime",
        "strings",
        "sync",
        "testing",
        "time"
    ]
}
```

由于`cnet/ctcp`包是一个完整有效的代码包，所以我们不使用`-e`标记也是没有问题的。在上面打印的`cnet/ctcp`包的信息中没有`Incomplete`字段。这是因为完整的代码包中的`Incomplete`字段的其类型的空值`false`。它已经在转换过程中被忽略掉了。另外，在`cnet/ctcp`包的信息中我们看到了很多其它的字段。现在我就来看看在Go命令程序中的代码包结构体都有哪些公开的字段。如下表。

表0-7 代码包结构体中的基本字段

字段名称       | 字段类型         | 字段描述
------------- | --------------- | ---------------
Dir           | 字符串（string）  | 代码包对应的目录。
ImportPath    | 字符串（string）  | 代码包的导入路径。
ImportComment | 字符串（string）  | 代码包声明语句右边的用于自定义导入路径的注释。
Name          | 字符串（string）  | 代码包的名称。
Doc           | 字符串（string）  | 代码包的文档字符串。
Target        | 字符串（string）  | 代码包的安装路径。
Shlib         | 字符串（string）  | 包含该代码包的共享库（shared library）的名称。
Goroot        | 布尔（bool）      | 该代码包是否在Go语言安装目录下。
Standard      | 布尔（bool）      | 该代码包是否属于标准库的一部分。
Stale         | 布尔（bool）      | 该代码包的最新代码是否未被安装。
Root          | 字符串（string）  | 该代码包所属的工作区或Go安装目录的路径。

表0-8 代码包结构体中与源码文件有关的字段

字段名称        | 字段类型              | 字段描述
-------------- | -------------------- | ---------------
GoFiles        | 字符串切片（[]string） | Go源码文件的列表。不包含导入了代码包“C”的源码文件和测试源码文件。
CgoFiles       | 字符串切片（[]string） | 导入了代码包“C”的源码文件的列表。
IgnoredGoFiles | 字符串切片（[]string） | 忽略编译的源码文件的列表。
CFiles         | 字符串切片（[]string） | 名称中有“.c”后缀的源码文件的列表。
CXXFiles       | 字符串切片（[]string） | 名称中有“.cc”、“.cxx”或“.cpp”后缀的源码文件的列表。
MFiles         | 字符串切片（[]string） | 名称中“.m”后缀的源码文件的列表。
HFiles         | 字符串切片（[]string） | 名称中有“.h”后缀的源码文件的列表。
SFiles         | 字符串切片（[]string） | 名称中有“.s”后缀的源码文件的列表。
SwigFiles      | 字符串切片（[]string） | 名称中有“.swig”后缀的文件的列表。
SwigCXXFiles   | 字符串切片（[]string） | 名称中有“.swigcxx”后缀的文件的列表。
SysoFiles      | 字符串切片（[]string） | 名称中有“.syso”后缀的文件的列表。这些文件是需要被加入到归档文件中的。

表0-9 代码包结构体中与Cgo指令有关的字段

字段名称        | 字段类型              | 字段描述
-------------- | -------------------- | ---------------
CgoCFLAGS      | 字符串切片（[]string） | 需要传递给C编译器的标记的列表。针对Cgo。
CgoCPPFLAGS    | 字符串切片（[]string） | 需要传递给C预处理器的标记的列表。针对Cgo。
CgoCXXFLAGS    | 字符串切片（[]string） | 需要传递给C++编译器的标记的列表。针对Cgo。
CgoLDFLAGS     | 字符串切片（[]string） | 需要传递给链接器的标记的列表。针对Cgo。
CgoPkgConfig   | 字符串切片（[]string） | pkg-config的名称的列表。针对Cgo。

表0-10 代码包结构体中与依赖信息有关的字段

字段名称        | 字段类型              | 字段描述
-------------- | -------------------- | ---------------
Imports        | 字符串切片（[]string） | 该代码包中的源码文件显式导入的依赖包的导入路径的列表。
Deps           | 字符串切片（[]string） | 所有的依赖包（包括间接依赖）的导入路径的列表。

表0-11 代码包结构体中与错误信息有关的字段

字段名称        | 字段类型              | 字段描述
-------------- | -------------------- | ---------------
Incomplete     | 布尔（bool）          | 代码包是否是完整的，也即在载入或分析代码包及其依赖包时是否有错误发生。
Error          | \*PackageError类型    | 载入或分析代码包时发生的错误。
DepsErrors     | []\*PackageError类型  | 载入或分析依赖包时发生的错误。

表0-12 代码包结构体中与测试源码文件有关的字段

字段名称        | 字段类型              | 字段描述
-------------- | -------------------- | ---------------
TestGoFiles    | 字符串切片（[]string） | 代码包中的测试源码文件的名称列表。
TestImports    | 字符串切片（[]string） | 代码包中的测试源码文件显示导入的依赖包的导入路径的列表。
XTestGoFiles   | 字符串切片（[]string） | 代码包中的外部测试源码文件的名称列表。
XTestImports   | 字符串切片（[]string） | 代码包中的外部测试源码文件显示导入的依赖包的导入路径的列表。

代码包结构体中定义的字段很多，但有些时候我们只需要查看其中的一些字段。那要怎么做呢？标记`-f`可以满足这个需求。比如这样：

```bash
hc@ubt:~$ go list -f {{.ImportPath}} cnet/ctcp
cnet/ctcp
```

实际上，`-f`标记的默认值就是`{{.ImportPath}}`。这也正是我们在使用不加任何标记的`go list`命令时依然能看到指定代码包的导入路径的原因了。

标记`-f`的值需要满足标准库的代码包``text/template`中定义的语法。比如，`{{.S}}`代表根结构体的`S`字段的值。在`go list`命令的场景下，这个根结构体就是指定的代码包所对应的结构体。如果`S`字段的值也是一个结构体的话，那么`{{.S.F}}`就代表根结构体的`S`字段的值中的`F`字段的值。如果我们要查看`cnet/ctcp`包中的命令源码文件和库源码文件的列表，可以这样使用`-f`标记：

```bash
hc@ubt:~$ go list -f {{.GoFiles}} cnet/ctcp
[base.go tcp.go]
```

如果我们想查看不完整的代码包`cnet`的错误提示信息，还可以这样：

```bash
hc@ubt:~$ go list -e -f {{.Error.Err}} cnet
no buildable Go source files in /home/hc/golang/goc2p/src/cnet
```

我们还可以利用代码包`text/template`中定义的强大语法让`go list`命令输出定制化更高的代码包信息。比如：

```bash
hc@ubt:~$ go list -e -f 'The package {{.ImportPath}} is {{if .Incomplete}}incomplete!{{else}}complete.{{end}}' cnet
The package cnet is incomplete!

```bash 
hc@ubt:~$ go list -f 'The imports of package {{.ImportPath}} is [{{join .Imports ", "}}].' cnet/ctcp
The imports of package cnet/ctcp is [bufio, bytes, errors, logging, net, sync, time].
```

其中，`join`是命令程序在`text/template`包原有语法之上自定义的语法，在底层使用标准库代码包`strings`中的`Join`函数。关于更多的语法规则，请读者查看代码包`text/template`的相关文档。

另外，`-tags`标记也可以被`go list`接受。它与我们在讲`go build`命令时提到的`-tags`标记是一致的。读者可以查看代码包`go/build``的文档以了解细节。 

`go list`命令很有用。它可以为我们提供指定代码包的更深层次的信息。这些信息往往是我们无法从源码文件中直观看到的。