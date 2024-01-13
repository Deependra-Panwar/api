import {BehaviorSubject} from 'rxjs';

class GameIdService {
  constructor() {
    this.currentYear = null;
    this.currentMonth = null;
    this.currentDay = null;
    this.currentNumber = 1;
    this.gameIdSubject = new BehaviorSubject('');

    // Connect to the WebSocket server
    // this.socket = io('http://localhost:3000');
    // this.socket.on('resetCountdown', () => {
    //   this.generateGameId();
    // });

    this.generateGameId();
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
    this.gameIdSubject.next(gameId);
  }

  getGameIdObservable() {
    return this.gameIdSubject.asObservable();
  }
}
export default GameIdService;
