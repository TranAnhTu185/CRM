"use client";

import { forwardRef, use, useCallback, useEffect, useImperativeHandle, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    Group, Radio, ActionIcon, Card, Button, CloseIcon, Stack,
    MultiSelect,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { randomId } from '@mantine/hooks';

export const dynamic = "force-dynamic";


type Mapping = {
    id: string;
    field: string;
    variable: string;
};

const OrganizationForm = forwardRef<childProps, ChildFormProps>(({ data, onSubmit }, ref) => {
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

        console.log(data);
        if (data && data.info) {
            form.setValues({
                name: data.info.name,
                slug: data.info.slug,
                description: data.info.description,
                outputDataType: data.info.outputDataType,
                conditionSet: data.info.conditionSet,
                saveRetrievedData: data.info.saveRetrievedData,
                saveRetrievedDataItem: data.info.saveRetrievedDataItem,
                saveItem: data.info.saveItem,
            });
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
            outputDataType: "",
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
            saveRetrievedData: "",
            saveRetrievedDataItem: [{ field: '1', variable: "", key: randomId() }],
            saveItem: [
                { id: crypto.randomUUID(), field: "", variable: "" },
            ] as Mapping[],
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            slug: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,


        },
    });


    const updateCondition = (
        groupIndex: number,
        condIndex: number,
        field: string,
        value: any
    ) => { 
        const dataConditionSet = form.values.conditionSet[groupIndex];
        const dataItem = dataConditionSet.conditions[condIndex];
        dataItem[field] = value;
        form.setFieldValue(`conditionSet.${groupIndex}`, dataConditionSet);
    };

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
                            value={cond.type || ""}
                            onChange={(val) => updateCondition(groupIndex, condIndex, "type", val || "")}
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
                            value={cond.condition || ""}
                            onChange={(val) => updateCondition(groupIndex, condIndex, "condition", val || "")}
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
                            value={cond.value || []}
                            onChange={(val: string[]) => updateCondition(groupIndex, condIndex, "value", val || [])}
                        />

                        {/* Xóa điều kiện */}
                        <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() =>
                                form.removeListItem(
                                    `conditionSet.${groupIndex}.conditions`,
                                    condIndex
                                )
                            }
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


    const FieldSave = () => form.values.saveItem.map((map, index) => (
        <Group key={map.id} align="center" className="mt-[20px] mb-[20px]">
            {/* Select field */}
            <Select
                placeholder="Chọn trường"
                flex={1}
                data={[
                    { value: "name", label: "Tên" },
                    { value: "email", label: "Email" },
                    { value: "phone", label: "Số điện thoại" },
                ]}
                value={map.field || ""}
                onChange={(val) =>
                    form.setFieldValue(`saveItem.${index}.field`, val || "")
                }
            />

            {/* Select variable */}
            <Select
                placeholder="Chọn biến"
                flex={1}
                data={[
                    { value: "var1", label: "Biến 1" },
                    { value: "var2", label: "Biến 2" },
                    { value: "var3", label: "Biến 3" },
                ]}
                value={map.variable || ""}
                onChange={(val) =>
                    form.setFieldValue(`saveItem.${index}.variable`, val || "")
                }
            />

            {/* Nút insert variable (chỉ demo icon) */}
            <ActionIcon variant="subtle" color="blue">
                {"{ }"}
            </ActionIcon>

            {/* Xóa dòng */}
            <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => form.removeListItem("saveItem", index)}
            >
                <IconTrash size={16} />
            </ActionIcon>
        </Group>
    ))

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
                <span className={'font-bold'}>Kiểu dữ liệu đầu ra</span>
                <Select
                    className="mt-[20px] mb-[20px]"
                    required
                    placeholder="Chọn người gọi..."
                    mt="sm"
                    data={[
                        { value: "1", label: 'A' },
                        { value: "2", label: 'B' },
                    ]}
                    {...form.getInputProps('outputDataType')}
                />
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


                <Radio.Group
                    mt="sm"
                    label="Lưu dữ liệu đã truy xuất"
                    {...form.getInputProps('saveRetrievedData')}

                >
                    <Radio value="1" label="Lưu trữ một trường từ bản ghi đầu tiên" />
                    <Radio value="2" label="Lưu trữ một trường từ danh sách " />
                </Radio.Group>

                <FieldSave />
                <Group mt="md">
                    <Button
                        mt="xs"
                        onClick={() =>
                            form.insertListItem(`saveItem`, {
                                id: crypto.randomUUID(),
                                field: "",
                                variable: "",
                            })
                        }
                    > <IconPlus /> Thêm mới</Button>
                </Group>


            </form>
        </Box>
    );
});


OrganizationForm.displayName = "OrganizationForm";
export default OrganizationForm;
