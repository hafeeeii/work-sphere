'use client'

import { Button } from '@/components/ui/button'
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'
import * as React from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import clsx from 'clsx'
import { Pencil, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Input } from './ui/input'

type Props<T extends object> = {
  onEdit?: (id: string) => void
  onDelete: (id: string) => Promise<{
    status: boolean;
    message: string;
    error: unknown;
}>,
  tableData: {
    editMode: 'toggle' | 'redirect'
    data: T[]
    columnData: {
      header: string
      accessorKey: keyof T
      accessorFn?: (row: T) => unknown
      sortable?: boolean
      filterable?: boolean
    }[]
  }
  pageIndex?: number
  pageSize?: number
  pageCount?: number
  onPaginationChange?: (pagination: PaginationState) => void
  className?: string
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement
}

export function SharedTable<T extends object>({ tableData: { columnData, data , editMode }, onEdit, onDelete }: Props<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const router = useRouter()

  const loadData = () => {
    // sorting
    const existingParamsString = window.location.search
    const param = new URLSearchParams(existingParamsString)

    if (sorting[0]) {
      param.set('sortBy', sorting[0].id)
      param.set('sortOrder', sorting[0].desc ? 'desc' : 'asc')
    }

    // filtering
    if (columnFilters[0]) {
      columnFilters.forEach(filter => {
        param.set(filter.id, filter?.value as string)
      })
    }

    // remove filters that are not in the table
    columnData?.forEach(column => {
      if (column.filterable) {
        const found = columnFilters.find(filter => filter.id === column.accessorKey)
        if (!found) {
          param.delete(column.accessorKey as string)
        }
      }
    })

    // pagination
    if (pagination) {
      param.set('page', pagination.pageIndex.toString())
      param.set('pageSize', pagination.pageSize.toString())
    }

    router?.push(`?${param.toString()}`)
  }

  React.useEffect(() => {
    loadData()
  }, [sorting, columnFilters, pagination])


  const actions =  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }:{row:Row<{id: string }>}) => {
      const deleteWithId = onDelete.bind(null, row.original.id)
      return (
        <div className='flex justify-end gap-2'>
          <Button variant={'outline'} size={'icon'}
            onClick={() => {
                if (onEdit && editMode === 'toggle') {
                  onEdit(row.original.id)
                }
              }}
          >
            <Pencil/>
          </Button>
          <Button variant={'outline'} size={'icon'}
            onClick={async () => {
              const { message, status } = await deleteWithId()
              if (!status) {
                return toast.error(message)
              }
              toast.success(message)
            }}
          >
            <Trash/>
          </Button>
        </div>
      )
    },
  }

  const columns: ColumnDef<T>[] = columnData.map(val => ({
    accessorKey: val.accessorKey,
    header: ({ column }) => (
      <div
        className={clsx('capitalize', { 'cursor-pointer': val.sortable })}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        {val.header}
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue(val.accessorKey as string)}</div>,
    
  }))

  columns.push(actions as ColumnDef<T>)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination:true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className='w-full space-y-2 '>
      <div className='flex items-center gap-2 '>
        {columnData.map(
          (item, idx) =>
            item.filterable && (
              <Input
                key={idx}
                placeholder={item.header}
                value={(table.getColumn(item.accessorKey as string)?.getFilterValue() as string) ?? ''}
                onChange={event => table.getColumn(item.accessorKey as string)?.setFilterValue(event.target.value)}
                className='max-w-xs'
              />
            )
        )}
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader className='bg-secondary'>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
              <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{pagination.pageSize}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent >
        {[5,10, 20, 30, 40, 50].map(pageSize => (
          <DropdownMenuCheckboxItem
            key={pageSize}
            checked={pageSize === pagination.pageSize}
            onCheckedChange={() => setPagination((prev) => ({ ...prev, pageSize }))}
          >
            {pageSize}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button variant='outline' size='sm' onClick={() => table.nextPage()} >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
