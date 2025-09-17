"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Box,
    NumberInput,
    Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";

const WaitForm = forwardRef<childProps, ChildFormProps>(({ data, onSubmit }, ref) => {
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
            description: "",
            event: "",
            emailStep: "",
            unit: "",
            amount: 0,
        },
        validate: {
            name: (v) => (!v ? "Tên là bắt buộc" : null),
            event: (v) => (!v ? "Sự kiện là bắt buộc" : null),
            emailStep: (v) => (!v ? "Bước gửi email là bắt buộc" : null),
        },
    });
    return (
        <Box mx="auto">
            <form>
                {/* Tên */}
                <TextInput
                    label="Tên"
                    placeholder="Nhập tên hành động Wait"
                    withAsterisk
                    {...form.getInputProps("name")}
                />

                {/* Mô tả */}
                <Textarea
                    label="Mô tả"
                    rows={3}
                    placeholder="Nhập mô tả..."
                    mt="sm"
                    {...form.getInputProps('description')}
                />

                {/* Cấu hình hành động chờ */}
                <Box mt="lg">
                    <strong>Cấu hình hành động chờ</strong>
                    <div style={{ marginTop: 8 }}>Chờ cho đến khi</div>

                    <Select
                        mt="sm"
                        label="Sự kiện"
                        placeholder="Chọn sự kiện"
                        withAsterisk
                        data={[
                            { value: "event1", label: "Sự kiện 1" },
                            { value: "event2", label: "Sự kiện 2" },
                        ]}
                        {...form.getInputProps("event")}
                    />

                    <Select
                        mt="sm"
                        label="Bước gửi email"
                        placeholder="Chọn bước gửi email"
                        withAsterisk
                        data={[
                            { value: "step1", label: "Bước 1" },
                            { value: "step2", label: "Bước 2" },
                        ]}
                        {...form.getInputProps("emailStep")}
                    />
                </Box>

                {/* Thời gian chờ tối đa */}
                <Box mt="lg">
                    <strong>Thời gian chờ tối đa</strong>
                    <Group mt="sm" grow>
                        <Select
                            label="Đơn vị"
                            placeholder="Chọn đơn vị"
                            data={[
                                { value: "minutes", label: "Phút" },
                                { value: "hours", label: "Giờ" },
                                { value: "days", label: "Ngày" },
                            ]}
                            {...form.getInputProps("unit")}
                        />

                        <NumberInput
                            label="Số lượng"
                            placeholder="Nhập số lượng"
                            min={1}
                            {...form.getInputProps("amount")}
                        />
                    </Group>
                </Box>

                <button type="submit" hidden />
            </form>
        </Box>
    );
});


WaitForm.displayName = "WaitForm";
export default WaitForm;
