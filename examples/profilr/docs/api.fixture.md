# profilr
- [Functions](#functions)
    + [profile](#profile)
    + [registerEventCallback](#registereventcallback)
- [Interfaces](#interfaces)
    + [ProfileOptions](#profileoptions)
    + [EventCallback](#eventcallback)
    + [PerformanceEvent](#performanceevent)






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
[ProfileOptions](#profileoptions) | options | some options 

---
#### registerEventCallback
```typescript
function registerEventCallback(cb: EventCallback): () => void
```



Type | Name | Description
:--- | :--- | :----------
[EventCallback](#eventcallback) | cb | -

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
interface EventCallback  {
    id: number

    <T>(event: PerformanceEvent) => void
}
```





Type | Name | Description
:--- | :--- | :----------
number | id | -
[Call signature] | <T>([PerformanceEvent](#performanceevent)): void | -

---
#### PerformanceEvent

```typescript
interface PerformanceEvent  {
    duration: number,
    fnName: string,
    id: number,
    label: string,
    options?: ProfileOptions,
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
