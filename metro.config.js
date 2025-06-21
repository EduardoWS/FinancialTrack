const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname)

config.resolver.sourceExts.push('cjs');

// ‣ desativa package exports (causa do bug)
config.resolver.unstable_enablePackageExports = false;

 
module.exports = withNativeWind(config, { input: './styles/global.css' })