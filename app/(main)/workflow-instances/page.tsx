'use client';
import {
    Button,
    Flex,
    Group,
    Modal,
    Paper, Select,
    Stack,
    Table,
    Text, TextInput,
    ThemeIcon
} from "@mantine/core";
import {useState} from "react";
import {useForm} from "@mantine/form";
import {useRouter} from "next/navigation";
export default function WorkflowInstance() {
    const [opened, setOpened] = useState(false);
    const router = useRouter();

    const modalForm = useForm({
        initialValues: {
            workFlowId: "",
            workFlowName: "",
        },
        validate: {
            workFlowName: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            workFlowId: (value) => (!value ? "Vui lòng chọn danh sách cần lặp" : null),
        },
    });
    const dataTableTest=[{
        startDate:"25/09/2025",
        name:"Tên 1",
        workFlow:"Flow 1",
        status:"Completed"

    }]

    const rows = dataTableTest.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{ element.startDate}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.workFlow}</Table.Td>
            <Table.Td>{element.status}</Table.Td>
        </Table.Tr>
    ));

    return (<>
            <div>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Quy trình đang hoạt động</h2>
                        <div className="flex gap-2">
                            <Button className="mr-[var(--mantine-spacing-md)]" variant="default">
                                ⚙ Cài đặt
                            </Button>
                            <Button onClick={() => setOpened(true)} color="violet">
                                + Thêm mới quy trình
                            </Button>
                            <Modal
                                opened={opened}
                                onClose={() => setOpened(false)}
                                title="Bắt đầu quy trình mẫu"
                                size="lg"
                                radius="md"
                                overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
                                className="text-black"
                            >
                                <form>

                                <div>
                                    {/* Chọn quy trình*/}
                                    <Select
                                        required
                                        label={
                                            <span className="text-black">
                                            Chọn quy trình
                                        </span>
                                        }
                                        placeholder=" Chọn quy trình"
                                        data={[
                                            { value: "1", label: "Quy trình 1" },
                                            { value: "2", label: "Quy trình 2" },
                                        ]}
                                        {...modalForm.getInputProps("workFlowId")}
                                        value={modalForm.values.workFlowId}
                                        onChange={(e) => {
                                            modalForm.setFieldValue("workFlowId", e);
                                        }}
                                        withAsterisk
                                        mb="md"
                                    />

                                    <TextInput
                                        required
                                        label={
                                            <span className="text-black">
                                            Tên hiển thị
                                        </span>
                                                        }
                                        placeholder="Nhập tên..."
                                        {...modalForm.getInputProps("workFlowName")}
                                        value={modalForm.values.workFlowName}
                                        onChange={(e) => {
                                            modalForm.setFieldValue("workFlowName", e.currentTarget.value);
                                        }}
                                        withAsterisk
                                        mb="md"
                                    />
                                </div>
                                    <Group justify="flex-end" mt="md">
                                        <Button variant="default" onClick={() => setOpened(false)}>
                                            Hủy
                                        </Button>
                                        <Button onClick={
                                            ()=>{
                                                setOpened(false)
                                                router.push(`/workflow-instances/process`, { scroll: false });

                                            }}>Đồng ý</Button>
                                    </Group>
                                </form>

                            </Modal>
                        </div>
                    </div>


                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Thời gian bắt đầu</Table.Th>
                                <Table.Th>Tên lượt chạy</Table.Th>
                                <Table.Th>Quy trình</Table.Th>
                                <Table.Th>Trạng thái</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>

                </div>
            </div>
        </>
    );
}
