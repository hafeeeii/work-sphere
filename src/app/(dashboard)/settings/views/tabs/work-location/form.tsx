'use client'
import { Input } from '@/components/ui/input'
import React, { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Loader, PlusIcon } from 'lucide-react'
import { saveWorkLocation } from './action'
import { zodResolver } from '@hookform/resolvers/zod'
import { WorkLocationFormValues, workLocationSchema } from '@/lib/types'
import { toast } from 'sonner'

const Form = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isLoading] = useActionState(saveWorkLocation, undefined)

  const defaultValues = {
    name: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    pincode: ''
  }

  const {
    control,
    reset,
    formState: { isValid }
  } = useForm<WorkLocationFormValues>({
    defaultValues,
    resolver: zodResolver(workLocationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    if (state?.status) {
      reset()
      toast.success(state.message)
      setIsOpen(false)
    }
  }, [state, reset])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={() => setIsOpen(true)}>
          <PlusIcon />
          Create Work Location
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Work Location</DialogTitle>
        </DialogHeader>
        <form action={action} className='space-y-6'>
          <div className='flex gap-4'>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor="name">Work Location Name</RequiredLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="name" placeholder="Head Office" />
                )}
              />
            </div>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor="state">State</RequiredLabel>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="state" placeholder="Maharashtra" value={field.value || ''} />
                )}
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor="city">City</RequiredLabel>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="city" placeholder="Mumbai" />
                )}
              />
            </div>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor="pincode">Pincode</RequiredLabel>
              <Controller
                name="pincode"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="pincode" placeholder="400001" value={field.value || ''} />
                )}
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <RequiredLabel htmlFor="addressLine1">Address Line 1</RequiredLabel>
              <Controller
                name="addressLine1"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="addressLine1" placeholder="Building A, 3rd Floor" />
                )}
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <RequiredLabel htmlFor="addressLine2">Address Line 2</RequiredLabel>
              <Controller
                name="addressLine2"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="addressLine2" placeholder="Opposite Tech Park" />
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button disabled={!isValid || isLoading} type="submit">
              {isLoading && <Loader className="animate-spin mr-2 h-4 w-4" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Form
