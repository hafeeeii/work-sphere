import ReporteesCard from '../reportees-card'

export default function Reportees({
  reportees
}: {
  reportees: {
    id: string
    name: string
    designationMeta: {
      name: string
    }
  }[]
}) {
  return reportees.length > 0 ? (
    <div className='mt-5 flex flex-wrap gap-5'>
      {reportees.map((reportee, idx) => (
        <div className='w-1/4' key={idx}>
          <ReporteesCard employee={reportee} key={idx} />
        </div>
      ))}
    </div>
  ) : (
    <div className='mt-5 flex h-full w-full items-center justify-center gap-5'>
      <p>No reportees found</p>
    </div>
  )
}
