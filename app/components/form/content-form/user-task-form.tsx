"use client";

import { forwardRef, use, useEffect, useImperativeHandle, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    Group,
    Button, ActionIcon, Card, MultiSelect, Checkbox, NumberInput,
    Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
// ‼️ import tiptap styles after core package styles
import '@mantine/tiptap/styles.css';
import {
    IconPlus, IconTrash, IconAdjustments
} from "@tabler/icons-react";
import { DateTimePicker } from "@mantine/dates";
import ModalUserTask from "./modals/user-task-modal";

const UserTaskForm = forwardRef<childProps, ChildFormProps>(({ data, onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;
    const [opened, setOpened] = useState(false);

    useImperativeHandle(ref, () => ({
        onSubmit: () => {
            const { hasErrors } = form.validate();
            if (!hasErrors) {
                onSubmit(form.values);
            }
        },
    }));

    const initData = () => {
        if (data) {
            form.setValues(data.info);
        }
    }

    useEffect(() => {
        initData();
    }, [data]);


    const form = useForm({
        initialValues: {
            name: "",
            slug: "",
            description: "",
            emailSubject: "",
            conditionSet: [
                {
                    id: crypto.randomUUID(),
                    conditions: [
                        {
                            id: crypto.randomUUID(),
                            type: "",
                            condition: "",
                            value: [] as string[],
                        },
                    ],
                },
            ],
            allowOfTheRun: false,
            allowOtherSteps: false,
            processingDeadline: false,
            typeTime: "RT",
            day: 1,
            hours: 0,
            minutes: 0,
            accordingToBusinessFays: false,
            remineBeforeDeadline: false,
            deadline: "",
            accordingTheBusinessDay: false,
            followingField: []
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            slug: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,


        },
    });

    const FieldsConditionSet = () => form.values.conditionSet.map((group, groupIndex) => (
        <Box key={group.id} mb="lg">
            <Card withBorder p="md">
                <Group>
                    <Text fw={600} flex={1}>
                        Loại điều kiện
                    </Text>
                    <Text fw={600} flex={1}>
                        Điều kiện
                    </Text>
                    <Text fw={600} flex={1}>
                        Giá trị
                    </Text>
                    <Text className="w-[18px]"></Text>
                </Group>

                {group.conditions.map((cond: any, condIndex: number) => (
                    <Group key={cond.id} mt="xs">
                        {/* Loại điều kiện */}
                        <Select
                            flex={1}
                            placeholder="Chọn loại điều kiện"
                            data={[
                                { value: "human", label: "Nhân sự" },
                                { value: "job", label: "Vị trí công việc" },
                            ]}
                            value={cond.type}
                            onChange={(val) =>
                                form.setFieldValue(
                                    `conditionSet.${groupIndex}.conditions.${condIndex}.type`,
                                    val || ""
                                )
                            }
                        />

                        {/* Điều kiện */}
                        <Select
                            flex={1}
                            placeholder="Chọn điều kiện"
                            disabled={!cond.type}
                            data={
                                cond.type === "human"
                                    ? [
                                        { value: "all", label: "Tất cả nhân sự" },
                                        { value: "single", label: "Nhân sự cụ thể" },
                                    ]
                                    : [
                                        { value: "any", label: "Nhân sự giữ bất kỳ vị trí" },
                                        { value: "specific", label: "Nhân sự giữ vị trí cụ thể" },
                                    ]
                            }
                            value={cond.condition}
                            onChange={(val) =>
                                form.setFieldValue(
                                    `conditionSet.${groupIndex}.conditions.${condIndex}.condition`,
                                    val || ""
                                )
                            }
                        />

                        {/* Giá trị */}
                        <MultiSelect
                            flex={1}
                            placeholder="Chọn giá trị"
                            disabled={!cond.condition}
                            data={[
                                { value: "cfo", label: "CFO" },
                                { value: "coo", label: "COO" },
                                { value: "cto", label: "CTO" },
                            ]}
                            value={cond.value}
                            onChange={(val: string[]) =>
                                form.setFieldValue(
                                    `conditionSet.${groupIndex}.conditions.${condIndex}.value`,
                                    val
                                )
                            }
                        />

                        {/* Xóa điều kiện */}
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => {
                                if (group.conditions.length === 1) {
                                    form.removeListItem(
                                        `conditionSet`,
                                        groupIndex
                                    );
                                    return
                                }
                                form.removeListItem(
                                    `conditionSet.${groupIndex}.conditions`,
                                    condIndex
                                )
                            }}
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                ))}

                {/* Thêm điều kiện */}
                <Button
                    mt="md"
                    variant="light"
                    leftSection={<IconPlus size={16} />}
                    onClick={() =>
                        form.insertListItem(`conditionSet.${groupIndex}.conditions`, {
                            id: crypto.randomUUID(),
                            type: "",
                            condition: "",
                            value: [],
                        })
                    }
                >
                    Thêm điều kiện
                </Button>
            </Card>

            {/* OR divider */}
            {groupIndex < form.values.conditionSet.length - 1 && (
                <Divider
                    label="OR"
                    labelPosition="center"
                    my="sm"
                    variant="dashed"
                />
            )}
        </Box>
    ));



    return (
        <Box mx="auto">
            <form>
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
                {/*Slug*/}
                <TextInput
                    required
                    label="Slug"
                    placeholder="Nhập..."
                    mt="sm"
                    {...form.getInputProps('slug')}
                />
                {/*Description*/}
                <Textarea
                    label="Mô tả"
                    rows={3}
                    placeholder="Nhập mô tả..."
                    mt="sm"
                    {...form.getInputProps('description')}
                />
                <Divider my="sm" />
                <span className={'font-bold '}>Nhân sự được phân công</span>
                <FieldsConditionSet></FieldsConditionSet>
                <Group mt="md">
                    <Button
                        mt="xs"
                        onClick={() =>
                            form.insertListItem(`conditionSet`, {
                                id: crypto.randomUUID(),
                                conditions: [
                                    {
                                        id: crypto.randomUUID(),
                                        type: "",
                                        condition: "",
                                        value: [],
                                    },
                                ],
                            })
                        }
                    > <IconPlus /> Thêm mới nhóm điều kiện</Button>
                </Group>

                {/*allowOfTheRun*/}
                <Checkbox
                    label={'Cho phép người thực hiện bước này xem tiến trình chạy'}
                    mt="sm"
                    {...form.getInputProps('allowOfTheRun')}
                >
                </Checkbox>

                {/*allowOtherSteps*/}
                <Checkbox
                    label={'Cho phép người thực hiện bước này xem tiến trình chạy'}
                    mt="sm"
                    {...form.getInputProps('allowOtherSteps')}
                >
                </Checkbox>

                {/*processingDeadline*/}
                <Checkbox
                    label={'Thời hạn xử lý'}
                    mt="sm"
                    {...form.getInputProps('processingDeadline')}
                >
                </Checkbox>

                {form.values.processingDeadline &&
                    <>

                        <Card withBorder mt={"sm"} p="md">
                            <Select
                                placeholder="Chọn điều kiện"
                                data={[
                                    { value: "AT", label: "Thời gian tuyệt đối" },
                                    { value: "RT", label: "Thời gian tương đối" },
                                    { value: "TTPS", label: "Thời gian của bước quy trình" },
                                ]}
                                {...form.getInputProps("typeTime")}
                            />

                            {/* AT */}
                            {form.values.typeTime == "AT" &&
                                <>
                                    <DateTimePicker
                                        mt="sm"
                                        label={"Nhiệm vụ có thời hạn xử lý trước"}
                                    />

                                </>
                            }

                            {/* RT */}
                            {form.values.typeTime == "RT" &&
                                <>
                                    <span className={'mt-3 mb-1'}> Từ thời điểm nhận được, nhiệm vụ có thời gian xử lý tối đa </span>
                                    {/*Ngày*/}
                                    <Group>
                                        <NumberInput
                                            min={0}
                                            label={"Ngày"}
                                            {...form.getInputProps("day")}
                                            flex={1}
                                        />
                                        {/*Giờ*/}
                                        <NumberInput
                                            min={0}
                                            max={23}
                                            label={"Giờ"}
                                            {...form.getInputProps("hours")}
                                            flex={1}
                                        />
                                        {/*phút*/}
                                        <NumberInput
                                            min={0}
                                            label={"Phút"}
                                            max={59}
                                            {...form.getInputProps("minutes")}
                                            flex={1}
                                        />
                                    </Group>

                                    {/*processingDeadline*/}
                                    <Checkbox
                                        label={'Theo ngày làm việc'}
                                        mt="sm"
                                        {...form.getInputProps('accordingTheBusinessDay')}
                                    >
                                    </Checkbox>
                                </>
                            }
                            {/* TTPS */}
                            {form.values.typeTime == "TTPS" &&
                                <>
                                    <MultiSelect
                                        label={"Có thời hạn xử lý trước thời gian được chọn trong trường sau"}
                                        mt={"sm"}
                                        placeholder="Chọn giá trị"
                                        data={[
                                            { value: "cfo", label: "CFO" },
                                            { value: "coo", label: "COO" },
                                            { value: "cto", label: "CTO" },
                                        ]}
                                        {...form.getInputProps('followingField')}
                                    />
                                </>
                            }



                        </Card>
                        {/*remineBeforeDeadline*/}
                        <Checkbox
                            label={'Nhắc lại trước thời hạn'}
                            mt="sm"
                            {...form.getInputProps('remineBeforeDeadline')}
                        >
                        </Checkbox>
                    </>
                }

                <Button
                    onClick={() => setOpened(true)}
                    className="mt-[20px]"
                    leftSection={<IconAdjustments size={18} stroke={2.2} />}
                    variant="subtle"
                    color="indigo"
                    radius="md"
                    styles={{
                        root: {
                            fontWeight: 500,
                            fontSize: "14px",
                        },
                    }}
                >
                    Thiết lập biểu mẫu nhập liệu
                </Button>
                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    fullScreen
                    withCloseButton={false}
                    radius="md"
                    padding={0}
                >
                    {/* Header */}
                    <Box 
                        style={{
                            height: "100vh",
                            width: "100vw",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: 0
                        }}
                    >
                        <Box
                            px="lg"
                            py="sm"
                            style={{
                                borderBottom: "1px solid #e9ecef",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                                height: "60px",
                                flex: 'none'
                            }}
                        >
                            <Text fw={600} size="lg">
                                Thiết lập biểu mẫu
                            </Text>
                        </Box>
    
                        {/* content */}
                        <ModalUserTask />
    
                        {/* Footer */}
                        <Box
                            px="lg"
                            py="sm"
                            style={{
                                borderTop: "1px solid #e9ecef",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "8px",
                                width: "100%",
                                height: "60px",
                                flex: 'none'
                            }}
                        >
                            <Button variant="default" onClick={() => setOpened(false)}>
                                Hủy
                            </Button>
                            <Button variant="outline">Xem trước</Button>
                            <Button>Hoàn thành</Button>
                        </Box>
                    </Box>
                </Modal>
            </form>
        </Box>
    );
});


UserTaskForm.displayName = "UserTaskForm";
export default UserTaskForm;
