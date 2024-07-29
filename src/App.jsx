
import { Route ,Routes} from 'react-router-dom'
import './App.css'
import HomePage from './HomePage'
import InvoiceForm from './InvoiceForm'
import Navbar from './Navbar'
import SideBar from './SideBar'


export default function App() {
 
  return (
    <>
     <div className="flex font-mono">
     
      <SideBar/>
      {/* <HomePage/> */}
     
    </div>
    <Routes>
        <Route path='/invoiceform' element={<InvoiceForm/>}/>
      </Routes>
    </>
  )
}