"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Radio,
    Text,
    Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";

const LoopForm = forwardRef<childProps, ChildFormProps>(({ onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
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
            list: "",
            direction: "asc", // asc: từ đầu đến cuối, desc: từ cuối đến đầu
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            list: (value) => (!value ? "Vui lòng chọn danh sách cần lặp" : null),
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

                {/* Mô tả */}
                <Textarea
                    label={
                        <span className="text-black">
                            Mô tả
                        </span>
                    }
                    placeholder="Nhập mô tả hành động Loop"
                    {...form.getInputProps("description")}
                    value={desc}
                    onChange={(e) => {
                        setDesc(e.currentTarget.value);
                        form.setFieldValue("description", e.currentTarget.value);
                    }}
                    rightSection={
                        <Text size="xs" c="dimmed">
                            {desc.length}/{maxDescLength}
                        </Text>
                    }
                    rightSectionWidth={80}
                    autosize
                    minRows={3}
                    maxLength={maxDescLength}
                    mb="md"
                />

                {/* Danh sách cần lặp */}
                <Select
                    label={
                        <span className="text-black">
                            Danh sách cần lặp
                        </span>
                    }
                    placeholder="Chọn danh sách cần lặp"
                    data={[
                        { value: "list1", label: "Danh sách 1" },
                        { value: "list2", label: "Danh sách 2" },
                    ]}
                    {...form.getInputProps("list")}
                    withAsterisk
                    mb="md"
                />

                {/* Hướng lặp */}
                <Radio.Group
                    label={
                        <span className="text-black">
                            Hướng lặp
                        </span>
                    }
                    {...form.getInputProps("direction")}
                    withAsterisk
                    mb="lg"
                >
                    <Radio className="text-black mb-[10px]" value="asc" label="Từ bản ghi đầu đến bản ghi cuối" />
                    <Radio className="text-black" value="desc" label="Từ bản ghi cuối tới bản ghi đầu" />
                </Radio.Group>

                <button type="submit" hidden />
            </form>
        </Box>
    );
});


LoopForm.displayName = "LoopForm";
export default LoopForm;
