import { transformSync } from '@babel/core';

const cssLangs = `\\.(css|scss)($|\\?)`;

const importRE = /import\s+([\S]+)\s+from\s+('|")([\S]+)\.(css|less|sass|scss|styl|stylus|postcss)(\?[\S]*)?('|")/;

const jsRE = /\.(js|mjs|ts|jsx|tsx)/;

const cssLangRE = new RegExp(cssLangs);
const cssModuleRE = new RegExp(`\\.module${cssLangs}`);

const name = 'vite-plugin-react-css-modules';

function autoCSSModulePlugin() {
  return () => ({
    visitor: {
      ImportDeclaration: (path) => {
        const { node } = path;

        if (!node) {
          return;
        }

        if (
          node.specifiers &&
          node.specifiers.length > 0 &&
          cssLangRE.test(node.source.value) &&
          !cssModuleRE.test(node.source.value)
        ) {
          const cssFile = node.source.value;
          node.source.value = cssFile + (cssFile.indexOf('?') > -1 ? '&' : '?') + '.module.styl';
        }
      }
    }
  });
}

function transform(code, { sourceMap, file }) {
  const parsePlugins = ['jsx'];

  if (/\.tsx?$/.test(file)) {
    parsePlugins.push('typescript');
  }

  const result = transformSync(code, {
    configFile: false,
    parserOpts: {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
      plugins: parsePlugins
    },
    sourceMaps: true,
    sourceFileName: file,
    inputSourceMap: sourceMap,
    plugins: [autoCSSModulePlugin()]
  });

  return {
    code: result?.code,
    map: result?.map
  };
}

export default function vitePluginReactCssModules() {
  return {
    name,
    transform(code, id) {
      if (jsRE.test(id) && importRE.test(code)) {
        const result = transform(code, {
          file: id,
          sourceMap: this.getCombinedSourcemap()
        });

        if (result) {
          return result;
        }
      }

      return undefined;
    }
  };
}
