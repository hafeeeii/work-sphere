// 'use client'

// import { Button } from '@/components/ui/button'
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
// import { Input } from '@/components/ui/input'
// import { startTransition, useActionState, useEffect, useState } from 'react'

// import { Label } from '@/components/ui/label'
// import RequiredLabel from '@/components/ui/required-label'
// import { Textarea } from '@/components/ui/textarea'
// import { DepartmentFormValues, departmentSchema } from '@/lib/types'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { Department } from '@prisma/client'
// import { Loader, PlusIcon } from 'lucide-react'
// import { Controller, useForm } from 'react-hook-form'
// import { toast } from 'sonner'
// import { saveDepartment, updateDepartment } from './action'
// import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
// import { cn } from '@/lib/utils'
// import { Calendar } from '@/components/ui/calendar'
// import { DateRange } from 'react-day-picker'

// type FormProps = {
//   department?: Department | null
//   showForm: boolean
//   toggleForm: () => void
// }

// const LeaveApplyForm = ({ department, showForm, toggleForm }: FormProps) => {
//   const [saveState, saveAction, isSavePending] = useActionState(saveDepartment, undefined)
//   const [updateState, updateAction, isUpdatePending] = useActionState(updateDepartment, undefined)

//   const state = saveState || updateState
//   const isPending = isSavePending || isUpdatePending

//   const defaultValues = {
//     id: department?.id || '',
//     name: department?.name || '',
//     code: department?.code || '',
//     description: department?.description || ''
//   }

//   const {
//     control,
//     reset,
//     formState: { isValid },
//     handleSubmit
//   } = useForm<DepartmentFormValues>({
//     defaultValues,
//     resolver: zodResolver(departmentSchema),
//     mode: 'onChange'
//   })

//   const onClose = () => {
//     toggleForm()
//     reset()
//   }

//   useEffect(() => {
//     if (state?.status) {
//       onClose()
//     }

//     if (state?.message) {
//       if (state.status) {
//         toast.success(state.message)
//       } else {
//         toast.error(state.message)
//       }
//     }
//   }, [updateState, saveState])

//   useEffect(() => {
//     if (showForm) reset(defaultValues)
//   }, [showForm])

//   const onSubmit = (data: DepartmentFormValues) => {
//     const formData = new FormData()

//     Object.keys(data).forEach(key => {
//       formData.append(key, data[key as keyof typeof data].toString())
//     })

//     if (department?.id) {
//       startTransition(() => updateAction(formData))
//     } else {
//       startTransition(() => saveAction(formData))
//     }
//   }

//     const currentYear = new Date().getFullYear()
//     const [dateRange, setDateRange] = useState<DateRange | undefined>({
//       from: new Date(currentYear, 0, 1),
//       to: new Date(currentYear, 11, 31)
//     })

//   return (
//     <Dialog open={showForm} onOpenChange={toggleForm}>
//       <DialogTrigger asChild>
//         <Button className='max-w-fit' onClick={toggleForm}>
//           <PlusIcon />
//           Create Department
//         </Button>
//       </DialogTrigger>
//       <DialogContent className='sm:min-w-[600px]'>
//         <DialogHeader>
//           <DialogTitle>Create Department</DialogTitle>
//         </DialogHeader>
//         <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
//           <div className='flex gap-4'>
//             <div className='grid w-1/2 items-center gap-1.5'>
//               <RequiredLabel htmlFor='name'>Leave Type</RequiredLabel>
//               <Controller
//                 name='name'
//                 control={control}
//                 render={({ field }) => <Input {...field} id='name' placeholder='Engineering' />}
//               />
//             </div>
//             <div className='grid w-1/2 items-center gap-1.5'>
//                <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant='outline'
//           className={cn('h-10 w-full justify-start text-left font-normal', !dateRange && 'text-muted-foreground')}
//         >
//           <CalendarIcon className='mr-2 h-4 w-4' />
//           {dateRange?.from ? (
//             dateRange.to ? (
//               <>
//                 {format(dateRange.from, 'PPP')} - {format(dateRange.to, 'PPP')}
//               </>
//             ) : (
//               format(dateRange.from, 'PPP')
//             )
//           ) : (
//             <span>Pick a date</span>
//           )}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className='w-full p-0'>
//         <Calendar
//           mode='range'
//           defaultMonth={dateRange?.from}
//           selected={dateRange}
//           onSelect={setDateRange}
//           numberOfMonths={2}
//           className='rounded-lg border shadow-sm'
//         />
//       </PopoverContent>
//     </Popover>
//           </div>
//           </div>
   
//           <DialogFooter>
//             <Button disabled={!isValid || isPending} type='submit'>
//               {isPending && <Loader className='mr-2 h-4 w-4 animate-spin' />}
//               Save
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default LeaveApplyForm
