import { configure } from '@storybook/react';

const req = require.context('../stories', true, /\.stories\.tsx/);

function loadStories() {
  req.keys().forEach(filename => {console.log(filename);return req(filename)});
}

configure(loadStories, module);
