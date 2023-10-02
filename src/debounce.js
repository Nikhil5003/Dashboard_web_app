const debounce = (fn, delay) => {
  let timerID;
  return function (...args) {
    clearInterval(timerID);
    timerID = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
export default debounce;
