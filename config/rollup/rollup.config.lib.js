import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import pkg from '../../package.json';

const EXPORT_NAME = 'createSberidSDK';

const extensions = ['.js', '.ts'];

const footer = `('SberidSDK' in this) && this.console && this.console.warn && this.console.warn('SberidSDK already declared on the global namespace');
this && this.${EXPORT_NAME} && (this.SberidSDK = this.SberidSDK || this.${EXPORT_NAME}.SberidSDK);`;

const banner = `/*${pkg.name} - v${pkg.version} - ${new Date().toLocaleDateString()}
'* ${pkg.homepage ? '* ' + pkg.homepage + '\\n' : ''}'
Используя данное SDK вы соглашаетесь с Пользовательским соглашением, размещенным по адресу: https://www.sberbank.ru/common/img/uploaded/files/sberbank_id/agreement_sdk.pdf */`;

const getPlugins = () => {
    return [
        resolve({
            browser: true,
        }),
        commonjs(),
        typescript({
            clean: true,
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
                noEmit: false,
                sourceMap: true,
                compilerOptions: {
                    lib: ['dom', 'es6'],
                },
            },
        }),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            extensions,
        }),
        terser(),
    ];
};

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.module,
                format: 'esm',
                name: EXPORT_NAME,
                banner,
                inlineDynamicImports: true,
            },
        ],
        plugins: [...getPlugins()],
    },
    {
        input: 'src/index.cjs.ts',
        output: [
            {
                file: 'dist/sberid-sdk.production.js',
                format: 'umd',
                name: EXPORT_NAME,
                footer,
                banner,
                inlineDynamicImports: true,
            },
        ],
        plugins: [...getPlugins()],
    },
    {
        input: 'src/index.cjs.ts',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                name: EXPORT_NAME,
                banner,
                inlineDynamicImports: true,
            },
        ],
        plugins: [...getPlugins()],
        external: Object.keys(pkg.dependencies),
    },
];
