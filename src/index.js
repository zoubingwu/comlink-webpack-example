import * as Comlink from 'comlink';
import WorkerAdd from './calc.worker';
import WorkerPi from './pi.worker';
import pi from './pi';

(async function() {
  const { add } = Comlink.wrap(new WorkerAdd());

  const res = await add(1, 3);
  console.log(res);

  const piworker = Comlink.wrap(new WorkerPi());

  const btnmain = document.querySelector('#btnmain');
  const btnworker = document.querySelector('#btnworker');
  const content = document.querySelector('#put-pi-here');

  let rotation = 0;
  setInterval(
    () => (window.pie.style.transform = `rotate(${(rotation += 10) % 360}deg)`),
    10
  );

  btnmain.onclick = () => {
    content.textContent = 'working...';

    window.requestIdleCallback(() => {
      content.textContent = '3.' + pi(30000).slice(1);
    });
  };

  btnworker.onclick = async () => {
    content.textContent = 'working...';
    content.textContent = '3.' + (await piworker(30000)).slice(1);
  };
})();
