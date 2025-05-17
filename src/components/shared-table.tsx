'use client'

import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { Input } from './ui/input'

type Props<T extends object> = {
  tableData: {
    data: T[]
    columnData: {
      header: string
      accessorKey: keyof T
      accessorFn?: (row: T) => any
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

export function SharedTable<T extends object>({ tableData: { columnData, data } }: Props<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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
      console.log(param.get(column.accessorKey as string), 'checking')
      if (column.filterable) {
        const found = columnFilters.find(filter => filter.id === column.accessorKey)
        if (!found) {
          param.delete(column.accessorKey as string)
        }
      }
    })

    router?.push(`?${param.toString()}`)
  }

  React.useEffect(() => {
    loadData()
  }, [sorting, columnFilters])

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
    cell: ({ row }) => <div>{row.getValue(val.accessorKey as string)}</div>
  }))

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true,
    manualFiltering: true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  return (
    <div className='w-full space-y-2'>
      <div className='flex items-center gap-2'>
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
          <TableHeader>
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
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
