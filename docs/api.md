# typedocs
- [Functions](#functions)
    + [toMarkdown](#tomarkdown)
    + [toMarkdownFile](#tomarkdownfile)
    + [toMarkdownFileFrom](#tomarkdownfilefrom)
    + [toMarkdownFrom](#tomarkdownfrom)






## Functions

#### toMarkdown
```typescript
function toMarkdown(typeDocJsonFile: string): string
```



Type | Name | Description
:--- | :--- | :----------
string | typeDocJsonFile | the typedoc json output

---
#### toMarkdownFile
```typescript
function toMarkdownFile(typeDocJsonFile: string, outputFile: string): Promise<any>
```



Type | Name | Description
:--- | :--- | :----------
string | typeDocJsonFile | the typedoc json output
string | outputFile | the file to write markdown to; default is 'docs/api.md'

---
#### toMarkdownFileFrom
```typescript
function toMarkdownFileFrom(sourceDir: string, outputFile: string): Promise<any>
```



Type | Name | Description
:--- | :--- | :----------
string | sourceDir | your api entry point
string | outputFile | the file to write markdown to; default is 'docs/api.md'

---
#### toMarkdownFrom
```typescript
function toMarkdownFrom(sourceDir: string): Promise<string>
```



Type | Name | Description
:--- | :--- | :----------
string | sourceDir | your api entry point

---




