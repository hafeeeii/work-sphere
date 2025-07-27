'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import LoadingButton from '@/components/ui/buttons/loading-button'
import { Card, CardContent } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import RequiredLabel from '@/components/ui/required-label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmployeeFormValues, EmployeeSchema } from '@/lib/types'
import { BankAccountType, Employee } from '@prisma/client'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { startTransition, useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { updateEmployee } from '../../../views/action'
import { useBusinessUser } from '@/app/(dashboard)/business-user-provider'
import { checkPermission } from '@/lib/auth'

export default function IdentificationAndBankInfoEdit({ employee }: { employee: Employee }) {
  const [updateState, updateAction, isUpdatePending] = useActionState(updateEmployee, undefined)

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
        driverLicenseNumber: true
      })
    ),
    defaultValues: {
      bankName: employee.bankName,
      bankAccountHolderName: employee.bankAccountHolderName,
      bankAccountNumber: employee.bankAccountNumber,
      bankIfscCode: employee.bankIfscCode,
      bankBranch: employee.bankBranch,
      bankAccountType: employee.bankAccountType || BankAccountType.SAVINGS,
      aadhaarNumber: employee.aadhaarNumber || '',
      panNumber: employee.panNumber || '',
      driverLicenseNumber: employee.driverLicenseNumber || ''
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

    const {businessUser} = useBusinessUser()
  
    let isAllowedToEdit = false
    if (businessUser && checkPermission(businessUser, 'update', 'employee')) {
      isAllowedToEdit = true
    }

  return isAllowedToEdit && (
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
                        <Input {...field} className='input' type='number' placeholder='e.g. 1234 5678 9012' />
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

            <div className='flex justify-end gap-4'>
              <Button type='button' variant='outline' onClick={() => router.back()}>
                <X />
                Cancel
              </Button>
              <LoadingButton isLoading={isUpdatePending} type='submit' disabled={!isValid || isUpdatePending}>
                Update
              </LoadingButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
