/* eslint-disable @typescript-eslint/no-var-requires */
module.exports = {
    plugins: [
        require('postcss-import')(),
        require('postcss-url')({
            filter: 'src/styles/fonts/**/*',
            url: 'copy',
            assetsPath: 'fonts',
            useHash: true,
        }),
        require('postcss-inline-svg'),
        require('postcss-svgo'),
        require('postcss-preset-env')({stage: 1}),
        require('cssnano'),
    ],
};
