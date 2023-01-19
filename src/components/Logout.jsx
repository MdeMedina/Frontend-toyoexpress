import { useHistory } from "react-router-dom";

export default function Logout () {
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    localStorage.removeItem('key')
    localStorage.removeItem('permissions')
    localStorage.removeItem('email')
    localStorage.removeItem("HourAlert")    
    const history = useHistory()
    history.push('/login')

}