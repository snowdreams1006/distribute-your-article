# go tool cgo

# go tool cgo

 
cgo也是一个Go语言自带的特殊工具。一般情况下，我们使用命令```go tool cgo```来运行它。这个工具可以使我们创建能够调用C语言代码的Go语言源码文件。这使得我们可以使用Go语言代码去封装一些C语言的代码库，并提供给Go语言代码或项目使用。

在执行```go tool cgo```命令的时候，我们需要加入作为目标的Go语言源码文件的路径。这个路径可以是绝对路径也可以是相对路径。但是，作者强烈建议在目标源码文件所属的代码包目录下执行```go tool cgo```命令并以目标源码文件的名字作为参数。因为，```go tool cgo```命令会在当前目录（也就是我们执行```go tool cgo```命令的目录）中生成一个名为_obj的子目录。该目录下会包含一些Go源码文件和C源码文件。这个子目录及其包含的文件理应被保存在目标代码包目录之下。至于原因，我们稍后再做解释。

我们现在来看可以作为```go tool cgo```命令参数的Go语言源码文件。这个源码文件必须要包含一行只针对于代码包```C```的导入语句。其实，Go语言标准库中并不存在代码包```C```。代码包```C```是一个伪造的代码包。导入这个代码包是为了告诉cgo工具在这个源码文件中需要调用C代码，同时也是给予cgo所产生的代码一个专属的命名空间。除此之外，我们还需要在这个代码包导入语句之前加入一些注释，并且在注释行中写出我们真正需要使用的C语言接口文件的名称。像这样：

    // #include <stdlib.h>
    import "C"

在Go语言的规范中，把在代码包```C```导入语句之前的若干注释行叫做序文（preamble）。
在引入了C语言的标准代码库stdlib.h之后，我们就可以在后面的源码中调用这个库中的接口了。像这样：

    func Random() int {
        return int(C.rand())
    }
    
    func Seed(i int) {
        C.srand(C.uint(i))
    }

我们把上述的这些Go语言代码写入Go语言的库源码文件rand.go中，并将这个源码文件保存在goc2项目的代码包```basic/cgo/lib```的对应目录中。

在Go语言源码文件rand.go中对代码包```C```有四处引用，分别是三个函数调用语句```C.rand```、```C.srand```和```C.uint```，以及一个导入语句```import "C"```。其中，在Go语言函数```Random```中调用了C语言标准库代码中的函数```rand```并返回了它的结果。但是，C语言的```rand```函数返回的结果的类型是C语言中的int类型。在cgo工具的环境中，C语言中的int类型与C.int相对应。作为一个包装C语言接口的函数，我们必须将代码包```C```的使用限制在当前代码包内。也就是说，我们必须对当前代码包之外的Go代码隐藏代码包```C```。这样做也是为了遵循代码隔离原则。我们在设计接口或者接口适配程序的时候经常会用到这种方法。因此，```rand```函数的结果的类型必须是Go语言的。所以，我们在这里使用函数int对C.int类型的C语言接口的结果进行了转换。当然，为了更清楚的表达，我们也可以将函数```Random```中的代码```return int(C.rand())```拆分成两行，像这样：

    var r C.int = C.rand()
    return int(r)

而Go语言函数```Seed```则恰好相反。C语言标准代码库中的函数```srand```接收一个参数，且这个参数的类型必须为C语言的uint类型，即```C.uint```。而Go语言函数Seed的参数为Go语言的int类型。为此，我们需要使用代码包```C```的函数```unit```对其进行转换。

实际上，标准C语言的数字类型都在cgo工具中有对应的名称，包括：C.char、C.schar（有符号字符类型）、C.uchar（无符号字符类型）、C.short、C.ushort（无符号短整数类型）、C.int、C.uint（无符号整数类型）、C.long、C.ulong（无符号长整数类型）、C.longlong（对应于C语言的类型long long，它是在C语言的C99标准中定义的新整数类型）、C.ulonglong（无符号的long long类型）、C.float和C.double。另外，C语言类型void*对应于Go语言的类型```unsafe.Pointer```。

如果想直接访问C语言中的struct、union或enum类型的话，就需要在名称前分别加入前缀struct_、union_或enum_。比如，我们需要在Go源码文件中访问C语言代码中的名为command的struct类型的话，就需要这样写：C.struct_command。那么，如果我们想在Go语言代码中访问C语言类型struct中的字段需要怎样做呢？解决方案是，同样以C语言类型struct的实例名以及选择符“.”作为前导，但需要在字段的名称前加入下划线“_”。例如，如果command1是名为command的C语言struct类型的实例名，并且这个类型中有一个名为name的字段，那么我们在Go语言代码中访问这个字段的方式就是command1._name。需要注意的是，我们不能在Go的struct类型中嵌入C语言类型的字段。这与我们在前面所说的代码隔离原则具有相同的意义。

