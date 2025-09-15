"use client";

import { forwardRef, use, useEffect, useImperativeHandle, useState } from "react";
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

const LoopForm = forwardRef<childProps, ChildFormProps>(({ data, onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;

    const initData = () => {
        if (data && data.info) {
            form.setValues({
                name: data.info.name,
                description: data.info.description,
                list: data.info.list,
                direction: data.info.direction,
            });
        }
    }

    useEffect(() => {
        initData();
    }, [data])
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
                    value={form.values.name}
                    onChange={(e) => {
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

                {/* Mô tả */}
                <Textarea
                    label={
                        <span className="text-black">
                            Mô tả
                        </span>
                    }
                    placeholder="Nhập mô tả hành động Loop"
                    {...form.getInputProps("description")}
                    value={form.values.description}
                    onChange={(e) => {
                        form.setFieldValue("description", e.currentTarget.value);
                    }}
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
                    value={form.values.list}
                    onChange={(e) => {
                        form.setFieldValue("list", e);
                    }}
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
                    <Radio onClick={() => form.setFieldValue("direction", "asc")} className="text-black mb-[10px]" value="asc" label="Từ bản ghi đầu đến bản ghi cuối" />
                    <Radio onClick={() => form.setFieldValue("direction", "desc")} className="text-black" value="desc" label="Từ bản ghi cuối tới bản ghi đầu" />
                </Radio.Group>

                <button type="submit" hidden />
            </form>
        </Box>
    );
});


LoopForm.displayName = "LoopForm";
export default LoopForm;
