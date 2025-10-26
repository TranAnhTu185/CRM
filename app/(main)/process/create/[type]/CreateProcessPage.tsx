"use client";

import { useRouter } from "next/navigation";
import BpmnJS from 'bpmn-js/lib/Modeler';
import { Suspense, use, useState } from "react";
import { Permission } from "@/app/(main)/types/consts";
import { useManagerBpmnContext } from "@/app/(main)/libs/contexts/manager-bpmn-context";
import { Button, Group, Modal, Paper, Select, Stack, Text, Textarea, TextInput, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import BpmnSidebar from "../../../components/bpmn/TasksList";
import BpmnCanvas from "../../../components/bpmn/bpmnModeler";


export const dynamic = "force-dynamic";

const EMPTY_DIAGRAM = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="Definitions_1"
  targetNamespace="http://bpmn.io/schema/bpmn">

  <!-- Process trống (isExecutable=false để chỉ làm mẫu, không chạy) -->
  <bpmn:process id="Process_1" isExecutable="true"/>

  <!-- BPMN diagram / plane rỗng để hiển thị "trang trắng" -->
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1"/>
  </bpmndi:BPMNDiagram>

</bpmn:definitions>
`;

interface ClientCreateProps {
    type: string;
}

export default function CreateProcess({ type }: ClientCreateProps) {
    // lấy query param
    const [modeler, setModeler] = useState<BpmnJS | null>(null);

    const [opened, setOpened] = useState(false);
    const { data, setData, taskItems, gatewayItems, eventItems, dataField, setDataField } = useManagerBpmnContext();

    // Form state
    const [name, setName] = useState("");
    const [version, setVersion] = useState("");
    const [description, setDescription] = useState("");
    // Permissions state
    const [permissions, setPermissions] = useState<Permission[]>([
        { id: 1, type: "Nhân sự", include: "Bao gồm", user: "", role: "Xem" },
    ]);

    const router = useRouter();

    const addPermission = () => {
        setPermissions([
            ...permissions,
            {
                id: Date.now(),
                type: "Nhân sự",
                include: "Bao gồm",
                user: "",
                role: "Xem",
            },
        ]);
    };

    const updatePermission = (
        id: number,
        field: keyof Permission,
        value: string
    ) => {
        setPermissions((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    const removePermission = (id: number) => {
        setPermissions(permissions.filter((p) => p.id !== id));
    };

    const handleSubmit = async () => {
        const formData = {
            name,
            version,
            description,
            permissions,
        };
        if (!modeler) return;

        const elementRegistry = modeler.get('elementRegistry');
        const modeling = modeler.get('modeling');

        elementRegistry.filter((el: any) => el.type === 'bpmn:SequenceFlow').forEach((flow: any) => {
            if (!flow.source || !flow.target) {
                modeling.removeElements([flow]);
            }
        });

        try {
            const { xml } = await modeler.saveXML({ format: true });
            const obj = {
                name: formData.name,
                version: formData.version,
                description: formData.description,
                permissions: formData.permissions,
                type: type,
                status: "default",
                publish: "unpublish",
                content: data,
                dataField: dataField,
                xmlString: xml,
            }
            const url = "https://workflow.bytebuffer.co/workflow"
            try {
                const response = await fetch(url, {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({
                        "data": obj
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
                } else {
                    const dataOpen = await response.json();
                    setOpened(false);
                    router.push(`/`)
                }
            } catch (error) {
                console.error('Error during fetch:', error);
                throw error; // Re-throw the error for further handling
            }
        } catch (err) {
            console.error('Error exporting XML:', err);
        }
    };

    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <div className="font-sans w-[100%] h-screen max-h-[calc(100vh-160px)]">

                <Group>
                    <Button variant="white" onClick={() => router.push("/")}>Cài đăt /Tạo quy trình </Button>
                </Group>
                <Group justify="space-between" p="md" className="bg-white">
                    {/* Left */}
                    <Group gap="xs">
                        <Text size="xl" fw={700}>
                            Tạo quy trình
                        </Text>
                        <Tooltip label="Thông tin">
                            <IconInfoCircle size={18} className="text-gray-500" />
                        </Tooltip>
                    </Group>

                    {/* Right */}
                    <Button color="indigo" onClick={() => setOpened(true)}>
                        Lưu
                    </Button>

                    <Modal
                        opened={opened}
                        onClose={() => setOpened(false)}
                        title="Lưu quy trình"
                        size="lg"
                        radius="md"
                        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
                    >
                        <Stack gap="md">
                            <TextInput
                                label="Tên quy trình"
                                placeholder="Nhập tên quy trình"
                                required
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                            />
                            <TextInput
                                label="Tên phiên bản"
                                placeholder="Nhập tên phiên bản"
                                value={version}
                                onChange={(e) => setVersion(e.currentTarget.value)}
                            />
                            <Textarea
                                label="Mô tả"
                                placeholder="Nhập mô tả"
                                autosize
                                minRows={3}
                                maxLength={500}
                                value={description}
                                onChange={(e) => setDescription(e.currentTarget.value)}
                            />

                            <div>
                                <h3 className="text-sm font-medium mb-2">Phân quyền quy trình mẫu</h3>
                                {permissions.map((perm) => (
                                    <Paper
                                        key={perm.id}
                                        withBorder
                                        p="sm"
                                        radius="md"
                                        mb="xs"
                                        className="flex gap-2 items-center"
                                    >
                                        <Select
                                            data={["Nhân sự", "Phòng ban", "Nhóm"]}
                                            value={perm.type}
                                            onChange={(val) =>
                                                updatePermission(perm.id, "type", val || "Nhân sự")
                                            }
                                            className='flex-1 mb-[var(--mantine-spacing-md)]'
                                        />
                                        <Select
                                            data={["Bao gồm", "Loại trừ"]}
                                            value={perm.include}
                                            onChange={(val) =>
                                                updatePermission(perm.id, "include", val || "Bao gồm")
                                            }
                                            className='flex-1 mb-[var(--mantine-spacing-md)]'
                                        />
                                        <TextInput
                                            placeholder="Chọn nhân sự"
                                            value={perm.user}
                                            onChange={(e) =>
                                                updatePermission(perm.id, "user", e.currentTarget.value)
                                            }
                                            className="flex-1 mb-[var(--mantine-spacing-md)]"
                                        />
                                        <Select
                                            data={["Xem", "Sửa", "Toàn quyền"]}
                                            value={perm.role}
                                            onChange={(val) =>
                                                updatePermission(perm.id, "role", val || "Xem")
                                            }
                                            className='mb-[var(--mantine-spacing-md)]'
                                        />
                                        <Button
                                            variant="subtle"
                                            color="red"
                                            onClick={() => removePermission(perm.id)}
                                        >
                                            🗑
                                        </Button>
                                    </Paper>
                                ))}
                                <Button variant="light" size="xs" onClick={addPermission}>
                                    + Phân quyền thêm
                                </Button>
                            </div>

                            <Group justify="flex-end" mt="md">
                                <Button variant="default" onClick={() => setOpened(false)}>
                                    Hủy
                                </Button>
                                <Button onClick={handleSubmit}>Đồng ý</Button>
                            </Group>
                        </Stack>
                    </Modal>
                </Group>
                <div className="flex w-full h-[100%] items-start px-[var(--mantine-spacing-md)]">
                    <BpmnSidebar modeler={modeler} />
                    <BpmnCanvas xml={EMPTY_DIAGRAM} onModelerReady={setModeler} type="create" />
                </div>
            </div>
        </Suspense>
    );
}
