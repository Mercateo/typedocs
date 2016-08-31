# profilr

## Constants

**TARGET_MUST_BE_A_FUNCTION**

`string TARGET_MUST_BE_A_FUNCTION = "Only class methods can be decorated."`



---
**UNSUPPORTED_CALL_SIGNATURE_ERROR**

`string UNSUPPORTED_CALL_SIGNATURE_ERROR = "Unsupported call signature. Please check API docs."`



---
**state**

`object state = undefined`



---




## Functions

**profile**
```javascript
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
```javascript
function getNextId(): number
```



---
**processEvent**
```javascript
function processEvent(event: PerformanceEvent): void
```


Name | Description
:--- | :----------
event | -

---
**registerEventCallback**
```javascript
function registerEventCallback(cb: EventCallback): () => void
```


Name | Description
:--- | :----------
cb | -

---
**useProfilr**
```javascript
function useProfilr(active: boolean): void
```


Name | Description
:--- | :----------
active | -

---
**isFunction**
```javascript
function isFunction(functionToCheck: any): boolean
```


Name | Description
:--- | :----------
functionToCheck | -

---
**isPromise**
```javascript
function isPromise(obj: any): boolean
```


Name | Description
:--- | :----------
obj | -

---




## Interfaces

**ProfileOptions**

`interface ProfileOptions { }`



---
**EventCallback**

`interface EventCallback { }`



---
**PerformanceEvent**

`interface PerformanceEvent { }`



---
**State**

`interface State { }`



---

