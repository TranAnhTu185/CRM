"use client";
import BpmnJS from 'bpmn-js/lib/Modeler';
import { ManagerBpmnProvider, useManagerBpmnContext } from '@/app/libs/contexts/manager-bpmn-context';
import { useEffect, useState } from "react";
import BpmnSidebar from "@/app/components/bpmn/TasksList";
import BpmnCanvas from "@/app/components/bpmn/bpmnModeler";
import { ChildPropsBPMN } from '@/app/types/consts';
import { Breadcrumbs, Button, Group, Tooltip, Text, Modal, Stack, TextInput, Textarea, Paper, Select } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
const EMPTY_DIAGRAM = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:themeEx="http://theme-ex/schema" id="cogover-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="BlankProcess" isExecutable="true">
    <bpmn2:startEvent id="Event_09wddjx" name="Start" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_Blank">
    <bpmndi:BPMNPlane id="BPMNPlane_Blank" bpmnElement="BlankProcess">
      <bpmndi:BPMNShape id="Event_09wddjx_di" bpmnElement="Event_09wddjx">
        <dc:Bounds x="179" y="289" width="62" height="62" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="198" y="358" width="24" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
`;



interface Permission {
    id: number;
    type: string;
    include: string;
    user: string;
    role: string;
}

export function DetailAndCreatePage({ idBP, type, onButtonClick }: ChildPropsBPMN) {
    const [xml, setXml] = useState("");
    const [modeler, setModeler] = useState<BpmnJS | null>(null);

    const [opened, setOpened] = useState(false);
    const { data, setData, taskItems, gatewayItems, eventItems } = useManagerBpmnContext();


    // Form state
    const [name, setName] = useState("");
    const [version, setVersion] = useState("");
    const [description, setDescription] = useState("");
    // Permissions state
    const [permissions, setPermissions] = useState<Permission[]>([
        { id: 1, type: "Nhân sự", include: "Bao gồm", user: "", role: "Xem" },
    ]);

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
        debugger;
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
                content: data,
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
                    onButtonClick("list")
                }
            } catch (error) {
                console.error('Error during fetch:', error);
                throw error; // Re-throw the error for further handling
            }
        } catch (err) {
            console.error('Error exporting XML:', err);
        }
    };
    useEffect(() => {
        if (idBP) {
            async function getDetail() {
                const url = `https://workflow.bytebuffer.co/workflow?id=${idBP}`
                try {
                    const response = await fetch(url, {
                        method: 'GET', // *GET, POST, PUT, DELETE, etc.
                        headers:
                        {
                            'contentType': "application/json"
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
                    }

                    const dataOpen = await response.json();
                    if (dataOpen.rd === "Success") {
                        setXml(dataOpen.data[0].xmlString);
                        console.log(dataOpen);
                    }
                } catch (error) {
                    console.error('Error during fetch:', error);
                    throw error; // Re-throw the error for further handling
                }
            }
            getDetail();
        } else {
            setXml(EMPTY_DIAGRAM);
        }
    }, [idBP])


    return (
        <div className="font-sans w-[100%] h-screen max-h-[calc(100vh-160px)]">
            <div className="flex items-center justify-between mb-6">
                {/* Left */}
                <div>
                    <Group gap="xs" mt="sm">
                        <Text size="xl" fw={700}>
                            Tạo quy trình
                        </Text>
                        <Tooltip label="Thông tin">
                            <IconInfoCircle size={18} className="text-gray-500" />
                        </Tooltip>
                    </Group>
                </div>

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
                                        className="w-[120px]"
                                    />
                                    <Select
                                        data={["Bao gồm", "Loại trừ"]}
                                        value={perm.include}
                                        onChange={(val) =>
                                            updatePermission(perm.id, "include", val || "Bao gồm")
                                        }
                                        className="w-[120px]"
                                    />
                                    <TextInput
                                        placeholder="Chọn nhân sự"
                                        value={perm.user}
                                        onChange={(e) =>
                                            updatePermission(perm.id, "user", e.currentTarget.value)
                                        }
                                        className="flex-1"
                                    />
                                    <Select
                                        data={["Xem", "Sửa", "Toàn quyền"]}
                                        value={perm.role}
                                        onChange={(val) =>
                                            updatePermission(perm.id, "role", val || "Xem")
                                        }
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
            </div>
            <main className="flex w-full h-[100%] items-start">
                <BpmnSidebar modeler={modeler} />
                <BpmnCanvas xml={xml} onModelerReady={setModeler} />
            </main>
        </div>
    );
}