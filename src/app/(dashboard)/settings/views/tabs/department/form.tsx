'use client'

import { Input } from '@/components/ui/input'
import React, { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Loader, PlusIcon } from 'lucide-react'
import { saveDepartment } from './action'
import { zodResolver } from '@hookform/resolvers/zod'
import { DepartmentFormValues, departmentSchema } from '@/lib/types'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const Form = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isLoading] = useActionState(saveDepartment, undefined)

  const defaultValues = {
    name: '',
    code: '',
    description: '',
  }

  const {
    control,
    reset,
    formState: { isValid }
  } = useForm<DepartmentFormValues>({
    defaultValues,
    resolver: zodResolver(departmentSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (state?.status) {
      reset()
      setIsOpen(false)
      toast.success(state.message)
    }
  }, [state, reset])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={() => setIsOpen(true)}>
          <PlusIcon />
          Create Department
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
        </DialogHeader>
        <form action={action} className='space-y-6'>
          <div className='flex gap-4'>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor="name">Department Name</RequiredLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="name" placeholder="Engineering" />
                )}
              />
            </div>
            <div className='grid w-1/2 items-center gap-1.5'>
              <Label htmlFor="code">Department Code</Label>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="code" placeholder="ENG001" />
                )}
              />
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5 h-full'>
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea {...field} id="description" placeholder="Brief description about this department" />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!isValid || isLoading} type='submit'>
              {isLoading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Form
