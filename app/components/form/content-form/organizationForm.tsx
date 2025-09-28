"use client";

import { forwardRef, use, useCallback, useEffect, useImperativeHandle, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    Group, Radio, ActionIcon, Card, Button,
    MultiSelect,
    useCombobox,
    Combobox,
    ComboboxTarget,
    Input,
    ComboboxDropdown,
    ComboboxOption,
    Popover,
    Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { randomId, useListState } from '@mantine/hooks';

export const dynamic = "force-dynamic";


type Mapping = {
    id: string;
    field: string;
    variable: string;
};

interface contentConditionSet {
    id: string,
    conditions: contentCondition[]
}

interface contentCondition {
    id: string,
    type: string,
    condition: string,
    value: string[],
}


const typeOptions = [
    { value: "human", label: "Nhân sự" },
    { value: "job", label: "Vị trí công việc" },
];

const conditionOptions: Record<string, { value: string; label: string }[]> = {
    human: [
        { value: "all", label: "Tất cả nhân sự" },
        { value: "single", label: "Nhân sự cụ thể" },
    ],
    job: [
        { value: "any", label: "Nhân sự giữ bất kỳ vị trí" },
        { value: "specific", label: "Nhân sự giữ vị trí cụ thể" },
    ],
};

const OrganizationForm = forwardRef<childProps, ChildFormProps>(({ dataItem, onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;

    const [valuesConditionSet, handlerConditionSet] = useListState<contentConditionSet>(dataItem?.info?.conditionSet || [{
        id: randomId(),
        conditions: [
            {
                id: randomId(),
                type: "",
                condition: "",
                value: [] as string[],
            },
        ],
    }])
    const [valueSaveItem, handlerSaveItem] = useListState<Mapping>(dataItem?.info?.saveItem || [
        { id: randomId(), field: "", variable: "" },
    ])


    useImperativeHandle(ref, () => ({
        onSubmit: () => {
            const { hasErrors } = form.validate();
            if (!hasErrors) {
                const data = { ...form.values, conditionSet: valuesConditionSet, saveItem: valueSaveItem };
                onSubmit(data);
            }
        },
    }));

    const initData = () => {
        if (dataItem && dataItem.info) {
            form.setValues({
                name: dataItem.info.name,
                slug: dataItem.info.slug,
                description: dataItem.info.description,
                outputDataType: dataItem.info.outputDataType,
                saveRetrievedData: dataItem.info.saveRetrievedData,
            });
        }
    }

    useEffect(() => {
        initData();
    }, [dataItem]);


    const form = useForm({
        initialValues: {
            name: "",
            slug: "",
            description: "",
            outputDataType: "",
            saveRetrievedData: "",
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
        const updatedOptions = valuesConditionSet[groupIndex].conditions.map((opt, i) =>
            i === condIndex ? { ...opt, [field]: value } : opt
        );
        handlerConditionSet.setItemProp(groupIndex, "conditions", updatedOptions);
        // form.setFieldValue(`conditionSet.${groupIndex}`, dataConditionSet);
    };

    const OptionConditions = [
        { value: "name", label: "Tên" },
        { value: "email", label: "Email" },
        { value: "phone", label: "Số điện thoại" },
    ];
    const optionsCondition = OptionConditions.map((item) => (
        <Combobox.Option value={item.value} key={item.value}>
            {item.label}
        </Combobox.Option>
    ));

    const FieldsConditionSet = () => valuesConditionSet.map((group, groupIndex) => (
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
                        {/* TYPE select */}
                        <Popover>
                            <Popover.Target>
                                <TextInput
                                    flex={1}
                                    placeholder="Chọn loại điều kiện"
                                    value={
                                        typeOptions.find((o) => o.value === cond.type)?.label || ""
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
                                    {typeOptions.map((option) => (
                                        <Button
                                            key={option.value}
                                            variant={option.value === cond.type ? "light" : "transparent"}
                                            fullWidth
                                            onClick={() =>
                                                updateCondition(groupIndex, condIndex, "type", option.value || "")
                                            }
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </Stack>
                            </Popover.Dropdown>
                        </Popover>

                        {/* CONDITION select */}
                        <Popover disabled={!cond.type}>
                            <Popover.Target>
                                <TextInput
                                    flex={1}
                                    placeholder="Chọn điều kiện"
                                    value={
                                        conditionOptions[cond.type]?.find(
                                            (o) => o.value === cond.condition
                                        )?.label || ""
                                    }
                                    readOnly
                                    disabled={!cond.type}
                                    onClick={(e) => {
                                        const target = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-popover-target]");
                                        if (target) (target as HTMLElement).click();

                                    }}
                                />
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Stack gap="xs">
                                    {conditionOptions[cond.type]?.map((option) => (
                                        <Button
                                            key={option.value}
                                            variant={
                                                option.value === cond.condition ? "light" : "transparent"
                                            }
                                            fullWidth
                                            onClick={() =>
                                                updateCondition(groupIndex, condIndex, "condition", option.value || "")
                                            }
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </Stack>
                            </Popover.Dropdown>
                        </Popover>

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
                    onClick={() => {
                        handlerConditionSet.setItemProp(groupIndex, "conditions", [
                            ...valuesConditionSet[groupIndex].conditions,
                            {
                                id: randomId(),
                                type: "",
                                condition: "",
                                value: [] as string[],
                            },
                        ]);
                    }}
                >
                    Thêm điều kiện
                </Button>
            </Card>

            {/* OR divider */}
            {
                groupIndex < valuesConditionSet.length - 1 && (
                    <Divider
                        label="OR"
                        labelPosition="center"
                        my="sm"
                        variant="dashed"
                    />
                )
            }
        </Box>
    ));

    const filteredOptions = [
        { value: "name", label: "Tên" },
        { value: "email", label: "Email" },
        { value: "phone", label: "Số điện thoại" },
    ];

    const filteredOptions2 = [
        { value: "var1", label: "Biến 1" },
        { value: "var2", label: "Biến 2" },
        { value: "var3", label: "Biến 3" },
    ]
    const options = filteredOptions.map((item) => (
        <Combobox.Option value={item.value} key={item.value}>
            {item.label}
        </Combobox.Option>
    ));

    const options2 = filteredOptions2.map((item) => (
        <Combobox.Option value={item.value} key={item.value}>
            {item.label}
        </Combobox.Option>
    ));


    const FieldSave = () => valueSaveItem.map((map, index) => (
        <Group key={map.id} align="center" className="mt-[20px] mb-[20px]">
            {/* Select field */}
            <Popover>
                <Popover.Target>
                    <TextInput
                        flex={1}
                        placeholder="Chọn trường"
                        value={
                            filteredOptions.find((o) => o.value === map.field)?.label || ""
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
                        {filteredOptions.map((option) => (
                            <Button
                                key={option.value}
                                variant={option.value === map.field ? "light" : "transparent"}
                                fullWidth
                                onClick={() =>
                                     handlerSaveItem.setItemProp(index, "field", option.value || " ")
                                }
                            >
                                {option.label}
                            </Button>
                        ))}
                    </Stack>
                </Popover.Dropdown>
            </Popover>

            {/* Select variable */}
            <Popover>
                <Popover.Target>
                    <TextInput
                        flex={1}
                        placeholder="Chọn biến"
                        value={
                            filteredOptions2.find(
                                (o) => o.value === map.variable
                            )?.label || ""
                        }
                        readOnly
                        onClick={(e) => {
                            const target = (e.currentTarget as HTMLElement).closest<HTMLElement>("[data-popover-target]");
                            if (target) (target as HTMLElement).click();

                        }}
                    />
                </Popover.Target>
                <Popover.Dropdown>
                    <Stack gap="xs">
                        {filteredOptions2.map((option) => (
                            <Button
                                key={option.value}
                                variant={
                                    option.value === map.variable ? "light" : "transparent"
                                }
                                fullWidth
                                onClick={() =>
                                    handlerSaveItem.setItemProp(index, "variable", option.value || " ")
                                }
                            >
                                {option.label}
                            </Button>
                        ))}
                    </Stack>
                </Popover.Dropdown>
            </Popover>

            {/* Nút insert variable (chỉ demo icon) */}
            <ActionIcon variant="subtle" color="blue">
                {"{ }"}
            </ActionIcon>

            {/* Xóa dòng */}
            <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => handlerSaveItem.remove(index, 1)}
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
                            handlerConditionSet.append({
                                id: randomId(),
                                conditions: [
                                    {
                                        id: randomId(),
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
                    <Radio value="1" label="Lưu trữ một trường từ bản ghi đầu tiên" mt="sm" mb="sm" />
                    <Radio value="2" label="Lưu trữ một trường từ danh sách " />
                </Radio.Group>

                <FieldSave />
                <Group mt="md">
                    <Button
                        mb="xs"
                        onClick={() =>
                            handlerSaveItem.append({
                                id: randomId(),
                                field: "",
                                variable: "",
                            })}
                    > <IconPlus /> Thêm mới</Button>
                </Group>


            </form>
        </Box>
    );
});


OrganizationForm.displayName = "OrganizationForm";
export default OrganizationForm;
