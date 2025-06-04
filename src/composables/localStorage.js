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
      const item = localStorage.getItem(this.key);
      if (item === null) {
        return null;
      }
      return JSON.parse(item);
    } catch (error) {
      console.log(error);
      return null;
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
