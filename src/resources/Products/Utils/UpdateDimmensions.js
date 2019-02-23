export const updateDimensions = () => {
  let w = window;

  let d = document;

  let documentElement = d.documentElement;

  let body = d.getElementsByTagName('body')[0];

  let wrapperDiv = d.getElementById('dataGridWrapper');

  // let width = w.innerWidth || documentElement.clientWidth || body.clientWidth;

  let height = w.innerHeight || documentElement.clientHeight || body.clientHeight;
  wrapperDiv.height = height + 'px';
};
