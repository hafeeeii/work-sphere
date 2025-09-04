'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { startTransition, useActionState, useEffect, useState } from 'react'

import LoadingButton from '@/components/ui/buttons/loading-button'
import RequiredLabel from '@/components/ui/required-label'
import { useUser } from '@/components/context/user-context'
import { BusinessFormValues, BusinessSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createBusiness } from './action'

const AddBusiness = () => {
  const [saveState, saveAction, isSavePending] = useActionState(createBusiness, undefined)
  const [showForm, setShowForm] = useState(false)

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  const state = saveState
  const isPending = isSavePending
  const { user } = useUser()

  const defaultValues: BusinessFormValues = {
    name: '',
    ownerId: user?.userId || '',
    subdomain: ''
  }

  const {
    control,
    reset,
    formState: { isValid },
    handleSubmit
  } = useForm<BusinessFormValues>({
    defaultValues,
    resolver: zodResolver(BusinessSchema),
    mode: 'onChange'
  })

  const onClose = () => {
    toggleForm()
    reset()
  }

  useEffect(() => {
    if (state?.status) {
      onClose()
    }

    if (state?.message) {
      if (state.status) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [saveState])

  useEffect(() => {
    if (showForm) reset(defaultValues)
  }, [showForm])

  const onSubmit = (data: BusinessFormValues) => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof typeof data].toString())
    })

    startTransition(() => saveAction(formData))
  }

  return (
    <Dialog open={showForm} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={toggleForm}>
          <PlusIcon />
          Create Business
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Business</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-col gap-4'>
            <div className='grid items-center gap-1.5'>
              <RequiredLabel htmlFor='name'>Business Name</RequiredLabel>
              <Controller
                name='name'
                control={control}
                render={({ field }) => <Input {...field} id='name' placeholder='Horizontal Pvt Ltd' />}
              />
            </div>
            <div className='grid items-center gap-1.5'>
              <RequiredLabel htmlFor='subdomain'>Subdomain</RequiredLabel>
              <Controller
                name='subdomain'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    onChange={e => field.onChange(e.target.value.toLowerCase())}
                    id='subdomain'
                    placeholder='horizontal'
                  />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <LoadingButton type='submit' isValid={isValid} isLoading={isPending} icon={<Save />}>
              Save
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddBusiness
