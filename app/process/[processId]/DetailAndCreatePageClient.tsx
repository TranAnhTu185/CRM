"use client";
import BpmnJS from 'bpmn-js/lib/Modeler';
import { useManagerBpmnContext } from '@/app/libs/contexts/manager-bpmn-context';
import { useEffect, useState } from "react";
import BpmnSidebar from "@/app/components/bpmn/TasksList";
import BpmnCanvas from "@/app/components/bpmn/bpmnModeler";
import { dataItemNode } from '@/app/types/consts';
import { Button, Group, Text, Menu } from '@mantine/core';
import { IconAlertCircle, IconChevronDown, IconPlayerPlay, IconTrendingDown } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export const dynamic = "force-dynamic";  // hoặc "force-static" / "auto"

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


interface ClientProps {
  processId: string;
}

export function DetailAndCreatePage({ processId }: ClientProps) {
    const [xml, setXml] = useState("");
    const [modeler, setModeler] = useState<BpmnJS | null>(null);

    const { data, setData, taskItems, gatewayItems, eventItems } = useManagerBpmnContext();
    const [dataItem, setDataItem] = useState<dataItemNode>({});
     const router = useRouter();
    useEffect(() => {
        if (processId) {
            async function getDetail() {
                const url = `https://workflow.bytebuffer.co/workflow?id=${processId}`
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
                        const dataItem = dataOpen.data[0];
                        setDataItem(dataItem);
                        setXml(dataItem.xmlString);
                        setData(dataItem.content);
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
    }, [processId])


    const handleSave = async (publish: string, status: string) => {
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
                name: dataItem.name,
                version: dataItem.version,
                description: dataItem.description,
                permissions: dataItem.permissions,
                type: dataItem.type,
                status: status,
                publish: publish,
                content: data,
                xmlString: xml,
            }
            const url = "https://workflow.bytebuffer.co/workflow"
            try {
                const response = await fetch(url, {
                    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({
                        "id": processId,
                        "data": obj
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
                } else {
                    const dataOpen = await response.json();
                }
            } catch (error) {
                console.error('Error during fetch:', error);
                throw error; // Re-throw the error for further handling
            }
        } catch (err) {
            console.error('Error exporting XML:', err);
        }
    }


    return (
        <div className="font-sans w-[100%] h-screen max-h-[calc(100vh-160px)]">

            <Group>
                <Button variant="white" onClick={() => router.push("/")}>Cài đăt / Quản lý quy trình / {dataItem.name}</Button>
            </Group>
            <Group justify="space-between" p="md" className="bg-white">
                {/* Left section */}
                <div>
                    {/* <div className="text-sm text-gray-500 mb-1">
                            Cài đặt / Quản lý quy trình / <span className="text-black">sdfsdfdsfds</span>
                        </div> */}

                    <Group gap="xs">
                        {/* Status */}
                        <Text size="sm" c="gray">
                            {dataItem.status === "active" ? (
                                <span className="text-green-600">● Đang hoạt động</span>
                            ) : (
                                <span className="text-red-500">● Ngưng</span>
                            )}
                        </Text>

                        {/* Last updated */}
                        <Text size="sm" c="dimmed">
                            Cập nhật cuối <b> {new Date(dataItem.updated_at).toLocaleString()}</b>
                        </Text>

                        {/* Version */}
                        <Text size="sm" c="dimmed">
                            Phiên bản <b>{dataItem?.version} - V1</b>
                        </Text>

                        {/* Error icon */}
                        <IconAlertCircle color="red" size={18} />
                    </Group>
                </div>

                {/* Right section */}
                <Group gap="sm">
                    {/* Kích hoạt */}
                    {dataItem.publish === "unpublish" && <Button
                        variant="default"
                        leftSection={<IconPlayerPlay size={16} />}
                        color="gray"
                        onClick={() => handleSave("publish", "active")}
                    >
                        Kích hoạt
                    </Button>}

                    {dataItem.publish === "publish" && <Button
                        variant="outline"
                        color="indigo"
                        leftSection={<IconTrendingDown size={16} />}
                        radius="md"
                        onClick={() => handleSave("unpublish", "inactive")}
                    >
                        Ngừng xuất bản
                    </Button>}

                    {/* Lưu thay đổi */}
                    <Group gap={0}>
                        <Button color="indigo" onClick={() => handleSave(dataItem.publish, "default")} className='mr-[2px]'>Lưu thay đổi</Button>
                        <Menu>
                            <Menu.Target>
                                <Button color="indigo" variant="filled" px="xs">
                                    <IconChevronDown size={16} />
                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={() => handleSave("unpublish", "default")}>Lưu nháp</Menu.Item>
                                <Menu.Item onClick={() => handleSave("publish", "active")}>Lưu và xuất bản</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </Group>
            <div className="flex w-full h-[100%] items-start px-[var(--mantine-spacing-md)]">
                <BpmnSidebar modeler={modeler} />
                <BpmnCanvas xml={xml} onModelerReady={setModeler} type="detail" />
            </div>
        </div>
    );
}