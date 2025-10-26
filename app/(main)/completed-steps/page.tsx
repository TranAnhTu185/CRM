"use client";

import { Button, Modal, ScrollArea, Table } from "@mantine/core";

export default function CompletedStepComponent() {

    const data = [

    ]
    return (
        <div>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Tất cả các bước đã thực hiện (0)</h2>
                    {/* <div className="flex gap-2">
                    <Button className="mr-[var(--mantine-spacing-md)]" variant="default">
                        ⚙ Cài đặt
                    </Button>
                    <Button color="violet">
                        + Tạo
                    </Button>
                </div> */}
                </div>

                <ScrollArea h={300} >
                    <Table miw={700}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Bước cần thực hiện</Table.Th>
                                <Table.Th>Thời gian bắt đầu</Table.Th>
                                <Table.Th>Tên lượt chạy</Table.Th>
                                <Table.Th>Quy trình</Table.Th>
                                <Table.Th>Thời hạn xử lý</Table.Th>
                                <Table.Th>Trạng thái đến hạn</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data.map((wf, idx) => (
                                <Table.Tr key={idx}>
                                    <Table.Td className="hover:cursor-pointer hover:text-pink-500">{wf.name}</Table.Td>
                                    <Table.Td>
                                        {wf.type === "Manual Flow" ? (
                                            <span className="text-blue-500 font-medium">Manual Flow</span>
                                        ) : (
                                            <span className="text-orange-500 font-medium">Triggered Flow</span>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        {wf.publish === "publish" ? (
                                            <span className="flex items-center gap-1 text-green-600">● Đã xuất bản</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-400">● Nháp</span>
                                        )}
                                    </Table.Td>
                                    <Table.Td>
                                        {wf.status === "active" ? (
                                            <span className="flex items-center gap-1 text-green-600">● Đang hoạt động</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-red-500">● Ngưng</span>
                                        )}</Table.Td>
                                    <Table.Td>{wf.createdBy}</Table.Td>
                                    <Table.Td>{new Date(wf.created_at).toLocaleString()}</Table.Td>

                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </div>
            {/* {page === "detailAndCreate" && <DetailAndCreatePage idBP={id} onButtonClick={handleChildClick} type={selected} />} */}
        </div>
    )
}