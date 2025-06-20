const Logger = {
    enabled: true,
  
    log(...args) {
      if (this.enabled) {
        console.log(...args);
      }
    },
  
    warn(...args) {
      if (this.enabled) {
        console.warn(...args);
      }
    },
  
    error(...args) {
      if (this.enabled) {
        console.error(...args);
      }
    },
  
    setEnabled(state) {
      this.enabled = state;
    }
  };
  
  export default Logger;
  