# go install

# go install


命令`go install`用于编译并安装指定的代码包及它们的依赖包。当指定的代码包的依赖包还没有被编译和安装时，该命令会先去处理依赖包。与`go build`命令一样，传给`go install`命令的代码包参数应该以导入路径的形式提供。并且，`go build`命令的绝大多数标记也都可以用于`go install`命令。实际上，`go install`命令只比`go build`命令多做了一件事，即：安装编译后的结果文件到指定目录。

在对`go install`命令进行详细说明之前，让我们先回顾一下goc2p的目录结构。为了节省篇幅，我在这里隐藏了代码包中的源码文件。如下：

```go
$HOME/golang/goc2p:
    bin/
    pkg/
    src/
        cnet/
        logging/
        helper/
            ds/
        pkgtool/
```

我们看到，goc2p项目中有三个子目录，分别是bin目录、pkg目录和src目录。现在只有src目录中包含了一些目录，而其他两个目录都是空的。

现在，我们来看看安装代码包的规则。

**安装代码包**

如果`go install`命令后跟的代码包中仅包含库源码文件，那么`go install`命令会把编译后的结果文件保存在源码文件所在工作区的pkg目录下。对于仅包含库源码文件的代码包来说，这个结果文件就是对应的代码包归档文件（也叫静态链接库文件，名称以.a结尾）。相比之下，我们在使用`go build`命令对仅包含库源码文件的代码包进行编译时，是不会在当前工作区的src目录以及pkg目录下产生任何结果文件的。结果文件会出于编译的目的被生成在临时目录中，但并不会使当前工作区目录产生任何变化。

如果我们在执行`go install`命令时不后跟任何代码包参数，那么命令将试图编译当前目录所对应的代码包。比如，我们现在要安装代码包`pkgtool`：

```go
hc@ubt:~/golang/goc2p/src/pkgtool$ go install -v -work
WORK=D:\cygwin\tmp\go-build758586887
pkgtool
```

我们在前面说过，执行`go install`命令后会对指定代码包先编译再安装。其中，编译代码包使用了与`go build`命令相同的程序。所以，执行`go install`命令后也会首先建立一个名称以go-build为前缀的临时目录。如果我们想强行重新安装指定代码包及其依赖包，那么就需要加入标记`-a`:

```go
hc@ubt:~/golang/goc2p/src/pkgtool$ go install -a -v -work
WORK=/tmp/go-build014992994
runtime
errors
sync/atomic
unicode
unicode/utf8
sort
sync
io
syscall
strings
bytes
bufio
time
os
path/filepath
pkgtool
```

可以看到，代码包`pkgtool`仅仅依赖了Go语言标准库中的代码包。

现在我们再来查看一下goc2p项目目录：

```go
$HOME/golang/goc2p:
    bin/
    pkg/
        linux_386/
            pkgtool.a
        src/
```

现在pkg目录中多了一个子目录。读过0.0节的读者应该已经知道，linux_386被叫做平台相关目录。它的名字可以由`${GOOS}_${GOARCH}`来得到。其中，`${GOOS}`和`${GOARCH}`分别是当前操作系统中的环境变量GOOS和GOARCH的值。如果它们不存在，那么Go语言就会使用其内部的预定值。上述示例在计算架构为386且操作系统为Linux的计算机上运行。所以，这里的平台相关目录即为linux_386。我们还看到，在goc2p项目中的平台相关目录下存在一个文件，名称是pkgtool.a。这就是代码包`pkgtool`的归档文件，文件名称是由代码包名称与“.a”后缀组合而来的。

实际上，代码包的归档文件并不都会被直接保存在pkg目录的平台相关目录下，还可能被保存在这个平台相关目录的子目录下。 下面我们来安装`cnet/ctcp`包：

```go
hc@ubt:~/golang/goc2p/src/pkgtool$ go install -a -v -work ../cnet/ctcp
WORK=/tmp/go-build083178213
runtime
errors
sync/atomic
unicode
unicode/utf8
math
sync
sort
io
syscall
internal/singleflight
bytes
strings
strconv
bufio
math/rand
time
reflect
os
fmt
log
runtime/cgo
logging
net
cnet/ctcp
```

请注意，我们是在代码包`pkgtool`对应的目录下安装`cnet/ctcp`包的。我们使用了一个目录相对路径。

实际上，这种提供代码包位置的方式被叫做本地代码包路径方式，也是被所有Go命令接受的一种方式，这包括之前已经介绍过的`go build`命令。但是需要注意的是，本地代码包路径只能以目录相对路径的形式呈现，而不能使用目录绝对路径。请看下面的示例：

```go
hc@ubt:~/golang/goc2p/src/cnet/ctcp$ go install -v -work ~/golang/goc2p/src/cnet/ctcp
can't load package: package /home/hc/golang/goc2p/src/cnet/ctcp: import "/home/hc/golang/goc2p/src/cnet/ctcp": cannot import absolute path
```

从上述示例中的命令提示信息我们可知，以目录绝对路径的形式提供代码包位置是不会被Go命令认可的。

这是由于Go认为本地代码包路径的表示只能以“./”或“../”开始，再或者直接为“.”或“..”，而代码包的代码导入路径又不允许以“/”开始。所以，这种用绝对路径表示代码包位置的方式也就不能被支持了。

上述规则适用于所有Go命令。读者可以自己尝试一下，比如在执行`go build`命令时分别以代码包导入路径、目录相对路径和目录绝对路径的形式提供代码包位置，并查看执行结果。

