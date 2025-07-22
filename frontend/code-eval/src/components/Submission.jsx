import React from 'react'
import "./Submission.css"

const Submission = ({pastSubmission}) => {
  return (
    <div className = "submission-container">
        Submission: {pastSubmission}
    </div>
  )
}

export default Submission;