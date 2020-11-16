/* eslint-disable */
const IN_PRODUCTION = process.env.NODE_ENV === 'production'
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 1,
      features: {
        'custom-media-queries': {
          importFrom: 'src//assets/styles/queries.css',
        },
        'nesting-rules': true,
      },
    }),
    require('tailwindcss')('./tailwind.config.js'),
    IN_PRODUCTION &&
      purgecss({
        content: [`./public/**/*.html`, `./src/**/*.vue`],
        defaultExtractor(content) {
          const contentWithoutStyleBlocks = content.replace(
            /<style[^]+?<\/style>/gi,
            ''
          )
          return (
            contentWithoutStyleBlocks.match(
              /[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g
            ) || []
          )
        },
        safelist: [
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/,
        ],
      }),
    require('autoprefixer')(),
  ],
}
