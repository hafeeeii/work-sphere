'use client'
import { Input } from '@/components/ui/input'
import React, { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { FIELD_METADATA } from '@/data/field-metadata'
import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Loader, PlusIcon } from 'lucide-react'
import { saveDesignation } from './action'
import { zodResolver } from '@hookform/resolvers/zod'
import { DesignationFormValues, designationSchema } from '@/lib/types'

const { designation } = FIELD_METADATA

const Form = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isLoading] = useActionState(saveDesignation, '')

  const defaultValues = {
    [designation.name]: ''
  }


  const {
    control,
    reset,
    formState: { isValid }
  } = useForm<DesignationFormValues>({
    defaultValues,
    resolver: zodResolver(designationSchema)
  })

  useEffect(() => {
    if (state === 'sucess') {
      reset()
      setIsOpen(false)
    }
  }, [state, reset])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <Button className='max-w-fit' onClick={() => setIsOpen(!isOpen)}>
            <PlusIcon />
            Create Designation
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Designation</DialogTitle>
        </DialogHeader>
        <form action={action} className='space-y-4'>
          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <RequiredLabel htmlFor='firstName'>{designation.label}</RequiredLabel>
              <Controller
                name={designation.name}
                control={control}
                render={({ field }) => <Input {...field} id={designation.name} placeholder={'Software Engineer'} />}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!isValid || isLoading} type='submit'>
              {isLoading && <Loader className='animate-spin' />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Form
