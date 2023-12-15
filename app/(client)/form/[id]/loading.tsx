import { Loader2Icon } from 'lucide-react'
import React from 'react'

function Loading() {
  return (
    <div className='flex w-full h-screen justify-center items-center'> <Loader2Icon  className='animate-spin'/></div>
  )
}

export default Loading