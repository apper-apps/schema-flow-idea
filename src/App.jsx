import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import SchemaCanvas from '@/components/pages/SchemaCanvas'

function App() {
  return (
    <BrowserRouter>
      <div className="App min-h-screen bg-background text-white">
        <SchemaCanvas />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App