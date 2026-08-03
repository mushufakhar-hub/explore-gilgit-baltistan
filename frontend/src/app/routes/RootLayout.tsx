import React from 'react'
import { Outlet } from 'react-router-dom'
import Layout from '../shared/layout/Layout'

export default function RootLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
