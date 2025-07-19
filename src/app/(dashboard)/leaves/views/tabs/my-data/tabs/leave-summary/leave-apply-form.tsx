'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { startTransition, useActionState, useEffect, useState } from 'react'

import { Autocomplete } from '@/components/ui/autocomplete'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import RequiredLabel from '@/components/ui/required-label'
import { Textarea } from '@/components/ui/textarea'
import { LeaveFormValues, LeaveSchema } from '@/lib/types'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { LeaveType } from '@prisma/client'
import { format } from 'date-fns'
import { Loader, PlusIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { applyLeave } from './actions'

type FormProps = {
  leaveTypes: LeaveType[],
  leaveTypeId?: string
}

const LeaveApplyForm = ({ leaveTypes, leaveTypeId }: FormProps) => {
  const [applyState, applyAction, isApplyPending] = useActionState(applyLeave, undefined)
  const [showForm, setShowForm] = useState(false)

  const state = applyState
  const isPending = isApplyPending

  const defaultValues = {
    id: '',
    leaveTypeId:leaveTypeId || '',
    from: '',
    to: '',
    reason: ''
  }

  const {
    control,
    reset,
    formState: { isValid },
    watch,
    handleSubmit
  } = useForm<LeaveFormValues>({
    defaultValues,
    resolver: zodResolver(LeaveSchema),
    mode: 'onChange'
  })

  const toggleForm = () => {
    setShowForm(!showForm)
  }

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
  }, [applyState])

  useEffect(() => {
    if (showForm) reset(defaultValues)
  }, [showForm])

  const from = watch('from')
  const to = watch('to')

  const onSubmit = (data: LeaveFormValues) => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof typeof data].toString())
    })

    startTransition(() => applyAction(formData))
  }

  return (
    <Dialog open={showForm} onOpenChange={toggleForm}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={toggleForm}>
          <PlusIcon />
          Apply Leave
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Apply Leave</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid gap-1.5'>
            <RequiredLabel htmlFor='leaveTypeId'>Leave Type</RequiredLabel>
            <Controller
              name='leaveTypeId'
              control={control}
              render={({ field }) => <Autocomplete {...field} list={leaveTypes} placeholder='Select Leave Type' />}
            />
          </div>

          <div className='flex gap-4'>
            <div className='grid w-1/2 gap-1.5'>
              <RequiredLabel htmlFor='from'>From</RequiredLabel>
              <Controller
                name='from'
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'h-10 w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={selected => {
                          if (selected) {
                            const formatted = format(selected, 'yyyy-MM-dd')
                            field.onChange(formatted)
                            const fromMs = selected.getTime()
                            const toMs = new Date(to).getTime()

                            if (toMs < fromMs) {
                              field.onChange(to)
                            }
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className='grid w-1/2 gap-1.5'>
              <RequiredLabel htmlFor='to'>To</RequiredLabel>
              <Controller
                name='to'
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'h-10 w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={selected => {
                          if (selected) {
                            const formatted = format(selected, 'yyyy-MM-dd')
                            field.onChange(formatted)
                          }
                        }}
                        {...(from && {
                          disabled: {
                            before: new Date(from)
                          }
                        })}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>
          </div>

          <div className='grid gap-1.5'>
            <Label htmlFor='reason'>Reason</Label>
            <Controller
              name='reason'
              control={control}
              render={({ field }) => <Textarea {...field} placeholder='Reason' className='resize-none' />}
            />
          </div>
          <DialogFooter>
            <Button disabled={!isValid || isPending} type='submit'>
              {isPending && <Loader className='mr-2 h-4 w-4 animate-spin' />}
              Apply
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LeaveApplyForm
