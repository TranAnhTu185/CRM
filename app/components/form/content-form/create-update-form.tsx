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
    Button,
    Checkbox,
    Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import '@mantine/core/styles.css';
// ‼️ import tiptap styles after core package styles
import '@mantine/tiptap/styles.css';

const CreateUpdateRecordForm = forwardRef<childProps, ChildFormProps>(({ onSubmit }, ref) => {
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
            action: "create", // "create" | "update"
            name: "",
            description: "",
            object: "",
            valueSetup: "",
            saveVariable: "",
            updateVariable: "",
            handleDuplicate: false,
        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,

        },
    });


    return (
        <Box mx="auto">
            <form>
                {/* Chọn hành động */}
                <Radio.Group
                    {...form.getInputProps("action")}
                    styles={{ root: { display: "flex", gap: 24, marginBottom: 20 } }}
                >
                    <Group mt="xs">
                        <Radio
                            value="create"
                            label={
                                <Box>
                                    <Text fw={600}>Create Record</Text>
                                    <Text size="sm" c="dimmed">
                                        Cho phép tự động tạo bản ghi của một đối tượng và sử dụng bản ghi
                                        đó trong các bước tiếp theo của quy trình.
                                    </Text>
                                </Box>
                            }
                        />
                        <Radio
                            value="update"
                            label={
                                <Box>
                                    <Text fw={600}>Update Record</Text>
                                    <Text size="sm" c="dimmed">
                                        Cho phép tự động cập nhật dữ liệu bản ghi của một đối tượng và sử
                                        dụng bản ghi đó trong các bước tiếp theo của quy trình.
                                    </Text>
                                </Box>
                            }
                        />
                    </Group>
                </Radio.Group>
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

                {/* Phần hướng dẫn */}
                <Box
                    mt="lg"
                    p="sm"
                    style={{
                        background: "#f8f9fa",
                        borderRadius: 8,
                        fontSize: 14,
                    }}
                >
                    {form.values.action === "create" ? "Chọn cách thiết lập giá trị cho bản ghi, đối tượng tạo bản ghi mới và biến sử dụng để lưu bản ghi được tạo mới." : "Chọn cách thiết lập giá trị cho bản ghi, đối tượng cập nhật bản ghi và bản ghi sẽ cập nhật."}
                </Box>

                {/* Chọn đối tượng */}
                <Select
                    withAsterisk
                    mt="md"
                    label="Đối tượng"
                    placeholder="Chọn đối tượng"
                    data={[
                        { value: "user", label: "Người dùng" },
                        { value: "order", label: "Đơn hàng" },
                        { value: "product", label: "Sản phẩm" },
                    ]}
                    {...form.getInputProps("object")}
                />

                {/* Cách thiết lập giá trị */}
                <Select
                    withAsterisk
                    mt="lg"
                    label="Cách thiết lập giá trị cho trường của bản ghi"
                    placeholder="Tự chọn hoặc nhập giá trị cho các trường"
                    data={[
                        { value: "manual", label: "Nhập giá trị thủ công" },
                        { value: "variable", label: "Gán từ biến" },
                    ]}
                    {...form.getInputProps("valueSetup")}
                />

                {/* Cấu hình giá trị */}
                <Box
                    mt="md"
                    p="sm"
                    style={{
                        background: "#f1f3f5",
                        borderRadius: 8,
                        fontSize: 14,
                    }}
                >
                    Thiết lập giá trị cho từng trường của bản ghi. Hãy gán giá trị cho các
                    trường bắt buộc để đảm bảo tạo mới thành công.
                </Box>

                <Button variant="light" mt="sm" disabled={!form.values.object}>
                    Thiết lập bản ghi
                </Button>

                {/* Biến lưu bản ghi */}
                {form.values.action === "create" && (
                    <div>
                        <Select
                            mt="lg"
                            label="Biến lưu bản ghi"
                            placeholder="Chọn biến lưu bản ghi"
                            data={[
                                { value: "varUser", label: "Biến người dùng" },
                                { value: "varOrder", label: "Biến đơn hàng" },
                            ]}
                            {...form.getInputProps("saveVariable")}
                        />
                        <Checkbox
                            mt="lg"
                            label="Xử lý bản ghi trùng lặp"
                            {...form.getInputProps("handleDuplicate", { type: "checkbox" })}
                        />
                    </div>
                )}


                {/* Biến cập nhật bản ghi */}
                {form.values.action === "update" && <Select
                    mt="lg"
                    label="Biến cập nhật bản ghi"
                    placeholder="Chọn biến cập nhật bản ghi"
                    data={[
                        { value: "varUser", label: "Biến người dùng" },
                        { value: "varOrder", label: "Biến đơn hàng" },
                    ]}
                    {...form.getInputProps("updateVariable")}
                />
                }
            </form>
        </Box>
    );
});


CreateUpdateRecordForm.displayName = "CreateUpdateRecordForm";
export default CreateUpdateRecordForm;
