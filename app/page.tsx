"use client";

import { Button, Flex, Group, Menu, Modal, Paper, ScrollArea, Stack, Table, Text, ThemeIcon } from "@mantine/core";
import { IconBolt, IconCalendar, IconCheck, IconDeviceDesktop, IconDotsVertical, IconMessageCircle, IconPencil, IconPhoto, IconPlaylist, IconSearch, IconSettings, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { notifications, showNotification } from "@mantine/notifications";
import { DetailAndCreatePage } from "./components/processes/index";
import cx from 'clsx';
import classes from './page.module.css';

export const dynamic = "force-dynamic";

type FlowType = "manual" | "scheduled" | "triggered" | "sequence" | "";

interface FlowOption {
    type: FlowType;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const flowOptions: FlowOption[] = [
    {
        type: "manual",
        title: "Manual Flow - Quy trình thông thường",
        description:
            "Cho phép người dùng thực hiện từng bước bằng cách nhập dữ liệu vào các màn hình đã cấu hình sẵn, sau đó chuyển tiếp các bước khác theo thiết lập.",
        icon: <IconDeviceDesktop size={28} />,
        color: "blue",
    },
    {
        type: "scheduled",
        title: "Scheduled Flow - Quy trình tự động theo thời gian",
        description:
            "Khởi chạy theo lịch trình và tần suất được thiết lập trước, đảm bảo quy trình diễn ra đúng thời điểm.",
        icon: <IconCalendar size={28} />,
        color: "green",
    },
    {
        type: "triggered",
        title: "Triggered Flow - Quy trình tự động theo điều kiện",
        description:
            "Khởi chạy khi đáp ứng điều kiện nhất định, giúp kích hoạt và thực hiện các công việc tiếp theo trong quy trình một cách tự động.",
        icon: <IconBolt size={28} />,
        color: "orange",
    },
    {
        type: "sequence",
        title: "Sequence - Chuỗi hành động",
        description:
            "Thực hiện lần lượt các bước theo trình tự đã thiết lập, cho phép gán người phụ trách và điều kiện chuyển bước nhằm đảm bảo quy trình diễn ra đúng kế hoạch.",
        icon: <IconPlaylist size={28} />,
        color: "violet",
    },
];

export default function ProcessesPage() {
    const [data, setData] = useState([]);
    const [dataTotal, setDataTotal] = useState(0);
    const [id, setDataId] = useState<any | null>("");
    const [page, setPage] = useState<string | "list" | "detailAndCreate">("list");
    const [opened, setOpened] = useState(false);
    const [selected, setSelected] = useState<FlowType | null>(null);

    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        fetchData();
    }, [])


    async function fetchData() {
        const url = "https://workflow.bytebuffer.co/workflow"
        try {
            const response = await fetch(url, {
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                headers:
                {
                    'Content-Type': "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }

            const dataOpen = await response.json();
            if (dataOpen.rd === "Success") {
                setData(dataOpen.data);
                setDataTotal(dataOpen.total);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            throw error; // Re-throw the error for further handling
        }
    }

    const handleDetail = (data: string) => {
        setDataId(data);
        setSelected("");
        setPage("detailAndCreate");
    }

    const handleChildClick = (increment: string) => {
        setPage(increment);
        fetchData();
        setOpened(false);
    };
    const hanleCreate = () => {
        setDataId(null);
        setOpened(false)
        setPage("detailAndCreate");
    }

    const handleDelete = async (data: string) => {
        setSelected("");
        const url = "https://workflow.bytebuffer.co/workflow"
        try {
            const response = await fetch(url, {
                method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
                headers:
                {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "id": data
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }

            const dataOpen = await response.json();
            if (dataOpen.rd === "OK") {
                showNotification({
                    title: 'thành công',
                    message: "Delete success",
                    color: 'green',
                    icon: <IconCheck />
                })
                fetchData();
            } else {
                showNotification({
                    title: 'Lỗi',
                    message: "Delete error",
                    color: 'red',
                    icon: <IconX />
                })
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            showNotification({
                title: 'Lỗi',
                message: "Delete error",
                color: 'red',
                icon: <IconX />
            })
            throw error; // Re-throw the error for further handling
        }
    }

    return (
        <div>
            {page === "list" &&
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Quản lý quy trình ({dataTotal})</h2>
                        <div className="flex gap-2">
                            <Button className="mr-[var(--mantine-spacing-md)]" variant="default">
                                ⚙ Cài đặt
                            </Button>
                            <Button onClick={() => setOpened(true)} color="violet">
                                + Tạo
                            </Button>
                            <Modal
                                opened={opened}
                                onClose={() => setOpened(false)}
                                title="Tạo quy trình"
                                size="lg"
                                radius="md"
                                overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
                            >
                                <Text size="sm" mb="md">
                                    Vui lòng chọn loại quy trình mà bạn muốn tạo.
                                </Text>

                                <Stack>
                                    {flowOptions.map((flow) => {
                                        const isActive = selected === flow.type;

                                        return (
                                            <Paper
                                                key={flow.type}
                                                withBorder
                                                p="md"
                                                radius="md"
                                                onClick={() => setSelected(flow.type)}
                                                onDoubleClick={() => {
                                                    setSelected(flow.type);
                                                    hanleCreate();
                                                }}
                                                style={{
                                                    cursor: "pointer",
                                                    borderColor: isActive ? "#228be6" : undefined, // xanh Mantine
                                                    backgroundColor: isActive ? "#e7f5ff" : undefined,
                                                }}
                                            >
                                                <Flex direction={{ base: 'column', sm: 'row' }}
                                                    gap={{ base: 'sm', sm: 'lg' }}
                                                    justify={{ sm: 'center' }}
                                                    align= {{ sm: 'center' }} 
                                                    >
                                                    <ThemeIcon color={flow.color} variant="light" size="lg" radius="xl">
                                                        {flow.icon}
                                                    </ThemeIcon>
                                                    <div>
                                                        <Text fw={500} c={isActive ? "blue" : undefined}>
                                                            {flow.title}
                                                        </Text>
                                                        <Text size="sm" c="dimmed">
                                                            {flow.description}
                                                        </Text>
                                                    </div>
                                                </Flex>
                                            </Paper>
                                        );
                                    })}
                                </Stack>

                                <Group justify="flex-end" mt="xl">
                                    <Button variant="default" onClick={() => setOpened(false)}>
                                        Hủy
                                    </Button>
                                    <Button disabled={!selected} onClick={hanleCreate}>
                                        Tạo
                                    </Button>
                                </Group>
                            </Modal>
                        </div>
                    </div>

                    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                        <Table miw={700}>
                            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                <Table.Tr>
                                    <Table.Th>Tên quy trình</Table.Th>
                                    <Table.Th>Phân loại</Table.Th>
                                    <Table.Th>Trạng thái xuất bản</Table.Th>
                                    <Table.Th>Trạng thái</Table.Th>
                                    <Table.Th>Người tạo</Table.Th>
                                    <Table.Th>Thời gian tạo</Table.Th>
                                    <Table.Th>Người cập nhật cuối</Table.Th>
                                    <Table.Th></Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {data.map((wf, idx) => (
                                    <Table.Tr key={idx}>
                                        <Table.Td>{wf.name}</Table.Td>
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
                                        <Table.Td>{wf.updatedBy}</Table.Td>
                                        <Table.Td>
                                            <Button onClick={() => handleDetail(wf.id)} className="mr-[var(--mantine-spacing-md)]"><IconPencil size={14} /></Button>
                                            <Button onClick={() => handleDelete(wf.id)} color="red"><IconTrash size={14} /></Button>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                </div>
            }
            {page === "detailAndCreate" && <DetailAndCreatePage idBP={id} onButtonClick={handleChildClick} type={selected} />}
        </div>

    );
}