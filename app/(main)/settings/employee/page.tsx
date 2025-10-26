"use client";

import { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import { BaseTable, Column } from "@/app/(main)/components/base/BaseTable";
import { TableToolbar } from "@/app/(main)/components/base/TableToolbar";

interface User {
    user_id: string;
    userName: string;
    photo_url: string;
    name: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string;
}

export default function Page() {
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtered, setFiltered] = useState<string>("");
    const [selected, setSelected] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0); // tạm đặt sẵn
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchData();
    }, [filtered]);

    async function fetchData() {
        const stored = "t=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4YjIyOTllNi01ZWE5LTRmNmUtYmNiZS1kNjg3ZGMyZDgzOGYiLCJ3b3JrcGxhY2VfaWQiOiJXUHV2VHNUV2JkSzZRWWFMWSIsImRvbWFpbiI6ImRhdXR2MiIsInVzZXJfaWQiOiJXc0lBM21Hc2x2T3c1SHRReGZUNSIsIndwX3VzZXJfaWQiOiJXVUI2eTNpZ3FUQlB6WEw2OSIsImZpcnN0X25hbWUiOiJkYXVhMTk5M0BnbWFpbC5jb20iLCJsYXN0X25hbWUiOiIiLCJpYXQiOjE3NjE0MTMyODksImV4cCI6MTc3Njk2NTI4OX0.u_uTF6ozD_LEBPvcEHU6gA8DQKxbaJ4gWnG9ARWiH5c";
        const url = "https://dautv2.dadujsc.online/api/wp/object/filter/workplace_users"
        const body = {
            "page": 1,
            "size": 15,
            "filters": [
                {
                    "field": "id",
                    "op": "not null",
                    "params": filtered
                }
            ],
            "sorts": [
                {
                    "field": "updated_at",
                    "order": "desc"
                }
            ],
            "filter_type": 1,
            "logic_sequence": ""
        }
        try {
            const response = await fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                headers:
                {
                    'Content-Type': "application/json",
                    'cookie': stored,

                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }

            const dataOpen = await response.json();
            if (dataOpen.rd === "Success") {
                setData(dataOpen.data);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            setLoading(false);
            throw error; // Re-throw the error for further handling
        }
    }

    const columns: Column<User>[] = [
        { key: "user_id", label: "User" },
        { key: "userName", label: "Tên đăng nhập" },
        { key: "photo_url", label: "Ảnh" },
        { key: "name", label: "Tên" },
        { key: "created_at", label: "Thời gian tạo" },
        { key: "updated_at", label: "Thời gian cập nhật" },
        { key: "created_by", label: "Người tạo" },
        { key: "updated_by", label: "Người cập nhật" }
    ];

    const handleSearch = (query: string) => {
        const q = query.toLowerCase();
        setFiltered(q);
    };

    return (
        <Box className="p-6">
            <TableToolbar
                select={selected.length}
                onSearch={handleSearch}
                onRefresh={() => window.location.reload()}
                onCreate={() => alert("Tạo mới")}
                onDelete={() => alert("Xóa mục được chọn")}
                onSettings={() => alert("Cài đặt")}
                onFilter={() => alert("Bộ lọc nâng cao")}
            />
            <BaseTable<User>
                data={data}
                columns={columns}
                loading={loading}
                selectable
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1); // reset về trang đầu khi đổi page size
                    fetchData();
                }}
                onSelectionChange={setSelected}
            />
        </Box>
    );
}
