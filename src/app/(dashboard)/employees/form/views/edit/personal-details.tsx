'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useBusinessUser } from '@/app/(dashboard)/business-user-provider'
import { Button } from '@/components/ui/button'
import LoadingButton from '@/components/ui/buttons/loading-button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import RequiredLabel from '@/components/ui/required-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { checkPermission } from '@/lib/authz'
import { getFormattedDate } from '@/lib/date'
import { EmployeeFormValues, EmployeeSchema } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Employee, Gender, MaritalStatus } from '@prisma/client'
import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { updateEmployee } from '../../../views/action'

export default function PersonalDetailsEdit({ employee }: { employee: Employee }) {
  const [updateState, updateAction, isUpdatePending] = useActionState(updateEmployee, undefined)

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(
      EmployeeSchema.pick({
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        gender: true,
        dateOfBirth: true,
        maritalStatus: true,
        language: true,
        nationality: true,
        addressLine1: true,
        addressLine2: true
      })
    ),
    defaultValues: {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      gender: employee.gender,
      dateOfBirth: getFormattedDate(employee.dateOfBirth),
      maritalStatus: employee.maritalStatus,
      language: employee.language || 'English',
      nationality: employee.nationality || 'INDIA',
      addressLine1: employee.addressLine1 || '',
      addressLine2: employee.addressLine2 || ''
    }
  })

  const {
    formState: { isValid }
  } = form

  const router = useRouter()

  useEffect(() => {
    if (updateState?.status) {
      router.push(`/employees/${employee.id}`)
    }

    if (updateState?.message) {
      if (updateState.status) {
        toast.success(updateState.message)
      } else {
        toast.error(updateState.message)
      }
    }
  }, [updateState])

  function onSubmit(values: Partial<EmployeeFormValues>) {
    const data = { ...employee, ...values }
    const payload = new FormData()
    Object.keys(data).forEach(key => {
      const value = data[key as keyof typeof data]
      if (value !== undefined && value !== null) {
        payload.append(key, value.toString())
      }
    })
    startTransition(() => updateAction(payload))
  }

  const { businessUser } = useBusinessUser()

  let isAllowedToEdit = false
  if (businessUser && checkPermission(businessUser, 'update', 'employee')) {
    isAllowedToEdit = true
  }

  if (!isAllowedToEdit) {
    router.replace('/unauthorized')
    return null
  }

  return (
    <Card className='w-full'>
      <CardContent className='pt-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Row: Name & Email */}
            <div className='flex flex-col gap-4 lg:flex-row'>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Name</RequiredLabel>
                      <FormControl>
                        <Input placeholder='Enter full name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Email</RequiredLabel>
                      <FormControl>
                        <Input type='email' placeholder='email@example.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Row: Phone Number & Gender */}
            <div className='flex flex-col gap-4 lg:flex-row'>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Phone Number</RequiredLabel>
                      <FormControl>
                        <Input type='number' placeholder='9876543210' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='Gender' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Gender.MALE}>Male</SelectItem>
                            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Row: Date of Birth & Marital Status */}
            <div className='flex flex-col gap-4 lg:flex-row'>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='dateOfBirth'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Date of Birth</RequiredLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className={cn(
                                'h-10 w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-full p-0'>
                            <Calendar
                              captionLayout='dropdown'
                              mode='single'
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={selected => {
                                if (selected) {
                                  const formatted = format(selected, 'yyyy-MM-dd')
                                  field.onChange(formatted)
                                }
                              }}
                              className='rounded-lg'
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='maritalStatus'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marital Status</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='Marital Status' />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              MaritalStatus.SINGLE,
                              MaritalStatus.MARRIED,
                              MaritalStatus.DIVORCED,
                              MaritalStatus.WIDOWED
                            ].map(status => (
                              <SelectItem key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Row: Language & Nationality */}
            <div className='flex flex-col gap-4 lg:flex-row'>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='language'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages Known</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. English, Hindi' {...field} value={'ENGLISH, HINDI'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='nationality'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. Indian' {...field} value={'INDIA'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Row: Address Line 1 & Address Line 2 */}
            <div className='flex flex-col gap-4 lg:flex-row'>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='addressLine1'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder='Street, Building, Area' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='addressLine2'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input placeholder='City, State, ZIP' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='flex justify-end gap-4'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                <X />
                Cancel
              </Button>
              <LoadingButton isLoading={isUpdatePending} type='submit' isValid={isValid}>
                Update
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
