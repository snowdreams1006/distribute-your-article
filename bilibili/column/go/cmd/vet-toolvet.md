# go vet 与 go tool vet

# go vet与go tool vet

命令```go vet```是一个用于检查Go语言源码中静态错误的简单工具。与大多数Go命令一样，```go vet```命令可以接受```-n```标记和```-x```标记。```-n```标记用于只打印流程中执行的命令而不真正执行它们。```-n```标记也用于打印流程中执行的命令，但不会取消这些命令的执行。示例如下：

    hc@ubt:~$ go vet -n pkgtool
    /usr/local/go/pkg/tool/linux_386/vet golang/goc2p/src/pkgtool/envir.go golang/goc2p/src/pkgtool/envir_test.go golang/goc2p/src/pkgtool/fpath.go golang/goc2p/src/pkgtool/ipath.go golang/goc2p/src/pkgtool/pnode.go golang/goc2p/src/pkgtool/util.go golang/goc2p/src/pkgtool/util_test.go

```go vet```命令的参数既可以是代码包的导入路径，也可以是Go语言源码文件的绝对路径或相对路径。但是，这两种参数不能混用。也就是说，```go vet```命令的参数要么是一个或多个代码包导入路径，要么是一个或多个Go语言源码文件的路径。

```go vet```命令是```go tool vet```命令的简单封装。它会首先载入和分析指定的代码包，并把指定代码包中的所有Go语言源码文件和以“.s”结尾的文件的相对路径作为参数传递给```go tool vet```命令。其中，以“.s”结尾的文件是汇编语言的源码文件。如果```go vet```命令的参数是Go语言源码文件的路径，则会直接将这些参数传递给```go tool vet```命令。

如果我们直接使用```go tool vet```命令，则其参数可以传递任意目录的路径，或者任何Go语言源码文件和汇编语言源码文件的路径。路径可以是绝对的也可以是相对的。

实际上，```vet```属于Go语言自带的特殊工具，也是比较底层的命令之一。Go语言自带的特殊工具的存放路径是$GOROOT/pkg/tool/$GOOS_$GOARCH/，我们暂且称之为Go工具目录。我们再来复习一下，环境变量GOROOT的值即Go语言的安装目录，环境变量GOOS的值代表程序构建环境的目标操作系统的标识，而环境变量$GOARCH的值则为程序构建环境的目标计算架构。另外，名为$GOOS_$GOARCH的目录被叫做平台相关目录。Go语言允许我们通过执行```go tool```命令来运行这些特殊工具。在Linux 32bit的环境下，我们的Go语言安装目录是/usr/local/go/。因此，```go tool vet```命令指向的就是被存放在/usr/local/go/pkg/tool/linux_386目录下的名为```vet```的工具。

```go tool vet```命令的作用是检查Go语言源代码并且报告可疑的代码编写问题。比如，在调用```Printf```函数时没有传入格式化字符串，以及某些不标准的方法签名，等等。该命令使用试探性的手法检查错误，因此并不能保证报告的问题确实需要解决。但是，它确实能够找到一些编译器没有捕捉到的错误。

```go tool vet```命令程序在被执行后会首先解析标记并检查标记值。```go tool vet```命令支持的所有标记如下表。

_表0-16 ```go tool vet```命令的标记说明_
<table class="table table-bordered table-striped table-condensed">
   <tr>
    <th width=120px>
      标记名称
    </th>
    <th>
      标记描述
    </th>
  </tr>
  <tr>
    <td>
      -all
    </td>
    <td>
      进行全部检查。如果有其他检查标记被设置，则命令程序会将此值变为false。默认值为true。
    </td>
  </tr>
  <tr>
    <td>
      -asmdecl
    </td>
    <td>
      对汇编语言的源码文件进行检查。默认值为false。
    </td>
  </tr>
  <tr>
    <td>
      -assign
    </td>
    <td>
      检查赋值语句。默认值为false。
    </td>
  </tr>
  <tr>
    <td>
      -atomic
    </td>
    <td>
      检查代码中对代码包sync/atomic的使用是否正确。默认值为false。
    </td>
  </tr>
  <tr>
    <td>
      -buildtags
    </td>
    <td>
      检查编译标签的有效性。默认值为false。
    </td>
  </tr>
  <tr>
    <td>
      -composites
    </td>
    <td>
      检查复合结构实例的初始化代码。默认值为false。
    </td>
  </tr>
  <tr>
    <td>
      -compositeWhiteList
    </td>
    <td>
      是否使用复合结构检查的白名单。仅供测试使用。默认值为true。
    </td>
  </tr>
  <tr>
    <td>
      -methods
    </td>
    <td>
      检查那些拥有标准命名的方法的签名。默认值为false。
    </td>
  </tr>
  <tr>
    <td>
      -printf
    </td>
    <td>
      检查代码中对打印函数的使用是否正确。默认值为false。
    </td>
  </tr>
  <tr>
    <td>
      -printfuncs
    </td>
    <td>
      需要检查的代码中使用的打印函数的名称的列表，多个函数名称之间用英文半角逗号分隔。默认值为空字符串。
    </td>
  </tr>
  <tr>
    <td>
      -rangeloops
    </td>
    <td>
      检查代码中对在```range```语句块中迭代赋值的变量的使用是否正确。默认值为false。
    </td>
  </tr>
  <tr>
    <td>
      -structtags
    </td>
    <td>
      检查结构体类型的字段的标签的格式是否标准。默认值为false。
    </td>
  </tr>
  <tr>
    <td>
      -unreachable
    </td>
    <td>
      查找并报告不可到达的代码。默认值为false。
    </td>
  </tr>
