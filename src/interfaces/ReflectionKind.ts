export enum ReflectionKind
{
  Global = 0,
  ExternalModule = 1,
  Module = 2,
  Enum = 4,
  EnumMember = 16,
  Variable = 32,
  Function = 64,
  Class = 128,
  Interface = 256,
  Constructor = 512,
  Property = 1024,
  Method = 2048,
  CallSignature = 4096,
  IndexSignature = 8192,
  ConstructorSignature = 16384,
  Parameter = 32768,
  TypeLiteral = 65536,
  TypeParameter = 131072,
  Accessor = 262144,
  GetSignature = 524288,
  SetSignature = 1048576,
  ObjectLiteral = 2097152,
  TypeAlias = 4194304,
  Event = 8388608,

  ClassOrInterface = Class | Interface,
  VariableOrProperty = Variable | Property,
  FunctionOrMethod = Function | Method,
  SomeSignature = CallSignature | IndexSignature | ConstructorSignature | GetSignature | SetSignature,
  SomeModule = Module | ExternalModule
}

