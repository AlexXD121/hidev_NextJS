"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
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
    TableHeader as TableHeaderType,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Contact } from "@/types"
import { useContactsStore } from "@/store/useContactsStore"
import { useChatStore } from "@/store/useChatStore"
import { useRouter } from "next/navigation"
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
    const { startChat } = useChatStore()
    const router = useRouter()

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [isAddContactOpen, setIsAddContactOpen] = React.useState(false)
    const [selectedContact, setSelectedContact] = React.useState<Contact | null>(null)

    const handleStartChat = (contact: Contact) => {
        startChat(contact)
        router.push('/chat')
    }

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
            enableHiding: true,
            meta: {
                className: "table-cell"
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
                className: "hidden lg:table-cell"
            }
        },
        {
            accessorKey: "lastActive",
            header: ({ column }: HeaderContext<Contact, unknown>) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="hidden md:flex"
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
                            <DropdownMenuItem onClick={() => handleStartChat(contact)}>Start chat</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ], [])

    const handleExport = () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows
        const dataToExport = selectedRows.map(row => row.original)
        console.log("Exporting", dataToExport)
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

    const MotionTableRow = motion.create(TableRow)
    const MotionTableBody = motion.create(TableBody)

    const tableContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.05
            }
        }
    } as any

    const tableRowVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    } as any

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
                        className="pl-8 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    />
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Button variant="outline" size="sm" className="h-8 border-dashed">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Filter Tags
                                </Button>
                            </motion.div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked>VIP</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Lead</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem>Customer</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" className="ml-auto">
                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    <motion.div whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => setIsAddContactOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Contact
                        </Button>
                    </motion.div>
                </div>
            </div>

            <AddContactForm open={isAddContactOpen} onOpenChange={setIsAddContactOpen} />
            <ContactDetailsSheet
                contact={selectedContact}
                open={!!selectedContact}
                onOpenChange={(open) => !open && setSelectedContact(null)}
            />

            <div className="rounded-md border bg-card overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
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
                    <MotionTableBody
                        variants={tableContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
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
                            <AnimatePresence>
                                {table.getRowModel().rows.map((row) => (
                                    <MotionTableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        variants={tableRowVariants}
                                        whileHover={{ scale: 1.01, backgroundColor: "var(--muted)" }}
                                        className="group transition-colors"
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
                                    </MotionTableRow>
                                ))}
                            </AnimatePresence>
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
                    </MotionTableBody>
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
