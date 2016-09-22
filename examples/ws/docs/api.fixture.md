# @mercateo/ws
- [Constants](#constants)
    + [TYPE](#type)
- [Functions](#functions)
    + [validate](#validate)
- [Interfaces](#interfaces)
    + [IProject](#iproject)
      - [ws](#ws)
      - [i18n](#i18n)
      - [selenium](#selenium)


## Constants

#### TYPE

```typescript
object TYPE = {
    BROWSER: 'browser',
    NODE: 'node',
    SPA: 'spa'
}
```



---




## Functions

#### validate
```typescript
function validate(pkg: any): IProject
```



Type | Name | Description
:--- | :--- | :----------
any | pkg | -

---




## Interfaces

#### IProject

```typescript
interface IProject  {
    dependencies?: { [dependency: string]: string; },
    keywords?: string,
    name: string,
    private?: boolean,
    ws: {
        browsers: string,
        distDir: string,
        distReleaseDir: string,
        distTestsDir: string,
        entryExtension: 'js' | 'ts' | 'tsx',
        externals?: any,
        i18n?: {
            dir: string,
            features?: string,
            importUrl?: string,
            isSingleLocale?: boolean,
            locales: string },
        selenium?: {
            filterForAvailability: boolean,
            host: string,
            password?: string,
            port: number,
            user?: string },
        srcDir: string,
        testsDir: string,
        tsconfig?: CompilerOptions,
        type: 'spa' | 'node' | 'browser' }
}
```





Type | Name | Description
:--- | :--- | :----------
IndexSignature | dependencies | The dependencies of your project.
string | keywords | Keywords which describe your project.
string | name | The name of your project taken from `package.json`.
boolean | private | Flags if this package is private.
Object | [ws](#ws) | This is the `ws` configuration used in the projects `package.json`.

##### ws

Type | Name | Description
:--- | :--- | :----------
string | browsers | A [browserslist](https://github.com/ai/browserslist) compatible string to specify which browsers should be used for selenium testing (if it is enabled) and for [autoprefixer](https://github.com/postcss/autoprefixer). Defaults to `'> 1%, last 2 versions, Firefox ESR'`.
string | distDir | The directory where your development build is generated. If you have a browser components project, optimized files will live here, too.
string | distReleaseDir | The directory where your production build is generated (only SPAs).
string | distTestsDir | The directory where your tests build is generated.
'js' OR 'ts' OR 'tsx' | entryExtension | The file extension of your entry file. Either `js`, `ts` or `tsx`.
any | externals | Probably only needed for 'browser' projects currently. See https://webpack.github.io/docs/configuration.html#externals.
Object | [i18n](#i18n) | Our i18n settings. Only needed for translated projects.
Object | [selenium](#selenium) | Our selenium settings. Only needed if you run tests in selenium.
string | srcDir | The directory where your source code is located.
string | testsDir | The directory where your tests are located.
CompilerOptions | tsconfig | If this is a TypeScript project, we will save the `tsconfig.json` here.
'spa' OR 'node' OR 'browser' | type | We currently support three types of projects: `'spa'`, `'node'` and `'browser'`.

##### i18n

Type | Name | Description
:--- | :--- | :----------
string | dir | The directory where your `.properties` with translations are located. Defaults to `i18n`.
string | features | You can group translations in so called _features_ (e.g. `common`, `errors`, `forms`).
string | importUrl | If you translations aren't maintained in your repository, you can optionally provide a _templated URL_ and we try to download the translations. You can set `{locale}` and `{feature}` in your URL as params (e.g. `https://foo.com/i18n?language={locale}&project={feature}`).
boolean | isSingleLocale | If you want to have the benefits of i18n like using the message format, but you _really_ just want to support _one_ locale, you can generate your projects as if you would not support any locale at all (e.g. generated SPAs aren't nested in a directory for every locale).
string | locales | The locales your project supports. A locale consists of a language code (expressed by two lower case characters), a `_` and a country code (expressed by two upper case characters). E.g. valid locales are `'en_GB'`, `'de_AT'`, `'it_IT'` and so on.

##### selenium

Type | Name | Description
:--- | :--- | :----------
boolean | filterForAvailability | Tries to use the `browsers` query only against available browsers on the selenium grid. E.g. `"last 2 Chrome versions"` would return the last 2 chrome versions available on the grid, not the last 2 released chrome versions. Defaults to `false`.
string | host | The host of selenium.
string | password | Password which should be used to access selenium (e.g. needed for Sauce Labs).
number | port | The port of selenium.
string | user | User name which should be used to access selenium (e.g. needed for Sauce Labs).

---