我们已经通过上面的示例强行的重新安装了`cnet/ctcp`包及其依赖包。现在我们再来看一下goc2p的项目目录：

```go
$HOME/golang/goc2p:
    bin/
    pkg/
        linux_386/
            /cnet
                ctcp.a
            logging.a
            pkgtool.a
    src/
```

我们发现在pkg目录的平台相关目录下多了一个名为cnet的目录，而在这个目录下的就是名为ctcp.a的代码包归档文件。由此我们可知，代码包归档文件的存放目录的相对路径（相对于当前工作区的pkg目录的平台相关目录）即为代码包导入路径除去最后一个元素后的路径。而代码包归档文件的名称即为代码包导入路径中的最后一个元素再加“.a”后缀。再举一个例子，如果代码包导入路径为x/y/z，则它的归档文件存放路径的相对路径即为x/y/，而这个归档文件的名称即为z.a。

回顾代码包`pkgtool`的归档文件的存放路径。因为它的导入路径中只有一个元素，所以其归档文件就被直接存放到了goc2p项目的pkg目录的平台相关目录下了。

此外，我们还发现pkg目录的平台相关目录下还有一个名为logging.a的文件。很显然，我们并没有显式的安装代码包`logging`。这是因为`go install`命令在安装指定的代码包之前，会先去安装指定代码包的依赖包。当依赖包被正确安装后，指定的代码包的安装才会开始。由于代码包`cnet/ctcp`依赖于goc2p项目（即当前工作区）中的代码包`logging`，所以当代码包`logging`被成功安装之后，代码包`cnet/ctcp`才会被安装。

还有一个问题：上述的安装过程涉及到了那么多代码包，那为什么goc2p项目的pkg目录中只包含该项目中代码包的归档文件呢？实际上，`go install`命令会把标准库中的代码包的归档文件存放到Go语言安装目录的pkg子目录中，而把指定代码包依赖的第三方项目的代码包的归档文件存放到当前工作区的pkg目录下。这样就实现了Go语言标准库代码包的归档文件与用户代码包的归档文件，以及处在不同工作区的用户代码包的归档文件之间的分离。

**安装命令源码文件**

除了安装代码包之外，`go install`命令还可以安装命令源码文件。为了看到安装命令源码文件是goc2p项目目录的变化，我们先把该目录还原到原始状态，即清除bin子目录和pkg子目录下的所有目录和文件。然后，我们来安装代码包`helper/ds`下的命令源码文件showds.go，如下：

```go
hc@ubt:~/golang/goc2p/src$ go install helper/ds/showds.go
go install: no install location for .go files listed on command line (GOBIN not set)
```

这次我们没能成功安装。该Go命令认为目录/home/hc/golang/goc2p/src/helper/ds不在环境GOPATH中。我们可以通过Linux的`echo`命令来查看一下环境变量GOPATH的值：

```go
hc@ubt:~/golang/goc2p/src$ echo $GOPATH
/home/hc/golang/lib:/home/hc/golang/goc2p
```

环境变量GOPATH的值中确实包含了goc2p项目的根目录。这到底是怎么回事呢？

我通过查看Go命令的源码文件找到了其根本原因。在上一小节我们提到过，在环境变量GOPATH中包含多个工作区目录路径时，我们需要在编译命令源码文件前先对环境变量GOBIN进行设置。实际上，这个环境变量所指的目录路径就是命令程序生成的结果文件的存放目录。`go install`命令会把相应的可执行文件放置到这个目录中。

由于命令`go build`在编译库源码文件后不会产生任何结果文件，所以自然也不用会在意结果文件的存放目录。在该命令编译单一的命令源码文件或者包含一个命令源码文件和多个库源码文件时，在结果文件存放目录无效的情况下会将结果文件（也就是可执行文件）存放到执行该命令时所在的目录下。因此，即使环境变量GOBIN的值无效，我们在执行`go build`命令时也不会见到这个错误提示信息。

然而，`go install`命令中一个很重要的步骤就是将结果文件（归档文件或者可执行文件）存放到相应的目录中。所以，`go install`命令在安装命令源码文件时，如果环境变量GOBIN的值无效，则它会在最后检查结果文件存放目录的时候发现这一问题，并打印与上述示例所示内容类似的错误提示信息，最后直接退出。

这个错误提示信息在我们安装多个库源码文件时也有可能遇到。示例如下：

```go
hc@ubt:~/golang/goc2p/src/pkgtool$ go install envir.go fpath.go ipath.go pnode.go util.go
go install: no install location for .go files listed on command line (GOBIN not set)
```

而且，在我们为环境变量GOBIN设置了正确的值之后，这个错误提示信息仍然会出现。这是因为，只有在安装命令源码文件的时候，命令程序才会将环境变量GOBIN的值作为结果文件的存放目录。而在安装库源码文件时，在命令程序内部的代表结果文件存放目录路径的那个变量不会被赋值。最后，命令程序会发现它依然是个无效的空值。所以，命令程序会同样返回一个关于“无安装位置”的错误。这就引出一个结论，我们只能使用安装代码包的方式来安装库源码文件，而不能在`go install`命令罗列并安装它们。另外，`go install`命令目前无法接受标记`-o`以自定义结果文件的存放位置。这也从侧面说明了`go install`命令不支持针对库源码文件的安装操作。

至此，我们对怎样用`go install`命令来安装代码包以及命令源码文件进行了说明。如果你已经熟知了`go build`命令，那么理解这些内容应该不在话下。