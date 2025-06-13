import {
  type ColumnDef,
  type RowData,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { isNullish } from 'radashi';

import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { getColorScale } from '@/lib/dataView';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function VerticalDataTable<TData extends RowData, TValue>({
  className,
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={className}>
      <Table>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => {
              const Slot = index === 0 ? TableHead : TableCell;

              return (
                <Slot key={header.id} scope={index === 0 ? 'row' : undefined}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </Slot>
              );
            })}
          </TableRow>
        ))}
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, index) => {
            const Slot = index === 0 ? TableHead : TableCell;

            return (
              <Slot
                key={row.id}
                scope={index === 0 ? 'row' : undefined}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => {
                  const { meta } = cell.column.columnDef;
                  const value = cell.getValue();
                  let className = meta?.className;

                  if (
                    !isNullish(meta?.lowest) &&
                    !isNullish(meta.highest) &&
                    typeof value === 'number'
                  ) {
                    className = cn(
                      className,
                      getColorScale(meta.lowest, meta.highest, value, !!meta.lowerBetter),
                    );
                  }

                  return (
                    <TableCell key={cell.id} className={className}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </Slot>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No data.
            </TableCell>
          </TableRow>
        )}
      </Table>
    </div>
  );
}
