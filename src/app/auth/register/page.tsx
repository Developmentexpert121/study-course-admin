import AuthForm from '@/components/Auth/AuthForm'
import { LoaderProvider } from '@/contexts/LoaderContext'
import React from 'react'

export default function page() {
  return (

    <LoaderProvider>
      <AuthForm type="register" />
    </LoaderProvider>

  )
}
