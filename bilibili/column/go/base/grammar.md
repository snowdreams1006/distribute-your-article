# 基础语法

## `GO` 基础语法讲解

- 关键字,标识符,注释,基础结构
- package,import,别名,路径,`.` `_` 的使用说明
- `GO` 变量,函数可见性规则

### 关键字,标识符

- `GO` 中保留关键字只有 `25` 个:

```
break default func interface select
case defer go map struct 
chan else goto package switch
const fallthrough if range type 
continue for import return var
```

> 不必强记,根据平时开发经验来看,都是开发时常用的.

- `GO` 中 `36` 个预定的标识符,其包括基础数据类型和系统内嵌函数:

```
append bool byte cap close complex
complex64 complex128 uint16 copy false float32
float64 imag int int8 int16 uint32 
int32 int64 iota len make new
nil panic uint64 print println real 
recover string TRUE unit unit8 uintprt
```

### 注释,基础结构

- 注释形式
  * //单行注释
  * /*多行注释*/
  * 一般是用单行注释较多
- 基础结构

常量建议大写: `const NAME="imooc"`
`main` 函数外定义的变量时全局变量:  `var name = "global variable"`


