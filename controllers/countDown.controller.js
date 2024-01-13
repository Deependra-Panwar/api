import {BehaviorSubject, timer} from 'rxjs';
import GameIdService from './gameId.controller.js';
class CountdownService {
  gameIdService = new GameIdService()
  GAMEID ='121212';
  constructor() {
    this.timer = 0;
    this.last30SecondsSubject = new BehaviorSubject(false);
    this.countdownInterval = null;
    this.currentYear = null;
    this.currentMonth = null;
    this.currentDay = null;
    this.currentNumber = 1;
    this.gameIdSubject = new BehaviorSubject('');
    this.generateGameId();
    

    // // Connect to the WebSocket server
    // this.socket = io('http://localhost:3000');
    // this.socket.on('hello', (arg) => {
    //   console.log(arg);
    // });

    this.startCountdown(10); // Start a 2-minute countdown when the service is created
  }

  startCountdown(seconds) {
    this.timer = seconds;

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval); // Stop the previous interval if it exists
    }

    this.countdownInterval = setInterval(() => {
      this.timer--;
      this.last30SecondsSubject.next(this.isLast30Seconds());

      if (this.timer <= 0) {
        this.resetCountdown(); // Reset the countdown when it reaches 00:00
      }
    }, 1000);
  }

  getRemainingTime() {
    return new Promise((resolve, reject) => {
      resolve(this.timer);
      if (this.timer <= 0) {
        reject('Countdown completed');
      }
    });
  }

  isLast30Seconds() {
    return this.timer <= 30;
  }

  getLast30SecondsObservable() {
    return this.last30SecondsSubject.asObservable();
  }

  resetCountdown() {
   // this.socket.emit('resetCountdown'); // You may need to implement this event on the server side
   this.generateGameId();
   this.startCountdown(10); // Reset the countdown to 2 minutes
  }

  stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  getTime() {
     return this.timer
    // const formattedMinutes = Math.floor(this.timer / 60);
    // const formattedSeconds = this.timer % 60;
    // return `${formattedMinutes < 10 ? '0' : ''}${formattedMinutes}:${formattedSeconds < 10 ? '0' : ''}${formattedSeconds}`;
  }

  generateGameId() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    if (year === this.currentYear && month === this.currentMonth && day === this.currentDay) {
      this.currentNumber++;
    } else {
      this.currentYear = year;
      this.currentMonth = month;
      this.currentDay = day;
      this.currentNumber = 1;
    }

    const formattedNumber = this.currentNumber.toString().padStart(5, '0');
    const gameId = `${year}${month}${day}${formattedNumber}`;
    this.GAMEID =gameId
    return gameId;
  }

  // getGameIdObservable() {
  //   return this.gameIdSubject.asObservable();
  // }
}

export default CountdownService;
