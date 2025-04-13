'use client'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import NextForm from 'next/form'
import { Label } from '@/components/ui/label'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { PlusIcon, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FIELD_METADATA } from '@/data/field-metadata'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Department, Designation, Employee, WorkLocation } from '@/generated/prisma'


const {
  dateOfBirth,
  firstName,
  lastName,
  gender,
  email,
  // employeeId,
  manager,
  designation,
  department,
  employeementType,
  dateOfJoining,
  workLocation
} = FIELD_METADATA

type Props = {
  departments: Department[]
  designations: Designation[]
  workLocations: WorkLocation[]
}

const Form = (props:Props) => {
  const { departments, designations, workLocations } = props
  const [isOpen, setIsOpen] = useState(false)


  const defaultValues = {
    [firstName.name]: '',
    [lastName.name]: '',
    [dateOfBirth.name]: new Date(),
    [gender.name]: 'male',
    [email.name]: '',
    // [employeeId.name]: 'EMP1',
    [manager.name]: '',
    [designation.name]: '',
    [department.name]: '',
    [employeementType.name]: 'permanent',
    [dateOfJoining.name]: new Date(),
    [workLocation.name]: ''
  }

  const {
    handleSubmit,
    control,
  } = useForm<Employee>({
    defaultValues
  })

  const onClose = () => setIsOpen(!isOpen)

  const onSubmit = (data: Employee) => {
    console.log(data, 'this is the data')
  }

  return (
    <Drawer open={isOpen} onClose={onClose} direction='right'>
      <div>
        <Button className='max-w-fit' onClick={() => setIsOpen(!isOpen)}>
          <PlusIcon />
          Create Employee
        </Button>
      </div>
      <DrawerContent>
        <div className='flex h-full w-full flex-col items-stretch px-8'>
          <DrawerHeader>
            <DrawerTitle>Create Employee</DrawerTitle>
          </DrawerHeader>

          <div className='h-full w-full overflow-y-auto px-2'>
            <NextForm action='' className='w-full space-y-6' onSubmit={handleSubmit(onSubmit)}>
              <div className='space-y-10'>
                {/* Personal Info */}
                <div className='space-y-4'>
                  <Label className='text-lg'>Personal Info</Label>
                  <div className='flex flex-col gap-4'>
                    <div className='flex gap-4'>
                      <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='firstName'>{firstName.label}</RequiredLabel>
                        <Controller
                          name={firstName.name}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} id='firstName' placeholder={firstName.placeholder} />
                          )}
                        />
                      </div>
                      <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='lastName'>{lastName.label}</RequiredLabel>
                        <Controller
                          name={lastName.name}
                          control={control}
                          render={({ field }) => <Input {...field} id='lastName' placeholder={lastName.placeholder} />}
                        />
                      </div>
                    </div>

                    <div className='flex gap-4'>
                      <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='dateOfBirth'>{dateOfBirth.label}</RequiredLabel>
                        <Controller
                          name={dateOfBirth.name}
                          control={control}
                          render={({ field }) => (
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
                                  {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className='w-auto p-0'>
                                <Calendar mode='single' selected={field.value as Date} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                      </div>

                      <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='gender'>{gender.label}</RequiredLabel>
                        <Controller
                          name={gender.name}
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className='h-10'>
                                <SelectValue placeholder={gender.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='male'>Male</SelectItem>
                                <SelectItem value='female'>Female</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>

                    <div className='flex gap-4'>
                      <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='email'>{email.label}</RequiredLabel>
                        <Controller
                          name={email.name}
                          control={control}
                          render={({ field }) => <Input {...field} id='email' placeholder={email.placeholder} />}
                        />
                      </div>
                      <div className='w-1/2'></div>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className='space-y-4'>
                  <Label className='text-lg'>Job Details</Label>
                  <div className='flex flex-col gap-4'>
                    <div className='flex gap-4'>
                      {/* <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='employeeId'>{employeeId.label}</RequiredLabel>
                        <Controller
                          name={employeeId.name}
                          control={control}
                          render={({ field }) => (
                            <Input {...field} id='employeeId' placeholder={employeeId.placeholder} />
                          )}
                        />
                      </div> */}
                    </div>

                    <div className='flex gap-4'>
                      <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='designation'>{designation.label}</RequiredLabel>
                        <Controller
                          name={designation.name}
                          control={control}
                          render={({ field }) => (
                            <Autocomplete {...field} list={designations} placeholder={designation.placeholder} />
                          )}
                        />
                      </div>
                      <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='department'>{department.label}</RequiredLabel>
                        <Controller
                          name={department.name}
                          control={control}
                          render={({ field }) => (
                            <Autocomplete {...field} list={departments} placeholder={department.placeholder} />
                          )}
                        />
                      </div>
                    </div>

                    <div className='flex gap-4'>
                      <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='employeementType'>{employeementType.label}</RequiredLabel>
                        <Controller
                          name={employeementType.name}
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className='h-10'>
                                <SelectValue placeholder={employeementType.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='permanent'>Permanent</SelectItem>
                                <SelectItem value='contract'>Contract</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='dateOfJoining'>{dateOfJoining.label}</RequiredLabel>
                        <Controller
                          name={dateOfJoining.name}
                          control={control}
                          render={({ field }) => (
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
                                  {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className='w-auto p-0'>
                                <Calendar mode='single' selected={field.value as Date} onSelect={field.onChange} initialFocus />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                      </div>
                    </div>

                    <div className='flex gap-4'>
                      <div className='grid w-1/2 items-center gap-1.5'>
                        <RequiredLabel htmlFor='workLocation'>{workLocation.label}</RequiredLabel>
                        <Controller
                          name={workLocation.name}
                          control={control}
                          render={({ field }) => (
                            <Autocomplete {...field} list={workLocations} placeholder={workLocation.placeholder} />
                          )}
                        />
                      </div>
                      <div className='w-1/2'></div>
                    </div>
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <div className='flex justify-between'>
                  <DrawerClose asChild>
                    <Button variant='outline' onClick={onClose}>
                      Cancel
                    </Button>
                  </DrawerClose>
                  <Button type='submit'>Create Employee</Button>
                </div>
              </DrawerFooter>
            </NextForm>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default Form
