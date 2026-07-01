interface ImportMeta {
  // By TypeScript design we must use `import()`
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  jest: typeof jest & import('@riven/shared/esm').WithEsmMock;
}