</table>

在阅读上面表格中的内容之后，读者可能对这些标签的具体作用及其对命令程序检查步骤的具体影响还很模糊。不过没关系，我们下面就会对它们进行逐一的说明。

**-all标记**

如果标记```-all```有效（标记值不为```false```），那么命令程序会对目标文件进行所有已知的检查。实际上，标记```-all```的默认值就是```true```。也就是说，在执行```go tool vet```命令且不加任何标记的情况下，命令程序会对目标文件进行全面的检查。但是，只要有一个另外的标记（```-compositeWhiteList```和```-printfuncs```这两个标记除外）有效，命令程序就会把标记```-all```设置为false，并只会进行与有效的标记对应的检查。

**-assign标记**

如果标记```-assign```有效（标记值不为```false```），则命令程序会对目标文件中的赋值语句进行自赋值操作检查。什么叫做自赋值呢？简单来说，就是将一个值或者实例赋值给它本身。像这样：

    var s1 string = "S1"
    s1 = s1 // 自赋值

或者

    s1, s2 := "S1", "S2"
    s2, s1 = s2, s1 // 自赋值

检查程序会同时遍历等号两边的变量或者值。在抽象语法树的语境中，它们都被叫做表达式节点。检查程序会检查等号两边对应的表达式是否相同。判断的依据是这两个表达式节点的字符串形式是否相同。在当前的场景下，这种相同意味着它们的变量名是相同的。如前面的示例。

有两种情况是可以忽略自赋值检查的。一种情况是短变量声明语句。根据Go语言的语法规则，当我们在函数中要在声明局部变量的同时对其赋值，就可以使用```:=```形式的变量赋值语句。这也就意味着```:=```左边的变量名称在当前的上下文环境中应该还未曾出现过（否则不能通过编译）。因此，在这种赋值语句中不可能出现自赋值的情况，忽略对它的检查也是合理的。另一种情况是等号左右两边的表达式个数不相等的变量赋值语句。如果在等号的右边是对某个函数或方法的调用，就会造成这种情况。比如：

    file, err := os.Open(wp)

很显然，这个赋值语句肯定不是自赋值语句。因此，不需要对此种情况进行检查。如果等号右边并不是对函数或方法调用的表达式，并且等号两边的表达式数量也不相等，那么势必会在编译时引发错误，也不必检查。

**-atomic标记**

如果标记```-atomic```有效（标记值不为```false```），则命令程序会对目标文件中的使用代码包```sync/atomic```进行原子赋值的语句进行检查。原子赋值语句像这样：

    var i32 int32
    i32 = 0
    newi32 := atomic.AddInt32(&i32, 3)
    fmt.Printf("i32: %d, newi32: %d.\n", i32, newi32)

函数```AddInt32```会原子性的将变量```i32```的值加```3```，并返回这个新值。因此上面示例的打印结果是：

    i32: 3, newi32: 3

在代码包```sync/atomic```中，与```AddInt32```类似的函数还有```AddInt64```、```AddUint32```、```AddUint64```和```AddUintptr```。检查程序会对上述这些函数的使用方式进行检查。检查的关注点在破坏原子性的使用方式上。比如：

    i32 = 1
    i32 = atomic.AddInt32(&i32, 3)
    _, i32 = 5, atomic.AddInt32(&i32, 3)
    i32, _ = atomic.AddInt32(&i32, 1), 5 

上面示例中的后三行赋值语句都属于原子赋值语句，但它们都破坏了原子赋值的原子性。以第二行的赋值语句为例，等号左边的```atomic.AddInt32(&i32, 3)```的作用是原子性的将变量```i32```的值增加```3```。但该语句又将函数的结果值赋值给变量```i32```，这个二次赋值属于对变量```i32```的重复赋值，也使原本拥有原子性的赋值操作被拆分为了两个步骤的非原子操作。如果在对变量```i32```的第一次原子赋值和第二次非原子的重复赋值之间又有另一个程序对变量```i32```进行了原子赋值，那么当前程序中的这个第二次赋值就破坏了那两次原子赋值本应有的顺序性。因为，在另一个程序对变量```i32```进行原子赋值后，当前程序中的第二次赋值又将变量```i32```的值设置回了之前的值。这显然是不对的。所以，上面示例中的第二行代码应该改为：

    atomic.AddInt32(&i32, 3)

并且，对第三行和第四行的代码也应该有类似的修改。检查程序如果在目标文件中查找到像上面示例的第二、三、四行那样的语句，就会打印出相应的错误信息。

另外，上面所说的导致原子性被破坏的重复赋值语句还有一些类似的形式。比如：

    i32p := &i32
    *i32p = atomic.AddUint64(i32p, 1)

这与之前的示例中的代码的含义几乎是一样。另外还有：

    var counter struct{ N uint32 }
    counter.N = atomic.AddUint64(&counter.N, 1) 

和

    ns := []uint32{10, 20}
    ns[0] = atomic.AddUint32(&ns[0], 1)
    nps := []*uint32{&ns[0], &ns[1]}
    *nps[0] = atomic.AddUint32(nps[0], 1)

在最近的这两个示例中，虽然破坏原子性的重复赋值操作因结构体类型或者数组类型的介入显得并不那么直观了，但依然会被检查程序发现并及时打印错误信息。

顺便提一句，对于原子赋值语句和普通赋值语句，检查程序都会忽略掉对等号两边的表达式的个数不相等的赋值语句的检查。

**-buildtags标记**

