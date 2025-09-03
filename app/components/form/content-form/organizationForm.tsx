"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    TagsInput,
    FileInput,
    Group, Radio, ActionIcon, Card,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import {IconFileZip, IconTrash} from "@tabler/icons-react";
import {useFormList} from "@/node_modules/@mantine/form/lib/hooks/use-form-list/use-form-list";
import { randomId } from '@mantine/hooks';

const OrganizationForm = forwardRef<childProps, ChildFormProps>(({ onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;
    const icon = <IconFileZip size={18} stroke={1.5} />;
    const [name, setName] = useState("");
    const [audiContent, setAudiContent] = useState("1");
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
            saveRetrievedDataItem:[{ type: '', variable: "", key: randomId() }],
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            slug: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,


        },
    });

    const fieldsConditionSet = form.values.conditionSet.map((set, index) => (
        <Card
            shadow="sm"
            key={set.key}
            padding="xl"
            component="a">
            {
                set.condition.map((item, idx)=>{
                    return  <Group key={item.key} mt="xs">
                        <Select
                            required
                            placeholder="Chọn..."
                            mt="xs"

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
                            disabled={!item.conditionType}
                            data={[
                                { value: "1", label: 'Condition A' },
                                { value: "2", label: 'Condition B' },
                            ]}
                            {...form.getInputProps(`conditionSet.${index}.condition.${idx}.value`)}                            
                        />

                        <ActionIcon
                            color="red"
                            variant="hover"
                            onClick={() => form.removeListItem(`conditionSet.${index}.condition`, idx)}
                        >
                            <IconTrash size={16} />
                        </ActionIcon>
                    </Group>
                })
            }

        </Card>






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

            </form>
        </Box>
    );
});


OrganizationForm.displayName = "OrganizationForm";
export default OrganizationForm;
