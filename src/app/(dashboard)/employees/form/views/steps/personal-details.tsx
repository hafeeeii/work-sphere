'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import RequiredLabel from '@/components/ui/required-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmployeeFormValues, EmployeeSchema } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Gender, MaritalStatus } from '@prisma/client'
import { format } from 'date-fns'
import { ArrowRight, CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMultistepForm } from '../../multistep-form-provider'
import { useBusinessUser } from '@/app/(dashboard)/business-user-provider'
import { checkPermission } from '@/lib/auth'

export default function PersonalDetails() {
  const { formData, updateFormData } = useMultistepForm()
  const {
    id,
    name,
    email,
    phoneNumber,
    gender,
    dateOfBirth,
    maritalStatus,
    language,
    nationality,
    addressLine1,
    addressLine2
  } = formData

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
      id,
      name,
      email,
      phoneNumber,
      gender: gender || Gender.MALE,
      dateOfBirth,
      maritalStatus: maritalStatus || MaritalStatus.SINGLE,
      language: language || 'ENGLISH, HINDI',
      nationality: nationality || 'INDIA',
      addressLine1,
      addressLine2
    }
  })

  const {
    formState: { isValid }
  } = form

  const router = useRouter()
  function onSubmit(values: Partial<EmployeeFormValues>) {
    updateFormData(values)
    router.push('/employees/form/employment-details')
  }

  const { businessUser } = useBusinessUser()

  let isAllowedToCreate = false
  if (businessUser && checkPermission(businessUser, 'create', 'employee')) {
    isAllowedToCreate = true
  }

  if (!isAllowedToCreate) {
    router.replace('/unauthorized')
    return null
  }

  return (
    <Card className='w-full'>
      <CardContent className='pt-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Row: Name & Email */}
            <div className='flex gap-4'>
              <div className='grid w-1/2'>
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
              <div className='grid w-1/2'>
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
            <div className='flex gap-4'>
              <div className='grid w-1/2'>
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
              <div className='grid w-1/2'>
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
            <div className='flex gap-4'>
              <div className='grid w-1/2'>
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
              <div className='grid w-1/2'>
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
            <div className='flex gap-4'>
              <div className='grid w-1/2'>
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
              <div className='grid w-1/2'>
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
            <div className='flex gap-4'>
              <div className='grid w-1/2'>
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
              <div className='grid w-1/2'>
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
              <Button type='submit' disabled={!isValid}>
                Next
                <ArrowRight />
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
