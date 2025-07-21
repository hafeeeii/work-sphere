'use client'
import { EmployeeFormValues } from '@/lib/types'
import { BankAccountType, EmploymentType, Gender, MaritalStatus } from '@prisma/client'
import { createContext, useContext, useState } from 'react'

interface MultistepFormContextType {
  formData: EmployeeFormValues
  currentStep:number
  updateFormData: (data: Partial<EmployeeFormValues>) => void
  clearFormData: () => void
  updateStep: (step: number) => void
}

const initialFormData: EmployeeFormValues = {
  id: '',
  name: '',
  gender: Gender.MALE,
  dateOfBirth: '',
  maritalStatus: MaritalStatus.SINGLE,
  language: '',
  nationality: '',

  phoneNumber: '',
  email: '',
  workEmail: '',
  addressLine1: '',
  addressLine2: '',

  aadhaarNumber: '',
  panNumber: '',
  driverLicenseNumber: '',

  designation: '',
  department: '',
  employmentType: EmploymentType.FULL_TIME,
  dateOfJoining: '',
  workLocation: '',
  reportingManagerId: '',

  bankName: '',
  bankAccountHolderName: '',
  bankAccountNumber: '',
  bankAccountType: BankAccountType.SAVINGS,
  bankIfscCode: '',
  bankBranch: '',
}

const MultistepFormContext = createContext<MultistepFormContextType | undefined>(undefined)

const STORAGE_KEY = 'multistep-form-data'
const CURRENT_STEP_KEY = 'current-step'

export default function MultistepFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<EmployeeFormValues>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialFormData
  })
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem(CURRENT_STEP_KEY)
    return saved ? parseInt(saved, 10) : 0
  })

  const updateFormData = (data: Partial<EmployeeFormValues>) => {
    const updatedData = { ...formData, ...data }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
    setFormData(updatedData)
  }

  const clearFormData = () => {
    setFormData(initialFormData)
    localStorage.removeItem(STORAGE_KEY)
  }

  const updateStep = (step: number) => {
    setCurrentStep(step)
    localStorage.setItem(CURRENT_STEP_KEY, step.toString())
  }

  return (
    <MultistepFormContext.Provider value={{ formData, updateFormData, clearFormData, currentStep, updateStep }}>
      {children}
    </MultistepFormContext.Provider>
  )
}

export function useMultistepForm() {
    const context = useContext(MultistepFormContext)
    if (!context) {
        throw new Error('useMultistepForm must be used within a MultistepFormProvider')
    }
    return context
}
