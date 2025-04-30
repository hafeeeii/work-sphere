'use client'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Department, Designation, Employee, WorkLocation } from '@/generated/prisma'
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer'

type Props = {
  departments: Department[]
  designations: Designation[]
  workLocations: WorkLocation[]
}

const Form = ({ departments, designations, workLocations }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const defaultValues: Partial<Employee> = {
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    gender: 'male',
    email: '',
    designation: '',
    department: '',
    employeementType: 'permanent',
    dateOfJoining: new Date(),
    workLocation: '',
  }

  const { handleSubmit, control } = useForm<Employee>({
    defaultValues
  })

  const onClose = () => setIsOpen(false)

  const onSubmit = (data: Employee) => {
    console.log(data, 'this is the data')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={() => setIsOpen(true)}>
          <PlusIcon className='mr-2' />
          Create Employee
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[50%]'>
        <DialogHeader>
          <DialogTitle>Create Employee</DialogTitle>
        </DialogHeader>
        <div className='h-full w-full overflow-y-auto px-6'>
          <form className='w-full space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-4'>

              {/* Personal Info */}
              <Label className='text-lg'>Personal Info</Label>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-4'>
                  <div className='grid w-1/2 gap-1.5'>
                    <RequiredLabel htmlFor='firstName'>First Name</RequiredLabel>
                    <Controller
                      name='firstName'
                      control={control}
                      render={({ field }) => <Input {...field} id='firstName' placeholder='John' />}
                    />
                  </div>
                  <div className='grid w-1/2 gap-1.5'>
                    <RequiredLabel htmlFor='lastName'>Last Name</RequiredLabel>
                    <Controller
                      name='lastName'
                      control={control}
                      render={({ field }) => <Input {...field} id='lastName' placeholder='Doe' />}
                    />
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='grid w-1/2 gap-1.5'>
                    <RequiredLabel htmlFor='dateOfBirth'>Date of Birth</RequiredLabel>
                    <Controller
                      name='dateOfBirth'
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className={cn('h-10 w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                            >
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0'>
                            <Calendar
                              mode='single'
                              selected={field.value as Date}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>

                  <div className='grid w-1/2 gap-1.5'>
                    <RequiredLabel htmlFor='gender'>Gender</RequiredLabel>
                    <Controller
                      name='gender'
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='Select gender' />
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
                  <div className='grid w-1/2 gap-1.5'>
                    <RequiredLabel htmlFor='email'>Email</RequiredLabel>
                    <Controller
                      name='email'
                      control={control}
                      render={({ field }) => <Input {...field} id='email' placeholder='john@example.com' />}
                    />
                  </div>
                  <div className='w-1/2'></div>
                </div>
              </div>

              {/* Job Details */}
              <Label className='text-lg'>Job Details</Label>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-4'>
                  <div className='grid w-1/2 gap-1.5'>
                    <RequiredLabel htmlFor='designation'>Designation</RequiredLabel>
                    <Controller
                      name='designation'
                      control={control}
                      render={({ field }) => (
                        <Autocomplete {...field} list={designations} placeholder='Select designation' />
                      )}
                    />
                  </div>
                  <div className='grid w-1/2 gap-1.5'>
                    <RequiredLabel htmlFor='department'>Department</RequiredLabel>
                    <Controller
                      name='department'
                      control={control}
                      render={({ field }) => (
                        <Autocomplete {...field} list={departments} placeholder='Select department' />
                      )}
                    />
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='grid w-1/2 gap-1.5'>
                    <RequiredLabel htmlFor='employeementType'>Employment Type</RequiredLabel>
                    <Controller
                      name='employeementType'
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='Select type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='permanent'>Permanent</SelectItem>
                            <SelectItem value='contract'>Contract</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className='grid w-1/2 gap-1.5'>
                    <RequiredLabel htmlFor='dateOfJoining'>Date of Joining</RequiredLabel>
                    <Controller
                      name='dateOfJoining'
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant='outline'
                              className={cn('h-10 w-full justify-start text-left font-normal', !field.value && 'text-muted-foreground')}
                            >
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0'>
                            <Calendar
                              mode='single'
                              selected={field.value as Date}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </div>

                <div className='flex gap-4'>
                  <div className='grid w-1/2 gap-1.5'>
                    <RequiredLabel htmlFor='workLocation'>Work Location</RequiredLabel>
                    <Controller
                      name='workLocation'
                      control={control}
                      render={({ field }) => (
                        <Autocomplete {...field} list={workLocations} placeholder='Select work location' />
                      )}
                    />
                  </div>
                  <div className='w-1/2'></div>
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
                <Button type='submit'>Save</Button>
              </div>
            </DrawerFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Form
