export default class useLocalStorage {
  constructor(key) {
    this.key = key;
  }
  save(data) {
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }
  load() {
    try {
      localStorage.getItem(this.key);
    } catch (error) {
      console.log(error);
    }
  }
  remove() {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.log(error);
    }
  }
}
