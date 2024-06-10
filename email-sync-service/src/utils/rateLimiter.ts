export const rateLimiter = (limit: number, duration: number) => {
    let tokens = limit;
    let lastTime = Date.now();
  
    return () => {
      const now = Date.now();
      const elapsedTime = now - lastTime;
  
      tokens += (elapsedTime / duration) * limit;
      tokens = Math.min(tokens, limit);
      lastTime = now;
  
      if (tokens >= 1) {
        tokens -= 1;
        return true;
      } else {
        return false;
      }
    };
  };
  