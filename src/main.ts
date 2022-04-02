import './style.css'
import {Simulation} from "./Simulation";
import {defaultMode, demoMode} from "./mode";

const mode = (new URLSearchParams(window.location.search).get("mode") ?? "default").toLowerCase()

const simulation = new Simulation(document.querySelector<HTMLCanvasElement>('#app')!!);

switch (mode) {
    case 'demo':
        demoMode(simulation)
        break
    default:
        defaultMode(simulation)
}

simulation.start()