在上面展示的库源码文件rand.go中有多处对C语言函数的访问。实际上，任何C语言的函数都可以
被Go语言代码调用。只要在源码文件中导入了代码包```C```。并且，我们还可以同时取回C语言函数的结果，以及一个作为错误提示信息的变量。这与我们在Go语言中同时获取多个函数结果的方法一样。同样的，我们可以使用下划线“_”直接丢弃取回的值。这在调用无结果的C语言函数时非常有用。请看下面的例子：

    package cgo
    
    /*
    #cgo LDFLAGS: -lm
    #include <math.h>
    */
    import "C"
    
    func Sqrt(p float32) (float32, error) {
        n, err := C.sqrt(C.double(p))
        return float32(n), err
    }

上面这段代码被保存在了Go语言库源码文件math.go中，并与源码文件rand.go在同一个代码包目录。在Go语言函数```Sqrt```中的```C.sqrt```是一个在C语言标准代码库math.h中的函数。它会返回参数的平方根。但是在第一行代码中，我们接收由函数C.sqrt返回的两个值。其中，第一个值即为C语言函数```sqrt```的结果。而第二个值就是我们上面所说的那个作为错误提示信息的变量。实际上，这个变量的类型是Go语言的```error```接口类型。它包装了一个C语言的全局变量errno。这个全局变量被定义在了C语言代码库errno.h中。cgo工具在为我们生成C语言源码文件时会默认引入两个C语言标准代码库，其中一个就是errno.h。所以我们并不用在Go语言源码文件中使用指令符#include显式的引入这个代码库。cgo工具默认为我们引入的另一个是C语言标准代码库string.h。它包含了很多用于字符串处理和内存处理的函数。

在我们以“C.*”的形式调用C语言代码库时，有一点需要特别注意。在C语言中，如果一个函数的参数是一个具有固定尺寸的数组，那么实际上这个函数所需要的是指向这个数组的第一个元素的指针。C编译器能够正确识别和处理这个调用惯例。它可以自行获取到这个指针并传给函数。但是，这在我们使用cgo工具调用C语言代码库时是行不通的。在Go语言中，我们必须显式的将这个指向数组的第一个元素的指针传递给C语言的函数，像这样：``C.func1(&x[0])````。

另一个需要特别注意的地方是，在C语言中没有像Go语言中独立的字符串类型。C语言使用最后一个元素为‘\0’的字符数组来代表字符串。在Go语言的字符串和C语言的字符串之间进行转换的时候，我们就需要用到代码包```C```中的```C.C.CString```、```C.GoString```和```C.GoStringN```等函数。这些转换操作是通过对字符串数据的拷贝来完成的。Go语言内存管理器并不能感知此类内存分配操作。因为它们是由C语言代码引发的。所以，我们在使用与```C.CString```函数类似的会导致内存分配操作的函数之后，需要调用代码包C的free函数以手动的释放内存。这里有一个小技巧，即我们可以把对```C.free```函数的调用放到```defer```语句中或者放入在defer之后的匿名函数中。这样就可以保证在退出当前函数之前释放这些被分配的内存了。请看下面这个示例：

    func Print(s string) {
            cs := C.CString(s)
            defer C.free(unsafe.Pointer(cs))
            C.myprint(cs)
    }
    
上面这段代码被存放在goc2p项目的代码包```basic/cgo/lib```的库源码文件print.go中。其中的函数```C.myprint```是我们在该库源码文件的序文中自定义的。关于这种C语言函数定义方式，我们一会儿再解释。在这段代码中，我们首先把Go语言的字符串转换为了C语言的字符串。注意，变量```cs```的值实际上是指向字符串（在C语言中，字符串由字符数组代表）中第一个字符的指针。在cgo工具对应的上下文环境中，```cs```变量的类型是```*C.Char```。然后，我们通过```defer```语句和```C.free```函数保证由C语言代码分配的内存得以释放。请注意子语句```unsafe.Pointer(cs)```。正因为```cs```变量在C语言中的类型是指针类型，且与之相对应的Go语言类型是```unsafe.Pointer```。所以，我们需要先将其转换为Go语言可以识别的类型再作为参数传递给函数```C.free```。最后，我们将这个字符串打印到标准输出。

再次重申，我们在使用```C.CString```函数将Go语言的字符串转换为C语言字符串后，需要显式的调用```C.free```函数以释放用于数据拷贝的内存。而最佳实践是，将在```defer```语句中调用```C.free```函数。

在前面我们已经提到过，在导入代码包C的语句之上可以加入若干个为cgo工具而写的若干注释行（也被叫做序文）。并且，以#include和一个空格开始的注释行可以用来引入一个C语言的接口文件。我们也把序文中这种形式的字符串叫做指令符。指令符```#cgo```的用途是为编译器和连接器提供标记。这些标记在编译当前源码文件中涉及到代码包```C```的那部分代码时会被用到。

