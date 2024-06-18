const randomTimeout = (min = 100, max = 200) => {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * (max - min)) + min;
    setTimeout(resolve, delay);
  });
};

export default randomTimeout;
