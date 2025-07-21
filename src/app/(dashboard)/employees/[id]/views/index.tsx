import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Pencil, Phone } from 'lucide-react'

export default function EmployeeDetails() {
  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <div className='overflow-hidden rounded-xl border'>
        <div className='flex items-center gap-8 p-4'>
           <Avatar className='h-[80px] w-[80px]'>
                          <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
          <div className='flex w-full'>
            <div className='flex-1'>
              <h2 className='text-xl font-semibold'>Kumaran Selvam</h2>
              <p className='text-sm text-muted-foreground'>UI/UX Designer</p>
              <p className='text-sm text-muted-foreground'>Chennai, Tamil Nadu, India</p>
            </div>

            <div className='flex flex-1 flex-col justify-end gap-1'>
              <p className='flex gap-2 text-sm text-muted-foreground items-center'>
                <Mail size={15}/> kumaran@abc.com
              </p>
              <p className='flex gap-2 text-sm text-muted-foreground items-center'>
                <Phone size={15}/>
                +91 9087445533
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue='personal' className='w-full'>
        <TabsList className='mb-4'>
          <TabsTrigger value='personal'>Profile</TabsTrigger>
          <TabsTrigger value='contact'>Reportees</TabsTrigger>
          <TabsTrigger value='education'>Department</TabsTrigger>
          <TabsTrigger value='skills'>Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value='personal' className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {/* Personal Info */}
          <Card className='col-span-2'>
            <CardContent className='space-y-2 p-4'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold'>Personal Information</h3>
                <Pencil className='h-4 w-4 cursor-pointer' />
              </div>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <strong>Name:</strong> Kumaran selvam
                </div>
                <div>
                  <strong>Date of Birth:</strong> 05-Apr-1997
                </div>
                <div>
                  <strong>Age:</strong> 23 year 7 months
                </div>
                <div>
                  <strong>Blood Group:</strong> B+ Ve
                </div>
                <div>
                  <strong>Marital Status:</strong> Single
                </div>
                <div>
                  <strong>Gender:</strong> Male
                </div>
                <div>
                  <strong>Language known:</strong> English, Tamil
                </div>
                <div>
                  <strong>Religion:</strong> Hindu
                </div>
                <div>
                  <strong>Nationality:</strong> Indian
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ID Proof */}
          <Card>
            <CardContent className='space-y-2 p-4'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold'>ID Proof</h3>
                <Pencil className='h-4 w-4 cursor-pointer' />
              </div>
              <div className='space-y-1 text-sm'>
                <div>
                  <strong>Aadhaar:</strong> 486292634832
                </div>
                <div>
                  <strong>PAN:</strong> PTN805565
                </div>
                <div>
                  <strong>Passport:</strong> 311985555
                </div>
                <div>
                  <strong>Driving License:</strong> INT023154
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Info */}
          <Card className='col-span-3'>
            <CardContent className='space-y-2 p-4'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold'>Bank Information</h3>
                <Pencil className='h-4 w-4 cursor-pointer' />
              </div>
              <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-3'>
                <div>
                  <strong>Bank Name:</strong> ICICI
                </div>
                <div>
                  <strong>Account Number:</strong> 959805641256
                </div>
                <div>
                  <strong>Branch:</strong> Maduraitayapval
                </div>
                <div>
                  <strong>Account Holder Name:</strong> Kumaran
                </div>
                <div>
                  <strong>IFSC Code:</strong> 000ICICIC0058
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
