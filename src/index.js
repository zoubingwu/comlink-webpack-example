import * as Comlink from 'comlink'
import WorkerAdd from './calc.worker'
import WorkerPi from './pi.worker'
import pi from './pi'

(async function(){
  const { add } = Comlink.wrap(new WorkerAdd())

  const res = await add(1, 3)
  console.log(res)

  const piworker = Comlink.wrap(new WorkerPi())

  const btnmain = document.querySelector('#btnmain')
  const btnworker = document.querySelector('#btnworker')

  let rotation = 0;
  setInterval(() => window.pie.style.transform = `rotate(${rotation+=10}deg)`, 10);

  btnmain.onclick = () => {
    document.getElementById('put-pi-here').textContent = 'working...';
    document.getElementById('put-pi-here').textContent = '3.' + pi(30000).slice(1);
  }

  btnworker.onclick = async () => {
    document.getElementById('put-pi-here').textContent = 'working...';
    document.getElementById('put-pi-here').textContent = '3.' + (await piworker(30000)).slice(1);
  }
})()