前文已提到，如果标记```-buildtags```有效（标记值不为```false```），那么命令程序会对目标文件中的编译标签（如果有的话）的格式进行检查。什么叫做条件编译？在实际场景中，有些源码文件中包含了平台相关的代码。我们希望只在某些特定平台下才编译它们。这种有选择的编译方法就被叫做条件编译。在Go语言中，条件编译的配置就是通过编译标签来完成的。编译器需要依据源码文件中编译标签的内容来决定是否编译当前文件。编译标签可必须出现在任何源码文件（比如扩展名为“.go”，“.h”，“.c”，“.s”等的源码文件) 的头部的单行注释中，并且在其后面需要有空行。

至于编译标签的具体写法，我们就不在此赘述了。读者可以参看Go语言官方的相关文档。我们在这里只简单罗列一下```-buildtags```有效时命令程序对编译标签的检查内容：

1. 若编译标签前导符“+build”后没有紧随空格，则打印格式错误信息。

2. 若编译标签所在行与第一个多行注释或代码行之间没有空行，则打印错误信息。

3. 若在某个单一参数的前面有两个英文叹号“!!”，则打印错误信息。

4. 若单个参数包含字母、数字、“_”和“.”以外的字符，则打印错误信息。

5. 若出现在文件头部单行注释中的编译标签前导符“+build”未紧随在单行注释前导符“//”之后，则打印错误信息。

如果一个在文件头部的单行注释中的编译标签通过了上述的这些检查，则说明它的格式是正确无误的。由于只有在文件头部的单行注释中编译标签才会被编译器认可，所以检查程序只会查找和检查源码文件中的第一个多行注释或代码行之前的内容。

**-composites标记和-compositeWhiteList标记**

如果标记```-composites```有效（标记值不为```false```），则命令程序会对目标文件中的复合字面量进行检查。请看如下示例：

    type counter struct {
        name   string
        number int
    }
    ...
    c := counter{name: "c1", number: 0}


在上面的示例中，代码```counter{name: "c1", number: 0}```是对结构体类型```counter```的初始化。如果复合字面量中涉及到的类型不在当前代码包内部且未在所属文件中被导入，那么检查程序不但会打印错误信息还会将退出代码设置为1，并且取消后续的检查。退出代码为1意味着检查程序已经报告了一个或多个问题。这个问题比仅仅引起错误信息报告的问题更加严重。

在通过上述检查的前提下，如果复合字面量中包含了对结构体类型的字段的赋值但却没有指明字段名，像这样：

    var v = flag.Flag{
        "Name",
        "Usage",
        nil, // Value
        "DefValue",
    }

那么检查程序也会打印错误信息，以提示在复合字面量中包含有未指明的字段赋值。

这有一个例外，那就是当标记```-compositeWhiteList```有效（标记值不为```false```）的时候。只要类型在白名单中，即使其初始化语句中含有未指明的字段赋值也不会被提示。这是出于什么考虑呢？先来看下面的示例：

    type sliceType []string
    ...
    st1 := sliceType{"1", "2", "3"}

上面示例中的```sliceType{"1", "2", "3"}```也属于复合字面量。但是它初始化的类型实际上是一个切片值，只不过这个切片值被别名化并被包装为了另一个类型而已。在这种情况下，复合字面量中的赋值不需要指明字段，事实上这样的类型也不包含任何字段。白名单中所包含的类型都是这种情况。它们是在标准库中的包装了切片值的类型。它们不需要被检查，因为这种情况是合理的。

在默认情况下，标记```-compositeWhiteList```是有效的。也就是说，检查程序不会对它们的初始化代码进行检查，除非我们在执行```go tool vet```命令时显示的将```-compositeWhiteList```标记的值设置为false。

**-methods标记**

如果标记```-methods```有效（标记值不为```false```），则命令程序会对目标文件中的方法定义进行规范性的进行检查。这里所说的规范性是狭义的。

在检查程序内部存有一个规范化方法字典。这个字典的键用来表示方法的名称，而字典的元素则用来描述方法应有的参数和结果的类型。在该字典中列出的都是Go语言标准库中使用最广泛的接口类型的方法。这些方法的名字都非常通用。它们中的大多数都是它们所属接口类型的唯一方法。我们在第4章中提到过，Go语言中的接口类型实现方式是非侵入式的。只要结构体类型实现了某一个接口类型中的所有方法，就可以说这个结构体类型是该接口类型的一个实现。这种判断方式被称为动态接口检查。它只在运行时进行。如果我们想让一个结构体类型成为某一个接口类型的实现，但又写错了要实现的接口类型中的方法的签名，那么也不会引发编译器报错。这里所说的方法签名包括方法的参数声明列表和结果声明列表。虽然动态接口检查失败时并不会报错，但是它却会间接的引发其它错误。而这些被间接引发的错误只会在运行时发生。示例如下：

    type MySeeker struct {
        // 忽略字段定义
    }
    
    func (self *MySeeker) Seek(whence int, offset int64) (ret int64, err error) { 
        // 想实现接口类型io.Seeker中的唯一方法，但是却把参数的顺序写颠倒了。
        // 忽略实现代码
    }
    
    func NewMySeeker io.Seeker {
        return &MySeeker{/* 忽略字段初始化 */} // 这里会引发一个运行时错误。
                                               //由于MySeeker的Seek方法的签名写错了，所以MySeeker不是io.Seeker的实现。
    }
    
这种运行时错误看起来会比较诡异，并且错误排查也会相对困难，所以应该尽量避免。```-methods```标记所对应的检查就是为了达到这个目的。检查程序在发现目标文件中某个方法的名字被包含在规范化方法字典中但其签名与对应的描述不对应的时候，就会打印错误信息并设置退出代码为1。

