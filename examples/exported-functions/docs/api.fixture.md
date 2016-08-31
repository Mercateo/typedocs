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
class A  {}
```

An exported superclass.

---
**dummyClass**

```typescript
class dummyClass extends A implements B, C {
    constr
}
```

This is a dummy class with no real doc.

---


## Interfaces

**B**

```typescript
interface B  {
    dummyFctExp: undefined
}
```

An exported interface.

---
**C**

```typescript
interface C extends B  {
    dummyFctExp: undefined
}
```



---

