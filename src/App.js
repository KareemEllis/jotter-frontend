import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Notes from './pages/Notes'
import Create from './pages/Create'
import Layout from './components/Layout'
import EditLabels from './pages/EditLabels'

function App() {
  const [allLabels, setAllLabels] = useState([])

  useEffect(() => { 
      // Fatch Labels
    fetch('http://localhost:8000/labels')
      .then(res => res.json())
      .then(data => {
        setAllLabels(data)
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