我在这里附上在规范化方法字典中列出的方法的信息：

_表0-17 规范化方法字典中列出的方法_
<table class="table table-bordered table-striped table-condensed">
   <tr>
    <th width=100px>
      方法名称
    </th>
    <th width=90px>
      参数类型
    </th>
    <th width=90px>
      结果类型
    </th>
    <th width=80px>
      所属接口
    </th>
    <th width=60px>
      唯一方法
    </th>
  </tr>
  <tr>
    <td>
      Format
    </td>
    <td>
      "fmt.State", "rune"
    </td>
    <td>
      <无>
    </td>
    <td>
      fmt.Formatter
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      GobDecode
    </td>
    <td>
      "[]byte"
    </td>
    <td>
      "error"
    </td>
    <td>
      gob.GobDecoder
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      GobEncode
    </td>
    <td>
      <无>
    </td>
    <td>
      "[]byte", "error"
    </td>
    <td>
      gob.GobEncoder
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      MarshalJSON
    </td>
    <td>
      <无>
    </td>
    <td>
      "[]byte", "error"
    </td>
    <td>
      json.Marshaler
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      Peek
    </td>
    <td>
      "int"
    </td>
    <td>
      "[]byte", "error"
    </td>
    <td>
      image.reader
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      ReadByte
    </td>
    <td>
      "int"
    </td>
    <td>
      "[]byte", "error"
    </td>
    <td>
      io.ByteReader
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      ReadFrom
    </td>
    <td>
      "io.Reader"
    </td>
    <td>
      "int64", "error"
    </td>
    <td>
      io.ReaderFrom
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      ReadRune
    </td>
    <td>
      <无>
    </td>
    <td>
      "rune", "int", "error"
    </td>
    <td>
      io.RuneReader
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      Scan
    </td>
    <td>
      "fmt.ScanState", "rune"
    </td>
    <td>
      "error"
    </td>
    <td>
      fmt.Scanner
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      Seek
    </td>
    <td>
      "int64", "int"
    </td>
    <td>
      "int64", "error"
    </td>
    <td>
      io.Seeker
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      UnmarshalJSON
    </td>
    <td>
      "[]byte"
    </td>
    <td>
      "error"
    </td>
    <td>
      json.Unmarshaler
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      UnreadByte
    </td>
    <td>
      <无>
    </td>
    <td>
      "error"
    </td>
    <td>
      io.ByteScanner
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      UnreadRune
    </td>
    <td>
      <无>
    </td>
    <td>
      "error"
    </td>
    <td>
      io.RuneScanner
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      WriteByte
    </td>
    <td>
      "byte"
    </td>
    <td>
      "error"
    </td>
    <td>
      io.ByteWriter
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      WriteTo
    </td>
    <td>
      "io.Writer"
    </td>
    <td>
      "int64", "error"
    </td>
    <td>
      io.WriterTo
    </td>
    <td>
      是
    </td>
  </tr>
</table>

**-printf标记和-printfuncs标记**

标记```-printf```旨在目标文件中检查各种打印函数使用的正确性。而标记```-printfuncs```及其值则用于明确指出需要检查的打印函数。```-printfuncs```标记的默认值为空字符串。也就是说，若不明确指出检查目标则检查所有打印函数。可被检查的打印函数如下表：

_表0-18 格式化字符串中动词的格式要求_
<table class="table table-bordered table-striped table-condensed">
   <tr>
    <th width=120px>
      函数全小写名称
    </th>
    <th width=120px>
      支持格式化
    </th>
    <th width=120px>
      可自定义输出
    </th>
    <th width=120px>
      自带换行
    </th>
  </tr>
  <tr>
    <td>
      error
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      fatal
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      fprint
    </td>
    <td>
      否
    </td>
    <td>
      是
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      fprintln
    </td>
    <td>
      否
    </td>
    <td>
      是
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      panic
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      panicln
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      print
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      println
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      sprint
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      sprintln
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
    <td>
      是
    </td>
  </tr>
  <tr>
    <td>
      errorf
    </td>
    <td>
      是
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      fatalf
    </td>
    <td>
      是
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      fprintf
    </td>
    <td>
      是
    </td>
    <td>
      是
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      panicf
    </td>
    <td>
      是
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      printf
    </td>
    <td>
      是
    </td>
    <td>
      否
    </td>
    <td>
      否
    </td>
  </tr>
  <tr>
    <td>
      sprintf
    </td>
    <td>
      是
    </td>
    <td>
      是
    </td>
    <td>
      否
    </td>
  </tr>
</table>

以字符串格式化功能来区分，打印函数可以分为可打印格式化字符串的打印函数（以下简称格式化打印函数）和非格式化打印函数。对于格式化打印函数来说，其第一个参数必是格式化表达式，也可被称为模板字符串。而其余参数应该为需要被填入模板字符串的变量。像这样：

    fmt.Printf("Hello, %s!\n", "Harry") 
    // 会输出：Hello, Harry!

而非格式化打印函数的参数则是一个或多个要打印的内容。比如：

    fmt.Println("Hello,", "Harry!") 
    // 会输出：Hello, Harry!

以指定输出目的地功能区分，打印函数可以被分为可自定义输出目的地的的打印函数（以下简称自定义输出打印函数）和标准输出打印函数。对于自定义输出打印函数来说，其第一个函数必是其打印的输出目的地。比如：

    fmt.Fprintf(os.Stdout, "Hello, %s!\n", "Harry")
    // 会在标准输出设备上输出：Hello, Harry!

