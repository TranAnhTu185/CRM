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
    Group, Radio,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import {IconFileZip} from "@tabler/icons-react";

const PhoneCallForm = forwardRef<childProps, ChildFormProps>(({ onSubmit }, ref) => {
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
            emailSubject: "",
            audiContent:"1",
            from: "",
            to: [],
            scriptContentType:"",
            scriptContent:"",
            file: "",


            direction: "asc", // asc: từ đầu đến cuối, desc: từ cuối đến đầu
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            slug: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            from: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            emailSubject: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,

        },
    });
   form.watch("audiContent", ({ previousValue, value})=>{

       form.setFieldValue('scriptContentType', "")
       form.setFieldValue('scriptContent', "")
       form.setFieldValue('file', "")
       setAudiContent(value);
    })

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
                <span className={'font-bold'}>Thiết lập cuộc gọi</span>

                {/*Người gửi*/}
                <Select
                    required
                    label="Người gọi"
                    placeholder="Chọn người gọi..."
                    mt="sm"
                    data={[
                        { value: "1", label: 'Ông A' },
                        { value: "2", label: 'Bà B' },
                    ]}
                    {...form.getInputProps('from')}
                />
                {/*Người nhận*/}
                <TagsInput
                    required
                    label="Tới"
                    placeholder="Nhập người nhận cuộc gọi..."
                    maxTags={3}
                    defaultValue={[]}
                    mt="sm"
                    {...form.getInputProps('to')}/>
                {/*audioContent*/}

                <Radio.Group
                    required
                    label="Tới"
                    defaultValue={'1'}
                    mt="sm"
                    {...form.getInputProps('audiContent')}
                >
                    <Group mt="xs">
                        <Radio value="1" label="Sử dụng bản ghi âm" />
                        <Radio value="2" label="Sử dụng kịch bản" />
                    </Group>
                </Radio.Group>

                {/*file*/}
                { audiContent =="1"&&
                    <FileInput
                        required
                        leftSection={icon}
                        label="Tệp đính kèm"
                        placeholder="Chọn tệp đính kèm"
                        leftSectionPointerEvents="none"
                        {...form.getInputProps('file')}
                        mt="sm"
                    />
                }

                { audiContent =="2"&&
                    <>
                        <Select
                            required
                            label="Kịch bản"
                            placeholder="Chọn..."
                            mt="sm"
                            data={[
                                { value: "1", label: 'Kịch bản 1' },
                                { value: "2", label: 'Kịch bản 2' },
                                { value: "3", label: 'Kịch bản 3' },
                            ]}
                            {...form.getInputProps('scriptContentType')}
                        />
                        <Textarea
                            required
                            label="Kịch bản"
                            placeholder="Nhập nội dung"
                            rows={5}
                            mt="sm"
                            {...form.getInputProps('scriptContent')}
                        />


                    </>

                }
            </form>
        </Box>
    );
});


PhoneCallForm.displayName = "PhoneCallForm";
export default PhoneCallForm;
