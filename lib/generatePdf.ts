import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { User, Organization } from "@prisma/client"

export function generatePdf<T>(
  data: T[],
  columns: string[],
  fileName: string
) {
  const doc = new jsPDF()

  const tableColumn = columns.map((col) => col.charAt(0).toUpperCase() + col.slice(1))
  const tableRows = data.map((item) =>
    columns.map((col) => {
      if (col === "createdAt") {
        const date = new Date(item[col as keyof T] as Date)
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
      }
      return String(item[col as keyof T])
    })
  )

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
  })

  doc.save(`${fileName}.pdf`)
}
