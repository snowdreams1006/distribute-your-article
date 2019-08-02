# go clean

# go clean


执行`go clean`命令会删除掉执行其它命令时产生的一些文件和目录，包括：

1. 在使用`go build`命令时在当前代码包下生成的与包名同名或者与Go源码文件同名的可执行文件。在Windows下，则是与包名同名或者Go源码文件同名且带有“.exe”后缀的文件。

2. 在执行`go test`命令并加入`-c`标记时在当前代码包下生成的以包名加“.test”后缀为名的文件。在Windows下，则是以包名加“.test.exe”后缀为名的文件。我们会在后面专门介绍`go test`命令。

3. 如果执行`go clean`命令时带有标记`-i`，则会同时删除安装当前代码包时所产生的结果文件。如果当前代码包中只包含库源码文件，则结果文件指的就是在工作区的pkg目录的相应目录下的归档文件。如果当前代码包中只包含一个命令源码文件，则结果文件指的就是在工作区的bin目录下的可执行文件。

4. 还有一些目录和文件是在编译Go或C源码文件时留在相应目录中的。包括：“_obj”和“_test”目录，名称为“_testmain.go”、“test.out”、“build.out”或“a.out”的文件，名称以“.5”、“.6”、“.8”、“.a”、“.o”或“.so”为后缀的文件。这些目录和文件是在执行`go build`命令时生成在临时目录中的。如果你忘记了这个临时目录是怎么回事儿，可以再回顾一下前面关于`go build`命令的介绍。临时目录的名称以`go-build`为前缀。

5. 如果执行`go clean`命令时带有标记`-r`，则还包括当前代码包的所有依赖包的上述目录和文件。

我们再以goc2p项目的`logging`为例。为了能够反复体现每个标记的作用，我们会使用标记`n`。使用标记`-n`会让命令在执行过程中打印用到的系统命令，但不会真正执行它们。如果想既打印命令又执行命令则需使用标记`-x`。现在我们来试用一下`go clean`命令：

```bash
hc@ubt:~/golang/goc2p/src$ go clean -x logging   
cd /home/hc/golang/goc2p/src/logging
rm -f logging logging.exe logging.test logging.test.exe
```
    
现在，我们加上标记`-i`：

```bash
hc@ubt:~/golang/goc2p/src$ go clean -x -i logging   
cd /home/hc/golang/goc2p/src/logging
rm -f logging logging.exe logging.test logging.test.exe
rm -f /home/hc/golang/goc2p/pkg/linux_386/logging.a
```
    
如果再加上标记`-r`又会打印出哪些命令呢？请读者自己试一试吧。