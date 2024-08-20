
import { Route ,Routes} from 'react-router-dom'
import './App.css'
import InvoiceForm from './InvoiceForm'
import SideBar from './SideBar'
import { useState } from 'react'
import ViewInvoices from './ViewInvoices'


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
        <Route path='/createinvoices' element={<InvoiceForm/>}/>
        <Route path='/viewinvoice' element={<ViewInvoices/>}/>
      </Routes>
    </>
  )
}