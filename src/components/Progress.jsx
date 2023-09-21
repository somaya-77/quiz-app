const Progress = ({numQustions , index ,points,maxPoints, answer}) => {
  return (
    <header className="progress">
        <progress max={numQustions} value={index + Number(answer !== null)}/>
        <p>Question <strong>{index + 1}</strong> / {numQustions}</p>
        <p><strong>{points}</strong> / {maxPoints} points</p>
    </header>
  )
}

export default Progress;