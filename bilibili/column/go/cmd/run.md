# go run

# go run



在《Go并发编程实战》的第二章中，我介绍了Go源码文件的分类。Go源码文件包括：命令源码文件、库源码文件和测试源码文件。其中，命令源码文件总应该属于`main`代码包，且在其中有无参数声明、无结果声明的main函数。单个命令源码文件可以被单独编译，也可以被单独安装（可能需要设置环境变量GOBIN）。当然，命令源码文件也可以被单独运行。我们想要运行命令源码文件就需要使用命令`go run`。

`go run`命令可以编译并运行命令源码文件。由于它其中包含了编译动作，因此它也可以接受所有可用于`go build`命令的标记。除了标记之外，`go run`命令只接受Go源码文件作为参数，而不接受代码包。与`go build`命令和`go install`命令一样，`go run`命令也不允许多个命令源码文件作为参数，即使它们在同一个代码包中也是如此。而原因也是一致的，多个命令源码文件会都有main函数声明。

如果命令源码文件可以接受参数，那么在使用`go run`命令运行它的时候就可以把它的参数放在它的文件名后面，像这样：

```bash
hc@ubt:~/golang/goc2p/src/helper/ds$ go run showds.go -p ~/golang/goc2p
```
    
在上面的示例中，我们使用`go run`命令运行命令源码文件showds.go。这个命令源码文件可以接受一个名称为“p”的参数。我们用“-p”这种形式表示“p”是一个参数名而不是参数值。它与源码文件名之间需要用空格隔开。参数值会放在参数名的后面，两者成对出现。它们之间也要用空格隔开。如果有第二个参数，那么第二个参数的参数名与第一个参数的参数值之间也要有一个空格。以此类推。

`go run`命令只能接受一个命令源码文件以及若干个库源码文件（必须同属于`main`包）作为文件参数，且不能接受测试源码文件。它在执行时会检查源码文件的类型。如果参数中有多个或者没有命令源码文件，那么`go run`命令就只会打印错误提示信息并退出，而不会继续执行。

在通过参数检查后，`go run`命令会将编译参数中的命令源码文件，并把编译后的可执行文件存放到临时工作目录中。

**编译和运行过程**

为了更直观的体现出`go run`命令中的操作步骤，我们在执行命令时加入标记`-n`，用于打印相关命令而不实际执行。现在让我们来模拟运行goc2p项目中的代码包helper/ds的命令源码文件showds.go。示例如下：

```bash
hc@ubt:~/golang/goc2p/src/helper/ds$ go run -n showds.go

#
# command-line-arguments
#

mkdir -p $WORK/command-line-arguments/_obj/
mkdir -p $WORK/command-line-arguments/_obj/exe/
cd /home/hc/golang/goc2p/src/helper/ds
/usr/local/go1.5/pkg/tool/linux_amd64/compile -o $WORK/command-line-arguments.a -trimpath $WORK -p main -complete -buildid df49387da030ad0d3bebef3f046d4013f8cb08d3 -D _/home/hc/golang/goc2p/src/helper/ds -I $WORK -pack ./showds.go
cd .
/usr/local/go1.5/pkg/tool/linux_amd64/link -o $WORK/command-line-arguments/_obj/exe/showds -L $WORK -w -extld=clang -buildmode=exe -buildid=df49387da030ad0d3bebef3f046d4013f8cb08d3 $WORK/command-line-arguments.a
$WORK/command-line-arguments/_obj/exe/showds
```

在上面的示例中并没有显示针对命令源码文件showds.go的依赖包进行编译和运行的相关打印信息。这是因为该源码文件的所有依赖包已经在之前被编译过了。

现在，我们来逐行解释这些被打印出来的信息。

以前缀“#”开始的是注释信息。我们看到信息中有三行注释信息，并在中间行出现了内容“command-line-arguments”。我们在讲`go build`命令的时候说过，编译命令在分析参数的时候如果发现第一个参数是Go源码文件而不是代码包时，会在内部生成一个名为“command-line-arguments”的虚拟代码包。所以这里的注释信息就是要告诉我们下面的几行信息是关于虚拟代码包“command-line-arguments”的。

打印信息中的“$WORK”表示临时工作目录的绝对路径。为了存放对虚拟代码包“command-line-arguments”的编译结果，命令在临时工作目录中创建了名为command-line-arguments的子目录，并在其下又创建了_obj子目录和_obj/exe子目录。

然后，命令程序使用Go语言工具目录`compile`命令对命令源码文件showds.go进行了编译，并把结果文件存放到了$WORK目录下，名为command-line-arguments.a。其中，`compile`是Go语言自带的编程工具。

在编译成功之后，命令程序使用链接命令`link`生成最终的可执行文件，并将其存于$WORK/command-line-arguments/_obj/exe/目录中。打印信息中的最后一行表示，命令运行了生成的可执行文件。

通过对这些打印出来的命令的解读，我们了解了临时工作目录的用途以和内容。

在上面的示例中，我们只是让`go run`命令打印出运行命令源码文件showds.go过程中需要执行的命令，而没有真正运行它。如果我们想真正运行命令源码文件showds.go并且想知道临时工作目录的位置，就需要去掉标记`-n`并且加上标记`-work`。当然，如果依然想看到过程中执行的命令，可以加上标记`-x`。如果读者已经看过之前我们对`go build`命令的介绍，就应该知道标记`-x`与标记`-n`一样会打印出过程执行的命令，但不同的这些命令会被真正的执行。调整这些标记之后的命令就像这样：

```bash
hc@ubt:~/golang/goc2p/src/helper/ds$ go run -x -work showds.go
```
    
当命令真正执行后，临时工作目录中就会出现实实在在的内容了，像这样：

```bash
/tmp/go-build604555989:
  command-line-arguments/
    _obj/
      exe/
        showds
  command-line-arguments.a
```
    
由于上述命令中包含了`-work`标记，所以我们可以从其输出中找到实际的工作目录（这里是/tmp/go-build604555989）。有意思的是，我们恰恰可以通过运行命令源码文件showds.go来查看这个临时工作目录的目录树：

```bash
hc@ubt:~/golang/goc2p/src/helper/ds$ go run showds.go -p /tmp/go-build604555989
```
    
读者可以自己试一试。

我们在前面介绍过，命令源码文件如果可以接受参数，则可以在执行`go run`命令运行这个命令源码文件时把参数名和参数值成对的追加在后面。实际上，如果在命令后追加参数，那么在最后执行生成的可执行文件的时候也会追加一致的参数。例如，如果这样执行命令：

```bash
hc@ubt:~/golang/goc2p/src/helper/ds$ go run -n showds.go -p ~/golang/goc2p
```

那么带`-x`或`-n`标记的命令程序打印的最后一个命令就是：

```bash
$WORK/command-line-arguments/_obj/exe/showds -p /home/hc/golang/goc2p
```
    
可见，`go run`命令会把追加到命令源码文件后面的参数原封不动的传给对应的可执行文件。

以上简要展示了一个命令源码文件从编译到运行的全过程。请记住，`go run`命令包含了两个动作：编译命令源码文件和运行对应的可执行文件。
