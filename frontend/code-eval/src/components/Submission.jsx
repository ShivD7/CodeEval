import {useContext} from 'react'
import "./Submission.css"
import Context from './Context.jsx'

const Submission = ({title, code, resultString}) => {
  const userData = useContext(Context);
  return (
      <div className = "submission-container">
        <div className='leftPanel'>
          <h3>Problem: {title}</h3>
          <h5>Solution:</h5>
          <p>{code}</p>
        </div>
        <div className = 'rightPanel'>
            <h3>Result:</h3>
            <p>{resultString}</p>
        </div>
      </div>
    )
}

export default Submission;