import { GetForms, GetPublishedForms } from '@/actions/form'
import ClientSidebar from '@/components/ClientSidebar'
import React, { ReactNode } from 'react'

async function Layout({children}: {children: ReactNode}) {
  const forms = await GetPublishedForms()
  return (
    <div className='flex'>
      <div className='border-r-2 flex flex-col gap-4 border-muted w-[350px] min-w-[350px] h-screen'>
        <ClientSidebar forms={forms}/>
      </div>
      {children}
      </div>
  )
}

export default Layout