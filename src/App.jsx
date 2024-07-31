
import { Route ,Routes} from 'react-router-dom'
import './App.css'
import InvoiceForm from './InvoiceForm'
import SideBar from './SideBar'
import { useState } from 'react'


export default function App() {
 const [globalCxt,setGlobalCxt]=useState({
  open:true
 })
  return (
    <>
     <div className="flex font-mono">
     
      <SideBar/>
     
    </div>
    <Routes>
        <Route path='/invoiceform' element={<InvoiceForm/>}/>
      </Routes>
    </>
  )
}