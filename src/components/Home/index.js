import React from 'react'
import Navg from '../sub-components/nav'

import Sidebar from '../sub-components/sidebar'
import {useHistory} from 'react-router-dom'
function Home({socket}) {
  const history = useHistory()
  const key = localStorage.getItem('key')
  if (!key) {
    history.push('/login')
  }
return (
<>
  <Navg socket={socket}/>
  <Sidebar />
</>
)
}

export default Home