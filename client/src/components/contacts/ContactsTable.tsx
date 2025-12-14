"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    Row,
    HeaderContext,
    CellContext,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Search, Trash2, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Contact } from "@/types"
import { useContactsStore } from "@/store/useContactsStore"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

import { ContactDetailsSheet } from "./ContactDetailsSheet"
import { AddContactForm } from "./AddContactForm"

interface ContactsTableProps {
    data: Contact[]
    isLoading?: boolean
}

export function ContactsTable({ data, isLoading }: ContactsTableProps) {
    const { deleteContact } = useContactsStore()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [isAddContactOpen, setIsAddContactOpen] = React.useState(false)
    const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null)

    const columns = React.useMemo<ColumnDef<Contact>[]>(() => [
        {
            id: "select",
            header: ({ table }: HeaderContext<Contact, unknown>) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }: CellContext<Contact, unknown>) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }: HeaderContext<Contact, unknown>) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }: CellContext<Contact, unknown>) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={row.original.avatar} alt={row.getValue("name")} />
                        <AvatarFallback>{(row.original.name || "C").substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium cursor-pointer hover:underline" onClick={() => setSelectedContact(row.original)}>
                        {row.getValue("name")}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }: CellContext<Contact, unknown>) => <div>{row.getValue("phone")}</div>,
            enableHiding: true, // Allow hiding
            // Hide on small screens
            meta: {
                className: "hidden md:table-cell"
            }
        },
        {
            accessorKey: "tags",
            header: "Tags",
            cell: ({ row }: CellContext<Contact, unknown>) => {
                const tags = row.getValue("tags") as string[]
                return (
                    <div className="flex gap-1 flex-wrap">
                        {tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="px-1 text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )
            },
            meta: {
                className: "hidden lg:table-cell" // Hide tags on mobile/tablet
            }
        },
        {
            accessorKey: "lastActive",
            header: ({ column }: HeaderContext<Contact, unknown>) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hidden md:flex" // Hide header button
                    >
                        Last Active
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }: CellContext<Contact, unknown>) => {
                const date = new Date(row.getValue("lastActive"))
                return <div className="text-muted-foreground text-sm hidden md:block">{date.toLocaleDateString()}</div>
            },
            meta: {
                className: "hidden md:table-cell"
            }
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }: CellContext<Contact, unknown>) => {
                const contact = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(contact.id)}
                            >
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedContact(contact)}>View details</DropdownMenuItem>
                            <DropdownMenuItem>Start chat</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ], [])

    // Mock Bulk Actions
    const handleExport = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const dataToExport = selectedRows.map(row => row.original)
        console.log("Exporting", dataToExport)
        // In real app: convert to CSV and download
        const headers = ["Name", "Phone", "Last Active"]
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + dataToExport.map(r => `${r.name},${r.phone},${r.lastActive}`).join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "contacts_export.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleDelete = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const selectedCount = selectedRows.length

        if (confirm(`Are you sure you want to delete ${selectedCount} contacts?`)) {
            selectedRows.forEach(row => {
                deleteContact(row.original.id)
            })
            toast.success(`${selectedCount} contact(s) deleted successfully`)
            setRowSelection({})
        }
    }

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4 justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filter contacts..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="pl-8"
                    />
                </div>
                <div className="flex gap-2">
                    {/* Placeholder for Tag Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 border-dashed">
                                <Plus className="mr-2 h-4 w-4" />
                                Filter Tags
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked>
                                VIP
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                Lead
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>
                                Customer
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" className="ml-auto">
                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button onClick={() => setIsAddContactOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Contact
                    </Button>
                </div>
            </div>
            <AddContactForm open={isAddContactOpen} onOpenChange={setIsAddContactOpen} />
            <ContactDetailsSheet
                contact={selectedContact}
                open={!!selectedContact}
                onOpenChange={(open) => !open && setSelectedContact(null)}
            />
            <div className="rounded-md border bg-card overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    // Access custom meta className (safe cast if needed)
                                    // @ts-ignore
                                    const className = header.column.columnDef.meta?.className

                                    return (
                                        <TableHead key={header.id} className={className}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <TableRow key={index}>
                                    {columns.map((col, i) => (
                                        <TableCell key={i}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        // @ts-ignore
                                        const className = cell.column.columnDef.meta?.className
                                        return (
                                            <TableCell key={cell.id} className={className}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground flex items-center gap-4">
                    <span>
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </span>
                    {table.getFilteredSelectedRowModel().rows.length > 0 && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-300">
                            <Button size="sm" variant="outline" onClick={handleExport}>
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                            <Button size="sm" variant="destructive" onClick={handleDelete}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
                            </Button>
                        </div>
                    )}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
