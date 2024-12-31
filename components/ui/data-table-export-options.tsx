import React from "react"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { FileDown } from 'lucide-react'
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { generatePdf } from "@/lib/generatePdf"

interface DataTableExportOptionsProps<TData> {
  table: Table<TData>
  fileName: string
}

export function DataTableExportOptions<TData>({
  table,
  fileName,
}: DataTableExportOptionsProps<TData>) {
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>([])

  const handleExport = (exportType: "all" | "selected" | "filtered") => {
    let dataToExport: TData[] = []
    let columnsToExport: string[] = []

    if (exportType === "all") {
      dataToExport = table.getPreFilteredRowModel().rows.map((row) => row.original)
      columnsToExport = table.getAllColumns().map((column) => column.id)
    } else if (exportType === "selected") {
      dataToExport = table.getSelectedRowModel().rows.map((row) => row.original)
      columnsToExport = selectedColumns.length > 0 ? selectedColumns : table.getAllColumns().map((column) => column.id)
    } else if (exportType === "filtered") {
      dataToExport = table.getFilteredRowModel().rows.map((row) => row.original)
      columnsToExport = table.getAllColumns().map((column) => column.id)
    }

    generatePdf(dataToExport, columnsToExport, fileName)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem onClick={() => handleExport("all")}>
          Export All
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem onClick={() => handleExport("selected")}>
          Export Selected
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem onClick={() => handleExport("filtered")}>
          Export Filtered
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Select Columns</DropdownMenuLabel>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={selectedColumns.includes(column.id)}
                onCheckedChange={(value) =>
                  setSelectedColumns(
                    value
                      ? [...selectedColumns, column.id]
                      : selectedColumns.filter((id) => id !== column.id)
                  )
                }
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