上面示例中的函数```fmt.Fprintf```既能够让我们自定义打印的输出目的地，又能够格式化字符串。此类打印函数的第一个参数的类型应为```io.Writer```接口类型。只要某个类型实现了该接口类型中的所有方法，就可以作为函数```Fprintf```的第一个参数。例如，我们还可以使用代码包```bytes```中的结构体```Buffer```来接收打印函数打印的内容。像这样：

    var buff bytes.Buffer
    fmt.Fprintf(&buff, "Hello, %s!\n", "Harry")
    fmt.Print("Buffer content:", buff.String())
    // 会在标准输出设备上输出：Buffer content: Hello, Harry!

而标准输出打印函数则只能将打印内容到标准输出设备上。就像函数```fmt.Printf```和```fmt.Println```所做的那样。

检查程序会首先关注打印函数的参数数量。如果参数数量不足，则可以认为在当前调用打印函数的语句中并不会出现用法错误。所以，检查程序会忽略对它的检查。检查程序中对打印函数的最小参数是这样定义的：对于可以自定义输出的打印函数来说，最小参数数量为2，其它打印函数的最小参数数量为1。如果打印函数的实际参数数量小于对应的最小参数数量，就会被判定为参数数量不足。

对于格式化打印函数，检查程序会进行如下检查：

1. 如果格式化字符串无法被转换为基本字面量（标识符以及用于表示int类型值、float类型值、char类型值、string类型值的字面量等），则检查程序会忽略剩余的检查。如果```-v```标记有效，则会在忽略检查前打印错误信息。另外，格式化打印函数的格式化字符串必须是字符串类型的。因此，如果对应位置上的参数的类型不是字符串类型，那么检查程序会立即打印错误信息，并设置退出代码为1。实际上，这个问题已经可以引起一个编译错误了。

2. 如果格式化字符串中不包含动词（verbs），而格式化字符串后又有多余的参数，则检查程序会立即打印错误信息，并设置退出代码为1，且忽略后续检查。我现在举个例子。我们拿之前的一个示例作为基础，即：

    fmt.Printf("Hello, %s!\n", "Harry") 

在这个示例中，格式化字符串中的“%s”就是我们所说的动词，“%”就是动词的前导符。它相当于一个需要被填的空。一般情况下，在格式化字符串中被填的空的数量应该与后续参数的数量相同。但是可以出现在格式化字符串中没有动词并且在格式化字符串之后没有额外参数的情况。在这种情况下，该格式化打印函数就相当于一个非格式化打印函数。例如，下面这个语句会导致此步检查不通过：

    fmt.Printf("Hello!\n", "Harry") 
    
3. 检查程序还会检查动词的格式。这部分检查会非常严格。检查程序对于格式化字符串中动词的格式要求如表0-19。表中对每个动词只进行了简要的说明。读者可以查看标准库代码包```fmt```的文档以了解关于它们的详细信息。命令程序会按照表5-19中的要求对格式化及其后续参数进行检查。如上表所示，这部分检查分为两步骤。第一个步骤是检查格式化字符串中的动词上是否附加了不合法的标记，第二个步骤是检查格式化字符串中的动词与后续对应的参数的类型是否匹配。只要检查出问题，检查程序就会打印出错误信息并且设置退出代码为1。

4. 如果格式化字符串中的动词不被支持，则检查程序同样会打印错误信息后，并设置退出代码为1。

