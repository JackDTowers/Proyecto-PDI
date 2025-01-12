import { Injectable, OnDestroy } from '@angular/core';
import { PdiService } from './pdi.service';


const MINUTES_UNITL_AUTO_LOGOUT = 60; // en minutos
const CHECK_INTERVAL = 600000; // 10 min en milisegundos
const STORE_KEY = 'lastAction';

@Injectable({
  providedIn: 'root' // El servicio está disponible a nivel de toda la aplicación
})
export class AutoLogoutService implements OnDestroy {

  private eventListeners: (() => void)[] = []; // Para almacenar las funciones que eliminan los listeners

  constructor(private pdiService: PdiService) {
    this.setLastAction(Date.now());
    this.check();
    this.initListener();
    this.initInterval();
  }

  // Establece la fecha de la última acción en localStorage
  public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY)!);
  }

  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }

  // Inicializa los listeners de eventos
  initListener() {
    const events = [
      'click', 'mouseover', 'mouseout', 'keydown', 'keyup', 'keypress'
    ];

    events.forEach(eventType => {
      const handler = () => this.reset();
      document.body.addEventListener(eventType, handler);
      // Guardamos la función de limpieza en la lista
      this.eventListeners.push(() => document.body.removeEventListener(eventType, handler));
    });
  }

  // Reinicia el tiempo de inactividad
  reset() {
    this.setLastAction(Date.now());
  }

  // Inicia el intervalo para verificar la inactividad
  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  // Verifica si el tiempo de inactividad ha pasado
  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if (isTimeout) {
      this.pdiService.logout();
    }
  }

  // Limpia los eventListeners cuando el servicio ya no sea necesario
  ngOnDestroy() {
    // Elimina todos los event listeners registrados
    this.eventListeners.forEach(removeListener => removeListener());
  }
}