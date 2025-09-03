"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    Group, Radio, ActionIcon, Card,  Button, CloseIcon, Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { IconPlus, IconTrash} from "@tabler/icons-react";
import { randomId } from '@mantine/hooks';

const OrganizationForm = forwardRef<childProps, ChildFormProps>(({ onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;
    const [name, setName] = useState("");
    useImperativeHandle(ref, () => ({
        onSubmit: () => {
            if (form.isValid()) {
                onSubmit(form.values);
            }
        },
    }));


    const form = useForm({
        initialValues: {
            name: "",
            slug: "",
            description: "",
            outputDataType:"",
            conditionSet:[{ condition: [{ conditionType: '', condition: "", value: "", key: randomId() }], key: randomId() }],
            saveRetrievedData:"",
            saveRetrievedDataItem:[{ field: '1', variable: "", key: randomId() }],
            saveItem:[{ field: '1', variable: "", key: randomId() }],
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            slug: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,


        },
    });

    const FieldsConditionSet =()=> form.values.conditionSet.map((set, index) => (

        <Card
            withBorder={true}
            mt="md"
            key={set.key}
            padding="md"
            component="a">
            <Group  mt="xs">
                <Text className={'font-bold'}  flex={1} >Loại điều kiện</Text>
                <Text  flex={1} className={'font-bold'}>Điều kiện</Text>
                <Text  flex={1} className={'font-bold'}>Giá trị</Text>
                <Text   className={'w-[18px]'}></Text>
                <ActionIcon
                    bg="red"
                    mt="xs"
                    hidden={index === 0}
                    variant="hover"
                    onClick={() => form.removeListItem(`conditionSet`, index)}
                >
                    <CloseIcon size={"16"} />
                </ActionIcon>
            </Group>

            {
                set.condition.map((item, idx)=>{
                    return    <Group key={item.key} mt="xs">
                        <Select
                            required
                            placeholder="Chọn..."
                            mt="xs"
                            flex={1}
                            data={[
                                { value: "1", label: ' A' },
                                { value: "2", label: 'Condition B' },
                            ]}
                            {...form.getInputProps(`conditionSet.${index}.condition.${idx}.conditionType`)}
                        />

                        <Select
                            required
                            placeholder="Chọn..."
                            mt="xs"
                            disabled={!item.conditionType}
                            flex={1}
                            data={[
                                { value: "1", label: 'Condition A' },
                                { value: "2", label: 'Condition B' },
                            ]}
                            {...form.getInputProps(`conditionSet.${index}.condition.${idx}.condition`)}
                        />

                        <Select
                            required
                            placeholder="Chọn..."
                            mt="xs"
                            disabled={!item.condition}
                            flex={1}
                            data={[
                                { value: "1", label: 'Value A' },
                                { value: "2", label: 'Value B' },
                            ]}
                            {...form.getInputProps(`conditionSet.${index}.condition.${idx}.value`)}
                        />

                        <ActionIcon
                            hidden = {set.condition.length === 1}
                            bg="red"
                            mt="xs"
                            variant="hover"
                            onClick={() => form.removeListItem(`conditionSet.${index}.condition`, idx)}
                        >
                            <IconTrash  size={16} />
                        </ActionIcon>

                    </Group>
                })

            }
            <Group mt="md">
                <Button
                    mt="xs"
                    onClick={() =>
                        form.insertListItem(`conditionSet.${index}.condition`, { conditionType: '', condition: "", value: "", key: randomId() })
                    }
                > <IconPlus/> Thêm mới điều kiện</Button>
            </Group>
        </Card>


    ));


    const FieldSave =()=> form.values.saveItem.map((item, index) =>{

        return (  <Group key={item.key} mt="xs">
                <Select
                    required
                    placeholder="Chọn..."
                    mt="xs"
                    flex={1}
                    data={[
                        { value: "1", label: 'Value A' },
                        { value: "2", label: 'Value B' },
                    ]}
                    {...form.getInputProps(`saveItem.${index}.field`)}
                />


                <Select
                    required
                    placeholder="Chọn giá trị..."
                    mt="xs"
                    flex={1}
                    data={[
                        { value: "1", label: 'Value A' },
                        { value: "2", label: 'Value B' },
                    ]}
                    {...form.getInputProps(`saveItem.${index}.variable`)}
                />

                <ActionIcon
                    hidden = { form.values.saveItem.length === 1}
                    bg="red"
                    mt="xs"
                    variant="hover"
                    onClick={() => form.removeListItem(`saveItem`, index)}
                >
                    <IconTrash  size={16} />
                </ActionIcon>

            </Group>

        )})

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
                    value={name}
                    onChange={(e) => {
                        setName(e.currentTarget.value);
                        form.setFieldValue("name", e.currentTarget.value);
                    }}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            {name.length}/{maxNameLength}
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
                <span className={'font-bold'}>Kiểu dữ liệu</span>
                <Select
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
                <Group  mt="md">
                    <Button
                        mt="xs"
                        onClick={() =>
                            form.insertListItem(`conditionSet`, { condition: [{ conditionType: '', condition: "", value: "", key: randomId() }], key: randomId() })
                        }
                    > <IconPlus/> Thêm mới nhóm điều kiện</Button>
                </Group>


                <Radio.Group
                    mt="sm"
                    label="Lưu dữ liệu đã truy xuất"
                    {...form.getInputProps('saveRetrievedData')}

                >
                    <Radio value="1" label="Lưu trữ một trường từ bản ghi đầu tiên" />
                    <Radio value="2" label="Lưu trữ một trường từ danh sách " />
                </Radio.Group>

                <FieldSave/>
                <Group  mt="md">
                    <Button
                        mt="xs"
                        onClick={() =>
                            form.insertListItem(`saveItem`,{ type: '', variable: "", key: randomId() })
                        }
                    > <IconPlus/> Thêm mới</Button>
                </Group>


            </form>
        </Box>
    );
});


OrganizationForm.displayName = "OrganizationForm";
export default OrganizationForm;
