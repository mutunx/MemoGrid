import './style.css'
import eventData from './data/events.json';
import MemoGrid from "./src/main.js";

window.onload = () => {
    const container = document.querySelector('#app');
    const memoGrid = new MemoGrid(container, eventData);
    memoGrid.render();



}
