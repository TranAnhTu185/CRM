"use client";

import { forwardRef, useImperativeHandle } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    FileInput,
    Radio,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
// ‼️ import tiptap styles after core package styles
import '@mantine/tiptap/styles.css';
import { IconFileZip, IconPlus, IconTrash } from "@tabler/icons-react";

const PhoneCallForm = forwardRef<childProps, ChildFormProps>(({ onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;
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
            description: "",
            from: "",
            to: "",
            audioType: "file", // "file" | "script"
            file: null as File | null,
            script: "",
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,

        },
    });


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
                    onChange={(e) => {
                        // setName(e.currentTarget.value);
                        form.setFieldValue("name", e.currentTarget.value);
                    }}
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
                {/*Description*/}
                <Textarea
                    label="Mô tả"
                    rows={3}
                    placeholder="Nhập mô tả..."
                    mt="sm"
                    {...form.getInputProps('description')}
                />
                <Divider my="sm" />

                <Text fw={600} mb="md">
                    Cấu hình gọi điện
                </Text>

                {/* From */}
                <Select
                    label="From"
                    placeholder="Chọn số điện thoại tổng đài"
                    withAsterisk
                    data={[
                        { value: "19001000", label: "1900 1000" },
                        { value: "02873000000", label: "028 7300 0000" },
                    ]}
                    {...form.getInputProps("from")}
                />

                {/* To */}
                <TextInput
                    mt="md"
                    label="To"
                    placeholder="Nhập số điện thoại người nhận"
                    withAsterisk
                    {...form.getInputProps("to")}
                    rightSection={<Text c="blue">{`{ }`}</Text>}
                />

                {/* Nội dung âm thanh */}
                <Box mt="lg">
                    <Text fw={500} mb="xs">
                        Nội dung âm thanh
                    </Text>
                    <Radio.Group {...form.getInputProps("audioType")}>
                        <Radio value="file" label="Sử dụng file ghi âm"  className="my-[10px]"/>
                        <Radio value="script" label="Sử dụng nội dung kịch bản"  className="my-[10px]"/>
                    </Radio.Group>

                    {/* Nếu chọn file */}
                    {form.values.audioType === "file" && (
                        <FileInput
                            mt="md"
                            label="File ghi âm"
                            placeholder="Chọn tệp tin từ máy hoặc kéo thả vào đây"
                            withAsterisk
                            {...form.getInputProps("file")}
                        />
                    )}

                    {/* Nếu chọn script */}
                    {form.values.audioType === "script" && (
                        <TextInput
                            mt="md"
                            label="Nội dung kịch bản"
                            placeholder="Nhập nội dung kịch bản"
                            withAsterisk
                            {...form.getInputProps("script")}
                        />
                    )}
                </Box>
            </form>
        </Box>
    );
});


PhoneCallForm.displayName = "PhoneCallForm";
export default PhoneCallForm;
