export default function UnauthorizedPage() {
  return (
    <div className='flex flex-col h-full items-center justify-center text-center'>
        <h1 className='text-4xl font-bold text-destructive'>403 - Unauthorized</h1>
        <p className='mt-4 text-muted-foreground text-sm'>You don&apos;t have permission to view this page.</p>
    </div>
  )
}
