'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import LoadingButton from '@/components/ui/buttons/loading-button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import RequiredLabel from '@/components/ui/required-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmployeeFormValues, EmployeeSchema } from '@/lib/types'
import { BankAccountType } from '@prisma/client'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { saveEmployee } from '../../../views/action'
import { useMultistepForm } from '../../multistep-form-provider'

export default function IdentificationAndBankInfo() {
  const { formData, clearFormData, updateFormData, } = useMultistepForm()
  const [saveState, saveAction, isSavePending] = useActionState(saveEmployee, undefined)
  const {
    bankName,
    bankAccountHolderName,
    bankAccountNumber,
    bankIfscCode,
    bankBranch,
    bankAccountType,
    aadhaarNumber,
    panNumber,
    driverLicenseNumber,
    inviteUser
  } = formData

  const form = useForm({
    mode: 'onChange',
    resolver: zodResolver(
      EmployeeSchema.pick({
        bankName: true,
        bankAccountHolderName: true,
        bankAccountNumber: true,
        bankIfscCode: true,
        bankBranch: true,
        bankAccountType: true,
        aadhaarNumber: true,
        panNumber: true,
        driverLicenseNumber: true,
        inviteUser: true
      })
    ),
    defaultValues: {
      bankName,
      bankAccountHolderName,
      bankAccountNumber,
      bankIfscCode,
      bankBranch,
      bankAccountType: bankAccountType || BankAccountType.SAVINGS,
      aadhaarNumber,
      panNumber,
      driverLicenseNumber,
      inviteUser
    }
  })

  const {
    formState: { isValid }
  } = form

  const router = useRouter()

  useEffect(() => {
    if (saveState?.status) {
      clearFormData()
      router.push('/employees')
    }

    if (saveState?.message) {
      if (saveState.status) {
        toast.success(saveState.message)
      } else {
        toast.error(saveState.message)
      }
    }
  }, [saveState])

  function onSubmit(values: Partial<EmployeeFormValues>) {
    const data = { ...formData, ...values }
    const payload = new FormData()
    Object.keys(data).forEach(key => {
      const value = data[key as keyof typeof data]
      if (value !== undefined) {
        payload.append(key, value.toString())
      }
    })
    updateFormData(values)
    startTransition(() => saveAction(payload))
  }
  return (
    <Card className='w-full'>
      <CardContent className='pt-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Row: Bank Name & Account Holder Name */}
            <div className='flex gap-4'>
              <div className='w-1/2'>
                <FormField
                  control={form.control}
                  name='bankName'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Bank Name</RequiredLabel>
                      <FormControl>
                        <Input {...field} className='input' placeholder='e.g. HDFC Bank' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-1/2'>
                <FormField
                  control={form.control}
                  name='bankAccountHolderName'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Account Holder Name</RequiredLabel>
                      <FormControl>
                        <Input {...field} className='input' placeholder='e.g. John Doe' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Row: Account Number & IFSC */}
            <div className='flex gap-4'>
              <div className='w-1/2'>
                <FormField
                  control={form.control}
                  name='bankAccountNumber'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Account Number</RequiredLabel>
                      <FormControl>
                        <Input {...field} className='input' placeholder='e.g. 1234567890' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-1/2'>
                <FormField
                  control={form.control}
                  name='bankIfscCode'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>IFSC Code</RequiredLabel>
                      <FormControl>
                        <Input {...field} className='input' placeholder='e.g. HDFC0001234' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Row: Bank Branch & Account Type */}
            <div className='flex gap-4'>
              <div className='w-1/2'>
                <FormField
                  control={form.control}
                  name='bankBranch'
                  render={({ field }) => (
                    <FormItem>
                      <RequiredLabel>Bank Branch</RequiredLabel>
                      <FormControl>
                        <Input {...field} className='input' placeholder='e.g. MG Road Branch' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-1/2'>
                <FormField
                  control={form.control}
                  name='bankAccountType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='h-10'>
                            <SelectValue placeholder='e.g. Savings' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={BankAccountType.SAVINGS}>Savings</SelectItem>
                            <SelectItem value={BankAccountType.CURRENT}>Current</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Row: Aadhaar, PAN, Driver License */}
            <div className='flex gap-4'>
              <div className='w-1/3'>
                <FormField
                  control={form.control}
                  name='aadhaarNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Number</FormLabel>
                      <FormControl>
                        <Input {...field} className='input' placeholder='e.g. 1234 5678 9012' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-1/3'>
                <FormField
                  control={form.control}
                  name='panNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAN Number</FormLabel>
                      <FormControl>
                        <Input {...field} className='input' placeholder='e.g. ABCDE1234F' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-1/3'>
                <FormField
                  control={form.control}
                  name='driverLicenseNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver License Number</FormLabel>
                      <FormControl>
                        <Input {...field} className='input' placeholder='e.g. MH12 20200012345' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='pt-4'>
              <FormField
              control={form.control}
              name='inviteUser'
              render={({field}) => (
                 <FormItem>
                   <div className='flex gap-3 items-center'>
                       <FormControl>
                        <Checkbox  onCheckedChange={field.onChange} checked={field.value} />
                      </FormControl>
                      <FormLabel> Send an invitation email to the employee once all details are submitted successfully.</FormLabel>
                   </div>
                      <FormMessage />
                    </FormItem>   
            )}
              />
            </div>

            {/* Navigation Buttons */}
            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  const values = form.getValues()
                  updateFormData(values)
                  router.back()
                }}
              >
                <ArrowLeft />
                Back
              </Button>
              <LoadingButton type='submit' disabled={!isValid || isSavePending} isLoading={isSavePending}>
                Save
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
