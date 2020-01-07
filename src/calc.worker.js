import * as Comlink from 'comlink';

function add(a, b) {
  return a + b;
}

Comlink.expose({
  add
});
