# go 学习笔记

![go-index-gopher.jpg](../images/go-index-gopher.jpg)

`Go` 是一种开源编程语言,可以轻松构建**简单**,**可靠**,**高效**的软件.

> 摘录自 github: [https://github.com/golang/go](https://github.com/golang/go),其中官网(国外): [https://golang.org](https://golang.org) 和官网(国内): [https://golang.google.cn/](https://golang.google.cn/)

`Go` 是 `Google` 公司推出的静态强类型,编译型,并发型,并具有垃圾回收功能的开源编程语言,最初由 `Robert Griesemer` , `Rob Pike` ,`Ken Thompson` 三人主持开发,后来陆续加入其他开发者,最终于 2009 年 11 月正式开源.

## 创始人都是大神

`Go`  的三位主要创始人分别是: 罗伯特·格瑞史莫(`Robert Griesemer`),和肯·汤普逊(`Ken Thompson`)

- 罗伯特·格瑞史莫(`Robert Griesemer`)

`JS V8` 引擎,`Chubby` ,`Java HotSpot` 虚拟机,`Sawzall` 语言和 `Strongtalk` 系统

![go-index-robert-griesemer.jpg](../images/go-index-robert-griesemer.jpg)

> github: [https://github.com/griesemer](https://github.com/griesemer)

- 罗勃·派克(`Rob Pike`)

`Plan 9` 操作系统和`UTF-8` 编码

![go-index-Rob-pike.png](../images/go-index-Rob-pike.png)

> github: [https://github.com/robpike](https://github.com/robpike)

- 肯·汤普逊(`Ken Thompson`)

`UNIX` 操作系统 ,`Plan 9` 操作系统,`B` 语言,`UTF-8` 编码

![go-index-thompson.jpg](../images/go-index-thompson.jpg)

> github: [https://github.com/ken](https://github.com/ken)

如此厉害的三位大牛合作创作的 `Go` 语言还能差到哪里去呢?

![go-index-creator.jpg](../images/go-index-creator.jpg)

## 吉祥物也很可爱

原来的 `logo` 是一只可爱的囊地鼠,英文名叫 `gopher`.

![go-index-logo-old.png](../images/go-index-logo-old.png)

新的 `logo` 是现代化图标,代表更快更强,体现速度和效率.

![go-index-logo-new.png](../images/go-index-logo-new.png)

网上流传甚广的一组很萌很可爱的吉祥物,并附上 github 链接: [https://github.com/tenntenn/gopher-stickers](https://github.com/tenntenn/gopher-stickers)

![go-index-logo-gopher-stickers.png](../images/go-index-logo-gopher-stickers.png)

## 体验 go 语言魅力

- 案例一

> `fmt.Println("Hello, 世界")` : 输出字符串并换行

```go
package main

import "fmt"

func main() {
  fmt.Println("Hello, 世界")
}
```

![go-index-helloworld.png](../images/go-index-helloworld.png)

- 案例二

> `a, b = b, a` : 互换变量`a` 和 `b` 的值,而其他语言一般都需要引入临时变量.

```go
package main

import "fmt"

func main() {
    var a = 3
    var b = 4
    fmt.Println(a, b)
    a, b = b, a
    fmt.Println(a, b)
}
```

![go-index-exchange.png](../images/go-index-exchange.png)

- 案例三

> `go` + `chan` 关键字轻松完成并行计算

```go
package main

import (
    "fmt"
    "math"
)

func main() {
    fmt.Println(pi(5000))
}

func pi(n int) float64 {
    ch := make(chan float64)
    for k := 0; k <= n; k++ {
        go term(ch, float64(k))
    }
    f := 0.0
    for k := 0; k <= n; k++ {
        f += <-ch
    }
    return f
}

func term(ch chan float64, k float64) {
    ch <- 4 * math.Pow(-1, k) / (2*k + 1)
}
```

![go-index-concurrentpi.png](../images/go-index-concurrentpi.png)

## 到底好用不好用

`Go` 语言是云计算时代的 `C` 语言也称为21 世纪的 `C` 语言,由此可见,`Go` 的地位非同一般.

`Go` 语言的诞生是为了提高生产效率,专门对多处理器系统应用程序的编程进行了优化,使用Go编译的程序可以媲美C或C++代码的速度,而且更加安全,支持并行进程.

- 运行效率高,开发高效,部署简单.

> 运行效率高是因为编译性语言与解释性语言相比,开发高效是语法简单,部署简单是直接部署编译后的程序.

- 语言层面支持并发,易于利用多核实现并发.

> 不同于 php,只需要 go 配合 channel 即可完成进程或线程所做的工作.

- 内置 `runtime` 并支持垃圾回收

> 类似 `Java` 虚拟机支持垃圾回收,不必手动进行内存管理.

- 简单易学,丰富的标准库,强大的网络库.

> 学习成本低,语法简单但表达能力强,支持函数式编程,面向对象编程等多种编程范式.

- 内置强大的工具(`gofmt`),跨平台编译,内嵌`C`支持.

> 不同的人有不同的代码风格,可转化统一风格

## 志同道合有几人

- `Docker` : 是为开发人员构建和运行应用程序而构建的平台

![go-index-docker.png](../images/go-index-docker.png)

> [https://www.docker.com/](https://www.docker.com/)

- `Kubernetes` : 自动化容器部署,扩展,管理的应用程序

![go-index-k8s.png](../images/go-index-k8s.png)

> [https://kubernetes.io/](https://kubernetes.io/)

- `Etcd` : 分布式键值对存储系统

![go-index-etcd.png](../images/go-index-etcd.png)

> [https://etcd.io/](https://etcd.io/)

- `baidu-netdisk-downloaderx` : 一款图形界面的百度网盘不限速下载器,支持 `Windows` , `Linux` 和 `Mac`

![go-index-baidu-netdisk-downloaderx-BND2.png](../images/go-index-baidu-netdisk-downloaderx-BND2.png)

> [https://github.com/b3log/baidu-netdisk-downloaderx](https://github.com/b3log/baidu-netdisk-downloaderx)

- `pan-light` : 百度网盘不限速客户端, `golang + qt5`, 跨平台图形界面

![go-index-pan-light.png](../images/go-index-pan-light.png)

> [https://github.com/peterq/pan-light](https://github.com/peterq/pan-light)

## 自学技术哪家强

- [https://golang.org/](https://golang.org/) : The Go Programming Language
- [https://golang.google.cn/](https://golang.google.cn/) : The Go Programming Language
- [https://tour.go-zh.org/welcome/1](https://tour.go-zh.org/welcome/1) : Go 语言之旅
- [https://studygolang.com/](https://studygolang.com/) : Go语言中文网- Golang中文社区
- [https://www.runoob.com/go/go-tutorial.html](https://www.runoob.com/go/go-tutorial.html) : Go 语言教程| 菜鸟教程

## 自问自答解疑惑

- `go` 和 `golang` 是什么关系?

`go` 是 `golang` 的简称,`golang` 是 `go language` 的缩写,即 `go 语言`.

- `go` 的常用 `IDE` 有哪些?

独立集成工具主要有 `LiteIDE` 和 `GoLand` 两种,但是常见 `IDE` 基本上均提供各种 `Go` 插件,支持 `Windows` ,`MacOS` 和 `Linux` 常见操作系统.

- `go` 的常见 `Web` 开发框架有哪些?

`Beego` ,`Iris` 和 `Gin` 等,国人用的比较多是 `Beego`,目前资料也比较齐全.

## 无总结不成文章

`Go` 是 `Google` 出品的开源编程语言,出身名门注定不凡,并且拥有十分活跃的社区环境.

国内使用 `Go` 语言比较早的公司主要有七牛云和 `beego`,其中七牛云主要是云存储方面的业务,这也正是 `Go` 支持高并发分布式的特色,而 `Beego` 是 `Go` 的 `Web` 开发框架,支持 `MVC` 编程模型,不愧是国人开发深受国人喜爱.

同时,今年著名的 `bilibili` 源代码泄露事件也让我们看到了 `Go` 的身影,侧面说明了 `Go` 越来越流行,不愧是 21 世纪的 `C` 语言啊!

好了,暂时没有别的废话了,本文到此为止,下一章将开始介绍 `Go` 语言的环境搭建与 `IDE` 的基本配置,敬请期待.