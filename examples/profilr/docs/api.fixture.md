# profilr

## Constants

#### TARGET_MUST_BE_A_FUNCTION

```typescript
string TARGET_MUST_BE_A_FUNCTION = "Only class methods can be decorated."
```



---
#### UNSUPPORTED_CALL_SIGNATURE_ERROR

```typescript
string UNSUPPORTED_CALL_SIGNATURE_ERROR = "Unsupported call signature. Please check API docs."
```



---
#### state

```typescript
object state = undefined
```



---




## Functions

#### profile
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

Type | Name | Description
:--- | :--- | :----------
T | fn | a function
string | label | a label
[ProfileOptions](#profileoptions) | options | some options;

---
#### getNextId
```typescript
function getNextId(): number
```





---
#### processEvent
```typescript
function processEvent(event: PerformanceEvent): void
```



Type | Name | Description
:--- | :--- | :----------
[PerformanceEvent](#performanceevent) | event | -

---
#### registerEventCallback
```typescript
function registerEventCallback(cb: EventCallback): () => void
```



Type | Name | Description
:--- | :--- | :----------
[EventCallback](#eventcallback) | cb | -

---
#### useProfilr
```typescript
function useProfilr(active: boolean): void
```



Type | Name | Description
:--- | :--- | :----------
boolean | active | -

---
#### isFunction
```typescript
function isFunction(functionToCheck: any): boolean
```



Type | Name | Description
:--- | :--- | :----------
any | functionToCheck | -

---
#### isPromise
```typescript
function isPromise(obj: any): boolean
```



Type | Name | Description
:--- | :--- | :----------
any | obj | -

---




## Interfaces

#### ProfileOptions

```typescript
interface ProfileOptions  {
    custom: any
}
```



Type | Name | Description
:--- | :--- | :----------
any | custom | -

---
#### EventCallback

```typescript
interface EventCallback  {}
```





---
#### PerformanceEvent

```typescript
interface PerformanceEvent  {
    duration: number,
    fnName: string,
    id: number,
    label: string,
    options: ProfileOptions,
    result: any
}
```



Type | Name | Description
:--- | :--- | :----------
number | duration | -
string | fnName | -
number | id | -
string | label | -
[ProfileOptions](#profileoptions) | options | -
any | result | -

---
#### State

```typescript
interface State  {
    enabled: boolean,
    listeners: Array
}
```



Type | Name | Description
:--- | :--- | :----------
boolean | enabled | -
[Array](#array) | listeners | -

---

