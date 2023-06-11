import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Notes from './pages/Notes'
import labelService from './services/labels'
import Create from './pages/Create'
import Layout from './components/Layout'
import EditLabels from './pages/EditLabels'

function App() {
  const [allLabels, setAllLabels] = useState([])

  useEffect(() => { 
    // Fatch Labels
    labelService
      .getAll()
      .then(data => setAllLabels(data))
      .catch(error => {
        console.log(error)
        //Network error message

        //////////////////////////////
        //Show Try again later message component
      })
  }, [])

  return (
    <Router>
      <Layout labels={allLabels}>
        <Routes>
          <Route 
            path="/" 
            element={<Notes allLabels={allLabels} labelToView="" />} 
          />
          <Route 
            path="/create" 
            element={<Create />} 
          />
          <Route 
            path="/labels" 
            element={<EditLabels allLabels={allLabels} setAllLabels={setAllLabels} />} 
          />
          {
            //ROUTES FOR LABELS
            allLabels.map(label => {
              return(
                <Route 
                  key={label.id}
                  path={`/label/${label.id}`} 
                  element={<Notes allLabels={allLabels} labelToView={label} />} 
                />
              )
            })
          }
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
