'use client'
import { Input } from '@/components/ui/input'
import React, { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { FIELD_METADATA } from '@/data/field-metadata'
import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Loader, PlusIcon } from 'lucide-react'
import { saveWorkLocation } from './action'
import { zodResolver } from '@hookform/resolvers/zod'
import { WorkLocationFormValues, workLocationSchema } from '@/lib/types'

const { addressLine1, addressLine2, state: workLocationState, workLocation, city, pincode } = FIELD_METADATA

const Form = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isLoading] = useActionState(saveWorkLocation, '')

  const defaultValues = {
    [workLocation.name]: '',
    [addressLine1.name]: '',
    [addressLine2.name]: '',
    [workLocationState.name]: '',
    [city.name]: '',
    [pincode.name]: ''
  }

  const {
    control,
    reset,
    formState: { isValid }
  } = useForm<WorkLocationFormValues>({
    defaultValues,
    resolver: zodResolver(workLocationSchema)
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
            Create Work Location
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Work Location</DialogTitle>
        </DialogHeader>
        <form action={action} className='space-y-6'>
          <div className='flex gap-4'>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor={workLocation.name}>{workLocation.label}</RequiredLabel>
              <Controller
                name={workLocation.name}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={workLocation.name} placeholder={workLocation.placeholder} />
                )}
              />
            </div>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor={workLocationState.name}>{workLocationState.label}</RequiredLabel>
              <Controller
                name={workLocationState.name}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    id={workLocationState.name}
                    placeholder={workLocationState.placeholder}
                  />
                )}
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor={city.name}>{city.label}</RequiredLabel>
              <Controller
                name={city.name}
                control={control}
                render={({ field }) => <Input {...field} id={city.name} placeholder={city.placeholder} />}
              />
            </div>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor={pincode.name}>{pincode.label}</RequiredLabel>
              <Controller
                name={pincode.name}
                control={control}
                render={({ field }) => (
                  <Input {...field} value={field.value || ''} id={pincode.name} placeholder={pincode.placeholder} />
                )}
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <RequiredLabel htmlFor={addressLine1.name}>{addressLine1.label}</RequiredLabel>
              <Controller
                name={addressLine1.name}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={addressLine1.name} placeholder={addressLine1.placeholder} />
                )}
              />
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <RequiredLabel htmlFor={addressLine2.name}>{addressLine2.label}</RequiredLabel>
              <Controller
                name={addressLine2.name}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={addressLine2.name} placeholder={addressLine2.placeholder} />
                )}
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
