export default function UnauthorizedPage() {
  return (
    <div className='flex h-full items-center justify-center text-center'>
      <div>
        <h1 className='text-4xl font-bold text-destructive'>403 - Unauthorized</h1>
        <p className='mt-4 text-muted-foreground'>You don&apos;t have permission to view this page.</p>
      </div>
    </div>
  )
}
