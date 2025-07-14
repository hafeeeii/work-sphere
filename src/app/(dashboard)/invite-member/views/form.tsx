'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import RequiredLabel from '@/components/ui/required-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import LoadingButton from '@/components/ui/buttons/loading-button'
import { InviteFormValues, InviteSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Invite, Role } from '@prisma/client'
import { PlusIcon } from 'lucide-react'
import { startTransition, useActionState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { createInvite, updateInvite } from './action'

type Props = {
  showForm: boolean
  invite: Invite | null
  toggleForm: () => void
}

const Form = ({ showForm, invite, toggleForm }: Props) => {
  const [createState, createAction, isSavePending] = useActionState(createInvite, undefined)
  const [updateState, updateAction, isUpdatePending] = useActionState(updateInvite, undefined)

  const state = createState || updateState
  const isPending = isSavePending || isUpdatePending

  const defaultValues: Partial<InviteFormValues> = {
    name: invite?.name ?? '',
    id: invite?.id ?? '',
    email: invite?.email ?? '',
    role: invite?.role ?? Role.MEMBER
  } as const

  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid }
  } = useForm<InviteFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(InviteSchema)
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
  }, [updateState, createState])

  useEffect(() => {
    if (showForm) 
    reset(defaultValues)
  }, [showForm])

  const onSubmit = (data: InviteFormValues) => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof typeof data].toString())
    })

    if (invite?.id) {
      startTransition(() => updateAction(formData))
    } else {
      startTransition(() => createAction(formData))
    }
  }

  return (
    <Dialog open={showForm} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={onClose}>
          <PlusIcon  />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-6'>
          <div className='space-y-4'>

            
              <div className='flex gap-4'>
                <div className='grid w-full gap-1.5'>
                  <RequiredLabel htmlFor='email'>Name</RequiredLabel>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => <Input {...field} id='name' placeholder='John Doe' />}
                  />
                </div>
              </div>
              <div className='flex gap-4'>
                <div className='grid w-full gap-1.5'>
                  <RequiredLabel htmlFor='email'>Email</RequiredLabel>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field }) => <Input {...field} id='email' placeholder='john@example.com' />}
                  />
                </div>
              </div>
               <div className='grid w-full gap-1.5'>
                  <RequiredLabel htmlFor='gender'>Role</RequiredLabel>
                  <Controller
                    name='role'
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder='Select gender' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Role.MEMBER}>Member</SelectItem>
                          <SelectItem value={Role.MANAGER}>Manager</SelectItem>
                          <SelectItem value={Role.OWNER}>Owner</SelectItem>

                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

          </div>
          <DrawerFooter>
            <div className='flex justify-between'>
              <DrawerClose asChild>
                <Button variant='outline' onClick={onClose}>
                  Cancel
                </Button>
              </DrawerClose>
              <LoadingButton isLoading={isPending} isValid={isValid} type='submit'>
                {invite?.id ? 'Update' : 'Invite' }
              </LoadingButton>
            </div>
          </DrawerFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Form