_表0-19 格式化字符串中动词的格式要求_
<table class="table table-bordered table-striped table-condensed">
   <tr>
    <th width=35px>
      动词
    </th>
    <th width=120px>
      合法的附加标记
    </th>
    <th width=120px>
      允许的参数类型
    </th>
    <th width=60px>
      简要说明
    </th>
  </tr>
  <tr>
    <td>
      b
    </td>
    <td>
      “ ”，“-”，“+”，“.”和“0”
    </td>
    <td>
      int或float
    </td>
    <td>
      用于二进制表示法。
    </td>
  </tr>
  <tr>
    <td>
      c
    </td>
    <td>
      “-”
    </td>
    <td>
      rune或int
    </td>
    <td>
      用于单个字符的Unicode表示法。
    </td>
  </tr>
  <tr>
    <td>
      d
    </td>
    <td>
      “ ”，“-”，“+”，“.”和“0”
    </td>
    <td>
      int
    </td>
    <td>
      用于十进制表示法。
    </td>
  </tr>
  <tr>
    <td>
      e
    </td>
    <td>
      “ ”，“-”，“+”，“.”和“0”
    </td>
    <td>
      float
    </td>
    <td>
      用于科学记数法。
    </td>
  </tr>
  <tr>
    <td>
      E
    </td>
    <td>
      “ ”，“-”，“+”，“.”和“0”
    </td>
    <td>
      float
    </td>
    <td>
      用于科学记数法。
    </td>
  </tr>
  <tr>
    <td>
      f
    </td>
    <td>
      “ ”，“-”，“+”，“.”和“0”
    </td>
    <td>
      float
    </td>
    <td>
      用于控制浮点数精度。
    </td>
  </tr>
  <tr>
    <td>
      F
    </td>
    <td>
      “ ”，“-”，“+”，“.”和“0”
    </td>
    <td>
      float
    </td>
    <td>
      用于控制浮点数精度。
    </td>
  </tr>
  <tr>
    <td>
      g
    </td>
    <td>
      “ ”，“-”，“+”，“.”和“0”
    </td>
    <td>
      float
    </td>
    <td>
      用于压缩浮点数输出。
    </td>
  </tr>
  <tr>
    <td>
      G
    </td>
    <td>
      “ ”，“-”，“+”，“.”和“0”
    </td>
    <td>
      float
    </td>
    <td>
      用于动态选择浮点数输出格式。
    </td>
  </tr>
  <tr>
    <td>
      o
    </td>
    <td>
      “ ”，“-”，“+”，“.”，“0”和“#”
    </td>
    <td>
      int
    </td>
    <td>
      用于八进制表示法。
    </td>
  </tr>
  <tr>
    <td>
      p
    </td>
    <td>
      “-”和“#”
    </td>
    <td>
      pointer
    </td>
    <td>
      用于表示指针地址。
    </td>
  </tr>
  <tr>
    <td>
      q
    </td>
    <td>
      “ ”，“-”，“+”，“.”，“0”和“#”
    </td>
    <td>
      rune，int或string
    </td>
    <td>
      用于生成带双引号的字符串形式的内容。
    </td>
  </tr>
  <tr>
    <td>
      s
    </td>
    <td>
      “ ”，“-”，“+”，“.”和“0”
    </td>
    <td>
      rune，int或string
    </td>
    <td>
      用于生成字符串形式的内容。
    </td>
  </tr>
  <tr>
    <td>
      t
    </td>
    <td>
      “-”
    </td>
    <td>
      bool
    </td>
    <td>
      用于生成与布尔类型对应的字符串值。（“true”或“false”）
    </td>
  </tr>
  <tr>
    <td>
      T
    </td>
    <td>
      “-”
    </td>
    <td>
      任何类型
    </td>
    <td>
      用于用Go语法表示任何值的类型。
    </td>
  </tr>
  <tr>
    <td>
      U
    </td>
    <td>
      “-”和“#”
    </td>
    <td>
      rune或int
    </td>
    <td>
      用于针对Unicode的表示法。
    </td>
  </tr>
  <tr>
    <td>
      v
    </td>
    <td>
      “”，“-”，“+”，“.”，“0”和“#”
    </td>
    <td>
      任何类型
    </td>
    <td>
      以默认格式格式化任何值。
    </td>
  </tr>
  <tr>
    <td>
      x
    </td>
    <td>
      “”，“-”，“+”，“.”，“0”和“#”
    </td>
    <td>
      rune，int或string
    </td>
    <td>
      以十六进制、全小写的形式格式化每个字节。
    </td>
  </tr>
  <tr>
    <td>
      X
    </td>
    <td>
      “”，“-”，“+”，“.”，“0”和“#”
    </td>
    <td>
      rune，int或string
    </td>
    <td>
      以十六进制、全大写的形式格式化每个字节。
    </td>
  </tr>
</table>

对于非格式化打印函数，检查程序会进行如下检查：

1. 如果打印函数不是可以自定义输出的打印函数，那么其第一个参数就不能是标准输出```os.Stdout```或者标准错误输出```os.Stderr```。否则，检查程序将打印错误信息并设置退出代码为1。这主要是为了防止程序编写人员的笔误。比如，他们可能会把函数```fmt.Println```当作函数```fmt.Printf```来用。

2. 如果打印函数是不自带换行的，比如```fmt.Printf```和```fmt.Print```，则它必须只少有一个参数。否则，检查程序将打印错误信息并设置退出代码为1。像这样的调用打印函数的语句是没有任何意义的。并且，如果这个打印函数还是一个格式化打印函数，那么这还会引起一个编译错误。需要注意的是，函数名称为```Error```的方法不会在被检查之列。比如，标准库代码包```testing```中的结构体类型```T```和```B```的方法```Error```。这是因为它们可能实现了接口类型```Error```。这个接口类型中唯一的方法```Error```无需任何参数。

3. 如果第一个参数的值为字符串类型的字面量且带有格式化字符串中才应该有的动词的前导符“%”，则检查程序会打印错误信息并设置退出代码为1。因为非格式化打印函数中不应该出现格式化字符串。

4. 如果打印函数是自带换行的，那么在打印内容的末尾就不应该有换行符“\n”。否则，检查程序会打印错误信息并设置退出代码为1。换句话说，检查程序认为程序中如果出现这样的代码：

    fmt.Println("Hello!\n")

常常是由于程序编写人员的笔误。实际上，事实确实如此。如果我们确实想连续输入多个换行，应该这样写：

    fmt.Println("Hello!")
    fmt.Println()


至此，我们详细介绍了```go tool vet```命令中的检查程序对打印函数的所有步骤和内容。打印函数的功能非常简单，但是```go tool vet```命令对它的检查却很细致。从中我们可以领会到一些关于打印函数的最佳实践。

**-rangeloops标记**

如果标记```-rangeloop```有效（标记值不为```false```），那么命令程序会对使用```range```进行迭代的```for```代码块进行检查。我们之前提到过，使用```for```语句需要注意两点：

1. 不要在```go```代码块中处理在迭代过程中被赋予值的迭代变量。比如：

    mySlice := []string{"A", "B", "C"}
    for index, value := range mySlice {
        go func() {
            fmt.Printf("Index: %d, Value: %s\n", index, value)
        }()
    }

在Go语言的并发编程模型中，并没有线程的概念，但却有一个特有的概念——Goroutine。Goroutine也可被称为Go例程或简称为Go程。关于Goroutine的详细介绍在第6章和第7章。我们现在只需要知道它是一个可以被并发执行的代码块。

