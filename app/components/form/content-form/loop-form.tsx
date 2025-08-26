"use client";

import { useEffect, useRef, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Radio,
    Group,
    Button,
    Text,
    Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { childProps } from "@/app/types/consts";

export default function LoopForm({submitTrigger, onSubmit}: childProps) {
    const maxNameLength = 255;
    const maxDescLength = 1000;

    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const formRef = useRef<HTMLFormElement>(null);
    useEffect(() => {
        if(submitTrigger) {
            formRef.current?.requestSubmit();
        }
    }, [submitTrigger])
    const form = useForm({
        initialValues: {
            name: "",
            slug: "",
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget as HTMLFormElement);
        onSubmit(Object.fromEntries(data.entries()));
    };

    return (
        <Box mx="auto">
            <form ref={formRef} onSubmit={handleSubmit}>
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

                <button type="submit" hidden/>
            </form>
        </Box>
    );
}
