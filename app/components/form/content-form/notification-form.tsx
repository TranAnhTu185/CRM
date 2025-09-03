"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import {
    TextInput,
    Textarea,
    Select,
    Text,
    Box, Divider,
    TagsInput,
    Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ChildFormProps, childProps } from "@/app/types/consts";
import { Link, RichTextEditor } from "@mantine/tiptap";
import StarterKit from "@tiptap/starter-kit";
import { useEditor } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import '@mantine/core/styles.css';
// ‼️ import tiptap styles after core package styles
import '@mantine/tiptap/styles.css';
import { IconFileZip } from "@tabler/icons-react";

const NotificationForm = forwardRef<childProps, ChildFormProps>(({ onSubmit }, ref) => {
    const maxNameLength = 255;
    const maxDescLength = 1000;

    const icon = <IconFileZip size={18} stroke={1.5} />;
    const [name, setName] = useState("");
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
            typeNoti: "1",
            typeNguoiGui: "1",
            nguoiGui: "",
            nguoiNhan: [],
            nguoiKhongNhan: [],
            typeThongbao: "1",
            titleNoti: "",
            typeTextContent: "1",
            typeContent: "1",
            body: "",
            typeRoute: "1",
            page: [],

        },
        validate: {
            name: (value) =>
                value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            // from: (value) =>
            //     value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            // emailSubject: (value) =>
            //     value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            // textType: (value) =>
            //     value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,
            // emailContent: (value) =>
            //     value.trim().length < 2 ? "Tên hành động phải tối thiểu 2 ký tự" : null,

        },
    });
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        immediatelyRender: false,
        onUpdate({ editor }) {
            form.setFieldValue('body', editor.getHTML());
        },
        content: form.values.body, // Initialize editor with form value
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
                {/*Description*/}
                <Textarea
                    label="Mô tả"
                    rows={3}
                    placeholder="Nhập mô tả..."
                    mt="sm"
                    {...form.getInputProps('description')}
                />
                <Divider my="sm" />
                <Title order={3} mb="md">
                    Cấu hình thông báo
                </Title>
                 <span>Sử dụng các giá trị từ các bước trước để thiết lập đầu vào cho hành động gửi thông báo. Để sử dụng kết quả của hành động này ở các bước sau, lưu chúng vào các biến.</span>

                {/* Loại thông báo     */}
                <Select
                    required
                    label="Loại thông báo"
                    placeholder="Chọn..."
                    mt="sm"
                    withAsterisk
                    data={[
                        { value: "1", label: 'In App' },
                        { value: "2", label: 'All' },
                    ]}
                    {...form.getInputProps('typeNoti')}
                />

                {/*Người gửi*/}
                <Select
                    required
                    label="Người gửi"
                    placeholder="Chọn người gửi..."
                    mt="sm"
                    data={[
                        { value: "1", label: 'Ông A' },
                        { value: "2", label: 'Bà B' },
                    ]}
                    {...form.getInputProps('typeNguoiGui')}
                    withAsterisk
                />

                {/*Người nhận*/}
                <TagsInput
                    required
                    label="Người nhận"
                    placeholder="Nhập nhân sự nhận thông báo"
                    maxTags={3}
                    defaultValue={[]}
                    withAsterisk
                    mt="sm"
                    {...form.getInputProps('nguoiNhan')} />

                {/*Người không nhận thông báo*/}
                <TagsInput
                    required
                    label="Loại bỏ những người này ra khỏi danh sách nhận thông báo"
                    placeholder="Nhập nhân sự không nhận thông báo"
                    maxTags={3}
                    defaultValue={[]}
                    withAsterisk
                    mt="sm"
                    {...form.getInputProps('nguoiKhongNhan')} />

                {/*Kiểu thông báo*/}
                <Select
                    required
                    label="Kiểu thông báo"
                    placeholder="Chọn..."
                    mt="sm"
                    data={[
                        { value: "1", label: 'Đơn giản' },
                        { value: "2", label: 'Đầy đủ' },
                    ]}
                    {...form.getInputProps('typeThongbao')}
                    withAsterisk
                />

                {/*Tiêu đề thông báo*/}
                <TextInput
                    required
                    label="Tiêu đề thông báo"
                    placeholder="Nhập..."
                    withAsterisk
                    mt="sm"
                    {...form.getInputProps('titleNoti')}
                />

                {/*loại văn bản*/}
                <Select
                    required
                    label="Loại văn bản"
                    placeholder="Chọn..."
                    mt="sm"
                    withAsterisk
                    data={[
                        { value: "1", label: 'Văn bản có định dạng' },
                        { value: "2", label: 'Văn bản thuần' },
                    ]}
                    {...form.getInputProps('typeTextContent')}
                />

                {/*Nội dung email*/}
                <Select
                    required
                    label="Nội dung thông báo"
                    placeholder="Chọn..."
                    mt="sm"
                    withAsterisk
                    data={[
                        { value: "1", label: 'Nhập nội dung thủ công' },
                        { value: "2", label: 'Sử dụng mẫu văn bản' },
                        { value: "3", label: 'Sử dụng tài nguyên hoặc biến khác' },
                    ]}
                    {...form.getInputProps('typeContent')}
                />

                {form.values.typeContent === "1" && <RichTextEditor mt="sm" {...form.getInputProps('body')} editor={editor}
                    styles={{
                        content: {
                            minHeight: 200,   // Chiều cao ban đầu (px)
                        },
                    }}
                >
                    <RichTextEditor.Toolbar>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Undo />
                            <RichTextEditor.Redo />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content />
                </RichTextEditor>
                }

                {/*Kiểu điều hướng*/}
                <Select
                    required
                    label="Kiểu điều hướng"
                    placeholder="Chọn..."
                    mt="sm"
                    withAsterisk
                    data={[
                        { value: "1", label: 'Chuyển hướng tới URL' },
                        { value: "2", label: 'Chuyển hướng tới URL' },
                    ]}
                    {...form.getInputProps('typeRoute')}
                />


                 {/* Trang chi tiết điều hướng */}
                <TagsInput
                    required
                    label="Trang chi tiết điều hướng"
                    placeholder="Nhập..."
                    maxTags={3}
                    defaultValue={[]}
                    withAsterisk
                    mt="sm"
                    {...form.getInputProps('page')} />


            </form>
        </Box>
    );
});


NotificationForm.displayName = "NotificationForm";
export default NotificationForm;
