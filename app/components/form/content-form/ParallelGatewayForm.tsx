'use client';

import {
    Box,
    Text,
    Grid,
    Paper,
    Radio,
    Group,
    TextInput,
    Textarea,
    Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconInfoCircle } from '@tabler/icons-react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ChildFormProps, childProps } from '@/app/types/consts';

type Mode = 'open' | 'close';

const ParallelgatewayForm = forwardRef<childProps, ChildFormProps>(({ dataItem, onSubmit }, ref) => {
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
        if (dataItem && dataItem.info) {
            form.setValues({
                mode: dataItem.info.mode,
                name: dataItem.info.name,
                description: dataItem.info.description,
            });
        }
    }

    useEffect(() => {
        initData();
    }, [dataItem])

    const form = useForm({
        mode: 'controlled',
        initialValues: {
            mode: 'open' as Mode,
            name: '',
            description: '',
        },
        validate: {
            name: (value) => {
                const val = value.trim();
                if (val.length < 2) return "Tên hành động phải tối thiểu 2 ký tự";
                if (val.length > 255) return 'Tên tối đa 255 ký tự';
                return null;
            },
            description: (value) => value.trim().length > 1000 ? "mô tả tối đa 1000 ký tự" : null,
        },
    });

    return (
        <Box mx="auto">
            <form>
                <Alert
                    radius="md"
                    variant="light"
                    color="indigo"
                    icon={<IconInfoCircle size={18} />}
                    mb="md"
                >
                    Loại Đóng/ Mở của Parallel Gateway không thể sửa sau khi tạo thành công
                </Alert>

                <Grid gutter="md" mb="lg">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper
                            withBorder
                            radius="lg"
                            p="md"
                            component="label"
                            style={{
                                cursor: 'pointer',
                                borderColor: form.values.mode === 'open' ? 'var(--mantine-color-indigo-5)' : undefined,
                            }}
                        >
                            <Group justify="space-between" align="flex-start">
                                <div>
                                    <Text fw={600} mb={4}>
                                        Mở
                                    </Text>
                                    <Text c="dimmed" size="sm">
                                        Cho phép duy nhất 1 đầu vào Parallel Gateway và nhiều đầu ra tương ứng với các nhánh.
                                    </Text>
                                </div>
                                <Radio
                                    name="mode"
                                    value="open"
                                    checked={form.values.mode === 'open'}
                                    onChange={() => form.setFieldValue('mode', 'open')}
                                />
                            </Group>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Paper
                            withBorder
                            radius="lg"
                            p="md"
                            component="label"
                            style={{
                                cursor: 'pointer',
                                borderColor: form.values.mode === 'close' ? 'var(--mantine-color-indigo-5)' : undefined,
                            }}
                        >
                            <Group justify="space-between" align="flex-start">
                                <div>
                                    <Text fw={600} mb={4}>
                                        Đóng
                                    </Text>
                                    <Text c="dimmed" size="sm">
                                        Cho phép gộp nhiều đầu vào thành một đầu ra duy nhất, không có sự phân nhánh.
                                    </Text>
                                </div>
                                <Radio
                                    name="mode"
                                    value="close"
                                    checked={form.values.mode === 'close'}
                                    onChange={() => form.setFieldValue('mode', 'close')}
                                />
                            </Group>
                        </Paper>
                    </Grid.Col>
                </Grid>
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

                {/* Mô tả */}
                <Textarea
                    label={
                        <span className="text-black">
                            Mô tả
                        </span>
                    }
                    placeholder="Nhập mô tả "
                    {...form.getInputProps("description")}
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

                <button type="submit" hidden />
            </form>
        </Box>
    );
});


ParallelgatewayForm.displayName = "ParallelgatewayForm";
export default ParallelgatewayForm;

