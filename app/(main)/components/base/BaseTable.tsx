"use client";

import React from "react";
import {
    Table,
    ScrollArea,
    Loader,
    Pagination,
    Group,
    Checkbox,
    Box,
    ThemeIcon,
    Select,
} from "@mantine/core";
import { IconDatabaseX } from "@tabler/icons-react";

export interface Column<T> {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
}

interface BaseTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    emptyText?: string;
    selectable?: boolean;
    page?: number;
    totalPages?: number;
    pageSize?: number;
    pageSizeOptions?: number[];
    onPageChange?: (page: number) => void;
    onSelectionChange?: (selected: T[]) => void;
    onPageSizeChange?: (size: number) => void;
}

export function BaseTable<T extends Record<string, any>>({
    data,
    columns,
    loading = false,
    emptyText = "No Data",
    selectable = false,
    page = 1,
    totalPages = 1,
    pageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    onPageChange,
    onPageSizeChange,
    onSelectionChange,
}: BaseTableProps<T>) {
    const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());

    // Gửi danh sách các hàng được chọn ra ngoài
    React.useEffect(() => {
        if (onSelectionChange) {
            const selectedItems = data.filter((_, idx) => selectedRows.has(idx));
            onSelectionChange(selectedItems);
        }
    }, [selectedRows, data, onSelectionChange]);

    // Trạng thái “chọn tất cả”
    const allSelected = data.length > 0 && data.every((_, i) => selectedRows.has(i));
    const partiallySelected =
        !allSelected && data.some((_, i) => selectedRows.has(i));

    const handleSelectAll = (checked: boolean) => {
        const newSet = new Set<number>();
        if (checked) data.forEach((_, i) => newSet.add(i));
        setSelectedRows(checked ? newSet : new Set());
    };

    const handleSelectRow = (index: number, checked: boolean) => {
        const newSet = new Set(selectedRows);
        if (checked) newSet.add(index);
        else newSet.delete(index);
        setSelectedRows(newSet);
    };

    return (
        <ScrollArea>
            <Table
                // highlightOnHover
                withTableBorder
                withColumnBorders
                verticalSpacing="sm"
            >
                <Table.Thead>
                    <Table.Tr>
                        {selectable && (
                            <Table.Th w={40}>
                                <Checkbox
                                    checked={allSelected}
                                    indeterminate={partiallySelected}
                                    onChange={(e) => handleSelectAll(e.currentTarget.checked)}
                                />
                            </Table.Th>
                        )}
                        {columns.map((col) => (
                            <Table.Th key={String(col.key)}>{col.label}</Table.Th>
                        ))}
                    </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                    {loading ? (
                        <Table.Tr>
                            <Table.Td colSpan={columns.length + (selectable ? 1 : 0)}>
                                <div className="flex justify-center py-4">
                                    <Loader size="sm" />
                                </div>
                            </Table.Td>
                        </Table.Tr>
                    ) : data.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={columns.length + (selectable ? 1 : 0)}>
                                <Box ta="center" p="xl">
                                    <ThemeIcon variant="white" size={40}>
                                        <IconDatabaseX size={38} />
                                    </ThemeIcon>
                                    <Box ml="md">{emptyText}</Box>
                                </Box>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        data.map((row, i) => (
                            <Table.Tr key={i}>
                                {selectable && (
                                    <Table.Td>
                                        <Checkbox
                                            checked={selectedRows.has(i)}
                                            onChange={(e) =>
                                                handleSelectRow(i, e.currentTarget.checked)
                                            }
                                        />
                                    </Table.Td>
                                )}
                                {columns.map((col) => (
                                    <Table.Td key={String(col.key)}>
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : String(row[col.key])}
                                    </Table.Td>
                                ))}
                            </Table.Tr>
                        ))
                    )}
                </Table.Tbody>
            </Table>

            {(totalPages > 1 || onPageSizeChange) && (
                <Group justify="flex-end" mt="md" wrap="wrap">
                    {totalPages > 1 && (
                        <Pagination
                            total={totalPages}
                            value={page}
                            onChange={onPageChange}
                            size="sm"
                        />
                    )}
                    {totalPages === 0 && (
                        <Pagination
                            total={1}
                            value={1}
                            onChange={onPageChange}
                            size="sm"
                        />
                    )}
                    <Group>
                        <Select
                            value={String(pageSize)}
                            onChange={(value) =>
                                onPageSizeChange?.(Number(value ?? pageSize))
                            }
                            className="text-black"
                            data={pageSizeOptions.map((opt) => ({
                                label: `${opt} / trang`,
                                value: String(opt),
                            }))}
                            w={120}
                        />
                    </Group>
                </Group>
            )}
        </ScrollArea>
    );
}
