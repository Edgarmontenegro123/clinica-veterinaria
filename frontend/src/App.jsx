import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './Components/Header'
/*import Footer from './Components/Footer'*/

function App() {

  return (
    //El componente Outlet le dice a react router en donde se renderizan las rutas hijo.
    <div id="app">
      <Header />
      <div id="wrapper" >
        <Outlet />
      </div>
     {/* <Footer /> */}
    </div>
  )
}

export default App
