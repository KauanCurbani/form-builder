import React from 'react'
import SidebarBtnElement from './SidebarBtnElement'
import { FormElements } from './FormElements'

function FormElementSidebar() {
  return (
    <div className="flex flex-col p-2">
      <div className="flex justify-between items-center">
            <p className="text-sm text-foreground/70">Elementos</p>

        </div>
    <SidebarBtnElement formElement={FormElements.TextField} />
    <SidebarBtnElement formElement={FormElements.Button} /></div>
  )
}

export default FormElementSidebar