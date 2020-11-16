module.exports = {
  pwa: {
    name: 'Listo',
    themeColor: '#1A202C',
    msTileColor: '#1A202C',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      name: 'Listo',
      short_name: 'Listo',
      start_url: '.',
      display: 'standalone',
      theme_color: '#1A202C',
      background_color: '#F7FAFC'
    },
    icons: [
      {
        src: './img/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: './img/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: './img/icons/android-chrome-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: './img/icons/android-chrome-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: './img/icons/apple-touch-icon-60x60.png',
        sizes: '60x60',
        type: 'image/png',
      },
      {
        src: './img/icons/apple-touch-icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: './img/icons/apple-touch-icon-76x76.png',
        sizes: '76x76',
        type: 'image/png',
      },
      {
        src: './img/icons/apple-touch-icon-114x114.png',
        sizes: '114x114',
        type: 'image/png',
      },
      {
        src: './img/icons/apple-touch-icon-120x120.png',
        sizes: '120x120',
        type: 'image/png',
      },
      {
        src: './img/icons/apple-touch-icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: './img/icons/apple-touch-icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: './img/icons/apple-touch-icon-180x180.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: './img/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: './img/icons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: './img/icons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: './img/icons/msapplication-icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: './img/icons/mstile-150x150.png',
        sizes: '150x150',
        type: 'image/png',
      },
    ],
    workboxOptions: {
      exclude: [/_redirects/],
    },
  },
}
