import { useContext } from 'react'
import "./Submission.css"
import Context from './Context.jsx'

const Submission = ({ title, code, resultString }) => {
  const userData = useContext(Context);
  return (
    <div className="submission-container">
      <div className='leftPanel'>
        <h3>Problem: {title}</h3>
        <h5>Solution:</h5>
        <pre className="code-block">{code}</pre>
      </div>
      <div className='rightPanel'>
        <h3>Testcases</h3>
        <h5>Result:</h5>
        <pre className="result-block">{resultString}</pre>
      </div>
    </div>
  )
}

export default Submission;