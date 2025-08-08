'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { startTransition, useActionState, useEffect } from 'react'

import LoadingButton from '@/components/ui/buttons/loading-button'
import RequiredLabel from '@/components/ui/required-label'
import { WorkLocationFormValues, workLocationSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { WorkLocation } from '@prisma/client'
import { PlusIcon, Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { saveWorkLocation, updateWorkLocation } from './action'
import { Label } from '@/components/ui/label'

type FormProps = {
  workLocation?: WorkLocation | null
  showForm: boolean
  toggleForm: () => void
}

const Form = ({ workLocation, showForm, toggleForm }: FormProps) => {
  const [saveState, saveAction, isSavePending] = useActionState(saveWorkLocation, undefined)
  const [updateState, updateAction, isUpdatePending] = useActionState(updateWorkLocation, undefined)

  const state = saveState || updateState
  const isPending = isSavePending || isUpdatePending

  const defaultValues = {
    id: workLocation?.id || '',
    name: workLocation?.name || '',
    addressLine1: workLocation?.addressLine1 || '',
    addressLine2: workLocation?.addressLine2 || '',
    state: workLocation?.state || '',
    city: workLocation?.city || '',
    pincode: workLocation?.pincode || ''
  }

  const {
    control,
    reset,
    formState: { isValid },
    handleSubmit
  } = useForm<WorkLocationFormValues>({
    defaultValues,
    resolver: zodResolver(workLocationSchema),
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
  }, [updateState, saveState])

  useEffect(() => {
    if (showForm) reset(defaultValues)
  }, [showForm])

  const onSubmit = (data: WorkLocationFormValues) => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof typeof data].toString())
    })

    if (workLocation?.id) {
      startTransition(() => updateAction(formData))
    } else {
      startTransition(() => saveAction(formData))
    }
  }

  return (
    <Dialog open={showForm} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={onClose}>
          <PlusIcon />
          Create Work Location
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Work Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='flex gap-4'>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor='name'>Work Location Name</RequiredLabel>
              <Controller
                name='name'
                control={control}
                render={({ field }) => <Input {...field} id='name' placeholder='Head Office' />}
              />
            </div>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor='state'>State</RequiredLabel>
              <Controller
                name='state'
                control={control}
                render={({ field }) => (
                  <Input {...field} id='state' placeholder='Maharashtra' value={field.value || ''} />
                )}
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor='city'>City</RequiredLabel>
              <Controller
                name='city'
                control={control}
                render={({ field }) => <Input {...field} id='city' placeholder='Mumbai' />}
              />
            </div>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor='pincode'>Pincode</RequiredLabel>
              <Controller
                name='pincode'
                control={control}
                render={({ field }) => <Input {...field} type='number' id='pincode' placeholder='400001' value={field.value || ''} />}
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <RequiredLabel htmlFor='addressLine1'>Address Line 1</RequiredLabel>
              <Controller
                name='addressLine1'
                control={control}
                render={({ field }) => <Input {...field} id='addressLine1' placeholder='Building A, 3rd Floor' />}
              />
            </div>
          </div>

          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <Label htmlFor='addressLine2'>Address Line 2</Label>
              <Controller
                name='addressLine2'
                control={control}
                render={({ field }) => <Input {...field} id='addressLine2' placeholder='Opposite Tech Park' />}
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

export default Form