标记```CFLAGS```和```LDFLAGS``可以被放在指令符```#cgo```之后，并用于定制编译器gcc的行为。gcc（GNU Compiler Collection，GNU编译器套装），是一套由GNU开发的开源的编程语言编译器。它是GNU项目的关键部分，也是类Unix操作系统（也包括Linux操作系统）中的标准编译器。gcc（特别是其中的C语言编译器）也常被认为是跨平台编译器的事实标准。gcc原名为GNU C语言编译器（GNU C Compiler），因为它原本只能处理C语言。不过，gcc变得可以处理更多的语言。现在，gcc中包含了很多针对特定编程语言的编译器。我们在本节第一小节的末尾提及的gccgo就是这款套件中针对Go语言的编译器。标记CFLAGS可以指定用于gcc中的C编译器的选项。它尝尝用于指定头文件（.h文件）的路径。而标记LDFLAGS则可以指定gcc编译器会用到的一些优化参数，也可以用来告诉链接器需要用到的C语言代码库文件的位置。

为了清晰起见，我们可以把这些标记及其值拆分成多个注释行，并均以指令符```#cgo```作为前缀。另外，在指令符```#cgo```和标记之间，我们也可以加入一些可选的内容，即环境变量GOOS和GOARCH中的有效值。这样，我们就可以使这些标记只在某些操作系统和/或某些计算架构的环境下起作用了。示例如下：

    // #cgo CFLAGS: -DPNG_DEBUG=1
    // #cgo linux CFLAGS: -DLINUX=1
    // #cgo LDFLAGS: -lpng
    // #include <png.h>
    import "C"

在上面的示例中，序文由四个注释行组成。第一行注释的含义是预定义一个名为```PNG_DEBUG```的宏并将它的值设置为1。而第二行注释的意思是，如果在Linux操作系统下，则预定义一个名为```LINUX```的宏并将它的值设置为1。第三行注释是与链接器有关的。它告诉链接器需要用到一个库名为png的代码库文件。最后，第四行注释引入了C语言的标准代码库png.h。

如果我们有一些在所有场景下都会用到的```CFLAGS```标记或```LDFLAGS```标记的值，那么就可以把它们分别作为环境变量```CGO_CFLAGS```和```CGO_LDFLAGS```的值。而对于需要针对某个导入了“C”的代码包的标记值就只能连同指令符```#cgo```一起放入Go语言源码文件的注释行中了。

相信读者对指令符```#cgo```和```#include```的用法已经有所了解了。

实际上，我们几乎可以在序文中加入任何C代码。像这样：

    /*
    #cgo LDFLAGS: -lsqlite3
    
    #include <sqlite3.h>
    #include <stdlib.h>
    
    // These wrappers are necessary because SQLITE_TRANSIENT
    // is a pointer constant, and cgo doesn't translate them correctly.
    // The definition in sqlite3.h is:
    //
    // typedef void (*sqlite3_destructor_type)(void*);
    // #define SQLITE_STATIC      ((sqlite3_destructor_type)0)
    // #define SQLITE_TRANSIENT   ((sqlite3_destructor_type)-1)
    
    static int my_bind_text(sqlite3_stmt *stmt, int n, char *p, int np) {
            return sqlite3_bind_text(stmt, n, p, np, SQLITE_TRANSIENT);
    }
    static int my_bind_blob(sqlite3_stmt *stmt, int n, void *p, int np) {
            return sqlite3_bind_blob(stmt, n, p, np, SQLITE_TRANSIENT);
    }
    
    */

上面这段代码摘自开源项目gosqlite的Go语言源码文件sqlite.go。gosqlite项目是一个开源数据SQLite的Go语言版本的驱动代码库。实际上，它只是把C语言版本的驱动代码库进行了简单的封装。在Go语言的世界里，这样的封装随处可见，尤其是在Go语言发展早期。因为，这样可以非常方便的重用C语言版本的客户端程序，而大多数软件都早已拥有这类程序了。并且，封装C语言版本的代码库与从头开发一个Go语言版本的客户端程序相比，无论从开发效率还是运行效率上来讲都会是非常迅速的。现在让我们看看在上面的序文中都有些什么。很显然，在上面的序文中直接出现了两个C语言的函数```my_bind_text```和```my_bind_blob```。至于为什么要把C语言函数直接写到这里，在它们前面的注释中已经予以说明。大意翻译如下：这些包装函数是必要的，这是因为SQLITE_TRANSIENT是一个指针常量，而cgo并不能正确的翻译它们。看得出来，这是一种备选方案，只有在cgo不能帮我们完成工作时才会被选用。不管怎样，在序文中定义的这两个函数可以直接在当前的Go语言源码文件中被使用。具体的使用方式同样是通过“C.*”的形式来调用。比如源码文件sqlite.go中的代码：

    rv := C.my_bind_text(s.stmt, C.int(i+1), cstr, C.int(len(str)))

和

    rv := C.my_bind_blob(s.stmt, C.int(i+1), unsafe.Pointer(p), C.int(len(v)))