2. 不要在```defer```语句的延迟函数中处理在迭代过程中被赋予值的迭代变量。比如：

    myDict := make(map[string]int)
    myDict["A"] = 1
    myDict["B"] = 2
    myDict["C"] = 3
    for key, value := range myDict {
        defer func() {
            fmt.Printf("Key: %s, Value: %d\n", key, value)
        }()
    }

其实，上述两点所关注的问题是相同的，那就是不要在可能被延迟处理的代码块中直接使用迭代变量。```go```代码块和```defer```代码块都有这样的特质。这是因为等到go函数（跟在```go```关键字之后的那个函数）或延迟函数真正被执行的时候，这些迭代变量的值可能已经不是我们想要的值了。

另一方面，当检查程序发现在带有```range```子句的```for```代码块中迭代出的数据并没有赋值给标识符所代表的变量时，则会忽略对这一代码块的检查。比如像这样的代码：

    func nonIdentRange(slc []string) {
        l := len(slc)
        temp := make([]string, l)
        l--
        for _, temp[l] = range slc {
            // 忽略了使用切片值temp的代码。
            if l > 0 {
                l--
            }
        }
    }

就不会受到检查程序的关注。另外，当被迭代的对象的大小为```0```时，```for```代码块也不会被检查。

据此，我们知道如果在可能被延迟处理的代码块中直接使用迭代中的临时变量，那么就可能会造成与编程人员意图不相符的结果。如果由此问题使程序的最终结果出现偏差甚至使程序报错的话，那么看起来就会非常诡异。这种隐晦的错误在排查时也是非常困难的。这种不正确的代码编写方式应该彻底被避免。这也是检查程序对迭代代码块进行检查的最终目的。如果检查程序发现了上述的不正确的代码编写方式，就会打印出错误信息以提醒编程人员。

**-structtags标记**

如果标记``-structtags```有效（标记值不为```false```），那么命令程序会对结构体类型的字段的标签进行检查。我们先来看下面的代码：

    type Person struct {
        XMLName xml.Name    `xml:"person"`
        Id          int     `xml:"id,attr"`
        FirstName   string  `xml:"name>first"`
        LastName    string  `xml:"name>last"`
        Age         int     `xml:"age"`
        Height      float32 `xml:"height,omitempty"`
        Married     bool
        Address
        Comment     string  `xml:",comment"`
    }

在上面的例子中，在结构体类型的字段声明后面的那些字符串形式的内容就是结构体类型的字段的标签。对于Go语言本身来说，结构体类型的字段标签就是注释，它们是可选的，且会被Go语言的运行时系统忽略。但是，这些标签可以通过标准库代码包```reflect```中的程序访问到。因此，不同的代码包中的程序可能会赋予这些结构体类型的字段标签以不同的含义。比如上面例子中的结构体类型的字段标签就对代码包```encoding/xml```中的程序非常有用处。

严格来讲，结构体类型的字段的标签应该满足如下要求：

1. 标签应该包含键和值，且它们之间要用英文冒号分隔。

2. 标签的键应该不包含空格、引号或冒号。

3. 标签的值应该被英文双引号包含。

4. 如果标签内容符合了第3条，那么标签的全部内容应该被反引号“`”包含。否则它需要被双引号包含。

5. 标签可以包含多个键值对，其它们之间要用空格“ ”分隔。例如：```key:"value"  _gofix:"_magic"```

检查程序首先会对结构体类型的字段标签的内容做去引号处理，也就是把最外面的双引号或者反引号去除。如果去除失败，则检查程序会打印错误信息并设置退出代码为1，同时忽略后续检查。如果去引号处理成功，检查程序则会根据前面的规则对标签的内容进行检查。如果检查出问题，检查程序同样会打印出错误信息并设置退出代码为1。

**-unreachable标记**

