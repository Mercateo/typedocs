# exported-functions

## Constants

**CONST**

```typescript
string CONST = "FOO"
```

A constant.

---
**VAR**

```typescript
string VAR = "BAR"
```

A variable.

---


## Enumerations

**ENUM**
```typescript
enum ENUM {
    a = 1,
    b = 2
}
```

An enum.

Name | Description
:--- | :----------
a | This one is called a, the other has no doc.
b | -

---


## Functions

**add**
```typescript
function add(a: number, b: number): number
```



Name | Description
:--- | :----------
a | The first summand.
b | The second summand.

---
**subtract**
```typescript
function subtract(a: number, b: number): number
```



Name | Description
:--- | :----------
a | The minuend.
b | The subtrahend.

---


## Classes

**A**

```typescript
class A  {
    protected method(): void;
}
```

An exported superclass.

---
**dummyClass**

```typescript
class dummyClass extends A implements B, C {
    public constructor();
    public constructor(foo: number);


    public bar: number = 2;
    protected foo: any;

    public dummyFctExp(): void; // implementation of C.dummyFctExp
    protected method(): void; // inherited from A.method
}
```

This is a dummy class with no real doc.

---


## Interfaces

**B**

```typescript
interface B  {
    dummyFctExp: <T>(a: T) => void
}
```

An exported interface.

---
**C**

```typescript
interface C extends B  {
    dummyFctExp: <T>(a: T) => void // inherited from B.dummyFctExp
}
```



---