上述示例中涉及到的源码文件可以通过[这个网址](https://code.google.com/p/gosqlite/source/browse/sqlite/sqlite.go)访问到。有兴趣的读者可以前往查看。

我们再来看看我们之前提到过的库源码文件print.go（位于goc2p项目的代码包```basic/cgo/lib```之中）的序文：

    /*
    #include <stdio.h>
    #include <stdlib.h>
    
    void myprint(char* s) {
            printf("%s", s);
    }
    */
    import "C"

我们在序文中定义一个名为```myprint```的函数。在这个函数中调用了C语言的函数```printf```。自定义函数```myprint```充当了类似于适配器的角色。之后，我们就可以在后续的代码中直接使用这个自定义的函数了：

    C.myprint(cs)

关于在序文中嵌入C语言代码的方法我们就介绍到这里。

现在，让我们来使用```go tool cgo```命令并以rand.go作为参数生成_obj子目录和相关源码文件：

    hc@ubt:~/golang/goc2p/src/basic/cgo/lib$ go tool cgo rand.go 
    hc@ubt:~/golang/goc2p/src/basic/cgo/lib$ ls
    _obj  rand.go
    hc@ubt:~/golang/goc2p/src/basic/cgo/lib$ ls _obj
    _cgo_defun.c   _cgo_export.h  _cgo_gotypes.go  _cgo_.o       rand.cgo2.c
    _cgo_export.c  _cgo_flags     _cgo_main.c      rand.cgo1.go
    
子目录_obj中一共包含了九个文件。

其中，cgo工具会把作为参数的Go语言源码文件rand.go转换为四个文件。其中包括两个Go语言源码文件rand.cgo1.go和_cgo_gotypes.go，以及两个C语言源码文件_cgo_defun.c和rand.cgo2.c。

文件rand.cgo1.go用于存放cgo工具对原始源码文件rand.go改写后的内容。改写具体细节包括去掉其中的代码包C导入语句，以及替换涉及到代码包C的语句，等等。最后，这些替换后的标识符所对应的Go语言的函数、类型或变量的定义，将会被写入到文件_cgo_gotypes.go中。

需要说明的是，替换涉及到代码包C的语句的具体做法是根据xxx的种类将标识符```C.xxx```替换为```_Cfunc_xxx```或者```_Ctype_xxx```。比如，作为参数的源码文件rand.go中存在如下语句:

    C.srand(C.uint(i))

cgo工具会把它改写为：

    _Cfunc_srand(_Ctype_uint(i))
    
其中，标识符```C.srand```被替换为```_Cfunc_srand```，而标识符```C.uint```被替换为了```_Ctype_uint```。并且，新的标识符```_Cfunc_srand```和```_Ctype_uint```的定义将会在文件_cgo_gotypes.go中被写明：

    type _Ctype_uint uint32
    
    type _Ctype_void [0]byte
    
    func _Cfunc_srand(_Ctype_uint) _Ctype_void
    
其中，类型_Ctype_void可以表示空的参数列表或空的结果列表。

文件_cgo_defun.c中包含了相应的C语言函数的定义和实现。例如，C语言函数```_Cfunc_srand```的实现如下：

    #pragma cgo_import_static _cgo_54716c7dc6a7_Cfunc_srand
    void _cgo_54716c7dc6a7_Cfunc_srand(void*);
    
    void
    ·_Cfunc_srand(struct{uint8 x[4];}p)
    {
        runtime·cgocall(_cgo_54716c7dc6a7_Cfunc_srand, &p);
    }

其中，十六进制数“54716c7dc6a7”是cgo工具由于作为参数的源码文件的内容计算得出的哈希值。这个十六进制数作为了函数名称```_cgo_54716c7dc6a7_Cfunc_srand```的一部分。这样做是为了生成一个唯一的名称以避免冲突。我们看到，在源码文件_cgo_defun.c中只包含了函数```_cgo_54716c7dc6a7_Cfunc_srand```的定义。而其实现被写入到了另一个C语言源码文件中。这个文件就是rand.cgo2.c。函数```_cgo_54716c7dc6a7_Cfunc_srand```对应的实现代码如下：

    void
    _cgo_f290d3e89fd1_Cfunc_srand(void *v)
    {
        struct {
            unsigned int p0;
        } __attribute__((__packed__)) *a = v;
        srand(a->p0);
    }
    
这个函数从指向函数```_Cfunc_puts```的参数帧中抽取参数，并调用系统C语言函数srand，最后将结果存储在帧中并返回。

下面我们对在子目录_obj中存放的其余几个文件进行简要说明：

+ 文件_cgo_flags用于存放CFLAGS标记和LDFLAGS标记的值。

+ 文件_cgo_main.c用于存放一些C语言函数的存根，也可以说是一些函数的空实现。函数的空实现即在函数体重没有任何代码（return语句除外）的实现。其中包括在源码文件_cgo_export.c出现的声明为外部函数的函数。另外，文件_cgo_main.c中还会有一个被用于动态链接处理的main函数。

+ 在文件_cgo_export.h中存放了可以暴露给C语言代码的与Go语言类型相对应的C语言声明语句。

+ 文件_cgo_export.c中则包含了与可以暴露给C语言代码的Go语言函数相对应的C语言函数定义和实现代码。

+ 文件_cgo_.o是gcc编译器在编译C语言源码文件rand.cgo2.c、_cgo_export.c和_cgo_main.c之后生成的结果文件。 

在上述的源码文件中，文件rand.cgo1.go和_cgo_gotypes.go将会在构建代码包时被Go官方Go语言编译器（6g、8g或5g）编译。文件_cgo_defun.c会在构建代码包时被Go官方的C语言的编译器（6c、8c或5c）编译。而文件rand.cgo2.c、_cgo_export.c和_cgo_main.c 则会被gcc编译器编译。

如果我们在执行```go tool cgo```命令时加入多个Go语言源码文件作为参数，那么在当前目录的_obj子目录下会出现与上述参数数量相同的x.cgo1.go文件和x.cgo2.c文件。其中，x为作为参数的Go语言源码文件主文件名。

通过上面的描述，我们基本了解了由cgo工具生成的文件的内容和用途。

与其它go命令一样，我们在执行```go tool cgo```命令的时候还可以加入一些标记。如下表。

_表0-24 ```go tool cgo```命令可接受的标记_
<table class="table table-bordered table-striped table-condensed">
   <tr>
    <th width=160px>
      名称
    </th>
    <th width=80px>
      默认值
    </th>   
    <th>
      说明
    </th>
  </tr>
  <tr>
    <td>
      -cdefs
    </td>
    <td>
      false
    </td>
    <td>
      将改写后的源码内容以C定义模式打印到标准输出，而不生成相关的源码文件。
    </td>
  </tr>
  <tr>
    <td>
      -godefs
    </td>
    <td>
      false
    </td>
    <td>
      将改写后的源码内容以Go定义模式打印到标准输出，而不生成相关的源码文件。
    </td>
  </tr>
  <tr>
    <td>
      -objdir
    </td>
    <td>
      ""
    </td>
    <td>
      gcc编译的目标文件所在的路径。若未自定义则为当前目录下的_obj子目录。
    </td>
  </tr>
  <tr>
    <td colspan=3>
    </td>
  </tr>
  <tr>
    <td>
      -dynimport
    </td>
    <td>
      ""
    </td>
    <td>
      如果值不为空字符串，则打印为其值所代表的文件生成的动态导入数据到标准输出。
    </td>
  </tr>
  <tr>
    <td>
      -dynlinker
    </td>
    <td>
      false
    </td>
    <td>
      记录在dynimport模式下的动态链接器信息。
    </td>
  </tr>
  <tr>
    <td>
      -dynout
    </td>
    <td>
      ""
    </td>
    <td>
      将-dynimport的输出（如果有的话）写入到其值所代表的文件中。
    </td>
  </tr>
  <tr>
    <td colspan=3>
    </td>
  </tr>
  <tr>
    <td>
      -gccgo
    </td>
    <td>
      false
    </td>
    <td>
      生成可供gccgo编译器使用的文件。
    </td>
  </tr>
  <tr>
    <td>
      -gccgopkgpath
    </td>
    <td>
      ""
    </td>
    <td>
      对应于gccgo编译器的-fgo-pkgpath选项。
    </td>
  </tr>
  <tr>
    <td>
      -gccgoprefix
    </td>
    <td>
      ""
    </td>
    <td>
      对应于gccgo编译器的-fgo-prefix选项。
    </td>
  </tr>
  <tr>
    <td colspan=3>
    </td>
  </tr>
  <tr>
    <td>
      -debug-define
    </td>
    <td>
      false
    </td>
    <td>
      打印相关的指令符#defines及其后续内容到标准输出。
    </td>
  </tr>
  <tr>
    <td>
      -debug-gcc
    </td>
    <td>
      false
    </td>
    <td>
      打印gcc调用信息到标准输出。
    </td>
  </tr>
  <tr>
    <td colspan=3>
    </td>
  </tr>
  <tr>
    <td>
      -import_runtime_cgo
    </td>
    <td>
      true
    </td>
    <td>
      在生成的代码中加入语句“import runtime/cgo”。
    </td>
  </tr>
  <tr>
    <td>
      -import_syscall
    </td>
    <td>
      true
    </td>
    <td>
      在生成的代码中加入语句“import syscall”。
    </td>
  </tr>
</table>

在上表中，我们把标记分为了五类并在它们之间以空行分隔。

在第一类标记中，```-cdefs```标记和```-godefs```标记都可以打印相应的代码到标准输出，并且使cgo工具不生成相应的源码文件。cgo工具在获取目标源码文件内容之后会改写其中的内容，包括去掉代码包```C```的导入语句，以及对代码包```C```的调用语句中属于代码包```C```的类型、函数和变量进行等价替换。如果我们加入了标记```-cdefs```或```-godefs```，那么cgo工具随后就会把改写后的目标源码打印到标准输出了。需要注意的是，我们不能同时使用这两个标记。使用这两个标记打印出来的源码内容几乎相同，而最大的区别也只是格式方面的。

第二类的三个标记都与动态链接库有关。在类Unix系统下，标记```-dynimport```的值可以是一个ELF（Executable and Linkable Format）格式或者Mach-O（Mach Object）格式的文件的路径。ELF即可执行链接文件格式。ELF格式的文件保存了足够的系统相关信息，以至于使它能够支持不同平台上的交叉编译和交叉链接，可移植性很强。同时，它在执行中支持动态链接共享库。我们在Linux操作系统下使用go命令生成的命令源码文件的可执行文件就是ELF格式的。而Mach-O是一种用于可执行文件、目标代码、动态链接库和内核转储的文件格式。在Windows下，这个标记的值应该是一个PE（Portable Execute）格式的文件的路径。在Windows操作系统下，使用go命令生成的命令源码文件的可执行文件就是PE格式的。

实质上，加入标记```-dynimport```的```go tool cgo```命令相当于一个被构建在cgo工具内部的独立的帮助命令。使用方法如```go tool cgo -dynimport='cgo_demo.go'```。这个命令会扫描这个标记的值所代表的可执行文件，并将其中记录的与已导入符号和已导入代码库相关的信息打印到标准输出。```go build```命令程序中有专门为cgo工具制定的规则。这使得它可以在编译直接或间接依赖了代码包C的命令源码文件时可以生成适当的可执行文件。在这个可执行文件中，直接包含了相关的已导入符号和已导入代码库的信息，以供之后使用。这样就无需使链接器复制gcc编译器的所有关于如何寻找已导入的符号以及使用它的位置的专业知识了。下面我们来试用一下```go tool cgo -dynimport```命令。

首先，我们创建一个命令源码文件cgo_demo.go，并把它存放在goc2p项目的代码包```basic/cgo```对应的目录下。命令源码文件cgo_demo.go的内容如下：

    package main
    
    import (
        cgolib "basic/cgo/lib"
        "fmt"
    )
    
    func main() {
        input := float32(2.33)
        output, err := cgolib.Sqrt(input)
        if err != nil {
            fmt.Errorf("Error: %s\n", err)
        }
        fmt.Printf("The square root of %f is %f.\n", input, output)
    }
    
在这个命令源码文件中，我们调用了goc2p项目的代码包```basic/cgo/lib```中的函数```Sqrt```。这个函数是被保存在库源码文件math.go中的。而在文件math.go中，我们导入了代码包C。也就是说，命令源码文件cgo_demo.go间接的依赖了代码包C。现在，我们使用```go build```命令将这个命令源码文件编译成ELF格式的可执行文件。然后，我们就能够使用```go tool cgo -dynimport```命令查看其中的导入信息了。请看如下示例：

    hc@ubt:~/golang/goc2p/basic/cgo$ go build cgo_demo.go
    hc@ubt:~/golang/goc2p/basic/cgo$ go tool cgo -dynimport='cgo_demo'
    #pragma cgo_import_dynamic pthread_attr_init pthread_attr_init#GLIBC_2.1 
        "libpthread.so.0"
    #pragma cgo_import_dynamic pthread_attr_destroy pthread_attr_destroy#GLIBC_2.0 
        "libpthread.so.0"
    #pragma cgo_import_dynamic stderr stderr#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic sigprocmask sigprocmask#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic free free#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic fwrite fwrite#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic malloc malloc#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic strerror strerror#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic srand srand#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic setenv setenv#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic __libc_start_main __libc_start_main#GLIBC_2.0 
        "libc.so.6"
    #pragma cgo_import_dynamic fprintf fprintf#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic pthread_attr_getstacksize
         pthread_attr_getstacksize#GLIBC_2.1 "libpthread.so.0"
    #pragma cgo_import_dynamic sigfillset sigfillset#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic __errno_location __errno_location#GLIBC_2.0 
        "libpthread.so.0"
    #pragma cgo_import_dynamic sqrt sqrt#GLIBC_2.0 "libm.so.6"
    #pragma cgo_import_dynamic rand rand#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic pthread_create pthread_create#GLIBC_2.1 
        "libpthread.so.0"
    #pragma cgo_import_dynamic abort abort#GLIBC_2.0 "libc.so.6"
    #pragma cgo_import_dynamic _ _ "libm.so.6"
    #pragma cgo_import_dynamic _ _ "libpthread.so.0"
    #pragma cgo_import_dynamic _ _ "libc.so.6"

从上面示例的输出信息中，我们可以看到可执行文件cgo_demo所涉及到的所有动态链接库文件以及相关的函数名和代码库版本等信息。

如果我们再加入一个标记```-dynlinker```，那么在命令的输出信息还会包含动态链接器的信息。示例如下：

    hc@ubt:~/golang/goc2p/src/basic/cgo$ go tool cgo -dynimport='cgo_demo' -dynlinker
    #pragma cgo_dynamic_linker "/lib/ld-linux.so.2"
    <省略部分输出内容>

如果我们在命令```go tool cgo -dynimport```后加入标记```-dynout```，那么命令的输出信息将会写入到指定的文件中，而不是被打印到标准输出。比如命令```go tool cgo -dynimport='cgo_demo' -dynlinker -dynout='cgo_demo.di'```就会将可执行文件cgo_demo中的导入信息以及动态链接器信息转储到当前目录下的名为“cgo_demo.di”的文件中。

第四类标记包含了```-gccgo```、```-gccgopkgpath```和```-gccgoprefix```。它们都与编译器gccgo有关。标记```-gccgo```的作用是使cgo工具生成可供gccgo编译器使用的源码文件。这些源码文件会与默认情况下生成的源码文件在内容上有一些不同。实际上，到目前为止，cgo工具还不能很好的与gccgo编译器一同使用。但是，按照gccgo编译器的主要开发者Ian Lance Taylor的话来说，gccgo编译器并不需要cgo工具，也不应该使用gcc工具。不管怎样，这种情况将会在Go语言的1.3版本中得到改善。

第五类标记用于打印调试信息，包括标记```-debug-define```和```-debug-gcc```。gcc工具不但会生成新的Go语言源码文件以保存其对目标源码改写后的内容，还会生成若干个C语言源码文件。cgo工具为了编译这些C语言源码文件，就会用到gcc编译器。在加入```-debug-gcc```标记之后，gcc编译器的输出信息就会被打印到标准输出上。另外，gcc编译器在对C语言源码文件进行编译之后会产生一个结果文件。这个结果文件就是在_obj子目录下的名为_cgo_.o的文件。

第六类标记的默认值都为true。也就是说，在默认情况下cgo工具生成的_obj子目录下的Go语言源码文件_cgo_gotypes.go中会包含代码包导入语句```import _ "runtime/cgo"```和```import "syscall"```。代码包导入语句```import _ "runtime/cgo"```只是引发了代码包runtime/cgo中的初始化函数的执行而没有被分配到一个具体的命名空间上。在这些初始化函数中，包含了对一些C语言的全局变量和函数声明的初始化过程。需要注意的是，只要我们在执行```go tool cgo```命令的时候加入了标记```-gccgo```，即使标记```-import_runtime_cgo```有效，在Go语言源码文件_cgo_gotypes.go中也不会包含```import _ "runtime/cgo"```语句。

至此，我们在本小节讨论的都是Go语言代码如果通过cgo工具调用标准C语言编写的函数。其实，我们利用cgo工具还可以把Go语言编写的函数暴露给C语言代码。

Go语言可以使它的函数被C语言代码所用。这是通过使用一个特殊的注释“//export”来实现的。示例如下：

    package cgo
    
    /*
    #include <stdio.h>
    extern void CFunction1();
    */
    import "C"
    
    import "fmt"
    
    //export GoFunction1
    func GoFunction1() {
            fmt.Println("GoFunction1() is called.")
    }
    
    func CallCFunc() {
            C.CFunction1()
    }
    
在这个示例中，我们使用注释行“//export GoFunction1”把Go语言函数```GoFunction1```暴露给了C语言代码。注意，注释行中在“//export ”之后的字符串必须与其下一行的那个函数的名字一致。我们也可以把字符串“//export”看成一种指令符，就像```#cgo```和```#include```。这里有一个限制，就是只要我们使用了指令符“//export”，在当前源码文件的序文中就不能包含任何C语言定义语句，只可以包含C语言声明语句。上面示例的序文中的```extern void CFunction1();```就是一个很好的例子。序文中的这一行C语言声明语句会被拷贝到两个不同的cgo工具生成的C语言源码文件中。这也正是其序文中不能包含C语言定义语句的原因。那么C语言函数```CFunction1```的定义语句我们应该放在哪儿呢？答案是放到在同目录的其它Go语言源码文件的序文中，或者直接写到C语言源码文件中。

我们把上面示例中的内容保存到名为go_export.go的文件中，并放到goc2p项目的```basic/cgo/lib```代码包中。现在我们使用```go tool cgo```来处理这个源码文件。如下：

    hc@ubt:~/golang/goc2p/basic/cgo/lib$ go tool cgo go_export.go

之后，我们会发现在_obj子目录下的C语言头文件_cgo_export.h中包含了这样一行代码：

    extern void GoFunction1();

这说明C语言代码已经可以对函数```GoFunction1```进行调用了。现在我们使用```go build```命令构建goc2p项目的代码包```basic/cgo```，如下：

    hc@ubt:~/golang/goc2p/basic/cgo/lib$ go build
    # basic/cgo/lib
    /tmp/go-build477634277/basic/cgo/lib/_obj/go_export.cgo2.o: In function `_cgo_cc103c85817e_Cfunc_CFunction1':
    ./go_export.go:34: undefined reference to `CFunction1'
    collect2: ld return 1

构建并没有成功完成。根据错误提示信息我们获知，C语言函数```CFunction1```未被定义。这个问题的原因是我们并没有在Go语言源码文件go_export.go的序文中写入C语言函数```CFunction1```的实现，也即未对它进行定义。我们之前说过，在这种情况下，对应函数的定义应该被放到其它Go语言源码文件的序文或者C语言源码文件中。现在，我们在当前目录下创建一个新的Go语言源码文件go_export_def.go。其内容如下：

    package cgo
    
    /*
    #include <stdio.h>
    void CFunction1() {
            printf("CFunction1() is called.\n");
            GoFunction1();
    } 
    */
    import "C"


这个文件是专门用于存放C语言函数定义的。注意，由于C语言函数```printf```来自C语言标准代码库stdio.h，所以我们需要在序文中使用指令符#include将它引入。保存好源码文件go_export_def.go之后，我们重新使用```go tool cgo```命令处理这两个文件，如下：

    hc@ubt:~/golang/goc2p/basic/cgo/lib$ go tool cgo go_export.go go_export_def.go

然后，我们再次执行```go build```命令构建代码包```basic/cgo/lib```：

    hc@ubt:~/golang/goc2p/basic/cgo/lib$ go build

显然，这次的构建成功完成。当然单独构建代码包```basic/cgo/lib```并不是必须的。我们在这里是为了检查该代码包中的代码（包括Go语言代码和C语言代码）是否都能够被正确编译。

还记得goc2p项目的代码包basic/cgo中的命令源码文件cgo_demo.go。现在我们在它的main函数的最后加入一行新代码：```cgo.CallCFunc()```，即调用在代码包``basic/cgo/lib```中的库源码文件go_export.go的函数。然后，我们运行这个命令源码文件：

    hc@ubt:~/golang/goc2p/basic/cgo$ go run cgo_demo.go
    The square root of 2.330000 is 1.526434.
    ABC
    CFunction1() is called.
    GoFunction1() is called.

从输出的信息可以看出，我们定义的C语言函数```CFunction1```和Go语言函数```GoFunction1```都已被调用，并且调用顺序正如我们所愿。这个例子也说明，我们可以非常方便的使用cgo工具完成如下几件事：

1. Go语言代码调用标准C语言的代码。这也使得我们可以使用Go语言封装任何已存在的C语言代码库，并提供给其他Go语言代码使用。

2. 可以在Go语言源码文件的序文中自定义任何C语言代码并由Go语言代码使用。这使得我们可以更灵活的对C语言代码进行封装。同时，我们还可以利用这一特性在我们自定义的C语言代码中使用Go语言代码。

3. 通过指令符“//export”，可使C语言代码能够使用Go语言代码。这里所说的C语言代码是指我们在Go语言源码文件的序文中自定义的C语言代码。但是，```go tool cgo```命令会将序文中的C语言代码声明和定义分别写入到其生成的C语言头文件和C语言源码文件中。所以，从原则上讲，这已经具备了让外部C语言代码使用Go语言代码的能力。

综上所述，cgo工具不但可以使Go语言直接使用现存的非常丰富的C语言代码库，还可以使用Go语言代码扩展现有的C语言代码库。

至此，我们介绍了怎样独立的使用cgo工具。但实际上，我们可以直接使用标准go命令构建、安装和运行导入了代码包C的代码包和源码文件。标准go命令能够认出代码包C的导入语句并自动使用cgo工具进行处理。示例如下：

    hc@ubt:~/golang/goc2p/src/basic/cgo$ rm -rf lib/_obj
    hc@ubt:~/golang/goc2p/src/basic/cgo$ go run cgo_demo.go
    The square root of 2.330000 is 1.526434.
    ABC
    CFunction1() is called.
    GoFunction1() is called.
    
在上例中，我们首先删除了代码包```basic/cgo/lib```目录下的子目录_obj，以此来保证原始的测试环境。然后，我们直接运行了命令源码文件cgo_demo.go。在这个源码文件中，包含了对代码包```basic/cgo/lib```中函数的调用语句，而在这些函数中又包含了对代码包C的引用。从输出信息我们可以看出，命令源码文件cgo_demo.go的运行成功的完成了。这也验证了标准go命令在这方面的功能。不过，有时候我们还是很有必要单独使用```go tool cgo```命令，比如对相关的Go语言代码和C语言代码的功能进行验证或者需要通过标记定制化运行cgo工具的时候。另外，如果我们通过标准go命令构建或者安装直接或间接导入了代码C的命令源码文件，那么在生成的可执行文件中就会包含动态导入数据和动态链接器信息。我们可以使用```go tool cgo```命令查看可执行文件中的这些信息。