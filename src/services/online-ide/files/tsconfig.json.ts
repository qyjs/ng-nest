export default {
  compileOnSave: false,
  compilerOptions: {
    baseUrl: './',
    outDir: './dist/out-tsc',
    sourceMap: true,
    declaration: false,
    downlevelIteration: true,
    experimentalDecorators: true,
    module: 'esnext',
    moduleResolution: 'node',
    importHelpers: true,
    target: 'es2015',
    typeRoots: ['node_modules/@types'],
    lib: ['es2018', 'dom']
  },
  angularCompilerOptions: {
    fullTemplateTypeCheck: true,
    strictInjectionParameters: true
  }
};
