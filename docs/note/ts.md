# ts

## type 和 interface

### 相同点

都能继承

```ts
// extends
interface Parent {
  name: string,
  age: number
}

interface Child extends Parent {
  family: string
}

type Parent = {
  name: string,
  age: number
}
type Child = Parent & { family: string }

```

### 不同

type

```ts
// 声明更多变
type Name = string

interface Dog {
  wong()
}

interface Cat {
  miao()
}

type Pet = Cat | Dog
// 具体定义数组每个位置的类型
type Animals = [Dog, Pet]

// 能直接获取类型 
type B = typeof div
``` 

interface 声明能进行合并

```ts
interface User {
  name: string,
  age: number
}

interface User {
  sex: string
}
```