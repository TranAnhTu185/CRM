"use client";

import { forwardRef, useImperativeHandle } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    Group,
    Button,
    ActionIcon,
    Radio,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import { IconPlus, IconTrash } from "@tabler/icons-react";

const GetRecordForm = forwardRef<childProps, ChildFormProps>(({ onSubmit }, ref) => {
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
            object: "",
            logic: "and",
            conditions: [] as {
                id: string;
                field: string;
                operator: string;
                value: string;
            }[],
            sortings: [] as { id: string; field: string; order: string }[],
            saveType: "first", // first | all
            saveVar: "",
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,

        },
    });

    const updateDataItemForm = (
        groupIndex: number,
        fieldP: string,
        field: string,
        value: any
    ) => {
        const dataSet = form.values[fieldP][groupIndex];
        dataSet[field] = value;
        form.setFieldValue(`${fieldP}.${groupIndex}`, dataSet);
    };


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

                {/* Title */}
                <Text fw={500} mb="sm">
                    Xác định đối tượng để truy xuất bản ghi từ hành động Get record.
                </Text>

                {/* Đối tượng */}
                <Select
                    label="Đối tượng"
                    placeholder="Chọn đối tượng"
                    withAsterisk
                    data={[
                        { value: "user", label: "Người dùng" },
                        { value: "order", label: "Đơn hàng" },
                        { value: "product", label: "Sản phẩm" },
                    ]}
                    {...form.getInputProps("object")}
                />

                {/* Điều kiện lọc */}
                <Box mt="lg">
                    <Text fw={500} mb="xs">
                        Điều kiện lọc bản ghi
                    </Text>
                    <Text size="sm" c="dimmed">
                        Thêm các tiêu chí để tìm kiếm bản ghi. Nếu không lọc, Workflow sẽ truy
                        xuất toàn bộ bản ghi của đối tượng được chọn.
                    </Text>

                    {/* Logic */}
                    <Select
                        mt="md"
                        label="Logic kết hợp các điều kiện lọc"
                        data={[
                            { value: "and", label: "Thỏa mãn tất cả các điều kiện (AND)" },
                            { value: "or", label: "Thỏa mãn 1 trong các điều kiện (OR)" },
                        ]}
                        {...form.getInputProps("logic")}
                    />

                    {/* Conditions list */}
                    <Box mt="md">
                        {form.values.conditions.map((cond, index) => (
                            <Group key={cond.id} mt="xs" grow>
                                <Select
                                    placeholder="Trường"
                                    data={[
                                        { value: "name", label: "Tên" },
                                        { value: "email", label: "Email" },
                                        { value: "phone", label: "Số điện thoại" },
                                    ]}
                                    value={cond.field || ""}
                                    onChange={(val) => updateDataItemForm(index, "conditions", "field", val || "")}
                                />

                                <Select
                                    placeholder="Điều kiện"
                                    data={[
                                        { value: "eq", label: "=" },
                                        { value: "neq", label: "≠" },
                                        { value: "contains", label: "Chứa" },
                                    ]}
                                    value={cond.operator || ""}
                                    onChange={(val) => updateDataItemForm(index, "conditions", "operator", val || "")}
                                />

                                <TextInput
                                    placeholder="Giá trị"
                                    {...form.getInputProps(`conditions.${index}.value`)}
                                />

                                <ActionIcon
                                    color="red"
                                    onClick={() => form.removeListItem("conditions", index)}
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Group>
                        ))}

                        <Button
                            mt="sm"
                            variant="light"
                            leftSection={<IconPlus size={16} />}
                            onClick={() =>
                                form.insertListItem("conditions", {
                                    id: crypto.randomUUID(),
                                    field: "",
                                    operator: "",
                                    value: "",
                                })
                            }
                        >
                            Thêm điều kiện
                        </Button>
                    </Box>
                </Box>

                {/* ... ở đây giữ nguyên phần Điều kiện lọc bản ghi như mình viết trước */}

                <Divider my="lg" />

                {/* Sắp xếp danh sách bản ghi */}
                <Box>
                    <Text fw={500} mb="xs">
                        Sắp xếp danh sách bản ghi
                    </Text>
                    <Text size="sm" c="dimmed">
                        Sắp xếp thứ tự các bản ghi được tìm thấy dựa vào các trường. Có thể
                        sắp xếp theo tối đa 3 trường.
                    </Text>

                    {form.values.sortings.map((sort, index) => (
                        <Group key={sort.id} mt="xs" grow>
                            <Select
                                placeholder="Chọn trường sắp xếp"
                                data={[
                                    { value: "name", label: "Tên" },
                                    { value: "email", label: "Email" },
                                    { value: "createdAt", label: "Ngày tạo" },
                                ]}
                                value={sort.field || ""}
                                onChange={(val) => updateDataItemForm(index, "sortings", "field", val || "")}
                            />
                            <Select
                                placeholder="Chọn thứ tự"
                                data={[
                                    { value: "asc", label: "Tăng dần (ASC)" },
                                    { value: "desc", label: "Giảm dần (DESC)" },
                                ]}
                                value={sort.order || ""}
                                onChange={(val) => updateDataItemForm(index, "sortings", "order", val || "")}
                            />
                            <ActionIcon
                                color="red"
                                onClick={() => form.removeListItem("sortings", index)}
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Group>
                    ))}

                    {form.values.sortings.length < 3 && (
                        <Button
                            mt="sm"
                            variant="light"
                            leftSection={<IconPlus size={16} />}
                            onClick={() =>
                                form.insertListItem("sortings", {
                                    id: crypto.randomUUID(),
                                    field: "",
                                    order: "",
                                })
                            }
                        >
                            Thêm dòng
                        </Button>
                    )}
                </Box>

                <Divider my="lg" />

                {/* Lưu bản ghi */}
                <Box>
                    <Text fw={500} mb="xs">
                        Xác định cách lưu bản ghi và chọn biến để lưu trữ chúng.
                    </Text>
                    <Radio.Group {...form.getInputProps("saveType")}>
                        <Radio value="first" label="Chỉ bản ghi đầu tiên" className="my-[10px]" />
                        <Radio value="all" label="Tất cả bản ghi" className="my-[10px]" />
                    </Radio.Group>

                    <Select
                        mt="md"
                        label="Biến lưu bản ghi"
                        placeholder="Chọn biến lưu bản ghi"
                        data={[
                            { value: "var1", label: "Biến 1" },
                            { value: "var2", label: "Biến 2" },
                        ]}
                        {...form.getInputProps("saveVar")}
                    />
                </Box>

            </form>
        </Box>
    );
});


GetRecordForm.displayName = "GetRecordForm";
export default GetRecordForm;
