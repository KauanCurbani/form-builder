import { GetFormById } from '@/actions/form'
import ClientForm from '@/components/ClientForm'
import React from 'react'

async function FormPage({params}: {params: {id:string}}) {
  const form = await GetFormById(Number(params.id))
  return (
    <ClientForm form={form}/>
  )
}

export default FormPage