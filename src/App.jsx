
import './App.css'
import HomePage from './HomePage'
import SideBar from './SideBar'


export default function App() {
 
  return (
    <div className="flex font-mono">
      <SideBar/>
      <HomePage/>
    </div>
  )
}