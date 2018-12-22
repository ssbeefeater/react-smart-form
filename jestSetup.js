require('raf/polyfill');
let Enzyme = require('enzyme');
let Adapter = require('enzyme-adapter-react-16');
// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() });

// Make Enzyme functions available in all test files without importing
global.window = global;
window.addEventListener = () => { };
window.requestAnimationFrame = () => {
    throw new Error('requestAnimationFrame is not supported in Node');
};
global.shallow = Enzyme.shallow;
global.render = Enzyme.render;
global.mount = Enzyme.mount;
global.window.localStorage = {};
