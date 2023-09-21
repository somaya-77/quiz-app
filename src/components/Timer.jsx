import { useEffect } from "react"
const Timer = ({timer,dispatch}) => {
  const mins = Math.floor(timer / 60);
  const seconds = timer % 60;
  useEffect(
    function () {
      const clearTimer = setInterval(function () {
        dispatch({type: "tick"});
      }, 1000);
      return () => clearInterval(clearTimer);
    },
   [dispatch]);

  return (
    <div className='timer'>{mins < 10 && "0"}{mins}:{seconds < 10 && "0"}{seconds}</div>
  )
}

export default Timer;
