"use client";

import { Group, TextInput, Button, ActionIcon } from "@mantine/core";
import { IconSearch, IconTrash, IconRefresh, IconPlus, IconSettings, IconFilter, IconBolt } from "@tabler/icons-react";
import { useState } from "react";

interface TableToolbarProps {
    select?: number;
    onSearch?: (query: string) => void;
    onCreate?: () => void;
    onDelete?: () => void;
    onRefresh?: () => void;
    onSettings?: () => void;
    onFilter?: () => void;
}

export function TableToolbar({
    select,
    onSearch,
    onCreate,
    onDelete,
    onRefresh,
    onSettings,
    onFilter,
}: TableToolbarProps) {
    const [query, setQuery] = useState("");

    const handleSearch = (value: string) => {
        setQuery(value);
    };

    return (
        <Group justify="space-between" mb="md" wrap="wrap">
            {/* Ô tìm kiếm */}
            <TextInput
                leftSection={<IconBolt size={16} />}
                placeholder="Tìm kiếm nhanh..."
                value={query}
                onChange={(e) => handleSearch(e.currentTarget.value)}
                onBlur={() => onSearch?.(query)} 
                style={{ minWidth: 340 }}
            />

            {/* Nhóm nút hành động */}
            <Group gap="xs" wrap="wrap">
                <Button
                    color="red"
                    leftSection={<IconTrash size={16} />}
                    onClick={onDelete}
                    variant="filled"
                    disabled={select === 0}
                >
                    { select > 0 ? <span>Xoá({select})</span> : <span>Xoá</span> }
                </Button>

                <Button
                    leftSection={<IconRefresh size={16} />}
                    variant="default"
                    onClick={onRefresh}
                >
                    Làm mới
                </Button>

                <Button
                    // color="green"
                    leftSection={<IconPlus size={16} />}
                    onClick={onCreate}
                >
                    Tạo mới
                </Button>

                <Button
                    leftSection={<IconSettings size={16} />}
                    variant="default"
                    onClick={onSettings}
                >
                    Cài đặt
                </Button>

                <Button
                    leftSection={<IconFilter size={16} />}
                    variant="default"
                    onClick={onFilter}
                >
                    Bộ lọc
                </Button>
            </Group>
        </Group>
    );
}
