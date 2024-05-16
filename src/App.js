import { useState } from 'react';
import main from './main.js';

function App() {

  const [content, setContent] = useState('')
  const [add, setadd] = useState('')
  const [sub, setsub] = useState('')
  const [mul, setmul] = useState('')
  const [div, setdiv] = useState('')
  const [ld, setld] = useState('')
  const [str, setstr] = useState('')

  const handleFile = (e) => {
    const content1 = e.target.result;
    console.log(content1)
    setContent(content1);
  }

  const handleChangeFile = (file) => {
    let fileData = new FileReader();
    fileData.onloadend = handleFile;
    fileData.readAsText(file);
  }

  const [result, setResult] = useState(null)

  const go = () => {
    if (content === '') {
      return alert('enter a non empty file.')
    }

    setResult(main(content, add, sub, mul, div, ld, str));
  }

  const seeRes = () => {
    console.log(result);
  }


  return (
    <div>
      <input type="file" accept=".txt" onChange={e =>
        handleChangeFile(e.target.files[0])} />
      <br></br>
      <label>Enter Add Latency</label>
      <input type="text" onChange={e =>
        setadd(e.target.value)}></input>
      <br></br>
      <label>Enter Sub Latency</label>
      <input type="text" onChange={e =>
        setsub(e.target.value)}></input>
      <br></br>
      <label>Enter Mul Latency</label>
      <input type="text" onChange={e =>
        setmul(e.target.value)}></input>
      <br></br>
      <label>Enter Div Latency</label>
      <input type="text" onChange={e =>
        setdiv(e.target.value)}></input>
      <br></br>
      <label>Enter Load Latency</label>
      <input type="text" onChange={e =>
        setld(e.target.value)}></input>
      <br></br>
      <label>Enter Store Latency</label>
      <input type="text" onChange={e =>
        setstr(e.target.value)}></input>

      <br></br>
      <button onClick={go}>let's go</button>
      <button onClick={seeRes}>l go</button>

      {result && result.map(res => {
        <div>
          <hr></hr>
          <h1>Cycle: {res.cycle}</h1>

          <table>
            <tr>
              <th>Instruction</th>
              <th>Destination Register</th>
              <th>j</th>
              <th>k</th>
              <th>issue</th>
              <th>execution complete</th>
              <th>write result</th>
            </tr>

            {
              res.Table.map(row => {
                <tr>
                  <td>Alfreds Futterkiste</td>
                  <td>Maria Anders</td>
                  <td>Germany</td>
                </tr>
              })
            }

          </table>
        </div>

      })



      }


    </div>
  );
}

module.exports = App;
