import React from 'react'
import HeaderMenu from './HeaderMenu'
import FooterMenu from './FooterMenu'

const Dashboard = () => {
  return (
    <React.Fragment>
      <HeaderMenu />
      <div>Dashboard</div>
      <FooterMenu />
    </React.Fragment>
  )
}

export default Dashboard