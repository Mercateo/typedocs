# exported-functions

## Constants

#### CONST

```typescript
string CONST = "FOO"
```

A constant.

---
#### VAR

```typescript
string VAR = "BAR"
```

A variable.

---


## Enumerations

#### ENUM
```typescript
enum ENUM {
    a = 1,
    b = 2
}
```

An enum.

Type | Name | Description
:--- | :--- | :----------
[Enumeration member] | a | This one is called a, the other has no doc.
[Enumeration member] | b | -

---


## Functions

#### add
```typescript
function add(a: number, b: number): number
```



Type | Name | Description
:--- | :--- | :----------
number | a | The first summand.
number | b | The second summand.

---
#### subtract
```typescript
function subtract(a: number, b: number): number
```



Type | Name | Description
:--- | :--- | :----------
number | a | The minuend.
number | b | The subtrahend.

---


## Classes

#### A

```typescript
class A  {
    protected method(): void;
}
```

An exported superclass.

Type | Name | Description
:--- | :--- | :----------
[Method] | method | -

---
#### dummyClass

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

Type | Name | Description
:--- | :--- | :----------
[Constructor] | constructor | Default Constructor.;Constructor with foo.;Constructor implementation.;Constructor implementation.
number | bar | The 'bar' variable.
any | foo | -
[Method] | dummyFctExp | -
[Method] | dummyFctNotExp | -
[Method] | method | -

---


## Interfaces

#### B

```typescript
interface B  {
    dummyFctExp: <T>(a: T) => void
}
```

An exported interface.

Type | Name | Description
:--- | :--- | :----------
function | dummyFctExp | Generic interface function.

---
#### C

```typescript
interface C extends B  {
    dummyFctExp: <T>(a: T) => void // inherited from B.dummyFctExp
}
```



Type | Name | Description
:--- | :--- | :----------
function | dummyFctExp | Generic interface function.

---

