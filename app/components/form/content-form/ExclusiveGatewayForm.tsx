'use client';

import {
    Box,
    Text,
    Grid,
    Paper,
    Radio,
    Group,
    TextInput,
    Textarea,
    Alert,
    Divider,
    Title,
    Button,
    Stack,
    Select,
    Card,
    ActionIcon,
    Popover,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle, IconPlus, IconTrash } from '@tabler/icons-react';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { ChildFormProps, childProps } from '@/app/types/consts';
import { useManagerBpmnContext } from '@/app/libs/contexts/manager-bpmn-context';

type Mode = 'open' | 'close';

interface BranchCondition {
    id: string;
    resource: string;
    operator: string;
    value: string;
}


const ExclusiveGatewayForm = forwardRef<childProps, ChildFormProps>(({ dataItem, onSubmit }, ref) => {
    const { data, setData, taskItems, gatewayItems, eventItems, dataField, setDataField } = useManagerBpmnContext();
    const maxNameLength = 255;
    const maxDescLength = 1000;
    useImperativeHandle(ref, () => ({
        onSubmit: () => {
            const { hasErrors } = form.validate();
            if (!hasErrors) {
                onSubmit(form.values);
            }
        },
    }));

    const initData = () => {
        if (dataItem) {
            form.setValues(dataItem.info);
        }
    }

    useEffect(() => {
        initData();
    }, [dataItem]);

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            mode: 'open' as Mode,
            name: '',
            description: '',
            branches: [
                
            ],
            barnchsDefault: [{ destination: "", nameBranch: "", isDefault: true }]
        },
        validate: {
            name: (value) => {
                const val = value.trim();
                if (val.length < 2) return "Tên hành động phải tối thiểu 2 ký tự";
                if (val.length > 255) return 'Tên tối đa 255 ký tự';
                return null;
            },
            description: (value) => value.trim().length > 1000 ? "mô tả tối đa 1000 ký tự" : null,
        },
    });

    const addBranch = () => {
        form.insertListItem("branches", {
            id: crypto.randomUUID(),
            name: "",
            target: "",
            logic: "and",
            conditions: [],
        });
    };



    const updateBranches = (
        groupIndex: number,
        condIndex: number,
        field: string,
        value: any
    ) => {
        const dataSet = form.values.branches[groupIndex];
        const dataItem = dataSet.conditions[condIndex];
        dataItem[field] = value;
        form.setFieldValue(`branches.${groupIndex}`, dataSet);
    };

    return (
        <Box mx="auto">
            <form>
                <Alert
                    radius="md"
                    variant="light"
                    color="indigo"
                    icon={<IconInfoCircle size={18} />}
                    mb="md"
                >
                    Loại Đóng/ Mở của Inclusive Gateway không thể sửa sau khi tạo thành công
                </Alert>

                <Grid gutter="md" mb="lg">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper
                            withBorder
                            radius="lg"
                            p="md"
                            component="label"
                            style={{
                                cursor: 'pointer',
                                borderColor: form.values.mode === 'open' ? 'var(--mantine-color-indigo-5)' : undefined,
                            }}
                        >
                            <Group justify="space-between" align="flex-start">
                                <div>
                                    <Text fw={600} mb={4}>
                                        Mở
                                    </Text>
                                    <Text c="dimmed" size="sm">
                                        Cho phép duy nhất 1 đầu vào Inclusive Gateway và nhiều đầu ra tương ứng với các nhánh.
                                    </Text>
                                </div>
                                <Radio
                                    name="mode"
                                    value="open"
                                    checked={form.values.mode === 'open'}
                                    onChange={() => form.setFieldValue('mode', 'open')}
                                />
                            </Group>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper
                            withBorder
                            radius="lg"
                            p="md"
                            component="label"
                            style={{
                                cursor: 'pointer',
                                borderColor: form.values.mode === 'close' ? 'var(--mantine-color-indigo-5)' : undefined,
                            }}
                        >
                            <Group justify="space-between" align="flex-start">
                                <div>
                                    <Text fw={600} mb={4}>
                                        Đóng
                                    </Text>
                                    <Text c="dimmed" size="sm">
                                        Cho phép gộp nhiều đầu vào thành một đầu ra duy nhất, không có sự phân nhánh.
                                    </Text>
                                </div>
                                <Radio
                                    name="mode"
                                    value="close"
                                    checked={form.values.mode === 'close'}
                                    onChange={() => form.setFieldValue('mode', 'close')}
                                />
                            </Group>
                        </Paper>
                    </Grid.Col>
                </Grid>
                {/* Tên */}
                <TextInput
                    label={
                        <span className="text-black">
                            Tên
                        </span>
                    }
                    placeholder="Nhập tên..."
                    {...form.getInputProps("name")}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            {form.values.name.length}/{maxNameLength}
                        </Text>
                    }
                    rightSectionWidth={70}
                    maxLength={maxDescLength}
                    withAsterisk
                    mb="md"
                />

                {/* Mô tả */}
                <Textarea
                    label={
                        <span className="text-black">
                            Mô tả
                        </span>
                    }
                    placeholder="Nhập mô tả "
                    {...form.getInputProps("description")}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            {form.values.description.length}/{maxDescLength}
                        </Text>
                    }
                    rightSectionWidth={80}
                    autosize
                    minRows={3}
                    maxLength={maxDescLength}
                    mb="md"
                />

                {form.values.mode === "open" && <Box>
                    <Divider my="sm" />
                    <Title order={3} mb="md">
                        Thiết lập nhánh
                    </Title>
                    <span>
                        Đối với mỗi nhánh, hãy chỉ định các điều kiện phải đáp ứng để nhánh được kích hoạt. Hệ thống kiểm tra và kích hoạt đồng thời các nhánh có điều kiện được đáp ứng.
                    </span>
                    <br />
                    {form.values.branches.map((branch, branchIndex) => (
                        <Card
                            key={branch.id}
                            withBorder
                            shadow="sm"
                            mt="md"
                            p="md"
                            style={{ borderColor: "blue" }}
                        >
                            {/* Header */}
                            <Group justify="space-between">
                                <Text fw={600}>Nhánh {branchIndex + 1}</Text>
                                <ActionIcon
                                    color="red"
                                    onClick={() => form.removeListItem("branches", branchIndex)}
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>

                            {/* Name + Slug + Target */}
                            <Group grow mt="md">
                                <TextInput
                                    label="Tên"
                                    placeholder="Nhập tên"
                                    withAsterisk
                                    {...form.getInputProps(`branches.${branchIndex}.name`)}
                                />
                                <Select
                                    label="Đích"
                                    placeholder="Chọn đích"
                                    data={[
                                        { value: "1", label: "Đích A" },
                                        { value: "2", label: "Đích B" },
                                    ]}
                                    value={branch.target || ""}
                                    onChange={(val) =>
                                        form.setFieldValue(
                                            `branches.${branchIndex}.target`,
                                            val
                                        )
                                    }
                                />
                            </Group>

                            <Divider my="md" />

                            {/* Logic */}
                            <Text fw={500}>Điều kiện rẽ nhánh</Text>
                            <Select
                                mt="sm"
                                data={[
                                    { value: "and", label: "Thỏa mãn tất cả các điều kiện (AND)" },
                                    { value: "or", label: "Thỏa mãn 1 trong các điều kiện (OR)" },
                                ]}
                                value={branch.logic || ""}
                                onChange={(val) => {
                                    const dataSet = form.values.branches[branchIndex];
                                    dataSet.logic = val;
                                    form.setFieldValue(`branches.${branchIndex}`, dataSet);
                                }}
                            />

                            {/* Conditions */}
                            <Box mt="md">
                                {branch.conditions.length > 0 &&
                                    <div>
                                        <Grid>
                                            <Grid.Col span={4}>Tài nguyên hoặc biến</Grid.Col>
                                            <Grid.Col span={3}>Điều kiện</Grid.Col>
                                            <Grid.Col span={2}>Giá trị</Grid.Col>
                                            <Grid.Col span={1}></Grid.Col>
                                        </Grid>
                                        {branch.conditions.map((cond: BranchCondition, condIndex) => (
                                            <Grid key={cond.id} mt="xs" grow>
                                                <Grid.Col span={4}>
                                                    <Select
                                                        placeholder="Chèn tài nguyên hoặc biến"
                                                        data={[
                                                            { value: "user", label: "Người dùng" },
                                                            { value: "role", label: "Vai trò" },
                                                        ]}
                                                        value={cond.resource || ""}
                                                        onChange={(val) => updateBranches(branchIndex, condIndex, "resource", val || "")}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={4}>
                                                    <Select
                                                        placeholder="Chọn điều kiện"
                                                        data={[
                                                            { value: "eq", label: "=" },
                                                            { value: "neq", label: "≠" },
                                                        ]}
                                                        value={cond.operator || ""}
                                                        onChange={(val) => updateBranches(branchIndex, condIndex, "operator", val || "")}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={3}>
                                                    <TextInput
                                                        placeholder="Chọn giá trị"
                                                        {...form.getInputProps(
                                                            `branches.${branchIndex}.conditions.${condIndex}.value`
                                                        )}
                                                    />
                                                </Grid.Col>
                                                <Grid.Col span={1}>
                                                    <ActionIcon
                                                        color="red"
                                                        onClick={() =>
                                                            form.removeListItem(
                                                                `branches.${branchIndex}.conditions`,
                                                                condIndex
                                                            )
                                                        }
                                                    >
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Grid.Col>
                                            </Grid>
                                        ))}
                                    </div>
                                }

                                <Button
                                    mt="sm"
                                    variant="light"
                                    leftSection={<IconPlus size={16} />}
                                    onClick={() =>
                                        form.insertListItem(`branches.${branchIndex}.conditions`, {
                                            id: crypto.randomUUID(),
                                            resource: "",
                                            operator: "",
                                            value: "",
                                        })
                                    }
                                >
                                    Thêm điều kiện
                                </Button>
                            </Box>
                        </Card>
                    ))}
                    <Button
                        variant="light"
                        className='my-[20px]'
                        color="gray"
                        radius="md"
                        leftSection={<IconPlus size={16} />}
                        mb="md"
                        onClick={addBranch}
                    >
                        Thêm nhánh
                    </Button>
                    <br />
                    {form.values.barnchsDefault.map((dataItem: any, index) => (
                        <div key={index} className='mt-[20px]'>
                            <div className='rounded-[6px] border-[1px] border-[#ecebf0] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] overflow-hidden '>
                                <div className='px-4 py-3 bg-[#F9F9FC] border-b-[1px] border-b-[#ecebf0] text-sm font-semibold'>
                                    Nhánh mặc định
                                </div>
                                <div className='py-[14px] px-4 flex flex-col gap-[14px]'>
                                    <div className='relative px-[10px] prose-body2 text-typo-primary before:content-[&quot;&quot;] before:absolute before:top-1/2 before:left-0 before:-translate-y-1/2 before:w-[3px] before:h-[16px] before:bg-[#673ab7] before:rounded-full text-sm'>
                                        Nhánh mặc định đảm bảo luồng công việc tiếp tục khi không có nhánh nào khác đáp ứng được tập điều kiện đã đặt ra.
                                    </div>

                                    <Stack gap="md">
                                        <div>
                                            <Text fw={600} mb={6}>
                                                Đích
                                            </Text>

                                            {/* <Select
                                                data={[
                                                    { value: 'end', label: 'End' },
                                                    { value: 'task-1', label: 'Task 1' },
                                                    { value: 'task-2', label: 'Task 2' },
                                                ]}

                                                value={data.destination || ""}
                                                onChange={(val) =>
                                                    form.setFieldValue(
                                                        `barnchsDefault.${index}.destination`,
                                                        val || ""
                                                    )
                                                }
                                            /> */}

                                            <Popover>
                                                <Popover.Target>
                                                    <TextInput
                                                        flex={1}
                                                        placeholder="Chọn trường"
                                                        value={
                                                            data.find((o) => o.id === dataItem.destination)?.name || ""
                                                        }
                                                        onClick={(e) => {
                                                            const target = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-popover-target]");
                                                            if (target) (target as HTMLElement).click();

                                                        }}
                                                        readOnly
                                                    />
                                                </Popover.Target>
                                                <Popover.Dropdown>
                                                    <Stack gap="xs">
                                                        {data.map((option) => (
                                                            <Button
                                                                key={option.id}
                                                                variant={option.id === dataItem.destination ? "light" : "transparent"}
                                                                fullWidth
                                                                onClick={() =>
                                                                    form.setFieldValue(
                                                                        `barnchsDefault.${index}.destination`,
                                                                        option.id || ""
                                                                    )
                                                                }
                                                            >
                                                                {option.name}
                                                            </Button>
                                                        ))}
                                                    </Stack>
                                                </Popover.Dropdown>
                                            </Popover>
                                        </div>

                                        <div>
                                            <Text fw={600} mb={6}>
                                                Tên
                                            </Text>
                                            <TextInput
                                                placeholder="Mặc định"
                                                radius="md"
                                                {...form.getInputProps(`barnchsDefault.${index}.nameBranch`)}
                                            />
                                        </div>
                                    </Stack>
                                </div>
                            </div>
                        </div>
                    ))}
                </Box>}

                <button type="submit" hidden />
            </form>
        </Box>
    );
});


ExclusiveGatewayForm.displayName = "ExclusiveGatewayForm";
export default ExclusiveGatewayForm;

