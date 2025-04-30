'use client'
import { Input } from '@/components/ui/input'
import React, { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Loader, PlusIcon } from 'lucide-react'
import { saveDesignation } from './action'
import { zodResolver } from '@hookform/resolvers/zod'
import { DesignationFormValues, designationSchema } from '@/lib/types'
import { toast } from 'sonner'

const Form = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isLoading] = useActionState(saveDesignation, undefined)

  const defaultValues = {
    name: ''
  }

  const {
    control,
    reset,
    formState: { isValid }
  } = useForm<DesignationFormValues>({
    defaultValues,
    resolver: zodResolver(designationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    if (state?.status) {
      reset()
      setIsOpen(false)
      toast.success(state.message)
    }
  }, [state, reset])
console.log(state,'this is staae')
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={() => setIsOpen(true)}>
          <PlusIcon />
          Create Designation
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Designation</DialogTitle>
        </DialogHeader>
        <form action={action} className='space-y-4'>
          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <RequiredLabel htmlFor="name">Designation Name</RequiredLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="name" placeholder="Software Engineer" />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!isValid || isLoading} type='submit'>
              {isLoading && <Loader className='animate-spin mr-2 h-4 w-4' />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Form
