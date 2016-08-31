# profilr

## Constants

**TARGET_MUST_BE_A_FUNCTION**

```typescript
string TARGET_MUST_BE_A_FUNCTION = "Only class methods can be decorated."
```



---
**UNSUPPORTED_CALL_SIGNATURE_ERROR**

```typescript
string UNSUPPORTED_CALL_SIGNATURE_ERROR = "Unsupported call signature. Please check API docs."
```



---
**state**

```typescript
object state = undefined
```



---




## Functions

**profile**
```typescript
function profile<T extends Function>(fn: T, label: string, options: ProfileOptions): T
function profile<T extends Function>(fn: T, options: ProfileOptions): T
function profile<T extends Function>(fn: T, label: string): T
function profile<T>(fn: T): T
function profile(label: string, options: ProfileOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor
function profile(options: ProfileOptions): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor
function profile(label: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor
function profile(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor
```

Dummy doc.

Name | Description
:--- | :----------
fn | a function
label | a label
options | some options


---
**getNextId**
```typescript
function getNextId(): number
```





---
**processEvent**
```typescript
function processEvent(event: PerformanceEvent): void
```



Name | Description
:--- | :----------
event | -

---
**registerEventCallback**
```typescript
function registerEventCallback(cb: EventCallback): () => void
```



Name | Description
:--- | :----------
cb | -

---
**useProfilr**
```typescript
function useProfilr(active: boolean): void
```



Name | Description
:--- | :----------
active | -

---
**isFunction**
```typescript
function isFunction(functionToCheck: any): boolean
```



Name | Description
:--- | :----------
functionToCheck | -

---
**isPromise**
```typescript
function isPromise(obj: any): boolean
```



Name | Description
:--- | :----------
obj | -

---




## Interfaces

**ProfileOptions**

```typescript
interface ProfileOptions { }
```



---
**EventCallback**

```typescript
interface EventCallback { }
```



---
**PerformanceEvent**

```typescript
interface PerformanceEvent { }
```



---
**State**

```typescript
interface State { }
```



---

