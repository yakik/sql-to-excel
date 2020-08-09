import React, { useState } from 'react';
import axios from "axios"
import './App.css';

interface Repository {
  name: string
  location: string
}

interface Commitment {
  message: string
  index: string
}

interface DiffLines {
  sourceDiff: Array<string>
  sourceWithEmbeddedDiff: Array<string>
}

interface Diff {
  path: string
  type: string
  change_type:string
  lines: DiffLines
}

let endPoint = 'http://127.0.0.1:5000'

/*if (process.env.NODE_ENV === envTypes.PRODUCTION) {
  endPoint = endPoints.PRODUCTION
}

let socket = io.connect(endPoint);
*/

export function App() {
  const [repositories, setRepositories] = useState<Array<Repository>>([]);
  const [activeRepository, setActiveRepository] = useState<null | Repository>();
  const [commitments, setCommitments] = useState<Array<Commitment>>([]);
  const [activeCommitment, setActiveCommitment] = useState<null | Commitment>();
  const [diffs, setDiffs] = useState<Array<Diff>>([]);
  const [activeDiff,setActiveDiff] = useState<Diff>({path:'',type:'',change_type:'',lines:{ sourceDiff: [],
    sourceWithEmbeddedDiff: []}})

  if (repositories.length === 0) {
    axios
      .post(endPoint + '/getRepositories', { myParam: 'yaki' })
      .then(
        res => {
          setRepositories(res.data)
        },
        error => {
          console.log(error);
        }
      )
  }

  const loadCommitments = () => {

    console.log('active:'+activeRepository?.name)
    
      axios
        .post(endPoint + '/getCommitments', { repository: activeRepository?.location })
        .then(
          res => {
            console.log(res.data)
            setCommitments(res.data)
          },
          error => {
            console.log(error);
          }
        )
  }

  const setActiveCommitmentAndLoadDiffs = (commitment:Commitment) => {
    setActiveCommitment(commitment)  
    console.log(commitment)
    axios
        .post(endPoint + '/getDiffs', { repository: activeRepository?.location, commitmentIndex:commitment.index })
        .then(
          res => {
            console.log(res.data)
            setDiffs(res.data)
          },
          error => {
            console.log(error);
          }
        )
  }

  const getSource = () => {
   // if (activeDiff !== null /*&&
     // ((activeDiff as Diff).change_type==='A' || (activeDiff as Diff).change_type==='M')*/) {
       console.log(activeDiff)
      let jsxSource: Array<JSX.Element> = []
      activeDiff?.lines.sourceWithEmbeddedDiff.forEach((line,index) => {
        jsxSource.push(<div className="whiteSpace" key={index} onClick={() => {  }}><span>{line}</span></div>)
      })
      return <div >{jsxSource}</div>
 //   }
  }

  const getDiffs = () => {
    let jsxDiffs: Array<JSX.Element> = []
    diffs.forEach(diff => {
      jsxDiffs.push(<div key={diff.path} onClick={()=>{setActiveDiff(diff)}}><span>{'('+diff.change_type+')'+diff.path}</span></div>)
    })
    return <div >{jsxDiffs}</div>
  }

  const getCommits = () => {
    let jsxCommitments: Array<JSX.Element> = []
    commitments.forEach(commitment => {
      jsxCommitments.push(<div onClick={()=>{setActiveCommitmentAndLoadDiffs(commitment)}} key={commitment.index}><span>{commitment.message}</span></div>)
    })
    return <div >{jsxCommitments}</div>
  }

  const getTable = () => {
    let jsxReporitories: Array<JSX.Element> = []
    for (let i = 0; i < 150; i++) {
      jsxReporitories.push(<div key={i}>{i}</div>)
    }
    //console.log(jsxReporitories)
    return <div>{jsxReporitories}</div>
  }

  const updateRepositoryAfterSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    let newRepository= repositories.find(repository => repository.name === event.target.value)
    setActiveRepository(newRepository)
    console.log('New:'+newRepository?.name)
  }

  const displayRepositories = () => {
    if (repositories !== null) {
      let jsxReporitories: Array<JSX.Element> = []
      jsxReporitories.push(<option key="please select" value="Select a repository"  disabled >Select a repository</option>)
      repositories.forEach(repository => jsxReporitories.push(<option key={repository.name} value={repository.name}>{repository.name}</option>))
      return <div><select  defaultValue="Select a repository" onChange={updateRepositoryAfterSelect}>{jsxReporitories}</select></div>
    }
  }

  return (
    <div className="grid-container">
      <div className="header">
        {displayRepositories()}
        <button disabled={activeRepository === null}  onClick={() => loadCommitments()}>Load Commitments</button>
        
      </div>
      <div className="commits">
      {getCommits()}
      </div>

      <div className="diffs">
      {getDiffs()}
      </div>
      
      <div className="source">
        {getSource()}
      </div>

      <div className="other">
        {getTable()}
      </div>
      
    </div>)

}
