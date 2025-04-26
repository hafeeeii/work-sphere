'use client'
import { Input } from '@/components/ui/input'
import React, { useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { FIELD_METADATA } from '@/data/field-metadata'
import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Loader, PlusIcon } from 'lucide-react'
import { saveDepartment } from './action'
import { zodResolver } from '@hookform/resolvers/zod'
import { DepartmentFormValues, departmentSchema } from '@/lib/types'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const { department, departmentCode, departmentDescription } = FIELD_METADATA

const Form = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isLoading] = useActionState(saveDepartment, '')

  const defaultValues = {
    [department.name]: '',
    [departmentCode.name]: '',
    [departmentDescription.name]: ''
  }

  const {
    control,
    reset,
    formState: { isValid }
  } = useForm<DepartmentFormValues>({
    defaultValues,
    resolver: zodResolver(departmentSchema)
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
            Create Department
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
        </DialogHeader>
        <form action={action} className='space-y-6'>
          <div className='flex gap-4'>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor={department.name}>{department.label}</RequiredLabel>
              <Controller
                name={department.name}
                control={control}
                render={({ field }) => (
                  <Input {...field} id={department.name} placeholder={'Engineering'} />
                )}
              />
            </div>
            <div className='grid w-1/2 items-center gap-1.5'>
              <Label htmlFor={departmentCode.name}>{departmentCode.label}</Label>
              <Controller
                name={departmentCode.name}
                control={control}
                render={({ field }) => (
                  <Input {...field} value={field.value || ''} id={departmentCode.name} placeholder={departmentCode.placeholder} />
                )}
              />
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5 h-full'>
              <Label htmlFor={departmentDescription.name}>{departmentDescription.label}</Label>
              <Controller
                name={departmentDescription.name}
                control={control}
                render={({ field }) => (
                  <Textarea {...field} value={field.value || ''}   id={departmentDescription.name} placeholder={departmentDescription.placeholder} />
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
