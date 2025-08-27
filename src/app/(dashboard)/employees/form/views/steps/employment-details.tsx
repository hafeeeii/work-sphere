'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Autocomplete } from '@/components/ui/autocomplete'
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
import { Department, Designation, Employee, EmploymentType, Role, WorkLocation } from '@prisma/client'
import { format } from 'date-fns'
import { ArrowLeft, ArrowRight, CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMultistepForm } from '../../multistep-form-provider'
import { useBusinessUser } from '@/app/(dashboard)/business-user-provider'
import { checkPermission } from '@/lib/authz'

type EmploymentDetailsProps = {
  departments: Department[]
  designations: Designation[]
  workLocations: WorkLocation[]
  managers: Employee[]
}

export default function EmploymentDetails({
  departments,
  designations,
  workLocations,
  managers
}: EmploymentDetailsProps) {
  const { formData, updateFormData } = useMultistepForm()
  const { employmentType, dateOfJoining, designation, department, workLocation, reportingManagerId, workEmail, role } =
    formData

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(
      EmployeeSchema.pick({
        employmentType: true,
        dateOfJoining: true,
        designation: true,
        department: true,
        workLocation: true,
        reportingManagerId: true,
        workEmail: true,
        role: true
      })
    ),
    defaultValues: {
      employmentType: employmentType || EmploymentType.FULL_TIME,
      dateOfJoining,
      designation,
      department,
      workLocation,
      reportingManagerId,
      workEmail,
      role
    }
  })

  const {
    formState: { isValid }
  } = form

  const router = useRouter()
  function onSubmit(values: Partial<EmployeeFormValues>) {
    updateFormData(values)
    router.push('/employees/form/identification-and-bank-info')
  }

  const { businessUser } = useBusinessUser()

  let isAllowedToCreate = false
  if (businessUser && checkPermission(businessUser, 'create', 'employee')) {
    isAllowedToCreate = true
  }

  if (!isAllowedToCreate) {
    router.replace('/unauthorized')
  }

  return (
    <Card className='w-full'>
      <CardContent className='pt-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Row: Work Email & Date of Joining */}

            <div className='flex flex-col gap-4 lg:flex-row'>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='workEmail'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Work Email</RequiredLabel>
                      <FormControl>
                        <Input type='email' placeholder='email@example.com' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='dateOfJoining'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Date of Joining</RequiredLabel>
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
            </div>

            {/* Row: Designation & Department */}
            <div className='flex flex-col gap-4 lg:flex-row'>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='designation'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Designation</RequiredLabel>
                      <FormControl>
                        <Autocomplete {...field} list={designations} placeholder='Select Designation' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='department'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Department</RequiredLabel>
                      <FormControl>
                        <Autocomplete {...field} list={departments} placeholder='Select Department' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Row: Work Location & Reporting Manager */}
            <div className='flex flex-col gap-4 lg:flex-row'>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='workLocation'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Work Location</RequiredLabel>
                      <FormControl>
                        <Autocomplete {...field} list={workLocations} placeholder='Select Work Location' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='reportingManagerId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting Manager</FormLabel>
                      <FormControl>
                        <Autocomplete
                          {...field}
                          value={field.value ?? ''}
                          list={managers}
                          placeholder='Select Reporting Manager '
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className='flex flex-col gap-4 lg:flex-row'>
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='e.g. Full-Time' />
                          </SelectTrigger>
                          <SelectContent>
                            {[Role.EMPLOYEE, Role.MANAGER, Role.ADMIN, Role.HR].map(role => (
                              <SelectItem key={role} value={role}>
                                {role}
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
              <div className='lg:w-1/2'>
                <FormField
                  control={form.control}
                  name='employmentType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='e.g. Full-Time' />
                          </SelectTrigger>
                          <SelectContent>
                            {[EmploymentType.FULL_TIME, EmploymentType.PART_TIME, EmploymentType.CONTRACT].map(type => (
                              <SelectItem key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
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

            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                variant={'outline'}
                onClick={() => {
                  router.back()
                }}
              >
                <ArrowLeft />
                Back
              </Button>
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