如果标记``-unreachable```有效（标记值不为```false```），那么命令程序会在函数或方法定义中查找死代码。死代码就是永远不会被访问到的代码。例如：

    func deadCode1() int {
        print(1)
        return 2
        println() // 这里存在死代码
    }
    
在上面示例中，函数```deadCode1```中的最后一行调用打印函数的语句就是死代码。检查程序如果在函数或方法中找到死代码，则会打印错误信息以提醒编码人员。我们把这段代码放到命令源码文件deadcode_demo.go中，并在main函数中调用它。现在，如果我们编译这个命令源码文件会马上看到一个编译错误：“missing return at end of function”。显然，这个错误侧面的提醒了我们，在这个函数中存在死代码。实际上，我们在修正这个问题之前它根本就不可能被运行，所以也就不存在任何隐患。但是，如果在这个函数不需要结果的情况下又会如何呢？我们稍微改造一下上面这个函数：

    func deadCode1() {
        print(1)
        return
        println() // 这里存在死代码
    }

好了，我们现在把函数```deadcode1```的声明中的结果声明和函数中```return```语句后的数字都去掉了。不幸的是，当我们再次编译文件时没有看到任何报错。但是，这里确实存在死代码。在这种情况下，编译器并不能帮助我们找到问题，而```go tool vet```命令却可以。

    hc@ubt:~$ go tool vet deadcode_demo.go
    deadcode_demo.go:10: unreachable code


```go tool vet```命令中的检查程序对于死代码的判定有几个依据，如下：

1. 在这里，我们把```return```语句、```goto```语句、```break```语句、```continue```语句和```panic```函数调用语句都叫做流程中断语句。如果在当前函数、方法或流程控制代码块的分支中的流程中断语句的后面还存在其他语句或代码块，比如：

    func deadCode2() {
        print(1)
        panic(2)
        println() // 这里存在死代码
    }

 或

    func deadCode3() {
    L:
        {
            print(1)
            goto L
        }
        println() // 这里存在死代码
    }

 或

    func deadCode4() {
        print(1)
        return
        { // 这里存在死代码
        }
    }

则后面的语句或代码块就会被判定为死代码。但检查程序仅会在错误提示信息中包含第一行死代码的位置。

2. 如果带有```else```的```if```代码块中的每一个分支的最后一条语句均为流程中断语句，则在此流程控制代码块后的代码都被判定为死代码。比如：

    func deadCode5(x int) {
        print(1)
        if x == 1 {
            panic(2)
        } else {
            return
        }
        println() // 这里存在死代码
    }
    
注意，只要其中一个分支不包含流程中断语句，就不能判定后面的代码为死代码。像这样：

    func deadCode5(x int) {
        print(1)
        if x == 1 {
            panic(2)
        } else if x == 2 {
            return
        } 
        println() // 这里并不是死代码
    }

3. 如果在一个没有显式中断条件或中断语句的```for```代码块后面还存在其它语句，则这些语句将会被判定为死代码。比如：

    func deadCode6() {
        for {
            for {
                break
            }
        }
        println() // 这里存在死代码
    }

或

    func deadCode7() {
        for {
            for {
            }
            break // 这里存在死代码
        }
        println()
    }

而我们对这两个函数稍加改造后，就会消除```go tool vet```命令发出的死代码告警。如下：

    func deadCode6() {
        x := 1
        for x == 1 {
            for {
                break
            }
        }
        println() // 这里存在死代码
    }

以及

    func deadCode7() {
        x := 1
        for {
            for x == 1 {
            }
            break // 这里存在死代码
        }
        println()
    }

我们只是加了一个显式的中断条件就能够使之通过死代码检查。但是，请注意！这两个函数中在被改造后仍然都包含死循环代码！这说明检查程序并不对中断条件的逻辑进行检查。

4. 如果```select```代码块的所有```case```中的最后一条语句均为流程中断语句（```break```语句除外），那么在```select```代码块后面的语句都会被判定为死代码。比如：

    func deadCode8(c chan int) {
        print(1)
        select {
        case <-c:
            print(2)
            panic(3)
        }
        println() // 这里存在死代码
    }

或

    func deadCode9(c chan int) {
    L:
        print(1)
        select {
        case <-c:
            print(2)
            panic(3)
        case c <- 1:
            print(4)
            goto L
        }
        println() // 这里存在死代码
    }

另外，在空的```select```语句块之后的代码也会被认为是死代码。比如：

    func deadCode10() {
        print(1)
        select {}
        println() // 这里存在死代码
    }

或

    func deadCode11(c chan int) {
        print(1)
        select {
        case <-c:
            print(2)
            panic(3)
        default:
            select {}
        }
        println() // 这里存在死代码
    }

上面这两个示例中的语句```select {}```都会引发一个运行时错误：“fatal error: all goroutines are asleep - deadlock!”。这就是死锁！关于这个错误的详细说明在第7章。

5. 如果```switch```代码块的所有```case```和```default case```中的最后一条语句均为流程中断语句（除了```break```语句），那么在```switch```代码块后面的语句都会被判定为死代码。比如：

    func deadCode14(x int) {
        print(1)
        switch x {
        case 1:
            print(2)
            panic(3)
        default:
            return
        }
        println(4) // 这里存在死代码
    }

我们知道，关键字```fallthrough```可以使流程从```switch```代码块中的一个```case```转移到下一个```case```或```default case```。死代码也可能由此产生。例如：

    func deadCode15(x int) {
        print(1)
        switch x {
        case 1:
            print(2)
            fallthrough
        default:
            return
        }
        println(3) // 这里存在死代码
    }

在上面的示例中，第一个case总会把流程转移到第二个case，而第二个case中的最后一条语句为return语句，所以流程永远不会转移到语句```println(3)```上。因此，```println(3)```语句会被判定为死代码。如果我们把```fallthrough```语句去掉，那么就可以消除这个死代码判定。实际上，只要某一个```case```或者```default case```中的最后一条语句是break语句，就不会有死代码的存在。当然，这个```break```语句本身不能是死代码。另外，与```select```代码块不同的是，空的```switch```代码块并不会使它后面的代码成为死代码。

综上所述，死代码的判定虽然看似比较复杂，但其实还是有原则可循的。我们应该在编码过程中就避免编写可能会造成死代码的代码。如果我们实在不确定死代码是否存在，也可以使用```go tool vet```命令来检查。不过，需要提醒读者的是，不存在死代码并不意味着不存在造成死循环的代码。当然，造成死循环的代码也并不一定就是错误的代码。但我们仍然需要对此保持警觉。

**-asmdecl标记**

如果标记``-asmdecl```有效（标记值不为```false```），那么命令程序会对汇编语言的源码文件进行检查。对汇编语言源码文件及相应编写规则的解读已经超出了本书的范围，所以我们并不在这里对此项检查进行描述。如果读者有兴趣的话，可以查看此项检查的程序的源码文件asmdecl.go。它在Go语言安装目录的子目录src/cmd/vet下。

至此，我们对```go vet```命令和```go tool vet```命令进行了全面详细的介绍。之所以花费如此大的篇幅来介绍这两个命令，不仅仅是为了介绍此命令的使用方法，更是因为此命令程序的检查工作涉及到了很多我们在编写Go语言代码时需要避免的“坑”。由此我们也可以知晓应该怎样正确的编写Go语言代码。同时，我们也应该在开发Go语言程序的过程中经常使用```go tool vet```命来检查代码。 