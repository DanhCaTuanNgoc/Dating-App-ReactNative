module.exports = function (api) {
   api.cache(true)
   return {
      // presets: ['module:metro-react-native-babel-preset'],
      presets: ['@react-native/babel-preset'],
      plugins: [
         [
            'module-resolver',
            {
               root: ['./'],
               alias: {
                  '@': './',
               },
            },
         ],
         ['@babel/plugin-transform-private-methods', { loose: true }],
         ['@babel/plugin-transform-class-properties', { loose: true }],
         ['@babel/plugin-transform-private-property-in-object', { loose: true }],
      ],
   }
}
